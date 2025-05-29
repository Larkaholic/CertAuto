"use server";

import FeedbackForm from './components/user/feedbackForm';
import React, { useTransition } from 'react';

const TARGET_EMAIL = 'orillos.lark@gmail.com';
const imageBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANS...';

// Server action for sending emails
async function sendBulkEmails() {
  "use server";
  const { Resend } = require('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);

  const promises = Array.from({ length: 100 }).map((_, idx) =>
    resend.emails.send({
      from: 'Your Name <onboarding@resend.dev>',
      to: TARGET_EMAIL,
      subject: `Test Email #${idx + 1}`,
      html: `<p>This is test email #${idx + 1}.</p><img src="${imageBase64}" alt="Image" />`,
    })
  );
  await Promise.all(promises);
}

export default function Home() {
  const [isPending, startTransition] = useTransition();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Welcome to CertAuto</h1>
      <p className="mt-4 text-lg">Your automated certificate management solution.</p>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
        disabled={isPending}
        onClick={() => startTransition(() => sendBulkEmails())}
      >
        {isPending ? "Sending..." : "Test Bulk Email Send"}
      </button>
      <FeedbackForm />
    </main>
  );
}