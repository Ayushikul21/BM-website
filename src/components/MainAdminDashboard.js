import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import {
  Users,
  Calendar,
  Clock,
  IndianRupee,
  FileText,
  Settings,
  User,
  Download,
  Plus,
  Eye,
  Award,
  Bell,
  LogOut,
  Menu, // Added menu icon for mobile
  X, // Added close icon for mobile
} from 'lucide-react';
import AdminAttendance from './AdminAttedance';
import EmployeeProfile from './EmployeeProfile';
import EmployeeManagement from './EmployeeManagement';
import SettingsPage from './SettingsPage';

const MainAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notifications, setNotifications] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar state
  const navigate = useNavigate();

  const [employeeData, setEmployeeData] = useState([]);

  useEffect(() => {
    // ✅ Check if user is logged in
    const token = localStorage.getItem("token");

    if (!token) {
      // If not logged in, redirect to login
      navigate("/", { replace: true });
    }

    // ✅ Prevent going back to this page using back/forward buttons
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
      window.history.go(1);
    };
  }, [navigate]);

  // Sample Admin data
  useEffect(() => {
    const fetchUserDetails = async () => {
      console.log("hello1")
      try {
        const response = await fetch('https://bandymoot.com/api/v1/Dashboard/userDetails', {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem('token')}` // or hardcoded token
          }
        });
        console.log("hello2")
        const result = await response.json();
        // const leavedata=result.leaveData.takenLeave
        const data = result.data;
        const fullName = `${data.firstName || ''} ${data.lastName || ''}`.trim();
        setAdmindata({
          name: data.email === "coe211166.cse.coe@cgc.edu.in" ? "Om Prakash Dubey" : fullName,
          id: data.employeeId,
          department: data.additionalDetails.department,
          position: data.additionalDetails.position || "Admin",
          email: data.email,
          phone: data.phone || "+91 7905226299",
          avatar: data.email === "coe211166.cse.coe@cgc.edu.in" ? "" : data.image 
        })
        console.log("hello3") // Get the data object
        console.log("data admin", data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, []);

  const [adminData, setAdmindata] = useState({
    name: "Om Prakash Dubey",
    id: "10100",
    department: "Administration",
    position: "SAP Data Analyst",
    email: "omdubey@bandymoot.com",
    phone: "+91 7905226299",
    avatar: ""
  });


  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('https://bandymoot.com/api/v1/employees/allemployees', {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        const result = await response.json();
        const employees = result.data;
        console.log("employees", employees)

        const enriched = employees.map(emp => ({
          name: emp.firstName + " " + emp.lastName || "Unnamed",
          email: emp.email || "unknown@example.com",
          id: emp.employeeId || emp.id || "N/A",
          department: emp.department || "Data Analyst",
          position: emp.position || "SAP Data Analyst",
          phone: emp.phone || "+91 7905226299",
          joinDate: emp.joinDate || "June 15, 2025",
          manager: emp.manager || "Samaksh Gupta",
          avatar: emp.name ? emp.name.charAt(0).toUpperCase() : "U",
          status: emp.status || "Active",
          salary: emp.salary || 80000,
        }));
        console.log("employee data", enriched)
        setEmployeeData(enriched);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, []);


  // Sample data - in real app, this would come from API
  const [employees] = useState([
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@company.com',
      phone: '+1 234 567 8900',
      position: 'Software Engineer',
      department: 'Engineering',
      joiningDate: '2023-01-15',
      salary: 75000,
      status: 'Active',
      avatar: 'JS',
      address: '123 Tech Street, Silicon Valley',
      emergencyContact: '+1 234 567 8901',
      performance: 4.5,
      attendance: { present: 22, absent: 1, late: 2 },
      leaves: { total: 25, used: 8, pending: 1 }
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      phone: '+1 234 567 8902',
      position: 'UI/UX Designer',
      department: 'Design',
      joiningDate: '2022-08-20',
      salary: 68000,
      status: 'Active',
      avatar: 'SJ',
      address: '456 Design Ave, Creative City',
      emergencyContact: '+1 234 567 8903',
      performance: 4.8,
      attendance: { present: 24, absent: 0, late: 1 },
      leaves: { total: 25, used: 12, pending: 0 }
    },
    {
      id: 3,
      name: 'Mike Chen',
      email: 'mike.chen@company.com',
      phone: '+1 234 567 8904',
      position: 'Product Manager',
      department: 'Product',
      joiningDate: '2021-03-10',
      salary: 85000,
      status: 'Active',
      avatar: 'MC',
      address: '789 Product Plaza, Innovation Hub',
      emergencyContact: '+1 234 567 8905',
      performance: 4.2,
      attendance: { present: 23, absent: 1, late: 1 },
      leaves: { total: 25, used: 15, pending: 2 }
    }
  ]);

  const sidebarItems = [
    // { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'employees', label: 'Employee Management', icon: Users },
    { id: 'attendance', label: 'Attendance', icon: Clock },
    { id: 'leaves', label: 'Leave Management', icon: Calendar },
    { id: 'salary', label: 'Salary & Benefits', icon: IndianRupee },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'performance', label: 'Performance', icon: Award },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  // Mobile sidebar toggle function
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close sidebar when a menu item is clicked (for mobile)
  const handleSidebarItemClick = (tabId) => {
    setActiveTab(tabId);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  // Close sidebar when clicking outside (for mobile)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSidebarOpen && window.innerWidth < 768) {
        const sidebar = document.querySelector('.sidebar');
        const menuButton = document.querySelector('.menu-button');
        if (sidebar && !sidebar.contains(event.target) && 
            menuButton && !menuButton.contains(event.target)) {
          setIsSidebarOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen]);

  const renderPayslip = () => {
    // window.open('/salary website/generate_payslip.html', '_blank');
    <iframe
      src="/salary website/generate_payslip.html"
      title="Generate payslip"
      width="100%"
      height="1200px"
      style={{ border: 'none' }}
    />
  };

  const editPayslip = () => {
    window.open('/salary website/save_payslip.html', '_blank');
  };

  const viewPayslip = () => {
    window.open('/salary website/back_payslip.html', '_blank');
  };

  const renderEmployees = () => {
    return <EmployeeManagement/>
  };

  const renderAttendance = () => {
    return <AdminAttendance />
  };

  const renderLeaves = () => {
    return <AdminDashboard />
  }

  const renderSalary = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Salary & Benefits</h1>
        <button
          onClick={renderPayslip}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Generate Payroll
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Base Salary</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Allowances</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deductions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Salary</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employeeData.map(employee => {
                const allowances = Math.round(employee.salary * 0.15);
                const deductions = Math.round(employee.salary * 0.12);
                const netSalary = employee.salary + allowances - deductions;

                return (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {employee.avatar}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                          <div className="text-sm text-gray-500">{employee.position}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{employee.salary.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                      +₹{allowances.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                      -₹{deductions.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      ₹{netSalary.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button onClick={editPayslip} className="text-blue-600 hover:text-blue-900">Edit</button>
                        <button onClick={viewPayslip} className="text-green-600 hover:text-green-900">Payslip</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => {
    return <EmployeeProfile/>
  };

  const renderDocuments = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Document Management</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <FileText className="w-12 h-12 text-blue-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Employee Contracts</h3>
          <p className="text-gray-600 mb-4">Manage employment contracts and agreements</p>
          <button className="text-blue-600 hover:text-blue-800 font-medium">View All (12)</button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <FileText className="w-12 h-12 text-green-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Policy Documents</h3>
          <p className="text-gray-600 mb-4">Company policies and procedures</p>
          <button className="text-green-600 hover:text-green-800 font-medium">View All (8)</button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <FileText className="w-12 h-12 text-purple-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Training Materials</h3>
          <p className="text-gray-600 mb-4">Employee training and development resources</p>
          <button className="text-purple-600 hover:text-purple-800 font-medium">View All (15)</button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Documents</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[
              { name: 'Employee Handbook 2025.pdf', type: 'Policy', size: '2.3 MB', date: '2025-07-01' },
              { name: 'John Smith - Contract.pdf', type: 'Contract', size: '1.1 MB', date: '2025-06-28' },
              { name: 'Safety Training Manual.pdf', type: 'Training', size: '5.2 MB', date: '2025-06-25' },
              { name: 'Leave Policy Update.docx', type: 'Policy', size: '890 KB', date: '2025-06-20' }
            ].map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <FileText className="w-8 h-8 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">{doc.name}</p>
                    <p className="text-sm text-gray-600">{doc.type} • {doc.size} • {doc.date}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-blue-600 hover:text-blue-800">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="text-green-600 hover:text-green-800">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPerformance = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Performance Management</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Create Review Cycle
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Goals Progress</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Review</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Review</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employees.map(employee => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {employee.avatar}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                        <div className="text-sm text-gray-500">{employee.position}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < Math.floor(employee.performance) ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">{employee.performance}/5.0</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${Math.random() * 100}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    2025-01-15
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    2025-07-15
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900">Start Review</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => {
    return <SettingsPage/>
  };

  const renderContent = () => {
    switch (activeTab) {
      // case 'dashboard': return renderDashboard();
      case 'profile': return renderProfile();
      case 'employees': return renderEmployees();
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
        {/* Left side - Menu Button and Logo/Title */}
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <button 
            className="menu-button md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={toggleSidebar}
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">Admin Portal</h1>
            <p className="text-xs sm:text-sm text-gray-500">Welcome back to your admin panel</p>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {notifications}
              </span>
            )}
          </button>

          {/* User Profile - Hide text on small screens, show on medium+ */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center overflow-hidden">
              {adminData.avatar ? (
                <img src={adminData.avatar} alt="Admin Avatar" className="w-full h-full object-cover rounded-full" />
              ) : (
                <span className="text-white text-sm font-medium">
                  {adminData.name?.charAt(0) || 'A'}
                </span>
              )}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{adminData.name}</p>
              <p className="text-xs text-gray-600">{adminData.position}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-screen pt-20"> {/* Container for sidebar and content */}
        {/* Sidebar - Mobile overlay and desktop fixed */}
        <div 
          className={`
            sidebar fixed md:fixed inset-0 md:inset-auto md:left-0 md:top-20 md:bottom-0 
            w-64 bg-white border-r border-gray-200 flex flex-col z-40
            transform transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          `}
        >
          {/* Mobile header for sidebar */}
          <div className="md:hidden p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
            <button 
              onClick={toggleSidebar}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="mt-2 md:mt-6 flex-1 overflow-y-auto">
            {sidebarItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSidebarItemClick(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 sm:px-6 py-3 text-left hover:bg-blue-50 transition-colors ${
                    activeTab === item.id 
                      ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' 
                      : 'text-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="p-4 sm:p-6 border-t">
            <button
              onClick={() => {
                localStorage.clear();
                alert("Logged out successfully!");
                setTimeout(() => navigate("/"), 500);
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg">
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
        
        {/* Backdrop for mobile sidebar */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        
        {/* Main Content Area - Scrollable content area */}
        <div className="flex-1 md:ml-64 overflow-y-auto h-full w-full">
          <div className="p-8">
            {renderContent()}
          </div>
        </div>

        {/* Modal */}
        {/* {renderModal()} */}
      </div>
    </div>
  );
};

export default MainAdminDashboard;