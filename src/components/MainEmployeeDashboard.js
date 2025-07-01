import React, { useState } from 'react';
import { 
  User, 
  Calendar, 
  DollarSign, 
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
  const [activeSection, setActiveSection] = useState('overview');
  const [notifications, setNotifications] = useState(3);

  // Sample employee data
  const employeeData = {
    name: "Sarah Johnson",
    id: "EMP001",
    department: "Software Development",
    position: "Senior Developer",
    email: "sarah.johnson@company.com",
    phone: "+1 (555) 123-4567",
    joinDate: "January 15, 2022",
    manager: "Michael Chen",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
  };

  const menuItems = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'attendance', label: 'Attendance', icon: Clock },
    { id: 'leaves', label: 'Leave Management', icon: Calendar },
    { id: 'salary', label: 'Salary & Benefits', icon: DollarSign },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'performance', label: 'Performance', icon: Award },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];


  const renderProfile = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-6 mb-8">
          <img 
            src={employeeData.avatar} 
            alt="Profile" 
            className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{employeeData.name}</h2>
            <p className="text-gray-600">{employeeData.position}</p>
            <p className="text-sm text-gray-500">{employeeData.department}</p>
          </div>
          <button className="ml-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Edit className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
              <p className="text-gray-900">{employeeData.id}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <p className="text-gray-900">{employeeData.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <p className="text-gray-900">{employeeData.phone}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <p className="text-gray-900">{employeeData.department}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reporting Manager</label>
              <p className="text-gray-900">{employeeData.manager}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
              <p className="text-gray-900">{employeeData.joinDate}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAttendance = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Attendance Overview</h3>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select className="border border-gray-300 rounded-lg px-3 py-1 text-sm">
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Quarter</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700">Present Days</p>
                <p className="text-2xl font-bold text-green-800">22</p>
              </div>
              <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-green-700" />
              </div>
            </div>
          </div>
          
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-700">Absent Days</p>
                <p className="text-2xl font-bold text-red-800">2</p>
              </div>
              <div className="w-12 h-12 bg-red-200 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-red-700" />
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-700">Late Arrivals</p>
                <p className="text-2xl font-bold text-yellow-800">3</p>
              </div>
              <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-700" />
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Check In</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Check Out</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Hours</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { date: '2024-06-26', checkIn: '9:00 AM', checkOut: '6:00 PM', hours: '9h 0m', status: 'Present' },
                { date: '2024-06-25', checkIn: '9:15 AM', checkOut: '6:00 PM', hours: '8h 45m', status: 'Late' },
                { date: '2024-06-24', checkIn: '9:00 AM', checkOut: '6:00 PM', hours: '9h 0m', status: 'Present' },
                { date: '2024-06-23', checkIn: '-', checkOut: '-', hours: '0h 0m', status: 'Absent' },
                { date: '2024-06-22', checkIn: '9:00 AM', checkOut: '6:00 PM', hours: '9h 0m', status: 'Present' },
              ].map((record, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900">{record.date}</td>
                  <td className="py-3 px-4 text-gray-700">{record.checkIn}</td>
                  <td className="py-3 px-4 text-gray-700">{record.checkOut}</td>
                  <td className="py-3 px-4 text-gray-700">{record.hours}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      record.status === 'Present' ? 'bg-green-100 text-green-800' :
                      record.status === 'Late' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderLeaves = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Leave Management</h3>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Apply Leave</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="text-center">
              <p className="text-sm text-blue-700">Annual Leave</p>
              <p className="text-2xl font-bold text-blue-800">12</p>
              <p className="text-xs text-blue-600">of 20 days</p>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="text-center">
              <p className="text-sm text-green-700">Sick Leave</p>
              <p className="text-2xl font-bold text-green-800">5</p>
              <p className="text-xs text-green-600">of 10 days</p>
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="text-center">
              <p className="text-sm text-purple-700">Personal</p>
              <p className="text-2xl font-bold text-purple-800">3</p>
              <p className="text-xs text-purple-600">of 5 days</p>
            </div>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
            <div className="text-center">
              <p className="text-sm text-orange-700">Maternity</p>
              <p className="text-2xl font-bold text-orange-800">90</p>
              <p className="text-xs text-orange-600">days available</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">From</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">To</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Days</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Reason</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                { type: 'Annual', from: '2024-12-25', to: '2024-12-27', days: 3, reason: 'Christmas vacation', status: 'Approved' },
                { type: 'Sick', from: '2024-12-15', to: '2024-12-15', days: 1, reason: 'Medical appointment', status: 'Approved' },
                { type: 'Personal', from: '2024-12-30', to: '2024-12-31', days: 2, reason: 'Family event', status: 'Pending' },
              ].map((leave, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900">{leave.type}</td>
                  <td className="py-3 px-4 text-gray-700">{leave.from}</td>
                  <td className="py-3 px-4 text-gray-700">{leave.to}</td>
                  <td className="py-3 px-4 text-gray-700">{leave.days}</td>
                  <td className="py-3 px-4 text-gray-700">{leave.reason}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      leave.status === 'Approved' ? 'bg-green-100 text-green-800' :
                      leave.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {leave.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-blue-600 hover:text-blue-800 text-sm">
                      <Eye className="w-4 h-4" />
                    </button>
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
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Salary & Benefits</h3>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Download Payslip</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Monthly Salary</p>
                <p className="text-3xl font-bold">$8,500</p>
                <p className="text-sm text-blue-200">Base + Allowances</p>
              </div>
              <DollarSign className="w-12 h-12 text-blue-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">YTD Earnings</p>
                <p className="text-3xl font-bold">$93,500</p>
                <p className="text-sm text-green-200">January - November</p>
              </div>
              <Award className="w-12 h-12 text-green-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Bonus</p>
                <p className="text-3xl font-bold">$2,500</p>
                <p className="text-sm text-purple-200">Performance Bonus</p>
              </div>
              <Award className="w-12 h-12 text-purple-200" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Salary Breakdown</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Base Salary</span>
                <span className="font-medium text-gray-900">$7,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Housing Allowance</span>
                <span className="font-medium text-gray-900">$1,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Transport Allowance</span>
                <span className="font-medium text-gray-900">$300</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Medical Allowance</span>
                <span className="font-medium text-gray-900">$200</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span className="text-gray-900">Gross Salary</span>
                <span className="text-gray-900">$8,500</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Deductions</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Income Tax</span>
                <span className="font-medium text-red-600">-$1,200</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Social Security</span>
                <span className="font-medium text-red-600">-$340</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Health Insurance</span>
                <span className="font-medium text-red-600">-$150</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Retirement Fund</span>
                <span className="font-medium text-red-600">-$425</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span className="text-gray-900">Net Salary</span>
                <span className="text-green-600">$6,385</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

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
    <div className="w-full min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
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
              
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <nav className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors ${
                        activeSection === item.id
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainEmployeeDashboard;