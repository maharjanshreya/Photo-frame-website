import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import Navbar from '../Navbar/navbar';
import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; 
import Button from 'react-bootstrap/Button';
const aspect_Ratio =1;
const min_dimension = 150;
const min_dimensionH = 150;


function Crop(){
  
    const location = useLocation();
    const navigate = useNavigate();
    const imageURL = location.state?.imageURL || null;
    const productId = location.state?.productId || null;
    const [crop, setCrop] = useState();
    
    const [image, setImage] = useState(null);
    
      const onImageLoaded = (e) => {
        const {width, height} = e.currentTarget;
        console.log(width, height);
        const crop = makeAspectCrop(
          { unit:'px',
            width: 100       
           ,}
           ,
           width,
           height
        );
        const centeredCrop = centerCrop(crop,width, height);
        setCrop(centeredCrop);
      };
    
      const onCropChange = (crop) => {
        setCrop(crop);
      };
    
     
      const handleNavigation = async() => {
        if (!crop || !imageURL) return;

        const croppedCanvas = await getCroppedCanvas(imageURL, crop);
        const dataURL = croppedCanvas.toDataURL(); // Convert to data URL

        // Pass the data URL as state when navigating to another file
        navigate('/roomView', { state: { croppedImage: dataURL ,productId: productId} });
    };
    const getCroppedCanvas = (imageURL, crop) => {
        return new Promise((resolve) => {
            const image = new Image();
            image.crossOrigin = 'anonymous'; // Ensure CORS compatibility
            image.src = imageURL;
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            image.onload = () => {
                
                
    
                const scaleX = image.naturalWidth / image.width;
                const scaleY = image.naturalHeight / image.height;
                const pixelRatio = window.devicePixelRatio;
    
                canvas.width = crop.width * pixelRatio;
                canvas.height = crop.height * pixelRatio;
                console.log(crop.x * scaleX, crop.y * scaleY, crop.width * scaleX, crop.height * scaleY);
                ctx.drawImage(
                    image,
                    crop.x * scaleX,
                    crop.y * scaleY,
                    crop.width * scaleX,
                    crop.height * scaleY,
                    0,
                    0,
                    crop.width * pixelRatio,
                    crop.height * pixelRatio
                );
    
                resolve(canvas);
            };
        });
    };
    
    
      return (
        <div>
            <Navbar />
          <h1>Crop Frame</h1>
          <div className=" " id="bg-image-edit">
          {imageURL && (
            <div >
          <ReactCrop
             // Replace this with the URL or local path to your image
            crop={crop}
            onChange={(pixelCrop, percentCrop)=>setCrop(pixelCrop)}
            keepSelection
            
            style={{marginLeft:'30px'}}
          >
            <img src={imageURL} alt="The cropped image" onLoad={onImageLoaded}/>
          </ReactCrop>
          </div>
          )}</div>
          <Button variant="outline-dark" className='add-to-cart' onClick={handleNavigation}>Navigate to Another File</Button>
        </div>
      );
    }
export default Crop;