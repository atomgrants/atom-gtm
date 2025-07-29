export interface JobInsert {
  sender_name: string;
  job_title: string;
  organization: string;
  job_url: string;
  email_body: string;
  time: string;
}
export interface OpenAIOutput {
  sender_name: string;
  job_title: string;
  organization: string;
  url: string;
}

export interface JobInfo {
  job_title: string;
  organization: string;
  url: string;
  time_posted: string;
}
