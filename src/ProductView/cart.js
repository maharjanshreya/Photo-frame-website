import Navbar from '../Navbar/navbar';
import {React, useEffect,useState} from 'react';
import './product.css';
import axios from 'axios';

function Cart(){
    const [userData, setUserData] = useState({userId:""});
    const [cartData, setCartData] = useState({ cart: { items: [] } });

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
        va = datas.cart.items[0].productId._id;
        } catch (err) {
          console.log('Error in fetching data', err);
        }
    };

    useEffect(() => {
        getCart();
        userContact();
        imageFunc();
      }, [userData.userId]); 


     
      
    
    const [imageURL, setImageURL] = useState(null);
    const imageFunc = async () => {
        
        try {
          const res = await fetch(`/product-image/${encodeURIComponent(va)}`  ,  {
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
            {imageURL && <img src={imageURL} alt="Product Image" style={{ width: '400px', height: '450px' }}/>}
            {/* Render items if available */}
            {cartData.cart.items && Array.isArray(cartData.cart.items) && (
        <div>
          <h3>Items:</h3>
          {cartData.cart.items.map((item, index) => (
            <div key={index}>

              <p>Item {index + 1}:</p>
              <ul>
                <li>Product ID: {item._id}</li>
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