export async function testConnection(gmail: any): Promise<number> {
  const response = await gmail.users.messages.list({
    userId: "me",
    maxResults: 1,
  });
  return response.data.resultSizeEstimate || 0;
}

/*TODO:
add parameter for maxResults that can get value from getNewEmails
*/
export async function getEmails(gmail: any, count:number) {
  const response = await gmail.users.messages.list({
    userId: "me",
    maxResults: count,
    q: "category:primary",
  });

  // Check if there are any messages
  if (!response.data.messages || response.data.messages.length === 0) {
    return [];
  }

  const msg = await Promise.all(response.data.messages.map(async (msg: { id: string }) => {
    const msgDetail = await gmail.users.messages.get({
      userId: "me",
      id: msg.id,
      format: "full",
    });
    const { text, html } = extractEmailBody(msgDetail.data.payload);
    return {
      id: msg.id,
      snippet: msgDetail.data.snippet,
      payload: msgDetail.data.payload,
      text: text, //text version of the email body
      headers: msgDetail.data.payload?.headers, //contain subject, from, date
      internalDate: new Date(Number(msgDetail.data.internalDate)).toISOString(),
    }
  }));
  return msg;
}

export async function getEmailsTest(gmail: any, count: number, sinceDate: Date | null, pageToken?: string) {
  //get timestamp in unix format
  let unixTimestamp: number;
  if (sinceDate === null) {
    unixTimestamp = Math.floor((Date.now() - 24 * 60 * 60 * 1000) / 1000);
  } else {
    unixTimestamp = Math.floor(sinceDate.getTime() / 1000);
  }

  //get emails since date
  const response = await gmail.users.messages.list({
    userId: "me",
    maxResults: count,
    q: `after:${unixTimestamp} category:primary`,
    pageToken: pageToken,
    format: "full",
  });

  // Check if there are any messages
  if (!response.data.messages || response.data.messages.length === 0) {
    return { emailsList: [], length: 0, nextPageToken: undefined };
  }

  const msg = await Promise.all(response.data.messages.map(async (msg: { id: string }) => {
    const msgDetail = await gmail.users.messages.get({
      userId: "me",
      id: msg.id,
      format: "full",
    });
    const { text } = extractEmailBody(msgDetail.data.payload);
    return {
      id: msg.id,
      snippet: msgDetail.data.snippet,
      payload: msgDetail.data.payload,
      text: text, //text version of the email body
      headers: msgDetail.data.payload?.headers, //contain subject, from, date
      internalDate: new Date(Number(msgDetail.data.internalDate)).toISOString(),
    }
  }));
  //return msg, number of messages found, and nextPageToken
  return { emailsList: msg, length: response.data.messages.length, nextPageToken: response.data.nextPageToken };
}

function extractEmailBody(payload: any): { text: string; html: string } {
  let textBody = "";
  let htmlBody = "";

  // Simple email (body directly in payload)
  if (payload.body && payload.body.data) {
    const decoded = Buffer.from(payload.body.data, 'base64').toString('utf-8');
    if (payload.mimeType === 'text/plain') {
      textBody = decoded;
    } else if (payload.mimeType === 'text/html') {
      htmlBody = decoded;
    }
  }

  // Multi-part email (text + html versions)
  if (payload.parts) {
    payload.parts.forEach((part: any) => {
      if (part.mimeType === 'text/plain' && part.body.data) {
        textBody = Buffer.from(part.body.data, 'base64').toString('utf-8');
      } else if (part.mimeType === 'text/html' && part.body.data) {
        htmlBody = Buffer.from(part.body.data, 'base64').toString('utf-8');
      }
    });
  }

  return { text: textBody, html: htmlBody };
}

export function extractName(fromHeader: string): string {
  if (!fromHeader) return '';
  
  // "GitHub <noreply@github.com>" -> "GitHub"
  if (fromHeader.includes('<')) {
    return fromHeader.split('<')[0].trim();
  }
  
  // Fallback: if no <>, use part before @
  return fromHeader.split('@')[0];
}

export function extractEmail(fromHeader: string): string {
  if (!fromHeader) return '';
  
  // Extract email between < and >
  const match = fromHeader.match(/<([^>]+)>/);
  if (match) {
    return match[1]; // "noreply@github.com"
  }
  
  // Fallback: assume the whole string is an email
  return fromHeader.trim();
}
/*
function extractEmailBody(payload: any): { text: string; html: string } {
  function findText(part: any): string | null {
    if (part.mimeType === 'text/plain' && part.body && part.body.data) {
      return Buffer.from(part.body.data, 'base64').toString('utf-8');
    }
    if (part.parts) {
      for (const subPart of part.parts) {
        const text = findText(subPart);
        if (text) return text;
      }
    }
    return null;
  }

  function findHtml(part: any): string | null {
    if (part.mimeType === 'text/html' && part.body && part.body.data) {
      return Buffer.from(part.body.data, 'base64').toString('utf-8');
    }
    if (part.parts) {
      for (const subPart of part.parts) {
        const html = findHtml(subPart);
        if (html) return html;
      }
    }
    return null;
  }

  const textBody = findText(payload) || '';
  const htmlBody = findHtml(payload) || '';
  return { text: textBody, html: htmlBody };
}
*/