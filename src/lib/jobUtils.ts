

import { supabaseAdmin } from "@/lib/supabase";

import { EmailInsert } from "@/types/email";
import { JobInsert, OpenAIOutput } from "@/types/job";

export const insertJob = async (job:JobInsert)=> {
  const {data, error} = await supabaseAdmin
    .from('jobs')
    .insert(job)
    .select()
    if(error){
      console.error('Error inserting job:', error)
      return {
        success: false,
        message: 'Failed inserting job',
        status: 500
      }
    }
    console.log('Jobs inserted:', data)
}

export const convertJobToDbFormat = (jobPost: EmailInsert, openaiOutput: OpenAIOutput) => {
  return{
      sender_name: openaiOutput.sender_name,
      job_title: openaiOutput.job_title,
      organization: openaiOutput.organization,
      job_url: openaiOutput.url,
      email_body: jobPost.body,
      time: jobPost.date_time_sent
  }
}

//get job from jobs table
export const getJobFromDb = async ()=> {
  const {data, error} = await supabaseAdmin
    .from('jobs')
    .select('*')
    if(error){
      console.error('Error fetching jobs:', error)
      return {
        success: false,
        message: 'Failed fetching job',
        status: 500
      }
    }
    return data
}