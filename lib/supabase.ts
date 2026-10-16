import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0';

const SUPABASE_URL = 'https://imevvlqetlptfglgoesr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltZXZ2bHFldGxwdGZnbGdvZXNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE4Njc0NzQsImV4cCI6MjEwNzQ0MzQ3NH0.oIS7wnCRR5IbVlc8L4IyhFWqg0wxPSCFAGy4o832Uo4';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
