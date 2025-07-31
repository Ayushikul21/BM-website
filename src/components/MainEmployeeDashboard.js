import React, { useState, useEffect } from 'react';
import Dashboard from './Dashboard';
import UserAttendance from './UserAttendance';
import { 
  User, 
  Calendar, 
  IndianRupee, 
  Clock, 
  FileText, 
  Award, 
  Settings, 
  Bell, 
  LogOut,
  ChevronRight,
  Edit,
  Download,
  Eye,
  Plus,
  Filter,
  Search
} from 'lucide-react';


const MainEmployeeDashboard = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [employeeId, setEmployeeId] = useState('');

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch('http://137.97.126.110:5500/api/v1/Dashboard/userDetails', {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem('token')}` // or hardcoded token
          }
        });

        const result = await response.json();
       // const leavedata=result.leaveData.takenLeave
        const data = result.data;  // Get the data object
        console.log("data",data);
        //console.log("leavedata",leavedata);
        //const filterleave=leavedata.filter(item => item.status === "Approved")
        //console.log("length of approved leave",filterleave.length)
        //console.log("approved leave",filterleave)
        // Correctly extract values from the response
        const fullName = `${data.firstName} ${data.lastName}`;
        const emailId = data.email;        // Directly access email
        const employeeIds = data.employeeId;  // Directly access employeeId

        setUserName(fullName);
        setEmail(emailId);
        setEmployeeId(employeeIds);
        
        // Update employeeData with all relevant fields
        setEmployeeData(prev => ({ 
          ...prev, 
          name: fullName,
          email: emailId,
          id: employeeIds
        }));
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, []);

  const [activeSection, setActiveSection] = useState('overview');
  const [notifications, setNotifications] = useState(3);

  // State for editable fields
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // State for selected month and year
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
   
  // //Get userDetails from Token
  // const token = localStorage.getItem('token');
  // console.log("token", token);



  // Sample employee data
  const [employeeData, setEmployeeData] = useState({
    name: userName,
    id: employeeId,
    department: "Data Analyst",
    position: "SAP Data Analyst",
    email: email,
    phone: "+1 (555) 123-4567",
    joinDate: "June 15, 2025",
    manager: "Samaksh Gupta",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
  });

  const menuItems = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'attendance', label: 'Attendance', icon: Clock },
    { id: 'leaves', label: 'Leave Management', icon: Calendar },
    { id: 'salary', label: 'Salary & Benefits', icon: IndianRupee },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'performance', label: 'Performance', icon: Award },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];


  const renderProfile = () => {

  // Emergency contact data (replace with your actual data)
  const emergencyContact = {
    name: "Jane Doe",
    relationship: "Spouse",
    phone: "+1 (555) 987-6543",
    email: "jane.doe@email.com"
  };

  // Handle password field changes
  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle password submit
  const handlePasswordSubmit = async () => {
    // Validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }
    if (passwordData.newPassword.length < 8) {
      alert("Password must be at least 8 characters long!");
      return;
    }
    
    try {
      // TODO: Replace with your actual API call
      // const response = await fetch('/api/change-password', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${yourAuthToken}`
      //   },
      //   body: JSON.stringify({
      //     currentPassword: passwordData.currentPassword,
      //     newPassword: passwordData.newPassword
      //   })
      // });
      
      // For now, just show success message
      alert("Password updated successfully!");
      
      // Reset form
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      setIsEditingPassword(false);
      
    } catch (error) {
      console.error('Password change error:', error);
      alert("Failed to update password. Please try again.");
    }
  };

  // Handle avatar change
  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsUploadingAvatar(true);
      
      try {
        // For now, just show the image locally
        const reader = new FileReader();
        reader.onload = (e) => {
          setEmployeeData(prev => ({
            ...prev,
            avatar: e.target.result
          }));
          setIsUploadingAvatar(false);
        };
        reader.readAsDataURL(file);
        
        // TODO: Replace with your actual API call when ready
        // const formData = new FormData();
        // formData.append('avatar', file);
        // formData.append('employeeId', employeeData.id);
        
        // const response = await fetch('/api/upload-avatar', {
        //   method: 'POST',
        //   body: formData,
        //   headers: {
        //     'Authorization': `Bearer ${yourAuthToken}`
        //   }
        // });
        
        // if (response.ok) {
        //   const result = await response.json();
        //   setEmployeeData(prev => ({
        //     ...prev,
        //     avatar: result.avatarUrl
        //   }));
        //   alert('Profile photo updated successfully!');
        // }
        
      } catch (error) {
        console.error('Avatar upload error:', error);
        alert('Failed to update profile photo. Please try again.');
        setIsUploadingAvatar(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Profile Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <section className="bg-blue-600 text-white p-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <h2 className="text-xl font-bold">My Profile</h2>
        </section>
        
        {/* Profile Header with Avatar */}
        <div className="flex items-center space-x-6 mb-8 mt-6">
          <div className="relative">
            <img 
              src={employeeData.avatar} 
              alt="Profile" 
              className={`w-24 h-24 rounded-full object-cover border-4 border-blue-100 ${isUploadingAvatar ? 'opacity-50' : ''}`}
            />
            {isUploadingAvatar && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                <div className="text-white text-xs">Uploading...</div>
              </div>
            )}
            <div className="absolute bottom-0 right-0">
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id="avatar-upload"
                disabled={isUploadingAvatar}
              />
              <label 
                htmlFor="avatar-upload"
                className={`bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors cursor-pointer flex items-center justify-center w-8 h-8 ${isUploadingAvatar ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <i className="fas fa-camera text-sm"></i>
              </label>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-gray-800">{employeeData.name}</h3>
            <p className="text-gray-600">{employeeData.position}</p>
          </div>
        </div>

        {/* Employee Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
            <p className="text-gray-900 bg-gray-50 p-2 rounded border">{employeeData.id}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <p className="text-gray-900 bg-gray-50 p-2 rounded border">{employeeData.email}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <p className="text-gray-900 bg-gray-50 p-2 rounded border">{employeeData.phone}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <p className="text-gray-900 bg-gray-50 p-2 rounded border">{employeeData.department}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Manager</label>
            <p className="text-gray-900 bg-gray-50 p-2 rounded border">{employeeData.manager}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
            <p className="text-gray-900 bg-gray-50 p-2 rounded border">{employeeData.joinDate}</p>
          </div>
        </div>
      </div>

      {/* Emergency Contact Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <section className="bg-blue-600 text-white p-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mb-6">
          <h2 className="text-xl font-bold">Emergency Contact</h2>
        </section>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
            <p className="text-gray-900 bg-gray-50 p-2 rounded border">{emergencyContact.name}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
            <p className="text-gray-900 bg-gray-50 p-2 rounded border">{emergencyContact.relationship}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <p className="text-gray-900 bg-gray-50 p-2 rounded border">{emergencyContact.phone}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <p className="text-gray-900 bg-gray-50 p-2 rounded border">{emergencyContact.email}</p>
          </div>
        </div>
      </div>

      {/* Change Password Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <section className="bg-blue-600 text-white p-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Change Password</h2>
          {!isEditingPassword ? (
            <button
              onClick={() => setIsEditingPassword(true)}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors font-medium"
            >
              <i className="fas fa-edit mr-2"></i>
              Change Password
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handlePasswordSubmit}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                <i className="fas fa-save mr-2"></i>
                Save Changes
              </button>
              <button
                onClick={() => {
                  setIsEditingPassword(false);
                  setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: ""
                  });
                }}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                <i className="fas fa-times mr-2"></i>
                Cancel
              </button>
            </div>
          )}
        </section>

        {isEditingPassword ? (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your current password"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter new password (min. 8 characters)"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Re-enter new password"
              />
            </div>
            
            {passwordData.newPassword && passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm font-medium">
                  <i className="fas fa-exclamation-triangle mr-2"></i>
                  Passwords don't match. Please try again.
                </p>
              </div>
            )}
            
            {passwordData.newPassword && passwordData.newPassword.length < 8 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-yellow-600 text-sm font-medium">
                  <i className="fas fa-info-circle mr-2"></i>
                  Password must be at least 8 characters long.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <i className="fas fa-lock text-gray-400 text-3xl mb-4"></i>
              <p className="text-gray-600 font-medium">Password Security</p>
              <p className="text-gray-500 text-sm mt-2">
                Click "Change Password" to update your account password
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
 };

  const renderAttendance = () => {
    return <UserAttendance/>
  };

  const renderLeaves = () => {
    return <Dashboard/>
  }

  const renderSalary = () => {  
  // Get current date information
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // Month names array
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  // Get selected month name
  const selectedMonthName = monthNames[selectedMonth];
  
  // Generate years array (current year and previous 2 years)
  const availableYears = [currentYear, currentYear - 1, currentYear - 2];
  
  // Calculate data based on selected month
  const monthlySalary = 850000;
  const monthlyBonus = 250000;
  
  // Calculate YTD based on selected month and year
  const calculateYTD = () => {
    if (selectedYear === currentYear) {
      // For current year, calculate up to selected month or current month (whichever is smaller)
      const monthsToCalculate = Math.min(selectedMonth + 1, currentMonth + 1);
      return monthlySalary * monthsToCalculate;
    } else {
      // For previous years, calculate up to selected month
      return monthlySalary * (selectedMonth + 1);
    }
  };
  
  const ytdEarnings = calculateYTD();
  
  // Format YTD period
  const getYTDPeriod = () => {
    if (selectedMonth === 0) {
      return 'April';
    }
    return `April - ${selectedMonthName}`;
  };
  
  // Handle payslip download - Alternative approach without jsPDF
  const handleDownloadPayslip = () => {
    // Create HTML content for the payslip
    const payslipHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Payslip - ${selectedMonthName} ${selectedYear}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            line-height: 1.6;
            color: #333;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
            margin-bottom: 20px;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            color: #2563eb;
        }
        .header p {
            margin: 5px 0;
            font-size: 16px;
        }
        .section {
            margin: 20px 0;
        }
        .employee-info {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .earnings-deductions {
            display: flex;
            justify-content: space-between;
            gap: 20px;
        }
        .earnings, .deductions {
            flex: 1;
            border: 1px solid #ddd;
            padding: 15px;
            border-radius: 8px;
        }
        .earnings {
            background-color: #f0f9ff;
        }
        .deductions {
            background-color: #fef2f2;
        }
        .item {
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
            border-bottom: 1px solid #eee;
        }
        .item:last-child {
            border-bottom: none;
        }
        .total {
            font-weight: bold;
            border-top: 2px solid #333;
            padding-top: 10px;
            margin-top: 10px;
        }
        .net-salary {
            text-align: center;
            background-color: #10b981;
            color: white;
            padding: 15px;
            border-radius: 8px;
            margin-top: 20px;
            font-size: 18px;
            font-weight: bold;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 12px;
            color: #666;
        }
        @media print {
            body { margin: 0; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>PAYSLIP</h1>
        <p>${selectedMonthName} ${selectedYear}</p>
    </div>
    
    <div class="employee-info">
        <h3>Employee Details</h3>
        <p><strong>Employee Name:</strong> Employee Name</p>
        <p><strong>Employee ID:</strong> EMP001</p>
        <p><strong>Department:</strong> IT Department</p>
        <p><strong>Pay Period:</strong> ${selectedMonthName} ${selectedYear}</p>
    </div>
    
    <div class="earnings-deductions">
        <div class="earnings">
            <h3>EARNINGS</h3>
            <div class="item">
                <span>Base Salary</span>
                <span>₹7,00,000</span>
            </div>
            <div class="item">
                <span>Housing Allowance</span>
                <span>₹1,00,000</span>
            </div>
            <div class="item">
                <span>Transport Allowance</span>
                <span>₹30,000</span>
            </div>
            <div class="item">
                <span>Medical Allowance</span>
                <span>₹20,000</span>
            </div>
            <div class="item total">
                <span>Gross Salary</span>
                <span>₹${monthlySalary.toLocaleString('en-IN')}</span>
            </div>
        </div>
        
        <div class="deductions">
            <h3>DEDUCTIONS</h3>
            <div class="item">
                <span>Income Tax</span>
                <span>₹1,20,000</span>
            </div>
            <div class="item">
                <span>Social Security (ESI)</span>
                <span>₹34,000</span>
            </div>
            <div class="item">
                <span>Health Insurance</span>
                <span>₹15,000</span>
            </div>
            <div class="item">
                <span>Provident Fund (PF)</span>
                <span>₹42,500</span>
            </div>
            <div class="item total">
                <span>Total Deductions</span>
                <span>₹2,11,500</span>
            </div>
        </div>
    </div>
    
    <div class="net-salary">
        NET SALARY: ₹6,38,500
    </div>
    
    <div class="footer">
        <p>This is a computer-generated payslip and does not require a signature.</p>
        <p>Generated on: ${new Date().toLocaleDateString('en-IN')}</p>
    </div>
    
    <script>
        // Auto-print when opened
        window.onload = function() {
            window.print();
        }
    </script>
</body>
</html>
    `;
    
    // Create blob and download
    const blob = new Blob([payslipHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Payslip_${selectedMonthName}_${selectedYear}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        {/* Header with filters */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 space-y-4 lg:space-y-0">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Salary & Benefits</h3>
            <p className="text-sm text-gray-500">Displaying data for {selectedMonthName} {selectedYear}</p>
          </div>
          
          {/* Month and Year filters */}
          <div className="flex flex-wrap items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Month:</label>
              <select 
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {monthNames.map((month, index) => (
                  <option key={index} value={index}>{month}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Year:</label>
              <select 
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {availableYears.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            
            <button 
              onClick={handleDownloadPayslip}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Payslip</span>
            </button>
          </div>
        </div>
        
        {/* Salary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Monthly Salary</p>
                <p className="text-3xl font-bold">₹{monthlySalary.toLocaleString('en-IN')}</p>
                <p className="text-sm text-blue-200">{selectedMonthName} {selectedYear}</p>
              </div>
              <IndianRupee className="w-12 h-12 text-blue-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">YTD Earnings</p>
                <p className="text-3xl font-bold">₹{ytdEarnings.toLocaleString('en-IN')}</p>
                <p className="text-sm text-green-200">{getYTDPeriod()}</p>
              </div>
              <Award className="w-12 h-12 text-green-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Bonus</p>
                <p className="text-3xl font-bold">₹{monthlyBonus.toLocaleString('en-IN')}</p>
                <p className="text-sm text-purple-200">Performance Bonus</p>
              </div>
              <Award className="w-12 h-12 text-purple-200" />
            </div>
          </div>
        </div>

        {/* Salary Breakdown and Deductions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Salary Breakdown - {selectedMonthName} {selectedYear}
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Base Salary</span>
                <span className="font-medium text-gray-900">₹7,00,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Housing Allowance</span>
                <span className="font-medium text-gray-900">₹1,00,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Transport Allowance</span>
                <span className="font-medium text-gray-900">₹30,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Medical Allowance</span>
                <span className="font-medium text-gray-900">₹20,000</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span className="text-gray-900">Gross Salary</span>
                <span className="text-gray-900">₹{monthlySalary.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Deductions - {selectedMonthName} {selectedYear}
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Income Tax</span>
                <span className="font-medium text-red-600">-₹1,20,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Social Security (ESI)</span>
                <span className="font-medium text-red-600">-₹34,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Health Insurance</span>
                <span className="font-medium text-red-600">-₹15,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Provident Fund (PF)</span>
                <span className="font-medium text-red-600">-₹42,500</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span className="text-gray-900">Net Salary</span>
                <span className="text-green-600">₹6,38,500</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

  const renderDocuments = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search documents..." 
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'Employment Contract', type: 'PDF', size: '2.4 MB', date: '2022-01-15', category: 'Contract' },
            { name: 'Employee Handbook', type: 'PDF', size: '1.8 MB', date: '2024-01-01', category: 'Policy' },
            { name: 'Tax Forms 2024', type: 'PDF', size: '856 KB', date: '2024-01-31', category: 'Tax' },
            { name: 'Insurance Documents', type: 'PDF', size: '1.2 MB', date: '2024-03-15', category: 'Benefits' },
            { name: 'Performance Review', type: 'PDF', size: '945 KB', date: '2024-06-30', category: 'Review' },
            { name: 'Training Certificate', type: 'PDF', size: '678 KB', date: '2024-05-20', category: 'Training' },
          ].map((doc, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">{doc.name}</h4>
                    <p className="text-xs text-gray-500">{doc.size}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  doc.category === 'Contract' ? 'bg-blue-100 text-blue-800' :
                  doc.category === 'Policy' ? 'bg-green-100 text-green-800' :
                  doc.category === 'Tax' ? 'bg-yellow-100 text-yellow-800' :
                  doc.category === 'Benefits' ? 'bg-purple-100 text-purple-800' :
                  doc.category === 'Review' ? 'bg-indigo-100 text-indigo-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {doc.category}
                </span>
                <div className="flex items-center space-x-2">
                  <button className="text-blue-600 hover:text-blue-800">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="text-green-600 hover:text-green-800">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2">Updated: {doc.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPerformance = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Overview</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-3xl font-bold text-blue-600 mb-2">4.8</div>
            <div className="text-sm text-blue-700">Overall Rating</div>
            <div className="text-xs text-blue-600">Excellent</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
            <div className="text-sm text-green-700">Goal Achievement</div>
            <div className="text-xs text-green-600">Above Target</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-3xl font-bold text-purple-600 mb-2">12</div>
            <div className="text-sm text-purple-700">Projects Completed</div>
            <div className="text-xs text-purple-600">This Year</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="text-3xl font-bold text-orange-600 mb-2">8</div>
            <div className="text-sm text-orange-700">Skills Developed</div>
            <div className="text-xs text-orange-600">New Competencies</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Technical Skills</span>
                  <span className="text-sm font-medium text-gray-900">4.9/5</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{width: '98%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Communication</span>
                  <span className="text-sm font-medium text-gray-900">4.7/5</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{width: '94%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Leadership</span>
                  <span className="text-sm font-medium text-gray-900">4.5/5</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{width: '90%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Problem Solving</span>
                  <span className="text-sm font-medium text-gray-900">4.8/5</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{width: '96%'}}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Award className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Project Excellence Award</p>
                  <p className="text-xs text-gray-600">Q3 2024 - Led successful product launch</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Award className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Team Player Recognition</p>
                  <p className="text-xs text-gray-600">Q2 2024 - Outstanding collaboration</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Award className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Innovation Award</p>
                  <p className="text-xs text-gray-600">Q1 2024 - Process improvement initiative</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Account Settings</h3>
        
        <div className="space-y-6">
          <div className="border-b border-gray-200 pb-6">
            <h4 className="text-md font-medium text-gray-900 mb-4">Notification Preferences</h4>
            <div className="space-y-3">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                <span className="ml-2 text-sm text-gray-700">Email notifications for leave approvals</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                <span className="ml-2 text-sm text-gray-700">SMS alerts for attendance reminders</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="ml-2 text-sm text-gray-700">Push notifications for announcements</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                <span className="ml-2 text-sm text-gray-700">Monthly performance reports</span>
              </label>
            </div>
          </div>

          <div className="border-b border-gray-200 pb-6">
            <h4 className="text-md font-medium text-gray-900 mb-4">Privacy Settings</h4>
            <div className="space-y-3">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                <span className="ml-2 text-sm text-gray-700">Show profile in company directory</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="ml-2 text-sm text-gray-700">Allow colleagues to view attendance</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                <span className="ml-2 text-sm text-gray-700">Share performance metrics with manager</span>
              </label>
            </div>
          </div>

          <div className="border-b border-gray-200 pb-6">
            <h4 className="text-md font-medium text-gray-900 mb-4">Security</h4>
            <div className="space-y-3">
              <button className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="text-sm text-gray-700">Change Password</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
              <button className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="text-sm text-gray-700">Two-Factor Authentication</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
              <button className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="text-sm text-gray-700">Login History</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch(activeSection) {
      case 'profile': return renderProfile();
      case 'attendance': return renderAttendance();
      case 'leaves': return renderLeaves();
      case 'salary': return renderSalary();
      case 'documents': return renderDocuments();
      case 'performance': return renderPerformance();
      case 'settings': return renderSettings();
      default: return renderProfile();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between h-20">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-gray-900">Employee Portal</h1>
          </div>
        </div>
            
        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-gray-400 hover:text-gray-500">
            <Bell className="w-6 h-6" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {notifications}
              </span>
            )}
          </button>
              
          <div className="flex items-center space-x-3">
            <img 
              src={employeeData.avatar} 
              alt="Profile" 
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900">{employeeData.name}</p>
              <p className="text-xs text-gray-500">{employeeData.position}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-screen pt-20"> {/* Container for sidebar and content */}
        {/* Fixed Sidebar */}
        <div className="fixed left-0 top-20 bottom-0 w-64 bg-white border-r border-gray-200 flex flex-col z-40">
          <nav className="mt-6 flex-1 overflow-y-auto">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center space-x-3 px-6 py-3 text-left hover:bg-blue-50 transition-colors ${
                      activeSection === item.id
                        ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
          </nav>

          <div className="p-6 border-t">
              <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg">
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Main Content Area - Scrollable content area */}
        <div className="flex-1 ml-64 overflow-y-auto h-full">
          <div className="p-8">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainEmployeeDashboard;