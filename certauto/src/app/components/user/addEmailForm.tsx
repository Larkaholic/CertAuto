"use client";
import React, { useState } from "react";
import { db } from "../../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const AddEmailForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<null | string>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    if (!email) {
      setStatus("Please enter an email address.");
      return;
    }
    try {
      await addDoc(collection(db, "emails"), { email, createdAt: serverTimestamp() });
      setStatus("Email added successfully!");
      setEmail("");
    } catch (error) {
      setStatus("Error adding email.");
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 24, display: "flex", gap: 8, alignItems: "center" }}>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Enter email to add"
        required
        style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
      />
      <button
        type="submit"
        style={{ background: "#1976d2", color: "#fff", padding: "8px 16px", borderRadius: 4, border: "none" }}
      >
        Add Email
      </button>
      {status && <span style={{ marginLeft: 8, color: status.startsWith("Error") ? "red" : "green" }}>{status}</span>}
    </form>
  );
};

export default AddEmailForm;
