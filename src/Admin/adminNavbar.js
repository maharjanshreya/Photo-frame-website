import {React,useState} from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Logo from '../Images/Rectangle 1.png';
import './admin.css';
function adminNavbar(){
    
    return(
        <div className='navbar-wrapper'>
        <Nav className='d-flex justify-content-between' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'  }}>
            
                    <div className='side-navbar'>
                    <Link to='/adminDashboard' className='icon'>
                
                </Link>
                <Nav.Link as={Link} to='/'  className='' style={{marginBottom:'20px'}}>
                    <img src={Logo} />                
                </Nav.Link>
                <Link to='/adminDashboard' className='icon name'>
                <p>Category</p>
                </Link>
                <Link to='/adminOrder' className='icon name'>
                <p>Orders</p>
                </Link>
                <Link to='/adminContact' className='icon name'>
                <p>User contact</p>
                </Link>
                <Link to='/adminAnalysis' className='icon name'>
                <p>Anylatics</p>
                </Link>
                <Link to='/adminReview' className='icon name'>
                <p>Reviews</p>
                </Link>
      </div>

        </Nav>
    </div>
    );
}
export default adminNavbar;