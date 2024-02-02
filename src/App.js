//import './App.css';
import React, { useEffect, useState }from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Cookies from 'js-cookie';
import { BrowserRouter, Route, Routes, Navigate  } from 'react-router-dom';
import HomePage from './Homepage/homepage';
import Login from './LoginRegister/Login';
import Register from './LoginRegister/Register';
import Navbar from './Navbar/navbar';
import Account from './Profile/account';
import AboutUs from './Homepage/aboutus';
import Products from './Homepage/products';
import ContactUs from './Homepage/ContactUs';

import Search from './Homepage/searchPage';
import AdminLogin from './Admin/adminLogin';
import ProductView from './ProductView/product';
import AdminDashboard from './Admin/adminDashboard';
import Cart from './ProductView/cart';


import { useNavigate } from 'react-router-dom';
import Homepage from './Homepage/homepage';

function App() {
  const [hasToken, setHasToken] = useState(false);
  const checkUserRole = () => {
    // Check for the presence of a valid token
    const token = localStorage.getItem('tokens'); // Replace with your actual token cookie name
    if (token) {
      // Parse the JSON data
      const parsedData = JSON.parse(token);

      // Access the role property
      const userRole = parsedData.userData.role;

      // Now, userRole contains the role value
      console.log("User Role:", userRole);

      // Check if the role is admin
      const hasJWToken = userRole === "admin";

      console.log("Admin: ", hasJWToken);
      setHasToken(hasJWToken);
    }
  };
  useEffect(() => {
   // Check the user role when the component mounts
   checkUserRole();
     
  }, []);
  useEffect(() => {
    // Check the user role whenever the token changes
    checkUserRole();
  }, [localStorage.getItem('tokens')]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register/>} />
        <Route path="/" element={<HomePage />} />
        {/* <Route
          path="/login"
          element={hasToken?<Navigate to="/" /> :<Login />}
        /> */}
        <Route path="/login" element={<Login />}/>
        <Route path="/navbar" element={<Navbar />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/products" element={<Products />} />
        <Route path="/account" element={<Account />}/>
        <Route path="/search" element={<Search />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/adminLogin" element={<AdminLogin />} />
        {hasToken ? (
        <Route path="/adminDashboard" element={<AdminDashboard />} />
          ) : ( 
            <Route path="/login" element={<Login />}/>
          )}
        <Route path="/productView/:productId" element={<ProductView />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
