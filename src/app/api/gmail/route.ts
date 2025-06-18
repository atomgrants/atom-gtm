import { getLatestEmails,testConnection } from '../../../../lib/gmail-api';
import { createGmailClient, getAccessToken,getAuthUrl } from '../../../../lib/gmail-auth';

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
        instructions: [
          '1. Visit the authUrl above',
          '2. Grant Gmail permissions', 
          '3. Copy the code from callback URL',
          '4. POST to /api/gmail with {"code": "your_code"}'
        ]
      }, { status: 401 });
    }

    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Handle OAuth callback
export async function POST(request: Request) {
  try {
    const { code } = await request.json();
    
    if (!code) {
      return Response.json({
        success: false,
        error: 'Authorization code is required'
      }, { status: 400 });
    }

    // Exchange code for tokens
    await getAccessToken(code);
    
    return Response.json({
      success: true,
      message: 'Gmail authorized successfully! You can now use the API.'
    });
    
  } catch (error) {
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to authorize'
    }, { status: 500 });
  }
}