-- PWL Asphalt Tracker - Supabase Schema
-- Natural keys, settings table, NUMERIC for decimal tons
-- Phase 0: Schema prep

-- ============================================================================
-- SETTINGS TABLE (app configuration)
-- ============================================================================
CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  start_lot_no INTEGER NOT NULL DEFAULT 100,
  next_seq INTEGER NOT NULL DEFAULT 0,
  next_lot_no INTEGER NOT NULL DEFAULT 105,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT only_one_row CHECK (id = 1)
);

-- ============================================================================
-- LOTS TABLE (lot allocation index)
-- ============================================================================
CREATE TABLE IF NOT EXISTS lots (
  lot_no INTEGER PRIMARY KEY,
  idx INTEGER NOT NULL,
  mix TEXT NOT NULL,
  mix_key TEXT NOT NULL,
  created_by TEXT,
  created_date TEXT NOT NULL,
  expiration_date TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lots_index ON lots(idx);
CREATE INDEX IF NOT EXISTS idx_lots_created_date ON lots(created_date);

-- ============================================================================
-- SHIFTS TABLE (tonnage allocations by date/mix)
-- ============================================================================
CREATE TABLE IF NOT EXISTS shifts (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  mix TEXT NOT NULL,
  tons_ct NUMERIC NOT NULL,
  locations TEXT,
  bridge_deck BOOLEAN DEFAULT FALSE,
  seq INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shifts_date ON shifts(date);
CREATE INDEX IF NOT EXISTS idx_shifts_mix ON shifts(mix);
CREATE INDEX IF NOT EXISTS idx_shifts_seq ON shifts(seq);

-- ============================================================================
-- SAMPLES TABLE (sample records per lot/sublot)
-- ============================================================================
CREATE TABLE IF NOT EXISTS samples (
  lot_no INTEGER NOT NULL REFERENCES lots(lot_no) ON DELETE CASCADE,
  sublot INTEGER NOT NULL,
  ton_ct NUMERIC,
  taken BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (lot_no, sublot)
);

CREATE INDEX IF NOT EXISTS idx_samples_lot_no ON samples(lot_no);

-- ============================================================================
-- MIGRATION TRACKING (for Phase 4)
-- ============================================================================
CREATE TABLE IF NOT EXISTS migrations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY (phase 1 uses temporary anon policies)
-- ============================================================================
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE lots ENABLE ROW LEVEL SECURITY;
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE samples ENABLE ROW LEVEL SECURITY;
ALTER TABLE migrations ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- SEED SETTINGS (initial row)
-- ============================================================================
INSERT INTO settings (id, start_lot_no, next_seq, next_lot_no)
VALUES (1, 100, 0, 105)
ON CONFLICT (id) DO NOTHING;
