import { createClient } from '@supabase/supabase-js';
//import dotenv from 'dotenv'

//dotenv.config({path:['.env.local', '.env']})

const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export { supabaseClient };
