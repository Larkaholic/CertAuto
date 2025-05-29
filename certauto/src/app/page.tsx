import FeedbackForm from './components/user/feedbackForm';
import React from 'react';

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <h1 className="text-4xl font-bold">Welcome to CertAuto</h1>
        <p className="mt-4 text-lg">Your automated certificate management solution.</p>
        <FeedbackForm />
        </main>
    );
}