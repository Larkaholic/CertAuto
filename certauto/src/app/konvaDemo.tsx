"use client";
import React, { useRef, useState } from 'react';
import { Stage, Layer, Text, Image as KonvaImage } from 'react-konva';
import { sendBulkEmails } from './sendBulkEmails';
import { sendEmailsToAll } from './lib/email';

const STAGE_WIDTH = 400;
const STAGE_HEIGHT = 300;

const KonvaDemo: React.FC = () => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [stageText, setStageText] = useState<string>('Hello Konva!');
  const [textX, setTextX] = useState<number>(150);
  const [textY, setTextY] = useState<number>(200);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sendStatus, setSendStatus] = useState<string>('');
  const [isEmailJsSending, setIsEmailJsSending] = useState(false);
  const [emailJsStatus, setEmailJsStatus] = useState<string>("");
  const [imageWidth, setImageWidth] = useState<number>(STAGE_WIDTH);
  const [imageHeight, setImageHeight] = useState<number>(STAGE_HEIGHT);
  const inputRef = useRef<HTMLInputElement>(null);
  const stageRef = useRef<any>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (ev) {
      const img = new window.Image();
      img.onload = () => {
        setImage(img);
        setImageWidth(img.width);
        setImageHeight(img.height);
        // Resize the stage to match the original image size
        if (stageRef.current) {
          stageRef.current.width(img.width);
          stageRef.current.height(img.height);
        }
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSendAll = async () => {
    if (!stageRef.current) {
      setSendStatus('No canvas to render');
      return;
    }
    try {
      setIsSending(true);
      setSendStatus('Generating certificate image...');
      // Export at the current image size
      const certificateDataUrl = stageRef.current.toDataURL({
        width: imageWidth,
        height: imageHeight,
        mimeType: "image/png"
      });
      
      // Log image data to debug
      console.log("Certificate image data length:", certificateDataUrl.length);
      console.log("Certificate image data starts with:", certificateDataUrl.substring(0, 50));
      
      setSendStatus('Sending certificates to test email...');
      
      // Use the server action to send bulk emails with the certificate
      const result = await sendBulkEmails(certificateDataUrl);
      
      // Handle response based on success/failure
      if (result.success) {
        setSendStatus(`Success: ${result.message}`);
      } else {
        setSendStatus(`Error: ${result.message}`);
        console.error("Server returned error:", result.message);
      }
    } catch (error) {
      console.error("Error in handleSendAll:", error);
      setSendStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSending(false);
    }
  };

  const handleSendAllWithEmailJs = async () => {
    if (!stageRef.current) {
      setEmailJsStatus('No canvas to render');
      return;
    }
    try {
      setIsEmailJsSending(true);
      setEmailJsStatus('Generating certificate image...');
      // Export at the current image size
      const certificateDataUrl = stageRef.current.toDataURL({
        width: imageWidth,
        height: imageHeight,
        mimeType: "image/png"
      });
      setEmailJsStatus('Sending certificates using email.js...');
      const result = await sendEmailsToAll(certificateDataUrl);
      if (result.success) {
        setEmailJsStatus(`Success: ${result.message}`);
      } else {
        setEmailJsStatus(`Error: ${result.message}`);
      }
    } catch (error) {
      setEmailJsStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsEmailJsSending(false);
    }
  };

  const handleExportToLocal = () => {
    if (!stageRef.current) {
      alert('No canvas to export');
      return;
    }
    // Export at the current image size
    const dataUrl = stageRef.current.toDataURL({
      width: imageWidth,
      height: imageHeight,
      mimeType: "image/png"
    });

    // Create a link and trigger download
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'certificate.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ marginBottom: 8, display: 'block' }}
      />
      <input
        type="text"
        value={stageText}
        onChange={e => setStageText(e.target.value)}
        placeholder="Enter text to display"
        style={{ marginBottom: 8, display: 'block', width: 250 }}
      />
      <div style={{ marginBottom: 8, display: 'flex', gap: 12, alignItems: 'center' }}>
        <label>
          X:
          <input
            type="number"
            value={textX}
            min={0}
            max={STAGE_WIDTH}
            onChange={e => setTextX(Number(e.target.value))}
            style={{ width: 60, marginLeft: 4 }}
          />
        </label>
        <label>
          Y:
          <input
            type="number"
            value={textY}
            min={0}
            max={STAGE_HEIGHT}
            onChange={e => setTextY(Number(e.target.value))}
            style={{ width: 60, marginLeft: 4 }}
          />
        </label>
        <button
          onClick={handleSendAll}
          style={{ marginLeft: 16, backgroundColor: '#4CAF50', color: 'white', padding: '8px 16px', borderRadius: '4px', border: 'none' }}
          disabled={!image || isSending}
        >
          {isSending ? 'Sending...' : 'Send to All Emails in Firestore'}
        </button>
        <button
          onClick={handleSendAllWithEmailJs}
          style={{ marginLeft: 8, backgroundColor: '#1976d2', color: 'white', padding: '8px 16px', borderRadius: '4px', border: 'none' }}
          disabled={!image || isEmailJsSending}
        >
          {isEmailJsSending ? 'Sending...' : 'Send with email.js'}
        </button>
        <button
          onClick={handleExportToLocal}
          style={{ marginLeft: 8, backgroundColor: '#888', color: 'white', padding: '8px 16px', borderRadius: '4px', border: 'none' }}
          disabled={!image}
        >
          Export Image
        </button>
      </div>
      {sendStatus && (
        <div style={{ 
          marginBottom: 8, 
          padding: '8px', 
          backgroundColor: sendStatus.startsWith('Error') ? '#ffebee' : '#e8f5e9',
          borderRadius: '4px'
        }}>
          {sendStatus}
        </div>
      )}
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
      <div
        style={{
          width: STAGE_WIDTH,
          height: STAGE_HEIGHT,
          border: '1px solid #ccc',
          marginBottom: 16,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <Stage
          ref={stageRef}
          width={imageWidth}
          height={imageHeight}
          style={{
            width: STAGE_WIDTH,
            height: STAGE_HEIGHT,
            position: 'absolute',
            top: 0,
            left: 0,
            // This ensures the canvas fits inside the 400x300 box
            transform: `scale(${STAGE_WIDTH / imageWidth}, ${STAGE_HEIGHT / imageHeight})`,
            transformOrigin: 'top left',
            background: '#fff'
          }}
        >
          <Layer>
            {/* Background image, stretched to fill the stage */}
            {image && (
              <KonvaImage
                image={image}
                x={0}
                y={0}
                width={imageWidth}
                height={imageHeight}
                listening={false}
              />
            )}
            {/* Dynamic text */}
            <Text
              x={textX}
              y={textY}
              text={stageText}
              fontSize={24}
              fill="blue"
            />
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default KonvaDemo;
