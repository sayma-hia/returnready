# ReturnReady

AI-powered interview coaching for engineers returning after a career break.

## Setup

```bash
cp .env.example .env.local
# Fill in your API keys
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Description |
|---|---|
| `OPENAI_API_KEY` | GPT-4o API key from platform.openai.com |
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anon/public key |
| `NEXTAUTH_SECRET` | Random secret — run `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your deployment URL (e.g. https://returnready.vercel.app) |
| `GOOGLE_CLIENT_ID` | Google OAuth app client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth app client secret |
| `EMAIL_SERVER` | SMTP server for magic link emails (optional) |
| `EMAIL_FROM` | From address for magic link emails |

## Supabase schema

Run this SQL in your Supabase SQL editor:

```sql
create table users (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  name text,
  created_at timestamp default now()
);

create table profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users,
  gap_type text,
  gap_start date,
  gap_end date,
  target_role text,
  seniority text,
  target_market text,
  confidence_baseline int,
  narrative_brief text,
  narrative_full text,
  narrative_pivot text,
  updated_at timestamp default now()
);

create table sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users,
  session_type text,
  focus_areas text[],
  difficulty text,
  market_style text,
  overall_score decimal,
  confidence_score decimal,
  underselling_count int,
  completed_at timestamp default now()
);

create table session_answers (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references sessions,
  question_text text,
  question_category text,
  answer_text text,
  score_clarity int,
  score_depth int,
  score_confidence int,
  score_relevance int,
  feedback text,
  underselling_detected boolean,
  underselling_phrases text[],
  stronger_version text
);
```

## Deploy to Vercel

1. Push to GitHub
2. Go to vercel.com/new → import repo
3. Add all environment variables from `.env.example`
4. Deploy
