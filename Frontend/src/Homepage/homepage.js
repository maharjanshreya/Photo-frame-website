import { React, useState, useEffect, useRef } from 'react';
import Navbar from '../Navbar/navbar';
import './homepage.css';
import { IoSearchOutline } from "react-icons/io5";
import Button from 'react-bootstrap/Button';
import Image from '../Images/Group 7.png';
import Image2 from '../Images/Group 14.png';
import Product8 from '../Images/Product8.jpg';
import { toast } from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import Grid1 from '../Images/grid1.jpg';
import Grid2 from '../Images/grid2.jpg';
import Grid3 from '../Images/grid3.jpg';
import Grid4 from '../Images/grid4.jpg';
import Product11 from '../Images/product11.jpg';
import Frame11 from '../Images/Frame 11.png';
import Product10 from '../Images/product10.jpg';
import MyProdu from '../Images/MyImageProduct.jpg';
import Group35 from '../Images/Group 35.png';
import Footer from './footer';
import Carousel from 'react-bootstrap/Carousel';
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSearch } from '../context/search';
import axios from 'axios';
import TopRated from './topRated';
import { MDBInputGroup, MDBInput, MDBIcon, MDBBtn } from 'mdb-react-ui-kit';
function Homepage() {
  const userId = localStorage.getItem('userId');
  const [productData, setProductData] = useState([]);
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState({});
  useEffect(() => {

    productFunc();
  }, [productData]);

  const [isVisible, setIsVisible] = useState(false);


  const productView = (productId) => {
    navigate(`/productView/${productId}`, { state: { additionalInfo: "New Products" } });
  }

  const productFunc = async () => {
    try {
      const res = await fetch('https://photo-frame-website.onrender.com/products', {
        method: 'GET',
        credentials: 'include',
      });
      if (!res.ok) {
        const error = new Error(res.statusText);
        throw error;
      }

      const datas = await res.json();
      // console.log('API Response in products:', datas);
      setProductData(datas.products);

    } catch (err) {
      console.log('Error in fetching data', err);
    }
  };
  const [backgroundColor, setBackgroundColor] = useState('white');

  const changeBackgroundColor = () => {
    setBackgroundColor((prevColor) => (prevColor === 'white' ? '#FFEDAF' : 'white'));
  };
  const [values, setValues] = useSearch();


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(`https://photo-frame-website.onrender.com/search/${values.keyword}`, {
        credentials: 'include', // Include credentials in the request
      });
      // console.log('API response:', data);
      setValues((prevValues) => ({
        ...prevValues,
        results: data.result,
      }));
      navigate("/search");
      console.log("seach button clicked");


    } catch (err) {
      console.log(err);
    }
  }
  const wishlist = async (productId) => {
    try {

      const res = await fetch('https://photo-frame-website.onrender.com/add-to-wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId, productId

        }),
        credentials: 'include',
      });

      const data = await res.json();
      if (!data) {
        console.log("Message not sent");
        window.alert("Message not sent");
      }
      else if (res.status === 400) {
        console.log("Message not sent");
        toast.success(data.error);
      }
      else {
        setWishlistItems(prevState => ({
          ...prevState,
          [productId]: !prevState[productId]
        }));
        toast.success('Product added to favourites!');

        //setwishlists(prevCart => prevCart + 1);
      }
    } catch (error) {
      console.error("Error sending contact form:", error);
      toast.error("Failed to add to wishlist. Please try again later.");
    }
  };

  const handleAddToWishlist = (productId) => {
    // Get userId from your authentication or context
    if (userId) {
      wishlist(productId);
    }
    else {
      toast.error('Please login to add to wishlist');
    }


  };
  const handleButtonClick = () => {
    // Navigate to the '/upload' route when the button is clicked
    navigate('/upload');
  };

  const sortedProducts = productData.sort((a, b) => new Date(b.date) - new Date(a.date));
  const [isClicked, setIsClicked] = useState(false);
  // Then, select the first four products
  const newestProducts = sortedProducts.slice(0, 6);

  const [showNewFeatured, setShowNewFeatured] = useState(true);
  const [isNewFeaturedActive, setIsNewFeaturedActive] = useState(true);
  const [isTopRatedActive, setIsTopRatedActive] = useState(false);

  const handleShowNewFeatured = () => {
    const crumb = "New Feature";
    setIsNewFeaturedActive(true);
    setIsTopRatedActive(false);
    setShowNewFeatured(true);
  };
  const textWidth = 4;
  const buttonStyle = {
    borderBottom: isClicked ? `${textWidth / 1}px solid black` : 'none',
  };
  const handleShowTopRated = () => {
    setIsNewFeaturedActive(false);
    setIsTopRatedActive(true);
    setShowNewFeatured(false);
  };


  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      // Set visibility based on scroll position (adjust threshold as needed)
      setIsVisible(scrollY > 100);
    };

    
    window.addEventListener('scroll', handleScroll);

    // Cleanup: remove scroll event listener when component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  return (
    <>
      <div style={{ backgroundColor, transition: 'background-color 0.5s' }}>
        <Navbar />


        <div className='container-fluid mt-5' style={{ height: '100vh' }}>
          <div className='row'>
            <div className='col-lg-5' style={{ marginLeft: "55px" }}>
              <div className="ml-3">
                <h1 className='hhh'>Frame Your Story.</h1>
                <p className='paragraph'>Choose from wide range of well-crafted premium quality wooden frames online.<br /> Explore our curated collection of exquisite photo frames designed to elevate your most precious moments.
                  <br /><br />Whether you're seeking the timeless charm of classic frames, the sleek lines of modern designs, or the warmth of vintage-inspired styles, our diverse range caters to every taste and decor</p>
                <div className="d-flex align-items-center mb-4">
                  <Link to="/products">
                    <Button className="button-hover" style={{ border: 'none', marginRight: '10px' }}>Explore</Button>
                  </Link>
                  <form onSubmit={handleSubmit}>
                    <MDBInputGroup className="mr-2">
                      <MDBInput placeholder="Search" style={{ borderRadius: '0.25rem 0 0 0.25rem' }} value={values.keyword} onChange={(e) => setValues({ ...values, keyword: e.target.value })} />
                      <MDBBtn className="rounded-right-0" style={{ backgroundColor: '#795F49', border: 'none' }} type='submit'>
                        <IoSearchOutline className="fas fa-search" aria-hidden="true" type='submit' color='white' />
                      </MDBBtn>
                    </MDBInputGroup>
                  </form>
                </div>
              </div>
            </div>
            <div className='col-lg-6 ms-auto'>
              <div className='d-flex justify-content-center align-items-center h-100'>
                <img src={Group35} onClick={changeBackgroundColor} className='img-fluid' width={500} height={500} />
              </div>
            </div>
          </div>
        </div>


        <div className={`fade-in ${isVisible ? 'visible' : 'hidden'}`} style={{ marginBottom: '100px' }}>
          <div className='container mb-5'>
            <div className='row'>
              <div className='col-md-6 d-flex align-items-center justify-content-center'>
                <div className="text-center minimal">
                  <h1>Minimal and Aesthetic</h1>
                  <p>
                    Considered restwear that feels as good in bed as it looks. Innovative fabrics and functional
                    silhouettes designed to make you rest-ready anytime.
                  </p>
                </div>
              </div>
              <div className='col-md-6'>
                <div className='row'>
                  <div className='col-md-6 custom-col'>
                    <img src={Grid1} alt='image' className='img-fluid mb-2' style={{ width: '300px', height: '320px' }} />
                    <img src={Grid2} alt='image' className='img-fluid mt-0' style={{ width: '300px', height: '320px' }} />
                  </div>
                  <div className='col-md-6'>
                    <img src={Grid3} alt='image' className='img-fluid mb-2 mt-0' style={{ width: '320px', height: '320px' }} />
                    <img src={Grid4} alt='image' className='img-fluid' style={{ width: '320px ', height: '320px' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>



        <div className={`fade-in ${isVisible ? 'visible' : 'hidden'}`} style={{ marginBottom: '100px' }}>
          <div className='container'>
            <center><h2 className="minimal" style={{ marginBottom: "18px" }}>What we believe in </h2></center>
            <center>  <p className='minimal' style={{ marginBottom: "30px" }}>Architecture<span className="mx-3">|</span>Exterior<span className="mx-3">|</span>Interior</p></center>
            <div className="d-flex justify-content-around">
              <div className="container-slide ml-4">
                <div className="image-container ml-4">
                  <img src={Product8} alt="Image" height={400} />
                  <div className="text-container">
                    <p className="title-text">Architecture</p>
                    <p className="description-text">Sets up a container with an image and a text overlay. When you hover over the container, the text will slide upwards with a transition effect.</p>
                  </div>
                </div>
              </div>

              <div className="container-slide ml-4">
                <div className="image-container ml-4">
                  <img src={Product11} alt="Image" height={400} />
                  <div className="text-container">
                    <p className="title-text">Exterior</p>
                    <p className="description-text">Make the most of compact spaces with space saving furniture that are ingenuous and innovative.</p>
                  </div>
                </div>
              </div>

              <div className="container-slide ml-4">
                <div className="image-container ml-4">
                  <img src={Product10} alt="Image" height={400} />
                  <div className="text-container">
                    <p className="title-text">Interior</p>
                    <p className="description-text">Description for the third image.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id='view'>
          <center> <h1 className='' style={{ fontFamily: 'Recoleta,Georgia,serif', fontWeight: '800', fontSize: '30px', color: '#795F49' }}>View Products</h1></center>
        </div>

        <div className={`fade-in ${isVisible ? 'visible' : 'hidden'}`} id='new-products'>
          <div className="container" >
            <div className="d-flex justify-content-center my-3" id='new-products'>
              <p
                className={`m-4 ${isNewFeaturedActive ? 'active-button-t' : ''}`} style={{ cursor: 'pointer' }}
                onClick={handleShowNewFeatured}
              >
                New Products
              </p>
              <p
                className={`m-4 ${isTopRatedActive ? 'active-button-t' : ''}`}
                onClick={handleShowTopRated} style={{ cursor: 'pointer' }}
              >
                Top Rated Products
              </p>
            </div>
          </div>


          {showNewFeatured ? (
            <>

              <div className='container'>
                <div className='row'>
                  <div className='col'>
                    <div className='boxa p-5'>
                      <div className='row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4'>
                        {newestProducts.map((row) => (
                          <div key={row?._id} className="col">
                            <div className="card border-0">
                              <img
                                src={`https://photo-frame-website.onrender.com/product-image/${row._id}`}
                                alt="Product Image"
                                style={{ height: '300px' }}
                                onClick={() => productView(row?._id)}
                              />
                              <div className='card-body'>
                                <h5 className='card-title'>{row?.productName}</h5>
                                <div className='d-flex justify-content-between align-items-center'>
                                  <p className='card-text mb-0'>Rs. {row?.price}</p>
                                  {wishlistItems[row?._id] ? (
                                    <FaHeart onClick={() => handleAddToWishlist(row?._id)} style={{ color: 'red', cursor: 'pointer' }} />
                                  ) : (
                                    <FaRegHeart onClick={() => handleAddToWishlist(row?._id)} style={{ cursor: 'pointer' }} />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </>
          ) : (
            <>

              <TopRated />
            </>
          )}

        </div>


        <div className={`fade-in ${isVisible ? 'visible' : 'hidden'}`} style={{ marginBottom: '100px', marginTop: '100px' }}>
          <div className='container mb-5' >
            <div className='row'>

              <div className='col-md-6'>
                <div className='row'>
                  <div className='col-md-6 custom-col' style={{ width: '500px' }}>
                    <img src={Frame11} alt='image' className='img-fluid mb-2' />

                  </div>

                </div>
              </div>
              <div className='col-md-6 d-flex align-items-center justify-content-center'>

                <p className="text-left minimal" >
                  <p>Expanding Our Product Line</p>
                  <h1>The Craftsmanship <br />Behind Our Frames</h1><br></br>Our frames are a testament to meticulous craftsmanship and attention to detail. Each frame is handcrafted by skilled artisans who blend traditional techniques with modern innovations. We use only the finest materials, ensuring durability and timeless beauty.</p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>

    </>
  );
}

export default Homepage;