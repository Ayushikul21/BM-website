import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const tenthBoards = [
  "CBSE (Central Board of Secondary Education)",
  "ICSE (Indian Certificate of Secondary Education)",
  "State Board - Andhra Pradesh",
  "State Board - Assam",
  "State Board - Bihar",
  "State Board - Chhattisgarh",
  "State Board - Delhi",
  "State Board - Goa",
  "State Board - Gujarat",
  "State Board - Haryana",
  "State Board - Himachal Pradesh",
  "State Board - Jharkhand",
  "State Board - Karnataka",
  "State Board - Kerala",
  "State Board - Madhya Pradesh",
  "State Board - Maharashtra",
  "State Board - Manipur",
  "State Board - Meghalaya",
  "State Board - Mizoram",
  "State Board - Nagaland",
  "State Board - Odisha",
  "State Board - Punjab",
  "State Board - Rajasthan",
  "State Board - Sikkim",
  "State Board - Tamil Nadu",
  "State Board - Telangana",
  "State Board - Tripura",
  "State Board - Uttar Pradesh",
  "State Board - Uttarakhand",
  "State Board - West Bengal",
  "NIOS (National Institute of Open Schooling)",
  "Cambridge International",
  "IB (International Baccalaureate)",
  "Other"
];

const grades = [
  "A+",
  "A",
  "B+",
  "B",
  "C+",
  "C",
  "D",
  "E",
  "F"
];

const initialState = {
  tenthSchool: "",
  tenthBoard: "",
  tenthYear: "",
  tenthGrade: "",
  tenthPercentage: "",
  twelfthCollege: "",
  twelfthBoard: "",
  twelfthYear: "",
  twelfthGrade: "",
  twelfthPercentage: ""
};

const initialErrors = {
  tenthSchool: "",
  tenthBoard: "",
  tenthYear: "",
  tenthGrade: "",
  tenthPercentage: "",
  twelfthCollege: "",
  twelfthBoard: "",
  twelfthYear: "",
  twelfthGrade: "",
  twelfthPercentage: ""
};

