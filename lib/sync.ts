import { fetchShifts, fetchLots, fetchSamples, insertShift, insertLot, insertSamples, clearAllData } from './database.ts';

const STORAGE_KEY = 'pwlTracker.v1';

export async function migrateLocalStorageToSupabase() {
  const localData = localStorage.getItem(STORAGE_KEY);
  if (!localData) return false; // No local data to migrate

  try {
    const parsed = JSON.parse(localData);
    
    // Check if Supabase already has data
    const existingShifts = await fetchShifts();
    if (existingShifts.length > 0) {
      console.log('Supabase already has data, skipping migration');
      return false;
    }

    // Migrate shifts
    if (parsed.shifts && Array.isArray(parsed.shifts)) {
      for (const shift of parsed.shifts) {
        await insertShift(shift);
      }
    }

    // Migrate lots and samples
    if (parsed.lots && Array.isArray(parsed.lots)) {
      for (const lot of parsed.lots) {
        const createdLot = await insertLot(lot);
        if (lot.samples && Array.isArray(lot.samples)) {
          await insertSamples(createdLot.id, lot.samples);
        }
      }
    }

    console.log('Migration complete');
    return true;
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

export async function loadStateFromSupabase() {
  const shifts = await fetchShifts();
  const lots = await fetchLots();

  // Build lots with their samples
  const lotsWithSamples = await Promise.all(
    lots.map(async (lot: any) => {
      const samples = await fetchSamples(lot.id);
      return {
        id: lot.id,
        lotNo: lot.lot_no,
        index: lot.index,
        mixKey: lot.mix_key,
        expirationDate: lot.expiration_date,
        samples: samples.map((s: any) => ({
          id: s.id,
          tonCt: s.ton_ct,
          taken: s.taken,
        })),
      };
    })
  );

  return {
    shifts: shifts.map((s: any) => ({
      id: s.id,
      date: s.date,
      mix: s.mix,
      tonsCt: s.tons_ct,
      locations: s.locations,
      bridge: s.bridge_deck,
      seq: s.seq || 0,
    })),
    lots: lotsWithSamples,
  };
}
