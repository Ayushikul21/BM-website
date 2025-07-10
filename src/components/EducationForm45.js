import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const initialState = {
  diplomaCollege: "",
  diplomaCourse: "",
  diplomaDuration: "",
  diplomaYear: "",
  diplomaGrade: "",
  graduationCollege: "",
  graduationCourse: "",
  graduationSpecialization: "",
  graduationDuration: "",
  graduationYear: "",
  graduationGrade: "",
  hasBacklogs: "",
  backlogCount: "",
  backlogStatus: "",
  backlogDetails: ""
};
const initialErrors = Object.fromEntries(
  Object.keys(initialState).map((k) => [k, ""])
);

const EducationForm45 = () => {
  const [formTouched, setFormTouched] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [saveButtonText, setSaveButtonText] = useState("Save Data");
  const [saveButtonColor, setSaveButtonColor] = useState(
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
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
    max-width: 800px;
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
.form-group label .required { color: #ff6b6b; margin-left: 3px; }
.form-group input,
.form-group select,
.form-group textarea {
    width: 100%;
    padding: 12px 15px;
    border: 2px solid #e0e0e0;
    border-radius: 10px;
    font-size: 0.95rem;
    transition: all 0.3s ease;
    background: white;
    color: #333;
}
.form-group textarea { resize: vertical; min-height: 80px; }
.form-group input::placeholder,
.form-group textarea::placeholder { color: #999; }
.form-group select { color: #333; }
.form-group select option { background: white; color: #333; }
.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
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
.row-three {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 15px;
}
.backlog-section {
    background: #f8f9ff;
    padding: 20px;
    border-radius: 12px;
    border: 2px solid #e0e6ff;
    margin-top: 20px;
}
.backlog-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #667eea;
    margin-bottom: 15px;
}
.radio-group {
    display: flex;
    gap: 20px;
    margin-bottom: 15px;
}
.radio-option {
    display: flex;
    align-items: center;
    gap: 8px;
}
.radio-option input[type="radio"] {
    width: auto;
    margin: 0;
}
.radio-option label { margin: 0; font-weight: 500; }
.backlog-count { display: none; }
.backlog-count.show { display: block; }
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
    background: linear-gradient(135deg, #2ed573 0%, #1e90ff 100%);
    color: white;
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
@media (max-width: 768px) {
    .container { padding: 25px; margin: 10px; }
    .form-header h1 { font-size: 2rem; }
    .row, .row-three { grid-template-columns: 1fr; gap: 10px; }
    .button-group { flex-direction: column; }
    .radio-group { flex-direction: column; gap: 10px; }
}
`;

const gradCourses = [
  "B.Tech",
  "B.E",
  "BCA",
  "B.Sc",
  "B.Com",
  "BBA",
  "BA",
  "Other"
];

function validateField(fieldId, value, formData) {
  switch (fieldId) {
    case "graduationCollege":
      return value && value.trim().length >= 2;
    case "graduationCourse":
    case "graduationSpecialization":
    case "graduationDuration":
    case "graduationGrade":
      return value && value.trim() !== "";
    case "graduationYear":
      if (!value) return false;
      const year = parseInt(value, 10);
      return year >= 1990 && year <= 2030;
    case "hasBacklogs":
      return value === "yes" || value === "no";
    case "backlogCount":
      if (formData.hasBacklogs !== "yes") return true;
      const count = parseInt(value, 10);
      return !isNaN(count) && count >= 1 && count <= 50;
    default:
      return true;
  }
}

function getErrorMessage(fieldId, value, formData) {
  switch (fieldId) {
    case "graduationCollege":
      return "College name is required (minimum 2 characters)";
    case "graduationCourse":
      return "Please select graduation course";
    case "graduationSpecialization":
      return "Specialization/Branch is required";
    case "graduationDuration":
      return "Please select graduation duration";
    case "graduationYear":
      return "Please enter a valid year (1990-2030)";
    case "graduationGrade":
      return "Percentage/CGPA is required";
    case "hasBacklogs":
      return "Please select if you have backlogs";
    case "backlogCount":
      return "Please enter number of backlogs (1-50)";
    default:
      return "";
  }
}

  useEffect(() => {
    let styleTag = document.getElementById("education-form45-styles");
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = "education-form45-styles";
      styleTag.innerHTML = styles;
      document.head.appendChild(styleTag);
    }
  }, []);

  // Load from localStorage if available
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

  useEffect(() => {
    validateAllFields(); // validate & set isFormValid
    // eslint-disable-next-line
  }, [formData]);

  function handleInputChange(e) {
    const { name, value, type } = e.target;
    let v = value;
    if (type === "radio") {
      setFormData((prev) => ({
        ...prev,
        [name]: v
      }));
      setFormTouched((prev) => ({
        ...prev,
        [name]: true
      }));
      // Clear backlog fields if switching to "no"
      if (name === "hasBacklogs" && v === "no") {
        setFormData((prev) => ({
          ...prev,
          backlogCount: "",
          backlogStatus: "",
          backlogDetails: ""
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: v
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
    if (!validateField(name, value, formData)) {
      setErrors((prev) => ({
        ...prev,
        [name]: getErrorMessage(name, value, formData)
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
    // Graduation required
    [
      "graduationCollege",
      "graduationCourse",
      "graduationSpecialization",
      "graduationDuration",
      "graduationYear",
      "graduationGrade",
      "hasBacklogs"
    ].forEach((fieldId) => {
      if (!validateField(fieldId, formData[fieldId], formData)) {
        newErrors[fieldId] = getErrorMessage(fieldId, formData[fieldId], formData);
        isValid = false;
      } else {
        newErrors[fieldId] = "";
      }
    });
    // If hasBacklogs is yes, check backlogCount
    if (formData.hasBacklogs === "yes") {
      if (!validateField("backlogCount", formData.backlogCount, formData)) {
        newErrors.backlogCount = getErrorMessage("backlogCount", formData.backlogCount, formData);
        isValid = false;
      } else {
        newErrors.backlogCount = "";
      }
    }
    setErrors(newErrors);
    setIsFormValid(isValid);
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
          localStorage.setItem("educationFormData", JSON.stringify(saveData));
        }
      } catch (e) {}
      setSuccessMessage(
        `<strong>Education Details Saved Successfully! ✅</strong><br>
        <small>Saved at: ${saveData.savedAt}</small><br>
        <small>Course: ${saveData.graduationCourse} | Year: ${saveData.graduationYear}</small>`
      );
      setSaveButtonText("Saved ✓");
      setSaveButtonColor("#198754");
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setSuccessMessage("");
        setSaveButtonText("Save Data");
        setSaveButtonColor(
          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        );
      }, 4000);
    }
  }

  function handleNext() {
    if (!isFormValid) return;
    if (validateAllFields()) {
      const saveData = {
        ...formData,
        savedAt: new Date().toLocaleString()
      };
      // Save before navigation
      try {
        if (typeof Storage !== "undefined" && localStorage) {
          localStorage.setItem("educationFormData", JSON.stringify(saveData));
        }
      } catch (e) {}
      setSuccessMessage(
        `<strong>Education Details Saved Successfully! ✅</strong><br>
        <small>Proceeding to next step...</small>`
      );
      setTimeout(() => {
        navigate('/employment');
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

  return (
    <div className="container">
      <div className="form-header">
        <h1>Bandy & Moot</h1>
        <p>Higher Education Information</p>
      </div>
      {successMessage && (
        <div
          className="success-message"
          id="successMessage"
          style={{ display: "block" }}
          dangerouslySetInnerHTML={{ __html: successMessage }}
        />
      )}
      <form
        id="educationForm"
        autoComplete="off"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="education-card">
          {/* Diploma Section */}
          <div className="section-title">Diploma Information</div>
          <div className="optional-note">All fields in this section are optional</div>
          <div className="form-group">
            <label>Diploma College/Institute Name</label>
            <input
              type="text"
              id="diplomaCollege"
              name="diplomaCollege"
              placeholder="Enter diploma college/institute name"
              minLength={2}
              value={formData.diplomaCollege}
              onChange={handleInputChange}
              onBlur={handleBlur}
            />
            <div
              className="error-message"
              id="diplomaCollegeError"
              style={{
                display:
                  errors.diplomaCollege && formTouched.diplomaCollege
                    ? "block"
                    : "none"
              }}
            >
              {errors.diplomaCollege}
            </div>
          </div>
          <div className="form-group">
            <label>Diploma Course/Branch</label>
            <input
              type="text"
              id="diplomaCourse"
              name="diplomaCourse"
              placeholder="e.g., Mechanical Engineering, Computer Science, etc."
              minLength={2}
              value={formData.diplomaCourse}
              onChange={handleInputChange}
              onBlur={handleBlur}
            />
            <div
              className="error-message"
              id="diplomaCourseError"
              style={{
                display:
                  errors.diplomaCourse && formTouched.diplomaCourse
                    ? "block"
                    : "none"
              }}
            >
              {errors.diplomaCourse}
            </div>
          </div>
          <div className="row-three">
            <div className="form-group">
              <label>Diploma Duration</label>
              <select
                id="diplomaDuration"
                name="diplomaDuration"
                value={formData.diplomaDuration}
                onChange={handleInputChange}
                onBlur={handleBlur}
              >
                <option value="">Select Duration</option>
                <option value="2 Years">2 Years</option>
                <option value="3 Years">3 Years</option>
              </select>
              <div
                className="error-message"
                id="diplomaDurationError"
                style={{
                  display:
                    errors.diplomaDuration && formTouched.diplomaDuration
                      ? "block"
                      : "none"
                }}
              >
                {errors.diplomaDuration}
              </div>
            </div>
            <div className="form-group">
              <label>Diploma Year of Passing</label>
              <input
                type="number"
                id="diplomaYear"
                name="diplomaYear"
                placeholder="Enter year"
                min={1990}
                max={2030}
                value={formData.diplomaYear}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />
              <div
                className="error-message"
                id="diplomaYearError"
                style={{
                  display:
                    errors.diplomaYear && formTouched.diplomaYear
                      ? "block"
                      : "none"
                }}
              >
                {errors.diplomaYear}
              </div>
            </div>
            <div className="form-group">
              <label>Diploma Percentage/CGPA</label>
              <input
                type="text"
                id="diplomaGrade"
                name="diplomaGrade"
                placeholder="e.g., 85% or 8.5 CGPA"
                value={formData.diplomaGrade}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />
              <div
                className="error-message"
                id="diplomaGradeError"
                style={{
                  display:
                    errors.diplomaGrade && formTouched.diplomaGrade
                      ? "block"
                      : "none"
                }}
              >
                {errors.diplomaGrade}
              </div>
            </div>
          </div>
          <div className="section-divider"></div>
          {/* Graduation Section */}
          <div className="section-title">Graduation Information</div>
          <div className="mandatory-note">
            All fields in this section are mandatory
          </div>
          <div className="form-group">
            <label>
              Graduation College/University Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="graduationCollege"
              name="graduationCollege"
              required
              placeholder="Enter graduation college/university name"
              minLength={2}
              value={formData.graduationCollege}
              onChange={handleInputChange}
              onBlur={handleBlur}
              style={{
                borderColor:
                  errors.graduationCollege && formTouched.graduationCollege
                    ? "#ff6b6b"
                    : formData.graduationCollege
                    ? "#28a745"
                    : undefined
              }}
            />
            <div
              className="error-message"
              id="graduationCollegeError"
              style={{
                display:
                  errors.graduationCollege && formTouched.graduationCollege
                    ? "block"
                    : "none"
              }}
            >
              {errors.graduationCollege}
            </div>
          </div>
          <div className="row">
            <div className="form-group">
              <label>
                Graduation Course/Degree <span className="required">*</span>
              </label>
              <select
                id="graduationCourse"
                name="graduationCourse"
                required
                value={formData.graduationCourse}
                onChange={handleInputChange}
                onBlur={handleBlur}
                style={{
                  borderColor:
                    errors.graduationCourse && formTouched.graduationCourse
                      ? "#ff6b6b"
                      : formData.graduationCourse
                      ? "#28a745"
                      : undefined
                }}
              >
                <option value="">Select Course</option>
                {gradCourses.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <div
                className="error-message"
                id="graduationCourseError"
                style={{
                  display:
                    errors.graduationCourse && formTouched.graduationCourse
                      ? "block"
                      : "none"
                }}
              >
                {errors.graduationCourse}
              </div>
            </div>
            <div className="form-group">
              <label>
                Specialization/Branch <span className="required">*</span>
              </label>
              <input
                type="text"
                id="graduationSpecialization"
                name="graduationSpecialization"
                required
                placeholder="Enter specialization/branch"
                value={formData.graduationSpecialization}
                onChange={handleInputChange}
                onBlur={handleBlur}
                style={{
                  borderColor:
                    errors.graduationSpecialization &&
                    formTouched.graduationSpecialization
                      ? "#ff6b6b"
                      : formData.graduationSpecialization
                      ? "#28a745"
                      : undefined
                }}
              />
              <div
                className="error-message"
                id="graduationSpecializationError"
                style={{
                  display:
                    errors.graduationSpecialization &&
                    formTouched.graduationSpecialization
                      ? "block"
                      : "none"
                }}
              >
                {errors.graduationSpecialization}
              </div>
            </div>
          </div>
          <div className="row-three">
            <div className="form-group">
              <label>
                Graduation Duration <span className="required">*</span>
              </label>
              <select
                id="graduationDuration"
                name="graduationDuration"
                required
                value={formData.graduationDuration}
                onChange={handleInputChange}
                onBlur={handleBlur}
                style={{
                  borderColor:
                    errors.graduationDuration && formTouched.graduationDuration
                      ? "#ff6b6b"
                      : formData.graduationDuration
                      ? "#28a745"
                      : undefined
                }}
              >
                <option value="">Select Duration</option>
                <option value="3 Years">3 Years</option>
                <option value="4 Years">4 Years</option>
                <option value="5 Years">5 Years</option>
              </select>
              <div
                className="error-message"
                id="graduationDurationError"
                style={{
                  display:
                    errors.graduationDuration && formTouched.graduationDuration
                      ? "block"
                      : "none"
                }}
              >
                {errors.graduationDuration}
              </div>
            </div>
            <div className="form-group">
              <label>
                Graduation Year of Passing <span className="required">*</span>
              </label>
              <input
                type="number"
                id="graduationYear"
                name="graduationYear"
                required
                placeholder="Enter year"
                min={1990}
                max={2030}
                value={formData.graduationYear}
                onChange={handleInputChange}
                onBlur={handleBlur}
                style={{
                  borderColor:
                    errors.graduationYear && formTouched.graduationYear
                      ? "#ff6b6b"
                      : formData.graduationYear
                      ? "#28a745"
                      : undefined
                }}
              />
              <div
                className="error-message"
                id="graduationYearError"
                style={{
                  display:
                    errors.graduationYear && formTouched.graduationYear
                      ? "block"
                      : "none"
                }}
              >
                {errors.graduationYear}
              </div>
            </div>
            <div className="form-group">
              <label>
                Graduation Percentage/CGPA <span className="required">*</span>
              </label>
              <input
                type="text"
                id="graduationGrade"
                name="graduationGrade"
                required
                placeholder="e.g., 75% or 7.5 CGPA"
                value={formData.graduationGrade}
                onChange={handleInputChange}
                onBlur={handleBlur}
                style={{
                  borderColor:
                    errors.graduationGrade && formTouched.graduationGrade
                      ? "#ff6b6b"
                      : formData.graduationGrade
                      ? "#28a745"
                      : undefined
                }}
              />
              <div
                className="error-message"
                id="graduationGradeError"
                style={{
                  display:
                    errors.graduationGrade && formTouched.graduationGrade
                      ? "block"
                      : "none"
                }}
              >
                {errors.graduationGrade}
              </div>
            </div>
          </div>
          {/* Backlog Section */}
          <div className="backlog-section">
            <div className="backlog-title">Academic Backlogs Information</div>
            <div className="form-group">
              <label>
                Do you have any backlogs during graduation?{" "}
                <span className="required">*</span>
              </label>
              <div className="radio-group">
                <div className="radio-option">
                  <input
                    type="radio"
                    id="backlogYes"
                    name="hasBacklogs"
                    value="yes"
                    checked={formData.hasBacklogs === "yes"}
                    onChange={handleInputChange}
                    required
                  />
                  <label htmlFor="backlogYes">Yes</label>
                </div>
                <div className="radio-option">
                  <input
                    type="radio"
                    id="backlogNo"
                    name="hasBacklogs"
                    value="no"
                    checked={formData.hasBacklogs === "no"}
                    onChange={handleInputChange}
                    required
                  />
                  <label htmlFor="backlogNo">No</label>
                </div>
              </div>
              <div
                className="error-message"
                id="backlogError"
                style={{
                  display:
                    errors.hasBacklogs && formTouched.hasBacklogs
                      ? "block"
                      : "none"
                }}
              >
                {errors.hasBacklogs}
              </div>
            </div>
            <div
              className={
                "backlog-count" +
                (formData.hasBacklogs === "yes" ? " show" : "")
              }
              id="backlogCountSection"
            >
              <div className="row">
                <div className="form-group">
                  <label>
                    Number of Backlogs <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    id="backlogCount"
                    name="backlogCount"
                    placeholder="Enter number of backlogs"
                    min={1}
                    max={50}
                    value={formData.backlogCount}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    required={formData.hasBacklogs === "yes"}
                    style={{
                      borderColor:
                        errors.backlogCount && formTouched.backlogCount
                          ? "#ff6b6b"
                          : formData.backlogCount
                          ? "#28a745"
                          : undefined
                    }}
                  />
                  <div
                    className="error-message"
                    id="backlogCountError"
                    style={{
                      display:
                        errors.backlogCount && formTouched.backlogCount
                          ? "block"
                          : "none"
                    }}
                  >
                    {errors.backlogCount}
                  </div>
                </div>
                <div className="form-group">
                  <label>Current Status</label>
                  <select
                    id="backlogStatus"
                    name="backlogStatus"
                    value={formData.backlogStatus}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                  >
                    <option value="">Select Status</option>
                    <option value="All Cleared">All Cleared</option>
                    <option value="Partially Cleared">Partially Cleared</option>
                    <option value="Not Cleared">Not Cleared</option>
                  </select>
                  <div
                    className="error-message"
                    id="backlogStatusError"
                    style={{
                      display:
                        errors.backlogStatus && formTouched.backlogStatus
                          ? "block"
                          : "none"
                    }}
                  >
                    {errors.backlogStatus}
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label>Additional Details (Optional)</label>
                <textarea
                  id="backlogDetails"
                  name="backlogDetails"
                  placeholder="Any additional information about backlogs (subjects, reasons, etc.)"
                  value={formData.backlogDetails}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                />
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
            onClick={handleSave}
            style={{
              background: saveButtonColor
            }}
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

export default EducationForm45;