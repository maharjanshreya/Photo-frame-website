// ProtectedRoute.js
import React from 'react';
import {Outlet, Route,Routes, Navigate } from 'react-router-dom';

const ProtectedRouteUser = ({ element: Component, ...rest }) => {
  const userRole = localStorage.getItem('role'); // Adjust this to your actual implementation
  const isConsumer = userRole === 'consumer';

  return(
    isConsumer? <Outlet/> : <Navigate to="/login"/>
)
};


export default ProtectedRouteUser;