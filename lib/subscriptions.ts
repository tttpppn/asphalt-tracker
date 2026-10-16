import { supabase } from './supabase.ts';

export function subscribeToShifts(callback: (shift: any) => void) {
  const subscription = supabase
    .from('shifts')
    .on('*', (payload) => {
      callback(payload.new || payload.old);
    })
    .subscribe();
  return subscription;
}

export function subscribeToLots(callback: (lot: any) => void) {
  const subscription = supabase
    .from('lots')
    .on('*', (payload) => {
      callback(payload.new || payload.old);
    })
    .subscribe();
  return subscription;
}

export function subscribeToSamples(callback: (sample: any) => void) {
  const subscription = supabase
    .from('samples')
    .on('*', (payload) => {
      callback(payload.new || payload.old);
    })
    .subscribe();
  return subscription;
}

export async function unsubscribe(subscription: any) {
  if (subscription) {
    await supabase.removeSubscription(subscription);
  }
}
