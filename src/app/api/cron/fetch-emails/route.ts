import { NextResponse } from "next/server";

import { getSingleEmail } from "@/lib/gmail-api";
import { canCreateGmailClient, createGmailClient } from "@/lib/gmail-auth";

import { EmailInsert } from "@/types/email";

export async function GET(request: Request) {
  // check client connection  
  try{
    const canConnect = await canCreateGmailClient();
    if(!canConnect){
      return NextResponse.json({
        success: false,
        message: 'Gmail client connection failed',
      }, { status: 500 });
    }

      //fetch single email from gmail (testing)
      const gmail = createGmailClient();
      const emails = await getSingleEmail(gmail);

      //transform to db format 
      const emailData: EmailInsert[] = emails.map((email:any) => ({
        //name of the sender 
        sender_name: email.headers?.find((h: { name: string }) => h.name === 'From')?.value,
        //email of the sender
        sender_email: email.headers?.find((h: { name: string }) => h.name === 'From')?.value,
        content: email.text,
        subject: email.headers?.find((h: { name: string }) => h.name === 'Subject')?.value,
        date_time: email.internalDate,
        listserv: 'listserv',
      }))



  } catch (error) {
    console.error('Error fetching emails:', error);
    return NextResponse.json({
      success: false,
      message: 'Error fetching emails',
    }, { status: 500 });
  }
}