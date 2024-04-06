// ProtectedRoute.js
import React from 'react';
import {Outlet, Route,Routes, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const userRole = localStorage.getItem('role'); // Adjust this to your actual implementation
  const isAdmin = userRole === 'admin';

  return(
    isAdmin? <Outlet/> : <Navigate to="/login"/>
)
};


export default ProtectedRoute;