import { NextResponse } from "next/server";

import { createServiceAccountClient } from "@/lib/gmail-auth";
import { getNewEmails } from "@/lib/utils";


export async function GET(request: Request) {

  /*
  //verify request is from vercel cron
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get('Authorization');

  if(authHeader !== `Bearer ${cronSecret}`){
    return NextResponse.json({
      success: false,
      message: 'Unauthorized',
    }, { status: 401 });
  }
  */

  /*Cron logic*/
  console.log('Starting fetch-emails API call');
  
  // check client connection  
  try{
    //const canConnect = await createServiceAccountClient();
    const canConnect = true;
    
    if(!canConnect){
      console.log('Gmail client connection failed');
      return NextResponse.json({
        success: false,
        message: 'Gmail client connection failed',
      }, { status: 500 });
    }

      //fetch emails from gmail
      // const gmail = createGmailClient();
      // service account client 
      const gmail = createServiceAccountClient();

      const {attemptFetch, allNewEmails} = await getNewEmails(gmail);
      console.log('Attempt fetch:', attemptFetch);
      console.log('All new emails:', allNewEmails.length);

      if(attemptFetch === allNewEmails.length){
      return NextResponse.json({
        success: true,
        message: 'Emails fetched and inserted successfully',
        attemptFetch: attemptFetch,
        emailsInserted: allNewEmails.length,
      });
      }
      else{
        return NextResponse.json({
          success: false,
          message: 'Error fetching emails',
        }, { status: 500 });
      }
  } catch (error) {
    console.error('Error fetching emails:', error);
    return NextResponse.json({
      success: false,
      message: 'Error fetching emails',
    }, { status: 500 });
  }
}