const EducationForm = () => {
  const [formTouched, setFormTouched] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [saveButtonText, setSaveButtonText] = useState("Save");
  const [saveButtonColor, setSaveButtonColor] = useState("bg-green-600");
  const [savedData, setSavedData] = useState(null); // In-memory storage
  const timeoutRef = useRef();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState(initialErrors);

  // Check if localStorage is available
  const isLocalStorageAvailable = () => {
    try {
      return typeof(Storage) !== "undefined" && window.localStorage;
    } catch (e) {
      return false;
    }
  };

  // Load saved data from localStorage or in-memory storage
  useEffect(() => {
    let loadedData = null;
    
    // Try localStorage first
    if (isLocalStorageAvailable()) {
      try {
        const savedDataString = localStorage.getItem("educationFormData");
        if (savedDataString) {
          loadedData = JSON.parse(savedDataString);
        }
      } catch (e) {
        console.warn("Failed to load from localStorage:", e);
      }
    }
    
    // Fallback to in-memory storage
    if (!loadedData && savedData) {
      loadedData = savedData;
    }
    
    if (loadedData) {
      setFormData((prev) => ({
        ...prev,
        ...Object.fromEntries(
          Object.entries(loadedData).filter(([k]) =>
            Object.keys(initialState).includes(k)
          )
        ),
      }));
      setSuccessMessage(
        `<strong>Previously saved data loaded</strong><br>
        <small>Last saved: ${loadedData.savedAt || "Unknown"}</small>`
      );
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  }, [savedData]);

  // Validate form whenever formData changes
  useEffect(() => {
    let allValid = true;
    // Required fields
    for (let fieldId of ["tenthSchool", "tenthBoard", "tenthYear"]) {
      if (!validateField(fieldId, formData[fieldId], formData)) {
        allValid = false;
        break;
      }
    }
    // Check either 10th grade or percentage
    const has10thGrade = validateField("tenthGrade", formData.tenthGrade, formData);
    const has10thPercentage = validateField("tenthPercentage", formData.tenthPercentage, formData);
    if (!has10thGrade && !has10thPercentage) {
      allValid = false;
    }
    // 12th: if year provided, validate, and either grade or percentage
    if (formData.twelfthYear) {
      if (!validateField("twelfthYear", formData.twelfthYear, formData)) allValid = false;
      const has12thGrade = validateField("twelfthGrade", formData.twelfthGrade, formData);
      const has12thPercentage = validateField("twelfthPercentage", formData.twelfthPercentage, formData);
      if (!has12thGrade && !has12thPercentage) allValid = false;
    }
    setIsFormValid(allValid);
  }, [formData]);

function validateField(fieldId, value, formData) {
  switch (fieldId) {
    case "tenthSchool":
      return value && value.trim().length >= 2;
    case "tenthBoard":
      return value && value.trim() !== "";
    case "tenthYear":
      return !!value && parseInt(value) >= 1990 && parseInt(value) <= 2030;
    case "tenthGrade":
      return value && value.trim() !== "";
    case "tenthPercentage":
      if (!value) return false;
      const p = parseFloat(value);
      return !isNaN(p) && p >= 0 && p <= 100;
    case "twelfthYear":
      if (!value) return true; // optional
      const y12 = parseInt(value);
      if (isNaN(y12) || y12 < 1990 || y12 > 2030) return false;
      if (formData.tenthYear) {
        const y10 = parseInt(formData.tenthYear);
        if (!isNaN(y10) && y12 <= y10) return false;
      }
      return true;
    case "twelfthGrade":
      return value && value.trim() !== "";
    case "twelfthPercentage":
      if (!value) return false;
      const twp = parseFloat(value);
      return !isNaN(twp) && twp >= 0 && twp <= 100;
    default:
      return true;
  }
}

function getErrorMessage(fieldId, value, formData) {
  switch (fieldId) {
    case "tenthSchool":
      return "School name is required (minimum 2 characters)";
    case "tenthBoard":
      return "Please select your board";
    case "tenthYear":
      return "Please enter a valid year (1990-2030)";
    case "tenthGrade":
      return "Either grade or percentage is required";
    case "tenthPercentage":
      return "Either grade or percentage is required";
    case "twelfthYear":
      if (!value) return ""; // optional
      if (formData.tenthYear) {
        const y10 = parseInt(formData.tenthYear);
        const y12 = parseInt(value);
        if (!isNaN(y10) && !isNaN(y12) && y12 <= y10) {
          return `12th year must be greater than 10th year (${y10})`;
        }
      }
      return "Please enter a valid year (1990-2030)";
    case "twelfthGrade":
      return "Either grade or percentage is required for 12th class";
    case "twelfthPercentage":
      return "Either grade or percentage is required for 12th class";
    default:
      return "";
  }
}

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
    // If tenthYear or twelfthYear changed, trigger full validity check for year comparison.
    if (name === "tenthYear" || name === "twelfthYear") {
      // Force revalidate on next render
      setTimeout(() => checkYearComparison(), 0);
    }
  }

  function handleBlur(e) {
    const { name, value } = e.target;
    if (!validateField(name, value, formData)) {
      setErrors((prev) => ({
        ...prev,
        [name]: getErrorMessage(name, value, formData),
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  }

  function checkYearComparison() {
    if (!formData.tenthYear || !formData.twelfthYear) return;
    const y10 = parseInt(formData.tenthYear);
    const y12 = parseInt(formData.twelfthYear);
    if (!isNaN(y10) && !isNaN(y12) && y12 <= y10) {
      setErrors((prev) => ({
        ...prev,
        twelfthYear: `12th year must be greater than 10th year (${y10})`,
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        twelfthYear: "",
      }));
    }
  }

  function validateAllFields() {
    let isValid = true;
    let newErrors = {};
    // Required fields
    for (let fieldId of ["tenthSchool", "tenthBoard", "tenthYear"]) {
      if (!validateField(fieldId, formData[fieldId], formData)) {
        newErrors[fieldId] = getErrorMessage(fieldId, formData[fieldId], formData);
        isValid = false;
      } else {
        newErrors[fieldId] = "";
      }
    }
    // 10th either grade or percentage
    const has10thGrade = validateField("tenthGrade", formData.tenthGrade, formData);
    const has10thPercentage = validateField("tenthPercentage", formData.tenthPercentage, formData);
    if (!has10thGrade && !has10thPercentage) {
      newErrors.tenthGrade = getErrorMessage("tenthGrade", "", formData);
      newErrors.tenthPercentage = getErrorMessage("tenthPercentage", "", formData);
      isValid = false;
    } else {
      newErrors.tenthGrade = "";
      newErrors.tenthPercentage = "";
    }
    // 12th: if year provided, validate, and either grade or percentage
    if (formData.twelfthYear) {
      if (!validateField("twelfthYear", formData.twelfthYear, formData)) {
        newErrors.twelfthYear = getErrorMessage("twelfthYear", formData.twelfthYear, formData);
        isValid = false;
      } else {
        newErrors.twelfthYear = "";
      }
      const has12thGrade = validateField("twelfthGrade", formData.twelfthGrade, formData);
      const has12thPercentage = validateField("twelfthPercentage", formData.twelfthPercentage, formData);
      if (!has12thGrade && !has12thPercentage) {
        newErrors.twelfthGrade = getErrorMessage("twelfthGrade", "", formData);
        newErrors.twelfthPercentage = getErrorMessage("twelfthPercentage", "", formData);
        isValid = false;
      } else {
        newErrors.twelfthGrade = "";
        newErrors.twelfthPercentage = "";
      }
    }
    setErrors(newErrors);
    return isValid;
  }

  function handleNext() {
    if (!isFormValid) return;
    if (validateAllFields()) {
      const saveData = {
        ...formData,
        savedAt: new Date().toLocaleString(),
      };
      
      let saveSuccess = false;
      
      // Try localStorage first
      if (isLocalStorageAvailable()) {
        try {
          localStorage.setItem("educationFormData", JSON.stringify(saveData));
          saveSuccess = true;
        } catch (e) {
          console.warn("Failed to save to localStorage:", e);
        }
      }
      
      // Always save to in-memory storage as fallback
      setSavedData(saveData);
      saveSuccess = true;
      
      if (saveSuccess) {
        setSuccessMessage(
          `<strong>Education Information Saved Successfully! ✅</strong><br>
          <small>Saved at: ${saveData.savedAt}</small><br>
          <small>10th: ${saveData.tenthSchool} (${saveData.tenthBoard}, ${saveData.tenthYear})${
            saveData.twelfthYear
              ? ` | 12th: ${saveData.twelfthCollege || "N/A"} (${
                  saveData.twelfthBoard || "N/A"
                }, ${saveData.twelfthYear})`
              : ""
          }</small>`
        );
        setSaveButtonText("Saved ✓");
        setSaveButtonColor("bg-green-600");
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          setSuccessMessage("");
          setSaveButtonText("Save");
          setSaveButtonColor("bg-gradient-to-r from-blue-500 to-purple-600");
        }, 4000);
      }
      navigate('/education45');
    }
  }

  function handleBack() {
    navigate('/personal');
  }

  // On mount, validate in case pre-filled
  useEffect(() => {
    validateAllFields();
    // eslint-disable-next-line
  }, []);

  // Board options: both 10th and 12th are the same
  const boardOptions = tenthBoards;

  const getInputStyle = (fieldName) => {
    if (errors[fieldName] && formTouched[fieldName]) {
      return "border-red-500 focus:border-red-500 focus:ring-red-500";
    }
    if (formData[fieldName]) {
      return "border-green-500 focus:border-green-500 focus:ring-green-500";
    }
    return "border-gray-300 focus:border-blue-500 focus:ring-blue-500";
  };

  return (
     <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full max-w-5xl animate-fadeInUp max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-6 text-gray-600 text-sm">
          <p>Step 4 of 4 - Education Information</p>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">Bandy & Moot</h1>
          <p className="text-xl text-gray-600">Education Information</p>
        </div>

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl mb-6 text-center font-semibold">
            <div dangerouslySetInnerHTML={{ __html: successMessage }} />
          </div>
        )}

        <form autoComplete="off" onSubmit={e => e.preventDefault()}>
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100 mb-8">
            {/* 10th Section */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">10th Class Information</h2>
              <p className="text-sm text-red-600 italic">
                School name, board, and year are mandatory. Either grade OR percentage is required.
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                10th School Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="tenthSchool"
                placeholder="Enter your 10th school name"
                value={formData.tenthSchool}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-3 border-2 rounded-xl text-gray-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${getInputStyle('tenthSchool')}`}
              />
              {errors.tenthSchool && formTouched.tenthSchool && (
                <p className="text-red-500 text-sm mt-1">{errors.tenthSchool}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  10th Board <span className="text-red-500">*</span>
                </label>
                <select
                  name="tenthBoard"
                  value={formData.tenthBoard}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 border-2 rounded-xl text-gray-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${getInputStyle('tenthBoard')}`}
                >
                  <option value="">Select Board</option>
                  {boardOptions.map((board) => (
                    <option key={board} value={board}>
                      {board}
                    </option>
                  ))}
                </select>
                {errors.tenthBoard && formTouched.tenthBoard && (
                  <p className="text-red-500 text-sm mt-1">{errors.tenthBoard}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  10th Year of Passing <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="tenthYear"
                  placeholder="Enter year"
                  min="1990"
                  max="2030"
                  value={formData.tenthYear}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 border-2 rounded-xl text-gray-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${getInputStyle('tenthYear')}`}
                />
                {errors.tenthYear && formTouched.tenthYear && (
                  <p className="text-red-500 text-sm mt-1">{errors.tenthYear}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  10th Grade
                </label>
                <select
                  name="tenthGrade"
                  value={formData.tenthGrade}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 border-2 rounded-xl text-gray-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${getInputStyle('tenthGrade')}`}
                >
                  <option value="">Select Grade</option>
                  {grades.map((grade) => (
                    <option key={grade} value={grade}>
                      {grade}
                    </option>
                  ))}
                </select>
                {errors.tenthGrade && formTouched.tenthGrade && (
                  <p className="text-red-500 text-sm mt-1">{errors.tenthGrade}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  10th Percentage
                </label>
                <input
                  type="number"
                  name="tenthPercentage"
                  placeholder="Enter percentage"
                  min="0"
                  max="100"
                  step="0.01"
                  value={formData.tenthPercentage}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 border-2 rounded-xl text-gray-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${getInputStyle('tenthPercentage')}`}
                />
                {errors.tenthPercentage && formTouched.tenthPercentage && (
                  <p className="text-red-500 text-sm mt-1">{errors.tenthPercentage}</p>
                )}
              </div>
            </div>

            <p className="text-sm text-blue-600 font-semibold italic mb-8">
              * Either Grade OR Percentage must be provided for 10th class
            </p>

            <div className="border-b-2 border-gray-200 pb-6 mb-6"></div>

            {/* 12th Section */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">12th Class Information</h2>
              <p className="text-sm text-gray-600 italic">All fields in this section are optional</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                12th College/School Name
              </label>
              <input
                type="text"
                name="twelfthCollege"
                placeholder="Enter college/school name"
                value={formData.twelfthCollege}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-3 border-2 rounded-xl text-gray-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${getInputStyle('twelfthCollege')}`}
              />
              {errors.twelfthCollege && formTouched.twelfthCollege && (
                <p className="text-red-500 text-sm mt-1">{errors.twelfthCollege}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  12th Board
                </label>
                <select
                  name="twelfthBoard"
                  value={formData.twelfthBoard}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 border-2 rounded-xl text-gray-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${getInputStyle('twelfthBoard')}`}
                >
                  <option value="">Select Board</option>
                  {boardOptions.map((board) => (
                    <option key={board} value={board}>
                      {board}
                    </option>
                  ))}
                </select>
                {errors.twelfthBoard && formTouched.twelfthBoard && (
                  <p className="text-red-500 text-sm mt-1">{errors.twelfthBoard}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  12th Year of Passing
                </label>
                <input
                  type="number"
                  name="twelfthYear"
                  placeholder="Enter year"
                  min="1990"
                  max="2030"
                  value={formData.twelfthYear}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 border-2 rounded-xl text-gray-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${getInputStyle('twelfthYear')}`}
                />
                {errors.twelfthYear && formTouched.twelfthYear && (
                  <p className="text-red-500 text-sm mt-1">{errors.twelfthYear}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  12th Grade
                </label>
                <select
                  name="twelfthGrade"
                  value={formData.twelfthGrade}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 border-2 rounded-xl text-gray-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${getInputStyle('twelfthGrade')}`}
                >
                  <option value="">Select Grade</option>
                  {grades.map((grade) => (
                    <option key={grade} value={grade}>
                      {grade}
                    </option>
                  ))}
                </select>
                {errors.twelfthGrade && formTouched.twelfthGrade && (
                  <p className="text-red-500 text-sm mt-1">{errors.twelfthGrade}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  12th Percentage
                </label>
                <input
                  type="number"
                  name="twelfthPercentage"
                  placeholder="Enter percentage"
                  min="0"
                  max="100"
                  step="0.01"
                  value={formData.twelfthPercentage}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 border-2 rounded-xl text-gray-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${getInputStyle('twelfthPercentage')}`}
                />
                {errors.twelfthPercentage && formTouched.twelfthPercentage && (
                  <p className="text-red-500 text-sm mt-1">{errors.twelfthPercentage}</p>
                )}
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
        </form>
      </div>
    </div>
  );
};

export default EducationForm;