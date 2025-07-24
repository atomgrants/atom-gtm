export const prompt =
  `
Given an array of email objects related to job opportunities, extract only the following details for each:

- sender_name: the full name of the sender, cleaned of email formatting
- job_title: the job title found in the subject line or body (prioritize full job title if available)
- organization: the name of the hiring organization, inferred from subject or body
- url: the application or job posting URL (if any)

Return only one array of simplified job objects in the following format:

[
  {
    sender_name: string,
    job_title: string,
    organization: string,
    url: string
  }
]

If any value is missing, omit that field entirely from the object.

Now extract from this input:

`
