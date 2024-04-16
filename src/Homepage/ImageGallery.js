import React, { useState, useEffect } from 'react';

function ImageGallery() {
  const userId = localStorage.getItem('userId');
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    const getImageData = async () => {
      try {
        const response = await fetch(`/getImage/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch image data');
        }
        const imageData = await response.json(); // Assuming the response is JSON
        const urls = imageData.imageDataArray.map(imageData => {
          // Convert each buffer to a base64 string
          const base64String = btoa(
            new Uint8Array(imageData.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
          );
          return `data:image/png;base64,${base64String}`;
        });
        setImageUrls(urls);
      } catch (error) {
        console.error('Error retrieving image data:', error);
      }
    };

    getImageData();
  }, [userId]);

  return (
    <div className="image-gallery">
      {imageUrls.map((url, index) => (
        <img key={index} src={url} alt={`Image ${index}`} />
      ))}
    </div>
  );
}

export default ImageGallery;
