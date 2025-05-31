"use server";

import { db } from "./lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export async function sendBulkEmails(certificateImage?: string) {
  console.log("Server action called with image data length:", certificateImage?.length);
  
  // Check if RESEND_API_KEY is available
  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY is missing in environment variables");
    return { 
      success: false, 
      message: "RESEND_API_KEY is not configured. Please add it to your environment variables." 
    };
  }

  try {
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Fetch emails from Firestore
    let targetEmails: string[] = [];
    try {
      const snapshot = await getDocs(collection(db, "emails"));
      targetEmails = snapshot.docs.map(doc => doc.data().email).filter(Boolean);
      console.log("Target emails from Firestore:", targetEmails); // <-- Add this line
    } catch (fetchError) {
      console.error("Failed to fetch emails from Firestore:", fetchError);
      return { success: false, message: "Failed to fetch emails from Firestore." };
    }

    if (targetEmails.length === 0) {
      return { success: false, message: "No target emails found in Firestore." };
    }

    // If we don't have a certificate image, send a test email to all
    if (!certificateImage) {
      console.log("No certificate image provided, sending test email only");
      const responses = [];
      for (const email of targetEmails) {
        const testResponse = await resend.emails.send({
          from: 'CertAuto <onboarding@resend.dev>',
          to: email,
          subject: 'Email Service Test',
          html: `<p>This is a test email to verify the email service is working.</p>
                 <p>Timestamp: ${new Date().toISOString()}</p>`,
        });
        responses.push(testResponse);
        // Wait 500ms between sends to avoid rate limits
        await new Promise(res => setTimeout(res, 500));
      }
      return { 
        success: true, 
        message: `Test email sent successfully to ${targetEmails.length} recipients, but no certificate was provided` 
      };
    }

    const responses = [];
    
    // Extract the base64 content without the data URL prefix
    let base64Data = certificateImage;
    if (certificateImage.startsWith('data:image/')) {
      const matches = certificateImage.match(/^data:image\/\w+;base64,(.+)$/);
      if (matches && matches.length > 1) {
        base64Data = matches[1];
      }
    }
    
    for (const email of targetEmails) {
      console.log(`Sending certificate email to: ${email}`);
      const response = await resend.emails.send({
        from: 'CertAuto <onboarding@resend.dev>',
        to: email,
        subject: `Your Certificate`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Your Certificate</h2>
            <p>Congratulations! Here is your certificate.</p>
            <p>Please see the attached certificate image.</p>
            <p>Thank you for your participation!</p>
          </div>
        `,
        attachments: [
          {
            filename: `certificate.png`,
            content: base64Data,
          },
        ],
      });
      responses.push(response);
      
      // Wait 500ms between sends to avoid rate limits
      await new Promise(res => setTimeout(res, 500));
    }
    
    return { 
      success: true, 
      message: `All ${responses.length} emails sent successfully with certificates attached` 
    };
  } catch (error) {
    console.error("Error sending emails:", error);
    // More detailed error to help with debugging
    const errorMessage = error instanceof Error 
      ? `${error.name}: ${error.message}${error.stack ? '\n' + error.stack : ''}`
      : "Unknown error occurred";
    
    return { success: false, message: errorMessage };
  }
}