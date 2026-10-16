import { supabase } from './supabase.ts';

// ============================================================================
// SHIFTS
// ============================================================================
export async function fetchShifts() {
  const { data, error } = await supabase
    .from('shifts')
    .select('*')
    .order('date', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function insertShift(shift: any) {
  const { data, error } = await supabase
    .from('shifts')
    .insert([{
      date: shift.date,
      mix: shift.mix,
      tons_ct: shift.tonsCt,
      locations: shift.locations,
      bridge_deck: shift.bridge,
      seq: shift.seq || 0,
    }])
    .select();
  if (error) throw error;
  return data?.[0];
}

export async function updateShift(id: string, updates: any) {
  const { data, error } = await supabase
    .from('shifts')
    .update({
      date: updates.date,
      mix: updates.mix,
      tons_ct: updates.tonsCt,
      locations: updates.locations,
      bridge_deck: updates.bridge,
      seq: updates.seq || 0,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select();
  if (error) throw error;
  return data?.[0];
}

export async function deleteShift(id: string) {
  const { error } = await supabase
    .from('shifts')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// ============================================================================
// LOTS
// ============================================================================
export async function fetchLots() {
  const { data, error } = await supabase
    .from('lots')
    .select('*')
    .order('lot_no', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function insertLot(lot: any) {
  const { data, error } = await supabase
    .from('lots')
    .insert([{
      lot_no: lot.lotNo,
      index: lot.index,
      mix_key: lot.mixKey,
      expiration_date: lot.expirationDate || null,
    }])
    .select();
  if (error) throw error;
  return data?.[0];
}

export async function updateLot(id: string, updates: any) {
  const { data, error } = await supabase
    .from('lots')
    .update({
      lot_no: updates.lotNo,
      index: updates.index,
      mix_key: updates.mixKey,
      expiration_date: updates.expirationDate || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select();
  if (error) throw error;
  return data?.[0];
}

export async function deleteLot(id: string) {
  const { error } = await supabase
    .from('lots')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// ============================================================================
// SAMPLES
// ============================================================================
export async function fetchSamples(lotId: string) {
  const { data, error } = await supabase
    .from('samples')
    .select('*')
    .eq('lot_id', lotId)
    .order('sublot_number', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function insertSamples(lotId: string, samples: any[]) {
  const rows = samples.map((s, idx) => ({
    lot_id: lotId,
    sublot_number: idx + 1,
    ton_ct: s.tonCt || null,
    taken: s.taken || false,
  }));

  const { data, error } = await supabase
    .from('samples')
    .insert(rows)
    .select();
  if (error) throw error;
  return data || [];
}

export async function updateSample(id: string, updates: any) {
  const { data, error } = await supabase
    .from('samples')
    .update({
      ton_ct: updates.tonCt || null,
      taken: updates.taken || false,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select();
  if (error) throw error;
  return data?.[0];
}

export async function deleteSample(id: string) {
  const { error } = await supabase
    .from('samples')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// ============================================================================
// BULK OPERATIONS
// ============================================================================
export async function clearAllData() {
  const { error: e1 } = await supabase.from('samples').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  const { error: e2 } = await supabase.from('lots').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  const { error: e3 } = await supabase.from('shifts').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (e1 || e2 || e3) throw new Error('Failed to clear data');
}
