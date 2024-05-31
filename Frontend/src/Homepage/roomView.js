import Navbar from '../Navbar/navbar';
import React, { useState, useRef } from 'react';
import { Rnd } from 'react-rnd';
import html2canvas from 'html2canvas';
import Button from 'react-bootstrap/Button';
import { useLocation, useNavigate } from 'react-router-dom';
import ViewPage from './ImageGallery';
import { Tooltip } from 'react-tooltip';
import { CiCircleInfo } from "react-icons/ci";
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
function RoomView() {
  const [file, setFile] = useState(null);
  const [crop, setCrop] = useState({ aspect: 16 / 9 });
  // Function to handle file selection
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };
  const location = useLocation();
  const navigate = useNavigate();
  const imageURL = location.state?.croppedImageUrl || null;

  const productId = location.state?.productId || null;
  const [rotationAngle, setRotationAngle] = useState(0);
  const onCropChange = (crop) => {
    setCrop(crop);
  };
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
  const onCropComplete = (croppedAreaPixels) => {
    if (image) {
      const canvas = document.createElement('canvas');
      const imageRef = document.createElement('img');

      imageRef.onload = () => {
        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(
          imageRef,
          croppedAreaPixels.x,
          croppedAreaPixels.y,
          croppedAreaPixels.width,
          croppedAreaPixels.height,
          0,
          0,
          croppedAreaPixels.width,
          croppedAreaPixels.height
        );

        const croppedImage = canvas.toDataURL('image/png');
        setImage(croppedImage);
      };

      imageRef.src = image;
    }
  };


  return (
    <>
      <Navbar />
      <div className='edit-container'>
        <h3 style={{ fontFamily: 'Recoleta,Georgia,serif', color: 'rgb(121, 95, 73)', textAlign: 'center' }}>Room View</h3>
        <p style={{ fontFamily: 'Recoleta,Georgia,serif', color: 'rgb(121, 95, 73)', textAlign: 'center' }}>Upload your room spaces here to check how the frame </p>
        <div className='d-flex align-self-stretch ' style={{ paddingLeft: '30px' }}>
          <div className=" " id="bg-image-edit">
            <center>
              <div className='images-to-be-saved' ref={divRef}>

                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                  {file && (<img src={URL.createObjectURL(file)} alt="Frames" style={{ width: '100%', height: '100%', transform: `rotate(${rotationFrame}deg)` }} />
                  )}
                  {imageURL && (
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
                              src={imageURL}
                              alt="Uploaded"
                              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                            />
                          ) : (
                            <span>Draggable and Resizable Component</span>
                          )}
                        </div>
                      </Rnd>
                    </div>
                  )}
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
          <input type="file" onChange={handleFileChange} name="file" id="file" class="inputfile"/><label for="file">Choose a file</label> <br /> 

            <div className='d-flex align-items-center ' style={{ marginBottom: "10px" }}>
              
              <Button style={{ backgroundColor: 'rgb(121, 95, 73)', borderColor: 'rgb(121, 95, 73)' }} onClick={handleRotateFrame}>Rotate Your Frame</Button><br />
              <CiCircleInfo className='my-anchor-element' style={{ marginLeft: '10px' }} />
            </div> <Tooltip anchorSelect=".my-anchor-element" place="top">
              If you rotate the frame then the photo putten into it will be exactly like that.
            </Tooltip>
          

            {/* <p style={{ textAlign: 'left', fontFamily: 'inter', fontSize: '20px', fontWeight: 'bold', color: '#c7522a', marginTop: '3px', marginBottom: '3px' }}>Your image preview</p>
            {image && <img src={image} alt="Preview" style={{ maxWidth: '100%', maxHeight: '300px' }} />}<br /> */}


            <Button className="round-button" style={{ backgroundColor: '#225931', borderColor: '#225931', marginTop: '9px' }} onClick={saveDivAsImage}>Download Image</Button>

          </div>
        </div>
      </div>
    </>

  )
}
export default RoomView;