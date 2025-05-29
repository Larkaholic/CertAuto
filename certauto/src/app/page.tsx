"use client";

import FeedbackForm from './components/user/feedbackForm';
import React, { useTransition } from 'react';
import { sendBulkEmails } from './sendBulkEmails';

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