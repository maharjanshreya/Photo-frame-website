import React, { useState } from 'react';
import Draggable from 'react-draggable';
import { Resizable } from 'react-resizable';
import Navbar from '../Navbar/navbar';
import Frames from '../Images/product7.png';
import Images from '../Images/product6.png';
function Image(){
    const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(200);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    e.preventDefault();
    const isResizeHandle = e.target.classList.contains('resize-handle');
    const isImage = e.target.tagName.toLowerCase() === 'img';

    if (isResizeHandle) {
      setIsResizing(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    } else if (isImage) {
      setIsResizing(false);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
      e.stopPropagation(); 
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  const handleMouseMove = (e) => {
    if (isResizing  && e.buttons === 1) {
      const newWidth = width + e.clientX - dragStart.x;
      const newHeight = height + e.clientY - dragStart.y;
       // Limit resizing within the container bounds
       const containerBounds = document.querySelector('.image-product').getBoundingClientRect();
       const maxWidth = containerBounds.width;
       const maxHeight = containerBounds.height;
       
       setWidth(newWidth > 0 && newWidth < maxWidth ? newWidth : width);
       setHeight(newHeight > 0 && newHeight < maxHeight ? newHeight : height);
 
       setDragStart({ x: e.clientX, y: e.clientY });
    } else {
      if (!isResizing && e.buttons === 1 && e.target.tagName.toLowerCase() === 'img') {

        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;

        // Limit dragging within the container bounds
        const containerBounds = document.querySelector('.image-product').getBoundingClientRect();
        const maxX = containerBounds.width - width;
        const maxY = containerBounds.height - height;

        setPosition({
          x: newX >= 0 && newX <= maxX ? newX : position.x,
          y: newY >= 0 && newY <= maxY ? newY : position.y,
        });
      }
    }
  };

  return (
    <>
   
    <div style={{
        width: '100%',
        height: '100%',
        backgroundImage: `url(${Frames})`, // Add your background image path
        backgroundSize: 'cover', // Adjust as needed
        backgroundPosition: 'center', // Adjust as needed
    }}> 
    <div
      style={{
        backgroundImage: `url(${Frames})`, // Add your background image path
        backgroundSize: 'cover', // Adjust as needed
        backgroundPosition: 'center', // Adjust as needed
        width: width + 'px',
        height: height + 'px',
        
        overflow: 'hidden',
        position: 'absolute',
        left: position.x + 'px',
        top: position.y + 'px',
        cursor: isResizing ? 'nwse-resize' : 'move',
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
        src={Images} // Replace with your image path
        alt="Resizable and Draggable Image"
        style={{
          width: '100%',
          height: '100%',
          cursor: 'pointer',
        }}
      />
    </div></div></>
  );
}

export default Image;