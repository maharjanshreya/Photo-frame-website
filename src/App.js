import './App.css';
import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './Homepage/homepage';
import Login from './LoginRegister/Login';
import Register from './LoginRegister/Register';
import Navbar from './Navbar/navbar';
import Account from './Profile/account';
import AboutUs from './Homepage/aboutus';
import ContactUs from './Homepage/ContactUs';
function App() {
 

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/navbar" element={<Navbar />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/account" element={<Account />} />
        <Route path="/contact" element={<ContactUs />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
