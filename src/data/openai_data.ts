/*
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
*/
// export const prompt = `Extract job details from each email in order. Return EXACTLY the same number of objects as input.

// Extract: sender_name, job_title, organization, url (omit missing fields)

// Return JSON array:
// [{sender_name: string, job_title: string, organization: string, url: string}]

// CRITICAL REQUIREMENTS:
// - Return EXACTLY the same number of objects as input emails
// - Your response must be ONLY a valid JSON array, nothing else
// - Do not include markdown formatting, backticks, or any text outside the JSON
// - 1:1 correspondence between input emails and output objects

// Example format:
// [{"sender_name": "John Doe", "job_title": "Software Engineer", "organization": "Tech Corp", "url": "https://example.com/apply"}]


// Input:`;

export const prompt = `Extract job details from each email in order. Return EXACTLY the same number of objects as input.

Extract: sender_name, organization, body (omit missing fields)

Return JSON array with markdown formatting:
[{sender_name: string, organization: string, body: string}]

CRITICAL REQUIREMENTS:
- Return EXACTLY the same number of objects as input emails
- Your response must be ONLY a valid JSON array, nothing else
- Format sender_name as h4 markdown with only the name: "#### John Doe"
- Format organization as h4 markdown: "#### Organization Name"
- Format body with all URLs as markdown links: "[Link Text](url)"
- Do not include backticks or any text outside the JSON
- 1:1 correspondence between input emails and output objects

Example format:
[{"sender_name": "#### John Doe", "organization": "#### Tech Corp", "body": "This is the email body with [Apply Here](https://example.com/apply) and [Learn More](https://example.com/learn)"}]


Input:`;
