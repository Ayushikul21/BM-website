import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// Define initial state and errors BEFORE the component
const initialState = {
  maritalStatus: "",
  marriageDate: "",
  bloodGroup: "",
  nationality: "",
  permanentAddress: "",
  currentAddress: ""
};

const initialErrors = {
  maritalStatus: "",
  marriageDate: "",
  bloodGroup: "",
  nationality: "",
  permanentAddress: "",
  currentAddress: ""
};

const bloodGroups = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-"
];

const nationalities = [
  "Indian",
  "American",
  "British",
  "Canadian",
  "Australian",
  "German",
  "French",
  "Japanese",
  "Chinese",
  "Other"
];

function validateField(fieldId, value, maritalStatus) {
  switch (fieldId) {
    case "maritalStatus":
      return value !== "";
    case "marriageDate":
      if (maritalStatus !== "married") return true;
      if (!value) return false;
      // Check date is not in the future
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate <= today;
    case "bloodGroup":
    case "nationality":
      return value && value.trim() !== "";
    case "permanentAddress":
    case "currentAddress":
      return value && value.trim().length >= 10;
    default:
      return true;
  }
}

function getErrorMessage(fieldId, value, maritalStatus) {
  switch (fieldId) {
    case "maritalStatus":
      return "Please select your marital status";
    case "marriageDate":
      if (!value) return "Please enter your marriage date";
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate > today) {
        return "Marriage date cannot be in the future";
      }
      return "Please enter your marriage date";
    case "bloodGroup":
      return "Please select your blood group";
    case "nationality":
      return "Please select your nationality";
    case "permanentAddress":
      return "Permanent address is required (minimum 10 characters)";
    case "currentAddress":
      return "Current address is required (minimum 10 characters)";
    default:
      return "";
  }
}

