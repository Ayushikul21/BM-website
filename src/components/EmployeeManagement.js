import { useState, useEffect } from 'react';
import { Search, Filter, Download, Eye, Edit, XCircle, Mail, Phone, MapPin, Calendar, User, Clock, Save } from 'lucide-react';

const EmployeeManagement = () => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedEmployeeBase, setSelectedEmployeeBase] = useState(null); // New state for base employee data
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [employeeData, setEmployeeData] = useState([]);
  const [employeeReports, setEmployeeReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [editFormData, setEditFormData] = useState({
    department: '',
    position: '',
    manager: '',
    joinDate: ''
  });
  const [profileData, setProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear + i);
  
  const formatDateForAPI = (month, year) => {
    const daysInMonth = new Date(year, month, 0).getDate();
    return {
      startDate: `01/${month.toString().padStart(2, '0')}/${year}`,
      endDate: `${daysInMonth.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`
    };
  };

  const fetchEmployees = async (month = selectedMonth, year = selectedYear) => {
    try {
      setLoading(true);
      const { startDate, endDate } = formatDateForAPI(month, year);

      const requestBody = {
        startDate: startDate,
        endDate: startDate
      };
      console.log("Hello",requestBody)

      console.log("Fetching data for:", requestBody);

      const response = await fetch('https://bandymoot.com/api/v1/Dashboard/getReportsAllEMP', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch employees: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      const employees = result.data || [];
      console.log("employee data from API", employees);
      setEmployeeReports(employees);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setEmployeeData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("https://bandymoot.com/api/v1/employees/allemployees", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`, // if auth is required
          },
        });

        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
          setEmployeeData(result.data);
        } else {
          //setError("Failed to fetch employees");
        }
      } catch (err) {
        console.error("Error fetching employees:", err);
        //setError("An error occurred while fetching employees");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const fetchEmployeeProfile = async (employee) => {
  console.log("employeebyid", employee);

  try {
    setLoadingProfile(true);

    // Extract employeeId from employee object
    const employeeId = employee.employeeId; // or employee._id if API expects _id
    console.log("Posting employeeId:", employeeId);

    const response = await fetch("https://bandymoot.com/api/v1/employees/findemployeeID", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ employeeId }), // ✅ Send JSON body like { "employeeId": "10116" }
    });

    console.log("API Response:", response);

    if (!response.ok) {
      throw new Error("Failed to fetch profile details");
    }

    const result = await response.json();
    console.log("Profile API Result:", result);

    const data = result.data;

   const profile = {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phoneNumber || "N/A",
    employeeId: data.employeeId,
    department: data.additionalDetails?.department || "N/A",
    position: data.additionalDetails?.position || "N/A",
    designation: data.additionalDetails?.designation || "N/A",
    manager: data.additionalDetails?.managerOfemployee || "N/A",
    joinDate: data.additionalDetails?.dateOfJoining || "N/A",
    image: data.image,
    currentAddress: data.additionalDetails?.currentAddress || "No address provided",
    permanentAddress: data.additionalDetails?.permanentAddress || "No address provided",
    dateOfBirth: data.additionalDetails?.dateOfBirth || "N/A",
    bloodGroup: data.additionalDetails?.bloodGroup || "N/A",
    maritalStatus: data.additionalDetails?.maritalStatus || "N/A",
    nationality: data.additionalDetails?.nationality || "N/A",
    residentialStatus: data.additionalDetails?.residentialStatus || "N/A",
    
    // Emergency Contact
    emergencyContact: data.additionalDetails?.Emergency_Contact ? {
      name: data.additionalDetails.Emergency_Contact.name || "N/A",
      relationship: data.additionalDetails.Emergency_Contact.relationship || "N/A",
      phoneNumber: data.additionalDetails.Emergency_Contact.phoneNumber || "N/A",
      email: data.additionalDetails.Emergency_Contact.email || "N/A"
    } : null,
    
    // Bank Details
    bankDetails: data.additionalDetails?.bankDetails ? {
      accountNumber: data.additionalDetails.bankDetails.accountNumber || "N/A",
      bankName: data.additionalDetails.bankDetails.bankName || "N/A",
      ifscCode: data.additionalDetails.bankDetails.ifscCode || "N/A",
      branchName: data.additionalDetails.bankDetails.branchName || "N/A",
      adhaarNumber: data.additionalDetails.bankDetails.adhaarNumber || "N/A",
      panNumber: data.additionalDetails.bankDetails.panNumber || "N/A"
    } : null,
    
    // Education Details
    education: {
      tenth: data.additionalDetails?.secondaryEducation?.tenth ? {
        schoolName: data.additionalDetails.secondaryEducation.tenth.schoolName || "N/A",
        board: data.additionalDetails.secondaryEducation.tenth.board || "N/A",
        yearOfPassing: data.additionalDetails.secondaryEducation.tenth.yearOfPassing || "N/A",
        percentage: data.additionalDetails.secondaryEducation.tenth.percentage || "N/A",
        grade: data.additionalDetails.secondaryEducation.tenth.grade || "N/A"
      } : null,
      twelfth: data.additionalDetails?.secondaryEducation?.twelfth ? {
        schoolName: data.additionalDetails.secondaryEducation.twelfth.schoolName || "N/A",
        board: data.additionalDetails.secondaryEducation.twelfth.board || "N/A",
        yearOfPassing: data.additionalDetails.secondaryEducation.twelfth.yearOfPassing || "N/A",
        percentage: data.additionalDetails.secondaryEducation.twelfth.percentage || "N/A",
        grade: data.additionalDetails.secondaryEducation.twelfth.grade || "N/A"
      } : null,
      graduation: data.additionalDetails?.graduation ? {
        collegeName: data.additionalDetails.graduation.collegeName || "N/A",
        courseName: data.additionalDetails.graduation.CourseName || "N/A",
        branch: data.additionalDetails.graduation.branch || "N/A",
        percentage: data.additionalDetails.graduation.percentage || "N/A",
        backlogs: data.additionalDetails.graduation.Backlogs || "N/A",
        passingYear: data.additionalDetails.graduation.PassingYear || "N/A",
        duration: data.additionalDetails.graduation.graduationDuration || "N/A"
      } : null
    },
    
    // Skills
    skills: data.additionalDetails?.skills ? {
      keySkills: data.additionalDetails.skills.keySkills || "N/A",
      keyAchievements: data.additionalDetails.skills.keyAchivements || "N/A",
      majorProject: data.additionalDetails.skills.majorProject || "N/A"
    } : null,
    
    // Documents
    documents: data.additionalDetails?.Documents ? {
      resume: data.additionalDetails.Documents.Resume || "N/A",
      signature: data.additionalDetails.Documents.Signature || "N/A"
    } : null
  };

    setProfileData(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
  } finally {
    setLoadingProfile(false);
  }
};

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleFilterApply = () => {
    fetchEmployees(selectedMonth, selectedYear);
  };

  const generateEmployeePDF = () => {
    if (!selectedEmployeeBase || !selectedEmployee || selectedEmployee.length === 0) {
      alert('No employee data available for printing.');
      return;
    }

    const employee = selectedEmployeeBase;
    const report = selectedEmployee[0];
    const monthName = months.find(m => m.value === selectedMonth)?.label;
    
    // Calculate values for the report
    const totalDays = report.PresentDays + (report.LateArrival || 0);
    const attendanceRate = totalDays > 0 ? Math.round((report.PresentDays / totalDays) * 100) : 0;
    const generatedDate = new Date().toLocaleDateString();
    
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Employee Report - ${employee.firstName} ${employee.lastName}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 40px;
            color: #333;
            line-height: 1.6;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #2563eb;
            padding-bottom: 20px;
          }
          .header h1 {
            font-size: 28px;
            margin-bottom: 10px;
            color: #2563eb;
          }
          .period {
            color: #666;
            font-size: 16px;
            font-weight: bold;
          }
          .section {
            margin: 30px 0;
            page-break-inside: avoid;
          }
          .section h2 {
            font-size: 20px;
            border-bottom: 1px solid #2563eb;
            padding-bottom: 8px;
            margin-bottom: 15px;
            color: #2563eb;
          }
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
          }
          .info-row {
            display: flex;
            padding: 10px 0;
            border-bottom: 1px solid #eee;
          }
          .info-label {
            font-weight: bold;
            width: 180px;
            color: #555;
          }
          .info-value {
            flex: 1;
            color: #333;
          }
          .summary-cards {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin: 20px 0;
          }
          .summary-card {
            padding: 15px;
            border: 1px solid #ddd;
            border-radius: 8px;
            background: #f9f9f9;
          }
          .summary-card h3 {
            margin: 0 0 10px 0;
            color: #2563eb;
            font-size: 16px;
          }
          .summary-value {
            font-size: 24px;
            font-weight: bold;
            color: #1e40af;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            color: #999;
            font-size: 12px;
            border-top: 1px solid #eee;
            padding-top: 20px;
          }
          @media print {
            body {
              padding: 20px;
            }
            .summary-cards {
              page-break-inside: avoid;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Employee Performance Report</h1>
          <div class="period">Period: ${monthName} ${selectedYear}</div>
          <div class="period">Generated on: ${generatedDate}</div>
        </div>
        
        <div class="section">
          <h2>Employee Information</h2>
          <div class="info-grid">
            <div class="info-row">
              <div class="info-label">Employee Name:</div>
              <div class="info-value">${employee.firstName} ${employee.lastName}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Employee ID:</div>
              <div class="info-value">${employee.employeeId}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Position:</div>
              <div class="info-value">${employee.additionalDetails?.position || 'N/A'}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Department:</div>
              <div class="info-value">${employee.additionalDetails?.department || 'N/A'}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Email:</div>
              <div class="info-value">${employee.email}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Phone:</div>
              <div class="info-value">${employee.phoneNumber || 'N/A'}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Status:</div>
              <div class="info-value">${employee.isActive ? 'Active' : 'Inactive'}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Joining Date:</div>
              <div class="info-value">${employee.additionalDetails?.dateOfJoining || 'N/A'}</div>
            </div>
          </div>
        </div>
        
        <div class="section">
          <h2>Monthly Performance Summary</h2>
          <div class="summary-cards">
            <div class="summary-card">
              <h3>Attendance</h3>
              <div class="summary-value">${report.PresentDays} Days</div>
              <div>Present Days</div>
            </div>
            <div class="summary-card">
              <h3>Late Arrivals</h3>
              <div class="summary-value">${report.LateArrival} Days</div>
              <div>Late Coming</div>
            </div>
            <div class="summary-card">
              <h3>Leave Balance</h3>
              <div class="summary-value">${report.CreditLeave} Days</div>
              <div>Available Leaves</div>
            </div>
            <div class="summary-card">
              <h3>Extra Work</h3>
              <div class="summary-value">${report.ExtraWork} Hours</div>
              <div>Overtime Worked</div>
            </div>
          </div>
        </div>
        
        <div class="section">
          <h2>Detailed Breakdown</h2>
          <div class="info-grid">
            <div class="info-row">
              <div class="info-label">Present Days:</div>
              <div class="info-value">${report.PresentDays}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Late Arrivals:</div>
              <div class="info-value">${report.LateArrival}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Total Leave Credit:</div>
              <div class="info-value">${report.CreditLeave} days</div>
            </div>
            <div class="info-row">
              <div class="info-label">Extra Leave Taken:</div>
              <div class="info-value">${report.ExtraLeave} days</div>
            </div>
            <div class="info-row">
              <div class="info-label">Extra Work Hours:</div>
              <div class="info-value">${report.ExtraWork} hours</div>
            </div>
            <div class="info-row">
              <div class="info-label">Attendance Rate:</div>
              <div class="info-value">${attendanceRate}%</div>
            </div>
          </div>
        </div>
        
        <div class="section">
          <h2>Remarks</h2>
          <div style="padding: 15px; background: #f0f9ff; border-radius: 8px; border-left: 4px solid #2563eb;">
            <p><strong>Overall Performance:</strong> ${attendanceRate >= 90 ? 'Excellent' : attendanceRate >= 80 ? 'Good' : attendanceRate >= 70 ? 'Satisfactory' : 'Needs Improvement'}</p>
            <p><strong>Recommendations:</strong> ${attendanceRate >= 90 ? 'Maintain current performance level.' : 'Focus on improving punctuality and attendance.'}</p>
          </div>
        </div>
        
        <div class="footer">
          <p>This report was automatically generated by the Employee Management System</p>
          <p>For any queries, please contact HR Department</p>
        </div>
      </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      
      // Add a small delay to ensure content is loaded before printing
      setTimeout(() => {
        printWindow.print();
        // Optional: Close the window after printing
        // setTimeout(() => printWindow.close(), 500);
      }, 500);
    } else {
      alert('Please allow pop-ups for this site to generate PDF reports.');
    }
  };

  const openModal = (type, employee = null) => {
    console.log("Reports", employee?.employeeId);
    setModalType(type);
    
    // Store the base employee data separately
    setSelectedEmployeeBase(employee);
    
    if (type === 'view-employee' && employee) {
      // For reports view, filter the reports
      const filteredEmployeesReports = employeeReports.filter((emp) => emp.EmpId === employee.employeeId);
      console.log("FilterReports", filteredEmployeesReports);
      setSelectedEmployee(filteredEmployeesReports);
    } else if (type === 'profile' && employee) {
      fetchEmployeeProfile(employee);
      setSelectedEmployee([employee]); // Set as array for consistency
    } else if (type === 'edit' && employee) {
      // Populate edit form with employee data
      setEditFormData({
        department: employee.additionalDetails?.department || '',
        position: employee.additionalDetails?.position || '',
        manager: employee.additionalDetails?.managerOfemployee || '',
        joinDate: employee.additionalDetails?.dateOfJoining || ''
      });
      setSelectedEmployee([employee]); // Set as array for consistency
    }
    
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEmployee(null);
    setSelectedEmployeeBase(null);
    setModalType('');
    setProfileData(null);
    setEditFormData({
      department: '',
      position: '',
      manager: '',
      joinDate: ''
    });
  };

  const handleEditFormChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveEdit = () => {
    console.log('Saving edit for employee:', selectedEmployee.id);
    console.log('Updated data:', editFormData);
    
    setEmployeeData(prevData => 
      prevData.map(emp => 
        emp.id === selectedEmployee.id 
          ? { ...emp, ...editFormData }
          : emp
      )
    );
    
    alert('Employee details updated successfully!');
    closeModal();
  };

  // Fixed search functionality
  const filteredEmployees = employeeData.filter(emp => {
    if (!emp) return false;
    
    const fullName = `${emp.firstName || ''} ${emp.lastName || ''}`.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    return (
      fullName.includes(searchLower) ||
      (emp.email && emp.email.toLowerCase().includes(searchLower)) ||
      (emp.department && emp.department.toLowerCase().includes(searchLower)) ||
      (emp.position && emp.position.toLowerCase().includes(searchLower)) ||
      (emp.employeeId && emp.employeeId.toString().includes(searchLower))
    );
  });

  // Fixed status display function for reports view
  const getStatusDisplay = (employeeReport) => {
    if (!employeeReport || employeeReport.length === 0) {
      return { text: 'Unknown', class: 'bg-yellow-100 text-yellow-800 border border-yellow-200' };
    }
    return { text: 'Active', class: 'bg-green-100 text-green-800 border border-green-200' };
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading employees...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Employee Management</h1>
          <div className="text-sm text-gray-500">
            Period: {months.find(m => m.value === selectedMonth)?.label} {selectedYear}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-3 md:space-y-0">
            
            {/* 🔍 Search Bar */}
            <div className="flex-1 relative w-full">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search employees by name, email, department, position, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* 📅 Month Dropdown */}
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-auto"
            >
              {months.map(month => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>

            {/* 📆 Year Dropdown */}
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-auto"
            >
              {years.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            {/* 🔘 Apply Filter Button */}
            <button
              onClick={handleFilterApply}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full md:w-auto"
            >
              <Filter className="w-4 h-4" />
              <span>Apply Filter</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {employeeData.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <User className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No employees found</h3>
              <p className="text-gray-500">No employee data available for the selected period.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-10 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profile</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reports</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEmployees.map(employee => {
                    const status = getStatusDisplay(employee);
                    return (
                    <tr key={employee._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold shadow-sm overflow-hidden">
                            {employee.image ? (
                              <img src={employee.image} alt={`${employee.firstName} ${employee.lastName}`} className="w-full h-full object-cover" />
                            ) : (
                              <User className="w-5 h-5" />
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{employee.firstName + " " + employee.lastName}</div>
                            <div className="text-sm text-gray-500">{employee.email}</div>
                            <div className="text-xs text-gray-400">ID: {employee.employeeId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${status.class}`}>
                          {status.text}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => openModal('profile', employee)}
                            className="flex items-center space-x-1 px-3 py-2 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors duration-200"
                            title="View Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openModal('edit', employee)}
                            className="flex items-center space-x-1 px-3 py-2 text-green-600 rounded-lg hover:bg-green-100 transition-colors duration-200"
                            title="Edit Employee"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => openModal('view-employee', employee)}
                            className="flex items-center space-x-1 px-3 py-2 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                            title="View Details"
                          >
                            <span className="text-sm">View</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )})}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {modalType === 'view-employee' && 'Employee Details'}
                {modalType === 'profile' && 'Employee Profile'}
                {modalType === 'edit' && 'Edit Employee'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200 p-1 rounded-full hover:bg-white"
              >
                <XCircle className="w-7 h-7" />
              </button>
            </div>
            {modalType !== 'edit' && (
              <div className="text-sm text-gray-600 mt-2">
                Period: {months.find(m => m.value === selectedMonth)?.label} {selectedYear}
              </div>
            )}
          </div>

            <div className="p-6">
              {modalType === 'profile' && selectedEmployee && (
                <div className="space-y-6">
                  {loadingProfile ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-4 text-gray-600">Loading profile...</p>
                    </div>
                  ) : profileData ? (
                    <>
                      {/* Header Section */}
                      <div className="flex items-center space-x-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg overflow-hidden">
                          {profileData.image ? (
                            <img src={profileData.image} alt={`${profileData.firstName} ${profileData.lastName}`} className="w-full h-full object-cover" />
                          ) : (
                            `${profileData.firstName?.charAt(0)}${profileData.lastName?.charAt(0)}`
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-3xl font-bold text-gray-900 mb-2">
                            {profileData.firstName} {profileData.lastName}
                          </h3>
                          <div className="flex flex-wrap gap-4">
                            <div className="flex items-center space-x-2 text-gray-600">
                              <User className="w-4 h-4" />
                              <span>{profileData.designation || profileData.position}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-600">
                              <MapPin className="w-4 h-4" />
                              <span>{profileData.department}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-600">
                              <span>Employee ID: {profileData.employeeId}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Contact Information */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h4>
                          <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                              <Mail className="w-5 h-5 text-gray-500 mt-1" />
                              <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="text-gray-900 font-medium">{profileData.email}</p>
                              </div>
                            </div>
                            <div className="flex items-start space-x-3">
                              <Phone className="w-5 h-5 text-gray-500 mt-1" />
                              <div>
                                <p className="text-sm text-gray-500">Phone</p>
                                <p className="text-gray-900 font-medium">{profileData.phone}</p>
                              </div>
                            </div>
                            <div className="flex items-start space-x-3">
                              <MapPin className="w-5 h-5 text-gray-500 mt-1" />
                              <div>
                                <p className="text-sm text-gray-500">Current Address</p>
                                <p className="text-gray-900 font-medium">{profileData.currentAddress}</p>
                              </div>
                            </div>
                            <div className="flex items-start space-x-3">
                              <MapPin className="w-5 h-5 text-gray-500 mt-1" />
                              <div>
                                <p className="text-sm text-gray-500">Permanent Address</p>
                                <p className="text-gray-900 font-medium">{profileData.permanentAddress}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Employment Details */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">Employment Details</h4>
                          <div className="space-y-4">
                            <div>
                              <p className="text-sm text-gray-500">Employee ID</p>
                              <p className="text-gray-900 font-medium">{profileData.employeeId}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Department</p>
                              <p className="text-gray-900 font-medium">{profileData.department}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Position</p>
                              <p className="text-gray-900 font-medium">{profileData.position}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Designation</p>
                              <p className="text-gray-900 font-medium">{profileData.designation}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Manager</p>
                              <p className="text-gray-900 font-medium">{profileData.manager}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Joining Date</p>
                              <p className="text-gray-900 font-medium">{profileData.joinDate}</p>
                            </div>
                          </div>
                        </div>

                        {/* Personal Information */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h4>
                          <div className="space-y-4">
                            <div>
                              <p className="text-sm text-gray-500">Date of Birth</p>
                              <p className="text-gray-900 font-medium">{profileData.dateOfBirth}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Blood Group</p>
                              <p className="text-gray-900 font-medium">{profileData.bloodGroup}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Marital Status</p>
                              <p className="text-gray-900 font-medium">{profileData.maritalStatus}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Nationality</p>
                              <p className="text-gray-900 font-medium">{profileData.nationality}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Residential Status</p>
                              <p className="text-gray-900 font-medium">{profileData.residentialStatus}</p>
                            </div>
                          </div>
                        </div>

                        {/* Emergency Contact */}
                        {profileData.emergencyContact && (
                          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h4>
                            <div className="space-y-4">
                              <div>
                                <p className="text-sm text-gray-500">Name</p>
                                <p className="text-gray-900 font-medium">{profileData.emergencyContact.name}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Relationship</p>
                                <p className="text-gray-900 font-medium">{profileData.emergencyContact.relationship}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Phone Number</p>
                                <p className="text-gray-900 font-medium">{profileData.emergencyContact.phoneNumber}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="text-gray-900 font-medium">{profileData.emergencyContact.email}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Education Details */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">Education Details</h4>
                          <div className="space-y-6">
                            {/* 10th Details */}
                            {profileData.education.tenth && (
                              <div>
                                <h5 className="font-medium text-gray-900 mb-3">10th Grade</h5>
                                <div className="space-y-2 text-sm">
                                  <div><span className="text-gray-500">School:</span> {profileData.education.tenth.schoolName}</div>
                                  <div><span className="text-gray-500">Board:</span> {profileData.education.tenth.board}</div>
                                  <div><span className="text-gray-500">Year:</span> {profileData.education.tenth.yearOfPassing}</div>
                                  <div><span className="text-gray-500">Percentage:</span> {profileData.education.tenth.percentage}</div>
                                  <div><span className="text-gray-500">Grade:</span> {profileData.education.tenth.grade}</div>
                                </div>
                              </div>
                            )}

                            {/* 12th Details */}
                            {profileData.education.twelfth && profileData.education.twelfth.schoolName && (
                              <div>
                                <h5 className="font-medium text-gray-900 mb-3">12th Grade</h5>
                                <div className="space-y-2 text-sm">
                                  <div><span className="text-gray-500">School:</span> {profileData.education.twelfth.schoolName}</div>
                                  <div><span className="text-gray-500">Board:</span> {profileData.education.twelfth.board}</div>
                                  <div><span className="text-gray-500">Year:</span> {profileData.education.twelfth.yearOfPassing}</div>
                                  <div><span className="text-gray-500">Percentage:</span> {profileData.education.twelfth.percentage}</div>
                                  <div><span className="text-gray-500">Grade:</span> {profileData.education.twelfth.grade}</div>
                                </div>
                              </div>
                            )}

                            {/* Graduation Details */}
                            {profileData.education.graduation && (
                              <div>
                                <h5 className="font-medium text-gray-900 mb-3">Graduation</h5>
                                <div className="space-y-2 text-sm">
                                  <div><span className="text-gray-500">College:</span> {profileData.education.graduation.collegeName}</div>
                                  <div><span className="text-gray-500">Course:</span> {profileData.education.graduation.courseName}</div>
                                  <div><span className="text-gray-500">Branch:</span> {profileData.education.graduation.branch}</div>
                                  <div><span className="text-gray-500">Percentage:</span> {profileData.education.graduation.percentage}</div>
                                  <div><span className="text-gray-500">Backlogs:</span> {profileData.education.graduation.backlogs}</div>
                                  <div><span className="text-gray-500">Passing Year:</span> {profileData.education.graduation.passingYear}</div>
                                  <div><span className="text-gray-500">Duration:</span> {profileData.education.graduation.duration} years</div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Skills */}
                        {profileData.skills && (
                          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">Skills & Achievements</h4>
                            <div className="space-y-4">
                              <div>
                                <p className="text-sm text-gray-500">Key Skills</p>
                                <p className="text-gray-900 font-medium">{profileData.skills.keySkills}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Key Achievements</p>
                                <p className="text-gray-900 font-medium">{profileData.skills.keyAchievements}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Major Project</p>
                                <p className="text-gray-900 font-medium">{profileData.skills.majorProject}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-600">Failed to load profile data</p>
                    </div>
                  )}
                </div>
              )}
              
              {/* EDIT MODAL - FIXED */}
              {modalType === 'edit' && selectedEmployeeBase && (
                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden">
                        {selectedEmployeeBase.image ? (
                          <img src={selectedEmployeeBase.image} alt={`${selectedEmployeeBase.firstName} ${selectedEmployeeBase.lastName}`} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-6 h-6" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {selectedEmployeeBase.firstName} {selectedEmployeeBase.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">Employee ID: {selectedEmployeeBase.employeeId}</p>
                        <p className="text-sm text-gray-600">Email: {selectedEmployeeBase.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Department
                      </label>
                      <input
                        type="text"
                        value={editFormData.department}
                        onChange={(e) => handleEditFormChange('department', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter department"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Position
                      </label>
                      <input
                        type="text"
                        value={editFormData.position}
                        onChange={(e) => handleEditFormChange('position', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter position"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Manager
                      </label>
                      <input
                        type="text"
                        value={editFormData.manager}
                        onChange={(e) => handleEditFormChange('manager', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter manager name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Joining Date
                      </label>
                      <input
                        type="text"
                        value={editFormData.joinDate}
                        onChange={(e) => handleEditFormChange('joinDate', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., June 15, 2025"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                    <button
                      onClick={closeModal}
                      className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 font-medium"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </div>
              )}

              {/* REPORTS VIEW - FIXED STATUS */}
              {modalType === 'view-employee' && selectedEmployee && selectedEmployee.length > 0 && (
                <div className="space-y-8">
                  <div className="flex items-center space-x-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg overflow-hidden">
                      {selectedEmployeeBase?.image ? (
                        <img src={selectedEmployeeBase.image} alt={selectedEmployee[0].Name} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-10 h-10" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-3xl font-bold text-gray-900 mb-2">{selectedEmployee[0].Name}</h3>
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <User className="w-4 h-4" />
                          <span>{selectedEmployeeBase?.additionalDetails?.position || 'NA'}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{selectedEmployeeBase?.additionalDetails?.department || 'NA'}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>ID: {selectedEmployee[0].EmpId}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                        <Mail className="w-5 h-5 text-blue-500" />
                        <span>Contact Information</span>
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <Mail className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="text-gray-900 font-medium">{selectedEmployeeBase?.email || 'NA'}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <Phone className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="text-gray-900 font-medium">{selectedEmployeeBase?.phoneNumber || 'NA'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                        <User className="w-5 h-5 text-green-500" />
                        <span>Employment Details</span>
                      </h4>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-500">Employee ID</p>
                            <p className="text-gray-900 font-medium">{selectedEmployee[0]?.EmpId}</p>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-500">Joining Date</p>
                            <p className="text-gray-900 font-medium">{selectedEmployeeBase?.additionalDetails?.dateOfJoining || 'NA'}</p>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-500">Status</p>
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              selectedEmployeeBase?.isActive === true 
                                ? 'bg-green-100 text-green-800 border border-green-200' 
                                : selectedEmployeeBase?.isActive === false
                                ? 'bg-red-100 text-red-800 border border-red-200'
                                : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                            }`}>
                              {selectedEmployeeBase?.isActive === true ? 'Active' : 
                              selectedEmployeeBase?.isActive === false ? 'Inactive' : 'Unknown'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Attendance Card */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                      <div className="flex items-center justify-between mb-4">
                        <h5 className="font-semibold text-blue-900">Attendance</h5>
                        <Calendar className="w-5 h-5 text-blue-500" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-blue-700">Present</span>
                          <span className="font-bold text-blue-900">{selectedEmployee[0].PresentDays} days</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-blue-700">Late Arrival</span>
                          <span className="font-bold text-blue-900">{selectedEmployee[0].LateArrival} days</span>
                        </div>
                      </div>
                    </div>

                    {/* Leave Balance Card */}
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                      <div className="flex items-center justify-between mb-4">
                        <h5 className="font-semibold text-green-900">Leave Balance</h5>
                        <Calendar className="w-5 h-5 text-green-500" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-green-700">Total</span>
                          <span className="font-bold text-green-900">{selectedEmployee[0].CreditLeave} days</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-green-700">Extra Leave</span>
                          <span className="font-bold text-green-900">{selectedEmployee[0].ExtraLeave} days</span>
                        </div>
                      </div>
                    </div>

                    {/* Extra Work Card */}
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                      <div className="flex items-center justify-between mb-4">
                        <h5 className="font-semibold text-purple-900">Extra Work</h5>
                        <Clock className="w-5 h-5 text-purple-500" />
                      </div>
                      <div className="text-center">
                        <span className="text-2xl font-bold text-purple-900">{selectedEmployee[0].ExtraWork} hours</span>
                        <p className="text-sm text-purple-700 mt-2">Overtime worked</p>
                      </div>
                    </div>

                    {/* Work Summary Card */}
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
                      <div className="flex items-center justify-between mb-4">
                        <h5 className="font-semibold text-orange-900">Work Summary</h5>
                        <User className="w-5 h-5 text-orange-500" />
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-900">
                          {Math.round((selectedEmployee[0].PresentDays / (selectedEmployee[0].PresentDays + selectedEmployee[0].LateArrival)) * 100) || 0}%
                        </div>
                        <p className="text-sm text-orange-700 mt-2">Attendance Rate</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                    <button
                      onClick={generateEmployeePDF}
                      className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors duration-200 font-medium"
                    >
                      <Download className="w-4 h-4" />
                      <span>Print Report</span>
                    </button>
                    <button
                      onClick={closeModal}
                      className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;