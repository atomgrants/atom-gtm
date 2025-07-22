import { NextResponse } from 'next/server';

import { supabaseAdmin } from '@/lib/supabase';

import { jobKeywords } from '@/data/keywords';

export async function GET(request: Request) {
  const orFilter = jobKeywords.map((keyword) => `subject.ilike.%${keyword}%`).join(',');
  const { data, error } = await supabaseAdmin
    .from('emails')
    .select('*')
    .or(orFilter)

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  console.log(data.length);
  console.log(data);

  return NextResponse.json({ success: true });
}