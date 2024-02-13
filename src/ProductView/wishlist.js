import Navbar from '../Navbar/navbar';
import { useParams } from 'react-router-dom';
import {React, useEffect,useState} from 'react';
import { useUser } from '../context/user';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
function Wishlist(){
    //const { userId } = useParams();
    const { userId } = useUser();
    const [wishlist, setWishlist] = useState({ wishlist: { items: [] } });
    const [imageURL, setImageURL] = useState(null);
    const [productData, setProductData] = useState([]);
    const [productId, setProductId] = useState([]);
    const handleCart = (p_id)=>{
      setProductId(p_id);
     
      addToCart(p_id);
    
    }
    const addToCart = async (productId) => {
      const data = {
        userId: userId,
        items: [
          {
            productId: productId,
            quantity: 1,
          },
        ],
      };
      try {
          const response = await axios.post('/add-to-cart', data);
          toast.success('Item added to cart!');
        //  console.log("cart: ",response.data);
        } catch (error) {
          console.error('Error adding to cart:', error);
        }
      };
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
          console.log("Wishlist data",datas);
          const productIds = datas.wishlist.items.map(item => item.productId);
          console.log("Productsss ID from the first item in the wishlist", productIds);
         
          if (datas.wishlist.items && datas.wishlist.items.length > 0) {
            
            try {
              const productDataitems =  await Promise.all(datas.wishlist.items.map(async (item) => {
                const res = await fetch(`/products/${encodeURIComponent(item.productId)}`,  {
                  method: 'GET',
                  credentials: 'include',
                });
                if (!res.ok) {
                  const error = new Error(res.statusText);
                  throw error;
                }
              
                const productData = await res.json();
                
                console.log("Product data",productData.product);
                return productData.product;
             })
             );
             setProductData(productDataitems);
               

            console.log("Product IDs from the wishlistssds:", productIds);
            } catch (err) {
              console.log('Error in fetching data', err);
            }
          
          }
          if (datas.wishlist.items && datas.wishlist.items.length > 0) {
            const imagePromises = datas.wishlist.items.map(async (item) => {
            try {
              if (!item.productId) {
                // Handle the case where productId is undefined for the item
                console.error(`ProductId is undefined for item: ${JSON.stringify(item)}`);
                return null;
              }
              const imageRes = await fetch(`/product-image/${encodeURIComponent(item.productId)}`, {
                method: 'GET',
                credentials: 'include',
              });
  
              if (!imageRes.ok) {
                  throw new Error(`Failed to fetch image for product ID ${item.productId}`);
              }
      
              const buffer = await imageRes.arrayBuffer();
              const base64Image = btoa(new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
              return {
                productId: item.productId,
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
          <p className="mb-0" >You have {wishlist.wishlist.items.length} items in your cart</p>
          <div className="row text-center" style={{marginTop:'30px'}}>
            {wishlist.wishlist && Array.isArray(wishlist.wishlist.items) && (
              <>
                {wishlist.wishlist.items.map((item, index) => (
                  <div key={index} className="wishlist-item col-md-3">
                    {imageURL && imageURL.map((image) => (
                      image.productId && image.productId === item.productId && 
                      (
                        <>
                          <img key={image.productId} src={image.url} className="rounded-3" style={{ width: "150px",height:'200px' }} alt="Avatar" />
                          {productData.length > index && (
                              <div key={index} className="wishlist-details">
                                  <div><p style={{fontSize:'17px', fontWeight:'400',marginTop:'10px',marginBottom:'4px'}}>{productData[index].productName}</p> Size: <span style={{fontFamily:'fenix',fontWeight:'600'}}>{productData[index].size}</span><br/>Rs. {productData[index].price}</div>
                                  <button className='add-to-cart' onClick={(e) =>{e.preventDefault();handleCart(productData[index]._id);}}>Add To Cart</button>
                                  {/* Add other product details here */}
                              </div>
                          )}<Toaster position="top-center" reverseOrder={true}/>
                        </>
                      )
                    ))}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </>
    );
}
export default Wishlist;