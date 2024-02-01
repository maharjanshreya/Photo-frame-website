import Navbar from '../Navbar/navbar';
import {React, useEffect,useState} from 'react';
import './product.css';

function Cart(id, productName,price){
    let p = productName;
    const [pr, setP] = useState([]);
    const pe = ()=>{
        setP(p);
    }
    // const [imageURL, setImageURL] = useState(null);
    // const imageFunc = async () => {
    
    //     try {
    //       const res = await fetch(`/product-image/${encodeURIComponent(id)}`  ,  {
    //       method: 'GET',
    //       credentials: 'include',
    //     });
    //     if (!res.ok) {
    //       const error = new Error(res.statusText);
    //       throw error;
    //     }
          
    //      // Read the binary data as an ArrayBuffer
    //      const buffer = await res.arrayBuffer();
    
    //      // Convert the ArrayBuffer to a base64 string
    //      const base64Image = btoa(new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
    
    //      // Set the base64 string as the image source
    //      setImageURL(`data:image/png;base64,${base64Image}`);
        
      
    //     } catch (err) {
    //       console.log('Error in fetching image data', err);
    //     }
    // }; 
    
    // useEffect(()=>{
    //     imageFunc();
    // }, []);
    console.log(`Added to cart: ID ${id}, Name ${productName}, Price ${price}`);
    return(
    <>
        <Navbar />
        <div>
            My Cart
            {/* {imageURL && <img src={imageURL} alt="Product Image" style={{ width: '400px', height: '450px' }}/>} */}
            {pr}
        </div>

    </>);
}
export default Cart;