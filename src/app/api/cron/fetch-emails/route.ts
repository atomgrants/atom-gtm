import { NextResponse } from "next/server";

import { extractEmail, extractName, getEmails } from "@/lib/gmail-api";
import { canCreateGmailClient, createGmailClient } from "@/lib/gmail-auth";
import { supabaseAdmin } from "@/lib/supabase";
import { getNewEmails } from "@/lib/utils";

import { EmailInsert } from "@/types/email";

export async function GET(request: Request) {
  console.log('Starting fetch-emails API call');
  
  // check client connection  
  try{
    const canConnect = await canCreateGmailClient();
    
    if(!canConnect){
      console.log('Gmail client connection failed');
      return NextResponse.json({
        success: false,
        message: 'Gmail client connection failed',
      }, { status: 500 });
    }

      //fetch emails from gmail
      const gmail = createGmailClient();

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