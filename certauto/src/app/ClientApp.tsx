"use client";

import { useState } from "react";
import CertificateDesigner from "./components/CertificateDesigner";

export default function ClientApp() {
  const [activeTab, setActiveTab] = useState("designer");

  const renderTabContent = () => {
    switch (activeTab) {
      case "designer":
        return (
          <div className="py-4">
            <CertificateDesigner />
          </div>
        );
      case "generation":
        return (
          <div className="py-4 text-center">
            <div className="border rounded-lg p-4 shadow">
              <h4 className="text-xl font-medium mb-2">Certificate Generation</h4>
              <p>Upload your participant list to generate certificates in bulk</p>
              <p>This feature is coming soon. Please design your certificate template first.</p>
            </div>
          </div>
        );
      case "management":
        return (
          <div className="py-4 text-center">
            <div className="border rounded-lg p-4 shadow">
              <h4 className="text-xl font-medium mb-2">Certificate Management</h4>
              <p>Manage your certificates and track delivery status</p>
              <p>This feature is coming soon. Please design your certificate template first.</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold mb-2">CertAuto</h2>
          <p>Generate and manage certificates for your events</p>
        </div>

        <div className="flex justify-center mb-6 border-b">
          <button
            className={`px-4 py-2 ${activeTab === "designer" ? "border-b-2 border-blue-600 font-medium" : ""}`}
            onClick={() => setActiveTab("designer")}
          >
            Certificate Designer
          </button>
          <button
            className={`px-4 py-2 ${activeTab === "generation" ? "border-b-2 border-blue-600 font-medium" : ""}`}
            onClick={() => setActiveTab("generation")}
          >
            Certificate Generation
          </button>
          <button
            className={`px-4 py-2 ${activeTab === "management" ? "border-b-2 border-blue-600 font-medium" : ""}`}
            onClick={() => setActiveTab("management")}
          >
            Certificate Management
          </button>
        </div>

        {renderTabContent()}
      </div>
    </div>
  );
}
