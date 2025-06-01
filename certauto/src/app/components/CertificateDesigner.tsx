"use client";

import { useState, useRef } from 'react';
import NamePlacementModal from './NamePlacementModal';

interface NameConfig {
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  fontColor: string;
  fontStyle: string;
  align: string;
}

interface ImageConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

const CertificateDesigner = () => {
  const [certificateImage, setCertificateImage] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [nameConfig, setNameConfig] = useState<NameConfig | null>(null);
  const [imageConfig, setImageConfig] = useState<ImageConfig | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setCertificateImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveConfig = (newNameConfig: NameConfig, newImageConfig?: ImageConfig) => {
    setNameConfig(newNameConfig);
    if (newImageConfig) {
      setImageConfig(newImageConfig);
    }
    alert('Certificate configuration saved successfully');
  };

  const handleSaveCertificate = () => {
    if (nameConfig && certificateImage) {
      alert('Certificate template saved successfully!');
      console.log('Certificate template data:', {
        certificateImage,
        nameConfig,
        imageConfig,
      });
      // Here you would typically save this to your database
    } else {
      alert('Please upload a certificate image and set name position');
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div className="border rounded-lg p-6 shadow bg-white">
        <h3 className="text-xl font-medium mb-4">Certificate Design</h3>
        <div className="flex flex-col gap-6">
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
              ref={fileInputRef}
            />
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => fileInputRef.current?.click()}
            >
              Upload Certificate Template
            </button>
          </div>

          {certificateImage && (
            <>
              <div style={{ textAlign: 'center' }}>
                <img
                  src={certificateImage}
                  alt="Certificate Template"
                  style={{ maxWidth: '100%', maxHeight: '400px' }}
                />
              </div>

              <div className="flex gap-4">
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={() => setIsModalOpen(true)}
                  title="Position the certificate image and participant's name"
                >
                  Position Certificate Elements
                </button>

                <button
                  className={`px-4 py-2 rounded ${!nameConfig ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                  onClick={handleSaveCertificate}
                  disabled={!nameConfig}
                >
                  Save Certificate Template
                </button>
              </div>

              <NamePlacementModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveConfig}
                certificateImage={certificateImage}
                initialConfig={nameConfig || undefined}
                initialImageConfig={imageConfig || undefined}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CertificateDesigner;
