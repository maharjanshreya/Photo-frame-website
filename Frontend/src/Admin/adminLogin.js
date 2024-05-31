import sideImage from '../Images/LoginImage.png';
import Logo from '../Images/Rectangle 1.png';
import  '../CSS/style.css';
import { Link } from 'react-router-dom';
import React from 'react';
import { Navbar } from 'react-bootstrap';
function AdminLogin(){
    return(
        <div className="full-screen-image">
            <div className="left-column">
                <img src={sideImage} alt="logout" className="full-height-image"  />
            </div>
            <div className="right-column">
                <p className='text'>Login and <br/>Design your frames with</p>
                <img src={Logo} alt="logout" className=""  />
                <form method='POST'>
                <input type="text" id="username" name="username" placeholder="Username" /><br/>
                <input type="text" id="password" name="password" placeholder="Password"/><br/>
                <input type="submit" value="Login" />
                </form>
                
                <Link to='/'><button>Cancel</button></Link>
                <Link to='/login'><p>Login as user</p></Link>
            </div>
            
        
        </div>
    );
}
export default AdminLogin;