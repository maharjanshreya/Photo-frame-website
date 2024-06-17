import React, { useState,useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
const ViewDetails = ({ productId }) => {
    console.log("Product: ", productId);
    const [productData, setProductData] = useState([]);
    const [imageURL, setImageURL] = useState(null);
    const productFunc = async () => {
    try {
      const res = await fetch(`https://photo-frame-website.onrender.com/products/${encodeURIComponent(productId)}`  ,  {
      method: 'GET',
      credentials: 'include',
    });
    if (!res.ok) {
      const error = new Error(res.statusText);
      throw error;
    }
      
    const datas = await res.json();
    console.log('API Response in products single:', datas); 
    setProductData(datas.product);
    console.log("Datas.data single",datas.product);
  
    } catch (err) {
      console.log('Error in fetching data', err);
    }
    }; 
    const imageFunc = async () => {
        try {
          const res = await fetch(`https://photo-frame-website.onrender.com/product-image/${encodeURIComponent(productId)}`  ,  {
          method: 'GET',
          credentials: 'include',
        });
        if (!res.ok) {
          const error = new Error(res.statusText);
          throw error;
        }
          
         // Read the binary data as an ArrayBuffer
         const buffer = await res.arrayBuffer();

         // Convert the ArrayBuffer to a base64 string
         const base64Image = btoa(new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));

         // Set the base64 string as the image source
         setImageURL(`data:image/png;base64,${base64Image}`);
        
      
        } catch (err) {
          console.log('Error in fetching image data', err);
        }
        }; 
    useEffect(()=>{
        
        productFunc();
        imageFunc();
      }, [productId]);
    return (
        <>
        <div className='product-view'>
          <center>

          
          <div className='image'>
                    {imageURL && <img src={imageURL} alt="Product Image" style={{ width: '80%', height: '60%' }}/>}
                </div>
                <div className='details' style={{ maxHeight: '250px', overflowY: 'auto' }}>
                    {productData ? (
                                    <>
                                    
                                    <p style={{marginBottom:'8px'}}><span className='title-name'>Product Name:</span> <span className='product-color-weight'>{productData.productName}</span> </p>
                                    <p style={{marginBottom:'8px'}}><span className='title-name'>Description:</span>  <span className='product-color-weight'>{productData.description}</span> </p>
                                    <p style={{marginBottom:'8px'}}><span className='title-name'>Category: </span>    <span className='product-color-weight'>{productData?.category?.name}</span></p>
                                    <p style={{marginBottom:'8px'}}><span className='title-name'>Price: </span>       <span className='product-color-weight'>{productData.price}</span></p>
                                    <p style={{marginBottom:'8px'}}><span className='title-name'> Size:</span>        <span className='product-color-weight'>{productData.size}</span></p>
                                    <p style={{marginBottom:'8px'}}><span className='title-name'>Border: </span>   <span className='product-color-weight'>{productData.border}</span></p>  

                                    </>
                                ) : (
                                    <p>Loading product data...</p>
                                )}
                </div>

                </center>

        </div>
        </>
    );
};

export default ViewDetails;
