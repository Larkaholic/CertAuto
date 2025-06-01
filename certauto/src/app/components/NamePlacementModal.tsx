"use client";

import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Import Konva components with SSR disabled
const KonvaComponents = dynamic(() => import('./KonvaComponents'), { ssr: false });

interface NamePlacementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (nameConfig: NameConfig, imageConfig?: ImageConfig) => void;
  certificateImage: string;
  initialConfig?: NameConfig;
  initialImageConfig?: ImageConfig;
}

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

const NamePlacementModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  certificateImage,
  initialConfig,
  initialImageConfig
}: NamePlacementModalProps) => {
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });
  const [nameConfig, setNameConfig] = useState<NameConfig>(
    initialConfig || {
      x: stageSize.width / 2,
      y: stageSize.height / 2,
      fontSize: 24,
      fontFamily: 'Arial',
      fontColor: '#000000',
      fontStyle: 'normal',
      align: 'center',
    }
  );
  
  const [imageConfig, setImageConfig] = useState<ImageConfig>(
    initialImageConfig || {
      x: 0,
      y: 0,
      width: stageSize.width,
      height: stageSize.height,
      rotation: 0,
    }
  );
  
  const [selected, setSelected] = useState<string | null>(null);
  const textRef = useRef<any>(null);
  const imageRef = useRef<any>(null);
  const trRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [sampleName] = useState('Participant Name');
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [lockAspectRatio, setLockAspectRatio] = useState(true);
  
  // Store initial stage size
  const initialStageSizeRef = useRef(stageSize);

  // Resize stage to fit container - fixed to avoid infinite update
  useEffect(() => {
    if (!containerRef.current || !isOpen) return;
    
    const resizeStage = () => {
      const width = containerRef.current!.offsetWidth;
      const height = width * 0.7;
      setStageSize({ width, height });
      initialStageSizeRef.current = { width, height };
    };
    
    resizeStage();
    
    // Add resize listener
    window.addEventListener('resize', resizeStage);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeStage);
    };
  }, [isOpen]);

  // Load certificate background image
  useEffect(() => {
    if (certificateImage && typeof window !== 'undefined') {
      const img = new window.Image();
      img.src = certificateImage;
      img.onload = () => {
        setImage(img);
        setImageLoaded(true);
        
        // If no initial config, size image to fit stage while maintaining aspect ratio
        if (!initialImageConfig) {
          const imgAspectRatio = img.width / img.height;
          const stageAspectRatio = initialStageSizeRef.current.width / initialStageSizeRef.current.height;
          
          let newWidth = initialStageSizeRef.current.width;
          let newHeight = initialStageSizeRef.current.height;
          
          if (imgAspectRatio > stageAspectRatio) {
            // Image is wider than stage
            newHeight = initialStageSizeRef.current.width / imgAspectRatio;
          } else {
            // Image is taller than stage
            newWidth = initialStageSizeRef.current.height * imgAspectRatio;
          }
          
          setImageConfig({
            ...imageConfig,
            width: newWidth,
            height: newHeight,
            x: (initialStageSizeRef.current.width - newWidth) / 2,
            y: (initialStageSizeRef.current.height - newHeight) / 2
          });
        }
      };
    }
  }, [certificateImage, initialImageConfig]);

  const checkDeselect = (e: any) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelected(null);
    }
  };

  const handleSave = () => {
    onSave(nameConfig, imageConfig);
    onClose();
  };

  const handleRotation = (value: number) => {
    setImageConfig({
      ...imageConfig,
      rotation: value,
    });
  };

  // Pass all props and state to KonvaComponents
  const canvasProps = {
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
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-medium">Position Certificate Elements</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>
        
        <div className="p-6">
          <div style={{ display: 'flex', gap: '20px', flexDirection: 'column' }}>
            <div ref={containerRef} style={{ width: '100%', border: '1px solid #ddd' }}>
              {typeof window !== 'undefined' && <KonvaComponents {...canvasProps} />}
            </div>

            <div style={{ padding: '10px' }}>
              <div className="space-y-6">
                <h5 className="font-medium text-lg">Element Controls</h5>
                
                <div className="pb-6 mb-6 border-b">
                  <h5 className="font-medium text-lg mb-4">Certificate Image</h5>
                  <div className="space-y-4">
                    <div>
                      <label className="flex items-center mb-2">
                        <input 
                          type="checkbox" 
                          checked={lockAspectRatio}
                          onChange={(e) => setLockAspectRatio(e.target.checked)}
                          className="mr-2"
                        />
                        Lock aspect ratio
                      </label>
                    </div>
                    
                    <div>
                      <span>Rotation: {imageConfig.rotation}°</span>
                      <input
                        type="range"
                        min={0}
                        max={360}
                        value={imageConfig.rotation}
                        onChange={(e) => handleRotation(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-1">X</label>
                        <input
                          type="number"
                          value={Math.round(imageConfig.x)}
                          onChange={(e) => setImageConfig({
                            ...imageConfig,
                            x: Number(e.target.value),
                          })}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block mb-1">Y</label>
                        <input
                          type="number"
                          value={Math.round(imageConfig.y)}
                          onChange={(e) => setImageConfig({
                            ...imageConfig,
                            y: Number(e.target.value),
                          })}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-1">Width</label>
                        <input
                          type="number"
                          value={Math.round(imageConfig.width)}
                          onChange={(e) => {
                            const newWidth = Number(e.target.value);
                            if (lockAspectRatio) {
                              const aspectRatio = imageConfig.width / imageConfig.height;
                              setImageConfig({
                                ...imageConfig,
                                width: newWidth,
                                height: newWidth / aspectRatio,
                              });
                            } else {
                              setImageConfig({
                                ...imageConfig,
                                width: newWidth,
                              });
                            }
                          }}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block mb-1">Height</label>
                        <input
                          type="number"
                          value={Math.round(imageConfig.height)}
                          onChange={(e) => {
                            const newHeight = Number(e.target.value);
                            if (lockAspectRatio) {
                              const aspectRatio = imageConfig.width / imageConfig.height;
                              setImageConfig({
                                ...imageConfig,
                                height: newHeight,
                                width: newHeight * aspectRatio,
                              });
                            } else {
                              setImageConfig({
                                ...imageConfig,
                                height: newHeight,
                              });
                            }
                          }}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => {
                        setImageConfig({
                          ...imageConfig,
                          x: (stageSize.width - imageConfig.width) / 2,
                          y: (stageSize.height - imageConfig.height) / 2,
                        });
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Center Image
                    </button>
                  </div>
                </div>
                
                <h5 className="font-medium text-lg mb-4">Text Formatting</h5>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1">Font Size: {nameConfig.fontSize}px</label>
                    <input
                      type="range"
                      min={10}
                      max={72}
                      value={nameConfig.fontSize}
                      onChange={(e) => setNameConfig({ 
                        ...nameConfig, 
                        fontSize: Number(e.target.value) 
                      })}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block mb-1">Font Family</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={nameConfig.fontFamily}
                      onChange={(e) => setNameConfig({ 
                        ...nameConfig, 
                        fontFamily: e.target.value 
                      })}
                    >
                      <option value="Arial">Arial</option>
                      <option value="Times New Roman">Times New Roman</option>
                      <option value="Courier New">Courier New</option>
                      <option value="Verdana">Verdana</option>
                      <option value="Georgia">Georgia</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1">Font Style</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={nameConfig.fontStyle}
                      onChange={(e) => setNameConfig({ 
                        ...nameConfig, 
                        fontStyle: e.target.value 
                      })}
                    >
                      <option value="normal">Normal</option>
                      <option value="bold">Bold</option>
                      <option value="italic">Italic</option>
                      <option value="bold italic">Bold Italic</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1">Text Alignment</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={nameConfig.align}
                      onChange={(e) => setNameConfig({ 
                        ...nameConfig, 
                        align: e.target.value 
                      })}
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1">Font Color</label>
                    <input
                      type="color"
                      value={nameConfig.fontColor}
                      onChange={(e) => setNameConfig({
                        ...nameConfig,
                        fontColor: e.target.value,
                      })}
                      className="w-full p-1 border rounded"
                    />
                  </div>

                  <div>
                    <label className="block mb-1">Position</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-1">X</label>
                        <input
                          type="number"
                          value={Math.round(nameConfig.x)}
                          onChange={(e) => setNameConfig({
                            ...nameConfig,
                            x: Number(e.target.value),
                          })}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block mb-1">Y</label>
                        <input
                          type="number"
                          value={Math.round(nameConfig.y)}
                          onChange={(e) => setNameConfig({
                            ...nameConfig,
                            y: Number(e.target.value),
                          })}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end p-4 border-t space-x-2">
          <button 
            className="px-4 py-2 border rounded hover:bg-gray-100"
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleSave}
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};

export default NamePlacementModal;
