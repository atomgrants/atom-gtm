import dotenv from 'dotenv'
import OpenAI from "openai";

import { convertJobToDbFormat,insertJob } from '@/lib/jobUtils';

import { jobSeed } from '@/data/job-seed'; //for testing
import { prompt } from '@/data/openai_data';

import { EmailInsert } from '@/types/email';

dotenv.config({path:['.env.local', '.env']})

const finalPrompt = `${prompt} ${JSON.stringify(jobSeed[3])}`;

const client = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
});

const cleanJobEmail = async (inputPrompt: string) => {
  try {

    const response = await client.responses.create({
      model: "gpt-4.1-nano",
      instructions: 'You are a coding assistant',
      input: inputPrompt //working on it
    });
    return JSON.parse(response.output_text)
  } catch (error) {
    console.log(error)
  }
}

//cleanJobEmail().then(result => { console.log(result)})
//test insert job to db here

const fetchTest = async (jobSeed: EmailInsert[]) => {

  for(const element of jobSeed){
    const inputPrompt = `${prompt} ${JSON.stringify(element)}`;
    const openaiOutput = await cleanJobEmail(inputPrompt)
    const formatOpenaiOutput = convertJobToDbFormat(element, openaiOutput[0])
    await insertJob(formatOpenaiOutput)
  }
  console.log("jobs inserted")
}

fetchTest(jobSeed)

