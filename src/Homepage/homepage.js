import {React,useState} from 'react';
import Navbar from '../Navbar/navbar';
import SideImage from '../Images/Group 9.png';
import './homepage.css';
import { IoSearchOutline } from "react-icons/io5";
import Button from 'react-bootstrap/Button';

function Homepage(){
    const [backgroundColor, setBackgroundColor] = useState('white');

    const changeBackgroundColor = () => {
        setBackgroundColor((prevColor) => (prevColor === 'white' ? '#FFEDAF' : 'white'));
      };
    return (
        <div style={{ backgroundColor, transition: 'background-color 0.5s' }}>
            <Navbar />
            <div className='container' style={{ backgroundColor, transition: 'background-color 0.5s' }}>
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
            
        </div>
        

    );
}

export default Homepage;