import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({onLogin}) => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Focus on employee ID input when component mounts
  useEffect(() => {
    const employeeIdInput = document.getElementById('employeeId');
    if (employeeIdInput) {
      employeeIdInput.focus();
    }
  }, []);

  const validateEmployeeId = (id) => {
    return id.trim().length >= 3;
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const showError = (message) => {
    setErrorMessage(message);
    setSuccessMessage('');
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setErrorMessage('');
  };

  const hideMessages = () => {
    setErrorMessage('');
    setSuccessMessage('');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(employeeId.trim().toLowerCase());

    const empId = employeeId.trim().toUpperCase();
    const pwd = password;

    hideMessages();

    if (!validateEmployeeId(empId)) {
      showError('Employee ID must be at least 3 characters long');
      document.getElementById('employeeId').focus();
      return;
    }

    if (!validatePassword(pwd)) {
      showError('Password must be at least 6 characters long');
      document.getElementById('password').focus();
      return;
    }

    setIsLoading(true);

    // Simulate login process - replace this with your actual login logic
    setTimeout(() => {
      // For demo purposes, any valid input will succeed
      // Replace this with your actual authentication logic
      showSuccess(`Login successful for ${empId}!`);
      setTimeout(() => {
        setIsLoggedIn(true);
        console.log('Login successful for:', { id: empId, name: 'User', role: 'Employee' });
      }, 1000);
    }, 1500);

    // const codedata= axios.post('http://localhost:4000/api/v1/auth/login', {
    //   email:employeeId,
    //   password:password})
    // .then(response => console.log(response.data))
    // .catch(error => console.error(error));
    // console.log("response data",codedata)
  };

  const handleForgotPassword = () => {
    navigate('/forgotPassword');
  };

  const logout = () => {
    setIsLoggedIn(false);
    setEmployeeId('');
    setPassword('');
    setShowPassword(false);
    hideMessages();
    setIsLoading(false);
    
    // Focus on employee ID input after logout
    setTimeout(() => {
      const employeeIdInput = document.getElementById('employeeId');
      if (employeeIdInput) {
        employeeIdInput.focus();
      }
    }, 100);
  };

  // Expose logout function globally for external use
  useEffect(() => {
    window.logout = logout;
  }, []);

  const inputErrorClass = (field) => {
    if (field === 'employeeId') {
      return !validateEmployeeId(employeeId) && errorMessage ? 'border-red-500 animate-pulse' : '';
    }
    if (field === 'password') {
      return !validatePassword(password) && errorMessage ? 'border-red-500 animate-pulse' : '';
    }
    return '';
  };

  if (isLoggedIn) {
    return (
      <div className="hidden">
        {/* Login container hidden - dashboard will be handled by external app.js */}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-purple-700 flex items-center justify-center p-5">
      <div className="w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
          {/* Logo Section */}
          <div className="text-center mb-8 flex flex-col items-center">
            <img 
              src="/salary website/logob&m.jpg" 
              alt="Bandy & Moot Logo" 
              className="w-20 h-20 object-contain mb-4 rounded-full border-2 border-blue-500 bg-white shadow-lg"
            />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent leading-tight animate-pulse">
              Bandy & Moot Pvt. Ltd.
            </h1>
          </div>

          <h2 className="text-center text-gray-800 mb-8 font-semibold text-xl">
            Employee Login
          </h2>

          <div>
            {/* Employee ID Input */}
            <div className="mb-5 relative">
              <input
                type="text"
                id="employeeId"
                name="employeeId"
                placeholder="Employee ID"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className={`w-full px-5 py-4 pr-12 border-2 border-gray-200 rounded-xl text-base transition-all duration-300 bg-white/90 focus:outline-none focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/10 focus:-translate-y-0.5 ${inputErrorClass('employeeId')}`}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
              />
            </div>

            {/* Password Input */}
            <div className="mb-5 relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-5 py-4 pr-12 border-2 border-gray-200 rounded-xl text-base transition-all duration-300 bg-white/90 focus:outline-none focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/10 focus:-translate-y-0.5 ${inputErrorClass('password')}`}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
              />
              <span 
                className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600 hover:text-gray-800 transition-colors duration-300 w-5 h-5 flex items-center justify-center"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                )}
              </span>
            </div>

            {/* Login Button */}
            <button 
              onClick={handleSubmit}
              className={`w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none rounded-xl text-base font-semibold cursor-pointer transition-all duration-300 relative overflow-hidden hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/30 active:translate-y-0 ${isLoading ? 'opacity-70 pointer-events-none' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                </div>
              ) : (
                'Login'
              )}
            </button>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="text-red-500 text-center my-4 p-3 rounded-lg bg-red-50 border border-red-200">
              {errorMessage}
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="text-green-600 text-center my-4 p-3 rounded-lg bg-green-50 border border-green-200">
              {successMessage}
            </div>
          )}

          {/* Forgot Password Link */}
          <div className="text-center mt-5">
            <a 
              onClick={handleForgotPassword}
              className="text-blue-500 no-underline font-medium transition-all duration-300 cursor-pointer hover:text-purple-600 hover:underline"
            >
              Forgot Password?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;