import Navbar from '../Navbar/navbar';
import { useParams } from 'react-router-dom';
import {React, useEffect,useState} from 'react';
import { useUser } from '../context/user';
function Wishlist(){
    //const { userId } = useParams();
    const { userId } = useUser();
    const [wishlist, setWishlist] = useState({ wishlist: { items: [] } });
    const [imageURL, setImageURL] = useState(null);
    console.log("u",userId);
    const getWishlist= async () => {
        try {
          const res = await fetch(`/add-to-wishlist/${encodeURIComponent(userId)}`,  {
          method: 'GET',
          credentials: 'include',
          });
          if (!res.ok) {
            const error = new Error(res.statusText);
            throw error;
          }
            
          const datas = await res.json();
          setWishlist(datas);
          console.log("cart data",datas);
          
          console.log("wishlist data for image",datas.wishlist.items[0].productId._id);
       
          console.log("Items length in cart: ",datas.cart.items.length);
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
    
          const resolvedImages = await Promise.all(imagePromises);     // Resolve all image promises
          const filteredImages = resolvedImages.filter((image) => image !== null);   // Filter out any null values from failed requests
          setImageURL(filteredImages);
        }
      } catch (err) {
        console.log('Error in fetching data', err);
      }
      };
      useEffect(() => {
        getWishlist();
    }, []); 
    return(
        <>
            <Navbar/>
            <div className='wishlist'>

                <h1>Favoruites</h1>
                <p className="mb-0">You have {wishlist.wishlist.items.length} items in your cart</p>
                
            </div>
        </>
    );
}
export default Wishlist;