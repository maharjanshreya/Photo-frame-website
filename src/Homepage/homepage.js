import {React} from 'react';
import Navbar from '../Navbar/navbar';
import SideImage from '../Images/Group 9.png';
function Homepage(){
    return (
        <div>
            <Navbar />
            <div className='d-flex'>
                <div  class="flex-shrink-0">
                <h1>Shabby Chic Frames.</h1>
                <p>Choose from wide range of well-crafted premium quality wooden frames online. Explore our curated collection of exquisite photo frames designed to elevate your most precious moments. 
                <br/>Whether you're seeking the timeless charm of classic frames, the sleek lines of modern designs, or the warmth of vintage-inspired styles, our diverse range caters to every taste and decor</p>
                
                </div>
                <div className='flex-grow-1 ms-3'>
                <img src={SideImage} />
                </div>
                
            </div>
            
        </div>
        

    );
}

export default Homepage;