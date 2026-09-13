import express from 'express';
import path from 'path';
import { timingSafeEqual } from 'crypto';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { registerLiveMapRoutes } from './server/liveMapRoutes';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3000);

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://nllkmunqdkznhnhfrric.supabase.co';
const SUPABASE_PUBLISHABLE_KEY =
  process.env.SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_sEfaduAFppFtdtm5tEAerA_bcpMpbKF';
const ADMIN_LOGIN_ID = process.env.ADMIN_LOGIN_ID?.trim() || 'nirnay-admin';
const ADMIN_LOGIN_EMAIL = process.env.ADMIN_LOGIN_EMAIL?.trim().toLowerCase() || '';

const supabaseAuth = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

app.disable('x-powered-by');
app.use(express.json({ limit: '256kb' }));

function createRateLimiter(windowMs: number, maxRequests: number): express.RequestHandler {
  const buckets = new Map<string, { count: number; resetAt: number }>();
  return (req, res, next) => {
    const now = Date.now();
    const key = req.ip || req.socket.remoteAddress || 'unknown';
    const existing = buckets.get(key);
    if (!existing || existing.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }
    if (existing.count >= maxRequests) {
      res.setHeader('Retry-After', String(Math.ceil((existing.resetAt - now) / 1000)));
      return res.status(429).json({ error: 'Too many requests. Please retry shortly.' });
    }
    existing.count += 1;
    if (buckets.size > 5000) {
      for (const [bucketKey, bucket] of buckets) {
        if (bucket.resetAt <= now) buckets.delete(bucketKey);
      }
    }
    return next();
  };
}

const aiRateLimit = createRateLimiter(60_000, 24);
const adminLoginRateLimit = createRateLimiter(15 * 60_000, 8);
app.use('/api/ai', aiRateLimit);
registerLiveMapRoutes(app);

let geminiClient: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return geminiClient;
}

function getBearerToken(req: express.Request): string | null {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return null;
  return header.slice('Bearer '.length).trim() || null;
}

async function getAuthenticatedUser(req: express.Request) {
  const token = getBearerToken(req);
  if (!token) return null;
  const { data, error } = await supabaseAuth.auth.getUser(token);
  if (error || !data.user) return null;
  return { user: data.user, token };
}

function createUserScopedClient(token: string) {
  return createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

function constantTimeEqual(a: string, b: string) {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);
  if (aBuffer.length !== bBuffer.length) return false;
  return timingSafeEqual(aBuffer, bBuffer);
}

const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  hi: 'Hindi',
  bn: 'Bengali',
  mr: 'Marathi',
  ta: 'Tamil',
  te: 'Telugu',
  kn: 'Kannada',
  gu: 'Gujarati',
  pa: 'Punjabi',
};

const TTS_LANGUAGE_CODES: Record<string, string | undefined> = {
  en: 'en-IN',
  hi: 'hi-IN',
  bn: 'bn-IN',
  mr: 'mr-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  kn: 'kn-IN',
  gu: 'gu-IN',
  pa: undefined,
};

function pcmToWav(pcm: Buffer, sampleRate = 24000, channels = 1, bitsPerSample = 16) {
  const bytesPerSample = bitsPerSample / 8;
  const blockAlign = channels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write('data', 36);
  header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
}

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'NIRNAY AI Server',
    backend: 'Express + Supabase PostgreSQL',
    hasGeminiApiKey: Boolean(process.env.GEMINI_API_KEY),
    hasDataGovApiKey: Boolean(process.env.DATA_GOV_IN_API_KEY),
    hasSupabase: Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY),
    hasAdminIdLogin: Boolean(ADMIN_LOGIN_ID && ADMIN_LOGIN_EMAIL),
  });
});

app.get('/api/auth/me', async (req, res) => {
  const auth = await getAuthenticatedUser(req);
  if (!auth) return res.status(401).json({ authenticated: false });

  const scoped = createUserScopedClient(auth.token);
  const { data: profile, error } = await scoped
    .from('profiles')
    .select('id, display_name, email, phone, role, preferred_language')
    .eq('id', auth.user.id)
    .single();

  if (error || !profile) return res.status(403).json({ authenticated: true, profile: null });
  return res.json({ authenticated: true, profile });
});

