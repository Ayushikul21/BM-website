import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const registrationUrl = "http://137.97.126.110:5500/api/v1/auth/signup";
const sendOtpUrl = "http://137.97.126.110:5500/api/v1/auth/sendOtp";
const verifyOtpUrl = "http://137.97.126.110:5500/api/v1/auth/verifyotp";

const requiredFields = ["firstName", "lastName", "employeeId", "email", "password", "confirmPassword", "phone"];

const initialState = {
    firstName: "",
    lastName: "",
    employeeId: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    otp: ["", "", "", "", "", ""]
};

const initialErrors = {
    firstName: "",
    lastName: "",
    employeeId: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    otp: ""
};

const RegistrationForm = () => {
    const [formTouched, setFormTouched] = useState({});
    const [successMessage, setSuccessMessage] = useState("");
    const [successPage, setSuccessPage] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [otpTimer, setOtpTimer] = useState(0);
    const [isOtpVerifying, setIsOtpVerifying] = useState(false);
    const timeoutRef = useRef();
    const otpTimerRef = useRef();
    const otpInputRefs = useRef([]);
    const navigate = useNavigate();
    const [formData, setFormData] = useState(initialState);
    const [errors, setErrors] = useState(initialErrors);

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validatePhone(phone) {
        const re = /^\d{10}$/;
        return re.test(phone.replace(/\D/g, ""));
    }

    function validatePassword(password) {
        return password && password.length >= 8;
    }

    function validateConfirmPassword(password, confirmPassword) {
        return confirmPassword && password === confirmPassword;
    }

    function validateField(fieldId, value) {
        switch (fieldId) {
            case "firstName":
            case "lastName":
                return value && value.length >= 2;
            case "employeeId":
                return value && value.length >= 3;
            case "email":
                return value && validateEmail(value);
            case "password":
                return validatePassword(value);
            case "confirmPassword":
                return validateConfirmPassword(formData.password, value);
            case "phone":
                return value && validatePhone(value);
            default:
                return true;
        }
    }

    function getErrorMessage(fieldId) {
        switch (fieldId) {
            case "firstName":
                return "First name is required and must be at least 2 characters";
            case "lastName":
                return "Last name is required and must be at least 2 characters";
            case "employeeId":
                return "Employee ID is required and must be at least 3 characters";
            case "email":
                return "Please enter a valid email address";
            case "password":
                return "Password is required and must be at least 8 characters";
            case "confirmPassword":
                return "Passwords do not match";
            case "phone":
                return "Phone number is required - please enter a valid 10-digit phone number";
            case "otp":
                return "Please enter the 6-digit OTP sent to your email";
            default:
                return "";
        }
    }

    async function handleSendOtp() {
        if (!validateField("email", formData.email)) {
            setErrors(prev => ({
                ...prev,
                email: getErrorMessage("email")
            }));
            return;
        }

        try {
            const response = await fetch(sendOtpUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: formData.email,
                })
            });

            const result = await response.json();
            console.log("OTP sent:", result);

            if (response.ok) {
                setIsOtpSent(true);
                setOtpTimer(60);
                
                // Start countdown timer
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
                
                // Focus first OTP input
                setTimeout(() => {
                    if (otpInputRefs.current[0]) {
                        otpInputRefs.current[0].focus();
                    }
                }, 100);
            } else {
                alert(result.message || "Failed to send OTP. Please try again.");
            }
        } catch (error) {
            console.error("Error during sending OTP:", error);
            alert("Failed to send OTP. Please check your connection.");
        }
    }

    function handleOtpChange(index, value) {
        if (value && !/^\d$/.test(value)) return;
        
        const newOtp = [...formData.otp];
        newOtp[index] = value;
        
        setFormData(prev => ({
            ...prev,
            otp: newOtp
        }));
        
        if (value && index < 5) {
            otpInputRefs.current[index + 1]?.focus();
        }
        
        if (value) {
            setErrors(prev => ({
                ...prev,
                otp: ""
            }));
        }
    }

    function handleOtpKeyDown(index, e) {
        if (e.key === 'Backspace' && !formData.otp[index] && index > 0) {
            otpInputRefs.current[index - 1]?.focus();
        }
    }

    function handleOtpPaste(e) {
        e.preventDefault();
        const paste = e.clipboardData.getData('text');
        const otpArray = paste.slice(0, 6).split('').map(char => /^\d$/.test(char) ? char : '');
        
        const newOtp = [...formData.otp];
        otpArray.forEach((digit, index) => {
            if (index < 6) newOtp[index] = digit;
        });
        
        setFormData(prev => ({
            ...prev,
            otp: newOtp
        }));
        
        const nextEmptyIndex = newOtp.findIndex(digit => !digit);
        const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
        otpInputRefs.current[focusIndex]?.focus();
    }

    async function handleVerifyOtp() {
        const otpString = formData.otp.join('');
        if (otpString.length !== 6) {
            setErrors(prev => ({
                ...prev,
                otp: getErrorMessage("otp")
            }));
            return;
        }

        setIsOtpVerifying(true);
        
        try {
            const response = await fetch(verifyOtpUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: formData.email,
                    otp: otpString
                })
            });

            const result = await response.json();
            console.log("OTP verification:", result);

            if (response.ok) {
                setIsEmailVerified(true);
                setIsOtpSent(false);
                setSuccessMessage("Email verified successfully! ✅");
                setErrors(prev => ({
                    ...prev,
                    otp: ""
                }));
                
                if (otpTimerRef.current) {
                    clearInterval(otpTimerRef.current);
                    setOtpTimer(0);
                }
                
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                timeoutRef.current = setTimeout(() => {
                    setSuccessMessage("");
                }, 3000);
            } else {
                setErrors(prev => ({
                    ...prev,
                    otp: result.message || "Invalid OTP. Please try again."
                }));
            }
        } catch (error) {
            console.error("Error during OTP verification:", error);
            setErrors(prev => ({
                ...prev,
                otp: "Failed to verify OTP. Please try again."
            }));
        } finally {
            setIsOtpVerifying(false);
        }
    }

    useEffect(() => {
        const savedData = localStorage.getItem("registrationFormData");
        if (savedData) {
            const parsed = JSON.parse(savedData);
            setFormData({
                ...parsed,
                otp: parsed.otp || ["", "", "", "", "", ""]
            });
        }
    }, []);

    useEffect(() => {
        let allValid = true;
        for (let fieldId of requiredFields) {
            if (!validateField(fieldId, formData[fieldId])) {
                allValid = false;
                break;
            }
        }
        if (!isEmailVerified) {
            allValid = false;
        }
        setIsFormValid(allValid);
    }, [formData, isEmailVerified]);

    function handleInputChange(e) {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
        setFormTouched((prev) => ({
            ...prev,
            [name]: true
        }));
        setErrors((prev) => ({
            ...prev,
            [name]: ""
        }));

        if (name === "email" && isEmailVerified) {
            setIsEmailVerified(false);
            setIsOtpSent(false);
            setFormData(prev => ({
                ...prev,
                otp: ["", "", "", "", "", ""]
            }));
        }
    }

    function handleBlur(e) {
        const { name, value } = e.target;
        if (!validateField(name, value)) {
            setErrors((prev) => ({
                ...prev,
                [name]: getErrorMessage(name)
            }));
        } else {
            setErrors((prev) => ({
                ...prev,
                [name]: ""
            }));
        }
    }

    function validateAllFields() {
        let isValid = true;
        let newErrors = {};
        requiredFields.forEach((fieldId) => {
            if (!validateField(fieldId, formData[fieldId])) {
                newErrors[fieldId] = getErrorMessage(fieldId);
                isValid = false;
            } else {
                newErrors[fieldId] = "";
            }
        });
        
        if (!isEmailVerified) {
            newErrors.email = "Please verify your email address";
            isValid = false;
        }
        
        setErrors(newErrors);
        return isValid;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isFormValid) {
            validateAllFields();
            return;
        }

        try {
            const response = await fetch(registrationUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    employeeId: formData.employeeId,
                    email: formData.email,
                    password: formData.password,
                    confirmPassword: formData.confirmPassword,
                    phone: formData.phone,
                    accountType: "Employees"
                })
            });

            const result = await response.json();
            console.log("Registration Response:", result);

            if (response.ok) {
                localStorage.setItem("registrationFormData", JSON.stringify(formData));
                setSuccessMessage("Registration successful! ✅");
                setSuccessPage(true);
                
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                timeoutRef.current = setTimeout(() => {
                    setSuccessMessage("");
                }, 3000);
                
                // navigate("/login");
            } else {
                alert(result.message || "Registration failed. Please try again.");
            }
        } catch (error) {
            console.error("Error during registration:", error);
            alert("Failed to register. Please check your connection.");
        }
    };

    const handleLogin = () => {
        navigate('/login');
    }

    function generateCompletePDF(formData) {
        const mockPDF = {
            save: (filename) => {
                console.log(`PDF saved as: ${filename}`);
            }
        };
        return mockPDF;
    }

    function handleSuccessDownload() {
        try {
            const doc = generateCompletePDF({
                firstname: formData.firstName,
                lastName: formData.lastName,
                employeeId: formData.employeeId,
                phone: formData.phone,
                email: formData.email
            });
            doc.save(`bandy-moot-complete-application-${Date.now()}.pdf`);
        } catch (error) {
            alert("Error generating PDF. Please try again.");
        }
    }

    useEffect(() => {
        return () => {
            if (otpTimerRef.current) clearInterval(otpTimerRef.current);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full max-w-4xl animate-fadeInUp">
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
                    <div className="text-center animate-[fadeIn_0.8s_ease-out]">
                        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-[scaleIn_0.6s_ease-out_0.2s_both]">
                            <span className="text-white text-4xl font-bold">✓</span>
                        </div>
                        <h1 className="text-green-500 text-5xl font-bold mb-5 animate-[bounceIn_1s_ease-out]">
                            🎉 Success!
                        </h1>
                        <p className="text-gray-600 text-xl mb-8 leading-relaxed">
                            Your account has been successfully created!
                        </p>
                        <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
                            <button
                                className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl text-xl font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-lg block w-full sm:w-auto"
                                onClick={handleSuccessDownload}
                            >
                                📄 Download Complete Application PDF
                            </button>
                            <button
                                onClick={handleLogin}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-xl text-xl font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-lg block w-full sm:w-auto text-center"
                            >
                                🔐 Login to Portal
                            </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-gray-700 font-semibold text-sm">
                                    First Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="firstName"
                                    required
                                    placeholder="Enter your first name"
                                    minLength={2}
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    className={`w-full px-5 py-4 border-2 rounded-xl text-base transition-all duration-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-3 focus:ring-indigo-200 focus:border-indigo-500 hover:shadow-md transform focus:-translate-y-1 ${
                                        errors.firstName && formTouched.firstName
                                            ? "border-red-500"
                                            : formData.firstName
                                            ? "border-green-500"
                                            : "border-gray-300"
                                    }`}
                                />
                                {errors.firstName && formTouched.firstName && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.firstName}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-gray-700 font-semibold text-sm">
                                    Last Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="lastName"
                                    required
                                    placeholder="Enter your last name"
                                    minLength={2}
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    className={`w-full px-5 py-4 border-2 rounded-xl text-base transition-all duration-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-3 focus:ring-indigo-200 focus:border-indigo-500 hover:shadow-md transform focus:-translate-y-1 ${
                                        errors.lastName && formTouched.lastName
                                            ? "border-red-500"
                                            : formData.lastName
                                            ? "border-green-500"
                                            : "border-gray-300"
                                    }`}
                                />
                                {errors.lastName && formTouched.lastName && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.lastName}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-gray-700 font-semibold text-sm">
                                    Employee ID <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="employeeId"
                                    required
                                    placeholder="Enter your employee ID"
                                    minLength={3}
                                    value={formData.employeeId}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    className={`w-full px-5 py-4 border-2 rounded-xl text-base transition-all duration-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-3 focus:ring-indigo-200 focus:border-indigo-500 hover:shadow-md transform focus:-translate-y-1 ${
                                        errors.employeeId && formTouched.employeeId
                                            ? "border-red-500"
                                            : formData.employeeId
                                            ? "border-green-500"
                                            : "border-gray-300"
                                    }`}
                                />
                                {errors.employeeId && formTouched.employeeId && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.employeeId}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-gray-700 font-semibold text-sm">
                                    Email Address <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    placeholder="Enter your email address"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    disabled={isEmailVerified}
                                    className={`w-full px-5 py-4 border-2 rounded-xl text-base transition-all duration-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-3 focus:ring-indigo-200 focus:border-indigo-500 hover:shadow-md transform focus:-translate-y-1 ${
                                        errors.email && formTouched.email
                                            ? "border-red-500"
                                            : isEmailVerified
                                            ? "border-green-500 bg-green-50"
                                            : formData.email && validateEmail(formData.email)
                                            ? "border-blue-500"
                                            : "border-gray-300"
                                    } ${isEmailVerified ? "cursor-not-allowed" : ""}`}
                                />
                                {errors.email && formTouched.email && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.email}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-center">
                            {!isEmailVerified && (
                                <button
                                    type="button"
                                    onClick={handleSendOtp}
                                    disabled={!validateEmail(formData.email) || (isOtpSent && otpTimer > 0)}
                                    className={`px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-2 ${
                                        validateEmail(formData.email) && (!isOtpSent || otpTimer === 0)
                                            ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white cursor-pointer shadow-lg"
                                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    }`}
                                >
                                    {isOtpSent && otpTimer > 0 ? `Resend OTP (${otpTimer}s)` : "Send OTP"}
                                </button>
                            )}
                            {isEmailVerified && (
                                <div className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl flex items-center gap-2 shadow-lg">
                                    <span>✅</span>
                                    <span className="font-semibold">Email Verified</span>
                                </div>
                            )}
                        </div>

                        {isOtpSent && !isEmailVerified && (
                            <div className="space-y-4">
                                <div className="text-center">
                                    <p className="text-gray-600 text-sm mb-2">
                                        Enter the 6-digit OTP sent to your email
                                    </p>
                                    <div className="flex justify-center gap-3 mb-4">
                                        {formData.otp.map((digit, index) => (
                                            <input
                                                key={index}
                                                ref={el => otpInputRefs.current[index] = el}
                                                type="text"
                                                maxLength="1"
                                                value={digit}
                                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                                onPaste={index === 0 ? handleOtpPaste : undefined}
                                                className={`w-12 h-12 text-center text-xl font-bold border-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-blue-200 focus:border-blue-500 ${
                                                    errors.otp
                                                        ? "border-red-500 bg-red-50"
                                                        : digit
                                                        ? "border-green-500 bg-green-50"
                                                        : "border-gray-300 bg-gray-50"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleVerifyOtp}
                                        disabled={formData.otp.some(digit => !digit) || isOtpVerifying}
                                        className={`px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-2 mx-auto ${
                                            formData.otp.every(digit => digit) && !isOtpVerifying
                                                ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white cursor-pointer shadow-lg"
                                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        }`}
                                    >
                                        {isOtpVerifying ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                                Verifying...
                                            </>
                                        ) : (
                                            "Verify OTP"
                                        )}
                                    </button>
                                </div>
                                {errors.otp && (
                                    <p className="text-red-500 text-sm text-center mt-2">
                                        {errors.otp}
                                    </p>
                                )}
                            </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-gray-700 font-semibold text-sm">
                                    Password <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    placeholder="Enter your password (min 8 characters)"
                                    minLength={8}
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    className={`w-full px-5 py-4 border-2 rounded-xl text-base transition-all duration-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-3 focus:ring-indigo-200 focus:border-indigo-500 hover:shadow-md transform focus:-translate-y-1 ${
                                        errors.password && formTouched.password
                                            ? "border-red-500"
                                            : formData.password && validatePassword(formData.password)
                                            ? "border-green-500"
                                            : "border-gray-300"
                                    }`}
                                />
                                {errors.password && formTouched.password && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-gray-700 font-semibold text-sm">
                                    Confirm Password <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    required
                                    placeholder="Re-enter your password"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    className={`w-full px-5 py-4 border-2 rounded-xl text-base transition-all duration-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-3 focus:ring-indigo-200 focus:border-indigo-500 hover:shadow-md transform focus:-translate-y-1 ${
                                        errors.confirmPassword && formTouched.confirmPassword
                                            ? "border-red-500"
                                            : formData.confirmPassword && formData.password === formData.confirmPassword
                                            ? "border-green-500"
                                            : "border-gray-300"
                                    }`}
                                />
                                {errors.confirmPassword && formTouched.confirmPassword && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.confirmPassword}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-gray-700 font-semibold text-sm">
                                Phone Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                required
                                placeholder="Enter your phone number"
                                pattern="[0-9]{10}"
                                value={formData.phone}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                className={`w-full px-5 py-4 border-2 rounded-xl text-base transition-all duration-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-3 focus:ring-indigo-200 focus:border-indigo-500 hover:shadow-md transform focus:-translate-y-1 ${
                                    errors.phone && formTouched.phone
                                        ? "border-red-500"
                                        : formData.phone && validatePhone(formData.phone)
                                        ? "border-green-500"
                                        : "border-gray-300"
                                }`}
                            />
                            {errors.phone && formTouched.phone && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.phone}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-6">
                            <button
                                type="submit"
                                className="flex-1 py-4 px-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                            >
                                Sign Up
                            </button>
                        </div>
                    </form>
                )}

                {!successPage && (
                    <div className="text-center mt-8 pt-6 border-t border-gray-200">
                        <p className="text-gray-600">
                            Already have an account?{" "}
                            <button
                                onClick={handleLogin}
                                className="text-indigo-600 hover:text-purple-600 font-semibold hover:underline transition-colors duration-200"
                            >
                                Sign in here
                            </button>
                        </p>
                    </div>
                )}

                <style jsx>{`
                    @keyframes fadeInUp {
                        from {
                            opacity: 0;
                            transform: translateY(30px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    .animate-fadeInUp {
                        animation: fadeInUp 0.6s ease-out;
                    }
                `}</style>
            </div>
        </div>
    );
};

export default RegistrationForm;