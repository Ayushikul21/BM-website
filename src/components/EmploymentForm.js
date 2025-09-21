import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const initialState = {
  companyName: "",
  position: "",
  teamLead: "",
  salaryAnnum: "",
  startingDate: "",
  endingDate: "",
  experienceMonths: "",
  reasonLeaving: ""
};

const initialErrors = Object.fromEntries(
  Object.keys(initialState).map((k) => [k, ""])
);

const EmploymentForm = () => {
  const [formTouched, setFormTouched] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [saveButtonText, setSaveButtonText] = useState("Save");
  const [saveButtonColor, setSaveButtonColor] = useState("bg-green-600");
  const timeoutRef = useRef();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState(initialErrors);

  function validateField(fieldId, value) {
    switch (fieldId) {
      case "companyName":
      case "position":
      case "teamLead":
        return value && value.trim().length >= 2;
      case "salaryAnnum":
        return value && parseInt(value) >= 0;
      case "experienceMonths":
        return value && parseInt(value) >= 1 && parseInt(value) <= 600;
      case "startingDate":
      case "endingDate":
        return value && value.trim() !== "";
      case "reasonLeaving":
        return value && value.trim() !== "";
      default:
        return true;
    }
  }

  function getErrorMessage(fieldId) {
    switch (fieldId) {
      case "companyName":
        return "Company name is required (minimum 2 characters)";
      case "position":
        return "Position/Job title is required (minimum 2 characters)";
      case "teamLead":
        return "Team lead/Manager name is required (minimum 2 characters)";
      case "salaryAnnum":
        return "Annual salary is required and must be 0 or greater";
      case "startingDate":
        return "Starting date is required";
      case "endingDate":
        return "Ending date is required";
      case "experienceMonths":
        return "Work experience is required (1-600 months)";
      case "reasonLeaving":
        return "Please select a reason for leaving";
      default:
        return "Please enter a valid value";
    }
  }

  const reasonLeavingOptions = [
    "Career Growth",
    "Better Opportunity",
    "Higher Salary",
    "Relocation",
    "Company Layoffs",
    "Personal Reasons",
    "Contract Ended",
    "Work-Life Balance",
    "Other"
  ];

  // Load from localStorage if available
  useEffect(() => {
    try {
      if (typeof Storage !== "undefined" && localStorage) {
        const savedData = localStorage.getItem("employmentFormData");
        if (savedData) {
          const data = JSON.parse(savedData);
          setFormData((prev) => ({
            ...prev,
            ...Object.fromEntries(
              Object.entries(data).filter(
                ([k]) => Object.keys(initialState).includes(k)
              )
            )
          }));
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
  }

  function handleBlur(e) {
    const { name, value } = e.target;
    if (value && !validateField(name, value)) {
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
    const fieldsToValidate = [
      "companyName",
      "position",
      "teamLead",
      "salaryAnnum",
      "startingDate",
      "endingDate",
      "experienceMonths",
      "reasonLeaving"
    ];
    fieldsToValidate.forEach((fieldId) => {
      const value = formData[fieldId];
      if (!validateField(fieldId, value)) {
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
      const saveData = {
        ...formData,
        savedAt: new Date().toLocaleString()
      };
      try {
        if (typeof Storage !== "undefined" && localStorage) {
          localStorage.setItem("employmentFormData", JSON.stringify(saveData));
        }
      } catch (e) {}
    // Navigate to skills page - would be handled by parent component
    console.log('Navigate to skills page');
    navigate('/skills');
  }

  function handleBack() {
    // Navigate to education page - would be handled by parent component
    console.log('Navigate to education page');
    navigate('/education45');
  }

  const getInputBorderColor = (fieldName) => {
    if (errors[fieldName] && formTouched[fieldName]) {
      return "border-red-500 focus:border-red-500";
    }
    if (formData[fieldName]) {
      return "border-green-500 focus:border-indigo-500";
    }
    return "border-gray-300 focus:border-indigo-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full max-w-5xl animate-fadeInUp max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-indigo-600 mb-3">Bandy & Moot</h1>
          <p className="text-gray-600 text-xl">Previous Employment Information</p>
        </div>
        
        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl mb-6 text-center font-semibold animate-slide-down">
            {successMessage}
          </div>
        )}

        <div onSubmit={e => e.preventDefault()} className="space-y-6">
          <div className="bg-white rounded-3xl p-10 shadow-lg border-2 border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <h2 className="text-3xl font-bold text-center mb-8 pb-6 border-b-2 border-gray-200 text-gray-800">
              Company & Position Details
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  name="companyName"
                  placeholder="Enter company name"
                  minLength={2}
                  value={formData.companyName}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:-translate-y-1 focus:shadow-lg ${getInputBorderColor('companyName')}`}
                />
                {errors.companyName && formTouched.companyName && (
                  <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Position/Job Title
                </label>
                <input
                  type="text"
                  name="position"
                  placeholder="Enter your position"
                  minLength={2}
                  value={formData.position}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:-translate-y-1 focus:shadow-lg ${getInputBorderColor('position')}`}
                />
                {errors.position && formTouched.position && (
                  <p className="text-red-500 text-sm mt-1">{errors.position}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Team Lead/Manager Name
                </label>
                <input
                  type="text"
                  name="teamLead"
                  placeholder="Enter team lead/manager name"
                  minLength={2}
                  value={formData.teamLead}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:-translate-y-1 focus:shadow-lg ${getInputBorderColor('teamLead')}`}
                />
                {errors.teamLead && formTouched.teamLead && (
                  <p className="text-red-500 text-sm mt-1">{errors.teamLead}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Annual Salary
                </label>
                <input
                  type="number"
                  name="salaryAnnum"
                  placeholder="Enter annual salary"
                  min={0}
                  step={1000}
                  value={formData.salaryAnnum}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:-translate-y-1 focus:shadow-lg ${getInputBorderColor('salaryAnnum')}`}
                />
                {errors.salaryAnnum && formTouched.salaryAnnum && (
                  <p className="text-red-500 text-sm mt-1">{errors.salaryAnnum}</p>
                )}
              </div>
              </div>

              <div className="space-y-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Starting Date
                  </label>
                  <input
                    type="date"
                    name="startingDate"
                    value={formData.startingDate}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:-translate-y-1 focus:shadow-lg ${getInputBorderColor('startingDate')}`}
                  />
                  {errors.startingDate && formTouched.startingDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.startingDate}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ending Date
                  </label>
                  <input
                    type="date"
                    name="endingDate"
                    value={formData.endingDate}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:-translate-y-1 focus:shadow-lg ${getInputBorderColor('endingDate')}`}
                  />
                  {errors.endingDate && formTouched.endingDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.endingDate}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Work Experience (in months)
                </label>
                <input
                  type="number"
                  name="experienceMonths"
                  placeholder="Total experience in months"
                  min={1}
                  max={600}
                  value={formData.experienceMonths}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:-translate-y-1 focus:shadow-lg ${getInputBorderColor('experienceMonths')}`}
                />
                {errors.experienceMonths && formTouched.experienceMonths && (
                  <p className="text-red-500 text-sm mt-1">{errors.experienceMonths}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Reason for Leaving
                </label>
                <select
                  name="reasonLeaving"
                  value={formData.reasonLeaving}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:-translate-y-1 focus:shadow-lg ${getInputBorderColor('reasonLeaving')}`}
                >
                  <option value="">Select Reason</option>
                  {reasonLeavingOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {errors.reasonLeaving && formTouched.reasonLeaving && (
                  <p className="text-red-500 text-sm mt-1">{errors.reasonLeaving}</p>
                )}
              </div>
              </div>
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
              onClick={handleNext}
              className={"flex-1 py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"}
            >
              Next →
            </button>
          </div> 
        </div>
      </div>
    </div>
  );
};

export default EmploymentForm;