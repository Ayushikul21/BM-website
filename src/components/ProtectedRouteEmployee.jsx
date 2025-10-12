// ProtectedRouteEmployee.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const adminempA = "omdubey001@bandymoot.com";
const adminempB = "coe211166.cse.coe@cgc.edu.in";

const ProtectedRouteEmployee = ({ children }) => {
  const userEmail = localStorage.getItem('userEmail');

  console.log("ProtectedRouteEmployee userEmail:", userEmail);

  // If no user email, redirect to login
  if (!userEmail) {
    return <Navigate to="/dashboard" replace />;
  }

  // If userEmail matches admin emails, redirect to admin dashboard or login
  if (userEmail === adminempA || userEmail === adminempB) {
    return <Navigate to="/admin" replace />;
  }

  // Otherwise, render the employee route
  return children;
};

export default ProtectedRouteEmployee;
