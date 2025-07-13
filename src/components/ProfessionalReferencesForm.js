import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProfessionalReferencesForm = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const [successPage, setSuccessPage] = useState(false);
  const navigate = useNavigate();

  const handleBack = () => {
    // Navigate back to document page
    navigate('/document')
  }

  const handleLogin = () => {
    navigate('/login')
  }

  const referenceFields = [
    "ref2Name",
    "ref2Relationship",
    "ref2Phone",
    "ref2Email",
    "ref2Company",
    "ref2Position"
  ];

  // Validation helpers
  function validateEmail(email) {
    if (!email) return true;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
  function validatePhone(phone) {
    if (!phone) return true;
    const re = /^[\d\s\-\+\(\)]{10,}$/;
    return re.test(phone.replace(/\s/g, ""));
  }

  function loadSectionData(key) {
    try {
      const data = {
        personalFormData: { name: "John Doe", email: "john@example.com" },
        parentFormData: { parentName: "Jane Doe", parentPhone: "123-456-7890" },
        educationFormData: { school: "University of Example", degree: "Bachelor's" },
        employmentFormData: { company: "Example Corp", position: "Developer" },
        medicalFormData: { allergies: "None", medications: "None" },
        emergencyFormData: { emergencyName: "Jane Doe", emergencyPhone: "123-456-7890" }
      };
      return data[key] || {};
    } catch {
      return {};
    }
  }
  function loadAllSavedData(refData) {
    return {
      personal: loadSectionData("personalFormData"),
      parent: loadSectionData("parentFormData"),
      education: loadSectionData("educationFormData"),
      employment: loadSectionData("employmentFormData"),
      medical: loadSectionData("medicalFormData"),
      emergency: loadSectionData("emergencyFormData"),
      references: refData ? { reference: refData } : {}
    };
  }

  function addSectionToPDF(doc, title, data, yPosition, lineHeight, margin) {
    const pageHeight = doc.internal.pageSize.height;
    function checkPageBreak() {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }
    }
    checkPageBreak();
    doc.setFontSize(16);
    doc.setFont(undefined, "bold");
    doc.text(title, margin, yPosition);
    yPosition += lineHeight + 2;
    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    if (data && typeof data === "object") {
      Object.entries(data).forEach(([key, value]) => {
        if (value && typeof value === "object") {
          Object.entries(value).forEach(([subKey, subValue]) => {
            if (subValue) {
              checkPageBreak();
              const label = subKey
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, str => str.toUpperCase());
              doc.text(`${label}: ${subValue}`, margin + 5, yPosition);
              yPosition += lineHeight;
            }
          });
        } else if (value) {
          checkPageBreak();
          const label = key
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, str => str.toUpperCase());
          doc.text(`${label}: ${value}`, margin + 5, yPosition);
          yPosition += lineHeight;
        }
      });
    }
    yPosition += 5;
    return yPosition;
  }

  function generateCompletePDF(refData) {
    // Mock PDF generation for demo
    const mockPDF = {
      save: (filename) => {
        console.log(`PDF saved as: ${filename}`);
        // In real implementation, this would generate actual PDF
      }
    };
    return mockPDF;
  }

  const initialRefState = {
    ref2Name: "",
    ref2Relationship: "",
    ref2Phone: "",
    ref2Email: "",
    ref2Company: "",
    ref2Position: ""
  };

  const [refData, setRefData] = useState({ ...initialRefState });

  // Load from state if available
  useEffect(() => {
    try {
      const savedData = {
        reference: {
          name: "Dr. Smith",
          relationship: "supervisor",
          phone: "555-123-4567",
          email: "dr.smith@example.com",
          company: "Example Medical Center",
          position: "Chief Medical Officer"
        },
        savedAt: new Date().toLocaleString()
      };
      
      if (savedData.reference) {
        setRefData({
          ref2Name: savedData.reference.name || "",
          ref2Relationship: savedData.reference.relationship || "",
          ref2Phone: savedData.reference.phone || "",
          ref2Email: savedData.reference.email || "",
          ref2Company: savedData.reference.company || "",
          ref2Position: savedData.reference.position || ""
        });
      }
      setSuccessMessage(
        `Previously saved data loaded - Last saved: ${savedData.savedAt || "Unknown"}`
      );
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (e) {
      // ignore
    }
  }, []);

  // Auto-save on change
  useEffect(() => {
    const toSave = {
      reference:
        refData.ref2Name || refData.ref2Relationship || refData.ref2Phone || refData.ref2Email || refData.ref2Company || refData.ref2Position
          ? {
              name: refData.ref2Name,
              relationship: refData.ref2Relationship,
              phone: refData.ref2Phone,
              email: refData.ref2Email,
              company: refData.ref2Company,
              position: refData.ref2Position
            }
          : null,
      savedAt: new Date().toLocaleString()
    };
    // In real implementation, this would save to localStorage
    console.log("Auto-saved data:", toSave);
  }, [refData]);


  function handleInputChange(e) {
    const { name, value } = e.target;
    let newValue = value;
    if (name === "ref2Phone") {
      newValue = value.replace(/[^0-9\s\-\+\(\)]/g, "");
    }
    setRefData(prev => ({
      ...prev,
      [name]: newValue
    }));
  }

  // Download PDF
  function handleDownloadPDF() {
    try {
      const doc = generateCompletePDF({
        name: refData.ref2Name,
        relationship: refData.ref2Relationship,
        phone: refData.ref2Phone,
        email: refData.ref2Email,
        company: refData.ref2Company,
        position: refData.ref2Position
      });
      doc.save(`bandy-moot-complete-application-${Date.now()}.pdf`);
      setSuccessMessage(
        "📄 Complete Application PDF Downloaded! File includes all registration data from all pages"
      );
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      alert("Error generating PDF. Please try again.");
    }
  }

  // Submit
  function handleSubmit(e) {
    e.preventDefault();
    // Validate email and phone if present
    if (refData.ref2Email && !validateEmail(refData.ref2Email)) {
      alert("Please enter a valid email address.");
      return;
    }
    if (refData.ref2Phone && !validatePhone(refData.ref2Phone)) {
      alert("Please enter a valid phone number.");
      return;
    }
    // Save current form data
    const formData = {
      reference: {
        name: refData.ref2Name,
        relationship: refData.ref2Relationship,
        phone: refData.ref2Phone,
        email: refData.ref2Email,
        company: refData.ref2Company,
        position: refData.ref2Position
      },
      submittedAt: new Date().toLocaleString()
    };
    
    // In real implementation, this would save to localStorage
    console.log("Submitted data:", formData);
    console.log("Application completed:", true);
    console.log("Application ID:", `BM-${Date.now()}`);
    
    setSuccessPage(true);
  }

  // Success page download
  function handleSuccessDownload() {
    try {
      const doc = generateCompletePDF({
        name: refData.ref2Name,
        relationship: refData.ref2Relationship,
        phone: refData.ref2Phone,
        email: refData.ref2Email,
        company: refData.ref2Company,
        position: refData.ref2Position
      });
      doc.save(`bandy-moot-complete-application-${Date.now()}.pdf`);
    } catch (error) {
      alert("Error generating PDF. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full max-w-5xl animate-fadeInUp max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-8">
          <h1 className="text-blue-500 text-4xl font-bold mb-3">Bandy & Moot</h1>
        </div>
        
        {successMessage && (
          <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-xl mb-5 text-center">
            {successMessage}
          </div>
        )}
        
        {successPage && (
          <div className="text-center animate-[fadeIn_0.8s_ease-out]">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-[scaleIn_0.6s_ease-out_0.2s_both]">
              <span className="text-white text-4xl font-bold">✓</span>
            </div>
            <h1 className="text-green-500 text-5xl font-bold mb-5 animate-[bounceIn_1s_ease-out]">
              🎉 Success!
            </h1>
            <p className="text-gray-600 text-xl mb-8 leading-relaxed">
              Your application has been successfully submitted!
            </p>
            <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl text-xl font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-lg block w-full sm:w-auto"
                onClick={handleSuccessDownload}
              >
                📄 Download Complete Application PDF
              </button>
              <button
                onClick={handleLogin}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-xl text-xl font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-lg block w-full sm:w-auto text-center"
              >
                🔐 Login to Portal
              </button>
            </div>
          </div>
        )}
        
        {!successPage && (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200 hover:border-indigo-400 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-center mb-5">
                <div className="w-1 h-6 bg-indigo-500 rounded-full mr-3"></div>
                <h2 className="text-gray-800 text-xl font-semibold">Professional Reference</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label htmlFor="ref2Name" className="block text-gray-700 font-semibold mb-2">
                    Reference Name
                  </label>
                  <input
                    type="text"
                    id="ref2Name"
                    name="ref2Name"
                    placeholder="Enter reference name"
                    value={refData.ref2Name}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-indigo-500 focus:shadow-lg focus:-translate-y-1 bg-white"
                  />
                </div>
                <div>
                  <label htmlFor="ref2Relationship" className="block text-gray-700 font-semibold mb-2">
                    Relationship
                  </label>
                  <select
                    id="ref2Relationship"
                    name="ref2Relationship"
                    value={refData.ref2Relationship}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-indigo-500 focus:shadow-lg focus:-translate-y-1 bg-white"
                  >
                    <option value="">Select relationship</option>
                    <option value="supervisor">Supervisor</option>
                    <option value="manager">Manager</option>
                    <option value="colleague">Colleague</option>
                    <option value="family">Family</option>
                    <option value="client">Client</option>
                    <option value="mentor">Mentor</option>
                    <option value="business_partner">Business Partner</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label htmlFor="ref2Phone" className="block text-gray-700 font-semibold mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="ref2Phone"
                    name="ref2Phone"
                    placeholder="Enter phone number"
                    value={refData.ref2Phone}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-indigo-500 focus:shadow-lg focus:-translate-y-1 bg-white"
                  />
                </div>
                <div>
                  <label htmlFor="ref2Email" className="block text-gray-700 font-semibold mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="ref2Email"
                    name="ref2Email"
                    placeholder="Enter email address"
                    value={refData.ref2Email}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-indigo-500 focus:shadow-lg focus:-translate-y-1 bg-white"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="ref2Company" className="block text-gray-700 font-semibold mb-2">
                    Company/Organization
                  </label>
                  <input
                    type="text"
                    id="ref2Company"
                    name="ref2Company"
                    placeholder="Enter company name"
                    value={refData.ref2Company}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-indigo-500 focus:shadow-lg focus:-translate-y-1 bg-white"
                  />
                </div>
                <div>
                  <label htmlFor="ref2Position" className="block text-gray-700 font-semibold mb-2">
                    Position Title
                  </label>
                  <input
                    type="text"
                    id="ref2Position"
                    name="ref2Position"
                    placeholder="Enter position title"
                    value={refData.ref2Position}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-indigo-500 focus:shadow-lg focus:-translate-y-1 bg-white"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <button 
                type="button"
                onClick={handleBack} 
                className="w-full sm:w-auto px-6 py-4 text-indigo-500 border-2 border-indigo-500 bg-transparent rounded-xl text-lg font-semibold transition-all duration-300 hover:bg-indigo-500 hover:text-white hover:-translate-y-1 hover:shadow-lg"
              >
                ← Back
              </button>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex-1 px-6 py-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-lg font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  Submit Application
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounceIn {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default ProfessionalReferencesForm;