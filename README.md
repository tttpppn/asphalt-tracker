# PWL Asphalt Sampling Tracker

A modern web application for managing asphalt lot inventory and sample tracking with **real-time Supabase persistence**.

## ✨ Features

- 📦 **Lot Management** — Create and track asphalt mix lots with expiration dates
- 📊 **Sampling Tracker** — Record shifts and allocate tonnage across lots using a rolling 30-day window
- 🎯 **Sample Generation** — Automatically generate sample records for each lot
- ☁️ **Cloud Sync** — Real-time data persistence to Supabase
- 📱 **Offline Mode** — Works offline with localStorage fallback
- 🔄 **Multi-tab Sync** — Automatic sync across browser tabs
- 📥 **Import/Export** — CSV and JSON import/export for data portability

## 🚀 Quick Start

### Option 1: Use the Live App
Visit the deployed app: **https://tttpppn.github.io/asphalt-tracker/**

### Option 2: Run Locally

1. **Clone the repo**
   ```bash
   git clone https://github.com/tttpppn/asphalt-tracker.git
   cd asphalt-tracker
   ```

2. **Open in browser**
   - Simply open `index.html` in your web browser
   - Or use a local server:
     ```bash
     python -m http.server 8000
     # Then visit: http://localhost:8000
     ```

## ⚙️ Setup

### Configure Supabase

1. **Create a Supabase project** at [supabase.com](https://supabase.com)
2. **Copy your credentials** from project Settings → API
3. **Update `index.html`** (lines ~435-436):
   ```javascript
   const BACKEND = 'supabase';
   const SUPABASE_URL = 'https://your-project.supabase.co';
   const SUPABASE_ANON_KEY = 'your-anon-key-here';
   ```
4. **Apply the database schema**:
   - Go to Supabase SQL Editor
   - Run: `supabase-schema.sql`
   - Run: `supabase-anon-temp.sql` (temporary RLS policies)

### Disable RLS (For Development)

```sql
ALTER TABLE settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE lots DISABLE ROW LEVEL SECURITY;
ALTER TABLE shifts DISABLE ROW LEVEL SECURITY;
ALTER TABLE samples DISABLE ROW LEVEL SECURITY;
```

## 📚 How to Use

### Create a Lot
1. Click **"New Lot"**
2. Enter the mix name (e.g., "PMA 0.5")
3. Click **Create**

### Add a Shift
1. In **Sampling Tracker**, select:
   - Date (defaults to today)
   - Mix (from your lots)
   - Tonnage
2. Click **"Add"**
3. The shift will be allocated across available lots using a rolling 30-day window

### Generate Samples
1. Click **"Generate Samples"**
2. Samples are automatically created for all lots
3. View samples in the **"Samples"** section

### Track Samples
- Mark samples as **"Taken"** by clicking the checkbox
- Export data as CSV or JSON for further analysis

## 🏗️ Architecture

### Frontend
- **Single-file HTML app** — No build process needed
- **Vanilla JavaScript** — No frameworks
- **LocalStorage** — Offline-first design

### Backend
- **Supabase** — PostgreSQL with automatic REST API
- **Tables**:
  - `settings` — App configuration (lot numbering)
  - `lots` — Lot inventory with creation/expiration dates
  - `shifts` — Tonnage allocations by date/mix
  - `samples` — Sample records per lot/sublot
  - `migrations` — Track data migration history

### Data Sync
- **Async commits** — All state changes persist to Supabase
- **Optimistic updates** — UI updates immediately, data syncs in background
- **Offline fallback** — localStorage used when Supabase unavailable

## 📖 Key Algorithms

### Rolling 30-Day Window Allocation
When you add a shift, it's allocated to lots created within a rolling 30-day window from the shift date:
- Lot created on 2026-09-03, shift on 2026-09-03 ✅ (0 days)
- Lot created on 2026-09-03, shift on 2026-10-01 ✅ (28 days)
- Lot created on 2026-09-03, shift on 2026-10-04 ❌ (31 days, expired)

Expired lots create new lot records automatically.

### Sample Generation
Generates 7 samples per lot based on:
- Lot tonnage allocation
- Sublot distribution (uniform spread across ton_ct ranges)

## 🧪 Testing

### Run Tests
Open the app and click **"Self-Test"** to run built-in validation tests.

### Manual Smoke Tests
1. Create a test lot: `TEST-MIX`
2. Add a shift: 1000 tons, today's date
3. Generate samples
4. Verify in Supabase dashboard:
   - `lots` table has the TEST-MIX row
   - `shifts` table has the 1000-ton shift
   - `samples` table has 7 samples

## 🚢 Deployment

### GitHub Pages (Recommended)
1. Push code to GitHub
2. Go to repo **Settings** → **Pages**
3. Select `master` branch, `/ (root)` folder
4. Click **Save**
5. App is live at: `https://your-username.github.io/asphalt-tracker/`

### Other Options
- **Netlify** — Drag-and-drop `index.html`
- **Vercel** — Import from GitHub
- **Traditional hosting** — Upload `index.html` to any web server

## 📝 Development Notes

### Recent Updates (2026-10-20)
- ✅ **UI/UX Fixes**:
  - Fixed Clear All button being blocked by auth modal overlay
  - Improved button listener initialization (attach before auth check)
  - Better error handling for Supabase CDN loading failures
  
- ✅ **Data Management**:
  - Clear All now properly deletes Supabase data before reload
  - Fixed backup restore showing empty folder placeholders
  - Removed redundant hardReset function (consolidated into clearAll)
  
- ✅ **Logging & Debugging**:
  - Added detailed logging to `deleteShift()` function with emoji prefixes
  - Added detailed logging to `deleteLot()` function with emoji prefixes
  - Better visibility into delete operations in browser console
  
- ✅ **Example Data**:
  - Fixed: loadExampleData now uses raw shifts only
  - Lots and samples are auto-generated through proper app logic
  - Properly demonstrates sampling tracker allocation instead of bypassing it

### Phase History
- **Phase 0**: Local storage foundation
- **Phase 1**: Supabase schema & basic CRUD
- **Phase 2-3**: Async loading with offline fallback
- **Phase 4**: Async persistence (commit/sync)
- **Phase 5**: Convert all functions to async
- **Phase 6**: Failure injection & multi-tab tests
- **Phase 7**: Production cutover ✅
- **Phase 8**: Button interactions & data management fixes (current)

### Important Files
- `index.html` — Single-file app (all code & UI)
- `supabase-schema.sql` — Database schema
- `supabase-anon-temp.sql` — RLS policies (development)
- `test-phase-6.html` — Failure injection tests

### Future Improvements
- [ ] Authentication (replace anon access)
- [ ] Conflict resolution (CRDTs or operational transforms)
- [ ] Atomic RPC for multi-step operations
- [ ] Real-time subscriptions (Supabase Realtime)
- [ ] Mobile app (React Native)

## 🛠️ Troubleshooting

### "Supabase not configured" error
- Check that `SUPABASE_URL` and `SUPABASE_ANON_KEY` are set in `index.html`
- Verify RLS policies are applied (or disabled for development)

### Data not syncing
- Check browser console (F12) for errors
- Verify Supabase credentials are correct
- Make sure RLS is disabled on tables (for development)

### Offline mode not working
- Clear browser cache (Ctrl+Shift+Delete)
- Check localStorage is enabled in browser settings

## 📄 License

MIT License — See LICENSE file for details

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📧 Contact

For questions or issues, open a GitHub issue or email: taiphucnguyen@gmail.com

---

**Status**: 🚀 Production Ready (Phase 7 Complete)
