"use server";

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

    const TARGET_EMAIL = 'orillos.lark@gmail.com';

    // If we don't have a certificate image, send a test email
    if (!certificateImage) {
      console.log("No certificate image provided, sending test email only");
      const testResponse = await resend.emails.send({
        from: 'CertAuto <onboarding@resend.dev>',
        to: TARGET_EMAIL,
        subject: 'Email Service Test',
        html: `<p>This is a test email to verify the email service is working.</p>
               <p>Timestamp: ${new Date().toISOString()}</p>`,
      });
      
      return { 
        success: true, 
        message: "Test email sent successfully, but no certificate was provided" 
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
    
    for (let idx = 0; idx < 5; idx++) {
      console.log(`Sending email ${idx + 1} of 5...`);
      
      const response = await resend.emails.send({
        from: 'CertAuto <onboarding@resend.dev>',
        to: TARGET_EMAIL,
        subject: `Your Certificate #${idx + 1}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Your Certificate</h2>
            <p>Congratulations! Here is your certificate (email ${idx + 1} of 5).</p>
            <p>Please see the attached certificate image.</p>
            <p>Thank you for your participation!</p>
          </div>
        `,
        attachments: [
          {
            filename: `certificate-${idx + 1}.png`,
            content: base64Data,
          },
        ],
      });
      
      console.log(`Email ${idx + 1} response:`, response);
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