import Navbar from '../Navbar/navbar';
import {React, useEffect,useState} from 'react';
import './product.css';
import axios from 'axios';

function Cart(){
    const [userData, setUserData] = useState({userId:""});
    const [cartData, setCartData] = useState({ cart: { items: [] } });
    const [vat, setVa] = useState([]);
     
    const [imageURL, setImageURL] = useState(null);
      const userContact = async () => {
        try {
           const res = await fetch('/getData', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
      
          if (!res.ok) {
            const error = new Error(res.statusText);
            throw error;
          }
      
          const data = await res.json();
          setUserData((prevUserData) => ({ ...prevUserData, userId: data._id }));
          
      
        } catch (err) {
          console.log('Error in fetching data', err);
          
        }
      };
    let va;
    const getCart = async () => {
        try {
          const res = await fetch(`/add-to-cart/${encodeURIComponent(userData.userId)}`,  {
          method: 'GET',
          credentials: 'include',
        });
        if (!res.ok) {
          const error = new Error(res.statusText);
          throw error;
        }
          
        const datas = await res.json();
        setCartData(datas);
        console.log("cart data",datas);
        
        console.log("cart data for image",datas.cart.items[0].productId._id);
        console.log("cardData",cartData);
        if (datas.cart.items && datas.cart.items.length > 0) {
          const imagePromises = datas.cart.items.map(async (item) => {
            try {
              const imageRes = await fetch(`/product-image/${encodeURIComponent(item.productId._id)}`, {
                method: 'GET',
                credentials: 'include',
              });
  
              if (!imageRes.ok) {
                throw new Error(`Failed to fetch image for product ID ${item.productId._id}`);
              }
  
              const buffer = await imageRes.arrayBuffer();
              const base64Image = btoa(new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
              return {
                productId: item.productId._id,
                url: `data:image/png;base64,${base64Image}`,
              };
            } catch (error) {
              console.error(error.message);
              return null;
            }
          });
  
          // Resolve all image promises
          const resolvedImages = await Promise.all(imagePromises);
  
          // Filter out any null values from failed requests
          const filteredImages = resolvedImages.filter((image) => image !== null);
  
          setImageURL(filteredImages);
        }

        
        } catch (err) {
          console.log('Error in fetching data', err);
        }
    };
    useEffect(() => {
        getCart();
        userContact();
        // imageFunc();
      }, [userData.userId]); 


     
      
   
    const imageFunc = async () => {
        
        try {
          const res = await fetch(`/product-image/${encodeURIComponent(vat)}`  ,  {
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
    
    // useEffect(()=>{
    //     imageFunc();
    // }, []);
    return(
    <>
        <Navbar />
        <div>
            My Cart
            
            {/* Render items if available */}
            {cartData.cart.items && Array.isArray(cartData.cart.items) && (
        <div>
          <h3>Items:</h3>
          {cartData.cart.items.map((item, index) => (
            <div key={index}>
              
              <p>Item {index + 1}:</p>
              <ul>
                <li>Product ID: {item.productId._id}</li>
                {imageURL && imageURL.map((image) => (
  // Match product ID to display the correct image
  image.productId === item.productId._id && (
    <img
      key={image.productId}
      src={image.url}
      alt="Product Image"
      style={{ width: '400px', height: '450px' }}
    />
  )
))}
                            <li>Quantity: {item.quantity}</li>
              </ul>
            </div>
          ))} 
        </div>
      )}
            {/* {imageURL && <img src={imageURL} alt="Product Image" style={{ width: '400px', height: '450px' }}/>} */}
            
        </div>

    </>);
}
export default Cart;