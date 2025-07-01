// import React, { useState } from 'react';

// const Dashboard = ({userName}) => {
//   // const [userName] = useState('Ayushi Kulshrestha');

//   const today = new Date().toLocaleDateString('en-GB'); // gives '24/06/2025'

//   const handleWithdraw = (index) => {
//   setAppliedLeaves(prev => {
//     const updated = [...prev];
//     updated[index].status = 'Withdrawed';
//     return updated;
//   });
//  };

//   const [remainingLeaves, setRemainingLeaves] = useState({
//     Sick: 4,
//     Casual: 2,
//     Earned: 5
//   });

//   const [appliedLeaves, setAppliedLeaves] = useState([
//     {
//       name: 'Ayushi Kulshrestha',
//       leaveType: 'Sick Leave',
//       fromDate: '18/06/2025',
//       toDate: '20/06/2025',
//       reason: 'Fever and recovery',
//       status: 'Approved'
//     },
//     {
//       name: 'Ayushi Kulshrestha',
//       leaveType: 'Casual Leave',
//       fromDate: '24/06/2025',
//       toDate: '25/06/2025',
//       reason: 'Personal Work',
//       status: 'Pending'
//     }
//   ]);

//   return (
//     <div className="min-h-screen bg-gradient-to-tr from-gray-100 to-blue-100 px-6 py-10">
//       <div className="max-w-6xl mx-auto space-y-10">
//         <h1 className="text-4xl font-bold text-gray-800 mb-6">Welcome, {userName}</h1>

//         {/* Remaining Leaves */}
//         <div className="grid sm:grid-cols-3 gap-6">
//           {Object.entries(remainingLeaves).map(([type, count]) => (
//             <div key={type} className="bg-white p-6 rounded-xl shadow text-center">
//               <h2 className="text-xl font-semibold">{type} Leave</h2>
//               <p className="text-3xl font-bold text-blue-600 mt-2">{count}</p>
//             </div>
//           ))}
//         </div>

//         {/* Applied Leaves */}
//         <div className="bg-white shadow rounded-xl p-6">
//           <h2 className="text-2xl font-bold mb-4">Applied Leaves</h2>
//           <div className="overflow-x-auto">
//             <table className="min-w-full text-left">
//               <thead className="bg-gray-100 text-sm uppercase text-gray-600">
//                 <tr>
//                   <th className="py-2 px-4">Name</th>
//                   <th className="py-2 px-4">Type</th>
//                   <th className="py-2 px-4">From</th>
//                   <th className="py-2 px-4">To</th>
//                   <th className="py-2 px-4">Reason</th>
//                   <th className="py-2 px-4">Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {appliedLeaves.map((leave, index) => (
//                   <tr key={index} className="border-t">
//                     <td className="py-2 px-4">{leave.name}</td>
//                     <td className="py-2 px-4">{leave.leaveType}</td>
//                     <td className="py-2 px-4">{leave.fromDate}</td>
//                     <td className="py-2 px-4">{leave.toDate}</td>
//                     <td className="py-2 px-4">{leave.reason}</td>
//                     <td className="py-2 px-4 flex items-center">
//                       <span className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${
//                         leave.status === 'Approved'
//                           ? 'bg-green-500'
//                           : leave.status === 'Rejected'
//                           ? 'bg-red-500'
//                           : leave.status === 'Withdrawed'
//                           ? 'bg-gray-500'
//                           : 'bg-yellow-500'
//                       }`}>
//                         {leave.status}
//                       </span>

//                       {leave.status === 'Pending' && leave.fromDate === today && (
//                         <button
//                           className="ml-4 px-2 py-1 bg-blue-500 text-white text-xs font-semibold rounded hover:bg-blue-600"
//                           onClick={() => handleWithdraw(index)}
//                         >
//                           Withdraw
//                         </button>
//                       )}
//                     </td>

//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Apply Leave Button */}
//         <div className="text-center">
//           <button className="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow">
//             Apply New Leave
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, Plus, User, Settings, Bell, Search, Filter, Download, Eye, Edit, Trash2, Users, BarChart3 } from 'lucide-react';

