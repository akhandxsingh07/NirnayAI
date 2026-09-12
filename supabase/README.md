# Nirnay AI Supabase backend

Project ref: `nllkmunqdkznhnhfrric` (Mumbai / `ap-south-1`).

The production backend uses Supabase Auth + PostgreSQL with Row Level Security (RLS), while the existing Express server continues to handle protected Gemini AI endpoints.

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
- Admin access is checked in PostgreSQL rather than by browser-visible credentials.
- A private single-row admin allowlist controls which email may receive the `admin` role.
- A partial unique index allows only one `profiles.role = 'admin'` row in the entire project.
- Citizens cannot promote themselves because their profile update policy requires their role to remain `citizen`.
- Internal `SECURITY DEFINER` helper functions live in the private schema and are not executable from the public API.

## Citizen authentication

- Email uses Supabase passwordless email authentication.
- Phone uses Supabase 6-digit SMS OTP.
- Phone login requires an SMS provider configured in Supabase Auth (Twilio, Vonage, MessageBird, etc.).

## Single administrator

The authorised administrator email is stored only in the private database allowlist, not in frontend code or public environment variables.

When the allowlisted email signs in for the first time, the Auth trigger creates its profile with `role = 'admin'`. All other accounts are created as citizens. The database rejects assigning a second admin.

## Automated backend workflow

When a new assessment is saved, PostgreSQL automatically creates five action-plan tasks for that user:

1. Complete Udyam registration
2. Validate demand with local customers
3. Collect supplier/equipment quotations
4. Prepare identity, bank and scheme documents
5. Schedule a financing discussion with the selected lender

The database also records important events such as citizen registration, assessment creation, AI analysis creation, financial-plan creation and report creation in `admin_activity`. Task completion timestamps are maintained automatically.

## Local setup

After pulling the latest repository changes:

```bash
npm install
npm run dev
```

The app contains publishable Supabase defaults, but they can be overridden with:

```env
VITE_SUPABASE_URL=https://nllkmunqdkznhnhfrric.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
GEMINI_API_KEY=your_server_side_gemini_key
```

Never put a Supabase service-role key in `VITE_*` variables or frontend code.
