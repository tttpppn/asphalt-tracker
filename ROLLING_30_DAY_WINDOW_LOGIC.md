# Rolling 30-Day Window Logic (Refactored)

## Core Concept

Instead of:
- Fixed expiration dates on lots
- Index-based range allocation (broken)

We now use:
- **Rolling 30-day windows per mix**
- **Each lot belongs to one 30-day window**
- **Allocate only to lots in the active window**

---

## How It Works

### Step 1: Lot Creation (reconcileLots)

When reconcileLots() runs, it determines which lots are needed by checking two things:

1. **Tonnage threshold**: Do we need more lots to hold the cumulative tonnage?
   - Formula: `neededByTonnage = ceil(cumulativeTons / 3500) - 1`

2. **30-day window**: Has it been 30+ days since the last shift for this mix?
   - If YES → **Start a NEW 30-day window**
   - Assign new lot to this window
   - Set `windowStartDate = currentShiftDate`
   - Set `expirationDate = windowStartDate + 30 days`

**Example Timeline:**

```
2026-07-01: Shift 1 (3000t)
  └─ windowStartDate = 2026-07-01
  └─ Lot 100 created (window: 2026-07-01 to 2026-08-01)

2026-07-16: Shift 2 (3000t) - only 15 days later
  └─ Still in same window (15 < 30)
  └─ Lot 101 created (window: 2026-07-01 to 2026-08-01) - same window

2026-08-28: Shift 3 (1500t) - 43 days after first shift
  └─ NEW WINDOW STARTED! (43 ≥ 30)
  └─ windowStartDate = 2026-08-28
  └─ Lot 102 created (window: 2026-08-28 to 2026-09-27)
  └─ Lots 100, 101 are now CLOSED (outside active window)
```

### Step 2: Tonnage Allocation (splitShiftAcrossLots)

When a shift arrives, allocate it only to lots in the **active window**:

1. **Identify active window**: Which window does this shift fall into?
2. **Find active lots**: Only lots where `windowStartDate ≤ shiftDate ≤ expirationDate`
3. **Allocate sequentially**:
   - For each lot in window order
   - Calculate actual current tonnage: `currentTonnage = beforeCt distribution among lots`
   - Calculate remaining capacity: `3500t - currentTonnage`
   - Allocate as much as the lot can hold
   - Move to next lot with remaining tonnage

**Example Allocation:**

```
2026-07-16 shift (3000t):
┌─ Active window: 2026-07-01 to 2026-08-01
├─ Lot 100: has 3000t, capacity left = 500t → ALLOCATE 500t
├─ Lot 101: has 0t, capacity = 3500t → ALLOCATE 2500t ✓
└─ Result: Lot100:500t, Lot101:2500t

2026-08-28 shift (1500t):
┌─ Active window: 2026-08-28 to 2026-09-27 (NEW WINDOW)
├─ Lot 100: windowStartDate=2026-07-01 → OUTSIDE WINDOW → SKIP
├─ Lot 101: windowStartDate=2026-07-01 → OUTSIDE WINDOW → SKIP
├─ Lot 102: windowStartDate=2026-08-28 → IN WINDOW ✓
├─ Lot 102: has 0t, capacity = 3500t → ALLOCATE 1500t ✓
└─ Result: Lot102:1500t
```

---

## Key Properties

### ✓ No More Misallocations

- **Before**: Lot 102 had 2261t, and algorithm tried to "fill" it by allocating 1239t (magic thinking about ranges)
- **Now**: We simply track current tonnage and fill to 3500t sequentially

### ✓ Automatic Window Management

- **No confusion about lot expiration**: The system automatically creates new lots when 30+ days pass
- **No manual lot management needed**: Just shifts come in, and reconcileLots() handles window transitions

### ✓ Simple, Solid Logic

1. Lots are sorted by creation date
2. Current tonnage is calculated from `beforeCt` and lot order
3. Allocate to lots that are (a) in active window, (b) have capacity
4. No index ranges, no cumulative position overlaps

### ✓ Handles Edge Cases

**Incomplete lot in expired window:**
```
Lot 101: created 2026-07-16, window expires 2026-08-15
Shift arrives 2026-08-28 (outside window)
→ Lot 101 is SKIPPED, tonnage goes to Lot 102 (new window)
→ Lot 101 stays at 2500t (never fills to 3500t) - that's OK
```

**Consecutive shifts in same window:**
```
Shift 1 (2026-07-16): window = 2026-07-01 to 2026-08-01
Shift 2 (2026-07-25): same window (25 < 30 days from 07-01)
→ Both allocate to same lots (Lot 100, 101)
```

---

## Field Definitions

Each lot now has:

| Field | Purpose |
|-------|---------|
| `lotNo` | Unique lot number (100, 101, 102...) |
| `createdDate` | When the lot was created (for reference) |
| `windowStartDate` | When the 30-day window started (key for allocation) |
| `expirationDate` | windowStartDate + 30 days (end of active window) |
| `index` | Legacy (kept for backward compat, not used in allocation) |

---

## Console Output Format

When tracing allocations, you'll see:

```
=== splitShiftAcrossLots (ROLLING 30-DAY WINDOW) ===
shiftDate: 2026-07-16, shift tonnage: 3000t

  Lot 100:
    Current tonnage: 3000t, Available capacity: 500t
    Created: 2026-07-01, Window: 2026-07-01, Expires: 2026-08-01
    ✓ Allocating 500t to Lot 100

  Lot 101:
    Current tonnage: 0t, Available capacity: 3500t
    Created: 2026-07-16, Window: 2026-07-01, Expires: 2026-08-01
    ✓ Allocating 2500t to Lot 101

Final result: 2 lots, splits: Lot100:500t, Lot101:2500t
```

---

## Summary

**The new logic is:**
- ✅ Simple (no magic index calculations)
- ✅ Solid (clear window boundaries)
- ✅ Correct (respects 30-day windows per mix)
- ✅ Automatic (reconcileLots handles all transitions)