const Dashboard = ({ userName, onSubmit }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showNewLeaveModal, setShowNewLeaveModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [applications, setApplications] = useState([
    { id: 1, type: "Casual Leave", startDate: "2025-07-15", endDate: "2025-07-19", days: 5, status: "Approved", appliedOn: "2025-06-20", reason: "Family vacation" },
    { id: 2, type: "Sick Leave", startDate: "2024-06-10", endDate: "2024-06-12", days: 3, status: "Approved", appliedOn: "2024-06-09", reason: "Medical checkup" },
    { id: 3, type: "Personal Leave", startDate: "2025-08-05", endDate: "2025-08-05", days: 1, status: "Pending", appliedOn: "2025-06-29", reason: "Personal work" },
    { id: 4, type: "Maternity/Paternity Leave", startDate: "2025-05-20", endDate: "2025-05-22", days: 3, status: "Rejected", appliedOn: "2025-05-15", reason: "Weekend trip", rejectionReason: "Insufficient notice period" },
  ]);
  
  // Filter states
  const [filterLeaveType, setFilterLeaveType] = useState('All');
  const [filterMonth, setFilterMonth] = useState('All');
  const [filterYear, setFilterYear] = useState('All');
  
  // Current date for comparison
  const currentDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

  // Mock data
  const userProfile = {
    name: "John Doe",
    empId: "EMP001",
    department: "Engineering",
    position: "Senior Developer",
    manager: "Jane Smith",
    joinDate: "Jan 15, 2022"
  };

  const leaveBalances = [
    { type: "Casual Leave", total: 25, used: 8, remaining: 17, color: "bg-blue-500" },
    { type: "Sick Leave", total: 12, used: 3, remaining: 9, color: "bg-red-500" },
    { type: "Personal Leave", total: 5, used: 1, remaining: 4, color: "bg-green-500" },
    { type: "Maternity/Paternity Leave", total: 90, used: 0, remaining: 90, color: "bg-purple-500" }
  ];

  const recentApplications = [
    { id: 1, type: "Casual Leave", startDate: "2025-07-15", endDate: "2025-07-19", days: 5, status: "Approved", appliedOn: "2025-06-20", reason: "Family vacation" },
    { id: 2, type: "Sick Leave", startDate: "2025-06-10", endDate: "2025-06-12", days: 3, status: "Approved", appliedOn: "2025-06-09", reason: "Medical checkup" },
    { id: 3, type: "Personal Leave", startDate: "2025-08-05", endDate: "2025-08-05", days: 1, status: "Pending", appliedOn: "2025-06-25", reason: "Personal work" },
    { id: 4, type: "Casual Leave", startDate: "2025-05-20", endDate: "2025-05-22", days: 3, status: "Rejected", appliedOn: "2025-05-15", reason: "Weekend trip", rejectionReason: "Insufficient notice period" }
  ];

  const upcomingLeaves = [
    { type: "Casual Leave", startDate: "2025-07-15", endDate: "2025-07-19", days: 5 },
    { type: "Personal Leave", startDate: "2025-08-05", endDate: "2025-08-05", days: 1 }
  ];

  const teamLeaves = [
    { name: "Alice Johnson", type: "Casual Leave", startDate: "2025-07-01", endDate: "2025-07-05", status: "Approved" },
    { name: "Bob Wilson", type: "Sick Leave", startDate: "2025-06-28", endDate: "2025-06-30", status: "Approved" },
    { name: "Carol Davis", type: "Personal Leave", startDate: "2025-07-10", endDate: "2025-07-12", status: "Pending" }
  ];

  const handleLeaveApply = () => {  
  // simulate save logic here...

    if (typeof onSubmit === 'function') {
      onSubmit(); // this navigates back or shows confirmation
    } else {
      console.error("onSubmit is not a function");
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Helper function to check if leave can be withdrawn/deleted
  const canWithdrawApplication = (application) => {
    // Can only withdraw/delete if:
    // 1. Status is 'Pending'
    // 2. Application was made on the same day (current date)
    return application.status.toLowerCase() === 'pending' && application.appliedOn === currentDate;
  };

  // Helper function to get withdrawal message
  const getWithdrawalMessage = (application) => {
    if (application.appliedOn === currentDate && application.status.toLowerCase() === 'pending') {
      return "Can withdraw (applied today)";
    }
    return "Cannot withdraw (can only withdraw on application date)";
  };

  // Function to withdraw/delete application
  const withdrawApplication = (applicationId) => {
    setApplications(prev => prev.filter(app => app.id !== applicationId));
  };

  // Filter applications based on selected criteria
  const getFilteredApplications = () => {
    return applications.filter(app => {
      const appDate = new Date(app.appliedOn);
      const appMonth = appDate.getMonth() + 1; // JavaScript months are 0-indexed
      const appYear = appDate.getFullYear();
      
      const matchesType = filterLeaveType === 'All' || app.type === filterLeaveType;
      const matchesMonth = filterMonth === 'All' || appMonth.toString() === filterMonth;
      const matchesYear = filterYear === 'All' || appYear.toString() === filterYear;
      
      return matchesType && matchesMonth && matchesYear;
    });
  };

  // Get unique years from applications
  const getAvailableYears = () => {
    const years = applications.map(app => new Date(app.appliedOn).getFullYear());
    return [...new Set(years)].sort((a, b) => b - a);
  };

  // Get unique leave types
  const getAvailableLeaveTypes = () => {
    const types = applications.map(app => app.type);
    return [...new Set(types)];
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const NewLeaveModal = () => (
    <form
      onSubmit={handleLeaveApply}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold mb-4">Apply for Leave</h3>

        <div className="space-y-4">
          {/* Leave Type */}
          <div>
            <label className="block text-sm font-medium mb-1">Leave Type</label>
            <select
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select</option>
              <option>Casual Leave</option>
              <option>Sick Leave</option>
              <option>Personal Leave</option>
              <option>Earned Leave</option>
              <option>Maternity/Paternity Leave</option>
            </select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input
                type="date"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input
                type="date"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium mb-1">Reason</label>
            <textarea
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="3"
              placeholder="Please provide reason for leave..."
              required
            ></textarea>
          </div>

          {/* Emergency Contact */}
          <div>
            <label className="block text-sm font-medium mb-1">Emergency Contact</label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Phone number or email"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setShowNewLeaveModal(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Submit Application
            </button>
          </div>
        </div>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Leave Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              {/* <button className="p-2 text-gray-400 hover:text-gray-500">
                <Bell className="w-5 h-5" />
              </button> */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">{userProfile.name}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Leave Days</p>
                <p className="text-2xl font-semibold text-gray-900">22</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Used</p>
                <p className="text-2xl font-semibold text-gray-900">12</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-semibold text-gray-900">1</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Remaining</p>
                <p className="text-2xl font-semibold text-gray-900">19</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {['overview', 'applications', 'calendar'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Leave Balances */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Leave Balances</h3>
                    <button
                      // onClick={() => handleLeaveApply()}
                      onClick={() => setShowNewLeaveModal(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Apply Leave</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {leaveBalances.map((balance, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4 border">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{balance.type}</h4>
                          <div className={`w-3 h-3 rounded-full ${balance.color}`}></div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-end text-sm">
                            <span className="text-gray-600">Used: {balance.used}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${balance.color}`}
                              style={{ width: `${(balance.used / balance.total) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upcoming Leaves */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Leaves</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    {upcomingLeaves.length > 0 ? (
                      <div className="space-y-3">
                        {upcomingLeaves.map((leave, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900">{leave.type}</p>
                              <p className="text-sm text-gray-600">{leave.startDate} to {leave.endDate}</p>
                            </div>
                            <span className="text-sm font-medium text-blue-600">{leave.days} days</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">No upcoming leaves scheduled</p>
                    )}
                  </div>
                </div>

                {/* Recent Applications */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Applications</h3>
                  <div className="space-y-3">
                    {recentApplications.slice(0, 3).map((app) => (
                      <div key={app.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <p className="font-medium text-gray-900">{app.type}</p>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                              {getStatusIcon(app.status)}
                              <span className="ml-1">{app.status}</span>
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{app.startDate} to {app.endDate} ({app.days} days)</p>
                        </div>
                        <button className="text-blue-600 hover:text-blue-800">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                {getFilteredApplications().length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No applications found matching the selected filters.</p>
                  </div>
                )}
                </div>
              </div>
            )}

            {activeTab === 'applications' && (
              <div>
               <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">Leave Applications</h3>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <Download className="h-4 w-4" />
                    <span>Export Report</span>
                  </button>
                </div>
                <div className="flex justify-between items-center mb-6">
                  <div className="flex space-x-3">
                    {/* Leave Type Filter */}
                    <Filter className='h-4 w-4 my-3 text-gray-400'/>
                    <select 
                      value={filterLeaveType}
                      onChange={(e) => setFilterLeaveType(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="All">All Leave Types</option>
                      {getAvailableLeaveTypes().map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    
                    {/* Month Filter */}
                    <select 
                      value={filterMonth}
                      onChange={(e) => setFilterMonth(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="All">All Months</option>
                      <option value="1">January</option>
                      <option value="2">February</option>
                      <option value="3">March</option>
                      <option value="4">April</option>
                      <option value="5">May</option>
                      <option value="6">June</option>
                      <option value="7">July</option>
                      <option value="8">August</option>
                      <option value="9">September</option>
                      <option value="10">October</option>
                      <option value="11">November</option>
                      <option value="12">December</option>
                    </select>
                    
                    {/* Year Filter */}
                    <select 
                      value={filterYear}
                      onChange={(e) => setFilterYear(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="All">All Years</option>
                      {getAvailableYears().map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Withdrawal Policy Notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="text-blue-900 font-medium">Withdrawal Policy</h4>
                      <p className="text-blue-800 text-sm mt-1">
                        Leave applications can only be withdrawn on the same day they are applied. 
                        Once the application day has passed, applications cannot be withdrawn or modified.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied On</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {getFilteredApplications().map((app) => (
                        <tr key={app.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{app.type}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{app.startDate} to {app.endDate}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{app.days}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{app.appliedOn}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                              {getStatusIcon(app.status)}
                              <span className="ml-1">{app.status}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button className="text-blue-600 hover:text-blue-900" title="View Details">
                                <Eye className="w-4 h-4" />
                              </button>
                              {app.status === 'Pending' && canWithdrawApplication(app) && (
                                <>
                                  <button className="text-gray-600 hover:text-gray-900" title="Edit Application">
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => withdrawApplication(app.id)}
                                    className="text-red-600 hover:text-red-900" 
                                    title={getWithdrawalMessage(app)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                              {app.status === 'Pending' && !canWithdrawApplication(app) && (
                                <span className="text-xs text-gray-400 px-2 py-1 bg-gray-100 rounded" title="Can only withdraw on application date">
                                  Cannot withdraw
                                </span>
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

            {activeTab === 'calendar' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Leave Calendar</h3>
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Calendar view coming soon</p>
                  <p className="text-sm text-gray-500 mt-2">This will show your leave schedule and team availability</p>
                </div>
              </div>
            )}

            {/* {activeTab === 'team' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Team Leave Status</h3>
                <div className="space-y-4">
                  {teamLeaves.map((leave, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{leave.name}</p>
                          <p className="text-sm text-gray-600">{leave.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-900">{leave.startDate} to {leave.endDate}</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(leave.status)}`}>
                          {getStatusIcon(leave.status)}
                          <span className="ml-1">{leave.status}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )} */}
          </div>
        </div>
      </div>

      {showNewLeaveModal && <NewLeaveModal />}
    </div>
  );
};

export default Dashboard;