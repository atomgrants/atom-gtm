import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { supabaseAdmin } from '@/lib/supabase';

import { EmailInsert } from '@/types/email';

/** Merge classes with tailwind-merge with clsx full feature */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**email utils***/

/*insert email into db*/
export const insertEmail = async (email: EmailInsert) => {
  const { data, error } = await supabaseAdmin.from('emails').insert(email);
  if (error) {
    console.error('Error inserting email:', error);
    return {
      success: false,
      message: 'Error inserting email',
      error: error,
    }
  }

  console.log('Email inserted:', data);
  return {
    success: true,
    message: 'Email inserted',
    data: data,
  }
}

/*get last saved email*/
export async function getLastSavedEmail() {
  const { data, error } = await supabaseAdmin
    .from('emails')
    .select('date_time_sent, gmail_message_id')
    .order('date_time_sent', { ascending: false })
    .limit(1)
    .single();
    
  if (error) {
    console.log('No emails in database yet');
    return null;
  }
  
  return data;
}

/*get new emails since last saved email*/
export async function getNewEmails(gmail: any) {
  // Get the most recent email from database
  const lastSavedEmail = await getLastSavedEmail();
  
  if (!lastSavedEmail) {
    // No emails in DB yet - get recent emails (last 24 hours)
    console.log('No emails in database, fetching last 24 hours');
    return getEmailsSinceDate(gmail, new Date(Date.now() - 24 * 60 * 60 * 1000));
  }
  
  // Convert database timestamp to Unix timestamp for Gmail query
  const lastSavedTime = new Date(lastSavedEmail.date_time_sent);
  const unixTimestamp = Math.floor(lastSavedTime.getTime() / 1000);
  
  console.log('Last saved email time:', lastSavedTime.toISOString());
  console.log('Searching for emails after Unix timestamp:', unixTimestamp);
  
  const response = await gmail.users.messages.list({
    userId: 'me',
    q: `after:${unixTimestamp}`,
    maxResults: 50
  });
  
  const messageIds = response.data.messages || [];
  
  // Get full message details
  const emails = await Promise.all(
    messageIds.map(async (msg: { id: string }) => {
      const email = await gmail.users.messages.get({
        userId: 'me',
        id: msg.id,
        format: 'metadata',
        metadataHeaders: ['subject', 'from', 'date']
      });
      return email.data;
    })
  );
  
  // Filter out emails that might have same timestamp as last saved
  // (Gmail query is inclusive, so we might get the last saved email again)
  const newEmails = emails.filter(email => {
    const emailTime = new Date(parseInt(email.internalDate));
    return emailTime > lastSavedTime;
  });
  
  console.log(`Found ${emails.length} emails from query, ${newEmails.length} are actually new`);
  
  return newEmails;
}

async function getEmailsSinceDate(gmail: any, sinceDate: Date) {
  const unixTimestamp = Math.floor(sinceDate.getTime() / 1000);
  
  const response = await gmail.users.messages.list({
    userId: 'me',
    q: `after:${unixTimestamp}`,
    maxResults: 50
  });
  
  const messageIds = response.data.messages || [];
  
  return Promise.all(
    messageIds.map(async (msg: { id: string }) => {
      const email = await gmail.users.messages.get({
        userId: 'me',
        id: msg.id,
        format: 'metadata',
        metadataHeaders: ['subject', 'from', 'date']
      });
      return email.data;
    })
  );
}


