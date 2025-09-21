import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const initialPayslipInfo = {
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

const initialErrors = {};

export default function SalaryPortalPayslip() {
  const [isFormValid, setIsFormValid] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [saveButtonText, setSaveButtonText] = useState("Save");
  const [saveButtonColor, setSaveButtonColor] = useState("bg-green-600");
  const [savedData, setSavedData] = useState(null);
  const timeoutRef = useRef();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialPayslipInfo);
  const [errors, setErrors] = useState(initialErrors);
  const [showPreview, setShowPreview] = useState(false);
  const payslipRef = useRef();

  // Check if localStorage is available
  const isLocalStorageAvailable = () => {
    try {
      return typeof(Storage) !== "undefined" && window.localStorage;
    } catch (e) {
      return false;
    }
  };

  // Load saved data from localStorage or in-memory storage
  useEffect(() => {
    let loadedData = null;
    
    // Try localStorage first
    if (isLocalStorageAvailable()) {
      try {
        const savedDataString = localStorage.getItem("payslipFormData");
        if (savedDataString) {
          loadedData = JSON.parse(savedDataString);
        }
      } catch (e) {
        console.warn("Failed to load from localStorage:", e);
      }
    }
    
    // Fallback to in-memory storage
    if (!loadedData && savedData) {
      loadedData = savedData;
    }
    
    if (loadedData) {
      setFormData((prev) => ({
        ...prev,
        ...Object.fromEntries(
          Object.entries(loadedData).filter(([k]) =>
            Object.keys(initialPayslipInfo).includes(k)
          )
        ),
      }));
      setSuccessMessage(
        `<strong>Previously saved data loaded</strong><br>
        <small>Last saved: ${loadedData.savedAt || "Unknown"}</small>`
      );
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  }, [savedData]);

  // Auto-calculate totals when earnings/deductions change
  useEffect(() => {
    calculateTotals();
  }, [formData.basic, formData.hra, formData.specialAllowance, formData.arrearSpecial, formData.pf, formData.incomeTax]);

  function handleInputChange(e) {
    const { name, value, type } = e.target;
    const processedValue = type === "number" ? value.replace(/^0+/, "") : value;
    
    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
  }

  // Calculate totals for earnings, deductions, net pay
  const calculateTotals = () => {
    const basic = Number(formData.basic) || 0;
    const hra = Number(formData.hra) || 0;
    const specialAllowance = Number(formData.specialAllowance) || 0;
    const arrearSpecial = Number(formData.arrearSpecial) || 0;
    const pf = Number(formData.pf) || 0;
    const incomeTax = Number(formData.incomeTax) || 0;

    const totalEarnings = basic + hra + specialAllowance + arrearSpecial;
    const totalDeductions = pf + incomeTax;
    const netPay = totalEarnings - totalDeductions;

    setFormData((prev) => ({
      ...prev,
      totalEarnings: totalEarnings.toFixed(2),
      totalDeductions: totalDeductions.toFixed(2),
      netPay: netPay.toFixed(2),
    }));
  };

  // Convert number to words (simple, for INR)
  const numberToWords = (num) => {
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
        `Payslip_${formData.empCode || "employee"}_${
          formData.payrollMonth || ""
        }.pdf`
      );
      setShowPreview(false);
    }, 300);
  };

  function handleSave() {
    const saveData = {
      ...formData,
      savedAt: new Date().toLocaleString(),
    };
    
    let saveSuccess = false;
    
    // Try localStorage first
    if (isLocalStorageAvailable()) {
      try {
        localStorage.setItem("payslipFormData", JSON.stringify(saveData));
        saveSuccess = true;
      } catch (e) {
        console.warn("Failed to save to localStorage:", e);
      }
    }
    
    // Always save to in-memory storage as fallback
    setSavedData(saveData);
    saveSuccess = true;
    
    if (saveSuccess) {
      setSuccessMessage(
        `<strong>Employee Information Saved Successfully! ✅</strong><br>
        <small>Saved at: ${saveData.savedAt}</small><br>
        <small>Employee: ${saveData.empName} (${saveData.empCode})</small>`
      );
      setSaveButtonText("Saved ✓");
      setSaveButtonColor("bg-green-600");
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setSuccessMessage("");
        setSaveButtonText("Save");
        setSaveButtonColor("bg-gradient-to-r from-blue-500 to-purple-600");
      }, 4000);
    }
  }

  function handleBack() {
    navigate('/banking'); // Go back to previous page
  }

  function handleNext() {
    handleSave();
    navigate('/personal'); // Replace with your actual next page route
  }

  // Utility for Date display
  const displayDate = (iso) =>
    iso ? new Date(iso).toLocaleDateString("en-IN") : "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full max-w-5xl animate-fadeInUp max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-6 text-gray-600 text-sm">
          <p>Salary Portal - Employee Information</p>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">Bandy & Moot</h1>
          <p className="text-xl text-gray-600">Employee Information Form</p>
        </div>

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl mb-6 text-center font-semibold">
            <div dangerouslySetInnerHTML={{ __html: successMessage }} />
          </div>
        )}

        <form autoComplete="off" onSubmit={e => e.preventDefault()}>
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100 mb-8">
            {/* Employee Information Section */}


            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Employee Code
                </label>
                <input
                  type="text"
                  name="empCode"
                  placeholder="Enter employee code"
                  value={formData.empCode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 rounded-xl text-gray-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Employee Name
                </label>
                <input
                  type="text"
                  name="empName"
                  placeholder="Enter full name"
                  value={formData.empName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 rounded-xl text-gray-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                />
              </div>
            {/* </div> */}

            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"> */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Department
                </label>
                <input
                  type="text"
                  name="department"
                  placeholder="Enter department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 rounded-xl text-gray-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Cost Centre
                </label>
                <input
                  type="text"
                  name="costCentre"
                  placeholder="Enter cost centre"
                  value={formData.costCentre}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 rounded-xl text-gray-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                />
              </div>
            {/* </div> */}

            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"> */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  placeholder="Enter location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 rounded-xl text-gray-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Designation
                </label>
                <input
                  type="text"
                  name="designation"
                  placeholder="Enter designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 rounded-xl text-gray-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                />
              </div>
            {/* </div> */}

            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"> */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 rounded-xl text-gray-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date of Joining
                </label>
                <input
                  type="date"
                  name="doj"
                  value={formData.doj}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 rounded-xl text-gray-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                />
              </div>
            {/* </div> */}

            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"> */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Residential Status
                </label>
                <select
                  name="resStatus"
                  value={formData.resStatus}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 rounded-xl text-gray-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  <option value="">Select status</option>
                  <option value="Resident">Resident</option>
                  <option value="Non-Resident">Non-Resident</option>
                </select>
              </div>

            {/* </div> */}

            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"> */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  PF Number
                </label>
                <input
                  type="text"
                  name="pfNo"
                  placeholder="Enter PF number"
                  value={formData.pfNo}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 rounded-xl text-gray-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ESI Number
                </label>
                <input
                  type="text"
                  name="esiNo"
                  placeholder="Enter ESI number"
                  value={formData.esiNo}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 rounded-xl text-gray-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  EPS Number
                </label>
                <input
                  type="text"
                  name="epsNo"
                  placeholder="Enter EPS number"
                  value={formData.epsNo}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 rounded-xl text-gray-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                />
              </div>
            </div>
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
              onClick={handleSave}
              className={`flex-1 py-4 px-6 ${saveButtonColor} hover:bg-green-700 text-white rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg`}
            >
              {saveButtonText}
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="flex-1 py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              Next →
            </button>
          </div> 
        </form>
      </div>
    </div>
  );
}