const PersonalDetailsForm = () => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState(initialErrors);
  const [formTouched, setFormTouched] = useState({});
  const [showMarriageDate, setShowMarriageDate] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [saveButtonText, setSaveButtonText] = useState("Save");
  const [saveButtonColor, setSaveButtonColor] = useState("bg-green-500");
  const timeoutRef = useRef();
  const navigate = useNavigate();

  // Set max date for marriageDate input
  const maxDateToday = (() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  })();

  // Load saved data from localStorage (if available)
  useEffect(() => {
    try {
      if (typeof Storage !== "undefined" && localStorage) {
        const savedData = localStorage.getItem("personalFormData");
        if (savedData) {
          const data = JSON.parse(savedData);
          setFormData((prev) => ({
            ...prev,
            ...Object.fromEntries(
              Object.entries(data).filter(([k]) =>
                Object.keys(initialState).includes(k)
              )
            )
          }));
          // Show the marriage date if loaded status is married
          if (data.maritalStatus === "married") setShowMarriageDate(true);
          setSuccessMessage(
            `Previously saved data loaded - Last saved: ${data.savedAt || "Unknown"}`
          );
          setTimeout(() => setSuccessMessage(""), 3000);
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Validate form whenever formData changes
  useEffect(() => {
    let allValid = true;
    const fields = [
      "maritalStatus",
      "bloodGroup",
      "nationality",
      "permanentAddress",
      "currentAddress"
    ];
    if (formData.maritalStatus === "married") fields.push("marriageDate");
    for (let fieldId of fields) {
      if (!validateField(fieldId, formData[fieldId], formData.maritalStatus)) {
        allValid = false;
        break;
      }
    }
    setIsFormValid(allValid);
  }, [formData]);

  function handleInputChange(e) {
    const { name, value, type } = e.target;
    let val = value;
    if (type === "radio") {
      setFormData((prev) => ({
        ...prev,
        [name]: val
      }));
      setFormTouched((prev) => ({
        ...prev,
        [name]: true
      }));
      if (val === "married") {
        setShowMarriageDate(true);
      } else {
        setShowMarriageDate(false);
        setFormData((prev) => ({ ...prev, marriageDate: "" }));
        setErrors((prev) => ({ ...prev, marriageDate: "" }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: val
      }));
      setFormTouched((prev) => ({
        ...prev,
        [name]: true
      }));
    }
    setErrors((prev) => ({
      ...prev,
      [name]: ""
    }));
  }

  function handleBlur(e) {
    const { name, value } = e.target;
    if (!validateField(name, value, formData.maritalStatus)) {
      setErrors((prev) => ({
        ...prev,
        [name]: getErrorMessage(name, value, formData.maritalStatus)
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
    const fields = [
      "maritalStatus",
      "bloodGroup",
      "nationality",
      "permanentAddress",
      "currentAddress"
    ];
    if (formData.maritalStatus === "married") fields.push("marriageDate");
    fields.forEach((fieldId) => {
      if (!validateField(fieldId, formData[fieldId], formData.maritalStatus)) {
        newErrors[fieldId] = getErrorMessage(
          fieldId,
          formData[fieldId],
          formData.maritalStatus
        );
        isValid = false;
      } else {
        newErrors[fieldId] = "";
      }
    });
    setErrors(newErrors);
    return isValid;
  }

  function collectFormData() {
    let data = { ...formData };
    // Remove marriageDate if not married
    if (data.maritalStatus !== "married") delete data.marriageDate;
    return data;
  }

  function handleNext() {
    if (!isFormValid) return;
    if (validateAllFields()) {
      navigate('/education');
    }
  }

  function handleSave() {
    if (validateAllFields()) {
      const saveData = {
        ...collectFormData(),
        savedAt: new Date().toLocaleString()
      };
      try {
        if (typeof Storage !== "undefined" && localStorage) {
          localStorage.setItem("personalFormData", JSON.stringify(saveData));
        }
      } catch (e) {
        // ignore
      }
      setSuccessMessage(
        `Personal Details Saved Successfully! ✅ - Saved at: ${saveData.savedAt} - Status: ${saveData.maritalStatus} | Blood Group: ${saveData.bloodGroup}`
      );
      setSaveButtonText("Saved ✓");
      setSaveButtonColor("bg-green-600");
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setSuccessMessage("");
        setSaveButtonText("Save");
        setSaveButtonColor("bg-green-500");
      }, 4000);
    }
  }

  function handleBack() {
    navigate('/banking');
  }

  // On mount, validate in case pre-filled
  useEffect(() => {
    validateAllFields();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full max-w-5xl animate-fadeInUp">
        <div className="text-center mb-8">
          <p className="text-gray-600 text-sm">Step 3 of 4 - Personal Details</p>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-blue-600 text-4xl font-bold mb-2">Bandy & Moot</h1>
          <p className="text-gray-600 text-lg">Complete your registration</p>
        </div>

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-5">
            {successMessage}
          </div>
        )}

        <div onSubmit={e => e.preventDefault()} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-gray-700 font-semibold text-sm">
              Marital Status <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-5">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="single"
                  name="maritalStatus"
                  value="single"
                  checked={formData.maritalStatus === "single"}
                  onChange={handleInputChange}
                  required
                  className="w-4 h-4 text-blue-600"
                />
                <label htmlFor="single" className="text-gray-700 font-medium cursor-pointer">Single</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="married"
                  name="maritalStatus"
                  value="married"
                  checked={formData.maritalStatus === "married"}
                  onChange={handleInputChange}
                  required
                  className="w-4 h-4 text-blue-600"
                />
                <label htmlFor="married" className="text-gray-700 font-medium cursor-pointer">Married</label>
              </div>
            </div>
            {errors.maritalStatus && formTouched.maritalStatus && (
              <div className="text-red-500 text-sm mt-1">
                {errors.maritalStatus}
              </div>
            )}

            {showMarriageDate && (
              <div className="mt-4 animate-fadeIn">
                <label htmlFor="marriageDate" className="block text-gray-700 font-semibold text-sm mb-2">
                  Date of Marriage <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="marriageDate"
                  name="marriageDate"
                  value={formData.marriageDate}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  required={showMarriageDate}
                  max={maxDateToday}
                  className={`w-full px-5 py-4 border-2 rounded-xl text-base transition-all duration-300 bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-500 focus:shadow-lg focus:-translate-y-1 ${
                    errors.marriageDate && formTouched.marriageDate
                      ? "border-red-500"
                      : formData.marriageDate
                      ? "border-green-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.marriageDate && formTouched.marriageDate && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.marriageDate}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="bloodGroup" className="block text-gray-700 font-semibold text-sm">
              Blood Group <span className="text-red-500">*</span>
            </label>
            <select
              id="bloodGroup"
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleInputChange}
              onBlur={handleBlur}
              required
              className={`w-full px-5 py-4 border-2 rounded-xl text-base transition-all duration-300 bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-500 focus:shadow-lg focus:-translate-y-1 ${
                errors.bloodGroup && formTouched.bloodGroup
                  ? "border-red-500"
                  : formData.bloodGroup
                  ? "border-green-500"
                  : "border-gray-300"
              }`}
            >
              <option value="">Select your blood group</option>
              {bloodGroups.map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
            {errors.bloodGroup && formTouched.bloodGroup && (
              <div className="text-red-500 text-sm mt-1">
                {errors.bloodGroup}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="nationality" className="block text-gray-700 font-semibold text-sm">
              Nationality <span className="text-red-500">*</span>
            </label>
            <select
              id="nationality"
              name="nationality"
              value={formData.nationality}
              onChange={handleInputChange}
              onBlur={handleBlur}
              required
              className={`w-full px-5 py-4 border-2 rounded-xl text-base transition-all duration-300 bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-500 focus:shadow-lg focus:-translate-y-1 ${
                errors.nationality && formTouched.nationality
                  ? "border-red-500"
                  : formData.nationality
                  ? "border-green-500"
                  : "border-gray-300"
              }`}
            >
              <option value="">Select your nationality</option>
              {nationalities.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            {errors.nationality && formTouched.nationality && (
              <div className="text-red-500 text-sm mt-1">
                {errors.nationality}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="permanentAddress" className="block text-gray-700 font-semibold text-sm">
              Permanent Address <span className="text-red-500">*</span>
            </label>
            <textarea
              id="permanentAddress"
              name="permanentAddress"
              required
              placeholder="Enter your permanent address"
              minLength={10}
              value={formData.permanentAddress}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`w-full px-5 py-4 border-2 rounded-xl text-base transition-all duration-300 bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-500 focus:shadow-lg focus:-translate-y-1 resize-y min-h-[80px] ${
                errors.permanentAddress && formTouched.permanentAddress
                  ? "border-red-500"
                  : formData.permanentAddress
                  ? "border-green-500"
                  : "border-gray-300"
              }`}
            />
            {errors.permanentAddress && formTouched.permanentAddress && (
              <div className="text-red-500 text-sm mt-1">
                {errors.permanentAddress}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="currentAddress" className="block text-gray-700 font-semibold text-sm">
              Current Address <span className="text-red-500">*</span>
            </label>
            <textarea
              id="currentAddress"
              name="currentAddress"
              required
              placeholder="Enter your current address"
              minLength={10}
              value={formData.currentAddress}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`w-full px-5 py-4 border-2 rounded-xl text-base transition-all duration-300 bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-500 focus:shadow-lg focus:-translate-y-1 resize-y min-h-[80px] ${
                errors.currentAddress && formTouched.currentAddress
                  ? "border-red-500"
                  : formData.currentAddress
                  ? "border-green-500"
                  : "border-gray-300"
              }`}
            />
            {errors.currentAddress && formTouched.currentAddress && (
              <div className="text-red-500 text-sm mt-1">
                {errors.currentAddress}
              </div>
            )}
          </div>

          <div className="flex gap-4 mt-5">
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 px-4 py-4 bg-gray-500 text-white rounded-xl text-lg font-semibold cursor-pointer transition-all duration-300 hover:bg-gray-600 hover:-translate-y-1 hover:shadow-lg"
            >
              Back
            </button>
            <button
              type="button"
              disabled={!isFormValid}
              onClick={handleNext}
              className={`flex-1 px-4 py-4 rounded-xl text-lg font-semibold transition-all duration-300 text-white ${
                isFormValid
                  ? "bg-blue-500 hover:bg-blue-600 hover:-translate-y-1 hover:shadow-lg cursor-pointer"
                  : "bg-gray-400 cursor-not-allowed opacity-60"
              }`}
            >
              Next
            </button>
          </div>

          <button
            type="button"
            onClick={handleSave}
            className={`w-full px-4 py-4 ${saveButtonColor} text-white rounded-xl text-lg font-semibold cursor-pointer transition-all duration-300 hover:bg-green-600 hover:-translate-y-1 hover:shadow-lg mt-4`}
          >
            {saveButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalDetailsForm;