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
export async function getSingleEmail(gmail: any, id: string) {
  const response = await gmail.users.messages.get({
    userId: "me",
    id: id,
  });
  return response.data;
}
