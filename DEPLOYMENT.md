# NirnayAI Deployment Guide

NirnayAI is a single Node.js web service: Vite builds the React client into `dist/client`, Express runs separately from `dist-server`, Supabase provides authentication/database, Gemini powers online AI features, Open-Meteo supplies forecast signals, OpenStreetMap/Overpass supplies mapped-place intelligence, and the optional India OGD connector supplies official daily AGMARKNET mandi records.

## Recommended: Render Blueprint

The repository includes `render.yaml`.

1. Create a new Render Blueprint from this GitHub repository.
2. Render will use:
   - Build: `npm install --include=dev --no-audit --no-fund && npm run build`
   - Start: `npm start`
   - Health check: `/api/health`
3. Add `GEMINI_API_KEY` as a Render secret. Never commit it.
4. Add `DATA_GOV_IN_API_KEY` as a Render secret if official daily mandi records are required.
5. Add `ADMIN_LOGIN_EMAIL` as a Render secret. It must be the same Supabase Auth user that already has `profiles.role = 'admin'`.
6. `ADMIN_LOGIN_ID` defaults to `nirnay-admin` in `render.yaml`. Change it in Render if a different private admin username is preferred.
7. Deploy and copy the final HTTPS application URL.

The Supabase URL and publishable key are public client configuration and are already included in the blueprint. Never add a Supabase service-role key to the frontend or repository.

## Single-admin ID/password login

The Admin Portal uses one Admin ID plus the password of the single authorised Supabase admin account.

Local `.env` example:

```env
ADMIN_LOGIN_ID=nirnay-admin
ADMIN_LOGIN_EMAIL=YOUR_AUTHORISED_ADMIN_EMAIL
```

Do **not** put the admin password in `.env`, GitHub or Render. The password is stored and verified by Supabase Auth. The Express server maps the configured Admin ID to the configured admin email, signs in with Supabase, and then checks that the database profile still has `role = 'admin'`. PostgreSQL remains the authority for single-admin access.

If the authorised admin account does not yet have a password, set/reset it from Supabase Auth before using ID/password login. Never share that password in project files or chat logs.

The login route is rate-limited and returns a Supabase session only after both credential verification and database-role verification succeed.

## Required post-deploy auth configuration

After the first deployment, open Supabase Authentication URL Configuration and set:

- Site URL: your final production HTTPS URL
- Redirect URL: `https://YOUR-DOMAIN/**`
- Keep `http://localhost:3000/**` only if local development still needs it.

Citizen email magic links use `window.location.origin`, so production auth returns to the deployed domain after this configuration is updated.

If mobile OTP is exposed to users, configure a supported SMS provider in Supabase first. Email passwordless login works independently.

## Email delivery

Keep custom SMTP configured in Supabase Auth and keep the sender verified with the SMTP provider. Test one fresh citizen magic-link login from the production domain after deployment.

## Live data feeds

No secret is required for Open-Meteo forecast integration. Live map intelligence uses OpenStreetMap/Nominatim/Overpass with short server-side caching and public-route rate limiting.

The official mandi integration uses the Government of India OGD AGMARKNET resource. Configure:

```env
DATA_GOV_IN_API_KEY=YOUR_DATA_GOV_IN_KEY
```

Mandi values are treated as wholesale observations in ₹/quintal, sorted by the returned arrival date. Missing prices are not converted to ₹0. If the key is absent, NirnayAI still runs normally and marks the connector as not configured instead of fabricating prices.

Government-scheme eligibility is intentionally not scraped or guaranteed. The UI links to official myScheme/Udyam/RBI sources for verification.

## Production checks

Run locally before release:

```bash
npm install
npm run deploy:check
npm start
```

Then verify:

1. `/api/health` returns HTTP 200 and shows the expected configuration booleans.
2. Citizen email login completes on the production domain.
3. One assessment saves completely to Supabase.
4. AI analysis works with `GEMINI_API_KEY` configured.
5. Ask NIRNAY answers in the selected website language.
6. AI voice plays in the selected language; browser speech fallback works where supported.
7. Live map analysis loads and labels OSM data as decision support.
8. Live Weather loads and shows current/3-day forecast values.
9. With `DATA_GOV_IN_API_KEY` configured, official mandi records load; without it, the UI shows a setup state.
10. Financing/scheme pages use indicative wording and do not claim sanction or guaranteed eligibility.
11. Admin ID/password login succeeds only for the single database-authorised admin account.
12. A wrong Admin ID/password is rejected and repeated attempts are rate-limited.
13. Sign-out clears the user session.
14. `/server.cjs` and `/server.cjs.map` are not publicly served; only `dist/client` is exposed.

## Docker deployment

A production `Dockerfile` is included for Railway, Fly.io, Cloud Run, ECS, a VPS, or another Docker-compatible platform.

Build and run:

```bash
docker build -t nirnay-ai .
docker run --rm -p 3000:3000 \
  -e GEMINI_API_KEY="YOUR_SECRET_KEY" \
  -e DATA_GOV_IN_API_KEY="YOUR_DATA_GOV_IN_KEY" \
  -e ADMIN_LOGIN_ID="nirnay-admin" \
  -e ADMIN_LOGIN_EMAIL="YOUR_AUTHORISED_ADMIN_EMAIL" \
  -e SUPABASE_URL="https://nllkmunqdkznhnhfrric.supabase.co" \
  -e SUPABASE_PUBLISHABLE_KEY="YOUR_PUBLISHABLE_KEY" \
  -e VITE_SUPABASE_URL="https://nllkmunqdkznhnhfrric.supabase.co" \
  -e VITE_SUPABASE_PUBLISHABLE_KEY="YOUR_PUBLISHABLE_KEY" \
  nirnay-ai
```

Note: the current Docker build uses repository-default public Vite/Supabase configuration. If those values are changed, ensure the replacement `VITE_*` values are available when Vite builds the client.

## Secrets

Never commit or expose:

- `GEMINI_API_KEY`
- `DATA_GOV_IN_API_KEY`
- admin password
- Supabase service-role key
- SMTP password/API key
- SMS provider secret

`ADMIN_LOGIN_EMAIL` and `ADMIN_LOGIN_ID` are server-side deployment configuration; keep them out of browser/VITE variables. The Supabase publishable key is intentionally public and is safe only because Row Level Security is enabled.
