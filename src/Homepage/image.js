import React, { useState, useRef } from 'react';
import { Rnd } from 'react-rnd';
import Navbar from '../Navbar/navbar';
import html2canvas from 'html2canvas';
import Button from 'react-bootstrap/Button';
import { useLocation, useNavigate } from 'react-router-dom';
import ViewPage from './ImageGallery';
import { Tooltip } from 'react-tooltip';
import { CiCircleInfo } from "react-icons/ci";
function Image() {
  const [file, setFile] = useState(null);

  // Function to handle file selection
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };
  const location = useLocation();
  const navigate = useNavigate();
  const imageURL = location.state?.imageURL || null;
  const productId = location.state?.productId || null;
  const [rotationAngle, setRotationAngle] = useState(0);
  const handleRotate = () => {
    setRotationAngle(rotationAngle + 90); // Rotate by 90 degrees clockwise
  };
  const [rotationFrame, setRotationFrame] = useState(0);
  const handleRotateFrame = () => {
    setRotationFrame(rotationFrame + 90); // Rotate by 90 degrees clockwise
  };
  const userId = localStorage.getItem('userId');
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
    const divElement = divRef.current;
    if (!divElement) return;
    html2canvas(divElement)
      .then((canvas) => {
        // Convert canvas to data URL
        const imageData = canvas.toDataURL('image/png');
        if (/^data:image\/(png|jpeg);base64,/.test(imageData)) {
          console.log('Image data:', imageData);

          fetch('/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ imageData, userId }),
          })
            .then(response => response.json())
            .then(data => {
              // Access the uploadId from the response data
              const uploadId = data.uploadId;
              navigate(`/productView/${productId}`, { state: { image: uploadId } });
              console.log("saved image id: ", uploadId);
            })
            .catch(error => {
              console.error('Error uploading image:', error);
            });

          //navigate(-1, { state: { image: imageData } });
        } else {
          console.error('Invalid imageData format:', imageData);
        }

      })
      .catch((error) => {
        console.error('Error capturing div as image:', error);
      });
    // Send image data to server (e.g., via fetch or Axios)

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
      <Navbar />
      <div className='edit-container'>
        <center><h2 style={{ fontFamily: 'Gelasio' }}>Edit Your Image</h2>
          <p style={{ marginBottom: '10px' }}>Here you can preview your image how it looks on the frame. </p></center>
        <div className='d-flex align-self-stretch ' style={{ paddingLeft: '30px' }}>


          <div className=" " id="bg-image-edit">
            <center>
              <div className='images-to-be-saved' ref={divRef}>

                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                  <img src={imageURL} alt="Frames" style={{ width: '100%', height: '100%', transform: `rotate(${rotationFrame}deg)` }} />
                  <div>

                    <Rnd
                      default={{
                        x: 0,
                        y: 0,
                        width: 200,
                        height: 200,
                      }}
                      bounds='.images-to-be-saved'
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,

                      }}
                    >
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          background: 'rgba(0, 0, 0, 0.5)',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          overflow: 'hidden',
                        }}
                      >
                        {file ? (
                          <img
                            src={URL.createObjectURL(file)}
                            alt="Uploaded"
                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                          />
                        ) : (
                          <span>Draggable and Resizable Component</span>
                        )}
                      </div>
                    </Rnd>
                  </div>
                </div>
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
                          left: index % 2 === 0 ? '-5px' : index >= 4 && index < 6 ? 'calc(50% - 5px)' : 'calc(100% - 5px)', // Left for even, middle for next 2, right for last 4

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


          <div style={{ width: '30%' }} className='right-container-edit'>
            <div className='d-flex align-items-center ' style={{ marginBottom: "10px"}}>
            <Button style={{ backgroundColor: 'rgb(121, 95, 73)', borderColor: 'rgb(121, 95, 73)' }} onClick={handleRotateFrame}>Rotate Your Frame</Button><br />
            <CiCircleInfo className='my-anchor-element' style={{marginLeft:'10px'}}/>
           </div> <Tooltip anchorSelect=".my-anchor-element" place="top">
              If you rotate the frame then the photo putten into it will be exactly like that.
            </Tooltip>
            {/* <input type="file" ref={inputRef} onChange={handleImageChange} name="file" id="file" class="inputfile"/><label for="file">Choose a file</label> <br /> */}
            <input type="file" onChange={handleFileChange} />

            {/* <p style={{ textAlign: 'left', fontFamily: 'inter', fontSize: '20px', fontWeight: 'bold', color: '#c7522a', marginTop: '3px', marginBottom: '3px' }}>Your image preview</p>
            {image && <img src={image} alt="Preview" style={{ maxWidth: '100%', maxHeight: '300px' }} />}<br /> */}


            <Button className="round-button" style={{ backgroundColor: '#225931', borderColor: '#225931', marginTop: '9px' }} onClick={saveDivAsImage}>Download Image</Button>
            <Button className="round-button" style={{ backgroundColor: '#225931', borderColor: '#225931', marginTop: '9px' }} onClick={handleSaveImage}>Add to Cart</Button>

          </div>
          {/* <ViewPage /> */}
        </div>

      </div>
    </>
  );
}

export default Image;
