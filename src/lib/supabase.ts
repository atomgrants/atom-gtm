import { createClient } from '@supabase/supabase-js';
//import dotenv from 'dotenv'

//dotenv.config({path:['.env.local', '.env']})

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export { supabaseAdmin };
