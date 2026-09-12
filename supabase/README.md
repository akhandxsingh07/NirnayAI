# Nirnay AI Supabase backend

Project ref: `nllkmunqdkznhnhfrric` (Mumbai / `ap-south-1`).

The production backend now uses Supabase Auth + PostgreSQL with Row Level Security (RLS).

## Core tables

- `profiles` — authenticated citizen/admin profile and role
- `business_assessments` — submitted business assessments
- `ai_analyses` — feasibility, SWOT, insights and local opportunity output
- `financial_plans` — persisted financial structuring output
- `scheme_shortlists` — citizen scheme shortlist
- `action_plan_tasks` — saved action-plan progress
- `reports` — saved business reports
- `admin_activity` — administrator audit activity

## Security model

- Every authenticated user receives a `profiles` row automatically.
- New accounts always start with role `citizen`.
- RLS limits citizens to their own data.
- Admin can read platform data through the database role check.
- A partial unique index allows only one `profiles.role = 'admin'` row in the entire project.
- Citizens cannot promote themselves because their profile update policy requires the role to remain `citizen`.

## Citizen authentication

- Email uses Supabase passwordless email authentication (secure sign-in link by default).
- Phone uses Supabase 6-digit SMS OTP.
- Phone login requires an SMS provider configured in Supabase Auth (Twilio, Vonage, MessageBird, etc.).

## Assign the one administrator

1. Sign in once using the email that should become the administrator. This creates the Auth user and profile.
2. Run the following SQL in a trusted admin context (replace the email):

```sql
update public.profiles
set role = 'admin'
where email = 'YOUR_ADMIN_EMAIL';
```

The database will reject assigning a second admin.

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
