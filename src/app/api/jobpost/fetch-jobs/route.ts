import { NextResponse } from 'next/server';

import { processJobEmail } from '@/lib/openai';
import { supabaseAdmin } from '@/lib/supabase';

import { jobKeywords } from '@/data/keywords';

export async function GET(request: Request) {
  const orFilter = jobKeywords
    .map((keyword) => `subject.ilike.%${keyword}%`)
    .join(',');
  const { data, error } = await supabaseAdmin
    .from('emails')
    .select('*')
    .or(orFilter);

  if (error || !data) {
    console.error(error);
    return NextResponse.json(
      { error: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }

  // processJobEmails
  const jobEmails = data.map(
    ({ sender_name, body, subject, date_time_sent }) => ({
      sender_name,
      body,
      subject,
      date_time_sent,
    })
  );

  processJobEmail(jobEmails);

  console.log(data.length);
  //console.log(data);

  return NextResponse.json({
    success: true,
    message: 'Job Emails fetched Successfully',
    jobEmail: data,
  });
}
