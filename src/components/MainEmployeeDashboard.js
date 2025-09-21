import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  EyeOff,
  Plus,
  Filter,
  Camera,
  Search
} from 'lucide-react';
import EmployeeProfile from './EmployeeProfile';


const MainEmployeeDashboard = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [employeeId, setEmployeeId] = useState('');

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch('https://bandymoot.com/api/v1/Dashboard/userDetails', {
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
        
        const fullName = `${data.firstName} ${data.lastName}`;
        const emailId = data.email;        // Directly access email
        const employeeIds = data.employeeId;
        const image = data.image  // Directly access employeeId

        setUserName(fullName);
        setEmail(emailId);
        setEmployeeId(employeeIds);
        
        // Update employeeData with all relevant fields
        setEmployeeData(prev => ({ 
          ...prev, 
          name: fullName,
          email: emailId,
          id: employeeIds,
          department: data.additionalDetails.department || "Data Analyst",
          position: data.additionalDetails.position || "SAP Data Analyst",
          phone: data.phoneNumber || "+1 (555) 123-4567",
          joinDate: data.additionalDetails.dateOfJoining || "June 15, 2025",
          manager: data.additionalDetails.managerOfemployee || "Samaksh Gupta",
          avatar: image || prev.avatar // Use fetched image or keep existing
        }));
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, []);

  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [notifications, setNotifications] = useState(3);

  // State for editable fields
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const changePassword = async () => {
    try {
      console.log("ChangePassword2");
      const response = await fetch("https://bandymoot.com/api/v1/auth/changepassword", {
        method: "POST", // or PUT if backend expects it
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`, // 👈 send token in header
        },
        body: JSON.stringify({
          newPassword: passwordData.newPassword,
          oldPassword: passwordData.currentPassword,
        }),
      });

      console.log("pass", passwordData.newPassword);

      const data = await response.json();
      console.log("Response:", data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // State for selected month and year
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
   
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

  //   // Emergency contact data (replace with your actual data)
  //   const emergencyContact = {
  //     name: "Jane Doe",
  //     relationship: "Spouse",
  //     phone: "+1 (555) 987-6543",
  //     email: "jane.doe@email.com"
  //   };

  //  const handleAvatarChange = (event) => {
  //     const file = event.target.files[0];
  //     if (file) {
  //     setIsUploadingAvatar(true);
      
  //     try {
  //       // For now, just show the image locally
  //       const reader = new FileReader();
  //       reader.onload = (e) => {
  //         setProfileImage(e.target.result);
  //       };
  //       setIsUploadingAvatar(false);
  //       reader.readAsDataURL(file);
        
  //     } catch (error) {
  //       console.error('Avatar upload error:', error);
  //       alert('Failed to update profile photo. Please try again.');
  //       setIsUploadingAvatar(false);
  //     }
  //     }
  //   };

  //   const handlePasswordChange = (field, value) => {
  //       setPasswordData(prev => ({
  //         ...prev,
  //         [field]: value
  //       }));
  //   };

  //   const handlePasswordSubmit = () => {
  //     if (passwordData.newPassword !== passwordData.confirmPassword) {
  //       alert('New password and confirm password do not match!');
  //       return;
  //     }
  //     if (passwordData.newPassword.length < 8) {
  //       alert('Password must be at least 8 characters long!');
  //       return;
  //     }
  //     // Handle password update logic here
  //     alert('Password updated successfully!');
  //     setPasswordData({
  //       currentPassword: '',
  //       newPassword: '',
  //       confirmPassword: ''
  //     });
  //     console.log("ChangePassword1")
  //     changePassword()
  //   };
  

  // return (
  //   <div className="space-y-6">
  //     {/* Main Profile Section */}
  //     <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
  //       <section className="bg-blue-600 text-white p-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
  //         <h2 className="text-xl font-bold">My Profile</h2>
  //       </section>
        
  //       {/* Profile Header with Avatar */}
  //       <div className="flex items-center space-x-6 mb-8 mt-6">
  //         <div className="relative">
  //           <div className={`w-24 h-24 rounded-full object-cover border-4 border-blue-100 ${isUploadingAvatar ? 'opacity-50' : ''} overflow-hidden`}>
  //               {profileImage ? (
  //                 <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
  //               ) : (
  //                 <img src={employeeData.avatar} alt="Profile" className="w-full h-full object-cover" />
  //               )}
  //             </div>
  //           {/* <img 
  //             src={employeeData.avatar} 
  //             alt="Profile" 
  //             className={`w-24 h-24 rounded-full object-cover border-4 border-blue-100 ${isUploadingAvatar ? 'opacity-50' : ''}`}
  //           /> */}
  //           {isUploadingAvatar && (
  //             <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
  //               <div className="text-white text-xs">Uploading...</div>
  //             </div>
  //           )}
  //           <div className="absolute bottom-0 right-0">
  //             <input
  //               type="file"
  //               accept="image/*"
  //               onChange={handleAvatarChange}
  //               className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
  //               id="avatar-upload"
  //               disabled={isUploadingAvatar}
  //             />
  //             <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
  //               <Camera size={16} />
  //               <input
  //                type="file"
  //                accept="image/*"
  //                onChange={handleAvatarChange}
  //                className="hidden"
  //              />
  //            </label>
  //           </div>
  //         </div>
  //         <div>
  //           <h3 className="text-2xl font-semibold text-gray-800">{employeeData.name}</h3>
  //           <p className="text-gray-600">{employeeData.position}</p>
  //         </div>
  //       </div>

  //       {/* Employee Information Grid */}
  //       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
  //           <p className="text-gray-900 bg-gray-50 p-2 rounded border">{employeeData.id}</p>
  //         </div>
          
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
  //           <p className="text-gray-900 bg-gray-50 p-2 rounded border">{employeeData.email}</p>
  //         </div>
          
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
  //           <p className="text-gray-900 bg-gray-50 p-2 rounded border">{employeeData.phone}</p>
  //         </div>
          
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
  //           <p className="text-gray-900 bg-gray-50 p-2 rounded border">{employeeData.department}</p>
  //         </div>
          
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-1">Manager</label>
  //           <p className="text-gray-900 bg-gray-50 p-2 rounded border">{employeeData.manager}</p>
  //         </div>
          
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
  //           <p className="text-gray-900 bg-gray-50 p-2 rounded border">{employeeData.joinDate}</p>
  //         </div>
  //       </div>
  //     </div>

  //     {/* // Emergency Contact Section (Updated with input fields) */}
  //     <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
  //       <section className="bg-blue-600 text-white p-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mb-6">
  //         <h2 className="text-xl font-bold">Emergency Contact</h2>
  //       </section>
        
  //       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name *</label>
  //           <input
  //             type="text"
  //             placeholder="Enter emergency contact name"
  //             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //             defaultValue="Jane Doe"
  //           />
  //         </div>
          
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-1">Relationship *</label>
  //           <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
  //             <option value="">Select Relationship</option>
  //             <option value="spouse" selected>Spouse</option>
  //             <option value="parent">Parent</option>
  //             <option value="sibling">Sibling</option>
  //             <option value="child">Child</option>
  //             <option value="friend">Friend</option>
  //             <option value="other">Other</option>
  //           </select>
  //         </div>
          
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
  //           <input
  //             type="tel"
  //             placeholder="Enter phone number"
  //             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //             defaultValue="+1 (555) 987-6543"
  //           />
  //         </div>
          
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
  //           <input
  //             type="email"
  //             placeholder="Enter email address"
  //             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //             defaultValue="jane.doe@email.com"
  //           />
  //         </div>
  //       </div>
  //     </div>

  //     {/* Banking Details Section (Updated with input fields) */}
  //     <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
  //       <section className="bg-blue-600 text-white p-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mb-6">
  //         <h2 className="text-xl font-bold">Banking Details</h2>
  //       </section>
        
  //       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name *</label>
  //           <input
  //             type="text"
  //             placeholder="Enter bank name"
  //             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //             defaultValue="book"
  //           />
  //         </div>
          
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-1">Account Number *</label>
  //           <input
  //             type="text"
  //             placeholder="Enter account number"
  //             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //             defaultValue="12345434567"
  //           />
  //         </div>
          
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number *</label>
  //           <input
  //             type="text"
  //             placeholder="Enter PAN number"
  //             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //             defaultValue="LSAPK7847C"
  //           />
  //         </div>
          
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code *</label>
  //           <input
  //             type="text"
  //             placeholder="Enter IFSC code"
  //             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //             defaultValue="BARBOALLALL"
  //           />
  //         </div>
          
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-1">Branch Name *</label>
  //           <input
  //             type="text"
  //             placeholder="Enter branch name"
  //             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //             defaultValue="allow"
  //           />
  //         </div>
          
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-1">Aadhar Number *</label>
  //           <input
  //             type="text"
  //             placeholder="Enter Aadhar number"
  //             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //             defaultValue="125412548963"
  //           />
  //         </div>
  //       </div>
  //     </div>

  //     {/* Personal Details Section (Updated with appropriate inputs) */}
  //     <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
  //       <section className="bg-blue-600 text-white p-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mb-6">
  //         <h2 className="text-xl font-bold">Personal Details</h2>
  //       </section>
        
  //       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status *</label>
  //           <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
  //             <option value="">Select Marital Status</option>
  //             <option value="single" selected>Single</option>
  //             <option value="married">Married</option>
  //             <option value="divorced">Divorced</option>
  //             <option value="widowed">Widowed</option>
  //           </select>
  //         </div>
          
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group *</label>
  //           <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
  //             <option value="">Select Blood Group</option>
  //             <option value="A+">A+</option>
  //             <option value="A-" selected>A-</option>
  //             <option value="B+">B+</option>
  //             <option value="B-">B-</option>
  //             <option value="AB+">AB+</option>
  //             <option value="AB-">AB-</option>
  //             <option value="O+">O+</option>
  //             <option value="O-">O-</option>
  //           </select>
  //         </div>
          
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-1">Nationality *</label>
  //           <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
  //             <option value="">Select Nationality</option>
  //             <option value="indian">Indian</option>
  //             <option value="american">American</option>
  //             <option value="canadian" selected>Canadian</option>
  //             <option value="british">British</option>
  //             <option value="australian">Australian</option>
  //             <option value="other">Other</option>
  //           </select>
  //         </div>
  //       </div>
        
  //       <div className="grid grid-cols-2 gap-6">
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-1">Permanent Address *</label>
  //           <textarea
  //             placeholder="Enter permanent address"
  //             rows="3"
  //             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //             defaultValue="gvhvinoj09i-"
  //           />
  //         </div>
          
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-1">Current Address *</label>
  //           <textarea
  //             placeholder="Enter current address"
  //             rows="3"
  //             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //             defaultValue="vbijdvmvhevjiwoe"
  //           />
  //         </div>
  //       </div>
  //     </div>

  //     {/* Education Information Section (Updated with proper options) */}
  //     <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
  //       <section className="bg-blue-600 text-white p-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mb-6">
  //         <h2 className="text-xl font-bold">Education Information</h2>
  //       </section>
        
  //       <h2 className="text-md font-semibold text-gray-800 mb-4">10th Class Information</h2>
  //       <p className="text-sm text-red-600 mb-4">School name, board, and year are mandatory. Either grade OR percentage is required.</p>
        
  //       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
  //         <div className="md:col-span-2">
  //           <label className="block text-sm font-medium text-gray-700 mb-1">10th School Name <span className='text-red-600'>*</span></label>
  //           <input
  //             type="text"
  //             placeholder="Enter your 10th school name"
  //             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //           />
  //         </div>
          
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-1">10th Board <span className='text-red-600'>*</span></label>
  //           <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
  //             <option value="">Select Board</option>
  //             <option value="cbse">CBSE</option>
  //             <option value="icse">ICSE</option>
  //             <option value="state_board">State Board</option>
  //             <option value="up_board">UP Board</option>
  //             <option value="mp_board">MP Board</option>
  //             <option value="bihar_board">Bihar Board</option>
  //             <option value="other">Other</option>
  //           </select>
  //         </div>
          
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-1">10th Year of Passing <span className='text-red-600'>*</span></label>
  //           <input
  //             type="number"
  //             placeholder="Enter year"
  //             min="1980"
  //             max="2024"
  //             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //           />
  //         </div>
          
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-1">10th Grade</label>
  //           <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
  //             <option value="">Select Grade</option>
  //             <option value="A+">A+</option>
  //             <option value="A">A</option>
  //             <option value="B+">B+</option>
  //             <option value="B">B</option>
  //             <option value="C+">C+</option>
  //             <option value="C">C</option>
  //           </select>
  //         </div>
          
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-1">10th Percentage</label>
  //           <input
  //             type="number"
  //             placeholder="Enter percentage"
  //             min="0"
  //             max="100"
  //             step="0.01"
  //             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //           />
  //         </div>
  //       </div>

  //       {/* 12th Class Information */}
  //       <h2 className="text-md font-semibold text-gray-800 mb-4">12th Class Information</h2>
  //       <p className="text-sm text-gray-600 mb-4">All fields in this section are optional</p>
        
  //       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
  //         <div className="md:col-span-2">
  //           <label className="block text-sm font-medium text-gray-700 mb-1">12th College/School Name</label>
  //           <input
  //             type="text"
  //             placeholder="Enter college/school name"
  //             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //           />
  //         </div>
          
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-1">12th Board</label>
  //           <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
  //             <option value="">Select Board</option>
  //             <option value="cbse">CBSE</option>
  //             <option value="icse">ICSE</option>
  //             <option value="state_board">State Board</option>
  //             <option value="up_board">UP Board</option>
  //             <option value="mp_board">MP Board</option>
  //             <option value="bihar_board">Bihar Board</option>
  //             <option value="other">Other</option>
  //           </select>
  //         </div>
          
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-1">12th Year of Passing</label>
  //           <input
  //             type="number"
  //             placeholder="Enter year"
  //             min="1980"
  //             max="2024"
  //             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //           />
  //         </div>
          
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-1">12th Grade</label>
  //           <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
  //             <option value="">Select Grade</option>
  //             <option value="A+">A+</option>
  //             <option value="A">A</option>
  //             <option value="B+">B+</option>
  //             <option value="B">B</option>
  //             <option value="C+">C+</option>
  //             <option value="C">C</option>
  //           </select>
  //         </div>
          
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-1">12th Percentage</label>
  //           <input
  //             type="number"
  //             placeholder="Enter percentage"
  //             min="0"
  //             max="100"
  //             step="0.01"
  //             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //           />
  //         </div>
  //       </div>

  //       {/* Diploma Information */}
  //       <h2 className="text-md font-semibold text-gray-800 mb-4">Diploma Information</h2>
  //       <p className="text-sm text-gray-600 mb-4">All fields in this section are optional</p>
        
  //       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
  //         <div className="md:col-span-2">
  //           <label className="block text-sm font-medium text-gray-700 mb-1">Diploma College/Institute Name</label>
  //           <input
  //             type="text"
  //             placeholder="Enter diploma college/institute name"
  //             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //           />
  //         </div>
          
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-1">Diploma Course/Branch</label>
  //           <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
  //             <option value="">Select Diploma Course</option>
  //             <option value="mechanical">Mechanical Engineering</option>
  //             <option value="civil">Civil Engineering</option>
  //             <option value="electrical">Electrical Engineering</option>
  //             <option value="electronics">Electronics & Communication</option>
  //             <option value="computer_science">Computer Science Engineering</option>
  //             <option value="automobile">Automobile Engineering</option>
  //             <option value="chemical">Chemical Engineering</option>
  //             <option value="textile">Textile Engineering</option>
  //             <option value="pharmacy">Pharmacy</option>
  //             <option value="other">Other</option>
  //           </select>
  //         </div>
          
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-1">Diploma Duration</label>
  //           <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
  //             <option value="">Select Duration</option>
  //             <option value="2">2 Years</option>
  //             <option value="3">3 Years</option>
  //             <option value="4">4 Years</option>
  //           </select>
  //         </div>
          
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-1">Diploma Year of Passing</label>
  //           <input
  //             type="number"
  //             placeholder="Enter year"
  //             min="1980"
  //             max="2024"
  //             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //           />
  //         </div>
          
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-1">Diploma Percentage/CGPA</label>
  //           <input
  //             type="text"
  //             placeholder="e.g., 85% or 8.5 CGPA"
  //             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //           />
  //         </div>
  //       </div>

  //       {/* Graduation Information */}
  //       <h2 className="text-md font-semibold text-gray-800 mb-4">Graduation Information</h2>
  //       <p className="text-sm text-red-600 mb-4">All fields in this section are mandatory</p>
        
  //       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
  //         <div className="md:col-span-2">
  //           <label className="block text-sm font-medium text-gray-700 mb-1">
  //             Graduation College/University Name <span className="text-red-500">*</span>
  //           </label>
  //           <input
  //             type="text"
  //             placeholder="Enter graduation college/university name"
  //             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //             required
  //           />
  //         </div>
          
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-1">
  //             Graduation Course/Degree <span className="text-red-600">*</span>
  //           </label>
  //           <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" required>
  //             <option value="">Select Course</option>
  //             <option value="btech">B.Tech</option>
  //             <option value="be">B.E</option>
  //             <option value="bsc">B.Sc</option>
  //             <option value="bcom">B.Com</option>
  //             <option value="ba">B.A</option>
  //             <option value="bba">BBA</option>
  //             <option value="bca">BCA</option>
  //             <option value="other">Other</option>
  //           </select>
  //         </div>
          
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-1">
  //             Specialization/Branch <span className="text-red-600">*</span>
  //           </label>
  //           <input
  //             type="text"
  //             placeholder="Enter specialization/branch"
  //             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //             required
  //           />
  //         </div>
          
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-1">
  //             Graduation Duration <span className="text-red-600">*</span>
  //           </label>
  //           <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" required>
  //             <option value="">Select Duration</option>
  //             <option value="3">3 Years</option>
  //             <option value="4">4 Years</option>
  //             <option value="5">5 Years</option>
  //           </select>
  //         </div>
          
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-1">
  //             Graduation Year of Passing <span className="text-red-600">*</span>
  //           </label>
  //           <input
  //             type="number"
  //             placeholder="Enter year"
  //             min="1980"
  //             max="2024"
  //             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //             required
  //           />
  //         </div>
          
  //         <div className="md:col-span-2">
  //           <label className="block text-sm font-medium text-gray-700 mb-1">
  //             Graduation Percentage/CGPA <span className="text-red-600">*</span>
  //           </label>
  //           <input
  //             type="text"
  //             placeholder="e.g., 75% or 7.5 CGPA"
  //             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //             required
  //           />
  //         </div>
  //       </div>

  //       {/* Academic Backlogs Information */}
  //       <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
  //         <h4 className="text-lg font-medium text-blue-900 mb-4">Academic Backlogs Information</h4>
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-3">
  //             Do you have any backlogs during graduation? <span className="text-red-600">*</span>
  //           </label>
  //           <div className="flex items-center space-x-6">
  //             <label className="flex items-center">
  //               <input type="radio" name="backlogs" value="yes" className="text-blue-600 focus:ring-blue-500" />
  //               <span className="ml-2 text-sm text-gray-700">Yes</span>
  //             </label>
  //             <label className="flex items-center">
  //               <input type="radio" name="backlogs" value="no" className="text-blue-600 focus:ring-blue-500" />
  //               <span className="ml-2 text-sm text-gray-700">No</span>
  //             </label>
  //           </div>
  //         </div>
  //       </div>
  //     </div>  

  //     {/* Previous Employment Information Section (Updated with input fields) */}
  //     <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
  //       <section className="bg-blue-600 text-white p-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mb-6">
  //         <h2 className="text-xl font-bold">Previous Employment Information</h2>
  //       </section>
        
  //       <div className="border-b border-gray-300 mb-6">
  //         <h3 className="text-lg font-semibold text-gray-800 mb-4">Company & Position Details</h3>
  //       </div>
        
  //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
  //           <input
  //             type="text"
  //             placeholder="Enter company name"
  //             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //           />
  //         </div>
          
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-1">Starting Date</label>
  //           <input
  //             type="date"
  //             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //           />
  //         </div>
          
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-1">Ending Date</label>
  //           <input
  //             type="date"
  //             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //           />
  //         </div>
          
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-1">Position/Job Title</label>
  //           <input
  //             type="text"
  //             placeholder="Enter your position"
  //             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //           />
  //         </div>
          
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-1">Work Experience (in months)</label>
  //           <input
  //             type="number"
  //             placeholder="Total experience in months"
  //             min="0"
  //             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //           />
  //         </div>
          
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Leaving</label>
  //           <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
  //             <option value="">Select Reason</option>
  //             <option value="career_growth">Career Growth</option>
  //             <option value="better_opportunity">Better Opportunity</option>
  //             <option value="salary_hike">Salary Hike</option>
  //             <option value="relocation">Relocation</option>
  //             <option value="work_life_balance">Work Life Balance</option>
  //             <option value="company_closure">Company Closure</option>
  //             <option value="other">Other</option>
  //           </select>
  //         </div>
          
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-1">Team Lead/Manager Name</label>
  //           <input
  //             type="text"
  //             placeholder="Enter team lead/manager name"
  //             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //           />
  //         </div>
          
  //         <div className="md:col-span-2">
  //           <label className="block text-sm font-medium text-gray-700 mb-1">Annual Salary</label>
  //           <input
  //             type="number"
  //             placeholder="Enter annual salary"
  //             min="0"
  //             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //           />
  //         </div>
  //       </div>
  //     </div>

  //     {/* Skills & Projects Information Section (Updated with input fields) */}
  //     <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
  //       <section className="bg-blue-600 text-white p-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mb-6">
  //         <h2 className="text-xl font-bold">Skills & Projects Information</h2>
  //       </section>
        
  //       <div className="space-y-6">
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-2">
  //             Key Skills <span className="text-red-600">*</span>
  //           </label>
  //           <textarea
  //             placeholder="e.g., JavaScript, Python, React, Leadership, Communication, Problem Solving..."
  //             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[120px]"
  //             maxLength="1000"
  //           />
  //           <p className="text-xs text-gray-500 mt-2">List your key technical and soft skills separated by commas (minimum 3 characters)</p>
  //           <p className="text-xs text-gray-400 text-right mt-1">0/1000 characters</p>
  //         </div>
          
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-2">Projects</label>
  //           <textarea
  //             placeholder="Describe your major projects, technologies used, and your role..."
  //             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[120px]"
  //             maxLength="1000"
  //           />
  //           <p className="text-xs text-gray-500 mt-2">Describe your significant projects and contributions</p>
  //           <p className="text-xs text-gray-400 text-right mt-1">0/1000 characters</p>
  //         </div>

  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-2">Key Achievements</label>
  //           <textarea
  //             placeholder="e.g., Increased system performance by 40%, Led a team of 5 developers, Implemented CI/CD pipeline..."
  //             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[120px]"
  //             maxLength="1000"
  //           />
  //           <p className="text-xs text-gray-500 mt-2">List your professional achievements and accomplishments</p>
  //           <p className="text-xs text-gray-400 text-right mt-1">0/1000 characters</p>
  //         </div>
  //       </div>
  //     </div>

  //     {/* Documents & Signature Section (Updated with file inputs) */}
  //     <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
  //       {/* <div className="flex items-center justify-between mb-6"> */}
  //         <section className="bg-blue-600 text-white p-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mb-6">
  //           <h2 className="text-xl font-bold">Documents & Signature</h2>
  //         </section>
  //         {/* <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm">
  //           Clear Data
  //         </button> 
  //        </div> */}
        
  //       <div className="space-y-6">
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-3">
  //             Digital Signature Upload <span className="text-red-600">*</span>
  //           </label>
  //           <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer">
  //             <input
  //               type="file"
  //               accept="image/png,image/jpg,image/jpeg"
  //               className="hidden"
  //               id="signature-upload"
  //             />
  //             <label htmlFor="signature-upload" className="cursor-pointer">
  //               <div className="text-4xl mb-4">📝</div>
  //               <p className="text-gray-600 font-medium">Click to upload your signature</p>
  //               <p className="text-sm text-gray-500 mt-1">Accepted formats: PNG, JPG, JPEG (Max 5MB)</p>
  //             </label>
  //           </div>
  //         </div>
          
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-3">
  //             Resume Upload <span className="text-red-600">*</span>
  //           </label>
  //           <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer">
  //             <input
  //               type="file"
  //               accept=".pdf,.doc,.docx"
  //               className="hidden"
  //               id="resume-upload"
  //             />
  //             <label htmlFor="resume-upload" className="cursor-pointer">
  //               <div className="text-4xl mb-4">📄</div>
  //               <p className="text-gray-600 font-medium">Click to upload your resume</p>
  //               <p className="text-sm text-gray-500 mt-1">Accepted formats: PDF, DOC, DOCX (Max 10MB)</p>
  //             </label>
  //           </div>
  //         </div>
          
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-3">Additional Documents (Optional)</label>
  //           <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer">
  //             <input
  //               type="file"
  //               accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
  //               multiple
  //               className="hidden"
  //               id="additional-docs-upload"
  //             />
  //             <label htmlFor="additional-docs-upload" className="cursor-pointer">
  //               <div className="text-4xl mb-4">📎</div>
  //               <p className="text-gray-600 font-medium">Click to upload additional documents</p>
  //               <p className="text-sm text-gray-500 mt-1">Certificates, Portfolio, etc. (Max 15MB each)</p>
  //             </label>
  //           </div>
  //         </div>
  //       </div>
  //     </div>

  //     {/* Professional Reference Section (Updated with input fields) */}
  //     <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
  //       <div className="bg-blue-600 text-white p-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mb-6">
  //         <h2 className="text-xl font-bold">Professional Reference</h2>
  //       </div>
        
  //       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-1">Reference Name</label>
  //           <input
  //             type="text"
  //             placeholder="Enter reference name"
  //             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //             defaultValue="Dr. Smith"
  //           />
  //         </div>
          
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
  //           <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
  //             <option value="">Select Relationship</option>
  //             <option value="supervisor" selected>Supervisor</option>
  //             <option value="manager">Manager</option>
  //             <option value="colleague">Colleague</option>
  //             <option value="mentor">Mentor</option>
  //             <option value="client">Client</option>
  //             <option value="other">Other</option>
  //           </select>
  //         </div>
          
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
  //           <input
  //             type="tel"
  //             placeholder="Enter phone number"
  //             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //             defaultValue="555-123-4567"
  //           />
  //         </div>
          
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
  //           <input
  //             type="email"
  //             placeholder="Enter email address"
  //             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //             defaultValue="dr.smith@example.com"
  //           />
  //         </div>
          
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-1">Company/Organization</label>
  //           <input
  //             type="text"
  //             placeholder="Enter company/organization name"
  //             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //             defaultValue="Example Medical Center"
  //           />
  //         </div>
          
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-1">Position Title</label>
  //           <input
  //             type="text"
  //             placeholder="Enter position title"
  //             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //             defaultValue="Chief Medical Officer"
  //           />
  //         </div>
  //       </div>
  //     </div>


  //     {/* Change Password Section */}
  //     <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
  //       <section className="bg-blue-600 text-white p-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-between mb-6">
  //         <h2 className="text-xl font-bold">Change Password</h2>
  //         {!isEditingPassword ? (
  //           <button
  //             onClick={() => setIsEditingPassword(true)}
  //             className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors font-medium"
  //           >
  //             <i className="fas fa-edit mr-2"></i>
  //             Change Password
  //           </button>
  //         ) : (
  //           <div className="flex space-x-2">
  //             <button
  //               onClick={handlePasswordSubmit}
  //               className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
  //             >
  //               <i className="fas fa-save mr-2"></i>
  //               Save Changes
  //             </button>
  //             <button
  //               onClick={() => {
  //                 setIsEditingPassword(false);
  //                 setPasswordData({
  //                   currentPassword: "",
  //                   newPassword: "",
  //                   confirmPassword: ""
  //                 });
  //               }}
  //               className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium"
  //             >
  //               <i className="fas fa-times mr-2"></i>
  //               Cancel
  //             </button>
  //           </div>
  //         )}
  //       </section>

  //       {isEditingPassword ? (
  //         <div className="space-y-6">
  //           <div>
  //             <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
  //             <div className="relative">
  //               <input
  //                 type={showCurrentPassword ? "text" : "password"}
  //                 value={passwordData.currentPassword}
  //                 onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
  //                 className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //                 placeholder="Enter current password"
  //                 required
  //               />
  //               <button
  //                 type="button"
  //                 onClick={() => setShowCurrentPassword(!showCurrentPassword)}
  //                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
  //               >
  //                 {showCurrentPassword ? <Eye size={18} /> : <EyeOff size={18} />}
  //               </button>
  //             </div>
  //           </div>
            
  //           <div>
  //             <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
  //             <div className="relative">
  //               <input
  //                 type={showNewPassword ? "text" : "password"}
  //                 value={passwordData.newPassword}
  //                 onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
  //                 className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //                 placeholder="Enter new password"
  //                 minLength="8"
  //                 required
  //               />
  //               <button
  //                 type="button"
  //                 onClick={() => setShowNewPassword(!showNewPassword)}
  //                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
  //               >
  //                 {showNewPassword ? <Eye size={18} /> : <EyeOff size={18} />}
  //               </button>
  //             </div>
  //           </div>
            
  //          <div>
  //            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
  //            <div className="relative">
  //              <input
  //                type={showConfirmPassword ? "text" : "password"}
  //                value={passwordData.confirmPassword}
  //                onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
  //                className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //                placeholder="Confirm new password"
  //                required
  //              />
  //              <button
  //                type="button"
  //                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
  //                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
  //              >
  //                {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
  //              </button>
  //            </div>
  //          </div>
            
  //           {passwordData.newPassword && passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
  //             <div className="bg-red-50 border border-red-200 rounded-lg p-3">
  //               <p className="text-red-600 text-sm font-medium">
  //                 <i className="fas fa-exclamation-triangle mr-2"></i>
  //                 Passwords don't match. Please try again.
  //               </p>
  //             </div>
  //           )}
            
  //           {passwordData.newPassword && passwordData.newPassword.length < 8 && (
  //             <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
  //               <p className="text-yellow-600 text-sm font-medium">
  //                 <i className="fas fa-info-circle mr-2"></i>
  //                 Password must be at least 8 characters long.
  //               </p>
  //             </div>
  //           )}
  //         </div>
  //       ) : (
  //         <div className="text-center py-8">
  //           <div className="bg-gray-50 rounded-lg p-6">
  //             <i className="fas fa-lock text-gray-400 text-3xl mb-4"></i>
  //             <p className="text-gray-600 font-medium">Password Security</p>
  //             <p className="text-gray-500 text-sm mt-2">
  //               Click "Change Password" to update your account password
  //             </p>
  //           </div>
  //         </div>
  //       )}
  //     </div>
  //   </div>
  // );
  return <EmployeeProfile/>
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
              <button onClick={()=>navigate('/login')} className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg">
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