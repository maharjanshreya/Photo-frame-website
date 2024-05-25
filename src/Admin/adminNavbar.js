import { React, useState } from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink,Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import Logo from '../Images/Rectangle 1.png';
import './admin.css';   
function AdminNavbar() {

    return (
        <>
            {/* <div className='navbar-wrapper'>
            <Nav className='d-flex justify-content-between' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                <div className='side-navbar'>
                    <Link to='/adminDashboard' className='icon'>

                    </Link>
                    <Nav.Link as={Link} to='/' className='' style={{ marginBottom: '20px' }}>
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


            
           
            </div> */}
            <nav id="sidebarMenu" className="collapse d-lg-block sidebar bg-white">
                <div className="position-sticky">
                    <center><Nav.Link as={Link} to='/adminAnalysis' className='navbar-nav ms-auto' >
                        <img src={Logo} alt="Saman Photo Frame" className="my-specific-image" style={{ padding: '0px 30px', color: '#426751', display: 'inline-block' }} />
                    </Nav.Link>
                    </center>
                    <div className="list-group list-group-flush mx-3 mt-4" id="navLink-color">
                    <NavLink
                            to="/adminDashboard"
                            activeClassName="active"
                            className="list-group-item list-group-item-action py-2 ripple"
                        >
                            <i class="fas fa-tachometer-alt fa-fw me-3"></i><span>Admin Panel</span>
                        </NavLink>
                        <NavLink
                            to="/adminOrder"
                            activeClassName="active"
                            className="list-group-item list-group-item-action py-2 ripple"
                        >
                            <i className="fas fa-tachometer-alt fa-fw me-3"></i><span>Orders</span>
                        </NavLink>


                        <NavLink
                            to="/adminAnalysis"
                            activeClassName="active"
                            className="list-group-item list-group-item-action py-2 ripple"
                        >
                            <i className="fas fa-tachometer-alt fa-fw me-3"></i><span>Analytics</span>
                        </NavLink>

                        
                        <NavLink
                            to="/adminReview"
                            activeClassName="active"
                            className="list-group-item list-group-item-action py-2 ripple"
                        >
                            <i className="fas fa-tachometer-alt fa-fw me-3"></i><span>Reviews</span>
                        </NavLink>

                        

                        <NavLink
                            to="/adminContact"
                            activeClassName="active"
                            className="list-group-item list-group-item-action py-2 ripple"
                        >
                            <i class="fas fa-tachometer-alt fa-fw me-3"></i><span>Reports</span>
                        </NavLink>

                        <NavLink
                            to="/adminAccount"
                            activeClassName="active"
                            className="list-group-item list-group-item-action py-2 ripple" 
                        >
                            <i class="fas fa-tachometer-alt fa-fw me-3"></i><span>My Account</span>
                        </NavLink>
                       

                       
                    </div>
                </div>
            </nav>
        </>

    );
}
export default AdminNavbar;