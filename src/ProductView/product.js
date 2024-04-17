import { React, useState, useEffect ,useContext} from 'react';
import './product.css';

import Navbar from '../Navbar/navbar';
import { useParams, useLocation } from 'react-router-dom';
import { CiStar } from "react-icons/ci";
import './product.css';
import Button from 'react-bootstrap/Button';
import { MdCheck } from "react-icons/md";
import Card from 'react-bootstrap/Card';
import Cart from '../ProductView/cart';
import Badge from 'react-bootstrap/Badge';
import Stack from 'react-bootstrap/Stack';
import { Link } from "react-router-dom";
import axios from 'axios';
import { MdOutlineUpdate } from "react-icons/md";
import { MdOutlinePolicy } from "react-icons/md";
import Image from '../Homepage/image';
import { toast } from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import { upload } from '@testing-library/user-event/dist/upload';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/cart';
import { useWishlist } from '../context/wishlist';
import { CardBody, CardTitle } from 'react-bootstrap';
import ReactStars from "react-rating-stars-component";
import { MdOutlineSupervisorAccount } from "react-icons/md";
import { formatDateString } from './time';
import { LiaShippingFastSolid } from "react-icons/lia";
import ViewPage from '../Homepage/ImageGallery';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { useUpload } from '../context/uploadId';
let product_id = null;

