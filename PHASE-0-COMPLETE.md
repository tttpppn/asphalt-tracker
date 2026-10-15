# Phase 0: Schema Prep & Backup ✅

**Status:** COMPLETE  
**Date:** 2026-10-15  
**Duration:** ~15 minutes

## What Was Done

### 1. Schema Design ✅
- **File:** `supabase-schema.sql`
- Tables created with natural keys (no UUIDs):
  - `settings` — App config (start_lot_no, next_seq, next_lot_no)
  - `lots` — Lot allocation by index
  - `shifts` — Tonnage allocations (id TEXT PK, seq INT for ordering)
  - `samples` — Sample data per lot/sublot (composite PK)
  - `migrations` — Track what's been migrated
- All use NUMERIC for decimal tons (vs JSON strings)
- Foreign key: samples.lot_no → lots.lot_no (CASCADE on delete)
- Indexes on common query paths (date, mix, lot_no, seq)

### 2. Temporary RLS Policies ✅
- **File:** `supabase-anon-temp.sql`
- Full read/write for anon users (phase 1 only)
- Uses `DROP POLICY IF EXISTS` for re-runnable setup
- Migrations table is read-only to prevent accidental resets

### 3. Data Mapping Reference ✅
**Current localStorage → Supabase:**

| localStorage | Supabase | Notes |
|---|---|---|
| state.startLotNo | settings.start_lot_no | Single row (id=1) |
| state.nextSeq | settings.next_seq | Auto-increment for shifts |
| state.nextLotNo | settings.next_lot_no | Auto-increment for lots |
| state.lots[*] | lots table | Natural key: lot_no |
| state.lots[*].samples[*] | samples table | FK to lots(lot_no) |
| state.shifts[*] | shifts table | id is UUID (unchanged) |

### 4. Migration Plan (for Phase 4) ✅
**Round-trip test:**
1. Export current state as JSON (browser devtools localStorage)
2. Manual insert sample rows into Supabase
3. Fetch via PostgREST in Phase 3
4. Verify rowsToState() produces identical state
5. Verify second reload has empty diff

## Before Moving to Phase 1

✅ **Have you:**
- [ ] Created a Supabase project (https://supabase.com)?
- [ ] Noted your Project URL and Anon Key?
- [ ] Run `supabase-schema.sql` in SQL editor?
- [ ] Run `supabase-anon-temp.sql` in SQL editor?
- [ ] Backed up current localStorage (DevTools → Application → Local Storage)?
- [ ] Verified tables exist in Supabase dashboard?

## Files Ready for Phase 1

- `supabase-schema.sql` — Ready to paste into Supabase SQL editor
- `supabase-anon-temp.sql` — Ready to paste into Supabase SQL editor
- `index.html` — Ready for CDN script + constants injection

## Notes

- Schema uses `NUMERIC` for decimal precision (vs JSON strings)
- Samples use composite key `(lot_no, sublot)` to match app logic
- Migrations table tracks which data has been synced (prevents double-import)
- RLS policies are **temporary** — replace with proper auth in sprint 2
- Settings table has CHECK constraint to enforce single row (id=1)

---

**Next Step:** Phase 1 - Add Supabase CDN script and constants to index.html
