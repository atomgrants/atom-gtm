import { NextResponse } from 'next/server';

import { removeExpiredJobs } from '@/lib/jobUtils';
import { processJobEmail } from '@/lib/openai';
import { supabaseAdmin } from '@/lib/supabase';

import { jobKeywords } from '@/data/keywords';

export async function GET(request: Request) {

  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get('Authorization');
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      {
        success: false,
        message: 'Unauthorized',
      },
      { status: 401 }
    );
  }
  // Clean up expired jobs first
  await removeExpiredJobs();

  // First, get the latest time from the jobs table
  const { data: latestJob, error: latestJobError } = await supabaseAdmin
    .from('jobs')
    .select('time')
    .order('time', { ascending: false })
    .limit(1);

  if (latestJobError) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Error fetching latest job:', latestJobError);
    }
    return NextResponse.json(
      { error: latestJobError.message },
      { status: 500 }
    );
  }

  // Build the filter for job-related emails
  const orFilter = jobKeywords
    .map((keyword) => `subject.ilike.%${keyword}%`)
    .join(',');

  // Build the query
  let query = supabaseAdmin.from('emails').select('*').or(orFilter);

  // Add date filter if we have a latest job
  if (latestJob && latestJob.length > 0) {
    query = query.gt('date_time_sent', latestJob[0].time);
  }

  const { data, error } = await query;

  if (error || !data) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error(error);
    }
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

  //console.log(data.length);

  return NextResponse.json({
    success: true,
    message: 'Job Emails fetched Successfully',
    jobEmail: data,
  });
}
