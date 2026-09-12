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
    const prompt = `You are NIRNAY AI, an expert rural business advisory and financial structuring engine for India (Smart India Hackathon 2026 Problem Statement SIH26091).
Analyze the following proposed rural/semi-urban micro-enterprise:
Location: ${formData.location?.village}, ${formData.location?.block}, ${formData.location?.district} (${formData.location?.state})
Category: ${formData.category}
Idea: ${formData.businessIdea || formData.ideaText}
Margin Capital Available: ₹${formData.availableMargin || formData.marginCapital}
Target Customers: ${formData.targetMarket}
Prior Experience: ${formData.priorExperience}
Risk Tolerance: ${formData.riskWillingness}

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
  "recommendation": "string",
  "swot": {
    "strengths": ["string"],
    "weaknesses": ["string"],
    "opportunities": ["string"],
    "threats": ["string"]
  },
  "insights": [
    {"title": "string", "description": "string", "tag": "string"}
  ],
  "localOpportunity": {
    "demandSignal": "string",
    "competitorDensity": "string",
    "marketGap": "string",
    "recommendedRadius": "string",
    "suggestedProductMix": ["string"]
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

  const { question, context } = req.body;

  try {
    const prompt = `You are NIRNAY AI advisory assistant for rural micro-entrepreneurs in India.
Business: ${context?.businessIdea || 'Rural enterprise'}
Category: ${context?.category || 'General'}
Committed Margin: ₹${context?.margin || 50000}
Total Project Cost: ₹${context?.projectCost || 500000}
Loan Support: ₹${context?.loan || 450000}
Scheme: ${context?.scheme || 'Term Loan Scheme'}
Language: ${context?.language || 'en'}

User Question: "${question}"

Reply in plain, practical language under 120 words. Keep financial figures internally consistent and avoid claiming guaranteed approvals or returns.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return res.json({
      answer: response.text,
      sources: ['NIRNAY AI Advisory Engine'],
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
