//import './App.css';
import React, { useEffect, useState ,useCallback}from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Cookies from 'js-cookie';
import { BrowserRouter, Route, Routes, Navigate  } from 'react-router-dom';
import HomePage from './Homepage/homepage';
import Login from './LoginRegister/Login';
import Register from './LoginRegister/Register';
import Navbar from './Navbar/navbar';
import Account from './Profile/account';
import Report from './Homepage/report';
import AboutUs from './Homepage/aboutus';
import Products from './Homepage/products';
import ContactUs from './Homepage/ContactUs';
import Wishlist from './ProductView/wishlist';
import Search from './Homepage/searchPage';
import Footer from './Homepage/footer';
import AdminLogin from './Admin/adminLogin';
import ProductView from './ProductView/product';
import AdminDashboard from './Admin/adminDashboard';
import AdminOrder from './Admin/adminOrder';
import AdminReview from './Admin/adminReview';
import AdminAnalysis from './Admin/adminAnalysis';
import AdminContact from './Admin/adminContact';
import Cart from './ProductView/cart';
import Notification from './ProductView/notification';

import { useNavigate } from 'react-router-dom';
import Homepage from './Homepage/homepage';

function App() {
  const [hasToken, setHasToken] = useState(false);

  const checkUserRole = useCallback(() => {
    const token = localStorage.getItem('tokens');
    if (token) {
      const parsedData = JSON.parse(token);
      const userRole = parsedData.userData.role;
      const hasJWToken = userRole === "admin";
      setHasToken(hasJWToken);
    }
  }, []);

  useEffect(() => {
    checkUserRole();
  }, [checkUserRole]);

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
        <Route path="/adminOrder" element={<AdminOrder />} />
        <Route path="/adminReview" element={<AdminReview/>} />
        <Route path="/adminAnalysis" element={<AdminAnalysis/>} />
        <Route path="/adminContact" element={<AdminContact/>} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/footer" element={<Footer />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/report" element={<Report />} />
        <Route path="/notification" element={<Notification />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
