import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3000);

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://nllkmunqdkznhnhfrric.supabase.co';
const SUPABASE_PUBLISHABLE_KEY =
  process.env.SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_sEfaduAFppFtdtm5tEAerA_bcpMpbKF';

const supabaseAuth = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

app.use(express.json({ limit: '1mb' }));

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

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'NIRNAY AI Server',
    backend: 'Express + Supabase PostgreSQL',
    hasGeminiApiKey: Boolean(process.env.GEMINI_API_KEY),
    hasSupabase: Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY),
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

  if (error || !profile) {
    return res.status(403).json({ authenticated: true, profile: null });
  }

  return res.json({ authenticated: true, profile });
});

app.post('/api/ai/analyze', async (req, res) => {
  const auth = await getAuthenticatedUser(req);
  const ai = getGemini();

  if (!auth) {
    return res.json({ demoMode: true, isAiGenerated: false, requiresAuth: true });
  }

  if (!ai || !process.env.GEMINI_API_KEY) {
    return res.json({ demoMode: true, isAiGenerated: false, requiresGeminiKey: true });
  }

  const formData = req.body;

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
1. Make the answer materially different for the selected district. A Lucknow answer should not read like a Barabanki answer.
2. Consider urban density, rural/peri-urban character, likely customer channels, supply access, local service demand and the entrepreneur's skill. Do not invent precise official statistics.
3. If local evidence is uncertain, use qualitative wording and explicitly recommend local verification rather than fabricating numbers.
4. Give concrete, practical, skill-specific advice: customer route, operating model, product/service mix, and first steps.
5. Government scheme discussion must never imply guaranteed eligibility, subsidy, sanction or return.
6. Keep all user-facing string values in the language represented by preferred language code. JSON property names must stay exactly as specified below.

Return valid JSON only with this schema:
{
  "feasibilityScore": {
    "overallScore": number,
    "statusLabel": "string",
    "marketPotential": number,
    "capitalFit": number,
    "competitionScore": number,
    "operationalFeasibility": number,
    "growthPotential": number
  },
  "recommendation": "string: 3-5 detailed sentences covering skill fit, district fit, launch approach and one key caution",
  "swot": {
    "strengths": ["string", "string", "string"],
    "weaknesses": ["string", "string", "string"],
    "opportunities": ["string", "string", "string"],
    "threats": ["string", "string", "string"]
  },
  "insights": [
    {"title": "string", "description": "string", "tag": "string"},
    {"title": "string", "description": "string", "tag": "string"},
    {"title": "string", "description": "string", "tag": "string"}
  ],
  "localOpportunity": {
    "demandSignal": "string: district-specific qualitative demand signal",
    "competitorDensity": "string: qualitative only unless verified data exists",
    "marketGap": "string: district-specific gap to validate locally",
    "recommendedRadius": "string",
    "suggestedProductMix": ["string", "string", "string", "string"]
  }
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
  if (!ai || !process.env.GEMINI_API_KEY) {
    return res.json({ demoMode: true, requiresGeminiKey: true });
  }

  const { question, context = {}, history = [] } = req.body as {
    question?: string;
    context?: Record<string, unknown>;
    history?: Array<{ role?: string; text?: string }>;
  };

  if (!question || typeof question !== 'string' || question.trim().length === 0) {
    return res.status(400).json({ error: 'Question is required.' });
  }

  const languageNames: Record<string, string> = {
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

  const languageCode = typeof context.language === 'string' ? context.language : 'en';
  const languageName = languageNames[languageCode] || 'English';
  const safeHistory = Array.isArray(history)
    ? history
        .slice(-10)
        .filter((item) => item && (item.role === 'user' || item.role === 'assistant') && typeof item.text === 'string')
        .map((item) => `${item.role === 'user' ? 'Entrepreneur' : 'NIRNAY AI'}: ${String(item.text).slice(0, 1200)}`)
        .join('\n')
    : '';

  try {
    const prompt = `You are NIRNAY AI, a practical decision-support copilot for rural and semi-urban micro-entrepreneurs in India.

Your job is broader than answering generic questions. Use the entrepreneur's current profile, location and prior conversation to give an actionable answer on business selection, customer acquisition, pricing, operations, cash flow, loan structure, government schemes, compliance, risk control and 30/60/90-day execution.

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
Estimated loan: ₹${context.loan ?? 'Not specified'}
Current scheme recommendation: ${String(context.scheme || 'Not specified')}
Risk preference: ${String(context.risk || 'Not specified')}
Target market / customer route: ${String(context.targetMarket || 'Not specified')}
UI language: ${languageName} (${languageCode})

RECENT CONVERSATION
${safeHistory || 'No previous turns.'}

CURRENT QUESTION
${question.trim()}

RESPONSE RULES
1. Reply in ${languageName}. If the user explicitly asks for another language in the current question, follow that request instead.
2. Make the answer district-aware and skill-aware. Lucknow, Barabanki, Prayagraj, Sitapur, etc. should not receive copy-pasted advice. Use qualitative local reasoning unless verified data is actually available.
3. Never invent precise local statistics, official scheme benefits, interest rates, eligibility thresholds, subsidy percentages, deadlines or government approvals. When uncertain, say what must be verified.
4. Never promise loan sanction, subsidy, profit, demand or returns.
5. Keep calculations internally consistent with the context. If you estimate, label it clearly as an estimate.
6. Prefer concrete next actions over generic motivation. Mention customer route, pricing test, supplier check, working-capital reserve, licences or scheme verification when relevant.
7. For "what should I do" questions, give a short prioritized action plan. For finance questions, break money into practical buckets. For scheme questions, explain likely-fit schemes to verify and why, not guaranteed eligibility.
8. Use simple language suitable for a first-time entrepreneur. You may retain familiar business terms such as EMI, working capital, UPI, FSSAI, Udyam and GST where useful.
9. Consider prior turns so follow-up questions feel connected. Do not repeat the entire previous answer.
10. Keep the main answer useful but concise: normally 180–320 words, shorter for simple questions.

Return JSON only:
{
  "answer": "string with readable short headings/bullets when useful",
  "followUps": ["3 short follow-up questions in the same language"],
  "confidenceNote": "one short sentence explaining what is based on user context and what should be locally/officially verified"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    const parsed = JSON.parse(response.text || '{}') as {
      answer?: string;
      followUps?: string[];
      confidenceNote?: string;
    };

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

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NIRNAY AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
