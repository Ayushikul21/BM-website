import React, { useRef, useState } from "react";

// If you want to use jsPDF and html2canvas, install them in your React project:
// npm install jspdf html2canvas
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const initialEmployeeInfo = {
  empCode: "",
  empName: "",
  department: "",
  costCentre: "",
  location: "",
  designation: "",
  dob: "",
  doj: "",
  resStatus: "",
  pfNo: "",
  esiNo: "",
  epsNo: "",
  payrollMonth: "",
  basic: "",
  hra: "",
  specialAllowance: "",
  arrearSpecial: "",
  pf: "",
  incomeTax: "",
  totalEarnings: "",
  totalDeductions: "",
  netPay: "",
};

export default function SalaryPortalPayslip() {
  const [values, setValues] = useState(initialEmployeeInfo);
  const [showPreview, setShowPreview] = useState(false);

  const payslipRef = useRef();

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === "number" ? value.replace(/^0+/, "") : value,
    }));
  };

  // Calculate totals for earnings, deductions, net pay
  const calculateTotals = () => {
    const basic = Number(values.basic) || 0;
    const hra = Number(values.hra) || 0;
    const specialAllowance = Number(values.specialAllowance) || 0;
    const arrearSpecial = Number(values.arrearSpecial) || 0;
    const pf = Number(values.pf) || 0;
    const incomeTax = Number(values.incomeTax) || 0;

    const totalEarnings = basic + hra + specialAllowance + arrearSpecial;
    const totalDeductions = pf + incomeTax;
    const netPay = totalEarnings - totalDeductions;

    setValues((v) => ({
      ...v,
      totalEarnings: totalEarnings.toFixed(2),
      totalDeductions: totalDeductions.toFixed(2),
      netPay: netPay.toFixed(2),
    }));
  };

  // Convert number to words (simple, for INR)
  const numberToWords = (num) => {
    // You can use a more robust library for this in production.
    // For now, simple implementation:
    if (isNaN(num) || num === "") return "";
    const a = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const b = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];
    function inWords(num) {
      if ((num = num.toString()).length > 9) return "Overflow";
      let n = ("000000000" + num)
        .substr(-9)
        .match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
      if (!n) return;
      let str = "";
      str +=
        n[1] !== "00"
          ? (a[Number(n[1])] || b[n[1][0]] + " " + a[n[1][1]]) + " Crore "
          : "";
      str +=
        n[2] !== "00"
          ? (a[Number(n[2])] || b[n[2][0]] + " " + a[n[2][1]]) + " Lakh "
          : "";
      str +=
        n[3] !== "00"
          ? (a[Number(n[3])] || b[n[3][0]] + " " + a[n[3][1]]) + " Thousand "
          : "";
      str +=
        n[4] !== "0"
          ? (a[Number(n[4])] || b[n[4][0]] + " " + a[n[4][1]]) + " Hundred "
          : "";
      str +=
        n[5] !== "00"
          ? (str !== "" ? "and " : "") +
            (a[Number(n[5])] || b[n[5][0]] + " " + a[n[5][1]])
          : "";
      return str.trim();
    }
    return inWords(Math.floor(num)) + " Rupees Only";
  };

  const handleDownload = async () => {
    // Show payslip preview for screenshot
    setShowPreview(true);
    setTimeout(async () => {
      const payslip = payslipRef.current;
      const canvas = await html2canvas(payslip);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, imgHeight);
      pdf.save(
        `Payslip_${values.empCode || "employee"}_${
          values.payrollMonth || ""
        }.pdf`
      );
      setShowPreview(false);
    }, 300);
  };

  // Utility for Date display
  const displayDate = (iso) =>
    iso ? new Date(iso).toLocaleDateString("en-IN") : "";

  return (
    <div>
      <style>{`
        /* Same CSS as provided in the original file, or adjust as preferred */
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          color: #333;
          line-height: 1.6;
        }
        .header {
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(10px);
          padding: 1rem 2rem;
          display: flex;
          justify-content: center;
          align-items: center;
          box-shadow: 0 2px 20px rgba(0,0,0,0.1);
          position: sticky;
          top: 0;
          z-index: 1000;
        }
        .logo {
          display: flex; align-items: center; gap: 1rem;
        }
        .logo img {
          width: 60px; height: 60px; border-radius: 50%; object-fit: cover; border:2px solid #6c5ce7;
        }
        .logo h1 {
          color: #6c5ce7; font-size: 1.8rem; font-weight: 700;
        }
        .main-content {
          padding: 2rem; max-width: 1200px; margin: 0 auto;
        }
        .form-container {
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
          margin-bottom: 2rem;
          animation: slideInUp 0.8s ease;
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(30px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .form-section { margin-bottom: 2rem;}
        .section-title {
          font-size: 1.3rem;
          font-weight: 600;
          color: #333;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #6c5ce7;
        }
        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1rem;
        }
        .form-group { display: flex; flex-direction: column;}
        .form-label { font-weight: 600; color: #333; margin-bottom: 0.5rem;}
        .form-input, .form-select {
          padding: 0.75rem;
          border: 2px solid #e0e0e0;
          border-radius: 10px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: white;
        }
        .form-input:focus, .form-select:focus {
          outline: none;
          border-color: #6c5ce7;
          box-shadow: 0 0 0 3px rgba(108,92,231,0.1);
        }
        .earnings-deductions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }
        .earnings-section, .deductions-section {
          background: #f8f9fa;
          padding: 1.5rem;
          border-radius: 15px;
          border: 2px solid #e9ecef;
        }
        .section-subtitle {
          font-size: 1.1rem;
          font-weight: 600;
          color: #495057;
          margin-bottom: 1rem;
          text-align: center;
        }
        .calculate-btn, .download-btn {
          background: linear-gradient(45deg, #6c5ce7, #a29bfe);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 15px;
          cursor: pointer;
          font-weight: 600;
          font-size: 1.1rem;
          transition: all 0.3s ease;
          width: 100%;
        }
        .calculate-btn { margin: 1rem 0;}
        .calculate-btn:hover, .download-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(108,92,231,0.3);
        }
        .download-btn { margin-top: 1rem;}
        .payslip-preview {
          background: white;
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
          overflow: hidden;
          margin-top: 2rem;
          display: ${showPreview ? "block" : "none"};
        }
        .payslip {
          padding: 2rem;
          border: 2px solid #000;
        }
        .company-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #000;
        }
        .company-logo {
          display: flex; align-items: center; gap: 1rem;
        }
        .company-logo img {
          width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border:2px solid #6c5ce7;
        }
        .company-info h3 {
          color: #333;
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
          text-align: center;
        }
        .company-details {
          font-size: 0.9rem;
          color: #666;
          text-align: center;
          line-height: 1.4;
        }
        .employee-basic-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
          padding: 1rem;
          border: 1px solid #000;
        }
        .info-item {
          display: flex;
          justify-content: space-between;
          padding: 0.25rem 0;
          border-bottom: 1px solid #ddd;
          font-size: 0.9rem;
        }
        .info-label { font-weight: 600; color: #333;}
        .info-value { color: #666;}
        .section-header {
          background: #f8f9fa;
          padding: 0.5rem;
          font-weight: bold;
          border-bottom: 1px solid #000;
          text-align: center;
        }
        .salary-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          margin-bottom: 1rem;
          border: 1px solid #000;
        }
        .earnings-preview, .deductions-preview {
          border-right: 1px solid #000;
        }
        .deductions-preview { border-right: none;}
        .salary-table { width: 100%; border-collapse: collapse;}
        .salary-table th {
          background: #f8f9fa;
          padding: 0.75rem 0.5rem;
          text-align: left;
          font-weight: bold;
          border-bottom: 1px solid #000;
          font-size: 0.9rem;
        }
        .salary-table td {
          padding: 0.5rem;
          border-bottom: 1px solid #ddd;
          font-size: 0.9rem;
        }
        .amount-column { text-align: right; font-weight: 600;}
        .ytd-column { text-align: right; color: #666;}
        .total-row { background: #f0f0f0; font-weight: bold;}
        .net-pay-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: #f8f9fa;
          border: 2px solid #000;
          margin-bottom: 1rem;
        }
        .net-pay-amount { font-size: 1.5rem; font-weight: bold; color: #10ac84;}
        .net-pay-words { font-style: italic; color: #666;}
        .footer-notes {
          font-size: 0.8rem;
          color: #666;
          line-height: 1.4;
        }
        .button-group {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-top: 1rem;
        }
        @media (max-width: 768px) {
          .header { flex-direction: column; gap: 1rem; padding: 1rem;}
          .main-content { padding: 1rem;}
          .form-grid { grid-template-columns: 1fr;}
          .earnings-deductions { grid-template-columns: 1fr;}
          .employee-basic-info { grid-template-columns: 1fr;}
          .salary-section { grid-template-columns: 1fr;}
          .payslip { padding: 1rem;}
          .button-group { grid-template-columns: 1fr;}
        }
      `}</style>
      <header className="header">
        <div className="logo">
          <img src="logob&m.jpg" alt="Bandy & Moot Logo" />
          <h1>Salary Slip</h1>
        </div>
      </header>
      <main className="main-content">
        <div className="form-container" id="formContainer">
          <form
            id="payslipForm"
            onSubmit={(e) => e.preventDefault()}
            autoComplete="off"
          >
            {/* Employee Information Section */}
            <div className="form-section">
              <h2 className="section-title">Employee Information</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Employee Code</label>
                  <input
                    type="text"
                    className="form-input"
                    name="empCode"
                    placeholder="Enter employee code"
                    value={values.empCode}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Employee Name</label>
                  <input
                    type="text"
                    className="form-input"
                    name="empName"
                    placeholder="Enter full name"
                    value={values.empName}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <input
                    type="text"
                    className="form-input"
                    name="department"
                    placeholder="Enter department"
                    value={values.department}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Cost Centre</label>
                  <input
                    type="text"
                    className="form-input"
                    name="costCentre"
                    placeholder="Enter cost centre"
                    value={values.costCentre}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    className="form-input"
                    name="location"
                    placeholder="Enter location"
                    value={values.location}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Designation</label>
                  <input
                    type="text"
                    className="form-input"
                    name="designation"
                    placeholder="Enter designation"
                    value={values.designation}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Date of Birth</label>
                  <input
                    type="date"
                    className="form-input"
                    name="dob"
                    value={values.dob}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Date of Joining</label>
                  <input
                    type="date"
                    className="form-input"
                    name="doj"
                    value={values.doj}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Residential Status</label>
                  <select
                    className="form-select"
                    name="resStatus"
                    value={values.resStatus}
                    onChange={handleChange}
                  >
                    <option value="">Select status</option>
                    <option value="Resident">Resident</option>
                    <option value="Non-Resident">Non-Resident</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">PF Number</label>
                  <input
                    type="text"
                    className="form-input"
                    name="pfNo"
                    placeholder="Enter PF number"
                    value={values.pfNo}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">ESI Number</label>
                  <input
                    type="text"
                    className="form-input"
                    name="esiNo"
                    placeholder="Enter ESI number"
                    value={values.esiNo}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">EPS Number</label>
                  <input
                    type="text"
                    className="form-input"
                    name="epsNo"
                    placeholder="Enter EPS number"
                    value={values.epsNo}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            {/* Payroll Month Section */}
            <div className="form-section">
              <h2 className="section-title">Payroll Period</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Payroll Month</label>
                  <input
                    type="month"
                    className="form-input"
                    name="payrollMonth"
                    value={values.payrollMonth}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            {/* Earnings and Deductions Section */}
            <div className="form-section">
              <h2 className="section-title">Salary Components</h2>
              <div className="earnings-deductions">
                <div className="earnings-section">
                  <h3 className="section-subtitle">💰 Earnings</h3>
                  <div className="form-group">
                    <label className="form-label">Basic Salary</label>
                    <input
                      type="number"
                      className="form-input earnings-input"
                      name="basic"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      value={values.basic}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">House Rent Allowance</label>
                    <input
                      type="number"
                      className="form-input earnings-input"
                      name="hra"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      value={values.hra}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Special Allowance</label>
                    <input
                      type="number"
                      className="form-input earnings-input"
                      name="specialAllowance"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      value={values.specialAllowance}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Arrear Special Allowance</label>
                    <input
                      type="number"
                      className="form-input earnings-input"
                      name="arrearSpecial"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      value={values.arrearSpecial}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      <strong>Total Earnings</strong>
                    </label>
                    <input
                      type="number"
                      className="form-input"
                      name="totalEarnings"
                      placeholder="0.00"
                      readOnly
                      style={{ fontWeight: "bold" }}
                      value={values.totalEarnings}
                    />
                  </div>
                </div>
                <div className="deductions-section">
                  <h3 className="section-subtitle">📉 Deductions</h3>
                  <div className="form-group">
                    <label className="form-label">Provident Fund</label>
                    <input
                      type="number"
                      className="form-input deductions-input"
                      name="pf"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      value={values.pf}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Income Tax</label>
                    <input
                      type="number"
                      className="form-input deductions-input"
                      name="incomeTax"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      value={values.incomeTax}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      <strong>Total Deductions</strong>
                    </label>
                    <input
                      type="number"
                      className="form-input"
                      name="totalDeductions"
                      placeholder="0.00"
                      readOnly
                      style={{ fontWeight: "bold" }}
                      value={values.totalDeductions}
                    />
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="calculate-btn"
                onClick={calculateTotals}
              >
                🧮 Calculate Totals
              </button>
              <div className="form-group">
                <label
                  className="form-label"
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    color: "#10ac84",
                  }}
                >
                  Net Pay
                </label>
                <input
                  type="number"
                  className="form-input"
                  name="netPay"
                  placeholder="0.00"
                  readOnly
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    color: "#10ac84",
                  }}
                  value={values.netPay}
                />
              </div>
            </div>
            <button
              type="button"
              className="download-btn"
              onClick={handleDownload}
            >
              📥 Generate & Download PDF
            </button>
          </form>
        </div>
        {/* Payslip Preview (hidden offscreen, used for PDF generation) */}
        <div
          className="payslip-preview"
          style={{
            position: "absolute",
            left: "-9999px",
            top: "-9999px",
            ...(showPreview ? { display: "block" } : {}),
          }}
        >
          <div className="payslip" id="payslipContent" ref={payslipRef}>
            <div className="company-header">
              {/* SVG Logo */}
              <img
                src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iMTAwIiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjMiLz4KPCEtLSBQZXJzb24gaWNvbiAtLT4KPHN2ZyB4PSI3MCIgeT0iNDAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cGF0aCBkPSJtOSA5IDUtNS0yLTJzLS41LTEtMS0xaC0xbC0yIDIgNSA1eiIvPgogIDxwYXRoIGQ9Im0xNSA1LTUgNSAyIDJzLjUgMSAxIDFoMWwyLTItNS01eiIvPgogIDxwYXRoIGQ9Ik0xOCA5djRhMiAyIDAgMCAxLTIgMkgxM2wtMi0yaDEuNWEuNS41IDAgMCAwIC41LS41di0yYTEgMSAwIDAgMC0xLTFIMTAiLz4KICA8cGF0aCBkPSJNNiAxNHYtNGEyIDIgMCAwIDEgMi0yaDNsMS0xaC0xLjVhLjUuNSAwIDAgMC0uNS41djJhMSAxIDAgMCAwIDEgMUgxNCIvPgo8L3N2Zz4KPCEtLSBBcnJvdyAtLT4KPHN2ZyB4PSIxMjAiIHk9IjQwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+CiAgPHBhdGggZD0ibTcgMTEgNi02IDYgNk0xMyA1djEyIi8+Cjwvc3ZnPgo8IS0tIFN0YWlycyAtLT4KPHN2ZyB4PSI0MCIgeT0iMTEwIiB3aWR0aD0iMTIwIiBoZWlnaHQ9IjYwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSIzIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPgogIDxwYXRoIGQ9Im0yMSAzLTMgOUg5bDEzIDloLTEzTDMgMTJoNloiLz4KPC9zdmc+Cjx0ZXh0IHg9IjEwMCIgeT0iMTg1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMDA5Y2RjIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtd2VpZ2h0PSJib2xkIj5CQU5EWSAmYW1wOyBNT09UPC90ZXh0Pgo8L3N2Zz4="
                alt="Bandy & Moot Logo"
                className="company-logo"
              />
              <div className="company-info">
                <h3>Bandy &amp; Moot Pvt. Ltd.</h3>
                <div className="company-details">
                  123, Main Corporate Park, New Delhi, India<br />
                  GST: 22AAAAA0000A1Z5 | CIN: U00000DL2020PTC000000
                </div>
              </div>
            </div>
            {/* Employee Info */}
            <div className="employee-basic-info">
              <div className="info-item">
                <span className="info-label">Employee Code:</span>
                <span className="info-value">{values.empCode}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Employee Name:</span>
                <span className="info-value">{values.empName}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Department:</span>
                <span className="info-value">{values.department}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Cost Centre:</span>
                <span className="info-value">{values.costCentre}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Location:</span>
                <span className="info-value">{values.location}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Designation:</span>
                <span className="info-value">{values.designation}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Date of Birth:</span>
                <span className="info-value">{displayDate(values.dob)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Date of Joining:</span>
                <span className="info-value">{displayDate(values.doj)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Residential Status:</span>
                <span className="info-value">{values.resStatus}</span>
              </div>
              <div className="info-item">
                <span className="info-label">PF Number:</span>
                <span className="info-value">{values.pfNo}</span>
              </div>
              <div className="info-item">
                <span className="info-label">ESI Number:</span>
                <span className="info-value">{values.esiNo}</span>
              </div>
              <div className="info-item">
                <span className="info-label">EPS Number:</span>
                <span className="info-value">{values.epsNo}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Payroll Month:</span>
                <span className="info-value">
                  {values.payrollMonth
                    ? new Date(`${values.payrollMonth}-01`).toLocaleString(
                        "en-US",
                        { month: "long", year: "numeric" }
                      )
                    : ""}
                </span>
              </div>
            </div>
            {/* Salary Section */}
            <div className="section-header">Salary Details</div>
            <div className="salary-section">
              <div className="earnings-preview">
                <table className="salary-table">
                  <thead>
                    <tr>
                      <th>Earnings</th>
                      <th className="amount-column">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Basic Salary</td>
                      <td className="amount-column">{values.basic}</td>
                    </tr>
                    <tr>
                      <td>House Rent Allowance</td>
                      <td className="amount-column">{values.hra}</td>
                    </tr>
                    <tr>
                      <td>Special Allowance</td>
                      <td className="amount-column">{values.specialAllowance}</td>
                    </tr>
                    <tr>
                      <td>Arrear Special Allowance</td>
                      <td className="amount-column">{values.arrearSpecial}</td>
                    </tr>
                    <tr className="total-row">
                      <td>Total Earnings</td>
                      <td className="amount-column">{values.totalEarnings}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="deductions-preview">
                <table className="salary-table">
                  <thead>
                    <tr>
                      <th>Deductions</th>
                      <th className="amount-column">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Provident Fund</td>
                      <td className="amount-column">{values.pf}</td>
                    </tr>
                    <tr>
                      <td>Income Tax</td>
                      <td className="amount-column">{values.incomeTax}</td>
                    </tr>
                    <tr className="total-row">
                      <td>Total Deductions</td>
                      <td className="amount-column">{values.totalDeductions}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            {/* Net Pay */}
            <div className="net-pay-section">
              <div>
                <span className="info-label">Net Pay: </span>
                <span className="net-pay-amount">₹{values.netPay}</span>
              </div>
              <div className="net-pay-words">
                {numberToWords(values.netPay)}
              </div>
            </div>
            <div className="footer-notes">
              <p>
                <strong>Note:</strong> This is a system generated payslip and does not require signature/stamp.
              </p>
              <p>
                For any discrepancies, please contact HR at <a href="mailto:hr@bandymoot.com">hr@bandymoot.com</a>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}