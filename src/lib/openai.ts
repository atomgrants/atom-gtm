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
import openai from 'openai';

//dotenv.config({path:['.env.local', '.env']})

const client = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
});

const cleanJobEmail = async (inputPrompt: string) => {
  let jsonError;
  try {
    const response = await client.responses.create({
      model: 'gpt-4.1-nano',
      instructions: 'You are a coding assistant',
      input: inputPrompt, //working on it
    });

    jsonError = response.output_text.replace(/^```json\s*/i, '').replace(/\s*```$/i, '');
    return JSON.parse(response.output_text);

  } catch (error) {
    console.error(error);
    //console.log(jsonError)
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
export const processJobEmail = async (jobEmails: any[]) => {
  const deduplicateJobEmail = deduplicateByBody(jobEmails);
  const batches = chunkArray(deduplicateJobEmail, BATCH_SIZE);
  for (const batch of batches) {
    // Create one input string with whole batch as JSON
    const inputPrompt = `${prompt} ${JSON.stringify(batch)}`;
    const openaiOutput = await cleanJobEmail(inputPrompt);

    if (!openaiOutput || openaiOutput === "") {
      //console.log("Found Malformatted Job")
      continue;
    };

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
  //console.log('All jobs Processed');
};

//fetchTest(jobSeed);