/**
 * Single-admin ID/password login.
 * ADMIN_LOGIN_ID maps to exactly one Supabase admin email on the server. The
 * password is verified by Supabase Auth and is never stored in this repository.
 * PostgreSQL RLS/allowlist still decides whether the signed-in account is admin.
 */
app.post('/api/admin/login', adminLoginRateLimit, async (req, res) => {
  if (!ADMIN_LOGIN_EMAIL) {
    return res.status(503).json({ error: 'Admin ID login is not configured on the server.' });
  }

  const loginId = typeof req.body?.loginId === 'string' ? req.body.loginId.trim() : '';
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  if (!loginId || !password || password.length > 200) {
    return res.status(400).json({ error: 'Admin ID and password are required.' });
  }
  if (!constantTimeEqual(loginId, ADMIN_LOGIN_ID)) {
    return res.status(401).json({ error: 'Invalid admin ID or password.' });
  }

  const adminAuthClient = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  const { data, error } = await adminAuthClient.auth.signInWithPassword({
    email: ADMIN_LOGIN_EMAIL,
    password,
  });
  if (error || !data.session || !data.user) {
    return res.status(401).json({ error: 'Invalid admin ID or password.' });
  }

  const scoped = createUserScopedClient(data.session.access_token);
  const { data: profile, error: profileError } = await scoped
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single();
  if (profileError || profile?.role !== 'admin') {
    return res.status(403).json({ error: 'This account is not the authorised Nirnay AI administrator.' });
  }

  res.setHeader('Cache-Control', 'no-store');
  return res.json({
    accessToken: data.session.access_token,
    refreshToken: data.session.refresh_token,
    expiresAt: data.session.expires_at,
  });
});

