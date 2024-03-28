import { React, useState, useEffect } from 'react';
import Navbar from '../Navbar/navbar';
import { useParams } from 'react-router-dom';
import { CiStar } from "react-icons/ci";
import './product.css';
import Button from 'react-bootstrap/Button';
import { MdCheck } from "react-icons/md";
import Card from 'react-bootstrap/Card';
import Cart from '../ProductView/cart';
import Badge from 'react-bootstrap/Badge';
import Stack from 'react-bootstrap/Stack';
import axios from 'axios';
import Image from '../Homepage/image';
import { toast } from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import { upload } from '@testing-library/user-event/dist/upload';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/cart';
import { useWishlist } from '../context/wishlist';
import { CardBody, CardTitle } from 'react-bootstrap';
let product_id = null;

function Product() {
  const { cart, setCart } = useCart();
  const { wishlist, setwishlist } = useCart();
  const navigate = useNavigate();
  const userIdLS = localStorage.getItem('userId');
  const { productId } = useParams();
  const [productData, setProductData] = useState([]);
  const [reviewData, setReviewData] = useState([]);
  const [imageURL, setImageURL] = useState(null);
  const [quantity, setQuantity] = useState(productData.quantity);
  const [rating, setRating] = useState(1);
  const [review, setReview] = useState('');
  const productFunc = async () => {
    try {
      const res = await fetch(`/products/${encodeURIComponent(productId)}`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!res.ok) {
        const error = new Error(res.statusText);
        throw error;
      }

      const datas = await res.json();
      //console.log('API Response in products:', datas); 
      setProductData(datas.product);
      product_id = datas.product._id; // Set product_id here
      setQuantity(datas.product.quantity); // Reset quantity
      //console.log("Datas.data",datas.product);

    } catch (err) {
      console.log('Error in fetching data', err);
    }
  };

  const handleCart = () => {
    //setProduct_Id(p_id);
    if (product_id) {
      addToCart();
    }
  }

  const handleUpload = (imageURL) => {
    console.log(imageURL);
    //setProduct_Id(p_id);
    if (product_id) {
      navigate('/imagepage', { state: { imageURL } });
    }
  }

  const imageFunc = async () => {
    try {
      const res = await fetch(`/product-image/${encodeURIComponent(productId)}`, {
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

  const addToCart = async () => {
    const data = {
      userId: userIdLS,
      items: [
        {
          productId: product_id,
          quantity: quantity,
        },
      ],
    };
    try {
      const response = await axios.post('/add-to-cart', data);
      setCart(prevCart => prevCart + 1);
      toast.success('Item added to cart!');
      //  console.log("cart: ",response.data);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const postReviewFunc = async () => {
    const data = {
      user: userIdLS,
      product: productId,
      rating: rating,
      review: review,
      
    };
    try {
      const response = await axios.post('/give-review', data);
     
      console.log("response: ",response);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const getReviewFunc = async () => {
    try {
      const res = await fetch(`/get-review/${encodeURIComponent(productId)}`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!res.ok) {
        const error = new Error(res.statusText);
        throw error;
      }

      const response = await res.json();
      setReviewData(response.reviews);
    } catch (err) {
      console.log('Error in fetching data', err);
    }
  };

  useEffect(() => {
    productFunc();
    imageFunc();
    getReviewFunc();
    

  }, [product_id]);
  const starStyle = { color: '#B8930F', size: 30, fill: '#B8930F' };
  return (<>
    <Navbar />

    <div className='product-single'>

      <div className=''>
        <div className='image-product'>
          <div className='image-overlay'>
            {imageURL && <img src={imageURL} alt="Product Image" style={{ width: '400px', height: '450px' }} />}
          </div>

        </div>
        <div>

          {productData && (
            <div>
              <h3 className='product-names'>{productData.productName}</h3>
              {Array.from({ length: 5 }).map((_, index) => (
                <CiStar key={index} style={starStyle} />
              ))}
              <p className='price-single-product'>Rs. {productData.price}</p>
              <hr style={{ paddingRight: '60px' }} />
              <p style={{ textAlign: 'justify' }}>{productData.description}</p>

              {productData.category && (
                <p> <span style={{ fontWeight: '600' }}>Category: </span>{productData.category.name}</p>
              )}
              <p style={{ fontWeight: '600' }}>Size: {productData.size}</p>

              <p style={{ fontWeight: '600' }}>Dimension: {productData.dimension}</p>
              <p style={{ fontWeight: '600' }}>
                {productData.quantity > 0 ? `Available(${productData.quantity})` : <span style={{ color: 'red', fontWeight: '800' }}>Out of Stock</span>}
              </p>
              <button className='add-to-cart' onClick={(e) => { e.preventDefault(); handleCart(); }}>Add To Cart</button>
              <button className='add-to-cart' onClick={(e) => { e.preventDefault(); handleUpload(imageURL); }}>Upload</button>

            </div>
          )}<Toaster position="top-center" reverseOrder={true}/>
        </div>
        <hr />
        <div>
          <div className='d-flex'>

          <h3 className='m-1'>Reviews</h3> <Stack direction="horizontal" gap={2} className='m-1'><Badge bg="secondary">157</Badge> </Stack></div>
          <>
          
              {reviewData.map(review => (
                    <div key={review._id} className="review">
                        <Card>
                          <CardBody>
                            <CardTitle> Rating</CardTitle>
                                    <p>Rating: {review.rating}</p>
                                    <p> {review.review}</p>
                                    <p>User: {review.user.email}</p>
                                    <p>Created At: {review.createdAt}</p> </CardBody>
                        </Card>
                    </div>
                ))}
            
            
            <p>Show less</p>
            <p>Show More</p>
            <p>Leave a review:</p>
            
                <div>
                  <label>Rating</label>
                  <input type="number" min="1" max="5" value={rating} onChange={(e) => setRating(e.target.value)} /><br/>
                  <textarea value={review} onChange={(e) => setReview(e.target.value)} placeholder='write review on the product' rows="4" cols="60"></textarea><br/>
                  <Button onClick={(e) => { e.preventDefault(); postReviewFunc(); }}>Submit Review</Button>
                </div>
             
          </>
        </div>
      </div>
    </div>
  </>);
}
export default Product;