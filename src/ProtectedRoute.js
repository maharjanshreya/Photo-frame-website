// ProtectedRoute.js
import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, adminOnly, ...rest }) => {
  const token = localStorage.getItem('tokens');
  const parsedData = token ? JSON.parse(token) : null;
  const userRole = parsedData?.userData?.role;

  if (adminOnly && userRole !== 'admin') {
    // Redirect to login if not an admin
    return <Navigate to="/login" />;
  }

  // Render the original element for authorized users
  return <Route {...rest} element={element} />;
};

export default ProtectedRoute;