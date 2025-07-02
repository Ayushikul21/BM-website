import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  Clock, 
  DollarSign, 
  FileText, 
  TrendingUp, 
  Settings, 
  User,
  Search,
  Filter,
  Download,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Mail,
  Phone,
  MapPin,
  Award,
  Bell,
  LogOut
} from 'lucide-react';

const MainAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');

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

  const [leaveRequests] = useState([
    { id: 1, employeeName: 'John Smith', type: 'Annual Leave', dates: '2025-07-15 to 2025-07-17', days: 3, status: 'Pending', reason: 'Family vacation' },
    { id: 2, employeeName: 'Sarah Johnson', type: 'Sick Leave', dates: '2025-07-10', days: 1, status: 'Approved', reason: 'Medical appointment' },
    { id: 3, employeeName: 'Mike Chen', type: 'Personal Leave', dates: '2025-07-20 to 2025-07-21', days: 2, status: 'Pending', reason: 'Personal matters' }
  ]);

  const stats = {
    totalEmployees: employees.length,
    presentToday: employees.filter(emp => emp.attendance.present > 20).length,
    pendingLeaves: leaveRequests.filter(req => req.status === 'Pending').length,
    avgSalary: Math.round(employees.reduce((sum, emp) => sum + emp.salary, 0) / employees.length)
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'employees', label: 'Employee Management', icon: Users },
    { id: 'attendance', label: 'Attendance', icon: Clock },
    { id: 'leaves', label: 'Leave Management', icon: Calendar },
    { id: 'salary', label: 'Salary & Benefits', icon: DollarSign },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'performance', label: 'Performance', icon: Award },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const openModal = (type, employee = null) => {
    setModalType(type);
    setSelectedEmployee(employee);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEmployee(null);
    setModalType('');
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <div className="flex items-center space-x-3">
          <Bell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-blue-600" />
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
            AD
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Employees</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalEmployees}</p>
            </div>
            <Users className="w-12 h-12 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Present Today</p>
              <p className="text-3xl font-bold text-green-600">{stats.presentToday}</p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Leaves</p>
              <p className="text-3xl font-bold text-orange-600">{stats.pendingLeaves}</p>
            </div>
            <AlertCircle className="w-12 h-12 text-orange-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Salary</p>
              <p className="text-3xl font-bold text-purple-600">${stats.avgSalary.toLocaleString()}</p>
            </div>
            <DollarSign className="w-12 h-12 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Leave Requests</h3>
          <div className="space-y-3">
            {leaveRequests.slice(0, 3).map(request => (
              <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{request.employeeName}</p>
                  <p className="text-sm text-gray-600">{request.type} - {request.days} days</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  request.status === 'Approved' ? 'bg-green-100 text-green-800' :
                  request.status === 'Pending' ? 'bg-orange-100 text-orange-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {request.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Overview</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Engineering</span>
              <span className="font-semibold">1 employee</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Design</span>
              <span className="font-semibold">1 employee</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Product</span>
              <span className="font-semibold">1 employee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEmployees = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Employee Management</h1>
        <button 
          onClick={() => openModal('add-employee')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Employee Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employees.filter(emp => 
                emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                emp.department.toLowerCase().includes(searchTerm.toLowerCase())
              ).map(employee => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {employee.avatar}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                        <div className="text-sm text-gray-500">{employee.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.position}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.department}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {employee.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${employee.salary.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => openModal('view-employee', employee)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => openModal('edit-employee', employee)}
                        className="text-green-600 hover:text-green-900"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAttendance = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Attendance Management</h1>
        <div className="flex items-center space-x-3">
          <input type="date" className="border border-gray-300 rounded-lg px-3 py-2" />
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Mark Attendance
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Present Days</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Absent Days</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Late Days</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance %</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employees.map(employee => {
                const totalDays = employee.attendance.present + employee.attendance.absent;
                const attendancePercent = Math.round((employee.attendance.present / totalDays) * 100);
                
                return (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {employee.avatar}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                          <div className="text-sm text-gray-500">{employee.department}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                      {employee.attendance.present}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">
                      {employee.attendance.absent}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600 font-semibold">
                      {employee.attendance.late}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className={`h-2 rounded-full ${attendancePercent >= 90 ? 'bg-green-600' : attendancePercent >= 80 ? 'bg-yellow-600' : 'bg-red-600'}`}
                            style={{ width: `${attendancePercent}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{attendancePercent}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900">View Details</button>
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

  const renderLeaves = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Leave Management</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Add Leave Policy
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leaveRequests.map(request => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {request.employeeName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.dates}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.days}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      request.status === 'Approved' ? 'bg-green-100 text-green-800' :
                      request.status === 'Pending' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {request.status === 'Pending' && (
                      <div className="flex items-center space-x-2">
                        <button className="text-green-600 hover:text-green-900">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSalary = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Salary & Benefits</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
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
              {employees.map(employee => {
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
                      ${employee.salary.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                      +${allowances.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                      -${deductions.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      ${netSalary.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">Edit</button>
                        <button className="text-green-600 hover:text-green-900">Payslip</button>
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

  const renderProfile = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-6 mb-6">
          <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            AD
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Admin User</h2>
            <p className="text-gray-600">System Administrator</p>
            <p className="text-gray-600">admin@company.com</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input type="text" defaultValue="Admin User" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input type="email" defaultValue="admin@company.com" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input type="tel" defaultValue="+1 234 567 8900" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <input type="text" defaultValue="Administration" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
          </div>
        </div>
        
        <div className="mt-6">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Document Management</h1>
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
        <h1 className="text-3xl font-bold text-gray-900">Performance Management</h1>
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

  const renderSettings = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
              <input type="text" defaultValue="TechCorp Solutions" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Zone</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                <option>UTC-5 (Eastern Time)</option>
                <option>UTC-8 (Pacific Time)</option>
                <option>UTC+0 (GMT)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Working Hours</label>
              <div className="flex space-x-2">
                <input type="time" defaultValue="09:00" className="border border-gray-300 rounded-lg px-3 py-2" />
                <span className="self-center">to</span>
                <input type="time" defaultValue="17:00" className="border border-gray-300 rounded-lg px-3 py-2" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Leave Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Annual Leave Days</label>
              <input type="number" defaultValue="25" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sick Leave Days</label>
              <input type="number" defaultValue="10" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="auto-approve" className="rounded" />
              <label htmlFor="auto-approve" className="text-sm text-gray-700">Auto-approve leave requests</label>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="email-notifications" className="rounded" defaultChecked />
              <label htmlFor="email-notifications" className="text-sm text-gray-700">Email notifications</label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="sms-notifications" className="rounded" />
              <label htmlFor="sms-notifications" className="text-sm text-gray-700">SMS notifications</label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="desktop-notifications" className="rounded" defaultChecked />
              <label htmlFor="desktop-notifications" className="text-sm text-gray-700">Desktop notifications</label>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="two-factor" className="rounded" defaultChecked />
              <label htmlFor="two-factor" className="text-sm text-gray-700">Two-factor authentication</label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="session-timeout" className="rounded" defaultChecked />
              <label htmlFor="session-timeout" className="text-sm text-gray-700">Auto session timeout</label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password Policy</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                <option>Strong (8+ chars, mixed case, numbers, symbols)</option>
                <option>Medium (6+ chars, mixed case, numbers)</option>
                <option>Basic (6+ chars)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Save Settings</h3>
            <p className="text-gray-600">Apply all configuration changes</p>
          </div>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Save All Changes
          </button>
        </div>
      </div>
    </div>
  );

  const renderModal = () => {
    if (!showModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {modalType === 'add-employee' && 'Add New Employee'}
                {modalType === 'edit-employee' && 'Edit Employee'}
                {modalType === 'view-employee' && 'Employee Details'}
              </h2>
              <button 
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {(modalType === 'add-employee' || modalType === 'edit-employee') && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input 
                      type="text" 
                      defaultValue={selectedEmployee?.name || ''} 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input 
                      type="email" 
                      defaultValue={selectedEmployee?.email || ''} 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input 
                      type="tel" 
                      defaultValue={selectedEmployee?.phone || ''} 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                    <input 
                      type="text" 
                      defaultValue={selectedEmployee?.position || ''} 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                    <select 
                      defaultValue={selectedEmployee?.department || ''} 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                      <option value="">Select Department</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Design">Design</option>
                      <option value="Product">Product</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Sales">Sales</option>
                      <option value="HR">Human Resources</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Salary</label>
                    <input 
                      type="number" 
                      defaultValue={selectedEmployee?.salary || ''} 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Joining Date</label>
                    <input 
                      type="date" 
                      defaultValue={selectedEmployee?.joiningDate || ''} 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select 
                      defaultValue={selectedEmployee?.status || 'Active'} 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="On Leave">On Leave</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <textarea 
                    rows={3} 
                    defaultValue={selectedEmployee?.address || ''} 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  ></textarea>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button 
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    {modalType === 'add-employee' ? 'Add Employee' : 'Update Employee'}
                  </button>
                </div>
              </div>
            )}

            {modalType === 'view-employee' && selectedEmployee && (
              <div className="space-y-6">
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {selectedEmployee.avatar}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{selectedEmployee.name}</h3>
                    <p className="text-gray-600">{selectedEmployee.position}</p>
                    <p className="text-gray-600">{selectedEmployee.department}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Contact Information</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">{selectedEmployee.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">{selectedEmployee.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">{selectedEmployee.address}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Employment Details</h4>
                    <div className="space-y-2">
                      <div>
                        <span className="text-gray-500">Joining Date: </span>
                        <span className="text-gray-700">{selectedEmployee.joiningDate}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Salary: </span>
                        <span className="text-gray-700">${selectedEmployee.salary.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Status: </span>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          {selectedEmployee.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-blue-900 mb-2">Attendance</h5>
                    <p className="text-sm text-blue-700">Present: {selectedEmployee.attendance.present} days</p>
                    <p className="text-sm text-blue-700">Absent: {selectedEmployee.attendance.absent} days</p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-green-900 mb-2">Leave Balance</h5>
                    <p className="text-sm text-green-700">Total: {selectedEmployee.leaves.total} days</p>
                    <p className="text-sm text-green-700">Used: {selectedEmployee.leaves.used} days</p>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-purple-900 mb-2">Performance</h5>
                    <div className="flex items-center">
                      <div className="flex text-yellow-400 mr-2">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < Math.floor(selectedEmployee.performance) ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                        ))}
                      </div>
                      <span className="text-sm text-purple-700">{selectedEmployee.performance}/5.0</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button 
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <button 
                    onClick={() => setModalType('edit-employee')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Edit Employee
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'profile': return renderProfile();
      case 'employees': return renderEmployees();
      case 'attendance': return renderAttendance();
      case 'leaves': return renderLeaves();
      case 'salary': return renderSalary();
      case 'documents': return renderDocuments();
      case 'performance': return renderPerformance();
      case 'settings': return renderSettings();
      default: return renderDashboard();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Admin Portal</h1>
          <p className="text-sm text-gray-600">Employee Management System</p>
        </div>
        
        <nav className="mt-6">
          {sidebarItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-6 py-3 text-left hover:bg-blue-50 transition-colors ${
                  activeTab === item.id ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {renderContent()}
        </div>
      </div>

      {/* Modal */}
      {renderModal()}
    </div>
  );
};

export default MainAdminDashboard;