import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const requiredFields = ["firstName", "lastName", "employeeId", "email", "phone"];

const initialState = {
    firstName: "",
    lastName: "",
    employeeId: "",
    email: "",
    phone: ""
};

const initialErrors = {
    firstName: "",
    lastName: "",
    employeeId: "",
    email: "",
    phone: ""
};

const RegistrationForm = () => {
    const [formTouched, setFormTouched] = useState({});
    const [successMessage, setSuccessMessage] = useState("");
    const [isFormValid, setIsFormValid] = useState(false);
    const timeoutRef = useRef();
    const [formData, setFormData] = useState(initialState);
    const [errors, setErrors] = useState(initialErrors);
    const navigate = useNavigate();

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validatePhone(phone) {
        const re = /^\d{10}$/;
        return re.test(phone.replace(/\D/g, ""));
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
            case "phone":
                return "Phone number is required - please enter a valid 10-digit phone number";
            default:
                return "";
        }
    }

    // Auto-fill from localStorage (simulated with state for demo)
    useEffect(() => {
        const savedData = localStorage.getItem("registrationFormData");
        if (savedData) {
            setFormData(JSON.parse(savedData));
        }
    }, []);

    // Validate form whenever formData changes
    useEffect(() => {
        let allValid = true;
        for (let fieldId of requiredFields) {
            if (!validateField(fieldId, formData[fieldId])) {
                allValid = false;
                break;
            }
        }
        setIsFormValid(allValid);
    }, [formData]);

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
        // Clear error on change
        setErrors((prev) => ({
            ...prev,
            [name]: ""
        }));
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
        setErrors(newErrors);
        return isValid;
    }

    function handleNext() {
        if (!isFormValid) return;
        if (validateAllFields()) {
            navigate('/banking');
            alert('Form validated successfully! Would navigate to banking page.');
        }
    }

    function handleSave() {
        if (validateAllFields()) {
            localStorage.setItem("registrationFormData", JSON.stringify(formData));
            setSuccessMessage("Information saved successfully! ✅");
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                setSuccessMessage("");
            }, 3000);
        }
    }

    // On mount, validate in case pre-filled
    useEffect(() => {
        validateAllFields();
        // eslint-disable-next-line
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full max-w-4xl animate-fadeInUp">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-blue-600 mb-2">
                        Bandy & Moot
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Employee Registration Portal
                    </p>
                </div>

                {/* Success Message */}
                {successMessage && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center">
                        <span className="mr-2">✅</span>
                        {successMessage}
                    </div>
                )}

                {/* Form */}
                <div className="space-y-6">
                    {/* Two-column layout for larger screens */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* First Name */}
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

                        {/* Last Name */}
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

                        {/* Employee ID */}
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

                        {/* Email */}
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
                                className={`w-full px-5 py-4 border-2 rounded-xl text-base transition-all duration-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-3 focus:ring-indigo-200 focus:border-indigo-500 hover:shadow-md transform focus:-translate-y-1 ${
                                    errors.email && formTouched.email
                                        ? "border-red-500"
                                        : formData.email
                                        ? "border-green-500"
                                        : "border-gray-300"
                                }`}
                            />
                            {errors.email && formTouched.email && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.email}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Phone Number - Full Width */}
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
                                    : formData.phone
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

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6">
                        <button
                            type="button"
                            disabled={!isFormValid}
                            onClick={handleNext}
                            className={`flex-1 py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                                isFormValid
                                    ? "bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                        >
                            Next →
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            className="flex-1 py-4 px-6 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                        >
                            💾 Save Progress
                        </button>
                    </div>
                </div>

                {/* Login Link */}
                <div className="text-center mt-8 pt-6 border-t border-gray-200">
                    <p className="text-gray-600">
                        Already have an account?{" "}
                        <a
                            href="/login-trigger"
                            className="text-indigo-600 hover:text-purple-600 font-semibold hover:underline transition-colors duration-200"
                        >
                            Sign in here
                        </a>
                    </p>
                </div>
            </div>

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
    );
};

export default RegistrationForm;