import React, { useEffect, useState, useCallback } from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Cookies from 'js-cookie';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute'; // Ensure correct import path

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
import Search from './Homepage/searchPage';
import Upload from './Homepage/upload';
import Footer from './Homepage/footer';
import AdminLogin from './Admin/adminLogin';
import ProductView from './ProductView/product';
import Checkout from './ProductView/checkout';
import AdminDashboard from './Admin/adminDashboard';
import AdminOrder from './Admin/adminOrder';
import AdminReview from './Admin/adminReview';
import AdminAnalysis from './Admin/adminAnalysis';
import AdminContact from './Admin/adminContact';
import AdminNotifyUpdates from './Admin/addNotification';
import Cart from './ProductView/cart';
import Notification from './ProductView/notification';
import { useAuth } from './context/token';
import Success from './ProductView/success';
import Reset from './LoginRegister/Reset';
// Import Homepage
import Homepage from './Homepage/homepage';

function App() {
  const [hasToken, setHasToken]= useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem('tokens');
    if (token) {
      const parsedData = JSON.parse(token);
      const userRole = parsedData.userData.role;
      if (userRole === 'admin') {
        setHasToken(true);
      }
    }
    setLoading(false);
  }, []);
  if (loading) {
    // Render loading indicator or skeleton component
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />}/>
        <Route path="/navbar" element={<Navbar />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/products" element={<Products />} />
        <Route path="/account" element={<Account />} />
        <Route path="/reset" element={<Reset />} />
        <Route path="/search" element={<Search />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/adminLogin" element={<AdminLogin />} />
        <Route
          path="/adminDashboard"
          element={
            hasToken ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/productView/:productId" element={<ProductView />} />
        <Route path="/adminOrder" element={<AdminOrder />} />
        <Route path="/notify" element={<AdminNotifyUpdates />} />
        <Route path="/adminReview" element={<AdminReview />} />
        <Route path="/adminAnalysis" element={<AdminAnalysis />} />
        <Route path="/adminContact" element={<AdminContact />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/footer" element={<Footer />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/report" element={<Report />} />
        <Route path="/notification" element={<Notification />} />
        <Route path="/imagepage" element={<ImagePage />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </Router>
  );
}

export default App;
