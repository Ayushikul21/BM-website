import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const PersonalDetailsForm = () => {
  const [formTouched, setFormTouched] = useState({});
  const [showMarriageDate, setShowMarriageDate] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [saveButtonText, setSaveButtonText] = useState("Save");
  const [saveButtonColor, setSaveButtonColor] = useState("#28a745");
  const timeoutRef = useRef();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState(initialErrors);

  // Style tag for CSS-in-JS
  useEffect(() => {
    let styleTag = document.getElementById("personal-details-form-styles");
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = "personal-details-form-styles";
      styleTag.innerHTML = styles;
      document.head.appendChild(styleTag);
    }
  }, []);

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
        `<strong>Personal Details Saved Successfully! ✅</strong><br>
        <small>Saved at: ${saveData.savedAt}</small><br>
        <small>Status: ${saveData.maritalStatus} | Blood Group: ${saveData.bloodGroup}</small>`
      );
      setSaveButtonText("Saved ✓");
      setSaveButtonColor("#198754");
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setSuccessMessage("");
        setSaveButtonText("Save");
        setSaveButtonColor("#28a745");
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
    max-width: 500px;
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
.form-group {
    margin-bottom: 25px;
    position: relative;
}
.form-group label {
    display: block;
    color: #333;
    font-weight: 600;
    margin-bottom: 8px;
    font-size: 0.95rem;
}
.form-group label .required {
    color: #dc3545;
    margin-left: 3px;
}
.form-group input,
.form-group select,
.form-group textarea {
    width: 100%;
    padding: 15px 20px;
    border: 2px solid #e1e5e9;
    border-radius: 12px;
    font-size: 1rem;
    transition: all 0.3s ease;
    background: #f8f9fa;
    font-family: inherit;
}
.form-group textarea {
    resize: vertical;
    min-height: 80px;
}
.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    outline: none;
    border-color: #667eea;
    background: white;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    transform: translateY(-2px);
}
.form-group input:valid {
    border-color: #28a745;
}
.form-group input:invalid:not(:placeholder-shown) {
    border-color: #dc3545;
}
.radio-group {
    display: flex;
    gap: 20px;
    margin-top: 8px;
}
.radio-option {
    display: flex;
    align-items: center;
    gap: 8px;
}
.radio-option input[type="radio"] {
    width: auto;
    margin: 0;
    padding: 0;
    transform: scale(1.2);
}
.radio-option label {
    margin: 0;
    font-weight: 500;
    cursor: pointer;
}
.date-field {
    display: none;
    margin-top: 15px;
    animation: fadeIn 0.3s ease-in;
}
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px);}
    to { opacity: 1; transform: translateY(0);}
}
.button-row {
    display: flex;
    gap: 15px;
    margin-top: 20px;
}
.next-button, .back-button, .save-button {
    flex: 1;
    padding: 15px;
    border: none;
    border-radius: 12px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    display: inline-block;
    text-align: center;
}
.next-button {
    background: #667eea;
    color: white;
}
.back-button {
    background: #6c757d;
    color: white;
}
.save-button {
    background: #28a745;
    color: white;
    width: 100%;
    margin-top: 15px;
}
.next-button:hover:not(:disabled) {
    background: #5a6fd8;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
}
.back-button:hover {
    background: #5a6268;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(108, 117, 125, 0.3);
}
.save-button:hover {
    background: #218838;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(40, 167, 69, 0.3);
}
.next-button:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
    opacity: 0.6;
}
.login-link {
    text-align: center;
    margin-top: 25px;
    padding-top: 25px;
    border-top: 1px solid #e1e5e9;
}
.login-link a {
    color: #667eea;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.3s ease;
}
.login-link a:hover {
    color: #764ba2;
    text-decoration: underline;
}
.error-message {
    color: #dc3545;
    font-size: 0.85rem;
    margin-top: 5px;
    display: none;
}
.success-message {
    background: #d4edda;
    border: 1px solid #c3e6cb;
    color: #155724;
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 20px;
    display: none;
}
.step-indicator {
    text-align: center;
    margin-bottom: 20px;
    color: #666;
    font-size: 0.9rem;
}
@media (max-width: 480px) {
    .container {
        padding: 25px;
        margin: 10px;
    }
    .form-header h1 {
        font-size: 2rem;
    }
    .radio-group {
        flex-direction: column;
        gap: 10px;
    }
    .button-row {
        flex-direction: column;
    }
    .next-button, .back-button {
        flex: none;
    }
}
`;

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

  return (
    <div className="container">
      <div className="step-indicator">
        <p>Step 3 of 4 - Personal Details</p>
      </div>
      <div className="form-header">
        <h1>Bandy & Moot</h1>
        <p>Complete your registration</p>
      </div>
      {successMessage && (
        <div
          className="success-message"
          id="successMessage"
          style={{ display: "block" }}
          dangerouslySetInnerHTML={{ __html: successMessage }}
        />
      )}
      <form id="registrationForm2" autoComplete="off" onSubmit={e => e.preventDefault()}>
        <div className="form-group">
          <label>
            Marital Status <span className="required">*</span>
          </label>
          <div className="radio-group">
            <div className="radio-option">
              <input
                type="radio"
                id="single"
                name="maritalStatus"
                value="single"
                checked={formData.maritalStatus === "single"}
                onChange={handleInputChange}
                required
              />
              <label htmlFor="single">Single</label>
            </div>
            <div className="radio-option">
              <input
                type="radio"
                id="married"
                name="maritalStatus"
                value="married"
                checked={formData.maritalStatus === "married"}
                onChange={handleInputChange}
                required
              />
              <label htmlFor="married">Married</label>
            </div>
          </div>
          <div
            className="error-message"
            id="maritalStatusError"
            style={{
              display:
                errors.maritalStatus && formTouched.maritalStatus
                  ? "block"
                  : "none"
            }}
          >
            {errors.maritalStatus}
          </div>

          <div
            className="date-field"
            id="marriageDateField"
            style={{
              display: showMarriageDate ? "block" : "none"
            }}
          >
            <label htmlFor="marriageDate">
              Date of Marriage <span className="required">*</span>
            </label>
            <input
              type="date"
              id="marriageDate"
              name="marriageDate"
              placeholder="Select marriage date"
              value={formData.marriageDate}
              onChange={handleInputChange}
              onBlur={handleBlur}
              required={showMarriageDate}
              max={maxDateToday}
              style={{
                borderColor:
                  errors.marriageDate && formTouched.marriageDate
                    ? "#dc3545"
                    : formData.marriageDate
                    ? "#28a745"
                    : undefined
              }}
            />
            <div
              className="error-message"
              id="marriageDateError"
              style={{
                display:
                  errors.marriageDate && formTouched.marriageDate
                    ? "block"
                    : "none"
              }}
            >
              {errors.marriageDate}
            </div>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="bloodGroup">
            Blood Group <span className="required">*</span>
          </label>
          <select
            id="bloodGroup"
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleInputChange}
            onBlur={handleBlur}
            required
            style={{
              borderColor:
                errors.bloodGroup && formTouched.bloodGroup
                  ? "#dc3545"
                  : formData.bloodGroup
                  ? "#28a745"
                  : undefined
            }}
          >
            <option value="">Select your blood group</option>
            {bloodGroups.map((bg) => (
              <option key={bg} value={bg}>
                {bg}
              </option>
            ))}
          </select>
          <div
            className="error-message"
            id="bloodGroupError"
            style={{
              display:
                errors.bloodGroup && formTouched.bloodGroup
                  ? "block"
                  : "none"
            }}
          >
            {errors.bloodGroup}
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="nationality">
            Nationality <span className="required">*</span>
          </label>
          <select
            id="nationality"
            name="nationality"
            value={formData.nationality}
            onChange={handleInputChange}
            onBlur={handleBlur}
            required
            style={{
              borderColor:
                errors.nationality && formTouched.nationality
                  ? "#dc3545"
                  : formData.nationality
                  ? "#28a745"
                  : undefined
            }}
          >
            <option value="">Select your nationality</option>
            {nationalities.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <div
            className="error-message"
            id="nationalityError"
            style={{
              display:
                errors.nationality && formTouched.nationality
                  ? "block"
                  : "none"
            }}
          >
            {errors.nationality}
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="permanentAddress">
            Permanent Address <span className="required">*</span>
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
            style={{
              borderColor:
                errors.permanentAddress && formTouched.permanentAddress
                  ? "#dc3545"
                  : formData.permanentAddress
                  ? "#28a745"
                  : undefined
            }}
          />
          <div
            className="error-message"
            id="permanentAddressError"
            style={{
              display:
                errors.permanentAddress && formTouched.permanentAddress
                  ? "block"
                  : "none"
            }}
          >
            {errors.permanentAddress}
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="currentAddress">
            Current Address <span className="required">*</span>
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
            style={{
              borderColor:
                errors.currentAddress && formTouched.currentAddress
                  ? "#dc3545"
                  : formData.currentAddress
                  ? "#28a745"
                  : undefined
            }}
          />
          <div
            className="error-message"
            id="currentAddressError"
            style={{
              display:
                errors.currentAddress && formTouched.currentAddress
                  ? "block"
                  : "none"
            }}
          >
            {errors.currentAddress}
          </div>
        </div>
        <div className="button-row">
          <button
            type="button"
            id="backButton"
            className="back-button"
            onClick={handleBack}
          >
            Back
          </button>
          <button
            type="button"
            id="nextButton"
            className="next-button"
            disabled={!isFormValid}
            onClick={handleNext}
            style={{
              background: isFormValid ? "#667eea" : "#ccc",
              cursor: isFormValid ? "pointer" : "not-allowed"
            }}
          >
            Next
          </button>
        </div>
        <button
          type="button"
          id="saveButton"
          className="save-button"
          onClick={handleSave}
          style={{
            background: saveButtonColor,
            marginTop: 15
          }}
        >
          {saveButtonText}
        </button>
      </form>
    </div>
  );
};

export default PersonalDetailsForm;