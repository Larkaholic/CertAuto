"use client";

import FeedbackForm from './components/user/feedbackForm';
import React, { useTransition } from 'react';
import { sendBulkEmails } from './sendBulkEmails';
import dynamic from 'next/dynamic';
import AddEmailForm from './components/user/addEmailForm';
import { sendEmailsToAll } from './lib/email'; // <-- add import

// Dynamically import the KonvaDemo component with SSR disabled
const KonvaDemo = dynamic(() => import('./konvaDemo'), { ssr: false });

export default function Home() {
  const [isPending, startTransition] = useTransition();
  const [isEmailJsPending, setEmailJsPending] = React.useState(false);
  const [emailJsStatus, setEmailJsStatus] = React.useState<string | null>(null);

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-between p-24"
      style={{ background: "#fff" }}
    >
      <h1 className="text-4xl font-bold">Welcome to CertAuto</h1>
      <p className="mt-4 text-lg">Your automated certificate management solution.</p>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
        disabled={isPending}
        onClick={() => startTransition(async () => { await sendBulkEmails(); })}
      >
        {isPending ? "Sending..." : "Test Bulk Email Send"}
      </button>
      {/* Test button for sendEmailsToAll */}
      <button
        className="bg-green-600 text-white px-4 py-2 rounded mb-4"
        disabled={isEmailJsPending}
        onClick={async () => {
          setEmailJsPending(true);
          setEmailJsStatus(null);
          try {
            const result = await sendEmailsToAll();
            setEmailJsStatus(result.success ? `Success: ${result.message}` : `Error: ${result.message}`);
          } catch (err: any) {
            setEmailJsStatus(`Error: ${err?.message || "Unknown error"}`);
          } finally {
            setEmailJsPending(false);
          }
        }}
      >
        {isEmailJsPending ? "Sending..." : "Test sendEmailsToAll"}
      </button>
      {emailJsStatus && (
        <div style={{
          marginBottom: 8,
          padding: '8px',
          backgroundColor: emailJsStatus.startsWith('Error') ? '#ffebee' : '#e8f5e9',
          borderRadius: '4px'
        }}>
          {emailJsStatus}
        </div>
      )}
      <AddEmailForm />
      {/* KonvaDemo will only be loaded client-side */}
      <KonvaDemo />
      <FeedbackForm />
    </main>
  );
}