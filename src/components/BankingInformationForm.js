import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const requiredFields = [
  "bankName",
  "ifscCode",
  "accountNumber",
  "branchName",
  "panNumber",
  "aadharNumber"
];

const initialState = {
  bankName: "",
  ifscCode: "",
  accountNumber: "",
  branchName: "",
  panNumber: "",
  aadharNumber: ""
};

const initialErrors = {
  bankName: "",
  ifscCode: "",
  accountNumber: "",
  branchName: "",
  panNumber: "",
  aadharNumber: ""
};

const BankingInformationForm = () => {
  const [formTouched, setFormTouched] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [saveButtonText, setSaveButtonText] = useState("Save");
  const [saveButtonColor, setSaveButtonColor] = useState("bg-green-600");
  const timeoutRef = useRef();
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState(initialErrors);
  const navigate = useNavigate();

  // Load from localStorage (simulated for demo)
  useEffect(() => {
    try {
      const savedData = localStorage.getItem("bankingFormData");
      if (savedData) {
        const data = JSON.parse(savedData);
        setFormData((prev) => ({
          ...prev,
          ...Object.fromEntries(
            Object.entries(data).filter(([k]) => requiredFields.includes(k))
          )
        }));
        setSuccessMessage(
          `Previously saved data loaded - Last saved: ${data.savedAt || "Unknown"}`
        );
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (e) {
      // ignore
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

  function validateIFSC(ifsc) {
    return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc);
  }
  function validatePAN(pan) {
    return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);
  }
  function validateAadhar(aadhar) {
    return /^\d{12}$/.test(aadhar.replace(/\s/g, ""));
  }
  function validateAccountNumber(accountNum) {
    return /^\d{9,18}$/.test(accountNum);
  }
  function validateField(fieldId, value) {
    switch (fieldId) {
      case "bankName":
        return value && value.length >= 2;
      case "ifscCode":
        return value && validateIFSC(value);
      case "accountNumber":
        return value && validateAccountNumber(value);
      case "branchName":
        return value && value.length >= 3;
      case "panNumber":
        return value && validatePAN(value);
      case "aadharNumber":
        return value && validateAadhar(value);
      default:
        return true;
    }
  }
  function getErrorMessage(fieldId) {
    switch (fieldId) {
      case "bankName":
        return "Bank name is required and must be at least 2 characters";
      case "ifscCode":
        return "Please enter a valid IFSC code (e.g., SBIN0001234)";
      case "accountNumber":
        return "Account number must be 9-18 digits";
      case "branchName":
        return "Branch name is required and must be at least 3 characters";
      case "panNumber":
        return "Please enter a valid PAN number (e.g., ABCDE1234F)";
      case "aadharNumber":
        return "Please enter a valid 12-digit Aadhar number";
      default:
        return "";
    }
  }

  function handleInputChange(e) {
    const { name, value } = e.target;

    // Handle auto-uppercase and only digits for certain fields
    let val = value;
    if (name === "ifscCode" || name === "panNumber") {
      val = value.toUpperCase();
    }
    if (name === "aadharNumber" || name === "accountNumber") {
      val = value.replace(/\D/g, "");
    }

    setFormData((prev) => ({
      ...prev,
      [name]: val
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
      navigate('/Personal');
      alert('Form validated successfully! Would navigate to Personal page.');
    }
  }

  function handleSave() {
    if (validateAllFields()) {
      const saveData = {
        ...formData,
        savedAt: new Date().toLocaleString()
      };
      // Store to localStorage if available
      try {
        localStorage.setItem("bankingFormData", JSON.stringify(saveData));
      } catch (e) {
        // ignore
      }
      setSuccessMessage(
        `Banking Information Saved Successfully! ✅ - Saved at: ${saveData.savedAt} - Bank: ${saveData.bankName} | Account: ${saveData.accountNumber}`
      );
      setSaveButtonText("Saved ✓");
      setSaveButtonColor("bg-green-700");
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setSuccessMessage("");
        setSaveButtonText("Save");
        setSaveButtonColor("bg-green-600");
      }, 4000);
    }
  }

  function handleBack() {
    navigate('/');
    alert('Would navigate back to registration page.');
  }

  // On mount, validate in case pre-filled
  useEffect(() => {
    validateAllFields();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full max-w-5xl animate-fadeInUp">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">
            Bandy & Moot
          </h1>
          <p className="text-gray-600 text-lg">
            Banking Information Form
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center">
            <span className="mr-2">✅</span>
            <div className="text-sm">
              {successMessage}
            </div>
          </div>
        )}

        {/* Form */}
        <div className="space-y-6">
          {/* Two-column layout for larger screens */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bank Name */}
            <div className="space-y-2">
              <label className="block text-gray-700 font-semibold text-sm">
                Bank Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="bankName"
                required
                placeholder="Enter your bank name"
                minLength={2}
                value={formData.bankName}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full px-5 py-4 border-2 rounded-xl text-base transition-all duration-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-3 focus:ring-indigo-200 focus:border-indigo-500 hover:shadow-md transform focus:-translate-y-1 ${
                  errors.bankName && formTouched.bankName
                    ? "border-red-500"
                    : formData.bankName
                    ? "border-green-500"
                    : "border-gray-300"
                }`}
              />
              {errors.bankName && formTouched.bankName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.bankName}
                </p>
              )}
            </div>

            {/* IFSC Code */}
            <div className="space-y-2">
              <label className="block text-gray-700 font-semibold text-sm">
                IFSC Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="ifscCode"
                required
                placeholder="Enter IFSC code (e.g., SBIN0001234)"
                pattern="[A-Z]{4}0[A-Z0-9]{6}"
                maxLength={11}
                value={formData.ifscCode}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full px-5 py-4 border-2 rounded-xl text-base transition-all duration-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-3 focus:ring-indigo-200 focus:border-indigo-500 hover:shadow-md transform focus:-translate-y-1 uppercase ${
                  errors.ifscCode && formTouched.ifscCode
                    ? "border-red-500"
                    : formData.ifscCode
                    ? "border-green-500"
                    : "border-gray-300"
                }`}
              />
              {errors.ifscCode && formTouched.ifscCode && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.ifscCode}
                </p>
              )}
            </div>

            {/* Account Number */}
            <div className="space-y-2">
              <label className="block text-gray-700 font-semibold text-sm">
                Account Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="accountNumber"
                required
                placeholder="Enter your account number"
                minLength={9}
                maxLength={18}
                pattern="[0-9]+"
                value={formData.accountNumber}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full px-5 py-4 border-2 rounded-xl text-base transition-all duration-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-3 focus:ring-indigo-200 focus:border-indigo-500 hover:shadow-md transform focus:-translate-y-1 ${
                  errors.accountNumber && formTouched.accountNumber
                    ? "border-red-500"
                    : formData.accountNumber
                    ? "border-green-500"
                    : "border-gray-300"
                }`}
              />
              {errors.accountNumber && formTouched.accountNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.accountNumber}
                </p>
              )}
            </div>

            {/* Branch Name */}
            <div className="space-y-2">
              <label className="block text-gray-700 font-semibold text-sm">
                Branch Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="branchName"
                required
                placeholder="Enter your branch name"
                minLength={3}
                value={formData.branchName}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full px-5 py-4 border-2 rounded-xl text-base transition-all duration-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-3 focus:ring-indigo-200 focus:border-indigo-500 hover:shadow-md transform focus:-translate-y-1 ${
                  errors.branchName && formTouched.branchName
                    ? "border-red-500"
                    : formData.branchName
                    ? "border-green-500"
                    : "border-gray-300"
                }`}
              />
              {errors.branchName && formTouched.branchName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.branchName}
                </p>
              )}
            </div>

            {/* PAN Number */}
            <div className="space-y-2">
              <label className="block text-gray-700 font-semibold text-sm">
                PAN Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="panNumber"
                required
                placeholder="Enter PAN number (e.g., ABCDE1234F)"
                pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                maxLength={10}
                value={formData.panNumber}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full px-5 py-4 border-2 rounded-xl text-base transition-all duration-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-3 focus:ring-indigo-200 focus:border-indigo-500 hover:shadow-md transform focus:-translate-y-1 uppercase ${
                  errors.panNumber && formTouched.panNumber
                    ? "border-red-500"
                    : formData.panNumber
                    ? "border-green-500"
                    : "border-gray-300"
                }`}
              />
              {errors.panNumber && formTouched.panNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.panNumber}
                </p>
              )}
            </div>

            {/* Aadhar Number */}
            <div className="space-y-2">
              <label className="block text-gray-700 font-semibold text-sm">
                Aadhar Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="aadharNumber"
                required
                placeholder="Enter 12-digit Aadhar number"
                pattern="[0-9]{12}"
                maxLength={12}
                value={formData.aadharNumber}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full px-5 py-4 border-2 rounded-xl text-base transition-all duration-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-3 focus:ring-indigo-200 focus:border-indigo-500 hover:shadow-md transform focus:-translate-y-1 ${
                  errors.aadharNumber && formTouched.aadharNumber
                    ? "border-red-500"
                    : formData.aadharNumber
                    ? "border-green-500"
                    : "border-gray-300"
                }`}
              />
              {errors.aadharNumber && formTouched.aadharNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.aadharNumber}
                </p>
              )}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 py-4 px-6 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              ← Back
            </button>
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
          </div>

          {/* Save Button */}
          <button
            type="button"
            onClick={handleSave}
            className={`w-full py-4 px-6 ${saveButtonColor} hover:bg-green-700 text-white rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg`}
          >
            💾 {saveButtonText}
          </button>
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

export default BankingInformationForm;