"use client";
import React, { useRef, useState } from 'react';
import { Stage, Layer, Text, Image as KonvaImage } from 'react-konva';

const STAGE_WIDTH = 400;
const STAGE_HEIGHT = 300;

const KonvaDemo: React.FC = () => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [stageText, setStageText] = useState<string>('Hello Konva!');
  const [textX, setTextX] = useState<number>(150);
  const [textY, setTextY] = useState<number>(200);
  const inputRef = useRef<HTMLInputElement>(null);
  const stageRef = useRef<any>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (ev) {
      const img = new window.Image();
      img.onload = () => setImage(img);
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleExport = () => {
    if (stageRef.current) {
      const uri = stageRef.current.toDataURL({ pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = 'certificate.png';
      link.href = uri;
      link.click();
    }
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
          onClick={handleExport}
          style={{ marginLeft: 16 }}
          disabled={!image}
        >
          Export as PNG
        </button>
      </div>
      <Stage
        ref={stageRef}
        width={STAGE_WIDTH}
        height={STAGE_HEIGHT}
        style={{ border: '1px solid #ccc', marginBottom: 16 }}
      >
        <Layer>
          {/* Background image, stretched to fill the stage */}
          {image && (
            <KonvaImage
              image={image}
              x={0}
              y={0}
              width={STAGE_WIDTH}
              height={STAGE_HEIGHT}
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
  );
};

export default KonvaDemo;
