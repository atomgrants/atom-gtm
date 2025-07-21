import { NextResponse } from 'next/server';

import { contentKeywordFilter } from '@/lib/emailUtils';
import { supabaseAdmin } from '@/lib/supabase';

import { jobKeywords } from '@/data/keywords';

export async function GET(request: Request) {
  const { data, error } = await supabaseAdmin
    .from('emails')
    .select('*')
    .eq('listserv_name', 'ResAdmin')
    .eq('subject', 'Job Posting');

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const jobPosts = data.filter((email) => contentKeywordFilter(email.body, email.subject, jobKeywords));
  console.log(jobPosts);

  return NextResponse.json({ success: true });
}