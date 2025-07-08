import React, { useState, useEffect } from 'react';
import HtmlRenderer from './HtmlRender';
import axios from 'axios';

// const LoginForm = ({ onLogin }) => {
//   const [identifier, setIdentifier] = useState(''); // email or emp ID
//   const [password, setPassword] = useState('');

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onLogin(identifier.trim().toLowerCase());
//   };

//   const loginform=()=>{
//     const codedata= axios.post('http://localhost:4000/api/v1/auth/login', {
//       email:identifier,
//       password:password})
//     .then(response => console.log(response.data))
//     .catch(error => console.error(error));
//     console.log("response data",codedata)
//   }

//   return (
//     <div className="h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-200 to-blue-100">
//       <form onSubmit={handleSubmit} className="bg-white p-10 rounded-2xl shadow-lg space-y-6 w-96">
//         <h2 className="text-2xl font-bold text-center">Login</h2>
//         <input
//           type="text"
//           placeholder="Enter Email or Employee ID"
//           value={identifier}
//           onChange={(e) => setIdentifier(e.target.value)}
//           className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none font-[Inter]"
//           required
//         />
//         <input
//           type="text"
//           placeholder="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none font-[Inter]"
//           required
//         />
//         <button onClick={loginform}
//           type="submit"
//           className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
//         >
//           Login
//         </button>
//       </form>
//     </div>
//   );
// };

// const LoginForm = () =>{
//   return <HtmlRenderer filePath={'/salary website/salary_portal_login.html'}/>
// };


const LoginForm = ({onLogin}) => {

  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

  const handleForgotPassword = (e) => {
    e.preventDefault();
    const empId = employeeId.trim().toUpperCase();

    if (!empId) {
      showError('Please enter your Employee ID first');
      document.getElementById('employeeId').focus();
      return;
    }

    // Replace with your actual forgot password logic
    showSuccess(`Password reset link sent to email associated with ${empId}`);
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
      return !validateEmployeeId(employeeId) && errorMessage ? 'error' : '';
    }
    if (field === 'password') {
      return !validatePassword(password) && errorMessage ? 'error' : '';
    }
    return '';
  };

  if (isLoggedIn) {
    return (
      <div style={{ display: 'none' }}>
        {/* Login container hidden - dashboard will be handled by external app.js */}
      </div>
    );
  }

  return (
    <div>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .login-container {
          width: 100%;
          max-width: 400px;
        }

        .login-box {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 40px 30px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .logo {
          text-align: center;
          margin-bottom: 30px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .logo img {
          width: 80px;
          height: 80px;
          object-fit: contain;
          margin-bottom: 15px;
          border-radius: 50%;
          border: 2px solid #667eea;
          background-color: white;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          display: block;
        }

        .logo h1 {
          font-size: 1.8rem;
          background: linear-gradient(45deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 5px;
          animation: logoGlow 2s ease-in-out infinite alternate;
          text-align: center;
          line-height: 1.2;
          font-weight: 700;
        }

        @keyframes logoGlow {
          from {
            filter: drop-shadow(0 0 5px rgba(102, 126, 234, 0.3));
          }
          to {
            filter: drop-shadow(0 0 15px rgba(118, 75, 162, 0.5));
          }
        }

        h2 {
          text-align: center;
          color: #333;
          margin-bottom: 30px;
          font-weight: 600;
          font-size: 1.5rem;
        }

        .form-group {
          margin-bottom: 20px;
          position: relative;
        }

        .form-group input {
          width: 100%;
          padding: 15px 20px;
          padding-right: 50px;
          border: 2px solid #e1e5e9;
          border-radius: 12px;
          font-size: 16px;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.9);
        }

        .form-group input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          transform: translateY(-2px);
        }

        .form-group input.error {
          border-color: #e74c3c;
          animation: shake 0.5s ease-in-out;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        .login-btn {
          width: 100%;
          padding: 15px;
          background: linear-gradient(45deg, #667eea, #764ba2);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .login-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }

        .login-btn:active {
          transform: translateY(0);
        }

        .login-btn.loading {
          pointer-events: none;
          opacity: 0.7;
        }

        .login-btn.loading::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 20px;
          height: 20px;
          margin: -10px 0 0 -10px;
          border: 2px solid transparent;
          border-top: 2px solid #fff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-message {
          color: #e74c3c;
          text-align: center;
          margin: 15px 0;
          padding: 10px;
          border-radius: 8px;
          background: rgba(231, 76, 60, 0.1);
          border: 1px solid rgba(231, 76, 60, 0.2);
          display: block;
        }

        .success-message {
          color: #27ae60;
          text-align: center;
          margin: 15px 0;
          padding: 10px;
          border-radius: 8px;
          background: rgba(39, 174, 96, 0.1);
          border: 1px solid rgba(39, 174, 96, 0.2);
          display: block;
        }

        .links {
          text-align: center;
          margin-top: 20px;
        }

        .links a {
          color: #667eea;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .links a:hover {
          color: #764ba2;
          text-decoration: underline;
        }

        .password-toggle {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
          color: #666;
          transition: color 0.3s ease;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .password-toggle:hover {
          color: #333;
        }

        .password-toggle svg {
          width: 20px;
          height: 20px;
        }

        @media (max-width: 480px) {
          .login-box {
            padding: 30px 20px;
            margin: 10px;
          }

          .logo h1 {
            font-size: 1.5rem;
          }
        }
      `}</style>

      <div className="login-container">
        <div className="login-box">
          <div className="logo">
            <img src="/salary website/logob&m.jpg" alt="Bandy & Moot Logo" />
            <h1>Bandy & Moot Pvt. Ltd.</h1>
          </div>
          <h2>Employee Login</h2>

          <div>
            <div className="form-group">
              <input
                type="text"
                id="employeeId"
                name="employeeId"
                placeholder="Employee ID"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className={inputErrorClass('employeeId')}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
              />
            </div>
            <div className="form-group">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputErrorClass('password')}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
              />
              <span className="password-toggle" onClick={togglePasswordVisibility}>
                {showPassword ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                )}
              </span>
            </div>
            <button 
              onClick={handleSubmit}
              className={`login-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? '' : 'Login'}
            </button>
          </div>

          {errorMessage && (
            <div className="error-message">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="success-message">
              {successMessage}
            </div>
          )}

          <div className="links">
            <a onClick={handleForgotPassword}>Forgot Password?</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;


