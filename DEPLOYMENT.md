# NirnayAI Deployment Guide

NirnayAI is a single Node.js web service: Vite builds the React frontend, Express serves the production frontend and API routes, Supabase provides authentication/database, Gemini powers online AI features, Open-Meteo supplies live forecast signals, OpenStreetMap/Overpass supplies live mapped-place intelligence, and the optional India OGD connector supplies official daily AGMARKNET mandi records.

## Recommended: Render Blueprint

The repository includes `render.yaml`.

1. Create a new Render Blueprint from this GitHub repository.
2. Render will use:
   - Build: `npm install --include=dev --no-audit --no-fund && npm run build`
   - Start: `npm start`
   - Health check: `/api/health`
3. Add the secret environment variable `GEMINI_API_KEY` in the Render dashboard. Never commit this key.
4. Optional but recommended for agriculture/food demos: add `DATA_GOV_IN_API_KEY` from data.gov.in. This enables official daily mandi price records from the AGMARKNET dataset. Keep it server-side and never use a `VITE_` prefix.
5. Deploy and copy the final HTTPS application URL.

The Supabase URL and publishable key are public client configuration and are already included in the blueprint. Do not add a Supabase service-role key to the frontend or repository.

## Required post-deploy auth configuration

After the first deployment, open Supabase Authentication URL Configuration and set:

- Site URL: your final production HTTPS URL
- Redirect URL: `https://YOUR-DOMAIN/**`
- Keep `http://localhost:3000/**` only if local development still needs it.

Citizen email magic links use `window.location.origin`, so production auth will redirect back to the deployed domain after this configuration is updated.

If mobile OTP is going to be exposed to users, configure a supported SMS provider in Supabase first. Email/passwordless login can be used independently.

## Email delivery

Custom SMTP must remain configured in Supabase Auth. The sender address must remain verified with the SMTP provider. Test one fresh citizen magic-link login from the production domain after deployment.

## Live data feeds

No secret is required for the Open-Meteo forecast integration. Live map intelligence continues to use OpenStreetMap/Nominatim/Overpass with short server-side caching.

The official mandi integration uses the Government of India OGD resource for current daily mandi prices. Configure:

```env
DATA_GOV_IN_API_KEY=YOUR_DATA_GOV_IN_KEY
```

If this key is absent, NirnayAI still runs normally: weather and live map signals remain available and the UI clearly marks the mandi connector as not configured instead of fabricating prices.

Government-scheme eligibility is intentionally not scraped. The UI links users to the official myScheme portal for current verification because scheme eligibility, deadlines and implementing-agency rules can change.

## Production checks

Run locally before a release:

```bash
npm install
npm run deploy:check
npm start
```

Then verify:

1. `/api/health` returns HTTP 200.
2. Citizen email login completes on the production domain.
3. One assessment saves to Supabase.
4. AI analysis works with `GEMINI_API_KEY` configured.
5. Ask NIRNAY answers in the selected website language.
6. AI voice plays in the selected language; browser speech fallback works if Gemini TTS is unavailable.
7. Live map analysis loads and clearly labels OpenStreetMap data as decision support.
8. Live Weather loads on the Local Opportunity page and shows current/3-day forecast values.
9. With `DATA_GOV_IN_API_KEY` configured, official daily mandi records load; without it, the UI shows a setup state rather than sample prices.
10. The government-scheme card links to the official myScheme verification portal.
11. Admin login is accepted only for the database-authorized admin account.
12. Sign-out clears the user session.

## Docker deployment

A production `Dockerfile` is also included for Railway, Fly.io, Cloud Run, ECS, a VPS, or any Docker-compatible platform.

Build and run:

```bash
docker build -t nirnay-ai .
docker run --rm -p 3000:3000 \
  -e GEMINI_API_KEY="YOUR_SECRET_KEY" \
  -e DATA_GOV_IN_API_KEY="YOUR_DATA_GOV_IN_KEY" \
  -e SUPABASE_URL="https://nllkmunqdkznhnhfrric.supabase.co" \
  -e SUPABASE_PUBLISHABLE_KEY="YOUR_PUBLISHABLE_KEY" \
  -e VITE_SUPABASE_URL="https://nllkmunqdkznhnhfrric.supabase.co" \
  -e VITE_SUPABASE_PUBLISHABLE_KEY="YOUR_PUBLISHABLE_KEY" \
  nirnay-ai
```

Note: Vite `VITE_*` values are embedded during the frontend build. On platforms that build the Docker image remotely, provide them as build-time environment values if you replace the repository defaults.

## Secrets

Never commit or expose:

- `GEMINI_API_KEY`
- `DATA_GOV_IN_API_KEY`
- Supabase service-role key
- SMTP password/API key
- SMS provider secret

The Supabase publishable key is intentionally public and can be used by the browser with Row Level Security enabled.
