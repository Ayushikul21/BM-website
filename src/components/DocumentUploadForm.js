import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const initialState = {
  signature: null,
  resume: null,
  additionalDocs: [],
};
const initialErrors = {
  signature: "",
  resume: "",
};

function DocumentUploadForm() {
  const [currentDateTime, setCurrentDateTime] = useState(formatDateTime(new Date()));
  const [location, setLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState("Please allow location access");
  const [locationDisplay, setLocationDisplay] = useState("📍 Detecting location...");
  const [signature, setSignature] = useState(null);
  const [resume, setResume] = useState(null);
  const [additionalDocs, setAdditionalDocs] = useState([]);
  const [sigFileName, setSigFileName] = useState("");
  const [resumeFileName, setResumeFileName] = useState("");
  const [addDocsFileNames, setAddDocsFileNames] = useState("");
  const [errors, setErrors] = useState(initialErrors);
  const [successMessage, setSuccessMessage] = useState("");
  const [canProceed, setCanProceed] = useState(false);
  const [saveBtnText, setSaveBtnText] = useState("Save");
  const [saveBtnColor, setSaveBtnColor] = useState("linear-gradient(135deg, #28a745 0%, #198754 100%)");
  const sigInputRef = useRef();
  const resumeInputRef = useRef();
  const addDocsInputRef = useRef();
  const navigate = useNavigate();

const styles = `
/* all CSS from your HTML file, unchanged */
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
    max-width: 600px;
    animation: slideUp 0.6s ease-out;
    max-height: 90vh;
    overflow-y: auto;
}
/* ... rest of the CSS unchanged ... */
@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
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
.form-card {
    padding: 30px;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    background: white;
    color: #333;
    border: 2px solid #e1e5e9;
    margin-bottom: 30px;
}
.form-card:hover {
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
.form-group label .required {
    color: #ff4757;
    margin-left: 3px;
}
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
.form-group input[type="file"] {
    padding: 10px;
    background: #f8f9fa;
    border: 2px dashed #e1e5e9;
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
.button-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 15px;
    margin-top: 30px;
}
.btn {
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
.btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}
.back-button {
    background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
    color: white;
}
.back-button:hover {
    box-shadow: 0 10px 25px rgba(108, 117, 125, 0.4);
}
.next-button {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}
.next-button:hover:not(:disabled) {
    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
}
.next-button:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
    opacity: 0.6;
}
.save-button {
    background: linear-gradient(135deg, #28a745 0%, #198754 100%);
    color: white;
}
.save-button:hover {
    box-shadow: 0 10px 25px rgba(40, 167, 69, 0.4);
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
}
.file-upload-area {
    border: 2px dashed #e1e5e9;
    border-radius: 10px;
    padding: 20px;
    text-align: center;
    transition: all 0.3s ease;
    cursor: pointer;
    background: #f8f9fa;
}
.file-upload-area:hover {
    border-color: #667eea;
    background: rgba(102, 126, 234, 0.1);
}
.file-upload-icon {
    font-size: 2rem;
    margin-bottom: 10px;
    opacity: 0.7;
}
.current-time {
    background: rgba(0, 0, 0, 0.1);
    padding: 10px;
    border-radius: 8px;
    text-align: center;
    font-weight: 600;
    margin-bottom: 15px;
}
.location-info {
    background: rgba(0, 140, 255, 0.1);
    padding: 15px;
    border-radius: 8px;
    text-align: center;
    font-weight: 600;
    margin-bottom: 15px;
    border: 2px solid rgba(0, 140, 255, 0.2);
}
.location-status {
    font-size: 0.9rem;
    margin-top: 8px;
    opacity: 0.8;
}
.location-refresh {
    background: rgba(0, 140, 255, 0.8);
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.8rem;
    margin-top: 10px;
    transition: all 0.3s ease;
}
.location-refresh:hover {
    background: rgba(0, 140, 255, 1);
    transform: translateY(-2px);
}
@media (max-width: 768px) {
    .container {
        padding: 25px;
        margin: 10px;
    }
    .form-header h1 {
        font-size: 2rem;
    }
    .button-row {
        grid-template-columns: 1fr;
        gap: 10px;
    }
    .btn {
        font-size: 1rem;
        padding: 15px;
    }
}
`;

function formatDateTime(dt) {
  return dt.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}

  // Inject styles
  useEffect(() => {
    let styleTag = document.getElementById("document-upload-form-styles");
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = "document-upload-form-styles";
      styleTag.innerHTML = styles;
      document.head.appendChild(styleTag);
    }
  }, []);

  // Date/time updater
  useEffect(() => {
    setCurrentDateTime(formatDateTime(new Date()));
    const timer = setInterval(() => {
      setCurrentDateTime(formatDateTime(new Date()));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Geolocation
  function fetchLocation() {
    if (!navigator.geolocation) {
      setLocationDisplay("📍 Geolocation not supported");
      setLocationStatus("Your browser does not support geolocation");
      setLocation(null);
      return;
    }
    setLocationDisplay("📍 Detecting location...");
    setLocationStatus("Getting your current location...");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const data = await response.json();
          const locObj = {
            latitude,
            longitude,
            city: data.city || "Unknown City",
            locality: data.locality || "",
            countryName: data.countryName || "Unknown Country",
            principalSubdivision: data.principalSubdivision || "",
            fullAddress: data.display_name || `${data.city}, ${data.countryName}`,
            timestamp: new Date().toISOString()
          };
          setLocation(locObj);
          setLocationDisplay(
            `📍 ${locObj.city}${locObj.principalSubdivision ? ", " + locObj.principalSubdivision : ""}, ${locObj.countryName}`
          );
          setLocationStatus(`Located at ${new Date().toLocaleTimeString()}`);
        } catch (e) {
          setLocation({
            latitude,
            longitude,
            city: "Unknown",
            countryName: "Unknown",
            fullAddress: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
            timestamp: new Date().toISOString()
          });
          setLocationDisplay(`📍 ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          setLocationStatus("Location detected (coordinates only)");
        }
      },
      (error) => {
        let errorMessage = "Unable to detect location";
        let statusMessage = "Location access denied or unavailable";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied";
            statusMessage = "Please enable location access in your browser";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location unavailable";
            statusMessage = "Location information is not available";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timeout";
            statusMessage = "Location request timed out. Try again";
            break;
        }
        setLocationDisplay(`📍 ${errorMessage}`);
        setLocationStatus(statusMessage);
        setLocation(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  }

  useEffect(() => {
    fetchLocation();
    // eslint-disable-next-line
  }, []);

  // File validation helpers
  function validateFile(file, allowedTypes, maxSizeMB) {
    if (!file) return false;
    return allowedTypes.includes(file.type) && file.size <= maxSizeMB * 1024 * 1024;
  }
  function validateAll() {
    const isSignatureValid = validateFile(
      signature,
      ["image/png", "image/jpeg", "image/jpg"],
      5
    );
    const isResumeValid = validateFile(
      resume,
      [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ],
      10
    );
    setCanProceed(isSignatureValid && isResumeValid);
    return isSignatureValid && isResumeValid;
  }

  // Update file name displays
  useEffect(() => {
    if (signature) {
      setSigFileName(`Selected: ${signature.name} (${(signature.size / 1024 / 1024).toFixed(2)} MB)`);
    } else {
      setSigFileName("");
    }
    if (resume) {
      setResumeFileName(`Selected: ${resume.name} (${(resume.size / 1024 / 1024).toFixed(2)} MB)`);
    } else {
      setResumeFileName("");
    }
    if (additionalDocs.length > 0) {
      setAddDocsFileNames(
        `Selected: ${Array.from(additionalDocs)
          .map(f => f.name)
          .join(", ")}`
      );
    } else {
      setAddDocsFileNames("");
    }
    validateAll();
    // eslint-disable-next-line
  }, [signature, resume, additionalDocs]);

  // Error display helpers
  function showError(field, message) {
    setErrors(prev => ({ ...prev, [field]: message }));
  }
  function clearError(field) {
    setErrors(prev => ({ ...prev, [field]: "" }));
  }

  // Save button logic
  function handleSave() {
    let formIsValid = true;
    const isSignatureValid = validateFile(
      signature,
      ["image/png", "image/jpeg", "image/jpg"],
      5
    );
    if (!isSignatureValid) {
      showError(
        "signature",
        "Please upload a valid signature file (PNG, JPG, max 5MB)."
      );
      formIsValid = false;
    } else {
      clearError("signature");
    }
    const isResumeValid = validateFile(
      resume,
      [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ],
      10
    );
    if (!isResumeValid) {
      showError(
        "resume",
        "Please upload a valid resume file (PDF, DOC, DOCX, max 10MB)."
      );
      formIsValid = false;
    } else {
      clearError("resume");
    }
    if (formIsValid) {
      const formData = {
        signature: signature
          ? { name: signature.name, size: signature.size, type: signature.type }
          : null,
        resume: resume
          ? { name: resume.name, size: resume.size, type: resume.type }
          : null,
        additionalDocs: additionalDocs.length
          ? Array.from(additionalDocs).map(f => ({
              name: f.name,
              size: f.size,
              type: f.type
            }))
          : [],
        location: location,
        submissionDateTime: new Date().toISOString(),
        savedAt: new Date().toLocaleString(),
        formType: "documentUpload",
        version: "1.0"
      };
      try {
        if (typeof Storage !== "undefined" && localStorage)
          localStorage.setItem("documentUploadFormData", JSON.stringify(formData));
      } catch (e) {}
      setSuccessMessage(
        `<strong>Document Details Saved Successfully! ✅</strong><br>
         <small>Saved at: ${formData.savedAt}</small><br>
         <small>Signature: ${formData.signature ? formData.signature.name : "N/A"} | Resume: ${formData.resume ? formData.resume.name : "N/A"}</small><br>
         <small>Location: ${
           location
             ? `${location.city}, ${location.countryName}`
             : "Not detected"
         }</small>`
      );
      setSaveBtnText("Saved ✓");
      setSaveBtnColor("#198754");
      setTimeout(() => {
        setSuccessMessage("");
        setSaveBtnText("Save");
        setSaveBtnColor("linear-gradient(135deg, #28a745 0%, #198754 100%)");
      }, 4000);
    } else {
      setSuccessMessage(`<strong>Please correct the errors before saving.</strong>`);
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  }

  // Navigation
  function handleBack() {
    navigate('/skills');
  }
  function handleNext() {
    if (validateAll()) {
      const finalFormData = {
        signature: signature
          ? { name: signature.name, size: signature.size, type: signature.type }
          : null,
        resume: resume
          ? { name: resume.name, size: resume.size, type: resume.type }
          : null,
        additionalDocs: additionalDocs.length
          ? Array.from(additionalDocs).map(f => ({
              name: f.name,
              size: f.size,
              type: f.type
            }))
          : [],
        location: location,
        submissionDateTime: new Date().toISOString()
      };
      try {
        if (typeof Storage !== "undefined" && localStorage)
          localStorage.setItem("documentUploadFormData", JSON.stringify(finalFormData));
      } catch (e) {}
      navigate('/professional');
    } else {
      setSuccessMessage("Please ensure all required fields are valid before proceeding.");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  }

  // File input handlers
  function handleFileChange(e, field) {
    const files = e.target.files;
    if (field === "signature") setSignature(files && files[0] ? files[0] : null);
    if (field === "resume") setResume(files && files[0] ? files[0] : null);
    if (field === "additionalDocs") setAdditionalDocs(files ? files : []);
  }

  // Restore previously saved files (name only, not file objects; only for display)
  useEffect(() => {
    try {
      if (typeof Storage !== "undefined" && localStorage) {
        const data = localStorage.getItem("documentUploadFormData");
        if (data) {
          const d = JSON.parse(data);
          if (d.signature) setSigFileName(`Selected: ${d.signature.name}`);
          if (d.resume) setResumeFileName(`Selected: ${d.resume.name}`);
          if (d.additionalDocs && d.additionalDocs.length)
            setAddDocsFileNames(
              `Selected: ${d.additionalDocs.map(f => f.name).join(", ")}`
            );
        }
      }
    } catch (e) {}
    // eslint-disable-next-line
  }, []);

  return (
    <div className="container">
      <div className="form-header">
        <h1>Bandy & Moot</h1>
        <p>Document Upload</p>
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
        id="documentForm"
        autoComplete="off"
        onSubmit={e => e.preventDefault()}
      >
        {/* Location & Date/Time Section */}
        <div className="form-card">
          <h2 className="card-title">Current Information</h2>
          <div className="form-group">
            <label>Current Date & Time</label>
            <div className="current-time" id="currentDateTime">
              {currentDateTime}
            </div>
          </div>
          <div className="form-group">
            <label>Current Place</label>
            <div className="location-info" id="currentLocation">
              <div id="locationDisplay">{locationDisplay}</div>
              <div className="location-status" id="locationStatus">
                {locationStatus}
              </div>
              <button
                type="button"
                className="location-refresh"
                id="refreshLocation"
                onClick={fetchLocation}
              >
                🔄 Refresh Location
              </button>
            </div>
          </div>
        </div>
        {/* Documents Section */}
        <div className="form-card">
          <h2 className="card-title">Documents & Signature</h2>
          <div className="form-group">
            <label>
              Digital Signature Upload <span className="required">*</span>
            </label>
            <div
              className="file-upload-area"
              onClick={() => sigInputRef.current && sigInputRef.current.click()}
            >
              <div className="file-upload-icon">✍️</div>
              <div>Click to upload your signature</div>
              <div
                style={{
                  fontSize: "0.8rem",
                  opacity: 0.7,
                  marginTop: 5
                }}
              >
                Accepted formats: PNG, JPG, JPEG (Max 5MB)
              </div>
            </div>
            <input
              type="file"
              id="signature"
              name="signature"
              accept=".png,.jpg,.jpeg"
              style={{ display: "none" }}
              ref={sigInputRef}
              onChange={e => handleFileChange(e, "signature")}
              required
            />
            <div
              className="error-message"
              id="signatureError"
              style={{
                display: errors.signature ? "block" : "none"
              }}
            >
              {errors.signature}
            </div>
            <div
              id="signatureFileName"
              style={{
                marginTop: 10,
                fontSize: "0.9rem",
                opacity: 0.8
              }}
            >
              {sigFileName}
            </div>
          </div>
          <div className="form-group">
            <label>
              Resume Upload <span className="required">*</span>
            </label>
            <div
              className="file-upload-area"
              onClick={() => resumeInputRef.current && resumeInputRef.current.click()}
            >
              <div className="file-upload-icon">📄</div>
              <div>Click to upload your resume</div>
              <div
                style={{
                  fontSize: "0.8rem",
                  opacity: 0.7,
                  marginTop: 5
                }}
              >
                Accepted formats: PDF, DOC, DOCX (Max 10MB)
              </div>
            </div>
            <input
              type="file"
              id="resume"
              name="resume"
              accept=".pdf,.doc,.docx"
              style={{ display: "none" }}
              ref={resumeInputRef}
              onChange={e => handleFileChange(e, "resume")}
              required
            />
            <div
              className="error-message"
              id="resumeError"
              style={{
                display: errors.resume ? "block" : "none"
              }}
            >
              {errors.resume}
            </div>
            <div
              id="resumeFileName"
              style={{
                marginTop: 10,
                fontSize: "0.9rem",
                opacity: 0.8
              }}
            >
              {resumeFileName}
            </div>
          </div>
          <div className="form-group">
            <label>Additional Documents (Optional)</label>
            <div
              className="file-upload-area"
              onClick={() =>
                addDocsInputRef.current && addDocsInputRef.current.click()
              }
            >
              <div className="file-upload-icon">📎</div>
              <div>Click to upload additional documents</div>
              <div
                style={{
                  fontSize: "0.8rem",
                  opacity: 0.7,
                  marginTop: 5
                }}
              >
                Certificates, Portfolio, etc. (Max 15MB each)
              </div>
            </div>
            <input
              type="file"
              id="additionalDocs"
              name="additionalDocs"
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              multiple
              style={{ display: "none" }}
              ref={addDocsInputRef}
              onChange={e => handleFileChange(e, "additionalDocs")}
            />
            <div
              id="additionalDocsFileNames"
              style={{
                marginTop: 10,
                fontSize: "0.9rem",
                opacity: 0.8
              }}
            >
              {addDocsFileNames}
            </div>
          </div>
        </div>
        <div className="button-row">
          <button
            type="button"
            id="backButton"
            className="btn back-button"
            onClick={handleBack}
          >
            Back
          </button>
          <button
            type="button"
            id="saveButton"
            className="btn save-button"
            style={{ background: saveBtnColor }}
            onClick={handleSave}
          >
            {saveBtnText}
          </button>
          <button
            type="button"
            id="nextButton"
            className="btn next-button"
            disabled={!canProceed}
            onClick={handleNext}
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
}

export default DocumentUploadForm;