export async function testConnection(gmail: any): Promise<number> {
  const response = await gmail.users.messages.list({
    userId: "me",
    maxResults: 1,
  });
  return response.data.resultSizeEstimate || 0;
}


export async function getLatestEmails(gmail: any, count = 5) {
  const response = await gmail.users.messages.list({
    userId: "me",
    maxResults: count,
  });

  //check if there are any messages
  if (!response.data.messages || response.data.messages.length === 0) {
    return [];
  }

  // Fetch full message details for each message id
  const messages = await Promise.all(
    response.data.messages.map(async (msg: { id: string }) => {
      const msgDetail = await gmail.users.messages.get({
        userId: "me",
        id: msg.id,
        format: "metadata",
        metadataHeaders: ["subject", "from", "date"],
      });
      return {
        id: msg.id,
        snippet: msgDetail.data.snippet,
        payload: msgDetail.data.payload,
        headers: msgDetail.data.payload?.headers,
        internalDate: msgDetail.data.internalDate,
      };
    })
  );

  return messages;
}
export async function getSingleEmail(gmail: any) {
  const response = await gmail.users.messages.list({
    userId: "me",
    maxResults: 1,
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
      html: html, //html version of the email body
      headers: msgDetail.data.payload?.headers, //contain subject, from, date
      internalDate: new Date(Number(msgDetail.data.internalDate)).toISOString(),
    }
  }));
  return msg;
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