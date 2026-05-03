-- Pharmroo schema + leads table.
-- Run this once in Supabase SQL Editor on your existing project.
-- After running, expose the `pharmroo` schema:
--   Project Settings → API → Exposed schemas → add "pharmroo"

create schema if not exists pharmroo;

create table if not exists pharmroo.leads (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  phone        text not null,
  concern      text,
  risk_level   text not null check (risk_level in ('low','moderate','high','very_high')),
  total_score  integer not null,
  created_at   timestamptz not null default now()
);

create index if not exists leads_created_at_idx
  on pharmroo.leads (created_at desc);

create index if not exists leads_risk_level_idx
  on pharmroo.leads (risk_level);

-- RLS: deny by default; only the service_role key (server-only) can insert.
alter table pharmroo.leads enable row level security;

-- No anon/authenticated policies on purpose — Server Action uses service_role.
-- If you later want a Supabase dashboard reader role, add a SELECT policy here.

-- Grants: custom schemas don't auto-grant to Supabase roles. Without these,
-- service_role gets "permission denied for schema pharmroo" when inserting.
grant usage on schema pharmroo to service_role;
grant all on all tables in schema pharmroo to service_role;
grant all on all sequences in schema pharmroo to service_role;
alter default privileges in schema pharmroo
  grant all on tables to service_role;
alter default privileges in schema pharmroo
  grant all on sequences to service_role;
