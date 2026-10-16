const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://vybyqhezartloqotaxrf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5YnlxaGV6YXJ0bG9xb3RheHJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE5MzAzNjgsImV4cCI6MjEwNzUwNjM2OH0.rCQ6R8xarYFpIh4IYOoEjekTyZyYy339umnULF7BGfM';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkData() {
  try {
    console.log('\n========== SETTINGS ==========');
    const { data: settings, error: settingsErr } = await supabase.from('settings').select('*');
    if (settingsErr) console.error('Error:', settingsErr.message);
    else console.log(JSON.stringify(settings, null, 2));

    console.log('\n========== SHIFTS ==========');
    const { data: shifts, error: shiftsErr } = await supabase.from('shifts').select('*').order('date', { ascending: false });
    if (shiftsErr) console.error('Error:', shiftsErr.message);
    else console.log(`Found ${shifts?.length || 0} shifts`), shifts?.length > 0 && console.log(JSON.stringify(shifts.slice(0, 5), null, 2));

    console.log('\n========== LOTS ==========');
    const { data: lots, error: lotsErr } = await supabase.from('lots').select('*').order('lot_no');
    if (lotsErr) console.error('Error:', lotsErr.message);
    else console.log(`Found ${lots?.length || 0} lots`), lots?.length > 0 && console.log(JSON.stringify(lots.slice(0, 5), null, 2));

    console.log('\n========== SAMPLES ==========');
    const { data: samples, error: samplesErr } = await supabase.from('samples').select('*').order('lot_no');
    if (samplesErr) console.error('Error:', samplesErr.message);
    else console.log(`Found ${samples?.length || 0} samples`), samples?.length > 0 && console.log(JSON.stringify(samples.slice(0, 5), null, 2));

  } catch (err) {
    console.error('Connection error:', err.message);
  }
  process.exit(0);
}

checkData();
