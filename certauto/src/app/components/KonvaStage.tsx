"use client";

import React from 'react';
import { Stage } from 'react-konva';

interface KonvaStageProps {
  width: number;
  height: number;
  children: React.ReactNode;
  onMouseDown?: (e: any) => void;
  onTouchStart?: (e: any) => void;
}

const KonvaStage: React.FC<KonvaStageProps> = ({ 
  width, 
  height, 
  children, 
  onMouseDown,
  onTouchStart
}) => {
  return (
    <Stage 
      width={width} 
      height={height}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
    >
      {children}
    </Stage>
  );
};

export default KonvaStage;
