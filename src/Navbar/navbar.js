import {React,useEffect,useState} from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Logo from '../Images/Rectangle 1.png';
import './navbar.css';
import { MdOutlineFavoriteBorder } from "react-icons/md";
import { PiShoppingCart } from "react-icons/pi";
import { VscAccount } from "react-icons/vsc";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { IoMdNotificationsOutline } from "react-icons/io";
import Dropdown from 'react-bootstrap/Dropdown';
import { useNavigate } from 'react-router-dom';
import Warning from '../Images/warning.png';
function Navbar(){
    const [show, setShow] = useState(false);
    
  const handleClose = () => setShow(false);
    const navigate = useNavigate();
    const location = useLocation();
    const userId = localStorage.getItem('userId');
    const [cartData, setCartData] = useState({ cart: { items: [] } });
    const [activeLink, setActiveLink] = useState(location.pathname);
    const handleLogout = async () => {
        try {
          const response = await fetch('/logout', {
            method: 'GET',
            headers: {
              Accept: "application/json",
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          });
    
          if (response.ok) {
            // Handle successful logout on the client side
            localStorage.removeItem('tokens');
            localStorage.removeItem('userId');
            console.log('Logout successful'); 
            navigate('/login', { replace: true });
          } else {
            // Handle errors or display appropriate messages
            console.error('Logout failed');
          }
        } catch (error) {
          console.error('Error during logout:', error);
        }
      };
    const getCart = async () => {
        try {
          const res = await fetch(`/add-to-cart/${encodeURIComponent(userId)}`,  {
          method: 'GET',
          credentials: 'include',
          });
          if (!res.ok) {
            const error = new Error(res.statusText);
            throw error;
          }
            
          const datas = await res.json();
          setCartData(datas);
         
          console.log("Items length in cartin navbar:  ",datas.cart.items.length);
        } catch (err) {
            console.log('Error in fetching data', err);
        }
    };  
    useEffect(() => {
        getCart();
      }, [userId]);
    return(
        <>
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
                <Nav.Link as={Link} to='/notification'  className='icon' >
                    <IoMdNotificationsOutline size={26} className='iconify'/>
                </Nav.Link>

                <Nav.Link as={Link} to='/cart'  className='icon' >
                    <PiShoppingCart size={26} className='iconify'/>
                </Nav.Link>
                <span className="count">{cartData.cart.items.length}</span>
                <Nav.Link as={Link} to={'/wishlist'}  className='icon' >
                    <MdOutlineFavoriteBorder size={26} className='iconify'/>
                </Nav.Link>
                <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic" style={{ backgroundColor: 'transparent',border:'0px' }}>
                        <VscAccount size={26}  style={{marginRight: '30px'}} className='iconify'/>
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item href="#/action-1"><Nav.Link as={Link} to='/account'  className='icon' >Account</Nav.Link></Dropdown.Item>
                        <Dropdown.Item href="#/action-2" onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setShow(true);
                     
                        }}>Log out</Dropdown.Item>
                    </Dropdown.Menu>
                    </Dropdown>
                
                    
                
            </div>

        </Nav>
    </div>
    <Modal show={show} onHide={handleClose} centered >
        <div className="modal show" style={{ display: 'block', position: 'initial', padding: 0  }} >

          <Modal.Dialog style={{ margin: 0 }} centered>
            <Modal.Header closeButton className="d-flex align-items-center justify-content-center" centered>
              
              
            </Modal.Header>

    <Modal.Body style={{padding: '30px 40px'}}>
        <div className='text-center'>
            <img src={Warning} width={30} height={20}/><br/>
            <b><h3>Log out?</h3></b>
        </div>
        
        <p className='text-center'>Are you sure you want to log out!</p><br/>
        <div style={{ display: 'flex',alignItems:'center' , justifyContent:'center'}}>
            <Button variant="secondary" onClick={handleClose} style={{ backgroundColor: '#6c757d', width: 'auto', borderColor: '#6c757d', marginRight: '8px' }}>Close</Button>
            <Button variant="danger" onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleLogout();
                handleClose();
                }}>Log out
            </Button>
        </div>
    </Modal.Body></Modal.Dialog>
        </div>
        
      </Modal>
</>
    


    );
}
export default Navbar;