import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react'; // 👈 Professional icons for password toggle

// ✅ Splash Screen
const SplashScreen = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-500 via-purple-600 to-purple-700 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-80 max-w-[90%] text-center">
        <div className="w-24 h-24 mx-auto mb-6">
          <img 
            src="/logob&m.jpg" 
            alt="Bandy & Moot Logo" 
            className="w-full h-full object-contain rounded-full border-4 border-blue-500 shadow-lg"
          />
        </div>
        <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text mb-2 animate-pulse">
          Bandy & Moot
        </h1>
        <p className="text-gray-700 font-medium mb-6">Loading your experience...</p>
        <div className="mt-4 w-32 h-1 bg-gray-200 rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-progress"></div>
        </div>
      </div>
    </div>
  );
};

// ✅ Loading Overlay
const LoadingOverlay = ({ message = "Processing..." }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-40">
      <div className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center min-w-[200px]">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-700 font-medium">{message}</p>
      </div>
    </div>
  );
};

// ✅ Main Login Form
const LoginForm = ({ onLogin }) => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [fieldErrors, setFieldErrors] = useState({ employeeId: '', password: '' });
  const navigate = useNavigate();

  const loginUrl = 'https://bandymoot.com/api/v1/auth/login';

  // Splash screen timer
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Autofocus after splash
  useEffect(() => {
    if (!showSplash) {
      const employeeIdInput = document.getElementById('employeeId');
      if (employeeIdInput) employeeIdInput.focus();
    }
  }, [showSplash]);

  const validateEmployeeId = (id) => {
    const trimmedId = id.trim();
    if (trimmedId.length < 3) return 'Employee ID must be at least 3 characters long';
    if (!trimmedId.includes('@') && !trimmedId.includes('.')) return 'Please enter a valid email address';
    return '';
  };

  const validatePassword = (password) => {
    if (password.length < 6) return 'Password must be at least 6 characters long';
    return '';
  };

  const validateForm = () => {
    const employeeIdError = validateEmployeeId(employeeId);
    const passwordError = validatePassword(password);
    setFieldErrors({ employeeId: employeeIdError, password: passwordError });
    return !employeeIdError && !passwordError;
  };

  const showError = (msg) => {
    setErrorMessage(msg);
    setSuccessMessage('');
  };

  const showSuccess = (msg) => {
    setSuccessMessage(msg);
    setErrorMessage('');
  };

  const hideMessages = () => {
    setErrorMessage('');
    setSuccessMessage('');
    setFieldErrors({ employeeId: '', password: '' });
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleEmployeeIdChange = (e) => {
    setEmployeeId(e.target.value);
    if (fieldErrors.employeeId) setFieldErrors(prev => ({ ...prev, employeeId: '' }));
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: '' }));
  };

  // ✅ Login request
  const handleSubmit = async (e) => {
    e.preventDefault();
    hideMessages();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: employeeId.trim().toLowerCase(),
          password
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login failed. Please check your credentials.');

      showSuccess(`Login successful! Welcome back.`);
      if (onLogin) onLogin(employeeId.trim().toLowerCase());

      setIsLoggedIn(true);
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));
        localStorage.setItem('userEmail', employeeId.trim().toLowerCase());
      }

      setTimeout(() => {
        const empId = employeeId.trim().toLowerCase();
        if (empId === "omdubey001@bandymoot.com" || empId === "coe211166.cse.coe@cgc.edu.in") {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }, 1500);

    } catch (err) {
      showError(err.message || 'An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => !isLoading && navigate('/forgotPassword');
  const handleRegistration = () => !isLoading && navigate('/register');

  // Logout function exposed globally
  const logout = () => {
    setIsLoggedIn(false);
    setEmployeeId('');
    setPassword('');
    setShowPassword(false);
    hideMessages();
    setIsLoading(false);
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('userEmail');
    setTimeout(() => {
      const input = document.getElementById('employeeId');
      if (input) input.focus();
    }, 100);
  };

  useEffect(() => {
    window.logout = logout;
    return () => delete window.logout;
  }, []);

  const getInputClass = (fieldName) => {
    const base = "w-full px-5 py-4 pr-12 border-2 rounded-xl text-base transition-all duration-300 bg-white/90 focus:outline-none focus:shadow-lg focus:-translate-y-0.5 ";
    return fieldErrors[fieldName]
      ? base + "border-red-500 focus:border-red-500 focus:shadow-red-500/10 animate-shake"
      : base + "border-gray-200 focus:border-blue-500 focus:shadow-blue-500/10";
  };

  if (showSplash) return <SplashScreen />;
  if (isLoading) return <LoadingOverlay message="Signing you in..." />;
  if (isLoggedIn) return <div className="hidden" />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-purple-700 flex items-center justify-center p-5">
      <div className="w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20 transform transition-all duration-500 hover:shadow-2xl">
          
          {/* Logo Section */}
          <div className="text-center mb-8 flex flex-col items-center">
            <img 
              src="/logob&m.jpg" 
              alt="Bandy & Moot Logo" 
              className="w-20 h-20 object-contain mb-4 rounded-full border-2 border-blue-500 bg-white shadow-lg transition-transform duration-300 hover:scale-105"
            />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent animate-pulse">
              Bandy & Moot Pvt. Ltd.
            </h1>
            <p className="text-gray-600 mt-2 text-sm">Enter your credentials to continue</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} noValidate>
            {/* Employee ID Field */}
            <div className="mb-5 relative">
              <input
                type="text"
                id="employeeId"
                placeholder="Enter your email or employee ID"
                value={employeeId}
                onChange={handleEmployeeIdChange}
                className={getInputClass('employeeId')}
                disabled={isLoading}
                autoComplete="username"
              />
              {fieldErrors.employeeId && (
                <div className="text-red-500 text-sm mt-2 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8..." clipRule="evenodd" />
                  </svg>
                  {fieldErrors.employeeId}
                </div>
              )}
            </div>

            {/* Password Field */}
            <div className="mb-5 relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={handlePasswordChange}
                className={getInputClass('password')}
                disabled={isLoading}
                autoComplete="current-password"
              />
              <button 
                type="button"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-all duration-300"
                onClick={togglePasswordVisibility}
                disabled={isLoading}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              {fieldErrors.password && (
                <div className="text-red-500 text-sm mt-2 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8..." clipRule="evenodd" />
                  </svg>
                  {fieldErrors.password}
                </div>
              )}
            </div>

            {/* Login Button */}
            <button 
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
              disabled={isLoading}
            >
              Login
            </button>
          </form>

          {/* Error & Success Messages */}
          {errorMessage && (
            <div className="text-red-500 text-center my-4 p-3 rounded-lg bg-red-50 border border-red-200 animate-fade-in">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="text-green-600 text-center my-4 p-3 rounded-lg bg-green-50 border border-green-200 animate-fade-in">
              {successMessage}
            </div>
          )}

          {/* Footer Links */}
          <div className="text-center mt-6 space-y-4">
            <a onClick={handleForgotPassword} className="block text-blue-500 font-medium hover:text-purple-600 hover:underline cursor-pointer">
              Forgot Password?
            </a>
            <div className="pt-4 border-t border-gray-200">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <button onClick={handleRegistration} className="text-indigo-600 font-semibold hover:text-purple-600 hover:underline">
                  Sign up here
                </button>
              </p>
            </div> 
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-progress { animation: progress 2s ease-in-out infinite; }
        .animate-shake { animation: shake 0.5s ease-in-out; }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default LoginForm;
