# Nirnay AI Supabase backend

Project ref: `nllkmunqdkznhnhfrric` (Mumbai / `ap-south-1`).

The production backend uses Supabase Auth + PostgreSQL with Row Level Security (RLS). Express handles protected Gemini endpoints, live-data proxying and the server-side single-admin ID mapping.

## Core tables

- `profiles` — authenticated citizen/admin profile and role
- `business_assessments` — submitted business assessments
- `ai_analyses` — feasibility, SWOT, insights and local opportunity output
- `financial_plans` — persisted financial structuring output
- `scheme_shortlists` — citizen scheme shortlist
- `action_plan_tasks` — saved action-plan progress
- `reports` — saved business reports
- `admin_activity` — administrator-only audit activity

## Security model

- Every authenticated user receives a `profiles` row automatically.
- RLS limits citizens to their own data.
- Admin access is checked in PostgreSQL, not granted by browser-visible state.
- A private single-row admin allowlist controls which email may receive the `admin` role.
- A partial unique index allows only one `profiles.role = 'admin'` row in the project.
- Citizens cannot promote themselves.
- Internal `SECURITY DEFINER` helper functions live in the private schema and are not exposed as public browser functions.

## Citizen authentication

- Email uses Supabase passwordless email authentication.
- Phone uses Supabase 6-digit SMS OTP.
- Phone login requires an SMS provider configured in Supabase Auth.

## Single administrator: Admin ID + password

The Admin Portal now accepts one configured Admin ID and the password of the single authorised Supabase admin account.

Server configuration:

```env
ADMIN_LOGIN_ID=nirnay-admin
ADMIN_LOGIN_EMAIL=YOUR_AUTHORISED_ADMIN_EMAIL
```

The admin password is **not** stored in GitHub, frontend code or `.env`. Supabase Auth stores and verifies it. The Express server maps the Admin ID to `ADMIN_LOGIN_EMAIL`, signs in through Supabase Auth, then verifies that the resulting profile still has `role = 'admin'` before returning a session.

This means changing a browser value cannot create an admin. PostgreSQL RLS + the private allowlist remain authoritative, and the database still rejects assigning a second admin.

## Automated backend workflow

When a new assessment is saved, PostgreSQL automatically creates five action-plan tasks:

1. Complete Udyam registration
2. Validate demand with local customers
3. Collect supplier/equipment quotations
4. Prepare identity, bank and scheme documents
5. Schedule a financing discussion with the selected lender

The database also records citizen registration, assessment creation, AI analysis creation, financial-plan creation and report creation in `admin_activity`. Task completion timestamps are maintained automatically.

## Local setup

After pulling the latest repository changes:

```bash
npm install
npm run dev
```

Create a local `.env` (never commit it):

```env
GEMINI_API_KEY=your_server_side_gemini_key
DATA_GOV_IN_API_KEY=your_data_gov_key
ADMIN_LOGIN_ID=nirnay-admin
ADMIN_LOGIN_EMAIL=your_authorised_admin_email
SUPABASE_URL=https://nllkmunqdkznhnhfrric.supabase.co
SUPABASE_PUBLISHABLE_KEY=your_publishable_key
VITE_SUPABASE_URL=https://nllkmunqdkznhnhfrric.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
```

Never put a Supabase service-role key, Gemini secret, data.gov.in secret or admin password in `VITE_*` variables or frontend code.
