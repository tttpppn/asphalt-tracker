# Phase 0: Schema Prep - Execution Checklist

**Status:** Ready to execute in next session
**Duration:** ~30 minutes
**Risk:** Low

---

## Pre-Flight

✅ Current state: `db51add107ebf73135d1a963cc3a1e48ccd333d6` (working localStorage app)
✅ Blueprint saved: `memory/supabase-integration-blueprint.md`
✅ Schema files ready:
  - `supabase-schema.sql` - Revised with natural keys, NUMERIC, settings table
  - `supabase-anon-temp.sql` - Temporary anon policies for Phase 1-6

---

## Tasks (in order)

### 1. Backup Current Data
- [ ] In the app, click **Export JSON** 
- [ ] Save as `asphalt-tracker-backup-$(date).json`
- [ ] Verify file is not empty

### 2. Confirm Supabase Project
- [ ] Open Supabase dashboard
- [ ] Confirm project is created and accessible
- [ ] Note the project URL and anon key (already in code)

### 3. Apply Main Schema
- [ ] Open Supabase SQL Editor
- [ ] Copy entire contents of `supabase-schema.sql`
- [ ] Paste into editor
- [ ] Click **Run**
- [ ] Verify no errors (should show 4 tables created: shifts, lots, samples, settings)

**Check:** Go to **Table Editor** and confirm:
- ✅ `shifts` table exists with columns: id (TEXT), date, mix, tons_ct (NUMERIC), locations, bridge_deck, seq
- ✅ `lots` table exists with columns: lot_no (INT PK), idx, mix, mix_key, created_by, created_date, expiration_date
- ✅ `samples` table exists with columns: lot_no, sublot_number, ton_ct (NUMERIC), taken, PK (lot_no, sublot_number)
- ✅ `settings` table exists with columns: id, start_lot_no, next_seq, next_lot_no

### 4. Apply Temporary Anon Policies
- [ ] Copy entire contents of `supabase-anon-temp.sql`
- [ ] Paste into same SQL Editor
- [ ] Click **Run**
- [ ] Verify no errors

**Check:** Go to **Authentication** > **Policies** and confirm policies for anon access exist

### 5. Initialize Settings Table
- [ ] In SQL Editor, run:
```sql
INSERT INTO settings (id, start_lot_no, next_seq, next_lot_no) 
VALUES (1, 1, 0, 1)
ON CONFLICT (id) DO UPDATE SET updated_at = NOW();
```
- [ ] Verify row appears in settings table

---

## Success Criteria

✅ All 4 tables exist with correct columns and keys
✅ RLS is enabled on all tables
✅ Anon policies allow read/write on all tables
✅ Settings table has one row with id=1
✅ No errors in SQL Editor

---

## Next Step

Once Phase 0 is complete, Phase 1 begins: Add Supabase CDN script and constants to index.html

---

## Rollback (if needed)

If anything fails:
1. Delete the 4 new tables in Supabase
2. The app still works with localStorage (committed as db51add)
3. No data is lost (you have the Export JSON backup)
