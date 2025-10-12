import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import LoginForm from './components/LoginForm';
import MainEmployeeDashboard from './components/MainEmployeeDashboard';
import MainAdminDashboard from './components/MainAdminDashboard';
import AdminWorkplan from './components/AdminWorkplan';
import RegistrationForm from './components/RegistrationForm';
import ForgotPassword from './components/ForgotPassword';
import ProtectedRouteAdmin from './components/ProtectedRouteAdmin';
import ProtectedRouteEmployee from './components/ProtectedRouteEmployee'; 
import PublicRoute from './components/PublicRoute';

function AppWrapper() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // ✅ Allowed routes without authentication
    const publicPaths = ["/", "/register", "/forgotPassword"];

    // ✅ Redirect if user is not logged in and tries to access a protected route
    if (!token && !publicPaths.includes(location.pathname)) {
      navigate("/", { replace: true });
    }

    // ✅ Prevent cached navigation after logout
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
      window.history.go(1);
    };
  }, [location, navigate]);

  const handleLeaveSubmit = () => {
    navigate('/dashboard');
  };

  return (
    <Routes>
      {/* Public Routes */}
      {/* Public routes */}
      <Route
        path="/"
        element={
          <PublicRoute>
            <LoginForm />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegistrationForm />
          </PublicRoute>
        }
      />
      <Route path="/forgotPassword" element={
        <PublicRoute>
          <ForgotPassword />
        </PublicRoute>
        } />

      {/* Protected Routes */}
      {/* Employee dashboard protected route */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRouteEmployee>
            <MainEmployeeDashboard onSubmit={handleLeaveSubmit} />
          </ProtectedRouteEmployee>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRouteAdmin>
            <MainAdminDashboard />
          </ProtectedRouteAdmin>
        }
      />

      <Route
        path="/admin/workplan"
        element={
          <ProtectedRouteAdmin>
            <AdminWorkplan />
          </ProtectedRouteAdmin>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
