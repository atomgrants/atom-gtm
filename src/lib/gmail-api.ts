// Type for Gmail API client
export interface GmailAPI {
  users: {
    messages: {
      list: (params: {
        userId: string;
        maxResults?: number;
        q?: string;
        pageToken?: string;
        format?: string;
      }) => Promise<{
        data: {
          resultSizeEstimate?: number;
          messages?: Array<{ id: string }>;
          nextPageToken?: string;
        };
      }>;
      get: (params: {
        userId: string;
        id: string;
        format?: string;
      }) => Promise<{
        data: {
          id: string;
          snippet?: string;
          payload?: GmailPayload;
          internalDate?: string;
        };
      }>;
    };
  };
}

export async function testConnection(gmail: GmailAPI): Promise<number> {
  const response = await gmail.users.messages.list({
    userId: 'me',
    maxResults: 1,
  });
  return response.data.resultSizeEstimate || 0;
}

export async function getEmails(
  gmail: GmailAPI,
  count: number,
  sinceDate: Date | null,
  pageToken?: string
) {
  let unixTimestamp: number;
  if (sinceDate === null) {
    unixTimestamp = Math.floor((Date.now() - 24 * 60 * 60 * 1000) / 1000);
  } else {
    unixTimestamp = Math.floor(sinceDate.getTime() / 1000);
  }

  const senders = [
    'resadm-l@lists.healthresearch.org',
    'esdrasntuyenabo40@gmail.com',
  ];
  const query = `after:${unixTimestamp} (from:${senders[0]} OR from:${senders[1]})`;

  const response = await gmail.users.messages.list({
    userId: 'me',
    maxResults: count,
    q: query,
    pageToken: pageToken,
    format: 'full',
  });

  if (!response.data.messages || response.data.messages.length === 0) {
    return { emailsList: [], length: 0, nextPageToken: undefined };
  }

  const msg = await Promise.all(
    response.data.messages.map(async (msg: { id: string }) => {
      const msgDetail = await gmail.users.messages.get({
        userId: 'me',
        id: msg.id,
        format: 'full',
      });
      const { text } = extractEmailBody(msgDetail.data.payload || {});
      return {
        id: msg.id,
        snippet: msgDetail.data.snippet,
        payload: msgDetail.data.payload,
        text: extractReplyContent(text).replace(/[\r\n]+/g, ' '),
        headers: msgDetail.data.payload?.headers,
        internalDate: new Date(
          Number(msgDetail.data.internalDate)
        ).toISOString(),
      };
    })
  );
  return {
    emailsList: msg,
    length: response.data.messages.length,
    nextPageToken: response.data.nextPageToken,
  };
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

function extractReplyContent(body: string): string {
  // Common separators for replies/forwards
  const separators = [
    /^On .+ wrote:$/m, // Gmail, Apple Mail, etc.
    /^From: .+$/m, // Outlook, etc.
    /^-----Original Message-----$/m,
  ];

  let minIndex = body.length;
  for (const sep of separators) {
    const match = body.match(sep);
    if (match && match.index !== undefined && match.index < minIndex) {
      minIndex = match.index;
    }
  }
  // Return everything before the first separator, trimmed
  return body.slice(0, minIndex).trim();
}

// Type for Gmail payload structure
interface GmailPayload {
  mimeType?: string;
  body?: { data?: string };
  parts?: GmailPayload[];
  headers?: Array<{ name: string; value: string }>;
}

function extractEmailBody(payload: GmailPayload): {
  text: string;
  html: string;
} {
  function findText(part: GmailPayload): string | null {
    if (part.mimeType === 'text/plain' && part.body && part.body.data) {
      return Buffer.from(part.body.data, 'base64').toString('utf-8');
    }
    if (part.parts) {
      for (const subPart of part.parts) {
        const text = findText(subPart);
        if (text) {
          // remove mailing list footer
          return removeMailingListFooter(text);
        }
      }
    }
    return null;
  }

  function findHtml(part: GmailPayload): string | null {
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
  //double check footer clean up
  const finalTextBody = removeMailingListFooter(textBody);

  return { text: finalTextBody, html: htmlBody };
}

function removeMailingListFooter(body: string): string {
  const marker =
    "This email was sent to team@atomgrants.com via the Research Administrator's mailing list.";
  const index = body.indexOf(marker);
  if (index !== -1) {
    return body.substring(0, index).trim();
  }
  return body;
}
