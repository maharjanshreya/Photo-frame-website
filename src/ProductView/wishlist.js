import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar/navbar';
import { useUser } from '../context/user';
import axios from 'axios';
import { toast,Toaster } from 'react-hot-toast';
import Button from 'react-bootstrap/Button';
import { useCart } from '../context/cart';
import { useWishlist } from '../context/wishlist';
import { useNavigate } from 'react-router-dom';
function Wishlist() {
  const { wishlists,setWishlists } = useWishlist();
  const userId = localStorage.getItem('userId');
  const [imageURL, setImageURL] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [productData, setProductData] = useState([]);
  const [loadedImages, setLoadedImages] = useState([]);
  const { cart,setCart } = useCart();
  const navigate = useNavigate();
  const handleCart = (p_id) => {
    addToCart(p_id);
  };
  
  const addToCart = async (productId) => {
    const userId = localStorage.getItem('userId');

      if (!userId) {
        console.error('User ID not found');
        navigate('/login', { replace: true });
      }
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
      setCart(prevCart => prevCart + 1);
      toast.success('Item added to cart!');
    } catch (error) {
      navigate('/login', { replace: true });

      console.error('Error adding to cart:', error);
    }
  };

  const imageFunc = async (productId, index) => {
    try {
      const res = await fetch(`/product-image/${encodeURIComponent(productId)}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!res.ok) {
        const error = new Error(res.statusText);
        throw error;
      }

      const buffer = await res.arrayBuffer();
      const base64Image = btoa(new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));

      // Update the state by creating a new array with the current URL and the new one
      setLoadedImages((prevLoadedImages) => [...prevLoadedImages, index]);
      return `data:image/png;base64,${base64Image}`;
    } catch (err) {
      console.log('Error in fetching image data', err);
      return null;
    }
  };

  const categoryFunc = async () => {
    const userId = localStorage.getItem('userId');

      if (!userId) {
        console.error('User ID not found');
        navigate('/login', { replace: true });
      }
    try {
      const res = await fetch(`/add-to-wishlist/${encodeURIComponent(userId)}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!res.ok) {
        const error = new Error(res.statusText);
        throw error;
      }

      const data = await res.json();
      setProductData(data);
      setWishlists(data.wishlist.products.length);
      const productIds = data.wishlist.products.map((product) => product._id);

      // Clear the loadedImages state before fetching images for the new set of products
      setLoadedImages([]);

      // Use Promise.all to wait for all image fetches to complete before proceeding
      const imageURLs = await Promise.all(productIds.map((productId, index) => imageFunc(productId, index)));

      // Set the imageURL state once all images are loaded
      setImageURL(imageURLs);

      console.log(data);

    } catch (err) {
      navigate('/login', { replace: true });
      console.log('Error in fetching data', err);
    }
  };

  useEffect(() => {
    categoryFunc();
  }, []);

  return (
    <>
      <Navbar />
      <div className='wishlist'>
        <h1>Favorites</h1>
        <p className="mb-0">You have {wishlist.products} items in your cart</p>
        <div className="row text-center" style={{ marginTop: '30px' }}>
          <div className="image-container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
            {productData && productData.wishlist && productData.wishlist.products.map((product, index) => (
              <div key={product._id} className="image-item" style={{ flexBasis: 'calc(25% - 20px)', margin: '10px' }}>
                {loadedImages.includes(index) && (
                  <>
                    <img
                      src={imageURL[index]}
                      alt={`Product Image ${index + 1}`}
                      style={{ width: '160px', height: '200px',marginBottom:'10px' }}
                    />
                    <h2 style={{fontFamily:'Gelasio', fontSize:'18px'}}>{product.productName}</h2>
                    <p style={{marginBottom:'0px'}}>Size: {product.size}</p>
                    <p>Rs. {product.price}</p>
                    <Button onClick={() => handleCart(product._id)}>Add to cart</Button>
                    <Toaster
                          position="top-center"
                          reverseOrder={true}
                        />
                    {/* Add more elements as needed */}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Wishlist;
