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
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState(initialErrors);
  const [successMessage, setSuccessMessage] = useState("");
  const [canProceed, setCanProceed] = useState(false);
  const [saveBtnText, setSaveBtnText] = useState("Save");
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const sigInputRef = useRef();
  const resumeInputRef = useRef();
  const addDocsInputRef = useRef();
  const navigate = useNavigate();

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

  // Load saved data on component mount
  useEffect(() => {
    const loadSavedData = () => {
      try {
        const savedData = localStorage.getItem('documentUploadFormData');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          
          // Restore location if saved
          if (parsedData.location) {
            setLocation(parsedData.location);
            setLocationDisplay(
              `📍 ${parsedData.location.city}${parsedData.location.principalSubdivision ? ", " + parsedData.location.principalSubdivision : ""}, ${parsedData.location.countryName}`
            );
            setLocationStatus(`Previously saved location`);
          }
          
          // Restore file information (metadata only, not actual files)
          if (parsedData.signature) {
            setSigFileName(`Previously selected: ${parsedData.signature.name} (${(parsedData.signature.size / 1024 / 1024).toFixed(2)} MB)`);
          }
          
          if (parsedData.resume) {
            setResumeFileName(`Previously selected: ${parsedData.resume.name} (${(parsedData.resume.size / 1024 / 1024).toFixed(2)} MB)`);
          }
          
          if (parsedData.additionalDocs && parsedData.additionalDocs.length > 0) {
            const fileNames = parsedData.additionalDocs.map(f => f.name).join(", ");
            const totalSize = parsedData.additionalDocs.reduce((sum, file) => sum + file.size, 0);
            setAddDocsFileNames(`Previously selected: ${fileNames} (Total: ${(totalSize / 1024 / 1024).toFixed(2)} MB)`);
          }
          
          // Show restoration message
          setSuccessMessage("📋 Previous form data restored successfully!");
          setTimeout(() => setSuccessMessage(""), 3000);
        }
      } catch (error) {
        console.error('Error loading saved data:', error);
      } finally {
        setIsDataLoaded(true);
      }
    };

    loadSavedData();
  }, []);

  // Save data to localStorage whenever form data changes
  useEffect(() => {
    if (!isDataLoaded) return; // Don't save during initial load
    
    const saveData = () => {
      try {
        const dataToSave = {
          location: location,
          signature: signature ? {
            name: signature.name,
            size: signature.size,
            type: signature.type,
            lastModified: signature.lastModified
          } : null,
          resume: resume ? {
            name: resume.name,
            size: resume.size,
            type: resume.type,
            lastModified: resume.lastModified
          } : null,
          additionalDocs: additionalDocs.length ? Array.from(additionalDocs).map(f => ({
            name: f.name,
            size: f.size,
            type: f.type,
            lastModified: f.lastModified
          })) : [],
          lastSaved: new Date().toISOString()
        };
        
        localStorage.setItem('documentUploadFormData', JSON.stringify(dataToSave));
      } catch (error) {
        console.error('Error saving data:', error);
      }
    };

    // Debounce saving to avoid too frequent saves
    const timeoutId = setTimeout(saveData, 1000);
    return () => clearTimeout(timeoutId);
  }, [location, signature, resume, additionalDocs, isDataLoaded]);

  // Date/time updater
  useEffect(() => {
    setCurrentDateTime(formatDateTime(new Date()));
    const timer = setInterval(() => {
      setCurrentDateTime(formatDateTime(new Date()));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Geolocation with improved error handling
  function fetchLocation() {
    if (!navigator.geolocation) {
      setLocationDisplay("📍 Geolocation not supported");
      setLocationStatus("Your browser does not support geolocation");
      setLocation(null);
      setIsLocationLoading(false);
      return;
    }
    
    setIsLocationLoading(true);
    setLocationDisplay("📍 Detecting location...");
    setLocationStatus("Getting your current location...");
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data = await response.json();
          const locObj = {
            latitude,
            longitude,
            city: data.city || "Unknown City",
            locality: data.locality || "",
            countryName: data.countryName || "Unknown Country",
            principalSubdivision: data.principalSubdivision || "",
            fullAddress: data.display_name || `${data.city || "Unknown"}, ${data.countryName || "Unknown"}`,
            timestamp: new Date().toISOString()
          };
          setLocation(locObj);
          setLocationDisplay(
            `📍 ${locObj.city}${locObj.principalSubdivision ? ", " + locObj.principalSubdivision : ""}, ${locObj.countryName}`
          );
          setLocationStatus(`Located at ${new Date().toLocaleTimeString()}`);
        } catch (error) {
          console.warn("Geocoding failed:", error);
          const fallbackLocation = {
            latitude,
            longitude,
            city: "Unknown",
            countryName: "Unknown",
            fullAddress: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
            timestamp: new Date().toISOString()
          };
          setLocation(fallbackLocation);
          setLocationDisplay(`📍 ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          setLocationStatus("Location detected (coordinates only)");
        } finally {
          setIsLocationLoading(false);
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
          default:
            statusMessage = "An unknown error occurred";
        }
        
        setLocationDisplay(`📍 ${errorMessage}`);
        setLocationStatus(statusMessage);
        setLocation(null);
        setIsLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000
      }
    );
  }

  useEffect(() => {
    fetchLocation();
  }, []);

  // File validation helpers
  function validateFile(file, allowedTypes, maxSizeMB) {
    if (!file) return false;
    const isValidType = allowedTypes.includes(file.type);
    const isValidSize = file.size <= maxSizeMB * 1024 * 1024;
    return isValidType && isValidSize;
  }
  
  function validateAll() {
    const isSignatureValid = signature && validateFile(
      signature,
      ["image/png", "image/jpeg", "image/jpg"],
      5
    );
    const isResumeValid = resume && validateFile(
      resume,
      [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ],
      10
    );
    
    const isValid = isSignatureValid && isResumeValid;
    setCanProceed(isValid);
    return isValid;
  }

  // Update file name displays and validate
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
      const totalSize = Array.from(additionalDocs).reduce((sum, file) => sum + file.size, 0);
      const fileNames = Array.from(additionalDocs).map(f => f.name).join(", ");
      setAddDocsFileNames(`Selected: ${fileNames} (Total: ${(totalSize / 1024 / 1024).toFixed(2)} MB)`);
    } else {
      setAddDocsFileNames("");
    }
    
    validateAll();
  }, [signature, resume, additionalDocs]);

  // Error display helpers
  function showError(field, message) {
    setErrors(prev => ({ ...prev, [field]: message }));
  }
  
  function clearError(field) {
    setErrors(prev => ({ ...prev, [field]: "" }));
  }

  function clearAllErrors() {
    setErrors(initialErrors);
  }

  // Validate individual fields
  function validateSignature() {
    if (!signature) {
      showError("signature", "Please upload a signature file.");
      return false;
    }
    
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    const maxSizeMB = 5;
    
    if (!allowedTypes.includes(signature.type)) {
      showError("signature", "Please upload a valid signature file (PNG, JPG, JPEG only).");
      return false;
    }
    
    if (signature.size > maxSizeMB * 1024 * 1024) {
      showError("signature", `Signature file must be smaller than ${maxSizeMB}MB.`);
      return false;
    }
    
    clearError("signature");
    return true;
  }

  function validateResume() {
    if (!resume) {
      showError("resume", "Please upload a resume file.");
      return false;
    }
    
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];
    const maxSizeMB = 10;
    
    if (!allowedTypes.includes(resume.type)) {
      showError("resume", "Please upload a valid resume file (PDF, DOC, DOCX only).");
      return false;
    }
    
    if (resume.size > maxSizeMB * 1024 * 1024) {
      showError("resume", `Resume file must be smaller than ${maxSizeMB}MB.`);
      return false;
    }
    
    clearError("resume");
    return true;
  }

  // Save button logic - Fixed
  async function handleSave() {
    if (isSaving) return; // Prevent multiple saves
    
    setIsSaving(true);
    setSaveBtnText("Saving...");
    clearAllErrors();
    
    try {
      // Validate required fields
      const isSignatureValid = validateSignature();
      const isResumeValid = validateResume();
      
      if (!isSignatureValid || !isResumeValid) {
        setSuccessMessage("Please correct the errors before saving.");
        setTimeout(() => setSuccessMessage(""), 4000);
        return;
      }
      
      // Prepare form data
      const formData = {
        signature: signature ? {
          name: signature.name,
          size: signature.size,
          type: signature.type,
          lastModified: signature.lastModified
        } : null,
        resume: resume ? {
          name: resume.name,
          size: resume.size,
          type: resume.type,
          lastModified: resume.lastModified
        } : null,
        additionalDocs: additionalDocs.length ? Array.from(additionalDocs).map(f => ({
          name: f.name,
          size: f.size,
          type: f.type,
          lastModified: f.lastModified
        })) : [],
        location: location,
        submissionDateTime: new Date().toISOString(),
        savedAt: new Date().toLocaleString(),
        formType: "documentUpload",
        version: "1.0"
      };
      
      // Simulate saving process (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Success message
      const locationText = location 
        ? `${location.city}, ${location.countryName}` 
        : "Not detected";
      
      setSuccessMessage(
        `Document Details Saved Successfully! ✅\n` +
        `Saved at: ${formData.savedAt}\n` +
        `Signature: ${formData.signature ? formData.signature.name : "N/A"}\n` +
        `Resume: ${formData.resume ? formData.resume.name : "N/A"}\n` +
        `Additional Docs: ${formData.additionalDocs.length} file(s)\n` +
        `Location: ${locationText}`
      );
      
      setSaveBtnText("Saved ✓");
      
      // Data is already auto-saved via useEffect
      console.log('Form data saved:', formData);
      
      // Reset save button after delay
      setTimeout(() => {
        setSuccessMessage("");
        setSaveBtnText("Save");
      }, 4000);
      
    } catch (error) {
      console.error('Save error:', error);
      setSuccessMessage("Error saving document details. Please try again.");
      setTimeout(() => setSuccessMessage(""), 4000);
    } finally {
      setIsSaving(false);
      if (saveBtnText === "Saving...") {
        setSaveBtnText("Save");
      }
    }
  }

  // Navigation
  function handleBack() {
    console.log('Navigate to skills page');
    navigate('/skills');
  }
  
  function handleNext() {
    if (!validateAll()) {
      setSuccessMessage("Please ensure all required fields are valid before proceeding.");
      setTimeout(() => setSuccessMessage(""), 3000);
      return;
    }
    
    const finalFormData = {
      signature: signature ? {
        name: signature.name,
        size: signature.size,
        type: signature.type,
        lastModified: signature.lastModified
      } : null,
      resume: resume ? {
        name: resume.name,
        size: resume.size,
        type: resume.type,
        lastModified: resume.lastModified
      } : null,
      additionalDocs: additionalDocs.length ? Array.from(additionalDocs).map(f => ({
        name: f.name,
        size: f.size,
        type: f.type,
        lastModified: f.lastModified
      })) : [],
      location: location,
      submissionDateTime: new Date().toISOString()
    };
    
    console.log('Navigate to professional page', finalFormData);
    navigate('/professional', { state: finalFormData });
  }

  // File input handlers
  function handleFileChange(e, field) {
    const files = e.target.files;
    
    if (field === "signature") {
      const file = files && files[0] ? files[0] : null;
      setSignature(file);
      if (file) {
        // Clear any existing error when file is selected
        clearError("signature");
        // Auto-save indication
        setSuccessMessage("📁 Signature file selected and auto-saved!");
        setTimeout(() => setSuccessMessage(""), 2000);
      }
    }
    
    if (field === "resume") {
      const file = files && files[0] ? files[0] : null;
      setResume(file);
      if (file) {
        // Clear any existing error when file is selected
        clearError("resume");
        // Auto-save indication
        setSuccessMessage("📁 Resume file selected and auto-saved!");
        setTimeout(() => setSuccessMessage(""), 2000);
      }
    }
    
    if (field === "additionalDocs") {
      setAdditionalDocs(files ? files : []);
      if (files && files.length > 0) {
        setSuccessMessage("📁 Additional documents selected and auto-saved!");
        setTimeout(() => setSuccessMessage(""), 2000);
      }
    }
  }

  // Clear saved data function
  function clearSavedData() {
    try {
      localStorage.removeItem('documentUploadFormData');
      // Reset form
      setSignature(null);
      setResume(null);
      setAdditionalDocs([]);
      setSigFileName("");
      setResumeFileName("");
      setAddDocsFileNames("");
      setLocation(null);
      setLocationDisplay("📍 Detecting location...");
      setLocationStatus("Please allow location access");
      clearAllErrors();
      setSuccessMessage("🗑️ All saved data cleared!");
      setTimeout(() => setSuccessMessage(""), 2000);
      
      // Refresh location
      fetchLocation();
    } catch (error) {
      console.error('Error clearing saved data:', error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full max-w-5xl animate-fadeInUp max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-8">
          <h1 className="text-blue-500 text-4xl font-bold mb-2">Bandy & Moot</h1>
          <p className="text-gray-600 text-lg">Document Upload</p>
        </div>

        {successMessage && (
          <div className={`border px-4 py-3 rounded-xl mb-6 text-center font-semibold whitespace-pre-line ${
            successMessage.includes('Successfully') || successMessage.includes('✅')
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            {successMessage}
          </div>
        )}

        <div autoComplete="off" onSubmit={e => e.preventDefault()}>
          {/* Location & Date/Time Section */}
          <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-gray-200 mb-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <h2 className="text-xl font-bold text-center mb-6 pb-4 border-b-2 border-gray-200 text-gray-800">
              Current Information
            </h2>
            
            <div className="mb-5">
              <label className="block font-semibold mb-2 text-gray-800">Current Date & Time</label>
              <div className="bg-black/10 p-3 rounded-lg text-center font-semibold">
                {currentDateTime}
              </div>
            </div>
            
            <div className="mb-5">
              <label className="block font-semibold mb-2 text-gray-800">Current Place</label>
              <div className="bg-blue-50 p-4 rounded-lg text-center font-semibold border-2 border-blue-200">
                <div className="text-blue-800">{locationDisplay}</div>
                <div className="text-sm mt-2 opacity-80 text-blue-700">
                  {locationStatus}
                </div>
                <button
                  type="button"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm mt-3 transition-all duration-300 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={fetchLocation}
                  disabled={isLocationLoading}
                >
                  {isLocationLoading ? '🔄 Locating...' : '🔄 Refresh Location'}
                </button>
              </div>
            </div>
          </div>

          {/* Documents Section */}
          <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-gray-200 mb-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">
                Documents & Signature
              </h2>
              <button
                type="button"
                onClick={clearSavedData}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm transition-all duration-300"
                title="Clear all saved data"
              >
                🗑️ Clear Data
              </button>
            </div>
            
            {/* Signature Upload */}
            <div className="mb-5">
              <label className="block font-semibold mb-2 text-gray-800">
                Digital Signature Upload <span className="text-red-500 ml-1">*</span>
              </label>
              <div
                className={`border-2 border-dashed rounded-lg p-5 text-center transition-all duration-300 cursor-pointer ${
                  errors.signature 
                    ? 'border-red-300 bg-red-50 hover:border-red-400' 
                    : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50'
                }`}
                onClick={() => sigInputRef.current && sigInputRef.current.click()}
              >
                <div className="text-2xl mb-2">✍️</div>
                <div className="text-gray-700">Click to upload your signature</div>
                <div className="text-sm opacity-70 mt-1 text-gray-600">
                  Accepted formats: PNG, JPG, JPEG (Max 5MB)
                </div>
              </div>
              <input
                type="file"
                ref={sigInputRef}
                accept=".png,.jpg,.jpeg"
                className="hidden"
                onChange={e => handleFileChange(e, "signature")}
                required
              />
              {errors.signature && (
                <div className="text-red-500 text-sm mt-2 font-semibold">{errors.signature}</div>
              )}
              {sigFileName && (
                <div className="mt-2 text-sm text-green-600 font-semibold">
                  {sigFileName}
                  {sigFileName.includes("Previously selected") && (
                    <div className="text-xs text-amber-600 mt-1">
                      ⚠️ Please re-select file to continue (files cannot be restored)
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Resume Upload */}
            <div className="mb-5">
              <label className="block font-semibold mb-2 text-gray-800">
                Resume Upload <span className="text-red-500 ml-1">*</span>
              </label>
              <div
                className={`border-2 border-dashed rounded-lg p-5 text-center transition-all duration-300 cursor-pointer ${
                  errors.resume 
                    ? 'border-red-300 bg-red-50 hover:border-red-400' 
                    : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50'
                }`}
                onClick={() => resumeInputRef.current && resumeInputRef.current.click()}
              >
                <div className="text-2xl mb-2">📄</div>
                <div className="text-gray-700">Click to upload your resume</div>
                <div className="text-sm opacity-70 mt-1 text-gray-600">
                  Accepted formats: PDF, DOC, DOCX (Max 10MB)
                </div>
              </div>
              <input
                type="file"
                ref={resumeInputRef}
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={e => handleFileChange(e, "resume")}
                required
              />
              {errors.resume && (
                <div className="text-red-500 text-sm mt-2 font-semibold">{errors.resume}</div>
              )}
              {resumeFileName && (
                <div className="mt-2 text-sm text-green-600 font-semibold">
                  {resumeFileName}
                  {resumeFileName.includes("Previously selected") && (
                    <div className="text-xs text-amber-600 mt-1">
                      ⚠️ Please re-select file to continue (files cannot be restored)
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Additional Documents */}
            <div className="mb-5">
              <label className="block font-semibold mb-2 text-gray-800">
                Additional Documents (Optional)
              </label>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-5 text-center transition-all duration-300 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50"
                onClick={() => addDocsInputRef.current && addDocsInputRef.current.click()}
              >
                <div className="text-2xl mb-2">📎</div>
                <div className="text-gray-700">Click to upload additional documents</div>
                <div className="text-sm opacity-70 mt-1 text-gray-600">
                  Certificates, Portfolio, etc. (Max 15MB each)
                </div>
              </div>
              <input
                type="file"
                ref={addDocsInputRef}
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                multiple
                className="hidden"
                onChange={e => handleFileChange(e, "additionalDocs")}
              />
              {addDocsFileNames && (
                <div className="mt-2 text-sm text-green-600 font-semibold">
                  {addDocsFileNames}
                  {addDocsFileNames.includes("Previously selected") && (
                    <div className="text-xs text-amber-600 mt-1">
                      ⚠️ Please re-select files to continue (files cannot be restored)
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Button Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <button
              type="button"
              className="bg-gradient-to-r from-gray-500 to-gray-600 text-white py-4 px-6 rounded-2xl font-bold uppercase tracking-wider transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              onClick={handleBack}
            >
              Back
            </button>
            
            <button
              type="button"
              className={`py-4 px-6 rounded-2xl font-bold uppercase tracking-wider transition-all duration-300 ${
                isSaving
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:-translate-y-1 hover:shadow-lg'
              }`}
              onClick={handleSave}
              disabled={isSaving}
            >
              {saveBtnText}
            </button>
            
            <button
              type="button"
              className={`py-4 px-6 rounded-2xl font-bold uppercase tracking-wider transition-all duration-300 ${
                canProceed
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:-translate-y-1 hover:shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!canProceed}
              onClick={handleNext}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DocumentUploadForm;