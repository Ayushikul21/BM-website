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
  const [saveButtonColor, setSaveButtonColor] = useState("bg-green-600");
  const timeoutRef = useRef();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState(initialErrors);

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
            `Previously saved data loaded - Last saved: ${data.savedAt || "Unknown"}`
          );
          setTimeout(() => setSuccessMessage(""), 3000);
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    validateAllFields();
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
        `Education Details Saved Successfully! ✅ - Saved at: ${saveData.savedAt} - Course: ${saveData.graduationCourse} | Year: ${saveData.graduationYear}`
      );
      setSaveButtonText("Saved ✓");
      setSaveButtonColor("bg-green-600");
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setSuccessMessage("");
        setSaveButtonText("Save Data");
        setSaveButtonColor("bg-gradient-to-r from-blue-500 to-purple-600");
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
      setSuccessMessage("Education Details Saved Successfully! ✅ - Proceeding to next step...");
      setTimeout(() => {
        console.log('Navigate to employment page');
      }, 1500);
      navigate('/employment');
    }
  }

  function handleBack() {
    console.log('Navigate back to education page');
    navigate('/education');
  }

  const getFieldBorderColor = (fieldName) => {
    if (errors[fieldName] && formTouched[fieldName]) {
      return "border-red-500 focus:border-red-500";
    }
    if (formData[fieldName] && !errors[fieldName]) {
      return "border-green-500 focus:border-green-500";
    }
    return "border-gray-300 focus:border-blue-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full max-w-5xl animate-fadeInUp">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">Bandy & Moot</h1>
          <p className="text-gray-600 text-lg">Higher Education Information</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-4 rounded-xl mb-6 text-center font-semibold">
            {successMessage}
          </div>
        )}

        <form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100">
            
            {/* Diploma Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-center mb-4 text-gray-800">Diploma Information</h2>
              <p className="text-sm text-gray-600 italic mb-6">All fields in this section are optional</p>
              
              <div className="mb-6">
                <label className="block font-semibold mb-2 text-gray-700">Diploma College/Institute Name</label>
                <input
                  type="text"
                  name="diplomaCollege"
                  placeholder="Enter diploma college/institute name"
                  value={formData.diplomaCollege}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:shadow-md transition-all duration-300"
                />
                {errors.diplomaCollege && formTouched.diplomaCollege && (
                  <p className="text-red-500 text-sm mt-1">{errors.diplomaCollege}</p>
                )}
              </div>

              <div className="mb-6">
                <label className="block font-semibold mb-2 text-gray-700">Diploma Course/Branch</label>
                <input
                  type="text"
                  name="diplomaCourse"
                  placeholder="e.g., Mechanical Engineering, Computer Science, etc."
                  value={formData.diplomaCourse}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:shadow-md transition-all duration-300"
                />
                {errors.diplomaCourse && formTouched.diplomaCourse && (
                  <p className="text-red-500 text-sm mt-1">{errors.diplomaCourse}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold mb-2 text-gray-700">Diploma Duration</label>
                  <select
                    name="diplomaDuration"
                    value={formData.diplomaDuration}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:shadow-md transition-all duration-300"
                  >
                    <option value="">Select Duration</option>
                    <option value="2 Years">2 Years</option>
                    <option value="3 Years">3 Years</option>
                  </select>
                  {errors.diplomaDuration && formTouched.diplomaDuration && (
                    <p className="text-red-500 text-sm mt-1">{errors.diplomaDuration}</p>
                  )}
                </div>

                <div>
                  <label className="block font-semibold mb-2 text-gray-700">Diploma Year of Passing</label>
                  <input
                    type="number"
                    name="diplomaYear"
                    placeholder="Enter year"
                    min="1990"
                    max="2030"
                    value={formData.diplomaYear}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:shadow-md transition-all duration-300"
                  />
                  {errors.diplomaYear && formTouched.diplomaYear && (
                    <p className="text-red-500 text-sm mt-1">{errors.diplomaYear}</p>
                  )}
                </div>

                <div>
                  <label className="block font-semibold mb-2 text-gray-700">Diploma Percentage/CGPA</label>
                  <input
                    type="text"
                    name="diplomaGrade"
                    placeholder="e.g., 85% or 8.5 CGPA"
                    value={formData.diplomaGrade}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:shadow-md transition-all duration-300"
                  />
                  {errors.diplomaGrade && formTouched.diplomaGrade && (
                    <p className="text-red-500 text-sm mt-1">{errors.diplomaGrade}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-b-2 border-gray-200 my-8"></div>

            {/* Graduation Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-center mb-4 text-gray-800">Graduation Information</h2>
              <p className="text-sm text-red-600 italic mb-6">All fields in this section are mandatory</p>
              
              <div className="mb-6">
                <label className="block font-semibold mb-2 text-gray-700">
                  Graduation College/University Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="graduationCollege"
                  required
                  placeholder="Enter graduation college/university name"
                  value={formData.graduationCollege}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full p-3 border-2 rounded-lg focus:outline-none focus:shadow-md transition-all duration-300 ${getFieldBorderColor('graduationCollege')}`}
                />
                {errors.graduationCollege && formTouched.graduationCollege && (
                  <p className="text-red-500 text-sm mt-1">{errors.graduationCollege}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block font-semibold mb-2 text-gray-700">
                    Graduation Course/Degree <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="graduationCourse"
                    required
                    value={formData.graduationCourse}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full p-3 border-2 rounded-lg focus:outline-none focus:shadow-md transition-all duration-300 ${getFieldBorderColor('graduationCourse')}`}
                  >
                    <option value="">Select Course</option>
                    {gradCourses.map((course) => (
                      <option key={course} value={course}>{course}</option>
                    ))}
                  </select>
                  {errors.graduationCourse && formTouched.graduationCourse && (
                    <p className="text-red-500 text-sm mt-1">{errors.graduationCourse}</p>
                  )}
                </div>

                <div>
                  <label className="block font-semibold mb-2 text-gray-700">
                    Specialization/Branch <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="graduationSpecialization"
                    required
                    placeholder="Enter specialization/branch"
                    value={formData.graduationSpecialization}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full p-3 border-2 rounded-lg focus:outline-none focus:shadow-md transition-all duration-300 ${getFieldBorderColor('graduationSpecialization')}`}
                  />
                  {errors.graduationSpecialization && formTouched.graduationSpecialization && (
                    <p className="text-red-500 text-sm mt-1">{errors.graduationSpecialization}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold mb-2 text-gray-700">
                    Graduation Duration <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="graduationDuration"
                    required
                    value={formData.graduationDuration}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full p-3 border-2 rounded-lg focus:outline-none focus:shadow-md transition-all duration-300 ${getFieldBorderColor('graduationDuration')}`}
                  >
                    <option value="">Select Duration</option>
                    <option value="3 Years">3 Years</option>
                    <option value="4 Years">4 Years</option>
                    <option value="5 Years">5 Years</option>
                  </select>
                  {errors.graduationDuration && formTouched.graduationDuration && (
                    <p className="text-red-500 text-sm mt-1">{errors.graduationDuration}</p>
                  )}
                </div>

                <div>
                  <label className="block font-semibold mb-2 text-gray-700">
                    Graduation Year of Passing <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="graduationYear"
                    required
                    placeholder="Enter year"
                    min="1990"
                    max="2030"
                    value={formData.graduationYear}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full p-3 border-2 rounded-lg focus:outline-none focus:shadow-md transition-all duration-300 ${getFieldBorderColor('graduationYear')}`}
                  />
                  {errors.graduationYear && formTouched.graduationYear && (
                    <p className="text-red-500 text-sm mt-1">{errors.graduationYear}</p>
                  )}
                </div>

                <div>
                  <label className="block font-semibold mb-2 text-gray-700">
                    Graduation Percentage/CGPA <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="graduationGrade"
                    required
                    placeholder="e.g., 75% or 7.5 CGPA"
                    value={formData.graduationGrade}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full p-3 border-2 rounded-lg focus:outline-none focus:shadow-md transition-all duration-300 ${getFieldBorderColor('graduationGrade')}`}
                  />
                  {errors.graduationGrade && formTouched.graduationGrade && (
                    <p className="text-red-500 text-sm mt-1">{errors.graduationGrade}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Backlog Section */}
            <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-100">
              <h3 className="text-lg font-semibold text-blue-600 mb-4">Academic Backlogs Information</h3>
              
              <div className="mb-4">
                <label className="block font-semibold mb-3 text-gray-700">
                  Do you have any backlogs during graduation? <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="backlogYes"
                      name="hasBacklogs"
                      value="yes"
                      checked={formData.hasBacklogs === "yes"}
                      onChange={handleInputChange}
                      required
                      className="w-4 h-4"
                    />
                    <label htmlFor="backlogYes" className="font-medium">Yes</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="backlogNo"
                      name="hasBacklogs"
                      value="no"
                      checked={formData.hasBacklogs === "no"}
                      onChange={handleInputChange}
                      required
                      className="w-4 h-4"
                    />
                    <label htmlFor="backlogNo" className="font-medium">No</label>
                  </div>
                </div>
                {errors.hasBacklogs && formTouched.hasBacklogs && (
                  <p className="text-red-500 text-sm mt-1">{errors.hasBacklogs}</p>
                )}
              </div>

              {formData.hasBacklogs === "yes" && (
                <div className="mt-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold mb-2 text-gray-700">
                        Number of Backlogs <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="backlogCount"
                        placeholder="Enter number of backlogs"
                        min="1"
                        max="50"
                        value={formData.backlogCount}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        required
                        className={`w-full p-3 border-2 rounded-lg focus:outline-none focus:shadow-md transition-all duration-300 ${getFieldBorderColor('backlogCount')}`}
                      />
                      {errors.backlogCount && formTouched.backlogCount && (
                        <p className="text-red-500 text-sm mt-1">{errors.backlogCount}</p>
                      )}
                    </div>

                    <div>
                      <label className="block font-semibold mb-2 text-gray-700">Current Status</label>
                      <select
                        name="backlogStatus"
                        value={formData.backlogStatus}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:shadow-md transition-all duration-300"
                      >
                        <option value="">Select Status</option>
                        <option value="All Cleared">All Cleared</option>
                        <option value="Partially Cleared">Partially Cleared</option>
                        <option value="Not Cleared">Not Cleared</option>
                      </select>
                      {errors.backlogStatus && formTouched.backlogStatus && (
                        <p className="text-red-500 text-sm mt-1">{errors.backlogStatus}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-2 text-gray-700">Additional Details (Optional)</label>
                    <textarea
                      name="backlogDetails"
                      placeholder="Any additional information about backlogs (subjects, reasons, etc.)"
                      value={formData.backlogDetails}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      rows="3"
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:shadow-md transition-all duration-300 resize-y"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Button Group */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white py-4 rounded-2xl font-bold text-lg uppercase tracking-wide hover:from-gray-600 hover:to-gray-700 transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
            >
              Back
            </button>
            
            <button
              type="button"
              onClick={handleSave}
              className={`flex-1 text-white py-4 rounded-2xl font-bold text-lg uppercase tracking-wide hover:transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300 ${saveButtonColor}`}
            >
              {saveButtonText}
            </button>
            
            <button
              type="button"
              onClick={handleNext}
              disabled={!isFormValid}
              className={`flex-1 py-4 rounded-2xl font-bold text-lg uppercase tracking-wide transition-all duration-300 ${
                isFormValid
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 hover:transform hover:-translate-y-1 hover:shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EducationForm45;