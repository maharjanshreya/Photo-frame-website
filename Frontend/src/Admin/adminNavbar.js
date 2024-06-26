import { React, useState } from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink,Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import Logo from '../Images/Rectangle 1.png';
import './admin.css';   
function AdminNavbar() {

    return (
        <>
            
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