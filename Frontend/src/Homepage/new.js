import React, { useEffect, useRef } from 'react';
import Image2 from '../Images/about.png';
import Frames from '../Images/product3_t.png';

const FramedImage = () => {
  const canvasRef = useRef(null);

  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
  
    const sourceImage = new Image();
    const frameImage = new Image();
  
    sourceImage.onload = () => {
      const targetWidth = Math.max(sourceImage.width, frameImage.width);
      const targetHeight = Math.max(sourceImage.height, frameImage.height);
  
      // Set the canvas dimensions based on the target dimensions
      canvas.width = targetWidth;
      canvas.height = targetHeight;
  
      // Set the dimensions of both images to match the target dimensions
      const scaleFactor = Math.min(targetWidth / sourceImage.width, targetHeight / sourceImage.height);
  
      sourceImage.width *= scaleFactor;
      sourceImage.height *= scaleFactor;
  
      frameImage.width = targetWidth;
      frameImage.height = targetHeight;
  
      // Calculate position to center images
      const xSource = (targetWidth - sourceImage.width) / 2;
      const ySource = (targetHeight - sourceImage.height) / 2;
  
      const xFrame = (targetWidth - frameImage.width) / 2;
      const yFrame = (targetHeight - frameImage.height) / 2;
  
      // Draw source image as the background
      ctx.drawImage(
        sourceImage,
        xSource,  // destinationX
        ySource,  // destinationY
        sourceImage.width,  // destinationWidth
        sourceImage.height  // destinationHeight
      );
  
      // Draw frame image on top
      ctx.drawImage(
        frameImage,
        xFrame,  // destinationX
        yFrame,  // destinationY
        frameImage.width,  // destinationWidth
        frameImage.height  // destinationHeight
      );
    };
  
    sourceImage.src = Image2;
    frameImage.src = Frames;
  };
  
  
  
  
  useEffect(() => {
    draw();
  }, []);

  return <canvas ref={canvasRef}></canvas>;
};

export default FramedImage;
