import { getLatestEmails,testConnection } from '../../../../lib/gmail-api';
import { createGmailClient,getAuthUrl } from '../../../../lib/gmail-auth';

export async function GET() {
  try {
    // Try to create Gmail client (will throw if no tokens)
    const gmail = createGmailClient();
    const email = await testConnection(gmail);
    const emails = await getLatestEmails(gmail, 3);
    
    return Response.json({
      success: true,
      userEmail: email,
      latestEmails: emails.length
    });
    
  } catch (error) {
    if (error instanceof Error && error.message === 'NO_TOKENS') {
      const authUrl = getAuthUrl();
      return Response.json({
        success: false,
        needsAuth: true,
        message: 'Gmail not authorized yet',
        authUrl: authUrl,
        instructions: ['1. Visit the authUrl above', '2. Grant Gmail permissions']
      }, { status: 401 });
    }

    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}