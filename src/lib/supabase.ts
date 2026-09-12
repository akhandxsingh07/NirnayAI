import { createClient } from '@supabase/supabase-js';

const fallbackUrl = 'https://nllkmunqdkznhnhfrric.supabase.co';
const fallbackPublishableKey = 'sb_publishable_sEfaduAFppFtdtm5tEAerA_bcpMpbKF';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || fallbackUrl;
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || fallbackPublishableKey;

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export const SUPABASE_PROJECT_URL = supabaseUrl;
