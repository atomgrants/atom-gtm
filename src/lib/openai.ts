import dotenv from 'dotenv'
import OpenAI from "openai";

import { convertJobToDbFormat,insertJob } from '@/lib/jobUtils';

import { jobSeed } from '@/data/job-seed'; //for testing
import { prompt } from '@/data/openai_data';

import { JobInsert } from '@/types/job';

dotenv.config({path:['.env.local', '.env']})

const finalPrompt = `${prompt} ${JSON.stringify(jobSeed[3])}`;

const client = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
});

const main = async () => {
  try {

    const response = await client.responses.create({
      model: "gpt-4.1-nano",
      instructions: 'You are a coding assistant',
      input: finalPrompt //working on it
    });
    return JSON.parse(response.output_text)
  } catch (error) {
    console.log(error)
  }
}

main().then(result => { console.log(result)})

//test insert job to db here

main().then(result => {
  const cleanData: JobInsert= convertJobToDbFormat(jobSeed[3], result[0]);
  insertJob(cleanData)
})

