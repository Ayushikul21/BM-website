import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";

const ProfessionalReferencesForm = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const [successPage, setSuccessPage] = useState(false);
  const navigate = useNavigate();

const styles = `
* { margin: 0; padding: 0; box-sizing: border-box; }
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
.reference-section {
    background: #f8f9fa;
    border-radius: 15px;
    padding: 25px;
    margin-bottom: 25px;
    border: 2px solid #e1e5e9;
    transition: all 0.3s ease;
}
.reference-section:hover {
    border-color: #667eea;
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.1);
}
.reference-title {
    color: #333;
    font-size: 1.3rem;
    font-weight: 600;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
}
.reference-title::before {
    content: "";
    width: 4px;
    height: 25px;
    background: #667eea;
    margin-right: 10px;
    border-radius: 2px;
}
.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 20px;
}
.form-group { position: relative; }
.form-group.full-width { grid-column: 1 / -1; }
.form-group label {
    display: block;
    color: #333;
    font-weight: 600;
    margin-bottom: 8px;
    font-size: 0.95rem;
}
.form-group input,
.form-group select {
    width: 100%;
    padding: 15px 20px;
    border: 2px solid #e1e5e9;
    border-radius: 12px;
    font-size: 1rem;
    transition: all 0.3s ease;
    background: white;
}
.form-group input:focus,
.form-group select:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    transform: translateY(-2px);
}
.button-container { margin-top: 30px; }
.back-link {
    display: inline-block;
    padding: 15px 25px;
    color: #667eea;
    border: 2px solid #667eea;
    background: transparent;
    border-radius: 12px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    margin-bottom: 15px;
}
.back-link:hover {
    background: #667eea;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
}
.action-buttons { display: flex; gap: 15px; }
.action-buttons > * { flex: 1; }
.submit-button {
    flex: 1;
    padding: 15px;
    background: #667eea;
    color: white;
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
.submit-button:hover {
    background: #5a6fd8;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
}
.download-button {
    flex: 1;
    padding: 15px;
    background: #28a745;
    color: white;
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
.download-button:hover {
    background: #218838;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(40, 167, 69, 0.3);
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
}
.download-link {
    display: inline-block;
    margin-top: 10px;
    padding: 8px 16px;
    background: #28a745;
    color: white;
    text-decoration: none;
    border-radius: 8px;
    font-size: 0.9rem;
    transition: all 0.3s ease;
}
.download-link:hover {
    background: #218838;
    transform: translateY(-1px);
}
.success-page {
    display: none;
    text-align: center;
    animation: fadeIn 0.8s ease-out;
}
.success-page.show { display: block; }
.success-page h1 {
    color: #28a745;
    font-size: 3rem;
    margin-bottom: 20px;
    animation: bounceIn 1s ease-out;
}
.success-page .checkmark {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: #28a745;
    margin: 0 auto 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: scaleIn 0.6s ease-out 0.2s both;
}
.success-page .checkmark::after {
    content: "✓";
    color: white;
    font-size: 2.5rem;
    font-weight: bold;
}
.success-page p {
    color: #666;
    font-size: 1.2rem;
    margin-bottom: 30px;
    line-height: 1.6;
}
.success-page .app-id {
    background: #f8f9fa;
    padding: 15px;
    border-radius: 12px;
    margin: 20px 0;
    font-family: 'Courier New', monospace;
    font-size: 1.1rem;
    color: #333;
    border: 2px solid #e1e5e9;
}
.success-page .download-pdf-btn {
    background: #28a745;
    color: white;
    padding: 15px 30px;
    border: none;
    border-radius: 12px;
    font-size: 1.2rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    margin: 20px 10px;
    display: inline-block;
    text-decoration: none;
}
.success-page .download-pdf-btn:hover {
    background: #218838;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(40, 167, 69, 0.3);
}
.success-page .login-btn {
    background: #007bff;
    color: white;
    padding: 15px 30px;
    border: none;
    border-radius: 12px;
    font-size: 1.2rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    margin: 20px 10px;
    display: inline-block;
    text-decoration: none;
}
.success-page .login-btn:hover {
    background: #0056b3;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 123, 255, 0.3);
}
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px);}
    to { opacity: 1; transform: translateY(0);}
}
@keyframes bounceIn {
    0% { transform: scale(0.3); opacity: 0;}
    50% { transform: scale(1.05);}
    70% { transform: scale(0.9);}
    100% { transform: scale(1); opacity: 1;}
}
@keyframes scaleIn {
    from { transform: scale(0); opacity: 0;}
    to { transform: scale(1); opacity: 1;}
}
@media (max-width: 768px) {
    .form-row { grid-template-columns: 1fr; gap: 15px;}
    .container { padding: 25px; margin: 10px;}
    .form-header h1 { font-size: 2rem; }
    .action-buttons { flex-direction: column; gap: 10px;}
    .action-buttons > * { flex: none;}
    .reference-section { padding: 20px;}
}
`;

