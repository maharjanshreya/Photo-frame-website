import {React,useState} from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Logo from '../Images/Rectangle 1.png';
import './navbar.css';
import { RiMessage2Line } from "react-icons/ri";
import { MdOutlineFavoriteBorder } from "react-icons/md";
import { PiShoppingCart } from "react-icons/pi";
import { VscAccount } from "react-icons/vsc";
function Navbar(){
    const location = useLocation();
    const [activeLink, setActiveLink] = useState(location.pathname);
    return(
        <div className='navbar-wrappers'>
        <Nav className='d-flex justify-content-between' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'  }}>
            <div>
                <Nav.Link as={Link} to='/'className='navbar-nav ms-auto' >
                <img src={Logo} alt="Wave Billing System" className="my-specific-image" style={{ paddingLeft: '40px', color: '#426751', display: 'inline-block' }} />
            </Nav.Link>
            </div>
            
            <div className="d-flex text-center">
                <Nav.Link as={Link} to='/'  className='' >
                    <p style={{ fontFamily: 'Poppins', fontSize: '16px', paddingLeft: '20px', color: '#426751', fontWeight: '700', display: 'inline-block', verticalAlign: 'middle' }} className="text">Home</p>
                </Nav.Link>
        
                <Nav.Link as={Link} to='/aboutus'  className='' >
                    <p style={{ fontFamily: 'Poppins', fontSize: '16px', paddingLeft: '20px', color: '#426751', fontWeight: '700', display: 'inline-block', verticalAlign: 'middle' }} className="text">About Us</p>
                </Nav.Link>
        
                <Nav.Link as={Link} to='/products'  className='' >
                    <p style={{ fontFamily: 'Poppins', fontSize: '16px', paddingLeft: '20px', color: '#426751', fontWeight: '700', display: 'inline-block', verticalAlign: 'middle' }} className="text">Products</p>
                </Nav.Link>
        
                <Nav.Link as={Link} to='/contact' className='' >
                    <p style={{ fontFamily: 'Poppins', fontSize: '16px', paddingLeft: '20px', color: '#426751', fontWeight: '700', display: 'inline-block', verticalAlign: 'middle' }} className="text">Contact Us</p>
                </Nav.Link>
            </div>

            <div className='d-flex text-right'>
                <Nav.Link as={Link} to='/'  className='icon' >
                    <RiMessage2Line size={26}/>
                </Nav.Link>

                <Nav.Link as={Link} to='/'  className='icon' >
                    <PiShoppingCart size={26} />
                </Nav.Link>

                <Nav.Link as={Link} to='/'  className='icon' >
                    <MdOutlineFavoriteBorder size={26} />
                </Nav.Link>

                <Nav.Link as={Link} to='/account'  className='icon' >
                    <VscAccount size={26}  style={{marginRight: '30px'}} />
                </Nav.Link>
            </div>

        </Nav>
    </div>
    


    );
}
export default Navbar;