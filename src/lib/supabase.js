import { createClient } from '@supabase/supabase-js';

// Supabase credentials
const SUPABASE_URL = 'https://drtfgwicawrazeytybkb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRydGZnd2ljYXdyYXpleXR5YmtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4ODU0OTYsImV4cCI6MjA2OTQ2MTQ5Nn0.L2qEbH-Kjvn-bY6K_aq8AeDPO7YPzgl0-pST-ql0wXY';

// Verify credentials are available
if(SUPABASE_URL === 'https://<PROJECT-ID>.supabase.co' || SUPABASE_ANON_KEY === '<ANON_KEY>'){
  throw new Error('Missing Supabase variables');
}

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

export default supabase;