
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
        success: true,
        message: 'Failed inserting job',
        data: data,
        status: 200
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