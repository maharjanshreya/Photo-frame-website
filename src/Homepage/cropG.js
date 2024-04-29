import { useState, useRef } from "react";
import ReactCrop, { centerCrop, convertToPixelCrop, makeAspectCrop } from "react-image-crop";
import setCanvasPreview from "./setCanvasPreview";
import { useLocation, useNavigate } from 'react-router-dom'; 
import { Button } from "react-bootstrap";
import Navbar from '../Navbar/navbar';
const ASPECT_RATIO = 1;
const MIN_DIMENSION = 150;

const ImageCropper = () => {
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState();
  const [croppedImageUrl, setCroppedImageUrl] = useState(null);
  const [error, setError] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const imageURL = location.state?.imageURL || null;
  const productId = location.state?.productId || null;

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    const cropWidthInPercent = (MIN_DIMENSION / width) * 100;

    const crop = makeAspectCrop(
      {
        unit: "%",
        width: cropWidthInPercent,
      },
      ASPECT_RATIO,
      width,
      height
    );
    const centeredCrop = centerCrop(crop, width, height);
    setCrop(centeredCrop);
  };

  const handleCropImage = () => {
    if (!crop || !imgRef.current || !previewCanvasRef.current) return;

    setCanvasPreview(
      imgRef.current, // HTMLImageElement
      previewCanvasRef.current, // HTMLCanvasElement
      convertToPixelCrop(
        crop,
        imgRef.current.width,
        imgRef.current.height
      )
    );

    const dataUrl = previewCanvasRef.current.toDataURL();
    setCroppedImageUrl(dataUrl); // Set the cropped image URL in state
  };

  const handleGoAhead = () => {
    if (croppedImageUrl) {
      // Navigate to another file and pass the cropped image URL as state
      navigate('/roomView', { state: { croppedImageUrl,productId } });
    }
  };
  return (
    <>
    <Navbar />
    <h3 style={{fontFamily: 'Recoleta,Georgia,serif',color:'rgb(121, 95, 73)',textAlign:'center'}}>Crop Image</h3>
    <p style={{fontFamily: 'Recoleta,Georgia,serif',color:'rgb(121, 95, 73)',textAlign:'center'}}>Please crop the required frame image since the whole background may come.</p>
    <div className="edit-container" style={{backgroundColor:'#e0e0e0',paddingTop:'30px',paddingBottom:'30px',textAlign:'center'}}> 
    
      {error && <p className="text-red-400 text-xs">{error}</p>}
      <div style={{width:'50%',margin:'auto'}}>
      {imageURL && (
        <div className="flex flex-col items-center" >
          <ReactCrop
            crop={crop}
            onChange={(pixelCrop, percentCrop) => setCrop(percentCrop)}
       
            keepSelection
           
            minWidth={MIN_DIMENSION}
          >
            <img
              ref={imgRef}
              src={imageURL}
              alt="Upload"
              style={{ maxHeight: "70vh" }}
              onLoad={onImageLoad}
            />
          </ReactCrop><br/>
          <Button
            variant="outline-dark" className='add-to-cart'
            onClick={handleCropImage}
          >
            Crop Image
          </Button>
        </div>
      )}</div>

      </div>
      <h3 style={{fontFamily: 'Recoleta,Georgia,serif',color:'rgb(121, 95, 73)',textAlign:'center',marginTop:'30px'}}>Image Preview</h3>
    <p style={{fontFamily: 'Recoleta,Georgia,serif',color:'rgb(121, 95, 73)',textAlign:'center'}}>Please crop the required frame image since the whole background may come.</p>
    <div className="edit-container" style={{backgroundColor:'#e0e0e0',paddingTop:'30px',paddingBottom:'30px',textAlign:'center'}}> 

      {croppedImageUrl && (
        <img
          src={croppedImageUrl}
          alt="Cropped"
          style={{ maxHeight: "70vh" }}
        />
      )} 
      {crop && (
        <canvas
          ref={previewCanvasRef}
          className="mt-4"
          style={{
            display: "none",
            border: "1px solid black",
            objectFit: "contain",
            width: 150,
            height: 150,
          }}
        />
      )}<br/>
           <Button variant="outline-dark" className='add-to-cart' onClick={handleGoAhead}>Go Ahead</Button>

           </div>

    </>
  );
};

export default ImageCropper;
