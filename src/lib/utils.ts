import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { extractEmail, extractName, getEmails } from '@/lib/gmail-api';
import { supabaseAdmin } from '@/lib/supabase';

import { EmailInsert } from '@/types/email';
import { NextResponse } from 'next/server';

/** Merge classes with tailwind-merge with clsx full feature */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**email utils***/
/*convert email to db format*/
export const convertEmailToDbFormat = (email: any) => {
  const fromHeader = email.headers?.find((h: { name: string }) => h.name === 'From')?.value || '';
  const subject = email.headers?.find((h: { name: string }) => h.name === 'Subject')?.value || '';
  return {
    sender_name: extractName(fromHeader),
    sender_email_address: extractEmail(fromHeader),
    body: email.text,
    subject: subject,
    date_time_sent: email.internalDate,
    listserv_name: 'ResAdmin',
  }
}

/*insert email into db*/
export const insertEmail = async (email: EmailInsert) => {
  const { data, error } = await supabaseAdmin.from('emails').insert(email).select();
  if (error) {
    console.error('Error inserting email:', error);
    return NextResponse.json({
      success: false,
      message: 'Error inserting email',
      error: error,
    }, { status: 500 });
  }

  console.log('Email inserted:', data);
  return NextResponse.json({
    success: true,
    message: 'Email inserted',
    data: data,
  }, { status: 200 });
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
  let sinceDate = null;
  if (!lastSavedEmail) {
    // No emails in DB yet - get recent emails (last 24 hours)
    console.log('No emails in database, fetching last 24 hours');
    sinceDate = null;
  } else {
    sinceDate = new Date(lastSavedEmail.date_time_sent);
    console.log('Last saved email time:', sinceDate.toISOString());
  }

  let pageToken: string | undefined = undefined;
  const allNewEmails: any[] = [];
  let length = 0;
  let nextPageToken: string | undefined = undefined;
  let attemptFetch = 0;

  do {
    const result = await getEmails(gmail, 50, sinceDate, pageToken);
    const { emailsList } = result;
    length = result.length;
    attemptFetch += length;
    nextPageToken = result.nextPageToken;
    for (const email of emailsList) {
      const emailData = convertEmailToDbFormat(email);
      await insertEmail(emailData);
    }
    allNewEmails.push(...emailsList);
    pageToken = nextPageToken;
  } while (length === 50 && nextPageToken);

  //return true if all emails were fetched, false otherwise
  return {attemptFetch, allNewEmails};
}

/*to be removed*/
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

