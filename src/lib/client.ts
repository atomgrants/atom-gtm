import { createClient } from '@supabase/supabase-js';
//import dotenv from 'dotenv'

//dotenv.config({path:['.env.local', '.env']})

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_URL');
}

if (!supabaseAnonKey) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export { supabaseClient };
