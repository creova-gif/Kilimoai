-- KILIMO AI — Agro-ID financial passport ledger.
--
-- Server-backed, per-user, append-mostly ledger that powers the credit score
-- and the verifiable QR passport. RLS ensures a farmer only sees/writes their
-- own rows; updates/deletes are disallowed so the history is tamper-evident
-- (corrections are made by posting a reversing entry, like real accounting).

create table if not exists public.agro_ledger (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users (id) on delete cascade,
  client_id    text not null,                 -- the device-generated id for dedupe
  entry_date   timestamptz not null,
  category     text not null,
  description  text not null default '',
  amount_tzs   bigint not null,               -- +income / -expense, whole TZS
  created_at   timestamptz not null default now(),
  unique (user_id, client_id)
);

create index if not exists agro_ledger_user_date_idx
  on public.agro_ledger (user_id, entry_date desc);

alter table public.agro_ledger enable row level security;

create policy "own rows: select" on public.agro_ledger
  for select using (auth.uid() = user_id);

create policy "own rows: insert" on public.agro_ledger
  for insert with check (auth.uid() = user_id);

-- Intentionally NO update/delete policies → ledger is append-only (tamper-evident).

-- Aggregated, read-only verification view consumed by the verify-agro-id edge
-- function via the service role. Exposes only non-PII totals.
create or replace view public.agro_ledger_summary as
select
  user_id,
  count(*)                                          as entry_count,
  coalesce(sum(amount_tzs) filter (where amount_tzs > 0), 0) as total_income_tzs,
  coalesce(sum(amount_tzs) filter (where amount_tzs < 0), 0) as total_expense_tzs,
  coalesce(sum(amount_tzs), 0)                      as net_tzs,
  min(entry_date)                                   as first_entry_at,
  max(entry_date)                                   as last_entry_at
from public.agro_ledger
group by user_id;
