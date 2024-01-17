import React, { useState,useEffect } from 'react';
import Button from 'react-bootstrap/Button';
const ViewDetails = ({ productId }) => {
    console.log("Product: ", productId);
    const [productData, setProductData] = useState([]);
    const productFunc = async () => {
    try {
      const res = await fetch(`/products/${encodeURIComponent(productId)}`  ,  {
      method: 'GET',
      credentials: 'include',
    });
    if (!res.ok) {
      const error = new Error(res.statusText);
      throw error;
    }
      
    const datas = await res.json();
    console.log('API Response in products:', datas); 
    setProductData(datas.product);
    console.log("Datas.data",datas.product);
  
    } catch (err) {
      console.log('Error in fetching data', err);
    }
    }; 
    useEffect(()=>{
        
        productFunc();
  
      }, [productId]);
    return (
        <>
        <div className='formedit'>
        
        {productData ? (
                    <>
                        <p>Product Name: {productData.productName}</p>
                        <p>Description: {productData.description}</p>
                        <p>Category: {productData.category}</p>
                        <p>Price: {productData.price}</p>
                        <p>Size: {productData.size}</p>
                        <p>Dimension: {productData.dimension}</p>
                        {/* Add more fields as needed */}
                    </>
                ) : (
                    <p>Loading product data...</p>
                )}
        </div>
        </>
    );
};

export default ViewDetails;
