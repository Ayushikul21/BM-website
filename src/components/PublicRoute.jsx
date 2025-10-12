// PublicRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const userEmail = localStorage.getItem('userEmail');

  // If user is already logged in, redirect to dashboard
  if (userEmail) {
    return <Navigate to="/dashboard" replace />;
  }

  // Otherwise, show the public route (login/register)
  return children;
};

export default PublicRoute;