function Product() {
  const location = useLocation();
  const { setUpload } = useUpload();

  const uploadId = location?.state?.image;
  setUpload(uploadId);
  const crumbs = location?.state?.additionalInfo || null;
 // console.log("Received crumbs in Product:", crumbs);
  //console.log("Received imageData in Product:", imageData);
  const { cart, setCart } = useCart();
  const navigate = useNavigate();
  const userIdLS = localStorage.getItem('userId');
  const { productId } = useParams();
  const [productData, setProductData] = useState([]);
  const [reviewData, setReviewData] = useState([]);
  const [imageURL, setImageURL] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');

  const ratingChanged = (newRating) => {
    setRating(newRating);
    console.log(newRating);
  };

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
      //setQuantity(datas.product.quantity); // Reset quantity
      //console.log("Datas.data",datas.product);

    } catch (err) {
      console.log('Error in fetching data', err);
    }
  };

  const handleCart = () => {
    //setProduct_Id(p_id);
    if (product_id) {
      setQuantity(prevQuantity => prevQuantity + 1);
      addToCart(quantity + 1);
    }
  }

  const handleUpload = (imageURL) => {
    //console.log(imageURL);
    //setProduct_Id(p_id);
    if (product_id) {
      navigate('/imagepage', { state: { imageURL,productId } });
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

  
  const [w, setW] = useState('');
  const [h, setH] = useState('');
  
  const handleWChange = (event) => {
    setW(String(event.target.value));

  };
  const handleHChange = (event) => {
    setH(String(event.target.value));

  };

  const addToCart = async (quantityToAdd) => {
    const dimensionsString = w && h ? `${w} X ${h}` : null;
    const data = {
      userId: userIdLS,
      items: [
        {
          productId: product_id,
          quantity: quantityToAdd,
          size: dimensionsString || productData.size,
          uploadId: uploadId,
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

      console.log("response: ", response);
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

  const totalCount = reviewData.filter(review => review.review && review.review.length > 0).length;     // to count the number of reviews
  let overallRatingSum = 0;

  useEffect(() => {
    productFunc();
    imageFunc();
    getReviewFunc();
    const calculateOverallRatingSum = (reviewData) => {
      let sum = 0;
      for (let i = 0; i < reviewData.length; i++) {
        sum += reviewData[i].rating;
      }
      const averageRating = sum / reviewData.length;
      return averageRating;
    };

    const maxStarCount = 5;
    overallRatingSum = parseInt(calculateOverallRatingSum(reviewData).toFixed(1)) || 0;
    console.log(overallRatingSum);

  }, [product_id]);

  const starStyle = { color: '#B8930F', size: 30, fill: '#B8930F' };
  const [showAllReviews, setShowAllReviews] = useState(false);

  const toggleShowAllReviews = () => {
    setShowAllReviews(!showAllReviews);
  };

  const handleScrollToView = () => {
    const viewElement = document.getElementById('view');
    if (viewElement) {
      viewElement.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
 // console.log("Product Image data",imageData);
  return (<>
    <Navbar />

    <div className='product-single'>

      <div className='d-flex flex-row align-items-start'>
        <div className='image-product'>
          <div className='image-overlay'>
            {imageURL && <img src={imageURL} alt="Product Image" style={{ width: '400px', height: '450px' }} />}
          </div>
          
        </div>
        <div style={{marginRight:'20px'}}>
          <Breadcrumb style={{ color: 'red' }}>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item >
              <Link to="/" onClick={handleScrollToView}>{crumbs}</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item active> {productData && productData.productName}</Breadcrumb.Item>
          </Breadcrumb>

          {productData && (
            <div>

              <h3 className='product-names'>{productData.productName}</h3><hr />
              <div className="d-flex flex-row align-items-center">
                <div className="mr-2" style={{ padding: '10px 25px 10px 0px' }}><span className='price-single-product' >Rs. {productData.price}</span></div>
                <div className="p-2 mr-2"><ReactStars size={26} value={overallRatingSum} edit={false} className='mr-5 mb-0' style={{ marginRight: '10px' }} /></div>
                <div className="p-2 mr-2"><span>{totalCount > 0 ? <span>{totalCount}</span> : <span>0</span>} review</span></div>
              </div>
              <div className="d-flex flex-row align-items-center">
              <div className="mr-2" style={{color:'#aeaeae', padding: '10px 25px 10px 0px' }}><span className='' >Personalize frame size</span></div>

              </div>           
                <div className="w-h">
                  <input type="number" value={w} onChange={handleWChange} placeholder='W' />
                  <input type="number" value={h} onChange={handleHChange} placeholder='H'/> 
              </div>
              <div className=""><Button variant="outline-dark" className='add-to-cart' onClick={(e) => { e.preventDefault(); handleCart(); }}>ADD TO CART</Button></div>

              {/* <input type="text" value={width} onChange={handleWidthChange} /> */}
               
              <p style={{ textAlign: 'justify',fontFamily:'',marginTop:'20px',marginBottom:'38px'}}>{productData.description}</p>
              <span className="sub-product-heading">Category </span>
              {productData.category && (
                
                <p style={{}}>{productData.category.name}</p>
              )}
              <span className="sub-product-heading">Size </span>
             <p>{productData.size}</p>
              <span className="sub-product-heading">Dimension </span>
              <p>{productData.dimension}</p>
              <p style={{ fontWeight: '600' }}>
                {productData.quantity > 0 ? `Available(${productData.quantity})` : <span style={{ color: 'red', fontWeight: '800' }}>Out of Stock</span>}
              </p>
             

              <button className='add-to-cart' onClick={(e) => { e.preventDefault(); handleUpload(imageURL); }}>Upload</button>

            </div>
          )}<Toaster position="top-center" reverseOrder={true} />
        </div></div><br />
        <div className='d-flex justify-content-center ' style={{ textAlign: 'center', margin: "30px" }}>
          <div className="row p-5 ">
            <div className="col-auto">
              <MdOutlineUpdate />
            </div>
            <div className="col mb-0">
              <p >Delivery Time</p>
              <p>{productData.minDelivery}-{productData.maxDelivery} days</p>
            </div>
          </div>

          <div className="row p-5">
            <div className="col-auto">
              <LiaShippingFastSolid />
            </div>
            <div className="col mb-0" style={{ textAlign: 'left' }}>
              <p>Shipping Cost</p>
              <p className='text-center'> Rs. {productData.shipping} </p>
            </div>
          </div>

          <div className="row p-5">
            <div className="col-auto">
              <MdOutlinePolicy />
            </div>
            <div className="col mb-0" style={{ textAlign: 'left' }}>
              <p>Return Policy</p>
              <p className='text-center'>Nonreturnable</p>
            </div>
          </div>

        </div>

        <hr />
        <div><h4 className='m-1'>Overall Rating</h4>
          <h1 style={{ fontFamily: 'Gelasio' }}>{overallRatingSum}</h1>
         
          <ReactStars
            size={30}
            value={overallRatingSum} edit={false} />
          <div className='d-flex'>


            <h3 className='m-1'>Reviews</h3> <Stack direction="horizontal" gap={2} className='m-1'><Badge bg='warning'>{totalCount > 0 && <span>{totalCount}</span>}</Badge> </Stack></div>
          <>
            <p>Leave a review:</p>

            <div>
              <label>Rating</label>
              <ReactStars
                count={5}
                onChange={ratingChanged}
                size={24}
                activeColor="#ffd700"
                value={5}
              />

              <textarea value={review} onChange={(e) => setReview(e.target.value)} placeholder='Write review on this product' rows="4" cols="80" style={{ borderRadius: '6px', padding: '5px 5px' }}></textarea><br />
              <Button variant="warning" style={{ color: 'white' }} onClick={(e) => { e.preventDefault(); postReviewFunc(); }}>Submit Review</Button>
            </div><br /><hr />
            <h4>View Comments</h4>
            {reviewData.slice(0, showAllReviews ? reviewData.length : 3).map(review => (
              review.review && (
                <div key={review._id} className="review">
                  <Card style={{ backgroundColor: '#fafafa', margin: '15px 0px' }}>
                    <CardBody style={{ paddingBottom: "0px" }}>
                      <div className="row">
                        <div className="col-auto">
                          <MdOutlineSupervisorAccount />
                        </div>
                        <div className="col">
                          <p>{review.user.email}</p>
                          <ReactStars size={24} edit={false} value={review.rating} />
                          <p> {review.review}</p>
                          <p style={{ color: "#808080", fontSize: '17px' }}>{formatDateString(review.createdAt)}</p>
                        </div>
                      </div>


                    </CardBody>
                  </Card>
                </div>
              )))}


            {reviewData.length > 3 && (
              <p onClick={toggleShowAllReviews}>
                {showAllReviews ? "Show Less" : "Show More"}
              </p>
            )}

          </>
        </div>
        <ViewPage /> 
    </div>
  </>);
}
export default Product;