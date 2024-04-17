import React, { useState, useEffect } from 'react';

function ImageGallery() {
  const userId = localStorage.getItem('userId');
  const [imageUrls, setImageUrls] = useState([]);

  // useEffect(() => {
  //   const getImageData = async () => {
  //     try {
  //       const response = await fetch('/getImage-upload/661fc6779722cf43620c448d');
  //       if (!response.ok) {
  //         throw new Error('Failed to fetch image data');
  //       }
  //       const imageData = await response.json(); // Assuming the response is JSON
  //       const urls = imageData.imageDataArray.map(imageData => {
  //         // Convert each buffer to a base64 string
  //         const base64String = btoa(
  //           new Uint8Array(imageData.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
  //         );
  //         return `data:image/png;base64,${base64String}`;
  //       });
  //       setImageUrls(urls);
  //     } catch (error) {
  //       console.error('Error retrieving image data:', error);
  //     }
  //   };

  //   getImageData();
  // }, [userId]);


  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    // Function to fetch image data from the backend
    const fetchImageData = async () => {
      try {
        const response = await fetch('/getImage-upload/66082a63045c214f731eb952');
        if (!response.ok) {
          throw new Error('Failed to fetch image data');
        }
        const imageData = await response.json();
        console.log(imageData);
        // Convert the buffer to a base64 string
        const base64String = btoa(
          new Uint8Array(imageData.imageData.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
        const url = `data:image/png;base64,${base64String}`;
        
        setImageUrl(url);
      } catch (error) {
        console.error('Error retrieving image data:', error);
      }
    };

    fetchImageData(); // Call the fetchImageData function when the component mounts
  }, []); // Empty dependency array ensures useEffect only runs once when component mounts


  return (
    <>
    {/* <div className="image-gallery">
      {imageUrls.map((url, index) => (
        <img key={index} src={url} alt={`Image ${index}`} />
      ))}
    </div> */}

<p>newewwww</p>
<div>
{imageUrl && <img src={imageUrl} alt="Image" />}
</div></>
  );
}

export default ImageGallery;
