// ImageFrameOverlay.js
import React, { useRef, useEffect } from 'react';

const ImageFrameOverlay = ({ frameSrc, photoSrc }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    console.log('Frame Src:', frameSrc);
    console.log('Photo Src:', photoSrc);

    const loadImages = async () => {
      try {
        const frameImage = new Image();
        
    frameImage.onload = () => console.log('Frame Image Loaded:', frameImage.width, frameImage.height);
    
        frameImage.src = frameSrc;

        const userPhoto = new Image();
        userPhoto.onload = () => console.log('User Photo Loaded:', userPhoto.width, userPhoto.height);
        userPhoto.src = photoSrc;
        console.log('Frame Image Dimensions:', frameImage.width, frameImage.height);
        console.log('User Photo Dimensions:', userPhoto.width, userPhoto.height);
        await Promise.all([frameImage, userPhoto]);

        // Set canvas size to match the frame image
        canvas.width = frameImage.width;
        canvas.height = frameImage.height;

        // Calculate the scaling factor for the user photo
        const scaleFactor = Math.min(
            (frameImage.width - 4) / userPhoto.width,
            (frameImage.height - 4) / userPhoto.height
        );

        // Calculate the new dimensions for the user photo
        const newWidth = userPhoto.width * scaleFactor;
        const newHeight = userPhoto.height * scaleFactor;

        // Calculate the position to center the user photo within the frame
        const x = (frameImage.width - newWidth) / 2;
        const y = (frameImage.height - newHeight) / 2;

        // Draw the frame image
        context.drawImage(frameImage, 0, 0);

        // Draw the resized user photo on top of the frame
        context.drawImage(userPhoto, x, y, newWidth, newHeight);
      } catch (error) {
        console.error('Error loading images:', error);
      }
    };

    loadImages();
  }, [frameSrc, photoSrc]);

  return <canvas ref={canvasRef} style={{ border: '1px solid black' }} />;
};

export default ImageFrameOverlay;
