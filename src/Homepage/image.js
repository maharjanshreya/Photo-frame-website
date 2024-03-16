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
  const [rotationAngle, setRotationAngle] = useState(0);
  const handleRotate = () => {
    setRotationAngle(rotationAngle + 90); // Rotate by 90 degrees clockwise
  };
  const [rotationFrame, setRotationFrame] = useState(0);
  const handleRotateFrame = () => {
    setRotationFrame(rotationFrame + 90); // Rotate by 90 degrees clockwise
  };
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(200);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);
  const divRef = useRef(null);
  const inputRef = useRef(null);
const [image, setImage] = useState(null);
const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  }
};
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
      imageImg.src = image;
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

const handleMouseUp = (e) => {
  // Check if the mouse is released inside the resizable area
  const isInsideResizableArea = e.target === divRef.current || divRef.current.contains(e.target);

  // Update isResizing only if the mouse is not released inside the resizable area
  if (!isInsideResizableArea) {
    setIsResizing(false);
  }
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
const [imagePreview, setImagePreview] = useState(null); // For image preview
const [uploadedImage, setUploadedImage] = useState(null);
const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedImage(event.target.result);
      setImagePreview(URL.createObjectURL(file)); // Set image preview
    };
    reader.readAsDataURL(file);
  }
};


const handleRotateImage = () => {
  setRotationAngle(rotationAngle + 90);
};


  return (
    <>
    <Navbar/>
    <center><h2 style={{fontFamily:'Gelasio'}}>Edit Your Image</h2>
    <p style={{marginBottom:'10px'}}>Here you can preview your image how it looks on the frame. </p></center>
    <div className='d-flex justify-content-around '>
      <div className='container-left'>
        <p style={{fontFamily:'inter',fontSize:'20px',fontWeight:'bold',color:'#c7522a'}}>Available editing tools:</p>
        <center><p>Rotate your image</p>
        <Button className="round-button" onClick={handleRotate}> Image</Button><br/>
        <Button className="round-button" style={{backgroundColor:'#838469',borderColor:'#838469'}}onClick={handleRotateFrame}> Frame</Button><br/>
        </center>
      </div>
      
      <div className=" " id="bg-image-edit">
        <center>
        <div className='images-to-be-saved' ref={divRef}>
    
          <img src={imageURL} alt="Frames" style={{ width: '100%', height: '100%',transform: `rotate(${rotationFrame}deg)`  }} />
          {image && (
          <div
              style={{
                position: 'absolute',
                width: width + 'px',
                height: height + 'px',
                left: position.x + 'px',
                top: position.y + 'px',
                cursor: isResizing ? 'nwse-resize' : 'move',
                transform: `rotate(${rotationAngle}deg)`,
                overflow: 'hidden',
              }}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
            >
         {[...Array(8)].map((_, index) => (
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
                  top: index < 2 ? '-5px' : index >= 2 && index < 4 ? 'calc(50% - 5px)' : 'calc(100% - 5px)', // Top for first 2, middle for next 2, bottom for last 4
                  left: index % 2 === 0 ? '-5px' :index >= 4 && index < 6 ? 'calc(50% - 5px)' : 'calc(100% - 5px)', // Left for even, middle for next 2, right for last 4
                
                }}
              />
            ))}
          <img
            src={image} 
            alt="Resizable and Draggable Image"
            style={{
              width: '100%',
              height: '100%',
              cursor: 'pointer',
              
            }}
          />
        </div>
        )}
          </div>
          </center>
         
          </div>
      
   

      <div className="">
        <input type="file" ref={inputRef} onChange={handleImageChange} name="file" id="file" class="inputfile"/><label for="file">Choose a file</label> <br />
        <p style={{textAlign:'left',fontFamily:'inter',fontSize:'20px',fontWeight:'bold',color:'#c7522a',marginTop:'3px',marginBottom:'3px'}}>Your image preview</p>
        {image && <img src={image} alt="Preview" style={{ maxWidth: '100%', maxHeight: '300px' }} />}<br/>
        
        
        <Button className="round-button" style={{backgroundColor:'#225931',borderColor:'#225931',marginTop:'9px'}} onClick={saveDivAsImage}>Save Image</Button>

      </div>

    </div>

    
    </>
  );
}

export default Image;
