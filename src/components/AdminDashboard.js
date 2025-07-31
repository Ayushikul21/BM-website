import React, { useState, useEffect } from 'react';
import { Search, Users, Calendar, Clock, CheckCircle, XCircle, Eye, Filter, Download, Bell, BarChart3, TrendingUp, AlertCircle } from 'lucide-react';

// Custom Tailwind CSS styles for enhanced design
const customStyles = `
  .gradient-bg {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
  
  .card-hover {
    transition: all 0.3s ease;
  }
  
  .card-hover:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }
  
  .status-pending {
    background: linear-gradient(135deg, #fef3c7, #fde68a);
    color: #92400e;
    animation: pulse 2s infinite;
  }
  
  .status-approved {
    background: linear-gradient(135deg, #d1fae5, #a7f3d0);
    color: #065f46;
  }
  
  .status-rejected {
    background: linear-gradient(135deg, #fee2e2, #fecaca);
    color: #991b1b;
  }
  
  .sidebar-shadow {
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  }
  
  .table-row-hover:hover {
    background: linear-gradient(90deg, #f8fafc, #f1f5f9);
  }
  
  .btn-primary {
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    transition: all 0.3s ease;
  }
  
  .btn-primary:hover {
    background: linear-gradient(135deg, #1d4ed8, #1e40af);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  }
  
  .btn-success {
    background: linear-gradient(135deg, #10b981, #059669);
    transition: all 0.3s ease;
  }
  
  .btn-success:hover {
    background: linear-gradient(135deg, #059669, #047857);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
  }
  
  .btn-danger {
    background: linear-gradient(135deg, #ef4444, #dc2626);
    transition: all 0.3s ease;
  }
  
  .btn-danger:hover {
    background: linear-gradient(135deg, #dc2626, #b91c1c);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
  }
  
  .progress-bar {
    background: linear-gradient(90deg, #3b82f6, #8b5cf6);
    animation: shimmer 2s infinite;
  }
  
  @keyframes shimmer {
    0% { background-position: -200px 0; }
    100% { background-position: calc(200px + 100%) 0; }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.8; }
  }
  
  .notification-badge {
    animation: bounce 1s infinite;
  }
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-10px); }
    60% { transform: translateY(-5px); }
  }
  
  .glass-effect {
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  .search-focus {
    transition: all 0.3s ease;
  }
  
  .search-focus:focus {
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    border-color: #3b82f6;
    transform: scale(1.02);
  }
  
  .tab-active {
    border-bottom: 3px solid #3b82f6;
  }
  
  .stats-card {
    background: linear-gradient(135deg, #ffffff, #f8fafc);
    border-left: 4px solid #3b82f6;
  }
  
  .employee-card {
    transition: all 0.3s ease;
    border-radius: 12px;
  }
  
  .employee-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
    border-color: #3b82f6;
  }
  
  .leave-badge {
    padding: 4px 12px;
    border-radius: 20px;
    font-weight: 500;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

const AdminDashboard = () => {
  // Mock data - replace with your API calls
  const [employees,setEmployees] = useState([
    { id: 1, name: 'John Doe', department: 'SAP ABAP', email: 'john@company.com', totalLeaves: 22, usedLeaves: 12, pendingLeaves: 2 },
    { id: 2, name: 'Jane Smith', department: 'SAP MM', email: 'jane@company.com', totalLeaves: 22, usedLeaves: 8, pendingLeaves: 1 },
    { id: 3, name: 'Mike Johnson', department: 'IBM MAXIMO', email: 'mike@company.com', totalLeaves: 22, usedLeaves: 15, pendingLeaves: 0 },
    { id: 4, name: 'Sarah Wilson', department: 'Finance', email: 'sarah@company.com', totalLeaves: 22, usedLeaves: 20, pendingLeaves: 3 },
    { id: 5, name: 'David Brown', department: 'SAP HR', email: 'david@company.com', totalLeaves: 22, usedLeaves: 5, pendingLeaves: 1 }
  ]);

  const [leaveApplications,setleaveApplication] = useState([
    // { id: 1, employeeId: 1, employeeName: 'John Doe', type: 'Sick Leave', startDate: '2025-07-01', endDate: '2025-07-03', days: 3, status: 'pending', reason: 'Medical checkup and recovery', appliedDate: '2025-06-20' },
    // { id: 2, employeeId: 2, employeeName: 'Jane Smith', type: 'Casual Leave', startDate: '2025-07-15', endDate: '2025-07-22', days: 8, status: 'pending', reason: 'Family vacation', appliedDate: '2025-06-18' },
    // { id: 3, employeeId: 1, employeeName: 'John Doe', type: 'Personal Leave', startDate: '2025-06-10', endDate: '2025-06-12', days: 3, status: 'approved', reason: 'Personal matters', appliedDate: '2025-06-01' },
    // { id: 4, employeeId: 4, employeeName: 'Sarah Wilson', type: 'Maternity/Paternity Leave', startDate: '2025-08-01', endDate: '2025-08-05', days: 5, status: 'pending', reason: 'Summer break', appliedDate: '2025-06-22' },
    // { id: 5, employeeId: 3, employeeName: 'Mike Johnson', type: 'Sick Leave', startDate: '2024-06-05', endDate: '2024-06-06', days: 2, status: 'rejected', reason: 'Flu symptoms', appliedDate: '2024-06-03' },
    // { id: 6, employeeId: 5, employeeName: 'David Brown', type: 'Casual Leave', startDate: '2025-07-20', endDate: '2025-07-25', days: 6, status: 'pending', reason: 'Wedding celebration', appliedDate: '2025-06-25' }
   ]);

const [employeeAll, setEmployeeAll] = useState([]);
   useEffect(() => {
  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://137.97.126.110:5500/api/v1/employees/allemployees', {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      const result = await response.json();
      setEmployeeAll(result.data); // Just store raw list
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  fetchEmployees();
}, []);


   useEffect(() => {
      const fetchUserDetails2 = async () => {
        try {
          const response = await fetch('http://137.97.126.110:5500/api/v1/leave/getAllLeaves', {
            method: 'GET',
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
  
          const result = await response.json();
          const leavedata = result.data;
          console.log("all leave",leavedata)
  
          if (Array.isArray(leavedata)) {
            const transformed = leavedata.map(item => ({
              id: item._id,
              employeeName:item.name,
              employeeId:"1",
              userId:item.userId,
              type: item.leaveType,
              startDate: item.startdate.split("T")[0],
              endDate: item.enddate.split("T")[0],
              days: item.leavedays,
              status: item.status,
              appliedDate: item.createdAt.split("T")[0],
              reason: item.description
            }));
            console.log("transfrom",transformed)
            setleaveApplication(transformed);
  
  
            console.log("✅ Transformed Applications:", transformed);
          } else {
            console.warn("❗ leaveData.takenLeave is not an array");
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      };
  
      fetchUserDetails2();
    }, []);

  
  
  const handleLeaveAction = async (leaveId,userid, action) => {
    try {
         const response = await fetch('http://137.97.126.110:5500/api/v1/leave/approve', {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
              leaveId: leaveId, // Changed to email to match backend
              userId: userid,
              status:action
            })
          });
  
    } catch (error) {
      console.log(error)
    }

    alert(`Leave ${action} successfully! (In real app, this would update the database)`);
  };


  useEffect(() => {
  if (Array.isArray(employeeAll) && Array.isArray(leaveApplications)) {
    const transformed = employeeAll.map(item => ({
      id: item._id,
      name: `${item.firstName} ${item.lastName}`,
      department: item?.additionalDetails?.department || "N/A",
      email: item.email,
      totalLeaves: 22,
      usedLeaves: leaveApplications.filter(app => app.userId === item._id && app.status === "Approved").length,
      pendingLeaves: leaveApplications.filter(app => app.userId === item._id && app.status === "Pending").length,
      rejectedLeaves: leaveApplications.filter(app => app.userId === item._id && app.status === "Rejected").length,

    }));

    setEmployees(transformed);
  }
}, [employeeAll, leaveApplications,handleLeaveAction]); // 🔁 Trigger only when both are available

console.log("all emp",employees)
  
    console.log("h",leaveApplications)

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [leaveDetails,setleaveDetails]=useState(null)
  const [ShowViewLeaveModal,setShowViewLeaveModal]=useState(false)

  // Filter employees based on search
  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter leave applications
  const filteredLeaveApplications = leaveApplications.filter(app => {
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || 
      employees.find(emp => emp.id === app.employeeId)?.department === departmentFilter;
    return matchesStatus && matchesDepartment;
  });

  // Get pending applications
  const [pendingApplications ,setpendingApplication]=useState(1)
  useEffect(()=>{
  setpendingApplication(leaveApplications.filter(app => app.status === 'Pending'))

  },[leaveApplications,handleLeaveAction])
  
  
  

  // Get employee's leave applications
  const getEmployeeLeaves = (id) => {
    return leaveApplications.filter(app => app.userId === id);
  };
  

  const viewLeave = async(id) =>{
     try {
         const response = await fetch('http://137.97.126.110:5500/api/v1/Dashboard/leaveDetails', {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
              leaveId: id, // Changed to email to match backend
            })
          });
          const result = await response.json();
          const leavedata = result.data;
          setleaveDetails(leavedata)
          console.log("leavedata of user",leavedata)
  
    } catch (error) {
      console.log(error)
    }
    console.log("hello1234")
    setShowViewLeaveModal(true)
  }
  console.log("setleaveDetails data",leaveDetails)


  const ViewAdminLeaveModal = () => {

    //call userDetails of api and get leavedetails.......

    return (
      <form
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <h3 className="text-lg font-semibold mb-4">User Leave Details</h3>

          <div className="space-y-4">
            {/* Leave Type */}
            <div>
              <label className="block text-sm font-medium mb-1">Leave Type: 
                <span className='pl-2 text-gray-500'>
                  {leaveDetails.leaveType}  
                </span>
              </label>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Start Date:
                  <span className='pl-2 text-gray-500'>
                    {leaveDetails.startdate.split('T')[0]}
                  </span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End Date:  
                  <span className='pl-2 text-gray-500'>
                    {leaveDetails.enddate.split('T')[0]}
                  </span>
                </label>
              </div>
            </div>

            {/* Description (Reason) */}
            <div>
              <label className="block text-sm font-medium mb-1">Reason:</label>
              <textarea
                className="w-full p-2 border rounded-lg focus:ring-0 text-gray-500"
                value={leaveDetails?.description || ""}
                readOnly
              />
            </div>


            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowViewLeaveModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    );
  };

  // Calculate dashboard stats
  const totalEmployees = employees.length;
  const totalPendingRequests = pendingApplications.length;
  const totalApprovedThisMonth = leaveApplications.filter(app => 
    app.status === 'Approved' && new Date(app.appliedDate).getMonth() === new Date().getMonth()
  ).length;
  const totalRejectedThisMonth = leaveApplications.filter(app => 
    app.status === 'Rejected' 
  ).length;

  const departments = [...new Set(employees.map(emp => emp.department))];

  const StatusBadge = ({ status }) => {
    const configs = {
      pending: {
        className: 'status-pending leave-badge border-2 border-orange-200',
        icon: '⏳'
      },
      approved: {
        className: 'status-approved leave-badge border-2 border-green-200',
        icon: '✅'
      },
      rejected: {
        className: 'status-rejected leave-badge border-2 border-red-200',
        icon: '❌'
      }
    };

    const normalizedStatus = status?.toLowerCase?.(); // handles undefined/null and capitalized statuses
    const config = configs[normalizedStatus] || {
      className: 'status-unknown leave-badge border-2 border-gray-200',
      icon: '❓'
    };

    return (
      <span className={config.className}>
        <span className="mr-1">{config.icon}</span>
        {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Inject custom styles */}
      <style>{customStyles}</style>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-2 py-2">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="stats-card card-hover bg-white rounded-2xl shadow-lg p-6 border-0 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-100 rounded-full -mr-10 -mt-10 opacity-50"></div>
            <div className="relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Total Employees</p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">{totalEmployees}</p>
                  <p className="text-sm text-green-600 mt-1">
                    <span className="font-medium">↗ Active</span>
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                  <Users className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="stats-card card-hover bg-white rounded-2xl shadow-lg p-6 border-0 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-20 h-20 bg-orange-100 rounded-full -mr-10 -mt-10 opacity-50"></div>
            <div className="relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Pending Requests</p>
                  <p className="text-3xl font-bold text-orange-600 mt-2">{totalPendingRequests}</p>
                  <p className="text-sm text-orange-600 mt-1">
                    <span className="font-medium">⏳ Awaiting Action</span>
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl shadow-lg">
                  <Clock className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="stats-card card-hover bg-white rounded-2xl shadow-lg p-6 border-0 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-100 rounded-full -mr-10 -mt-10 opacity-50"></div>
            <div className="relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Approved This Month</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">{totalApprovedThisMonth}</p>
                  <p className="text-sm text-green-600 mt-1">
                    <span className="font-medium">✓ Processed</span>
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl shadow-lg">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="stats-card card-hover bg-white rounded-2xl shadow-lg p-6 border-0 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-100 rounded-full -mr-10 -mt-10 opacity-50"></div>
            <div className="relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Rejected Leaves</p>
                  <p className="text-3xl font-bold text-purple-600 mt-2">{totalRejectedThisMonth}</p>
                  <p className="text-sm text-purple-600 mt-1">
                    <span className="font-medium">📊 Rejected</span>
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl shadow-lg">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="glass-effect rounded-2xl shadow-lg mb-8 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-0 px-6">
              {[
                { key: 'overview', label: 'Overview', icon: BarChart3 },
                { key: 'employees', label: 'Employee Search', icon: Users },
                { key: 'pending', label: 'Pending Requests', icon: Clock },
                { key: 'all-leaves', label: 'All Applications', icon: Calendar }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center space-x-2 py-4 px-6 font-semibold text-sm transition-all duration-300 relative ${
                    activeTab === tab.key
                      ? 'tab-active text-blue-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                  {tab.key === 'pending' && totalPendingRequests > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {totalPendingRequests}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Activity */}
              <div className="glass-effect rounded-2xl shadow-lg p-8 border-0">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Recent Leave Applications</h3>
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="space-y-4">
                  {leaveApplications.map(app => (
                    <div key={app.id} className="card-hover flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-md">
                          <span className="text-white text-sm font-bold">
                            {app.employeeName.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{app.employeeName}</p>
                          <p className="text-sm text-gray-600">{app.type} • {app.days} days</p>
                          <p className="text-xs text-gray-500">{app.appliedDate}</p>
                        </div>
                      </div>
                      <StatusBadge status={app.status} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Department Summary */}
              <div className="glass-effect rounded-2xl shadow-lg p-8 border-0">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Department Overview</h3>
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="space-y-4">
                  {departments.map(dept => {
                    const deptEmployees = employees.filter(emp => emp.department === dept);
                    const avgUsed = Math.round(deptEmployees.reduce((acc, emp) => acc + emp.usedLeaves, 0) / deptEmployees.length);
                    const totalAvailable = deptEmployees.reduce((acc, emp) => acc + emp.totalLeaves, 0);
                    const totalUsed = deptEmployees.reduce((acc, emp) => acc + emp.usedLeaves, 0);
                    const usagePercentage = Math.round((totalUsed / totalAvailable) * 100);
                    
                    return (
                      <div key={dept} className="card-hover p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-semibold text-gray-900">{dept}</p>
                            <p className="text-sm text-gray-600">{deptEmployees.length} employees</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-900">{avgUsed} days</p>
                            <p className="text-sm text-gray-600">avg. used</p>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="progress-bar h-2 rounded-full transition-all duration-300"
                            style={{ width: `${usagePercentage}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{usagePercentage}% of total leaves used</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Employee Search Tab */}
        {activeTab === 'employees' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search employees by name, department, or email..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
              {/* Employee List */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Employees ({filteredEmployees.length})</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredEmployees.map(employee => (
                    <div
                      key={employee.id}
                      onClick={() => setSelectedEmployee(employee)}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedEmployee?.id === employee.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{employee.name}</p>
                          <p className="text-sm text-gray-600">{employee.department}</p>
                          <p className="text-sm text-gray-500">{employee.email}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {employee.usedLeaves}/{employee.totalLeaves} used
                          </p>
                          {employee.pendingLeaves > 0 && (
                            <p className="text-sm text-orange-600">
                              {employee.pendingLeaves} pending
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Employee Details */}
              <div>
                {selectedEmployee ? (
                  <div className="space-y-6">
                    <div className="border rounded-lg p-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        {selectedEmployee.name} - Leave Summary
                      </h3>
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <p className="text-2xl font-bold text-blue-600">{selectedEmployee.pendingLeaves}</p>
                          <p className="text-sm text-gray-600">Pending</p>
                        </div>
                        <div className="text-center p-3 bg-red-50 rounded-lg">
                          <p className="text-2xl font-bold text-red-600">{selectedEmployee.usedLeaves}</p>
                          <p className="text-sm text-gray-600">Used</p>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <p className="text-2xl font-bold text-green-600">
                            {selectedEmployee.rejectedLeaves}
                          </p>
                          <p className="text-sm text-gray-600">Rejected</p>
                        </div>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Leave Applications</h4>
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {getEmployeeLeaves(selectedEmployee.id).map(leave => (
                          <div key={leave.id} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-gray-900">{leave.type}</span>
                              <StatusBadge status={leave.status} />
                            </div>
                            <p className="text-sm text-gray-600">
                              {leave.startDate} to {leave.endDate} ({leave.days} days)
                            </p>
                            <p className="text-sm text-gray-500 mt-1">{leave.reason}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64 text-gray-500">
                    <div className="text-center">
                      <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Select an employee to view their leave details</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Pending Requests Tab */}
        {activeTab === 'pending' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  Pending Leave Requests ({pendingApplications.length})
                </h3>
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                  <span className="text-sm text-gray-600">Requires your attention</span>
                </div>
              </div>
            </div>

            <div className="p-6">
              {pendingApplications.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                  <p className="text-gray-500">No pending requests! All caught up.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingApplications.map(app => (
                    <div key={app.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <h4 className="font-medium text-gray-900">{app.employeeName}</h4>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {app.type}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 mb-3">
                            <div>
                              <p className="text-sm text-gray-600">Duration</p>
                              <p className="font-medium">{app.startDate} to {app.endDate}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Days</p>
                              <p className="font-medium">{app.days} days</p>
                            </div>
                          </div>
                          <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-1">Reason</p>
                            <p className="text-gray-900">{app.reason}</p>
                          </div>
                          <p className="text-sm text-gray-500">Applied on: {app.appliedDate}</p>
                        </div>
                        <div className="flex items-center space-x-2 ml-6">
                          <button
                            onClick={() => viewLeave(app.id)}
                            className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
                          >
                            <Eye className="h-4 w-4" />
                            <span>View</span>
                          </button>
                          <button
                            onClick={() => handleLeaveAction(app.id,app.userId, 'Approved')}
                            className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleLeaveAction(app.id,app.userId,'Rejected')}
                            className="flex items-center space-x-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                          >
                            <XCircle className="h-4 w-4" />
                            <span>Reject</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* All Applications Tab */}
        {activeTab === 'all-leaves' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">All Leave Applications</h3>
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Download className="h-4 w-4" />
                  <span>Export Report</span>
                </button>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="all">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLeaveApplications.map(app => (
                    <tr key={app.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="font-medium text-gray-900">{app.employeeName}</p>
                          <p className="text-sm text-gray-500">
                            {employees.find(emp => emp.id === app.employeeId)?.department}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{app.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {app.startDate} to {app.endDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{app.days}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.appliedDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => viewLeave(app.id)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          
                          {app.status === 'Approved' && (
                            <>
                              <button
                                onClick={() => handleLeaveAction(app.id,app.userId, 'Cancelled')}
                                className="text-gray-600 hover:text-gray-800"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      {ShowViewLeaveModal && <ViewAdminLeaveModal />}
    </div>
  );
};

export default AdminDashboard;