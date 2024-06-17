import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar/navbar';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import Button from 'react-bootstrap/Button';
import { useCart } from '../context/cart';
import { useNavigate } from 'react-router-dom';
function chunkArray(array, size) {
  const chunkedArray = [];
  for (let i = 0; i < array.length; i += size) {
    chunkedArray.push(array.slice(i, i + size));
  }
  return chunkedArray;
}
function Wishlist() {
  const [wishlists, setWishlists] = useState([]);
  const userId = localStorage.getItem('userId');
  const [imageURL, setImageURL] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [productData, setProductData] = useState([]);
  const [loadedImages, setLoadedImages] = useState([]);
  const { cart, setCart } = useCart();
  const navigate = useNavigate();
  const [showAllProducts, setShowAllProducts] = useState(false);

  const handleShowMore = () => {
    console.log('Show more');
    setShowAllProducts(true);
  };
  const handleShowLess = () => {
    setShowAllProducts(false);
  };
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
        if (res.status === 404) {
          // Handle case when wishlist is not found
          setWishlists(0);
          console.log('No wishlist found');
          return;
        }
        const error = new Error(res.statusText);
        throw error;
      }

      const data = await res.json();
      setProductData(data);
      setWishlists(data.wishlist.products.length);
      console.log("length", wishlists);
      const productIds = data.wishlist.products.map((product) => product._id);
   
      const imageURLs = await Promise.all(productIds.map((productId, index) => imageFunc(productId, index)));

      setImageURL(imageURLs);

      console.log(data);

    } catch (err) {
      navigate('/login', { replace: true });
      console.log('Error in fetching data', err);
    }
  };

  useEffect(() => {
    categoryFunc();
    imageFunc();
  }, []);

  return (
    <>
      <Navbar />
      <div className='wishlist'>
        <h1 style={{ color: 'rgb(121, 95, 73)' }}>Favorites</h1>

        {wishlists !== 0 ? (
          <p className="mb-0">You have {wishlists} items in your wishlist</p>
        ) : (
          <p className="mb-0">You don't have any items in your wishlist</p>
        )}


        <div className="row" style={{ maxWidth: '643px' }}>
          <div className="image-container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {productData && productData.wishlist && productData.wishlist.products.slice(0, showAllProducts ? wishlists : 3).map((product, index) => (
              <div key={product._id} className="image-item" style={{ flexBasis: 'calc(33.33% - 20px)', marginBottom: '20px' }}>
                {loadedImages.includes(index) && (
                  <>
                    <img
                      src={imageURL[index]}
                      alt={`Product Image ${index + 1}`}
                      style={{ width: '193px', height: '220px', marginBottom: '10px' }}
                    />
                    <h2 style={{ fontFamily: 'Gelasio', fontSize: '18px' }}>{product.productName}</h2>
                    <p style={{ marginBottom: '0px' }}>Size: {product.size}</p>
                    <p>Rs. {product.price}</p>
                    <Button variant="outline-dark" className='add-to-cart' onClick={() => handleCart(product._id)}>Add to cart</Button>
                    <Toaster
                      position="top-center"
                      reverseOrder={true}
                    />
                  </>
                )}


              </div>
            ))}
          </div>
        </div>
      </div>

      {!showAllProducts && productData && productData.wishlist && productData.wishlist.products && productData.wishlist.products.length > 3 && (
        <div className='text-center'>
              <Button variant="outline-success" className='add-to-cart' onClick={handleShowMore} style={{marginTop:'50px'}}>Load More</Button>
        </div>
      )}
      {showAllProducts && (
         <div className='text-center'>
         <Button variant="outline-success" className='add-to-cart' onClick={handleShowLess} style={{marginTop:'50px'}}>Show Less</Button>
          </div>
      )}
    </>
  );
}

export default Wishlist;
