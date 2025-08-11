import crypto from 'crypto';

import { supabaseAdmin } from '@/lib/supabase';

import { EmailInsert } from '@/types/email';
import { JobInsert, OpenAIOutput } from '@/types/job';

export const insertJob = async (job: JobInsert) => {
  const { error } = await supabaseAdmin.from('jobs').insert(job).select();
  if (error) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Error inserting job:', error);
    }
    return {
      success: false,
      message: 'Failed inserting job',
      status: 500,
    };
  }
};

export const removeExpiredJobs = async () => {
  // Calculate the date 40 days ago
  const fortyDaysAgo = new Date();
  fortyDaysAgo.setDate(fortyDaysAgo.getDate() - 40);

  const { data, error } = await supabaseAdmin
    .from('jobs')
    .delete()
    .lt('created_at', fortyDaysAgo.toISOString())
    .select();

  if (error) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Error deleting expired jobs:', error);
    }
    return {
      success: false,
      message: 'Failed to delete expired jobs',
      error,
    };
  }

  return {
    success: true,
    deletedCount: data?.length || 0,
    message: `Deleted ${data?.length || 0} jobs older than 40`,
  };
};

export const convertJobToDbFormat = (
  jobPost: EmailInsert,
  openaiOutput: OpenAIOutput
): JobInsert => {
  if (!openaiOutput) {
    //console.log('Error: Openai returned an Undefined output');
    //console.log(openaiOutput);
    return {
      sender_name: '',
      job_title: '',
      organization: '',
      job_url: '',
      email_body: '',
      organization_domain: '',
      time: '',
    };
  }
  return {
    sender_name: openaiOutput.sender_name || '',
    job_title: openaiOutput.job_title || '',
    organization: openaiOutput.organization || '',
    job_url: openaiOutput.url || '',
    email_body: openaiOutput.body || '',
    organization_domain: openaiOutput.organization_domain || '',
    time: jobPost.date_time_sent || '',
  };
};

/**
 * Normalize text: strip HTML, collapse whitespace, lowercase.
 */
function normalizeBody(text: string): string {
  return text
    .replace(/<[^>]+>/g, '') // Remove HTML tags
    .replace(/\s+/g, ' ') // Collapse whitespace
    .trim()
    .toLowerCase();
}

/**
 * Compute hash
 */
function computeHash(text: string): string {
  return crypto.createHash('sha256').update(text, 'utf8').digest('hex');
}

/**
 * Deduplicate messages based on normalized body hash.
 */
export function deduplicateByBody(messages: EmailInsert[]): EmailInsert[] {
  const seen = new Set<string>();
  const unique: EmailInsert[] = [];

  for (const msg of messages) {
    const normalized = normalizeBody(msg.body);
    const hash = computeHash(normalized);

    if (!seen.has(hash)) {
      seen.add(hash);
      unique.push(msg);
    }
  }

  return unique;
}
