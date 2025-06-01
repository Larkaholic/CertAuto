"use client";

import React from 'react';
import { Stage, Layer, Text, Image, Transformer } from 'react-konva';

const KonvaComponents = (props: any) => {
  const {
    stageSize,
    nameConfig,
    imageConfig,
    selected,
    setSelected,
    textRef,
    imageRef,
    trRef,
    sampleName,
    image,
    imageLoaded,
    lockAspectRatio,
    checkDeselect,
    setNameConfig,
    setImageConfig,
  } = props;
  
  // Safety check to ensure we're running in browser environment
  if (typeof window === 'undefined') {
    return null;
  }

  return (
    <Stage
      width={stageSize.width}
      height={stageSize.height}
      onMouseDown={checkDeselect}
      onTouchStart={checkDeselect}
    >
      <Layer>
        {imageLoaded && image && (
          <Image
            ref={imageRef}
            image={image}
            x={imageConfig.x}
            y={imageConfig.y}
            width={imageConfig.width}
            height={imageConfig.height}
            rotation={imageConfig.rotation}
            draggable
            onClick={() => setSelected('image')}
            onTap={() => setSelected('image')}
            onDragEnd={(e) => {
              setImageConfig({
                ...imageConfig,
                x: e.target.x(),
                y: e.target.y(),
              });
            }}
          />
        )}
        <Text
          ref={textRef}
          text={sampleName}
          x={nameConfig.x}
          y={nameConfig.y}
          fontSize={nameConfig.fontSize}
          fontFamily={nameConfig.fontFamily}
          fill={nameConfig.fontColor}
          fontStyle={nameConfig.fontStyle}
          align={nameConfig.align}
          draggable
          onClick={() => setSelected('text')}
          onTap={() => setSelected('text')}
          onDragEnd={(e) => {
            setNameConfig({
              ...nameConfig,
              x: e.target.x(),
              y: e.target.y(),
            });
          }}
        />
        {selected && (
          <Transformer
            ref={trRef}
            boundBoxFunc={(oldBox, newBox) => {
              // Limit resize
              if (newBox.width < 10 || newBox.height < 10) {
                return oldBox;
              }
              
              // If image is selected and aspect ratio is locked, maintain aspect ratio
              if (selected === 'image' && lockAspectRatio) {
                const aspect = imageConfig.width / imageConfig.height;
                if (Math.abs(newBox.width / newBox.height - aspect) > 0.1) {
                  // Calculate new dimensions that maintain aspect ratio
                  const adjustedHeight = newBox.width / aspect;
                  return {
                    ...newBox,
                    height: adjustedHeight,
                  };
                }
              }
              return newBox;
            }}
            onTransformEnd={() => {
              if (selected === 'text' && textRef.current) {
                const node = textRef.current;
                setNameConfig({
                  ...nameConfig,
                  fontSize: node.fontSize() * node.scaleX(),
                  x: node.x(),
                  y: node.y(),
                });
                // Reset scale
                node.scaleX(1);
                node.scaleY(1);
              } else if (selected === 'image' && imageRef.current) {
                const node = imageRef.current;
                setImageConfig({
                  ...imageConfig,
                  x: node.x(),
                  y: node.y(),
                  width: node.width() * node.scaleX(),
                  height: node.height() * node.scaleY(),
                });
                // Reset scale
                node.scaleX(1);
                node.scaleY(1);
              }
            }}
          />
        )}
      </Layer>
    </Stage>
  );
};

export default KonvaComponents;
