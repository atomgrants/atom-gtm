//import dotenv from 'dotenv'
import OpenAI from 'openai';

import {
  convertJobToDbFormat,
  deduplicateByBody,
  insertJob,
} from '@/lib/jobUtils';

import { prompt } from '@/data/openai_data';

import { EmailInsert } from '@/types/email';

// Type for job email processing - subset of EmailInsert
interface JobEmailForProcessing {
  sender_name: string;
  body: string;
  subject: string;
  date_time_sent: string;
}

//dotenv.config({path:['.env.local', '.env']})

const client = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
});

const cleanJobEmail = async (inputPrompt: string) => {
  try {
    const response = await client.responses.create({
      model: 'gpt-4.1-nano',
      instructions: 'You are a coding assistant',
      input: inputPrompt, //working on it
    });

    return JSON.parse(response.output_text);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error(error);
    }
    //console.log(jsonError)
  }
};

const chunkArray = (
  arr: JobEmailForProcessing[],
  batchSize: number
): JobEmailForProcessing[][] => {
  const chunks: JobEmailForProcessing[][] = [];
  for (let i = 0; i < arr.length; i += batchSize) {
    chunks.push(arr.slice(i, i + batchSize));
  }
  return chunks;
};

const BATCH_SIZE = 10;

// clean, format, and save Job Email
export const processJobEmail = async (jobEmails: JobEmailForProcessing[]) => {
  // Convert to EmailInsert format for deduplication
  const emailInsertFormat: EmailInsert[] = jobEmails.map((email) => ({
    ...email,
    sender_email_address: '',
    listserv_name: '',
    gmail_message_id: '',
  }));
  const deduplicatedEmails = deduplicateByBody(emailInsertFormat);
  // Use the deduplicated count but process original format
  const batches = chunkArray(
    jobEmails.slice(0, deduplicatedEmails.length),
    BATCH_SIZE
  );
  for (const batch of batches) {
    // Create one input string with whole batch as JSON
    const inputPrompt = `${prompt} ${JSON.stringify(batch)}`;
    const openaiOutput = await cleanJobEmail(inputPrompt);

    if (!openaiOutput || openaiOutput === '') {
      //console.log("Found Malformatted Job")
      continue;
    }

    // openaiOutput is one array with all job objects from batch
    // Map back each job object to corresponding email in batch
    for (let i = 0; i < batch.length; i++) {
      const emailInsert: EmailInsert = {
        ...batch[i],
        sender_email_address: '',
        listserv_name: '',
        gmail_message_id: '',
      };
      const formatOpenaiOutput = convertJobToDbFormat(
        emailInsert,
        openaiOutput[i]
      );
      //console.log(formatOpenaiOutput)
      await insertJob(formatOpenaiOutput);
    }
  }
  //console.log('All jobs Processed');
};

//fetchTest(jobSeed);
