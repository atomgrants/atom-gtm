//import dotenv from 'dotenv'
import OpenAI from 'openai';

import {
  convertJobToDbFormat,
  deduplicateByBody,
  insertJob,
} from '@/lib/jobUtils';

//for testing
import { prompt } from '@/data/openai_data';

import { EmailInsert } from '@/types/email';

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
    console.log(error);
  }
};

const chunkArray = (arr: EmailInsert[], batchSize: number): EmailInsert[][] => {
  const chunks: EmailInsert[][] = [];
  for (let i = 0; i < arr.length; i += batchSize) {
    chunks.push(arr.slice(i, i + batchSize));
  }
  return chunks;
};

const BATCH_SIZE = 10;

// clean, format, and save Job Email
const processJobEmail = async (jobEmails: EmailInsert[]) => {
  const deduplicateJobEmail = deduplicateByBody(jobEmails);
  const batches = chunkArray(deduplicateJobEmail, BATCH_SIZE);
  for (const batch of batches) {
    // Create one input string with whole batch as JSON
    const inputPrompt = `${prompt} ${JSON.stringify(batch)}`;
    const openaiOutput = await cleanJobEmail(inputPrompt);
    console.log('Batch length', batch.length);

    // openaiOutput is one array with all job objects from batch
    // Map back each job object to corresponding email in batch
    for (let i = 0; i < batch.length; i++) {
      const formatOpenaiOutput = convertJobToDbFormat(
        batch[i],
        openaiOutput[i]
      );
      await insertJob(formatOpenaiOutput);
    }
  }
  console.log('jobs inserted in batches');
};

//fetchTest(jobSeed);
