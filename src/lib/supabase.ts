import { createClient } from '@supabase/supabase-js';
//import dotenv from 'dotenv'

//dotenv.config({path:['.env.local', '.env']})

// Validate environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error('Missing environment variable: SUPABASE_URL');
}

if (!supabaseServiceRoleKey) {
  throw new Error('Missing environment variable: SUPABASE_SERVICE_ROLE_KEY');
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

export { supabaseAdmin };
