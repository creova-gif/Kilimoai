/**
 * Kilimo AI — Supabase Schema (SQL)
 *
 * Run this in the Supabase SQL editor to set up all required tables.
 * 
 * Tables:
 *   - agro_profiles         (Agro ID digital identity)
 *   - farm_sensors          (IoT sensor readings)
 *   - push_tokens           (Device push notification tokens)
 *   - sync_queue_log        (Server-side audit of offline sync events)
 *   - tasks                 (Farm task management)
 *   - market_listings       (Market price listings)
 *   - crop_diagnoses        (AI scan results)
 *   - cooperative_members   (AMCOS / co-op membership)
 *
 * Row Level Security (RLS) is enforced on all tables.
 * Users can only read/write their own data.
 */

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Agro ID Profile ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS agro_profiles (
  id               TEXT PRIMARY KEY,              -- e.g. "KILIMO-8492-XJ"
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name             TEXT NOT NULL,
  role             TEXT NOT NULL DEFAULT 'Mkulima',
  location         TEXT,
  tier             TEXT NOT NULL DEFAULT 'Free' CHECK (tier IN ('Free', 'Premium', 'Cooperative')),
  join_date        TEXT NOT NULL,
  avatar_url       TEXT,
  mpesa_linked     BOOLEAN DEFAULT FALSE,
  biometric_enabled BOOLEAN DEFAULT FALSE,
  coop_id          TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE agro_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own profile"
  ON agro_profiles FOR ALL
  USING (auth.uid() = user_id);

-- ─── Farm Sensors ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS farm_sensors (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  farm_block       TEXT DEFAULT 'Block A',
  soil_health      NUMERIC(5,2),
  moisture         NUMERIC(5,2),
  temperature      NUMERIC(5,2),
  yield_estimate   NUMERIC(6,3),
  recorded_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE farm_sensors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own sensor data"
  ON farm_sensors FOR ALL
  USING (auth.uid() = user_id);

-- Enable Realtime on farm_sensors for live dashboard updates
ALTER PUBLICATION supabase_realtime ADD TABLE farm_sensors;

-- ─── Push Tokens ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS push_tokens (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token            TEXT NOT NULL UNIQUE,
  platform         TEXT CHECK (platform IN ('ios', 'android', 'web')),
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE push_tokens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own push tokens"
  ON push_tokens FOR ALL
  USING (auth.uid() = user_id);

-- ─── Tasks ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tasks (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  coop_id          TEXT,                          -- Optional: shared co-op task
  title            TEXT NOT NULL,
  title_sw         TEXT,                          -- Swahili translation
  description      TEXT,
  category         TEXT DEFAULT 'general',
  priority         TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status           TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'done', 'cancelled')),
  due_date         TIMESTAMPTZ,
  completed_at     TIMESTAMPTZ,
  xp_reward        INTEGER DEFAULT 10,
  farm_block       TEXT,
  synced_offline   BOOLEAN DEFAULT FALSE,         -- Was this created offline?
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own tasks"
  ON tasks FOR ALL
  USING (auth.uid() = user_id);
CREATE POLICY "Coop members can view shared tasks"
  ON tasks FOR SELECT
  USING (coop_id IS NOT NULL AND coop_id IN (
    SELECT coop_id FROM agro_profiles WHERE user_id = auth.uid()
  ));

-- ─── Market Listings ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS market_listings (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  crop_name        TEXT NOT NULL,
  crop_name_sw     TEXT,
  quantity_kg      NUMERIC(10,2) NOT NULL,
  price_per_kg     NUMERIC(10,2) NOT NULL,
  currency         TEXT DEFAULT 'TZS',
  location         TEXT,
  quality_grade    TEXT DEFAULT 'A',
  status           TEXT DEFAULT 'active' CHECK (status IN ('active', 'sold', 'cancelled')),
  smart_contract   BOOLEAN DEFAULT FALSE,
  escrow_funded    BOOLEAN DEFAULT FALSE,
  expires_at       TIMESTAMPTZ,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE market_listings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active listings"
  ON market_listings FOR SELECT
  USING (status = 'active');
CREATE POLICY "Sellers can manage their own listings"
  ON market_listings FOR ALL
  USING (auth.uid() = seller_id);

-- Enable Realtime for live market price feeds
ALTER PUBLICATION supabase_realtime ADD TABLE market_listings;

-- ─── Crop Diagnoses (AI Scan Results) ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS crop_diagnoses (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  disease_name     TEXT NOT NULL,
  disease_name_sw  TEXT,
  confidence       NUMERIC(5,2),
  severity         TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  treatment_notes  TEXT,
  image_url        TEXT,
  farm_block       TEXT,
  synced_offline   BOOLEAN DEFAULT FALSE,
  diagnosed_at     TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE crop_diagnoses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own diagnoses"
  ON crop_diagnoses FOR ALL
  USING (auth.uid() = user_id);

-- ─── Cooperative Members ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cooperative_members (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coop_id          TEXT NOT NULL,
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role             TEXT DEFAULT 'member' CHECK (role IN ('member', 'leader', 'treasurer', 'admin')),
  joined_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(coop_id, user_id)
);

ALTER TABLE cooperative_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Coop members can view their coop"
  ON cooperative_members FOR SELECT
  USING (user_id = auth.uid() OR coop_id IN (
    SELECT coop_id FROM cooperative_members WHERE user_id = auth.uid()
  ));

-- ─── Sync Queue Audit Log ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sync_queue_log (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type       TEXT NOT NULL,
  payload          JSONB,
  synced_at        TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE sync_queue_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own sync log"
  ON sync_queue_log FOR SELECT
  USING (auth.uid() = user_id);

-- ─── Updated_at trigger ───────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_agro_profiles_updated_at
  BEFORE UPDATE ON agro_profiles
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
