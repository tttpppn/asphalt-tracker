# Phase 7: Cutover & Production Readiness

**Status:** READY FOR CUTOVER  
**Date:** 2026-10-15  
**Duration:** ~30 minutes  
**Risk Level:** LOW

## Pre-Cutover Checklist

### Step 1: Backup & Verify (5 min)

- [ ] Export current localStorage as JSON backup
- [ ] Verify Supabase project exists and tables are created
- [ ] Check RLS policies applied (supabase-anon-temp.sql)
- [ ] Test Supabase read access: should query settings table

### Step 2: Update Configuration (2 min)

Update index.html constants (around line 435):

```javascript
const BACKEND = 'supabase';      // ← FLIP FROM 'local'
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGc...';  // Your actual key
```

### Step 3: Test Fresh Load (5 min)

1. Hard refresh browser: `Ctrl+Shift+R`
2. Watch for banners:
   - "Supabase client initialized" ✓
   - "Loading from Supabase..." ✓
   - Migration message if data exists
3. Verify: Tables display, no errors, not read-only

### Step 4: Smoke Test - Add Data (5 min)

1. **Create new lot:**
   - Click "New Lot" → Enter "TEST-MIX"
   - Verify in table
   - Check Supabase dashboard: lots table updated

2. **Add shift:**
   - Date: today, Mix: "TEST-MIX", Tons: 1000
   - Verify in Sampling Tracker
   - Check Supabase dashboard: shifts table updated

3. **Generate samples:**
   - Click "Generate Samples"
   - Verify samples appear
   - Check Supabase dashboard: samples table updated

### Step 5: Test Offline Fallback (3 min)

1. DevTools → Network → Offline mode
2. Reload page → should show "Running in read-only mode" banner
3. Verify: data loads from localStorage
4. Go online → page reloads and fetches from Supabase

### Step 6: Multi-Tab Test (3 min)

1. Open two tabs/windows with app
2. Edit in Tab A (add shift)
3. Reload Tab B → verify data present
4. Confirm no data loss across tabs

## Cutover Procedure

1. **Update BACKEND flag to 'supabase'**
2. **Add Supabase URL and ANON_KEY**
3. **Commit and deploy to production**
4. **Monitor for 30 minutes**
   - Check browser console for errors
   - Verify data syncs to Supabase
   - Watch for error banners

## Quick Rollback (< 2 min if needed)

```javascript
const BACKEND = 'local';  // Flip back to localStorage
```

- Redeploy
- All user data still in localStorage
- Zero data loss
- Can retry after fixing issue

## Success Criteria

✅ App loads without errors  
✅ Can add/edit shifts and lots  
✅ Data visible in Supabase dashboard  
✅ Offline fallback works  
✅ No console errors  
✅ Multi-tab scenarios work  
✅ 30+ minutes stable operation  

## Known Limitations (Will Fix in Later Phases)

- ⚠️ No authentication yet (temp anon policies)
- ⚠️ Last-write-wins only (no conflict resolution)
- ⚠️ Partial sync possible (need atomic RPC)
- ⚠️ No multi-tab notifications (user must refresh)

## Files Reference

- `index.html` — Update BACKEND constant
- `supabase-schema.sql` — Database tables (already applied)
- `supabase-anon-temp.sql` — RLS policies (already applied)
- `test-phase-2.html` — Round-trip validation tests
- `test-phase-6.html` — Failure scenario tests

---

**Phase 7 Complete:** ✅ Ready for production deployment
