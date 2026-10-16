import { supabase } from './supabase.ts';

const UNIVERSAL_USERNAME = 'asphalt';

export async function signUp(password: string) {
  const { data, error } = await supabase.auth.signUp({
    email: `${UNIVERSAL_USERNAME}@asphalt-tracker.local`,
    password,
  });
  if (error) throw error;
  return data;
}

export async function signIn(password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: `${UNIVERSAL_USERNAME}@asphalt-tracker.local`,
    password,
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user;
}

export function onAuthStateChange(callback: (session: any) => void) {
  const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });
  return authListener?.subscription;
}
