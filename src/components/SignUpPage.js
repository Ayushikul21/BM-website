import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Eye, EyeOff, Mail, Lock, User, Check, AlertCircle, Send, CheckCircle } from 'lucide-react';

let globalCode = null;

const SignUpPage = () => {
  const [step, setStep] = useState(1); // 1: Form, 2: Success
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  // Email verification states
  const [emailVerificationCode, setEmailVerificationCode] = useState('');
  const [emailCode, setEmailCode] = useState('');

  const [generatedEmailCode, setGeneratedEmailCode] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [emailCodeSent, setEmailCodeSent] = useState(false);
  const [emailTimer, setEmailTimer] = useState(0);
  const [canResendEmailCode, setCanResendEmailCode] = useState(true);
  

  
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Email verification timer
  useEffect(() => {
    if (emailTimer > 0) {
      const timer = setTimeout(() => setEmailTimer(emailTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (emailTimer === 0 && emailCodeSent) {
      setCanResendEmailCode(true);
    }
  }, [emailTimer, emailCodeSent]);



  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    } else if (!isEmailVerified) {
      newErrors.emailVerified = 'Please verify your email with the verification code';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateCode = () => {
    const codedata= axios.post('https:/bandymoot.com/api/v1/auth/sendotp', {email:formData.email})
    .then(response => console.log(response.data))
    .catch(error => console.error(error));
    return codedata;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Reset email verification if email changes
    if (name === 'email') {
      setIsEmailVerified(false);
      setEmailVerificationCode('');
      setEmailCodeSent(false);
      setCanResendEmailCode(true);
      setEmailTimer(0);
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSendEmailVerification = () => {
    if (!formData.email) {
      setErrors(prev => ({ ...prev, email: 'Please enter your email first' }));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email' }));
      return;
    }

    const code = generateCode();
    globalCode = code;
    setEmailCodeSent(true);
    setCanResendEmailCode(false);
    setEmailTimer(60); // 1 minute cooldown
    setErrors(prev => ({ ...prev, email: '', emailVerified: '' }));
    
    console.log(`Email verification code sent to ${formData.email}: ${code}`);
    alert(`Demo: Email verification code is ${code} (In production, this would be sent to your email)`);
  };

  const handleEmailCodeChange = (e) => {

    console.log("There is an input");
    let enteredOTP = document.getElementById('IamHere').value;
    console.log(`input as entered: ${enteredOTP}`);
    setEmailCode(enteredOTP)
    console.log(globalCode);
    setEmailVerificationCode(globalCode);
    console.log("help!");


    // Auto-verify when 6 digits are entered
    // if (enteredOTP.length === 6) {
    //   if (enteredOTP === enteredOTP) {
    //     setIsEmailVerified(true);
    //     setErrors(prev => ({ ...prev, emailVerification: '' }));
    //   } else {
    //     setIsEmailVerified(false);
    //     setErrors(prev => ({ ...prev, emailVerification: 'Invalid verification code' }));
    //   }
    // } else {
    //   setIsEmailVerified(false);
    //   setErrors(prev => ({ ...prev, emailVerification: '' }));
    // }
  };

  const handleSubmit = () => {
    // if (validateForm()) {
    //   setStep(2); // Go directly to success page
    // }
    const codedata= axios.post('https://bandymoot.com/api/v1/auth/signup', {firstName:formData.firstName,
      lastName:formData.lastName,
      email:formData.email,
      password:formData.password,
      confirmPassword:formData.confirmPassword,
    accountType:"Employees",
  otp:emailCode})
    .then(response => console.log(response.data))
    .catch(error => console.error(error));
  }



  const InputField = ({ icon: Icon, type = "text", name, placeholder, value, error, ...props }) => (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={handleInputChange}
        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
          error ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
        }`}
        placeholder={placeholder}
        {...props}
      />
      {error && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500" />
        </div>
      )}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );

  // Success Page
  if (step === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Created Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Welcome aboard, {formData.firstName}! Your account has been verified and is ready to use.
          </p>
          <button
            onClick={() => {
              setStep(1);
              setFormData({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                confirmPassword: ''
              });
              setEmailVerificationCode('');
              setIsEmailVerified(false);
              setEmailCodeSent(false);
              setErrors({});
            }}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Create Another Account
          </button>
        </div>
      </div>
    );
  }



  // Main Registration Form
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
          <p className="text-gray-600">Join us today and get started</p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <InputField
              icon={User}
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              error={errors.firstName}
            />
            <InputField
              icon={User}
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              error={errors.lastName}
            />
          </div>

          {/* Email Field */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.email ? 'border-red-500 bg-red-50' : 
                isEmailVerified ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400'
              }`}
              placeholder="Email Address"
            />
            {isEmailVerified && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
            )}
            {errors.email && !isEmailVerified && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
            )}
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          {/* Send Verification Code Button */}
          <button
            type="button"
            onClick={handleSendEmailVerification}
            disabled={!canResendEmailCode || !formData.email}
            className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            {emailCodeSent && !canResendEmailCode ? `Resend in ${emailTimer}s` : 'Send Verification Code'}
          </button>

          {/* Email Verification Code Input */}
          {emailCodeSent && (
            <div className="relative">
              <input
                type="text"
                id="IamHere"
                // value={emailVerificationCode}
                onChange={handleEmailCodeChange}
                className={`w-full px-4 py-3 text-center font-mono tracking-widest border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.emailVerification ? 'border-red-500 bg-red-50' : 
                  isEmailVerified ? 'border-green-500 bg-green-50' : 'border-gray-300'
                }`}
                placeholder="Enter 6-digit verification code"
                maxLength="6"
              />
              {isEmailVerified && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
              )}
              {errors.emailVerification && <p className="mt-1 text-sm text-red-600">{errors.emailVerification}</p>}
              {isEmailVerified && <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                Email successfully verified!
              </p>}
            </div>
          )}

          {/* General email verification error */}
          {errors.emailVerified && <p className="text-sm text-red-600">{errors.emailVerified}</p>}

          {/* Password Field */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
              }`}
              placeholder="Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>

          {/* Confirm Password Field */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
              }`}
              placeholder="Confirm Password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
            {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
          </div>

          <div className="text-xs text-gray-500">
            Password must contain at least 8 characters with uppercase, lowercase, and number.
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Create Account
          </button>

          <p className="text-center text-gray-600 text-sm">
            Already have an account?{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;