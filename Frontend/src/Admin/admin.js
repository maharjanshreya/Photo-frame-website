import React, {useState} from 'react';
import Navbar from './adminNavbar';

const AdminLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };
    return (
        <div style={{ display: 'flex' }}>
            {/* Navbar on the left */}
            <div>
                <Navbar  />
            </div>
            {/* Content on the right */}
            <div style={{ flex: 1, marginLeft: '250px', padding: '20px',marginTop: '40px' }}>
                {children}
            </div>
        </div>
    );
};

export default AdminLayout;
