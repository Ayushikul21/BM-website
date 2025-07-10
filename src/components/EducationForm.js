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
  const [saveButtonColor, setSaveButtonColor] = useState("linear-gradient(135deg, #667eea 0%, #764ba2 100%)");
  const timeoutRef = useRef();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState(initialErrors);

  // Style tag for CSS-in-JS
  useEffect(() => {
    let styleTag = document.getElementById("education-form-styles");
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = "education-form-styles";
      styleTag.innerHTML = styles;
      document.head.appendChild(styleTag);
    }
  }, []);

  // Load saved data from localStorage (if available)
  useEffect(() => {
    try {
      if (typeof Storage !== "undefined" && localStorage) {
        const savedData = localStorage.getItem("educationFormData");
        if (savedData) {
          const data = JSON.parse(savedData);
          setFormData((prev) => ({
            ...prev,
            ...Object.fromEntries(
              Object.entries(data).filter(([k]) =>
                Object.keys(initialState).includes(k)
              )
            ),
          }));
          setSuccessMessage(
            `<strong>Previously saved data loaded</strong><br>
            <small>Last saved: ${data.savedAt || "Unknown"}</small>`
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

const styles = `
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
.container {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 40px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 700px;
    animation: slideUp 0.6s ease-out;
    max-height: 90vh;
    overflow-y: auto;
}
@keyframes slideUp {
    from { opacity: 0; transform: translateY(30px);}
    to { opacity: 1; transform: translateY(0);}
}
.form-header {
    text-align: center;
    margin-bottom: 30px;
}
.form-header h1 {
    color: rgb(0, 140, 255);
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 10px;
}
.form-header p {
    color: #666;
    font-size: 1.1rem;
}
.education-card {
    padding: 30px;
    border-radius: 20px;
    background: white;
    color: #333;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    margin-bottom: 30px;
    border: 2px solid #f0f0f0;
}
.section-divider {
    margin: 30px 0;
    border-bottom: 2px solid #e0e0e0;
    padding-bottom: 20px;
}
.section-title {
    font-size: 1.3rem;
    font-weight: 600;
    margin-bottom: 20px;
    color: #333;
    text-align: center;
}
.form-group {
    margin-bottom: 20px;
    position: relative;
}
.form-group label {
    display: block;
    font-weight: 600;
    margin-bottom: 8px;
    font-size: 0.9rem;
    color: #333;
}
.form-group label .required {
    color: #ff6b6b;
    margin-left: 3px;
}
.form-group input,
.form-group select {
    width: 100%;
    padding: 12px 15px;
    border: 2px solid #e0e0e0;
    border-radius: 10px;
    font-size: 0.95rem;
    transition: all 0.3s ease;
    background: white;
    color: #333;
}
.form-group input::placeholder {
    color: #999;
}
.form-group select {
    color: #333;
}
.form-group select option {
    background: white;
    color: #333;
}
.form-group input:focus,
.form-group select:focus {
    outline: none;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    border-color: #667eea;
    background: #f8f9ff;
}
.row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
}
.button-group {
    display: flex;
    gap: 15px;
    margin-top: 30px;
}
.btn {
    flex: 1;
    padding: 18px;
    border: none;
    border-radius: 15px;
    font-size: 1.1rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 1px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}
.btn:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
}
.btn:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
    opacity: 0.6;
}
.error-message {
    color: #ff6b6b;
    font-size: 0.8rem;
    margin-top: 5px;
    display: none;
}
.success-message {
    background: #d4edda;
    border: 1px solid #c3e6cb;
    color: #155724;
    padding: 15px;
    border-radius: 12px;
    margin-bottom: 20px;
    display: none;
    text-align: center;
    font-weight: 600;
}
.optional-note {
    font-size: 0.8rem;
    color: #666;
    font-style: italic;
    margin-top: 5px;
}
.mandatory-note {
    font-size: 0.8rem;
    color: #ff6b6b;
    font-style: italic;
    margin-top: 5px;
}
.either-or-note {
    font-size: 0.8rem;
    color: #007bff;
    font-style: italic;
    margin-top: 5px;
    font-weight: 600;
}
.step-indicator {
    text-align: center;
    margin-bottom: 20px;
    color: #666;
    font-size: 0.9rem;
}
@media (max-width: 768px) {
    .container {
        padding: 25px;
        margin: 10px;
    }
    .form-header h1 {
        font-size: 2rem;
    }
    .row {
        grid-template-columns: 1fr;
        gap: 10px;
    }
    .button-group {
        flex-direction: column;
    }
}
`;

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

  function handleSave() {
    if (validateAllFields()) {
      const saveData = {
        ...formData,
        savedAt: new Date().toLocaleString(),
      };
      try {
        if (typeof Storage !== "undefined" && localStorage) {
          localStorage.setItem("educationFormData", JSON.stringify(saveData));
        }
      } catch (e) {
        // ignore
      }
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
      setSaveButtonColor("#198754");
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setSuccessMessage("");
        setSaveButtonText("Save");
        setSaveButtonColor("linear-gradient(135deg, #667eea 0%, #764ba2 100%)");
      }, 4000);
    }
  }

  function handleNext() {
    if (!isFormValid) return;
    if (validateAllFields()) {
      const saveData = {
        ...formData,
        savedAt: new Date().toLocaleString(),
      };
      setSuccessMessage(
        `<strong>Education Information Saved Successfully! ✅</strong><br>
        <small>Proceeding to next step...</small>`
      );
      setTimeout(() => {
        navigate('/education2');
      }, 1500);
    }
  }

  function handleBack() {
    navigate('/education');
  }

  // On mount, validate in case pre-filled
  useEffect(() => {
    validateAllFields();
    // eslint-disable-next-line
  }, []);

  // Board options: both 10th and 12th are the same
  const boardOptions = [
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

  return (
    <div className="container">
      <div className="step-indicator">
        <p>Step 4 of 4 - Education Information</p>
      </div>
      <div className="form-header">
        <h1>Bandy & Moot</h1>
        <p>Education Information</p>
      </div>
      {successMessage && (
        <div
          className="success-message"
          id="successMessage"
          style={{ display: "block" }}
          dangerouslySetInnerHTML={{ __html: successMessage }}
        />
      )}
      <form id="educationForm" autoComplete="off" onSubmit={e => e.preventDefault()}>
        <div className="education-card">
          {/* 10th Section */}
          <div className="section-title">10th Class Information</div>
          <div className="mandatory-note">
            School name, board, and year are mandatory. Either grade OR percentage is required.
          </div>
          <div className="form-group">
            <label>
              10th School Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="tenthSchool"
              name="tenthSchool"
              required
              placeholder="Enter your 10th school name"
              minLength={2}
              value={formData.tenthSchool}
              onChange={handleInputChange}
              onBlur={handleBlur}
              style={{
                borderColor:
                  errors.tenthSchool && formTouched.tenthSchool
                    ? "#ff6b6b"
                    : formData.tenthSchool
                    ? "#28a745"
                    : undefined
              }}
            />
            <div
              className="error-message"
              id="tenthSchoolError"
              style={{
                display:
                  errors.tenthSchool && formTouched.tenthSchool
                    ? "block"
                    : "none"
              }}
            >
              {errors.tenthSchool}
            </div>
          </div>
          <div className="row">
            <div className="form-group">
              <label>
                10th Board <span className="required">*</span>
              </label>
              <select
                id="tenthBoard"
                name="tenthBoard"
                required
                value={formData.tenthBoard}
                onChange={handleInputChange}
                onBlur={handleBlur}
                style={{
                  borderColor:
                    errors.tenthBoard && formTouched.tenthBoard
                      ? "#ff6b6b"
                      : formData.tenthBoard
                      ? "#28a745"
                      : undefined
                }}
              >
                <option value="">Select Board</option>
                {boardOptions.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
              <div
                className="error-message"
                id="tenthBoardError"
                style={{
                  display:
                    errors.tenthBoard && formTouched.tenthBoard
                      ? "block"
                      : "none"
                }}
              >
                {errors.tenthBoard}
              </div>
            </div>
            <div className="form-group">
              <label>
                10th Year of Passing <span className="required">*</span>
              </label>
              <input
                type="number"
                id="tenthYear"
                name="tenthYear"
                required
                placeholder="Enter year"
                min={1990}
                max={2030}
                value={formData.tenthYear}
                onChange={handleInputChange}
                onBlur={handleBlur}
                style={{
                  borderColor:
                    errors.tenthYear && formTouched.tenthYear
                      ? "#ff6b6b"
                      : formData.tenthYear
                      ? "#28a745"
                      : undefined
                }}
              />
              <div
                className="error-message"
                id="tenthYearError"
                style={{
                  display:
                    errors.tenthYear && formTouched.tenthYear
                      ? "block"
                      : "none"
                }}
              >
                {errors.tenthYear}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="form-group">
              <label>10th Grade</label>
              <select
                id="tenthGrade"
                name="tenthGrade"
                value={formData.tenthGrade}
                onChange={handleInputChange}
                onBlur={handleBlur}
                style={{
                  borderColor:
                    errors.tenthGrade && formTouched.tenthGrade
                      ? "#ff6b6b"
                      : formData.tenthGrade
                      ? "#28a745"
                      : undefined
                }}
              >
                <option value="">Select Grade</option>
                {grades.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
              <div
                className="error-message"
                id="tenthGradeError"
                style={{
                  display:
                    errors.tenthGrade && formTouched.tenthGrade
                      ? "block"
                      : "none"
                }}
              >
                {errors.tenthGrade}
              </div>
            </div>
            <div className="form-group">
              <label>10th Percentage</label>
              <input
                type="number"
                id="tenthPercentage"
                name="tenthPercentage"
                placeholder="Enter percentage"
                min={0}
                max={100}
                step={0.01}
                value={formData.tenthPercentage}
                onChange={handleInputChange}
                onBlur={handleBlur}
                style={{
                  borderColor:
                    errors.tenthPercentage && formTouched.tenthPercentage
                      ? "#ff6b6b"
                      : formData.tenthPercentage
                      ? "#28a745"
                      : undefined
                }}
              />
              <div
                className="error-message"
                id="tenthPercentageError"
                style={{
                  display:
                    errors.tenthPercentage && formTouched.tenthPercentage
                      ? "block"
                      : "none"
                }}
              >
                {errors.tenthPercentage}
              </div>
            </div>
          </div>
          <div className="either-or-note">
            * Either Grade OR Percentage must be provided for 10th class
          </div>
          <div className="section-divider"></div>
          {/* 12th Section */}
          <div className="section-title">12th Class Information</div>
          <div className="optional-note">All fields in this section are optional</div>
          <div className="form-group">
            <label>12th College/School Name</label>
            <input
              type="text"
              id="twelfthCollege"
              name="twelfthCollege"
              placeholder="Enter college/school name"
              minLength={2}
              value={formData.twelfthCollege}
              onChange={handleInputChange}
              onBlur={handleBlur}
            />
            <div
              className="error-message"
              id="twelfthCollegeError"
              style={{
                display:
                  errors.twelfthCollege && formTouched.twelfthCollege
                    ? "block"
                    : "none"
              }}
            >
              {errors.twelfthCollege}
            </div>
          </div>
          <div className="row">
            <div className="form-group">
              <label>12th Board</label>
              <select
                id="twelfthBoard"
                name="twelfthBoard"
                value={formData.twelfthBoard}
                onChange={handleInputChange}
                onBlur={handleBlur}
              >
                <option value="">Select Board</option>
                {boardOptions.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
              <div
                className="error-message"
                id="twelfthBoardError"
                style={{
                  display:
                    errors.twelfthBoard && formTouched.twelfthBoard
                      ? "block"
                      : "none"
                }}
              >
                {errors.twelfthBoard}
              </div>
            </div>
            <div className="form-group">
              <label>12th Year of Passing</label>
              <input
                type="number"
                id="twelfthYear"
                name="twelfthYear"
                placeholder="Enter year"
                min={1990}
                max={2030}
                value={formData.twelfthYear}
                onChange={handleInputChange}
                onBlur={handleBlur}
                style={{
                  borderColor:
                    errors.twelfthYear && formTouched.twelfthYear
                      ? "#ff6b6b"
                      : formData.twelfthYear
                      ? "#28a745"
                      : undefined
                }}
              />
              <div
                className="error-message"
                id="twelfthYearError"
                style={{
                  display:
                    errors.twelfthYear && formTouched.twelfthYear
                      ? "block"
                      : "none"
                }}
              >
                {errors.twelfthYear}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="form-group">
              <label>12th Grade</label>
              <select
                id="twelfthGrade"
                name="twelfthGrade"
                value={formData.twelfthGrade}
                onChange={handleInputChange}
                onBlur={handleBlur}
                style={{
                  borderColor:
                    errors.twelfthGrade && formTouched.twelfthGrade
                      ? "#ff6b6b"
                      : formData.twelfthGrade
                      ? "#28a745"
                      : undefined
                }}
              >
                <option value="">Select Grade</option>
                {grades.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
              <div
                className="error-message"
                id="twelfthGradeError"
                style={{
                  display:
                    errors.twelfthGrade && formTouched.twelfthGrade
                      ? "block"
                      : "none"
                }}
              >
                {errors.twelfthGrade}
              </div>
            </div>
            <div className="form-group">
              <label>12th Percentage</label>
              <input
                type="number"
                id="twelfthPercentage"
                name="twelfthPercentage"
                placeholder="Enter percentage"
                min={0}
                max={100}
                step={0.01}
                value={formData.twelfthPercentage}
                onChange={handleInputChange}
                onBlur={handleBlur}
                style={{
                  borderColor:
                    errors.twelfthPercentage && formTouched.twelfthPercentage
                      ? "#ff6b6b"
                      : formData.twelfthPercentage
                      ? "#28a745"
                      : undefined
                }}
              />
              <div
                className="error-message"
                id="twelfthPercentageError"
                style={{
                  display:
                    errors.twelfthPercentage && formTouched.twelfthPercentage
                      ? "block"
                      : "none"
                }}
              >
                {errors.twelfthPercentage}
              </div>
            </div>
          </div>
        </div>
        <div className="button-group">
          <button
            type="button"
            id="backButton"
            className="btn"
            onClick={handleBack}
          >
            Back
          </button>
          <button
            type="button"
            id="saveButton"
            className="btn"
            style={{
              background: saveButtonColor,
            }}
            onClick={handleSave}
          >
            {saveButtonText}
          </button>
          <button
            type="button"
            id="nextButton"
            className="btn"
            disabled={!isFormValid}
            onClick={handleNext}
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default EducationForm;