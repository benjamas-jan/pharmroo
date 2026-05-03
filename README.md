# Pharmroo · ฟามรู้

15-question NCDs risk assessment for pharmacy partners, built for the LINE Official Account webview.

Stack: **Next.js 15** (App Router) · **TypeScript strict** · **Tailwind 4** · **Supabase** · deploy on **Vercel**.

## Quickstart

```bash
npm install
cp .env.example .env.local
# fill in NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_SITE_URL
npm run dev
```

Open http://localhost:3000

## Supabase setup

The app reuses an existing Supabase project under a dedicated `pharmroo` schema (no new project required).

1. Open Supabase Dashboard → **SQL Editor**
2. Paste & run [`supabase/migrations/0001_init.sql`](./supabase/migrations/0001_init.sql)
3. Go to **Project Settings → API → Exposed schemas** → add `pharmroo`
4. Copy keys from **Project Settings → API**:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `service_role` (secret) → `SUPABASE_SERVICE_ROLE_KEY`

The Server Action [`app/actions/submit-lead.ts`](./app/actions/submit-lead.ts) inserts into `pharmroo.leads` using the service role key (bypasses RLS).

### Lead data captured

Per design disclaimer ("ใช้ติดต่อกลับเท่านั้น"), the consult form stores **only**:
- name, phone, concern (free text)
- risk_level + total_score (for follow-up prioritization)

Assessment answers are **not** persisted.

## Deploy to Vercel

1. Import GitHub repo on Vercel
2. Add custom domain `pharmroo.com` under **Settings → Domains**
3. Set Environment Variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJ...
   NEXT_PUBLIC_SITE_URL=https://pharmroo.com
   ```
4. Deploy

## Project structure

```
app/
  layout.tsx          # fonts, metadata
  page.tsx            # state machine (welcome → sections → result → consult)
  globals.css         # Tailwind + design tokens
  actions/
    submit-lead.ts    # Server Action → Supabase
components/
  ui/                 # ChoiceCard, PillChoice, NumberField, PrimaryButton,
                      # SectionProgress, QHeader, SectionHeader, RiskGauge
  screens/
    Welcome.tsx
    SectionA.tsx      # Sections A/B/C/D
    Result.tsx
    Consult.tsx
lib/
  assessment.ts       # types + scoring (Thai CPG Obesity 2568)
  supabase.ts         # admin client (server-only)
supabase/
  migrations/0001_init.sql
design/               # original HTML/JSX prototype — reference only
```

## Scoring

Ported 1:1 from `design/assessment-data.jsx`. Asian BMI thresholds, gender-adjusted age risk per WHO HEARTS / Thai Heart Foundation. **Not certified** — confirm weights with a clinical reviewer before launch.

## Scripts

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run typecheck` — TypeScript check
- `npm run lint` — ESLint
