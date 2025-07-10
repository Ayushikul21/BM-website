import React, { useEffect, useState } from "react";

const initialForm = {
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
  payrollMonth: "2025-02",
  basic: "",
  hra: "",
  specialAllowance: "",
  arrearSpecial: "",
  totalEarnings: "",
  pf: "",
  incomeTax: "",
  totalDeductions: "",
  netPay: "",
};

export default function BackPayslip({ fillFromStorage = true, onBack }) {
  // fillFromStorage: if true, will auto-populate fields from localStorage 'payslipFormData'
  const [form, setForm] = useState(initialForm);

  // On mount, load values (simulate readonly payslip)
  useEffect(() => {
    if (fillFromStorage) {
      const data = localStorage.getItem("payslipFormData");
      if (data) {
        setForm(JSON.parse(data));
      }
    }
  }, [fillFromStorage]);

  // Calculate totals once loaded
  useEffect(() => {
    const basic = parseFloat(form.basic) || 0;
    const hra = parseFloat(form.hra) || 0;
    const specialAllowance = parseFloat(form.specialAllowance) || 0;
    const arrearSpecial = parseFloat(form.arrearSpecial) || 0;
    const pf = parseFloat(form.pf) || 0;
    const incomeTax = parseFloat(form.incomeTax) || 0;

    const totalEarnings = basic + hra + specialAllowance + arrearSpecial;
    const totalDeductions = pf + incomeTax;
    const netPay = totalEarnings - totalDeductions;

    setForm((f) => ({
      ...f,
      totalEarnings: totalEarnings ? totalEarnings.toFixed(2) : "",
      totalDeductions: totalDeductions ? totalDeductions.toFixed(2) : "",
      netPay: netPay ? netPay.toFixed(2) : "",
    }));
    // eslint-disable-next-line
  }, [
    form.basic,
    form.hra,
    form.specialAllowance,
    form.arrearSpecial,
    form.pf,
    form.incomeTax,
  ]);

  function goBack() {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  }

  return (
    <div>
      <style>{`
        * {margin:0; padding:0; box-sizing:border-box;}
        body, #root {min-height:100vh;}
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
          top: 0; z-index: 1000;
        }
        .logo {display: flex; align-items: center; gap: 1rem;}
        .logo img {
          width: 60px; height: 60px; border-radius: 50%; object-fit: cover;
          border: 2px solid #6c5ce7;
        }
        .logo h1 { color: #6c5ce7; font-size: 1.8rem; font-weight: 700;}
        .main-content {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
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
          from { opacity:0; transform:translateY(30px);}
          to { opacity:1; transform:translateY(0);}
        }
        .form-section { margin-bottom: 2rem;}
        .section-title {
          font-size: 1.3rem; font-weight: 600; color: #333;
          margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 2px solid #6c5ce7;
        }
        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1rem;
        }
        .form-group { display: flex; flex-direction: column;}
        .form-label { font-weight: 600; color: #333; margin-bottom: 0.5rem;}
        .form-input, .form-select {
          padding: 0.75rem; border: 2px solid #e0e0e0;
          border-radius: 10px; font-size: 1rem;
          transition: all 0.3s ease; background: white;
        }
        .form-input:focus, .form-select:focus {
          outline: none; border-color: #6c5ce7;
          box-shadow: 0 0 0 3px rgba(108,92,231,0.1);
        }
        .earnings-deductions {
          display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;
        }
        .earnings-section, .deductions-section {
          background: #f8f9fa; padding: 1.5rem;
          border-radius: 15px; border: 2px solid #e9ecef;
        }
        .section-subtitle {
          font-size: 1.1rem; font-weight: 600; color: #495057;
          margin-bottom: 1rem; text-align: center;
        }
        .button-group { display: flex; justify-content: center; margin-top: 1rem;}
        .back-btn {
          border:none; padding:1rem 3rem; border-radius:15px; cursor:pointer;
          font-weight:600; font-size:1.1rem; transition:all 0.3s ease;
          background: linear-gradient(45deg, #6c5ce7, #a29bfe); color:white;
        }
        .back-btn:hover {
          transform: translateY(-2px);
          box-shadow:0 8px 25px rgba(108,92,231,0.3);
        }
        .status-message {
          padding:1rem; border-radius:10px; margin-top:1rem; font-weight:600;
          text-align:center; opacity:0; transition:opacity 0.3s ease;
        }
        .status-message.success {
          background: #d4edda; color: #155724; border: 1px solid #c3e6cb;
        }
        .status-message.error {
          background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;
        }
        .status-message.show { opacity: 1; }
        @media (max-width: 768px) {
          .header { flex-direction: column; gap: 1rem; padding: 1rem;}
          .main-content { padding: 1rem;}
          .form-grid { grid-template-columns: 1fr;}
          .earnings-deductions { grid-template-columns: 1fr;}
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
          <form id="payslipForm" autoComplete="off" onSubmit={e => e.preventDefault()}>
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
                    value={form.empCode}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Employee Name</label>
                  <input
                    type="text"
                    className="form-input"
                    name="empName"
                    placeholder="Enter full name"
                    value={form.empName}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <input
                    type="text"
                    className="form-input"
                    name="department"
                    placeholder="Enter department"
                    value={form.department}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Cost Centre</label>
                  <input
                    type="text"
                    className="form-input"
                    name="costCentre"
                    placeholder="Enter cost centre"
                    value={form.costCentre}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    className="form-input"
                    name="location"
                    placeholder="Enter location"
                    value={form.location}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Designation</label>
                  <input
                    type="text"
                    className="form-input"
                    name="designation"
                    placeholder="Enter designation"
                    value={form.designation}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Date of Birth</label>
                  <input
                    type="date"
                    className="form-input"
                    name="dob"
                    value={form.dob}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Date of Joining</label>
                  <input
                    type="date"
                    className="form-input"
                    name="doj"
                    value={form.doj}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Residential Status</label>
                  <select
                    className="form-select"
                    name="resStatus"
                    value={form.resStatus}
                    disabled
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
                    value={form.pfNo}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">ESI Number</label>
                  <input
                    type="text"
                    className="form-input"
                    name="esiNo"
                    placeholder="Enter ESI number"
                    value={form.esiNo}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">EPS Number</label>
                  <input
                    type="text"
                    className="form-input"
                    name="epsNo"
                    placeholder="Enter EPS number"
                    value={form.epsNo}
                    readOnly
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
                    value={form.payrollMonth}
                    readOnly
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
                      value={form.basic}
                      readOnly
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
                      value={form.hra}
                      readOnly
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
                      value={form.specialAllowance}
                      readOnly
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
                      value={form.arrearSpecial}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label"><strong>Total Earnings</strong></label>
                    <input
                      type="number"
                      className="form-input"
                      name="totalEarnings"
                      placeholder="0.00"
                      readOnly
                      style={{ fontWeight: "bold" }}
                      value={form.totalEarnings}
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
                      value={form.pf}
                      readOnly
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
                      value={form.incomeTax}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label"><strong>Total Deductions</strong></label>
                    <input
                      type="number"
                      className="form-input"
                      name="totalDeductions"
                      placeholder="0.00"
                      readOnly
                      style={{ fontWeight: "bold" }}
                      value={form.totalDeductions}
                    />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#10ac84" }}>
                  Net Pay
                </label>
                <input
                  type="number"
                  className="form-input"
                  name="netPay"
                  placeholder="0.00"
                  readOnly
                  style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#10ac84" }}
                  value={form.netPay}
                />
              </div>
            </div>
            <div className="button-group">
              <button type="button" className="back-btn" onClick={goBack}>
                Back
              </button>
            </div>
            {/* Status message placeholder */}
            <div id="statusMessage" className="status-message"></div>
          </form>
        </div>
      </main>
    </div>
  );
}