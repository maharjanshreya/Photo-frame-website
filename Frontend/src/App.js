import React, { useEffect, useState, useCallback } from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Cookies from 'js-cookie';
import { Route, Routes, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute'; // Ensure correct import path
import ProtectedRouteUser from './ProtectedRouteUser';
// Import your components
import HomePage from './Homepage/homepage';
import Login from './LoginRegister/Login';
import Register from './LoginRegister/Register';
import Navbar from './Navbar/navbar';
import Account from './Profile/account';
import ImagePage from './Homepage/image';
import Report from './Homepage/report';
import AboutUs from './Homepage/aboutus';
import Products from './Homepage/products';
import ContactUs from './Homepage/ContactUs';
import Wishlist from './ProductView/wishlist';
import CropG from './Homepage/cropG';
import Search from './Homepage/searchPage';
import Upload from './Homepage/upload';
import Footer from './Homepage/footer';
import AdminLogin from './Admin/adminLogin';
import ProductView from './ProductView/product';
import AdminDashboard from './Admin/adminDashboard';
import AdminOrder from './Admin/adminOrder';
import AdminReview from './Admin/adminReview';
import AdminAnalysis from './Admin/adminAnalysis';
import AdminContact from './Admin/adminContact';
import AdminNotifyUpdates from './Admin/addNotification';
import AdminAccount from './Admin/adminMyAccount';
import Cart from './ProductView/cart';
import Notification from './ProductView/notification';
import { useAuth } from './context/token';
import Success from './ProductView/success';
import Cancel from './ProductView/cancel';
import Reset from './LoginRegister/Reset';
import RoomView from './Homepage/roomView';
import { BrowserRouter as Router } from 'react-router-dom';
// Import Homepage
import Homepage from './Homepage/homepage';

function App() {
  const [hasToken, setHasToken] = useState(false);
  const [loading, setLoading] = useState(true);


  const role = localStorage.getItem('role');
  const cuurent_user_type = role;


  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/navbar" element={<Navbar />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/products" element={<Products />} />
        <Route path="/reset" element={<Reset />} />
        <Route path="/search" element={<Search />} />
        <Route path="/productView/:productId" element={<ProductView />} />
        <Route path="/footer" element={<Footer />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AdminDashboard />} path="/adminDashboard" exact />
          <Route element={<AdminOrder />} path="/adminOrder" exact />
          <Route element={<AdminReview />} path="/adminReview" exact />
          <Route element={<AdminAnalysis />} path="/adminAnalysis" exact />
          <Route element={<AdminNotifyUpdates />} path="/notify" exact />
          <Route element={<AdminContact />} path="/adminContact" exact />
          <Route element={<AdminAccount />} path="/adminAccount" exact />
        </Route>   
        
        <Route element={<ProtectedRouteUser />}>
          <Route element={<Cart />} path="/cart" exact />
          <Route element={<ImagePage />} path="/imagepage" exact/>
          <Route element={<RoomView />} path="/roomView"  exact />
          <Route element={<CropG />} path="/cropG"  exact/>
          <Route element={<Upload />} path="/upload" exact />
          <Route element={<Success />} path="/success" exact />
          <Route element={<Cancel />} path="/cancel" exact />
          <Route element={<Wishlist />} path="/wishlist" exact />
          <Route element={<Report />} path="/report" exact />
          <Route element={<Notification />} path="/notification" exact />
          <Route element={<Account />} path="/account" exact />
          <Route element={<ContactUs />} path="/contact" exact />
        </Route>
        
      </Routes>
    </Router>
  );
}

export default App;