app.post('/api/ai/analyze', async (req, res) => {
  const auth = await getAuthenticatedUser(req);
  const ai = getGemini();

  if (!auth) return res.json({ demoMode: true, isAiGenerated: false, requiresAuth: true });
  if (!ai || !process.env.GEMINI_API_KEY) {
    return res.json({ demoMode: true, isAiGenerated: false, requiresGeminiKey: true });
  }

  const formData = req.body;
  if (!formData || typeof formData !== 'object' || !formData.category || !formData.location) {
    return res.status(400).json({ error: 'A valid assessment payload is required.' });
  }

  try {
    const prompt = `You are NIRNAY AI, an expert rural and semi-urban micro-enterprise advisory and financial structuring engine for India (Smart India Hackathon 2026 Problem Statement SIH26091).

Analyze the proposed enterprise using the entrepreneur's actual resources, selected skill and exact district context.
Location: ${formData.location?.village || 'Not specified'}, ${formData.location?.block || 'Not specified'}, ${formData.location?.district || 'Not specified'} (${formData.location?.state || 'Not specified'})
Category: ${formData.category}
Idea: ${formData.businessIdea || formData.ideaText}
Selected expertise / skill: ${formData.selectedExpertise || 'Not specified'}
Prior experience: ${formData.priorExperience || 'Not specified'}
Available land: ${formData.availableLandAcres ?? 'Not specified'} acres
Margin capital available: ₹${formData.availableMargin || formData.marginCapital}
Target customers / local route: ${formData.targetMarket || 'Not specified'}
Risk tolerance: ${formData.riskWillingness || 'Not specified'}
Preferred language code: ${formData.preferredLanguage || 'en'}

Important reasoning rules:
1. Make the answer materially different for the selected district. Do not copy-paste geography-independent advice.
2. Consider urban/rural character, customer channels, supply access, service demand and entrepreneur skill without inventing precise official statistics.
3. If local evidence is uncertain, use qualitative wording and explicitly recommend local verification.
4. Give concrete skill-specific customer, operating, product/service and first-step guidance.
5. Never imply guaranteed scheme eligibility, subsidy, sanction, profit, demand or return.
6. Keep all user-facing strings in the language represented by preferred language code. JSON property names stay in English.

Return valid JSON only with this schema:
{
  "feasibilityScore": {"overallScore": number,"statusLabel": "string","marketPotential": number,"capitalFit": number,"competitionScore": number,"operationalFeasibility": number,"growthPotential": number},
  "recommendation": "string",
  "swot": {"strengths": ["string"],"weaknesses": ["string"],"opportunities": ["string"],"threats": ["string"]},
  "insights": [{"title": "string", "description": "string", "tag": "string"}],
  "localOpportunity": {"demandSignal": "string","competitorDensity": "string","marketGap": "string","recommendedRadius": "string","suggestedProductMix": ["string"]}
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });
    const parsed = JSON.parse(response.text || '{}');
    return res.json({ ...parsed, isAiGenerated: true });
  } catch (err) {
    console.error('Error generating AI analysis:', err);
    return res.json({ demoMode: true, isAiGenerated: false });
  }
});

app.post('/api/ai/chat', async (req, res) => {
  const auth = await getAuthenticatedUser(req);
  const ai = getGemini();

  if (!auth) return res.json({ demoMode: true, requiresAuth: true });
  if (!ai || !process.env.GEMINI_API_KEY) return res.json({ demoMode: true, requiresGeminiKey: true });

  const { question, context = {}, history = [] } = req.body as {
    question?: string;
    context?: Record<string, unknown>;
    history?: Array<{ role?: string; text?: string }>;
  };
  if (!question || typeof question !== 'string' || question.trim().length === 0) {
    return res.status(400).json({ error: 'Question is required.' });
  }
  if (question.length > 3000) return res.status(413).json({ error: 'Question is too long.' });

  const languageCode = typeof context.language === 'string' ? context.language : 'en';
  const languageName = LANGUAGE_NAMES[languageCode] || 'English';
  const safeHistory = Array.isArray(history)
    ? history
        .slice(-10)
        .filter((item) => item && (item.role === 'user' || item.role === 'assistant') && typeof item.text === 'string')
        .map((item) => `${item.role === 'user' ? 'Entrepreneur' : 'NIRNAY AI'}: ${String(item.text).slice(0, 1200)}`)
        .join('\n')
    : '';

  try {
    const prompt = `You are NIRNAY AI, a practical decision-support copilot for rural and semi-urban micro-entrepreneurs in India.

ENTREPRENEUR CONTEXT
Business: ${String(context.businessIdea || 'Not specified')}
Category: ${String(context.category || 'Not specified')}
District: ${String(context.district || 'Not specified')}
State: ${String(context.state || 'Not specified')}
Selected skill: ${String(context.skill || 'Not specified')}
Experience: ${String(context.experience || 'Not specified')}
Available land: ${context.landAcres ?? 'Not specified'} acres
Available margin: ₹${context.margin ?? 'Not specified'}
Estimated project cost: ₹${context.projectCost ?? 'Not specified'}
Estimated loan requirement: ₹${context.loan ?? 'Not specified'}
Current financing planning route: ${String(context.scheme || 'Not specified')}
Risk preference: ${String(context.risk || 'Not specified')}
Target market / customer route: ${String(context.targetMarket || 'Not specified')}
WEBSITE-SELECTED LANGUAGE: ${languageName} (${languageCode})

RECENT CONVERSATION
${safeHistory || 'No previous turns.'}

CURRENT QUESTION
${question.trim()}

RESPONSE RULES
1. The WEBSITE-SELECTED LANGUAGE is mandatory. Reply entirely in ${languageName}, even if the question is typed in another language, unless the user explicitly requests a different response language.
2. Use native script and natural vocabulary of ${languageName}; keep unavoidable names/acronyms such as NIRNAY AI, EMI, UPI, FSSAI, GST or Udyam where appropriate.
3. Be district-aware and skill-aware, but never invent precise local statistics.
4. Never invent official scheme benefits, interest rates, eligibility thresholds, subsidy percentages, deadlines or approvals.
5. Never promise loan sanction, subsidy, profit, demand or returns. Call financial outputs estimates/planning routes.
6. Prefer concrete next actions: customer validation, pricing test, supplier checks, working-capital reserve, licences and official scheme verification.
7. Use prior turns so follow-ups stay connected.
8. If the user asks what NIRNAY AI is, explain the whole platform in ${languageName}: profile inputs, business recommendations, finance planning, scheme verification guidance, live map/weather/mandi signals, multilingual text/voice, Supabase security and limitations.
9. Normally answer in 180–320 words; shorter for simple questions.

Return JSON only:
{"answer":"string","followUps":["3 short follow-up questions in the same selected language"],"confidenceNote":"one short sentence in the same selected language"}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });
    const parsed = JSON.parse(response.text || '{}') as { answer?: string; followUps?: string[]; confidenceNote?: string };
    if (!parsed.answer) throw new Error('Gemini returned an empty chat answer.');

    return res.json({
      answer: parsed.answer,
      followUps: Array.isArray(parsed.followUps) ? parsed.followUps.slice(0, 4) : [],
      confidenceNote: parsed.confidenceNote || '',
      sources: [
        'NIRNAY AI advisory context',
        context.district ? `Entrepreneur profile: ${String(context.district)}` : 'Entrepreneur profile',
      ],
    });
  } catch (err) {
    console.error('Error in chat:', err);
    return res.json({ demoMode: true });
  }
});

