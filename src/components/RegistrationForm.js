import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, User, Mail, Lock, Phone, CreditCard, Eye, EyeOff } from "lucide-react";

const RegistrationForm = () => {
    const [isEmployee, setIsEmployee] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        employeeId: "",
        password: "",
        confirmPassword: "",
        phone: "",
        otp: ["", "", "", "", "", ""]
    });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [otpTimer, setOtpTimer] = useState(0);
    const [isOtpVerifying, setIsOtpVerifying] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [successPage, setSuccessPage] = useState(false);
    const navigate = useNavigate(); 
    
    const otpInputRefs = useRef([]);
    const otpTimerRef = useRef();

    const sendOtpUrl = "https://bandymoot.com/api/v1/auth/sendOtp";
    const verifyOtpUrl = "https://bandymoot.com/api/v1/auth/verifyotp";
    const registrationUrl = "https://bandymoot.com/api/v1/auth/signup";

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone) => {
        // More flexible phone validation
        const cleanedPhone = phone.replace(/\D/g, "");
        return cleanedPhone.length >= 10;
    };

    const validatePassword = (password) => {
        return password && password.length >= 8;
    };

    const validateField = (name, value) => {
        switch (name) {
            case "firstName":
            case "lastName":
                return value && value.trim().length >= 2;
            case "email":
                return value && validateEmail(value);
            case "employeeId":
                return !isEmployee || (value && value.trim().length >= 3);
            case "password":
                return validatePassword(value);
            case "confirmPassword":
                return value && value === formData.password;
            case "phone":
                return value && validatePhone(value);
            default:
                return true;
        }
    };

    const getErrorMessage = (name) => {
        const messages = {
            firstName: "First name must be at least 2 characters",
            lastName: "Last name must be at least 2 characters",
            email: "Please enter a valid email address",
            employeeId: "Employee ID must be at least 3 characters",
            password: "Password must be at least 8 characters",
            confirmPassword: "Passwords do not match",
            phone: "Please enter a valid phone number"
        };
        return messages[name] || "";
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }

        if (name === "email" && isEmailVerified) {
            setIsEmailVerified(false);
            setIsOtpSent(false);
            setFormData(prev => ({ ...prev, otp: ["", "", "", "", "", ""] }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));

        if (!validateField(name, value)) {
            setErrors(prev => ({ ...prev, [name]: getErrorMessage(name) }));
        } else {
            // Clear error if field is valid
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const handleEmployeeChange = (e) => {
        const checked = e.target.checked;
        setIsEmployee(checked);
        
        if (!checked) {
            setFormData(prev => ({
                ...prev,
                employeeId: "",
                otp: ["", "", "", "", "", ""]
            }));
            setIsEmailVerified(false);
            setIsOtpSent(false);
            setErrors(prev => ({ ...prev, employeeId: "", email: "" }));
        }
    };

    const handleSendOtp = async () => {
        if (!validateField("email", formData.email)) {
            setErrors(prev => ({ ...prev, email: getErrorMessage("email") }));
            return;
        }

        try {
            const response = await fetch(sendOtpUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formData.email })
            });

            const result = await response.json();

            if (response.ok) {
                setIsOtpSent(true);
                setOtpTimer(60);
                
                const timer = setInterval(() => {
                    setOtpTimer(prev => {
                        if (prev <= 1) {
                            clearInterval(timer);
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
                
                otpTimerRef.current = timer;
                
                setTimeout(() => {
                    if (otpInputRefs.current[0]) {
                        otpInputRefs.current[0].focus();
                    }
                }, 100);
            } else {
                setErrors(prev => ({
                    ...prev,
                    email: result.message || "Failed to send OTP. Please try again."
                }));
            }
        } catch (error) {
            setErrors(prev => ({
                ...prev,
                email: "Failed to send OTP. Please check your connection."
            }));
        }
    };

    const handleOtpChange = (index, value) => {
        if (value && !/^\d$/.test(value)) return;
        
        const newOtp = [...formData.otp];
        newOtp[index] = value;
        
        setFormData(prev => ({ ...prev, otp: newOtp }));
        
        if (value && index < 5) {
            otpInputRefs.current[index + 1]?.focus();
        }
        
        if (errors.otp) {
            setErrors(prev => ({ ...prev, otp: "" }));
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !formData.otp[index] && index > 0) {
            otpInputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerifyOtp = async () => {
        const otpString = formData.otp.join('');
        if (otpString.length !== 6) {
            setErrors(prev => ({
                ...prev,
                otp: "Please enter the complete 6-digit OTP"
            }));
            return;
        }

        setIsOtpVerifying(true);
        
        try {
            const response = await fetch(verifyOtpUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: formData.email,
                    otp: otpString
                })
            });

            const result = await response.json();

            if (response.ok) {
                setIsEmailVerified(true);
                setIsOtpSent(false);
                setSuccessMessage("Email verified successfully!");
                setErrors(prev => ({ ...prev, otp: "" }));
                
                if (otpTimerRef.current) {
                    clearInterval(otpTimerRef.current);
                    setOtpTimer(0);
                }

                setTimeout(() => setSuccessMessage(""), 3000);
            } else {
                setErrors(prev => ({
                    ...prev,
                    otp: result.message || "Invalid OTP. Please try again."
                }));
            }
        } catch (error) {
            setErrors(prev => ({
                ...prev,
                otp: "Failed to verify OTP. Please try again."
            }));
        } finally {
            setIsOtpVerifying(false);
        }
    };

    const handleSubmit = async () => {
        // Mark all fields as touched
        const newTouched = {};
        Object.keys(formData).forEach(key => {
            if (key !== "otp") newTouched[key] = true;
        });
        setTouched(newTouched);
        
        // Validate all fields
        let newErrors = {};
        let isValid = true;

        // Required fields for all users
        const requiredFields = ["firstName", "lastName", "email", "password", "confirmPassword", "phone"];
        if (isEmployee) {
            requiredFields.push("employeeId");
        }

        requiredFields.forEach(field => {
            if (!validateField(field, formData[field])) {
                newErrors[field] = getErrorMessage(field);
                isValid = false;
            }
        });

        if (isEmployee && !isEmailVerified) {
            newErrors.email = "Please verify your email address";
            isValid = false;
        }

        setErrors(newErrors);

        if (!isValid) {
            // Scroll to first error
            const firstErrorField = Object.keys(newErrors)[0];
            const element = document.querySelector(`[name="${firstErrorField}"]`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        setIsSubmitting(true);

        try {
            const requestBody = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
                confirmPassword: formData.confirmPassword,
                phone: formData.phone.replace(/\D/g, ''), // Clean phone number
                accountType: isEmployee ? "Employees" : "Users"
            };

            if (isEmployee) {
                requestBody.employeeId = formData.employeeId;
            }

            const response = await fetch(registrationUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody)
            });

            const result = await response.json();

            if (response.ok) {
                setSuccessMessage("Registration successful!");
                setSuccessPage(true);
            } else {
                setErrors(prev => ({
                    ...prev,
                    submit: result.message || "Registration failed. Please try again."
                }));
            }
        } catch (error) {
            setErrors(prev => ({
                ...prev,
                submit: "Registration failed. Please check your connection."
            }));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLogin = () => {
        navigate('/login');
    };

    useEffect(() => {
        return () => {
            if (otpTimerRef.current) {
                clearInterval(otpTimerRef.current);
            }
        };
    }, []);

    const getBorderColor = (fieldName) => {
        if (errors[fieldName] && touched[fieldName]) return "border-red-300 bg-red-50";
        if (fieldName === "email" && isEmployee && isEmailVerified) return "border-green-300 bg-green-50 cursor-not-allowed";
        return "border-gray-300 focus:border-blue-500";
    };

    const renderInputField = (type, name, placeholder, icon, disabled = false) => (
        <div className="relative">
            {icon}
            <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleInputChange}
                onBlur={handleBlur}
                disabled={disabled}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${getBorderColor(name)} ${disabled ? 'cursor-not-allowed' : ''}`}
                placeholder={placeholder}
            />
            {name === "email" && isEmployee && isEmailVerified && (
                <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5" />
            )}
        </div>
    );

    const renderPasswordField = (name, placeholder, showState, setShowState) => (
        <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
                type={showState ? "text" : "password"}
                name={name}
                value={formData[name]}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${getBorderColor(name)}`}
                placeholder={placeholder}
            />
            <button
                type="button"
                onClick={() => setShowState(!showState)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
                {showState ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full max-w-4xl">
                <div className="text-center mb-8 flex flex-col items-center">
                    <img 
                        src="/salary website/logob&m.jpg" 
                        alt="Bandy & Moot Logo" 
                        className="w-20 h-20 object-contain mb-4 rounded-full border-2 border-blue-500 bg-white shadow-lg"
                    />
                    <h1 className="text-4xl font-bold text-blue-600 mb-2">
                        Bandy & Moot Pvt. Ltd.
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Employee Registration Portal
                    </p>
                </div>

                {successMessage && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center">
                        <span className="mr-2">✅</span>
                        {successMessage}
                    </div>
                )}

                {successPage ? (
                    <div className="text-center">
                        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
                            <span className="text-white text-4xl font-bold">✓</span>
                        </div>
                        <h1 className="text-green-500 text-5xl font-bold mb-5">
                            🎉 Success!
                        </h1>
                        <p className="text-gray-600 text-xl mb-8 leading-relaxed">
                            Your account has been successfully created!
                        </p>
                        <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
                            <button
                                onClick={handleLogin}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-xl text-xl font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-lg block w-full sm:w-auto text-center"
                            >
                                🔐 Login to Portal
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                            <input
                                type="checkbox"
                                id="employee"
                                checked={isEmployee}
                                onChange={handleEmployeeChange}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="employee" className="text-sm font-medium text-gray-700">
                                I am an employee
                            </label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    First Name *
                                </label>
                                {renderInputField("text", "firstName", "Enter your first name", 
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                )}
                                {errors.firstName && touched.firstName && (
                                    <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Last Name *
                                </label>
                                {renderInputField("text", "lastName", "Enter your last name",
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                )}
                                {errors.lastName && touched.lastName && (
                                    <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Email Address *
                            </label>
                            {renderInputField("email", "email", "Enter your email address",
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />,
                                isEmployee && isEmailVerified
                            )}
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>

                        {isEmployee && (
                            <>
                                {formData.email && validateEmail(formData.email) && !isEmailVerified && (
                                    <div className="flex justify-center">
                                        <button
                                            type="button"
                                            onClick={handleSendOtp}
                                            disabled={isOtpSent && otpTimer > 0}
                                            className={`px-6 py-2 rounded-lg font-medium transition-all ${
                                                isOtpSent && otpTimer > 0
                                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                            }`}
                                        >
                                            {isOtpSent && otpTimer > 0 ? `Resend OTP (${otpTimer}s)` : "Send OTP"}
                                        </button>
                                    </div>
                                )}

                                {isOtpSent && !isEmailVerified && (
                                    <div className="space-y-4">
                                        <div className="text-center">
                                            <p className="text-sm text-gray-600 mb-4">
                                                Enter the 6-digit OTP sent to your email
                                            </p>
                                            <div className="flex justify-center space-x-2 mb-4">
                                                {formData.otp.map((digit, index) => (
                                                    <input
                                                        key={index}
                                                        ref={el => otpInputRefs.current[index] = el}
                                                        type="text"
                                                        maxLength="1"
                                                        value={digit}
                                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                                        className={`w-12 h-12 text-center text-lg font-bold border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                                            errors.otp ? "border-red-300 bg-red-50" : "border-gray-300"
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={handleVerifyOtp}
                                                disabled={formData.otp.some(digit => !digit) || isOtpVerifying}
                                                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                                                    formData.otp.every(digit => digit) && !isOtpVerifying
                                                        ? "bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                }`}
                                            >
                                                {isOtpVerifying ? (
                                                    <div className="flex items-center">
                                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                                        Verifying...
                                                    </div>
                                                ) : (
                                                    "Verify OTP"
                                                )}
                                            </button>
                                        </div>
                                        {errors.otp && (
                                            <p className="text-center text-sm text-red-600">{errors.otp}</p>
                                        )}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Employee ID *
                                    </label>
                                    {renderInputField("text", "employeeId", "Enter your employee ID",
                                        <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    )}
                                    {errors.employeeId && touched.employeeId && (
                                        <p className="mt-1 text-sm text-red-600">{errors.employeeId}</p>
                                    )}
                                </div>
                            </>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Password *
                                </label>
                                {renderPasswordField("password", "Enter your password", showPassword, setShowPassword)}
                                {errors.password && touched.password && (
                                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Confirm Password *
                                </label>
                                {renderPasswordField("confirmPassword", "Confirm your password", showConfirmPassword, setShowConfirmPassword)}
                                {errors.confirmPassword && touched.confirmPassword && (
                                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Phone Number *
                            </label>
                            {renderInputField("tel", "phone", "Enter your phone number",
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            )}
                            {errors.phone && touched.phone && (
                                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                            )}
                        </div>

                        {errors.submit && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-600">{errors.submit}</p>
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting || (isEmployee && !isEmailVerified)}
                            className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 ${
                                isSubmitting || (isEmployee && !isEmailVerified)
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            }`}
                        >
                            {isSubmitting ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                                    Creating Account...
                                </div>
                            ) : (
                                "Create Account"
                            )}
                        </button>

                        <div className="text-center mt-8 pt-6 border-t border-gray-200">
                            <p className="text-gray-600">
                                Already have an account?{" "}
                                <button
                                    type="button"
                                    className="text-indigo-600 hover:text-purple-600 font-semibold hover:underline transition-colors duration-200"
                                    onClick={handleLogin}
                                >
                                    Sign in here
                                </button>
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RegistrationForm;