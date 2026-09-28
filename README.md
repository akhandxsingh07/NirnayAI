# Nirnay AI

Rural business advisory and finance planning prototype. The React client and Express API run as one Node.js service.

## Local setup

1. Use Node.js 20 or 22 and run `npm ci`.
2. Copy `.env.example` to `.env` and set `OPENAI_API_KEY` for AI analysis, chat and voice. Keep the key server-side; do not use a `VITE_` prefix.
3. Run `npm run dev` and open http://localhost:3000.
4. Run `npm run deploy:check` before deployment.

Text responses use `gpt-4.1-mini` by default; optionally set `OPENAI_TEXT_MODEL` to another compatible model. Spoken replies use `gpt-4o-mini-tts`. Without an OpenAI key, analysis and chat use the local fallback; voice falls back to browser speech where supported. See [DEPLOYMENT.md](DEPLOYMENT.md) for Render and Supabase configuration.