app.post('/api/ai/tts', async (req, res) => {
  const auth = await getAuthenticatedUser(req);
  const ai = getGemini();
  if (!auth) return res.status(401).json({ error: 'Authentication required for AI voice.' });
  if (!ai || !process.env.GEMINI_API_KEY) {
    return res.status(503).json({ error: 'AI voice is unavailable because Gemini is not configured.' });
  }

  const text = typeof req.body?.text === 'string' ? req.body.text.trim() : '';
  const language = typeof req.body?.language === 'string' ? req.body.language : 'en';
  if (!text) return res.status(400).json({ error: 'Text is required.' });
  if (text.length > 4200) return res.status(413).json({ error: 'Voice text is too long.' });

  const languageName = LANGUAGE_NAMES[language] || 'English';
  const languageCode = TTS_LANGUAGE_CODES[language];
  const speechConfig: Record<string, unknown> = {
    voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
  };
  if (languageCode) speechConfig.languageCode = languageCode;

  try {
    const ttsPrompt = `Speak naturally, clearly and warmly in ${languageName}. Read only the answer below. Do not add commentary, summarize, or translate it into English. Preserve the selected language, numbers and rupee amounts.\n\n${text}`;
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-tts-preview',
      contents: [{ parts: [{ text: ttsPrompt }] }],
      config: { responseModalities: ['AUDIO'], speechConfig } as any,
    });
    const audioPart = response.candidates?.[0]?.content?.parts?.find((part: any) => Boolean(part?.inlineData?.data)) as any;
    const base64Audio = audioPart?.inlineData?.data;
    if (!base64Audio) throw new Error('Gemini TTS returned no audio data.');

    const wav = pcmToWav(Buffer.from(base64Audio, 'base64'));
    res.setHeader('Content-Type', 'audio/wav');
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Nirnay-Voice-Engine', 'gemini-3.1-flash-tts-preview');
    return res.send(wav);
  } catch (err) {
    console.error('Error generating multilingual AI voice:', err);
    return res.status(502).json({ error: 'AI voice generation failed.' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  } else {
    // Only the Vite client bundle is publicly served. The server bundle lives in
    // dist-server and is never exposed by express.static().
    const clientDistPath = path.join(process.cwd(), 'dist', 'client');
    app.use(express.static(clientDistPath, { index: false }));
    app.get('*', (_req, res) => res.sendFile(path.join(clientDistPath, 'index.html')));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NIRNAY AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
