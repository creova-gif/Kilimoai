-- KILIMO AI — Agro-ID profile registry.
--
-- Maps a user to their authoritative, server-minted Agro-ID (see the
-- mint-agro-id edge function). The public verify-agro-id function resolves a
-- scanned id back to a user via this table; the id is unique and high-entropy
-- so it cannot be enumerated. The agro_id is minted by a trusted server process
-- (service role) — clients can read their own row but never set the id.

create table if not exists public.agro_profiles (
  user_id              uuid primary key references auth.users (id) on delete cascade,
  agro_id              text not null unique,
  verification_status  text not null default 'verified',
  created_at           timestamptz not null default now()
);

create index if not exists agro_profiles_agro_id_idx on public.agro_profiles (agro_id);

alter table public.agro_profiles enable row level security;

-- A user may read their own profile. Inserts/updates of the authoritative
-- agro_id are performed by the mint-agro-id function using the service role
-- (which bypasses RLS), so no client write policy is granted here.
create policy "own profile: select" on public.agro_profiles
  for select using (auth.uid() = user_id);