const handleBack = () => {
  navigate('/document');
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
    return JSON.parse(localStorage.getItem(key) || "{}");
  } catch {
    return {};
  }
}
function loadAllSavedData(refData) {
  // You can adjust section keys as needed
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
  const doc = new jsPDF();
  let yPosition = 20;
  const lineHeight = 8;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;

  function checkPageBreak() {
    if (yPosition > pageHeight - 30) {
      doc.addPage();
      yPosition = 20;
    }
  }

  doc.setFontSize(20);
  doc.setFont(undefined, "bold");
  doc.text("BANDY & MOOT - COMPLETE APPLICATION", margin, yPosition);
  yPosition += 15;

  doc.setFontSize(12);
  doc.setFont(undefined, "normal");
  doc.text(`Generated on: ${new Date().toLocaleString()}`, margin, yPosition);
  yPosition += 15;

  const allData = loadAllSavedData(refData);

  yPosition = addSectionToPDF(doc, "PERSONAL INFORMATION", allData.personal, yPosition, lineHeight, margin);
  yPosition = addSectionToPDF(doc, "PARENT/GUARDIAN INFORMATION", allData.parent, yPosition, lineHeight, margin);
  yPosition = addSectionToPDF(doc, "EDUCATION INFORMATION", allData.education, yPosition, lineHeight, margin);
  yPosition = addSectionToPDF(doc, "EMPLOYMENT HISTORY", allData.employment, yPosition, lineHeight, margin);
  yPosition = addSectionToPDF(doc, "MEDICAL INFORMATION", allData.medical, yPosition, lineHeight, margin);
  yPosition = addSectionToPDF(doc, "EMERGENCY CONTACT", allData.emergency, yPosition, lineHeight, margin);
  yPosition = addSectionToPDF(doc, "PROFESSIONAL REFERENCES", allData.references, yPosition, lineHeight, margin);

  // Footer
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      `Page ${i} of ${totalPages}`,
      doc.internal.pageSize.width - 30,
      doc.internal.pageSize.height - 10
    );
    doc.text(
      "Bandy & Moot Registration System",
      margin,
      doc.internal.pageSize.height - 10
    );
  }
  return doc;
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

  // Style loader
  useEffect(() => {
    let styleTag = document.getElementById("professional-references-form-styles");
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = "professional-references-form-styles";
      styleTag.innerHTML = styles;
      document.head.appendChild(styleTag);
    }
  }, []);

  // Load from localStorage if available
  useEffect(() => {
    try {
      if (typeof Storage !== "undefined" && localStorage) {
        const savedData = localStorage.getItem("referencesFormData");
        if (savedData) {
          const data = JSON.parse(savedData);
          if (data.reference) {
            setRefData({
              ref2Name: data.reference.name || "",
              ref2Relationship: data.reference.relationship || "",
              ref2Phone: data.reference.phone || "",
              ref2Email: data.reference.email || "",
              ref2Company: data.reference.company || "",
              ref2Position: data.reference.position || ""
            });
          }
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
    try {
      localStorage.setItem("referencesFormData", JSON.stringify(toSave));
    } catch {}
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
        `<strong>📄 Complete Application PDF Downloaded!</strong><br>
        <small>File includes all registration data from all pages</small>`
      );
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      alert("Error generating PDF. Please try again.");
    }
    navigate('/login');
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
    try {
      localStorage.setItem(
        "referencesFormData",
        JSON.stringify({
          reference: {
            name: refData.ref2Name,
            relationship: refData.ref2Relationship,
            phone: refData.ref2Phone,
            email: refData.ref2Email,
            company: refData.ref2Company,
            position: refData.ref2Position
          },
          submittedAt: new Date().toLocaleString()
        })
      );
      localStorage.setItem("applicationCompleted", "true");
      localStorage.setItem(
        "applicationCompletedAt",
        new Date().toLocaleString()
      );
      localStorage.setItem("applicationId", `BM-${Date.now()}`);
    } catch {}
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
    <div className="container">
      <div className="form-header">
        <h1>Bandy & Moot</h1>
      </div>
      {successMessage && (
        <div
          className="success-message"
          id="successMessage"
          style={{ display: "block" }}
          dangerouslySetInnerHTML={{ __html: successMessage }}
        />
      )}
      <div className={`success-page${successPage ? " show" : ""}`} id="successPage">
        <div className="checkmark"></div>
        <h1>🎉 Success!</h1>
        <p>
          Your application has been successfully submitted!
          <br />
        </p>
        <div>
          <button
            className="download-pdf-btn"
            id="successDownloadBtn"
            type="button"
            onClick={handleSuccessDownload}
          >
            📄 Download Complete Application PDF
          </button>
          <a href="/login-trigger" className="login-btn">
            🔐 Login to Portal
          </a>
        </div>
      </div>
      {!successPage && (
        <form id="referencesForm" autoComplete="off" onSubmit={handleSubmit}>
          <div className="reference-section">
            <div className="reference-title">Professional Reference</div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="ref2Name">Reference Name</label>
                <input
                  type="text"
                  id="ref2Name"
                  name="ref2Name"
                  placeholder="Enter reference name"
                  value={refData.ref2Name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="ref2Relationship">Relationship</label>
                <select
                  id="ref2Relationship"
                  name="ref2Relationship"
                  value={refData.ref2Relationship}
                  onChange={handleInputChange}
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
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="ref2Phone">Phone Number</label>
                <input
                  type="tel"
                  id="ref2Phone"
                  name="ref2Phone"
                  placeholder="Enter phone number"
                  value={refData.ref2Phone}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="ref2Email">Email Address</label>
                <input
                  type="email"
                  id="ref2Email"
                  name="ref2Email"
                  placeholder="Enter email address"
                  value={refData.ref2Email}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="ref2Company">Company/Organization</label>
                <input
                  type="text"
                  id="ref2Company"
                  name="ref2Company"
                  placeholder="Enter company name"
                  value={refData.ref2Company}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="ref2Position">Position Title</label>
                <input
                  type="text"
                  id="ref2Position"
                  name="ref2Position"
                  placeholder="Enter position title"
                  value={refData.ref2Position}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          <div className="button-container">
            <button onClick={handleBack} className="back-link">
              ← Back
            </button>
            <div className="action-buttons">
              <button
                type="submit"
                id="submitButton"
                className="submit-button"
              >
                Submit Application
              </button>
              <button
                type="button"
                id="downloadButton"
                className="download-button"
                onClick={handleDownloadPDF}
              >
                📄 Download PDF
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProfessionalReferencesForm;