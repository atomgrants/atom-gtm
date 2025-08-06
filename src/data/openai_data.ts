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

Extract: sender_name, job_title, organization, url, body (omit missing fields)

Return JSON array with markdown formatting:
[{sender_name: string, job_title:string, organization:, url:string, body: string, organization_domain: string}]

CRITICAL REQUIREMENTS:
- Return EXACTLY the same number of objects as input emails
- Your response must be ONLY a valid JSON array, nothing else
- Format sender_name as h6 markdown with only the name: "###### John Doe"
- Format organization and as h5 markdown: "##### Organization Name"
- Format job_title as h4 markdown: "#### Software engineer"
- Keep url field as plain text URL (no markdown formatting): "https://example.com/apply"
- Format body as valid markdown:
  - Format all URLs as markdown links: "[Link Text](url)"
  - Format any lists as markdown bullet points, with each item on its own line, starting with '*' and separated by newlines.
  - Separate paragraphs with double newlines.
  - Add line breaks where appropriate for readability.
- Remove unnecessary characters from body like "- = - = - = - = - = - = -" patterns
- Extract the correct organization domain (e.g., "harvard.edu") based on the organization name. If you cannot determine the domain, leave the field empty ("")
- Do not include backticks or any text outside the JSON
- 1:1 correspondence between input emails and output objects

Example format:
[{"sender_name": "###### John Doe", "job_title": "#### Software Engineer", "organization": "##### Tech Corp", "url": "https://example.com/apply", "body": "We are seeking a Software Engineer to join our team.\n\nIdeal candidates will have:\n* Experience with React and Node.js\n* Strong problem-solving skills\n* Excellent communication abilities\n\nFor more information, see [Learn More](https://example.com/learn).", "organization_domain": "harvard.edu"}]

Input:`;
