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

// In-memory storage solution (since localStorage is not available)
let formStorage = {
  skillsProjectsData: null
};

const SkillsProjectsForm = () => {
  const [formTouched, setFormTouched] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [saveButtonText, setSaveButtonText] = useState("Save");
  const [saveButtonColor, setSaveButtonColor] = useState("bg-gradient-to-r from-green-500 to-teal-500");
  const [isFormValid, setIsFormValid] = useState(false);
  const [charCounts, setCharCounts] = useState({
    keySkills: 0,
    projects: 0,
    keyAchievements: 0
  });
  const timeoutRef = useRef();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState(initialErrors);

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

  // Load saved data when component mounts
  useEffect(() => {
    // Load from in-memory storage
    if (formStorage.skillsProjectsData) {
      setFormData(formStorage.skillsProjectsData);
      setCharCounts({
        keySkills: formStorage.skillsProjectsData.keySkills.length,
        projects: formStorage.skillsProjectsData.projects.length,
        keyAchievements: formStorage.skillsProjectsData.keyAchievements.length
      });
    } else {
      setCharCounts({
        keySkills: formData.keySkills.length,
        projects: formData.projects.length,
        keyAchievements: formData.keyAchievements.length
      });
    }
  }, []);

  useEffect(() => {
    setIsFormValid(validateMandatoryFields());
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
    setIsFormValid(isValid);
    return isValid;
  }

  function handleNext() {
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
    
    if (validateMandatoryFields()) {
      const saveData = {
        ...formData,
        savedAt: new Date().toLocaleString()
      };
      
      // Actually save to in-memory storage
      formStorage.skillsProjectsData = formData;
      
      setSuccessMessage(
        `Skills, Projects & Achievements Saved Successfully! ✅ - Saved at: ${saveData.savedAt}`
      );
      setSaveButtonText("Saved ✓");
      setSaveButtonColor("bg-green-600");
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setSuccessMessage("");
        setSaveButtonText("Save");
        setSaveButtonColor("bg-gradient-to-r from-green-500 to-teal-500");
      }, 4000);
    navigate('/document');
    }
  }

  function handleBack() {
    // Auto-save before navigating
    formStorage.skillsProjectsData = formData;
    navigate('/employment');
  }

  // Char counter for textareas (max 1000 characters)
  function renderCharCounter(fieldId) {
    const currentLength = charCounts[fieldId] || 0;
    const colorClass = currentLength > 900 ? "text-red-500" : "text-gray-500";
    return (
      <div className={`text-xs text-right mt-1 ${colorClass}`}>
        {currentLength}/1000 characters
      </div>
    );
  }

  return (
     <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full max-w-5xl animate-fadeInUp max-h-[90vh] overflow-y-auto">
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-xl mb-8 text-center font-semibold">
            {successMessage}
          </div>
        )}
        
        <div className="space-y-8">
          <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-10 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <h2 className="text-3xl font-bold text-center mb-10 pb-6 border-b-2 border-gray-200 text-gray-800">
              Skills & Projects Information
            </h2>

            <div className="space-y-8">
              {/* Key Skills Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Key Skills <span className="text-red-500 ml-1">*</span>
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
                  className={`w-full px-4 py-3 border-2 rounded-xl text-sm transition-all duration-300 bg-gray-50 focus:bg-white focus:outline-none focus:-translate-y-1 focus:shadow-lg resize-vertical min-h-32 ${
                    errors.keySkills && formTouched.keySkills
                      ? "border-red-500 focus:border-red-500"
                      : formData.keySkills
                      ? "border-green-500 focus:border-indigo-500"
                      : "border-gray-300 focus:border-indigo-500"
                  }`}
                />
                <div className="text-xs text-gray-600 italic">
                  List your key technical and soft skills separated by commas (minimum 3 characters)
                </div>
                {renderCharCounter("keySkills")}
                {errors.keySkills && formTouched.keySkills && (
                  <div className="text-red-500 text-xs mt-1">
                    {errors.keySkills}
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-8"></div>

              {/* Projects Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Projects
                </label>
                <textarea
                  id="projects"
                  name="projects"
                  placeholder="Describe your major projects, technologies used, and your role..."
                  maxLength={1000}
                  value={formData.projects}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-sm transition-all duration-300 bg-gray-50 focus:bg-white focus:outline-none focus:-translate-y-1 focus:shadow-lg focus:border-indigo-500 resize-vertical min-h-32"
                />
                <div className="text-xs text-gray-600 italic">
                  Describe your significant projects and contributions
                </div>
                {renderCharCounter("projects")}
                {errors.projects && formTouched.projects && (
                  <div className="text-red-500 text-xs mt-1">
                    {errors.projects}
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-8"></div>

              {/* Key Achievements Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Key Achievements
                </label>
                <textarea
                  id="keyAchievements"
                  name="keyAchievements"
                  placeholder="e.g., Increased system performance by 40%, Led a team of 5 developers, Implemented CI/CD pipeline..."
                  maxLength={1000}
                  value={formData.keyAchievements}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-sm transition-all duration-300 bg-gray-50 focus:bg-white focus:outline-none focus:-translate-y-1 focus:shadow-lg focus:border-indigo-500 resize-vertical min-h-32"
                />
                <div className="text-xs text-gray-600 italic">
                  List your professional achievements and accomplishments
                </div>
                {renderCharCounter("keyAchievements")}
                {errors.keyAchievements && formTouched.keyAchievements && (
                  <div className="text-red-500 text-xs mt-1">
                    {errors.keyAchievements}
                  </div>
                )}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsProjectsForm;