import { NextResponse } from "next/server";

import { extractEmail, extractName, getSingleEmail } from "@/lib/gmail-api";
import { canCreateGmailClient, createGmailClient } from "@/lib/gmail-auth";
import { supabaseAdmin } from "@/lib/supabase";

import { EmailInsert } from "@/types/email";

export async function GET(request: Request) {
  console.log('Starting fetch-emails API call');
  
  // check client connection  
  try{
    console.log('Checking Gmail client connection...');
    const canConnect = await canCreateGmailClient();
    console.log('Gmail client connection result:', canConnect);
    
    if(!canConnect){
      console.log('Gmail client connection failed');
      return NextResponse.json({
        success: false,
        message: 'Gmail client connection failed',
      }, { status: 500 });
    }

    console.log('Gmail client connection successful');

      //fetch single email from gmail (testing)
      console.log('Creating Gmail client...');
      const gmail = createGmailClient();
      console.log('Fetching emails from Gmail...');
      const emails = await getSingleEmail(gmail);
      console.log('Emails fetched:', emails.length);

      //transform to db format 
      const emailData: EmailInsert[] = emails.map((email:any) => {
        const fromHeader = email.headers?.find((h: { name: string }) => h.name === 'From')?.value || '';
        const subject = email.headers?.find((h: { name: string }) => h.name === 'Subject')?.value || '';
        return {
        //name of the sender 
        sender_name: extractName(fromHeader),
        //email of the sender
        sender_email_address: extractEmail(fromHeader),
        body: email.text,
        subject: subject,
        date_time_sent: email.internalDate,
        listserv_name: 'ResAdmin',
      }})

      //insert emails into db
      const { data, error } = await supabaseAdmin.from('emails').insert(emailData);
      if (error) {
        console.error('Error inserting emails:', error);
        return NextResponse.json({
          success: false,
          message: 'Error inserting emails',
          error: error.message,
        }, { status: 500 });
      }
      console.log('Emails inserted:', data);

      return NextResponse.json({
        success: true,
        message: 'Emails fetched and inserted successfully',
        emailsInserted: emailData.length,
      });

  } catch (error) {
    console.error('Error fetching emails:', error);
    return NextResponse.json({
      success: false,
      message: 'Error fetching emails',
    }, { status: 500 });
  }
}