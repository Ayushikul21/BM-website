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
  const [saveButtonColor, setSaveButtonColor] = useState(
    "linear-gradient(135deg, #28a745 0%, #20c997 100%)"
  );
  const timeoutRef = useRef();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState(initialErrors);

const styles = `
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px;
}
.container {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 40px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 600px;
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
.form-header p { color: #666; font-size: 1.1rem; }
.employment-card {
    padding: 30px;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    background: white;
    color: #333;
    border: 2px solid #e1e5e9;
    margin-bottom: 30px;
}
.employment-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}
.card-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 25px;
    text-align: center;
    padding-bottom: 15px;
    border-bottom: 2px solid #e1e5e9;
    color: #333;
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
.form-group label .required { color: #ff4757; margin-left: 3px; }
.form-group input,
.form-group select,
.form-group textarea {
    width: 100%;
    padding: 12px 15px;
    border: 2px solid #e1e5e9;
    border-radius: 10px;
    font-size: 0.95rem;
    transition: all 0.3s ease;
    background: #f8f9fa;
    color: #333;
    font-family: inherit;
}
.form-group textarea {
    resize: vertical;
    min-height: 100px;
}
.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    outline: none;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    border-color: #667eea;
    background: white;
}
.form-group input:valid {
    border-color: #28a745;
}
.form-group input:invalid:not(:placeholder-shown) {
    border-color: #dc3545;
}
.row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
}
.button-container {
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
}
.btn-back {
    background: #6c757d;
    color: white;
}
.btn-back:hover:not(:disabled) {
    background: #5a6268;
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(108, 117, 125, 0.4);
}
.btn-save {
    background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
    color: white;
}
.btn-save:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(40, 167, 69, 0.4);
}
.btn-next {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}
.btn-next:hover:not(:disabled) {
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
    color: #ff4757;
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
    animation: slideDown 0.5s ease-out;
}
@keyframes slideDown {
    from { opacity: 0; transform: translateY(-20px);}
    to { opacity: 1; transform: translateY(0);}
}
@media (max-width: 768px) {
    .container { padding: 25px; margin: 10px; max-width: 95%; }
    .form-header h1 { font-size: 2rem; }
    .row { grid-template-columns: 1fr; gap: 10px; }
    .button-container { flex-direction: column; gap: 10px; }
    .btn { font-size: 1rem; padding: 15px; }
}
`;

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

  // Inject styles
  useEffect(() => {
    let styleTag = document.getElementById("employment-form-styles");
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = "employment-form-styles";
      styleTag.innerHTML = styles;
      document.head.appendChild(styleTag);
    }
  }, []);

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

  function collectFormData() {
    return { ...formData };
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

  function handleSave() {
    if (validateAllFields()) {
      const saveData = {
        ...formData,
        savedAt: new Date().toLocaleString()
      };
      try {
        if (typeof Storage !== "undefined" && localStorage) {
          localStorage.setItem("employmentFormData", JSON.stringify(saveData));
        }
      } catch (e) {}
      setSuccessMessage(
        `<strong>Employment Details Saved Successfully! ✅</strong><br>
        <small>Saved at: ${saveData.savedAt}</small><br>
        <small>Company: ${saveData.companyName} | Position: ${saveData.position}</small>`
      );
      setSaveButtonText("Saved ✓");
      setSaveButtonColor("#198754");
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setSuccessMessage("");
        setSaveButtonText("Save");
        setSaveButtonColor(
          "linear-gradient(135deg, #28a745 0%, #20c997 100%)"
        );
      }, 4000);
    }
  }

  function handleNext() {
    // Always save before navigation
    const saveData = {
      ...formData,
      savedAt: new Date().toLocaleString()
    };
    try {
      if (typeof Storage !== "undefined" && localStorage) {
        localStorage.setItem("employmentFormData", JSON.stringify(saveData));
      }
    } catch (e) {}
    navigate('/skills');
  }

  function handleBack() {
    navigate('/education45');
  }

  return (
    <div className="container">
      <div className="form-header">
        <h1>Bandy & Moot</h1>
        <p>Previous Employment Information</p>
      </div>
      {successMessage && (
        <div
          className="success-message"
          id="successMessage"
          style={{ display: "block" }}
          dangerouslySetInnerHTML={{ __html: successMessage }}
        />
      )}
      <form id="employmentForm" autoComplete="off" onSubmit={e => e.preventDefault()}>
        <div className="employment-card">
          <h2 className="card-title">Company & Position Details</h2>
          <div className="form-group">
            <label>Company Name</label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              placeholder="Enter company name"
              minLength={2}
              value={formData.companyName}
              onChange={handleInputChange}
              onBlur={handleBlur}
              style={{
                borderColor:
                  errors.companyName && formTouched.companyName
                    ? "#dc3545"
                    : formData.companyName
                    ? "#28a745"
                    : undefined
              }}
            />
            <div
              className="error-message"
              id="companyNameError"
              style={{
                display:
                  errors.companyName && formTouched.companyName
                    ? "block"
                    : "none"
              }}
            >
              {errors.companyName}
            </div>
          </div>
          <div className="form-group">
            <label>Position/Job Title</label>
            <input
              type="text"
              id="position"
              name="position"
              placeholder="Enter your position"
              minLength={2}
              value={formData.position}
              onChange={handleInputChange}
              onBlur={handleBlur}
              style={{
                borderColor:
                  errors.position && formTouched.position
                    ? "#dc3545"
                    : formData.position
                    ? "#28a745"
                    : undefined
              }}
            />
            <div
              className="error-message"
              id="positionError"
              style={{
                display:
                  errors.position && formTouched.position
                    ? "block"
                    : "none"
              }}
            >
              {errors.position}
            </div>
          </div>
          <div className="form-group">
            <label>Team Lead/Manager Name</label>
            <input
              type="text"
              id="teamLead"
              name="teamLead"
              placeholder="Enter team lead/manager name"
              minLength={2}
              value={formData.teamLead}
              onChange={handleInputChange}
              onBlur={handleBlur}
              style={{
                borderColor:
                  errors.teamLead && formTouched.teamLead
                    ? "#dc3545"
                    : formData.teamLead
                    ? "#28a745"
                    : undefined
              }}
            />
            <div
              className="error-message"
              id="teamLeadError"
              style={{
                display:
                  errors.teamLead && formTouched.teamLead
                    ? "block"
                    : "none"
              }}
            >
              {errors.teamLead}
            </div>
          </div>
          <div className="form-group">
            <label>Annual Salary</label>
            <input
              type="number"
              id="salaryAnnum"
              name="salaryAnnum"
              placeholder="Enter annual salary"
              min={0}
              step={1000}
              value={formData.salaryAnnum}
              onChange={handleInputChange}
              onBlur={handleBlur}
              style={{
                borderColor:
                  errors.salaryAnnum && formTouched.salaryAnnum
                    ? "#dc3545"
                    : formData.salaryAnnum
                    ? "#28a745"
                    : undefined
              }}
            />
            <div
              className="error-message"
              id="salaryAnnumError"
              style={{
                display:
                  errors.salaryAnnum && formTouched.salaryAnnum
                    ? "block"
                    : "none"
              }}
            >
              {errors.salaryAnnum}
            </div>
          </div>
          <div className="row">
            <div className="form-group">
              <label>Starting Date</label>
              <input
                type="date"
                id="startingDate"
                name="startingDate"
                value={formData.startingDate}
                onChange={handleInputChange}
                onBlur={handleBlur}
                style={{
                  borderColor:
                    errors.startingDate && formTouched.startingDate
                      ? "#dc3545"
                      : formData.startingDate
                      ? "#28a745"
                      : undefined
                }}
              />
              <div
                className="error-message"
                id="startingDateError"
                style={{
                  display:
                    errors.startingDate && formTouched.startingDate
                      ? "block"
                      : "none"
                }}
              >
                {errors.startingDate}
              </div>
            </div>
            <div className="form-group">
              <label>Ending Date</label>
              <input
                type="date"
                id="endingDate"
                name="endingDate"
                value={formData.endingDate}
                onChange={handleInputChange}
                onBlur={handleBlur}
                style={{
                  borderColor:
                    errors.endingDate && formTouched.endingDate
                      ? "#dc3545"
                      : formData.endingDate
                      ? "#28a745"
                      : undefined
                }}
              />
              <div
                className="error-message"
                id="endingDateError"
                style={{
                  display:
                    errors.endingDate && formTouched.endingDate
                      ? "block"
                      : "none"
                }}
              >
                {errors.endingDate}
              </div>
            </div>
          </div>
          <div className="form-group">
            <label>Work Experience (in months)</label>
            <input
              type="number"
              id="experienceMonths"
              name="experienceMonths"
              placeholder="Total experience in months"
              min={1}
              max={600}
              value={formData.experienceMonths}
              onChange={handleInputChange}
              onBlur={handleBlur}
              style={{
                borderColor:
                  errors.experienceMonths && formTouched.experienceMonths
                    ? "#dc3545"
                    : formData.experienceMonths
                    ? "#28a745"
                    : undefined
              }}
            />
            <div
              className="error-message"
              id="experienceMonthsError"
              style={{
                display:
                  errors.experienceMonths && formTouched.experienceMonths
                    ? "block"
                    : "none"
              }}
            >
              {errors.experienceMonths}
            </div>
          </div>
          <div className="form-group">
            <label>Reason for Leaving</label>
            <select
              id="reasonLeaving"
              name="reasonLeaving"
              value={formData.reasonLeaving}
              onChange={handleInputChange}
              onBlur={handleBlur}
              style={{
                borderColor:
                  errors.reasonLeaving && formTouched.reasonLeaving
                    ? "#dc3545"
                    : formData.reasonLeaving
                    ? "#28a745"
                    : undefined
              }}
            >
              <option value="">Select Reason</option>
              {reasonLeavingOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <div
              className="error-message"
              id="reasonLeavingError"
              style={{
                display:
                  errors.reasonLeaving && formTouched.reasonLeaving
                    ? "block"
                    : "none"
              }}
            >
              {errors.reasonLeaving}
            </div>
          </div>
        </div>
        <div className="button-container">
          <button
            type="button"
            id="backButton"
            className="btn btn-back"
            onClick={handleBack}
          >
            Back
          </button>
          <button
            type="button"
            id="saveButton"
            className="btn btn-save"
            onClick={handleSave}
            style={{ background: saveButtonColor }}
          >
            {saveButtonText}
          </button>
          <button
            type="button"
            id="nextButton"
            className="btn btn-next"
            onClick={handleNext}
          >
            skip
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmploymentForm;