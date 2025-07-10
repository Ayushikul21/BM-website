import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const initialState = {
  keySkills: "",
  projects: "",
  keyAchievements: ""
};
const initialErrors = {
  keySkills: "",
  projects: "",
  keyAchievements: ""
};

const SkillsProjectsForm = () => {
  const [formTouched, setFormTouched] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [saveButtonText, setSaveButtonText] = useState("Save");
  const [saveButtonColor, setSaveButtonColor] = useState(
    "linear-gradient(135deg, #28a745 0%, #20c997 100%)"
  );
  const [canProceed, setCanProceed] = useState(false);
  const [charCounts, setCharCounts] = useState({
    keySkills: 0,
    projects: 0,
    keyAchievements: 0
  });
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
    max-width: 700px;
    animation: slideUp 0.6s ease-out;
    max-height: 90vh;
    overflow-y: auto;
}
@keyframes slideUp {
    from { opacity: 0; transform: translateY(30px);}
    to { opacity: 1; transform: translateY(0);}
}
.section-card {
    padding: 30px;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    background: white;
    color: #333;
    border: 2px solid #e1e5e9;
    text-align: center;
}
.section-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}
.card-title {
    font-size: 1.8rem;
    font-weight: 700;
    margin-bottom: 25px;
    text-align: center;
    padding-bottom: 15px;
    border-bottom: 2px solid #e1e5e9;
    color: #333;
}
.mandatory-indicator {
    color: #ff4757;
    font-size: 0.9rem;
    font-weight: 600;
    margin-left: 10px;
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
    min-height: 120px;
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
.help-text {
    font-size: 0.8rem;
    color: #666;
    margin-top: 5px;
    font-style: italic;
}
.field-separator {
    height: 1px;
    background: linear-gradient(to right, transparent, #e1e5e9, transparent);
    margin: 25px 0;
}
.char-counter {
    font-size: 0.7rem;
    color: #666;
    text-align: right;
    margin-top: 3px;
}
@media (max-width: 768px) {
    .container { padding: 25px; margin: 10px; max-width: 95%; }
    .button-container { flex-direction: column; gap: 10px; }
    .btn { font-size: 1rem; padding: 15px; }
}
`;

function validateField(fieldId, value) {
  switch (fieldId) {
    case "keySkills":
      return value && value.trim().length >= 3;
    default:
      return true;
  }
}
function getErrorMessage(fieldId) {
  switch (fieldId) {
    case "keySkills":
      return "Key skills are required (minimum 3 characters)";
    default:
      return "Please enter a valid value";
  }
}

  // Inject styles
  useEffect(() => {
    let styleTag = document.getElementById("skills-projects-form-styles");
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = "skills-projects-form-styles";
      styleTag.innerHTML = styles;
      document.head.appendChild(styleTag);
    }
  }, []);

  // Load from localStorage if available
  useEffect(() => {
    try {
      if (typeof Storage !== "undefined" && localStorage) {
        const savedData = localStorage.getItem("skillsProjectsFormData");
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

  useEffect(() => {
    setCanProceed(validateMandatoryFields());
  }, [formData]);

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    setCharCounts((prev) => ({
      ...prev,
      [name]: value.length
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

  function validateMandatoryFields() {
    let isValid = true;
    ["keySkills"].forEach((fieldId) => {
      if (!validateField(fieldId, formData[fieldId])) {
        isValid = false;
      }
    });
    return isValid;
  }

  function handleSave() {
    let isValid = true;
    let newErrors = {};
    ["keySkills"].forEach((fieldId) => {
      if (!validateField(fieldId, formData[fieldId])) {
        newErrors[fieldId] = getErrorMessage(fieldId);
        isValid = false;
      } else {
        newErrors[fieldId] = "";
      }
    });
    setErrors(newErrors);
    if (isValid) {
      const saveData = {
        ...formData,
        savedAt: new Date().toLocaleString()
      };
      try {
        if (typeof Storage !== "undefined" && localStorage) {
          localStorage.setItem("skillsProjectsFormData", JSON.stringify(saveData));
        }
      } catch (e) {}
      setSuccessMessage(
        `<strong>Skills, Projects & Achievements Saved Successfully! ✅</strong><br>
         <small>Saved at: ${saveData.savedAt}</small><br>
         <small>Skills: ${
           saveData.keySkills
             ? saveData.keySkills.substring(0, 30) + "..."
             : "Not specified"
         }</small>`
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
    if (!validateMandatoryFields()) return;
    // Save before navigating
    const saveData = {
      ...formData,
      savedAt: new Date().toLocaleString()
    };
    try {
      if (typeof Storage !== "undefined" && localStorage) {
        localStorage.setItem("skillsProjectsFormData", JSON.stringify(saveData));
      }
    } catch (e) {}
    navigate('/document');
  }

  function handleBack() {
    navigate('/employment');
  }

  // Char counter for textareas (max 1000 characters)
  function renderCharCounter(fieldId) {
    const currentLength = charCounts[fieldId] || 0;
    let color = "#666";
    if (currentLength > 900) color = "#ff4757";
    return (
      <div className="char-counter" style={{ color }}>
        {currentLength}/1000 characters
      </div>
    );
  }

  return (
    <div className="container">
      {successMessage && (
        <div
          className="success-message"
          id="successMessage"
          style={{ display: "block" }}
          dangerouslySetInnerHTML={{ __html: successMessage }}
        />
      )}
      <form
        id="skillsProjectsForm"
        autoComplete="off"
        onSubmit={e => e.preventDefault()}
      >
        <div className="section-card">
          <h2 className="card-title">Skills & Projects Information</h2>

          <div className="form-group">
            <label>
              Key Skills <span className="required">*</span>
            </label>
            <textarea
              id="keySkills"
              name="keySkills"
              placeholder="e.g., JavaScript, Python, React, Leadership, Communication, Problem Solving..."
              required
              maxLength={1000}
              value={formData.keySkills}
              onChange={handleInputChange}
              onBlur={handleBlur}
              style={{
                borderColor:
                  errors.keySkills && formTouched.keySkills
                    ? "#dc3545"
                    : formData.keySkills
                    ? "#28a745"
                    : undefined
              }}
            />
            <div className="help-text">
              List your key technical and soft skills separated by commas (minimum 3 characters)
            </div>
            {renderCharCounter("keySkills")}
            <div
              className="error-message"
              id="keySkillsError"
              style={{
                display:
                  errors.keySkills && formTouched.keySkills
                    ? "block"
                    : "none"
              }}
            >
              {errors.keySkills}
            </div>
          </div>

          <div className="field-separator"></div>

          <div className="form-group">
            <label>Projects</label>
            <textarea
              id="projects"
              name="projects"
              placeholder="Describe your major projects, technologies used, and your role..."
              maxLength={1000}
              value={formData.projects}
              onChange={handleInputChange}
              onBlur={handleBlur}
            />
            <div className="help-text">
              Describe your significant projects and contributions
            </div>
            {renderCharCounter("projects")}
            <div
              className="error-message"
              id="projectsError"
              style={{
                display:
                  errors.projects && formTouched.projects ? "block" : "none"
              }}
            >
              {errors.projects}
            </div>
          </div>

          <div className="field-separator"></div>

          <div className="form-group">
            <label>Key Achievements</label>
            <textarea
              id="keyAchievements"
              name="keyAchievements"
              placeholder="e.g., Increased system performance by 40%, Led a team of 5 developers, Implemented CI/CD pipeline..."
              maxLength={1000}
              value={formData.keyAchievements}
              onChange={handleInputChange}
              onBlur={handleBlur}
            />
            <div className="help-text">
              List your professional achievements and accomplishments
            </div>
            {renderCharCounter("keyAchievements")}
            <div
              className="error-message"
              id="keyAchievementsError"
              style={{
                display:
                  errors.keyAchievements && formTouched.keyAchievements
                    ? "block"
                    : "none"
              }}
            >
              {errors.keyAchievements}
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
              disabled={!canProceed}
              onClick={handleNext}
            >
              Next
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SkillsProjectsForm;