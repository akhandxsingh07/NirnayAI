import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy Gemini Client
let geminiClient: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return geminiClient;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    service: 'NIRNAY AI Server',
  });
});

// AI Business Analysis Endpoint
app.post('/api/ai/analyze', async (req, res) => {
  const formData = req.body;
  const ai = getGemini();

  if (!ai || !process.env.GEMINI_API_KEY) {
    // Return flag indicating demo fallback
    return res.json({ demoMode: true, isAiGenerated: false });
  }

  try {
    const prompt = `You are NIRNAY AI, an expert rural business advisory and financial structuring engine for India (Smart India Hackathon 2026 Problem Statement SIH26091).
Analyze the following proposed rural/semi-urban micro-enterprise:
Location: ${formData.location?.village}, ${formData.location?.block}, ${formData.location?.district} (${formData.location?.state})
Category: ${formData.category}
Idea: ${formData.businessIdea}
Margin Capital Available: ₹${formData.availableMargin}
Target Customers: ${formData.targetMarket}
Prior Experience: ${formData.priorExperience}
Risk Tolerance: ${formData.riskWillingness}

Return a valid JSON object strictly matching this schema (NO MARKDOWN WRAPPERS):
{
  "feasibilityScore": {
    "overallScore": number (0-100),
    "statusLabel": "Promising — proceed with controlled investment" or similar,
    "marketPotential": number (0-100),
    "capitalFit": number (0-100),
    "competitionScore": number (0-100),
    "operationalFeasibility": number (0-100),
    "growthPotential": number (0-100)
  },
  "recommendation": "string (plain language strategic advice 2-3 sentences)",
  "swot": {
    "strengths": ["string", "string"],
    "weaknesses": ["string", "string"],
    "opportunities": ["string", "string"],
    "threats": ["string", "string"]
  },
  "insights": [
    {"title": "string", "description": "string", "tag": "string"},
    {"title": "string", "description": "string", "tag": "string"},
    {"title": "string", "description": "string", "tag": "string"}
  ],
  "localOpportunity": {
    "demandSignal": "string",
    "competitorDensity": "string",
    "marketGap": "string",
    "recommendedRadius": "string",
    "suggestedProductMix": ["string", "string", "string", "string"]
  }
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text || '{}';
    const parsed = JSON.parse(responseText);

    return res.json({
      ...parsed,
      isAiGenerated: true,
    });
  } catch (err: any) {
    console.error('Error generating AI analysis:', err);
    return res.json({ demoMode: true, isAiGenerated: false });
  }
});

// AI Conversational Assistant Endpoint
app.post('/api/ai/chat', async (req, res) => {
  const { question, context } = req.body;
  const ai = getGemini();

  if (!ai || !process.env.GEMINI_API_KEY) {
    return res.json({ demoMode: true });
  }

  try {
    const prompt = `You are NIRNAY AI advisory assistant for rural micro-entrepreneurs in India.
User Context:
Business: ${context?.businessIdea || 'Rural enterprise'}
Category: ${context?.category || 'General'}
Committed Margin: ₹${context?.margin || 50000} (10%)
Total Project Cost: ₹${context?.projectCost || 500000}
90% Loan Support: ₹${context?.loan || 450000}
Scheme: ${context?.scheme || 'Term Loan Scheme'}
Language: ${context?.language === 'hi' ? 'Hindi' : 'English'}

User Question: "${question}"

Important Guidelines:
1. Provide a concise, highly practical, supportive answer (under 120 words).
2. If language is Hindi or user asked in Hindi, reply in clean, accessible Hindi.
3. Keep loan/cost calculations consistent with SIH26091 rules (10% margin, 90% debt).
4. Mention relevant sources (e.g. RBI Small Entrepreneur Guidelines, Udyam Registration).`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return res.json({
      answer: response.text,
      sources: ['NIRNAY AI Advisory Engine', 'RBI Small Entrepreneur Guidelines'],
    });
  } catch (err: any) {
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
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NIRNAY AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
