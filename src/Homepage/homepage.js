import { React, useState, useEffect } from 'react';
import Navbar from '../Navbar/navbar';
import SideImage from '../Images/Group 9.png';
import './homepage.css';
import { IoSearchOutline } from "react-icons/io5";
import Button from 'react-bootstrap/Button';
import Image from '../Images/Group 7.png';
import Image2 from '../Images/Group 14.png';
import Footer from './footer';
import Frame from '../Images/product7.png';
import Carousel from 'react-bootstrap/Carousel';
import { FaRegHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ProductView from '../ProductView/product';
import ImageFrameOverlay from './ImageFrameOverlay';
import { useSearch } from '../context/search';
import axios from 'axios';
function Homepage() {
  const [userPhoto, setUserPhoto] = useState(null);

  const handlePhotoUpload = (event) => {
    const uploadedPhoto = event.target.files[0];
    // Perform any necessary validation or processing
    setUserPhoto(URL.createObjectURL(uploadedPhoto));
  };
  const [productData, setProductData] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {

    productFunc();
  }, [productData]);

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      // Set visibility based on scroll position (adjust threshold as needed)
      setIsVisible(scrollY > 100);
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Cleanup: remove scroll event listener when component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  const productView = (productId) => {

    navigate(`/productView/${productId}`);
  }

  const productFunc = async () => {
    try {
      const res = await fetch('/products', {
        method: 'GET',
        credentials: 'include',
      });
      if (!res.ok) {
        const error = new Error(res.statusText);
        throw error;
      }

      const datas = await res.json();
      console.log('API Response in products:', datas);
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
      const { data } = await axios.get(`/search/${values.keyword}`);
      console.log('API response:', data);
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
  return (
    <div style={{ backgroundColor, transition: 'background-color 0.5s' }}>
      <Navbar />
      <div className='d-flex container' >
        <div className="left_align">
          <h1 className='hhh'>Shabby Chic Frames.</h1>
          <p className='paragraph'>Choose from wide range of well-crafted premium quality wooden frames online.<br /> Explore our curated collection of exquisite photo frames designed to elevate your most precious moments.
            <br /><br />Whether you're seeking the timeless charm of classic frames, the sleek lines of modern designs, or the warmth of vintage-inspired styles, our diverse range caters to every taste and decor</p>
          <div className='d-flex' style={{ marginTop: '50px' }}>
            <Button variant='Secondary' className="round-button">Explore</Button>
            <Button variant='Secondary' className="round-button-upload">Upload</Button>
            {/* <form onSubmit={handleSubmit}>
              <input type="text" value={values.keyword} onChange={(e) => setValues({ ...values, keyword: e.target.value })} className='search-button' />
              <button type='submit'>Search</button>
            </form> */}
            <div>
               <form onSubmit={handleSubmit}>
              <input className="round-button-search" type="text" placeholder="Search" value={values.keyword} onChange={(e) => setValues({ ...values, keyword: e.target.value })}
                aria-label="Search" />
                <IoSearchOutline class="fas fa-search" aria-hidden="true" type='submit'/>
            </form>
            </div>
           
            
          </div>
        </div>
        <div className='right_align' id="container-image">
          <img src={SideImage} onClick={changeBackgroundColor} />
        </div>

      </div>
      <div className='contain'>
        <p className='text-center' style={{ color: '#287D90', fontFamily: 'Poppins', fontWeight: 'bolder' }}> Start framing your journey with us today</p>
        <Carousel>
          <Carousel.Item>
            <img src={Image} />
            <Carousel.Caption>
              <h3>First slide label</h3>
              <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img src={Image2} />
            <Carousel.Caption>
              <h3>Second slide label</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img src={Image} />
            <Carousel.Caption>
              <h3>Third slide label</h3>
              <p>
                Praesent commodo cursus magna, vel scelerisque nisl consectetur.
              </p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </div>
      <div className={`fade-in ${isVisible ? 'visible' : 'hidden'}`}>


        <center><p className='heading-title'>New Featured Products</p></center>

        <div className='d-flex justify-content-between product-homepage'>
          {productData.map((row) => (

            <div key={row?._id}>
              <img
                src={`/product-image//${row._id}`} // Update with your actual backend URL and endpoint
                alt="Product Image"
                className="center"
                height={300}
                width={250} onClick={() => productView(row?._id)}
              />
              <div className='product-name'>
                <div style={{ width: '200px', marginRight: '20px' }}>
                  <p className=''>{row?.productName}</p>
                </div>

              </div>
              <div className='d-flex'>
                <div><p className='price' style={{ marginRight: '155px' }}>Rs. {row?.price}</p>
                </div>
                <div>

                  <FaRegHeart /></div> </div>

            </div>
          ))}

        </div>
      </div>

      <div>
        {/* Other components or routes go here */}
        <input type="file" onChange={handlePhotoUpload} />
        {userPhoto && <ImageFrameOverlay frameSrc={Frame} photoSrc={userPhoto} />}
      </div>
      <Footer />
    </div>


  );
}

export default Homepage;