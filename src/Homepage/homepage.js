import {React,useState} from 'react';
import Navbar from '../Navbar/navbar';
import SideImage from '../Images/Group 9.png';
import './homepage.css';
import { IoSearchOutline } from "react-icons/io5";
import Button from 'react-bootstrap/Button';
import Image from '../Images/Group 7.png';
import Image2 from '../Images/Group 14.png';
import Carousel from 'react-bootstrap/Carousel';
import { FaRegHeart } from "react-icons/fa";
import product1 from '../Images/product1.png';
import product2 from '../Images/product2.png';
import product3 from '../Images/product3.png';
import product4 from '../Images/product4.png';
import product5 from '../Images/product5.png';
import product6 from '../Images/product6.png';

function Homepage(){
    const [backgroundColor, setBackgroundColor] = useState('white');

    const changeBackgroundColor = () => {
        setBackgroundColor((prevColor) => (prevColor === 'white' ? '#FFEDAF' : 'white'));
      };
    return (
      <div style={{ backgroundColor, transition: 'background-color 0.5s' }}>
        <Navbar />
          <div className='d-flex container' >
            <div className="left_align">
              <h1 className='hhh'>Shabby Chic Frames.</h1>
              <p className='paragraph'>Choose from wide range of well-crafted premium quality wooden frames online.<br/> Explore our curated collection of exquisite photo frames designed to elevate your most precious moments. 
              <br/><br/>Whether you're seeking the timeless charm of classic frames, the sleek lines of modern designs, or the warmth of vintage-inspired styles, our diverse range caters to every taste and decor</p>
              <div className='d-flex' style={{marginTop:'50px'}}>
                <Button variant='Secondary' className="round-button">Explore</Button>
                <Button variant='Secondary' className="round-button-upload">Upload</Button>
                <Button variant='Secondary' className="btn btn-outline-secondary round-button-search"><IoSearchOutline className='iconweight'/> Search</Button>
              </div>
            </div>
            <div className='right_align' id="container-image">
                <img src={SideImage} onClick={changeBackgroundColor} />
            </div>
                
          </div>
            <div className='contain'>
                <p className='text-center' style={{color:'#287D90',fontFamily:'Poppins',fontWeight:'bolder'}}> Start framing your journey with us today</p>
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

            <div className='d-flex justify-content-between product-homepage'>
                <div>
                    <img src={product1} alt="logout" className="center" height={300} width={200}/>
                    <div className='d-flex product-name'>
                      <div style={{width:'155px',marginRight:'20px'}}>
                        <p className=''>Simple Fiber Frame</p>
                      </div>
                      <div>
                        <FaRegHeart />
                      </div>
                    </div>
                    <p className='price'>Rs. 255</p>

                </div>
                <div>
                    <img src={product2} alt="logout" className="center" height={300}  />
                    <div className='d-flex product-name'>
                      <div style={{width:'155px',marginRight:'20px'}}>
                        <p className=''>Brownish Tarn Frame</p>
                      </div>
                      <div>
                        <FaRegHeart />
                      </div>
                    </div>
                    <p className='price'>Rs. 255</p>

                </div>
                <div>
                    <img src={product3} alt="logout" className="center" height={300}  width={200} />
                    <div className='d-flex product-name'>
                      <div style={{width:'155px',marginRight:'20px'}}>
                        <p className=''>Golden Wooden Frame</p>
                      </div>
                      <div>
                        <FaRegHeart />
                      </div>
                    </div>
                    <p className='price'>Rs. 340</p>

                </div>
                <div>
                    <img src={product3} alt="logout" className="center" height={300}  width={200} />
                    <div className='d-flex product-name'>
                      <div style={{width:'155px',marginRight:'20px'}}>
                        <p className=''>Golden Wooden Frame</p>
                      </div>
                      <div>
                        <FaRegHeart />
                      </div>
                    </div>
                    <p className='price'>Rs. 500</p>

                </div>

            </div>



            <div className='d-flex justify-content-between product-homepage'>
                <div>
                    <img src={product1} alt="logout" className="center" height={300} width={200}/>
                    <div className='d-flex product-name'>
                      <div style={{width:'155px',marginRight:'20px'}}>
                        <p className=''>Simple Fiber Frame</p>
                      </div>
                      <div>
                        <FaRegHeart />
                      </div>
                    </div>
                    <p className='price'>Rs. 255</p>

                </div>
                <div>
                    <img src={product4} alt="logout" className="center" height={300}  />
                    <div className='d-flex product-name'>
                      <div style={{width:'155px',marginRight:'20px'}}>
                        <p className=''>Brownish Tarn Frame</p>
                      </div>
                      <div>
                        <FaRegHeart />
                      </div>
                    </div>
                    <p className='price'>Rs. 550</p>

                </div>
                <div>
                    <img src={product5} alt="logout" className="center" height={300}  width={200} />
                    <div className='d-flex product-name'>
                      <div style={{width:'155px',marginRight:'20px'}}>
                        <p className=''>Golden Wooden Frame</p>
                      </div>
                      <div>
                        <FaRegHeart />
                      </div>
                    </div>
                    <p className='price'>Rs. 340</p>

                </div>
                <div>
                    <img src={product6} alt="logout" className="center" height={300}  width={200} />
                    <div className='d-flex product-name'>
                      <div style={{width:'155px',marginRight:'20px'}}>
                        <p className=''>Golden Wooden Frame</p>
                      </div>
                      <div>
                        <FaRegHeart />
                      </div>
                    </div>
                    <p className='price'>Rs. 750</p>

                </div>

            </div>
        </div>
        

    );
}

export default Homepage;