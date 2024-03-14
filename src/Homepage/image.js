import React, { useState, useRef } from 'react';

import Navbar from '../Navbar/navbar';
import Frames from '../Images/product7.png';
import html2canvas from 'html2canvas';
import Button from 'react-bootstrap/Button';
import Images from '../Images/product6.png';
import { useLocation } from 'react-router-dom';

function Image(){
  const location = useLocation();
  const imageURL = location.state?.imageURL || null;

  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(200);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);
  const divRef = useRef(null);
  
  const saveDivAsImage = () => {
    const divElement = divRef.current;
    if (!divElement) return;

    // Use html2canvas to capture the content of the div as an image
    html2canvas(divElement)
      .then((canvas) => {
        // Convert canvas to data URL
        const dataURL = canvas.toDataURL('image/png');

        // Create a link to download the image
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'div_image.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.error('Error capturing div as image:', error);
      });
  };
  const handleSaveImage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
  
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    // Load the Frames image
    const framesImg = new Image();
    framesImg.src = Frames;
    framesImg.onload = () => {
      // Draw the Frames image
      ctx.drawImage(framesImg, 0, 0, canvas.width, canvas.height);
  
      // Load the draggable image
      const imageImg = new Image();
      imageImg.src = Images;
      imageImg.onload = () => {
        // Draw the draggable image
        ctx.drawImage(imageImg, position.x, position.y, width, height);
  
        // Save the composite image
        const link = document.createElement('a');
        link.download = 'composite_image.png';
        link.href = canvas.toDataURL();
        link.click();
      };
    };
  };
  const handleMouseDown = (e) => {
    e.preventDefault();
    const isResizeHandle = e.target.classList.contains('resize-handle');
    const isImage = e.target.tagName.toLowerCase() === 'img';

    if (isResizeHandle) {
      setIsResizing(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    } else if (isImage) {
      const isCornerResize = e.clientX - position.x < 10 || e.clientY - position.y < 10;
      if (isCornerResize) {
          setIsResizing(true);
          setDragStart({ x: e.clientX, y: e.clientY });
      } else {
          setIsResizing(false);
          setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
          e.stopPropagation();
      }
  }
};

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  const handleMouseMove = (e) => {
    if (isResizing) {
      const containerRect = document.querySelector('.images-to-be-saved').getBoundingClientRect();
      const newWidth = width + e.clientX - dragStart.x;
      const newHeight = height + e.clientY - dragStart.y;
      const maxX = containerRect.width - position.x;
      const maxY = containerRect.height - position.y;
      const boundedWidth = Math.min(Math.max(newWidth, 0), maxX);
      const boundedHeight = Math.min(Math.max(newHeight, 0), maxY);
      
      setWidth(boundedWidth);
      setHeight(boundedHeight);
      setDragStart({ x: e.clientX, y: e.clientY });
    } else {
        if (!isResizing && e.buttons === 1 && e.target.tagName.toLowerCase() === 'img') {
            const isCornerResize = e.clientX - position.x < 10 || e.clientY - position.y < 10;
            if (isCornerResize) {
                setIsResizing(true);
                setDragStart({ x: e.clientX, y: e.clientY });
            } else {
              const containerRect = document.querySelector('.images-to-be-saved').getBoundingClientRect();
              const newX = e.clientX - dragStart.x;
              const newY = e.clientY - dragStart.y;
              const maxX = containerRect.width - width;
              const maxY = containerRect.height - height;
              const boundedX = Math.min(Math.max(newX, 0), maxX);
              const boundedY = Math.min(Math.max(newY, 0), maxY);
              setPosition({
                x: boundedX,
                y: boundedY,
            });
            }
        }
    }
};



  return (
    <>
    <Navbar/>
    <div>
    <div className='images-to-be-saved' ref={divRef}>
    
      <img src={imageURL} alt="Frames" style={{ width: '100%', height: '100%' }} />
    
      <div
          style={{
            position: 'absolute',
            width: width + 'px',
            height: height + 'px',
            left: position.x + 'px',
            top: position.y + 'px',
            cursor: isResizing ? 'nwse-resize' : 'move',
            overflow: 'hidden',
          }}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="resize-handle"
              style={{
                position: 'absolute',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#3498db',
                cursor: 'nwse-resize',
                top: '-5px',
                left: `${(width / 4) * (index + 1) - 5}px`,
              }}
            />
          ))}
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="resize-handle"
              style={{
                position: 'absolute',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#3498db',
                cursor: 'nwse-resize',
                top: `${(height / 4) * (index + 1) - 5}px`,
                left: '-5px',
              }}
            />
          ))}
          <img
            src={Images} 
            alt="Resizable and Draggable Image"
            style={{
              width: '100%',
              height: '100%',
              cursor: 'pointer',
            }}
          />
        </div>
        
    </div>
    
    <button className="round-button" onClick={saveDivAsImage}>Save Image</button></div>
    </>
  );
}

export default Image;