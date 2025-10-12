// ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const userEmail = localStorage.getItem('userEmail');
  
  console.log("ProtectedRoute userEmail:", userEmail);

  if (!userEmail) {
    // If no userEmail is found, redirect to login or home
    return <Navigate to="/" replace />;
  }

  if(userEmail !== "omdubey001@bandymoot.com" && userEmail !== "coe211166.cse.coe@cgc.edu.in") {
    return <Navigate to="/dashboard" replace />;
  }

  // If userEmail exists, render the children component
  return children;
};

export default ProtectedRoute;
