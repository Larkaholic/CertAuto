"use client";

import { useState } from "react";

export default function FeedbackForm() {
  const [feedbacks, setFeedbacks] = useState<string[]>([""]);
  
  const handleFeedbackChange = (index: number, value: string) => {
    const updated = [...feedbacks];
    updated[index] = value;
    setFeedbacks(updated);
  };

  const addFeedbackField = () => {
    setFeedbacks([...feedbacks, ""]);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Welcome to CertAuto</h1>
      <p className="mt-4 text-lg">Your automated certificate management solution.</p>
      <form className="mt-8 flex flex-col gap-4 w-full max-w-md">
        <input
          type="text"
          placeholder="Name"
          className="border p-2 rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded"
          required
        />
        <label className="font-semibold">Feedback:</label>
        {feedbacks.map((feedback, idx) => (
          <input
            key={idx}
            type="text"
            placeholder={`Feedback #${idx + 1}`}
            className="border p-2 rounded mb-2"
            value={feedback}
            onChange={e => handleFeedbackChange(idx, e.target.value)}
          />
        ))}
        <button
          type="button"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={addFeedbackField}
        >
          Add Feedback Field
        </button>
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded mt-2"
        >
          Submit
        </button>
      </form>
    </main>
  );
}
