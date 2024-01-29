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
import AdminLogin from './Admin/adminLogin';
import ProductView from './ProductView/product';
import AdminDashboard from './Admin/adminDashboard';

import { useNavigate } from 'react-router-dom';
import Homepage from './Homepage/homepage';

function App() {
  const [hasToken, setHasToken] = useState(false);
  console.log("componenedy renedered");
  useEffect(() => {
    // const tokenCookieName = 'jwtoken';
    
    const localStatus = localStorage.getItem('status');
    console.log('Local Status:', localStatus);
    setHasToken(localStatus === 'true');
    console.log('Setting hasToken to true',localStatus);
    // if (localStatus === 'true') {
    //   console.log('Setting hasToken to true');
    //   setHasToken(localStatus === 'true');
    // }else{
    //   console.log('Setting hasToken to true');
    //   setHasToken(false);
    // }
   // Check for the presence of a valid token
   const token = Cookies.get('jwtoken'); // Replace with your actual token cookie name
   setHasToken(!!token);
  }, []);

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
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/adminLogin" element={<AdminLogin />} />
        {hasToken && (
          <>
        <Route path="/adminDashboard" element={<AdminDashboard />} />
        </>
        )}
        <Route path="/productView/:productId" element={<ProductView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
