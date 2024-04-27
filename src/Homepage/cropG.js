import { useState, useRef } from "react";
import ReactCrop, { centerCrop, convertToPixelCrop, makeAspectCrop } from "react-image-crop";
import setCanvasPreview from "./setCanvasPreview";
import { useLocation, useNavigate } from 'react-router-dom'; 
import { Button } from "react-bootstrap";

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
      {error && <p className="text-red-400 text-xs">{error}</p>}
      {imageURL && (
        <div className="flex flex-col items-center">
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
          </ReactCrop>
          <button
            className="text-white font-mono text-xs py-2 px-4 rounded-2xl mt-4 bg-sky-500 hover:bg-sky-600"
            onClick={handleCropImage}
          >
            Crop Image
          </button>
        </div>
      )}
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
      )}
      <Button variant="outline-dark" className='add-to-cart' onClick={handleGoAhead}>Go Ahead</Button>
    </>
  );
};

export default ImageCropper;
