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
                <Nav.Link as={Link} to='/'  className='' >
                    <img src={Logo} />                
                </Nav.Link>
                <Link to='/adminDashboard' className='icon'>
                <p>Category</p>
                </Link>
                <Link to='/adminOrder' className='icon'>
                <p>Orders</p>
                </Link>
                <Link to='/adminContact' className='icon'>
                <p>User contact</p>
                </Link>
                <Link to='/adminAnalysis' className='icon'>
                <p>Anylatics</p>
                </Link>
                <Link to='/adminReview' className='icon'>
                <p>Reviews and ratings</p>
                </Link>
      </div>

        </Nav>
    </div>
    );
}
export default adminNavbar;