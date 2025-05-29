"use server";

export async function sendBulkEmails() {
  const { Resend } = require('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);

  const TARGET_EMAIL = 'orillos.lark@gmail.com';
  const imageBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANS...';

  for (let idx = 0; idx < 100; idx++) {
    await resend.emails.send({
      from: 'Your Name <onboarding@resend.dev>',
      to: TARGET_EMAIL,
      subject: `Test Email #${idx + 1}`,
      html: `<p>This is test email #${idx + 1}.</p><img src="${imageBase64}" alt="Image" />`,
    });
    // Wait 500ms between sends to avoid rate limits
    await new Promise(res => setTimeout(res, 500));
  }
}