//'use server';

import { extractEmail, extractName, getEmails } from '@/lib/gmail-api';
import { supabaseAdmin } from '@/lib/supabase';

import { keywords } from '@/data/keywords';

import { EmailInsert } from '@/types/email';
import { JobInsert } from '@/types/job';

// set it to true to send discord notification
const isProduction = process.env.NODE_ENV === 'production';
/**email utils***/
// Type for Gmail API email response
interface GmailEmail {
  id: string;
  headers?: Array<{ name: string; value: string }>;
  text: string;
  internalDate: string;
}

/*convert email to db format*/
export const convertEmailToDbFormat = (email: GmailEmail) => {
  const fromHeader =
    email.headers?.find((h: { name: string }) => h.name === 'From')?.value ||
    '';
  const subject =
    email.headers?.find((h: { name: string }) => h.name === 'Subject')?.value ||
    '';
  return {
    sender_name: extractName(fromHeader),
    sender_email_address: extractEmail(fromHeader),
    body: email.text,
    subject: subject,
    date_time_sent: email.internalDate,
    listserv_name: 'ResAdmin',
    gmail_message_id: email.id,
  };
};

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

/*insert email into db*/
export const insertEmail = async (email: EmailInsert) => {
  const { data, error } = await supabaseAdmin
    .from('emails')
    .insert(email)
    .select();
  if (error) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Error inserting email:', error);
    }
    return {
      success: false,
      message: 'Error inserting email',
      error: error,
      status: 500,
    };
  }

  //discord notification
  if (isProduction) {
    //only send discord notification if the email contains keywords
    if (contentKeywordFilter(data[0].body, data[0].subject, keywords)) {
      await discordNotification({
        email: data[0].sender_email_address,
        name: data[0].sender_name,
        subject: data[0].subject,
        message: formatLinks(data[0].body),
      });
    }
  }

  return {
    success: true,
    message: 'Email inserted',
    data: data,
    status: 200,
  };
};

/*get last saved email*/
export async function getLastSavedEmail() {
  const { data, error } = await supabaseAdmin
    .from('emails')
    .select('date_time_sent, gmail_message_id')
    .order('date_time_sent', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error(error);
    }
    return null;
  }

  return data;
}

// Type alias for Google Gmail API client (complex Google library type)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GoogleGmailClient = any;

/*get new emails since last saved email*/
export async function getNewEmails(gmail: GoogleGmailClient) {
  // Get the most recent email from database
  const lastSavedEmail = await getLastSavedEmail();
  let sinceDate: Date | null = null;
  let lastSavedId: string | null = null;
  if (!lastSavedEmail) {
    // No emails in DB yet - get recent emails (last 24 hours)
    sinceDate = null;
  } else {
    sinceDate = new Date(lastSavedEmail.date_time_sent);
    lastSavedId = lastSavedEmail.gmail_message_id;
  }

  let pageToken: string | undefined = undefined;
  const allNewEmails: GmailEmail[] = [];
  let length = 0;
  let nextPageToken: string | undefined = undefined;
  let attemptFetch = 0;

  do {
    const result: {
      emailsList: GmailEmail[];
      length: number;
      nextPageToken?: string;
    } = await getEmails(gmail, 50, sinceDate, pageToken);
    let { emailsList } = result;
    length = result.length;
    attemptFetch += length;
    nextPageToken = result.nextPageToken;
    // Filter out emails with the same id as the last saved one
    if (lastSavedId) {
      emailsList = emailsList.filter(
        (email: GmailEmail) => email.id !== lastSavedId
      );

      //if the length of emailsList is less than the length of the result, it means that the last email was already fetched
      //so we need to subtract 1 from the attemptFetch
      if (emailsList.length !== length) {
        attemptFetch -= 1;
      }
    }

    for (const email of emailsList) {
      const emailData = await convertEmailToDbFormat(email);
      await insertEmail(emailData);
    }

    allNewEmails.push(...emailsList);
    pageToken = nextPageToken;
  } while (length === 50 && nextPageToken);

  //return true if all emails were fetched, false otherwise
  return { attemptFetch, allNewEmails };
}

export const discordNotification = async ({
  email,
  name,
  subject,
  message,
}: {
  email: string;
  name: string;
  subject: string;
  message: string;
}) => {
  if (!isProduction) return;

  return await fetch(
    `https://discord.com/api/webhooks/1387797986817609728/GPyC21ZUU5ZQd-_R4HnqXZoMRCzVBjrxDRzziRIuUhZFooxUh9CxM1qoITCn2dQPxLjE`,

    {
      body: JSON.stringify({
        content: `**❗️ New Atom Mention**\n**Name:** ${name}\n**Email:** ${email}\n**Subject:** ${subject}\n**Message:** ${message}`,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    }
  )
    .then(() => {
      //console.log('Discord notification fetch succeeded');
      return true;
    })
    .catch((error) => {
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error('Error sending discord notification', error);
      }
      return false;
    });
};

function formatLinks(text: string): string {
  const urlRegex = /<?((https?:\/\/|www\.)[^\s<>()[\]]+)>?/g;
  return text.replace(urlRegex, (fullMatch, captureGroup1) => {
    const cleanUrl = captureGroup1.replace(/[.,!?;:'")\]]+$/, '');
    const normalizedUrl = cleanUrl.startsWith('www.')
      ? `https://${cleanUrl}`
      : cleanUrl;
    // Extract the domain and path for display, regardless of protocol
    let displayText = normalizedUrl;
    if (normalizedUrl.startsWith('https://')) {
      displayText = normalizedUrl.replace('https://', '');
    } else if (normalizedUrl.startsWith('http://')) {
      displayText = normalizedUrl.replace('http://', '');
    }
    return `[${displayText}](<${normalizedUrl}>)`;
  });
}

// function to filter out emails (body and subject) that don't contain keywords based on second column of keywords.csv file
export function contentKeywordFilter(
  body: string,
  subject: string,
  _keyword: string[]
): boolean {
  return keywords.some(
    (keyword) =>
      keyword &&
      (body.toLowerCase().includes(keyword.toLowerCase()) ||
        subject.toLowerCase().includes(keyword.toLowerCase()))
  );
}
