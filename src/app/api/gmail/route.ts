import { NextResponse } from 'next/server';

import { getEmails,testConnection } from '@/lib/gmail-api';
import { createGmailClient, getAuthUrl } from '@/lib/gmail-auth';

export async function GET(request: Request) {
  try {

    const { searchParams } = new URL(request.url);
    const messageId = searchParams.get('messageId');

    // Try to create Gmail client (will throw if no tokens)
    const gmail = createGmailClient();

    if (messageId) {
      const message = await gmail.users.messages.get({
        userId: 'me',
        id: messageId,
      });
      console.log(message);

      return NextResponse.json({
        success: true,
        message: message.data,
      });
    }
    //original logic
    const email = await testConnection(gmail);
    //const recentEmails = await getLatestEmails(gmail, 1);
    const recentEmails = await getEmails(gmail);


    console.log('Recent emails:', JSON.stringify(recentEmails, null, 2));

    return NextResponse.json({
      success: true,
      userEmail: email,
      recentEmails: recentEmails.map((email: any) => ({
        id: email.id, snippet: email.snippet,
        subject: email.headers?.find((h: { name: string }) => h.name === 'Subject')?.value,
        from: email.headers?.find((h: { name: string }) => h.name === 'From')?.value,
        date: email.headers?.find((h: { name: string }) => h.name === 'Date')?.value,
        text: email.text,
        html: email.html
      }))
    });

  } catch (error) {
    if (error instanceof Error && error.message === 'NO_TOKENS') {
      const authUrl = getAuthUrl();

      //check if this is a browser request
      const acceptHeader = request.headers.get('accept');
      if (acceptHeader && acceptHeader.includes('text/html')) {
        return NextResponse.redirect(authUrl);
      }

      //API request via curl
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
