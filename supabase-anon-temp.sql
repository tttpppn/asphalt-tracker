-- PWL Asphalt Tracker - Temporary Anonymous RLS Policies
-- Phase 1: Anon access via PostgREST (to be replaced with proper auth in sprint 2)
-- WARNING: These policies allow full public access. Use backup + monitoring.

-- ============================================================================
-- SETTINGS TABLE - Full read/write access
-- ============================================================================
DROP POLICY IF EXISTS "Allow anon read" ON settings;
CREATE POLICY "Allow anon read" ON settings
  FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Allow anon write" ON settings;
CREATE POLICY "Allow anon write" ON settings
  FOR INSERT WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Allow anon update" ON settings;
CREATE POLICY "Allow anon update" ON settings
  FOR UPDATE USING (TRUE) WITH CHECK (TRUE);

-- ============================================================================
-- LOTS TABLE - Full read/write access
-- ============================================================================
DROP POLICY IF EXISTS "Allow anon read" ON lots;
CREATE POLICY "Allow anon read" ON lots
  FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Allow anon insert" ON lots;
CREATE POLICY "Allow anon insert" ON lots
  FOR INSERT WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Allow anon update" ON lots;
CREATE POLICY "Allow anon update" ON lots
  FOR UPDATE USING (TRUE) WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Allow anon delete" ON lots;
CREATE POLICY "Allow anon delete" ON lots
  FOR DELETE USING (TRUE);

-- ============================================================================
-- SHIFTS TABLE - Full read/write access
-- ============================================================================
DROP POLICY IF EXISTS "Allow anon read" ON shifts;
CREATE POLICY "Allow anon read" ON shifts
  FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Allow anon insert" ON shifts;
CREATE POLICY "Allow anon insert" ON shifts
  FOR INSERT WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Allow anon update" ON shifts;
CREATE POLICY "Allow anon update" ON shifts
  FOR UPDATE USING (TRUE) WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Allow anon delete" ON shifts;
CREATE POLICY "Allow anon delete" ON shifts
  FOR DELETE USING (TRUE);

-- ============================================================================
-- SAMPLES TABLE - Full read/write access
-- ============================================================================
DROP POLICY IF EXISTS "Allow anon read" ON samples;
CREATE POLICY "Allow anon read" ON samples
  FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Allow anon insert" ON samples;
CREATE POLICY "Allow anon insert" ON samples
  FOR INSERT WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Allow anon update" ON samples;
CREATE POLICY "Allow anon update" ON samples
  FOR UPDATE USING (TRUE) WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Allow anon delete" ON samples;
CREATE POLICY "Allow anon delete" ON samples
  FOR DELETE USING (TRUE);

-- ============================================================================
-- MIGRATIONS TABLE - Read-only for anon (prevents accidental resets)
-- ============================================================================
DROP POLICY IF EXISTS "Allow anon read migrations" ON migrations;
CREATE POLICY "Allow anon read migrations" ON migrations
  FOR SELECT USING (TRUE);
