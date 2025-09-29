import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

// --- Modal Component with blur background ---
const Modal = ({ open, onClose, children, title, width = 'max-w-md' }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className={`bg-white rounded-lg shadow-lg ${width} w-full max-h-[90vh] overflow-hidden flex flex-col`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            className="text-gray-500 hover:text-gray-700 text-xl transition-colors"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
};   


const AdminAttendance = () => {
  const navigate = useNavigate();
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [notification, setNotification] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateFilter, setDateFilter] = useState('month');

  // --- Popup states for Notes ---
  const [showNotesPopup, setShowNotesPopup] = useState(false);
  const [popupNotes, setPopupNotes] = useState([]);
  const [popupNotesLoading, setPopupNotesLoading] = useState(false);

  // --- Work Approval System States ---
    const [showWorkApprovalPopup, setShowWorkApprovalPopup] = useState(false);
    const [workActiveTab, setWorkActiveTab] = useState('pending');
    const [workSearchTerm, setWorkSearchTerm] = useState('');
    const [workDateFrom, setWorkDateFrom] = useState('');
    const [workDateTo, setWorkDateTo] = useState('');
    const [workApplications, setWorkApplications] = useState([]);

  // Get formatted date
  function getFormattedDate(date = selectedDate) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const currentdate = getFormattedDate();
  const attendanceApi = `https://api.etimeoffice.com/api/DownloadInOutPunchData?Empcode=ALL&FromDate=${currentdate}&ToDate=${currentdate}`;

  // Fetch attendance data
  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        setLoading(true);
        const response = await fetch(attendanceApi, {
          headers: {
            'Authorization': `Basic ${btoa(`BANDYMOOT001:OMDUBEY:Rudra@123:true`)}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch attendance data');
        const data = await response.json();
        setAttendanceData(data.InOutPunchData || []);
      } catch (err) {
        setError(err.message);
        showNotification(err.message, 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchAttendanceData();
  }, [attendanceApi, selectedDate]);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Transform API data to match our UI structure
  const transformAttendanceData = (data) => {
    return data.map(emp => ({
      name: emp.Name,
      id: emp.Empcode,
      checkIn: emp.INTime === '--:--' ? '--' : formatTime(emp.INTime),
      checkOut: emp.OUTTime === '--:--' ? '--' : formatTime(emp.OUTTime),
      status: getStatus(emp.Status, emp.Late_In),
      hours: emp.WorkTime === '00:00' ? '0h' : `${emp.WorkTime}h`,
      lateIn: emp.Late_In
    }));
  };
  
    // API endpoint
    const API_BASE_URL = "https://bandymoot.com/api/v1/Dashboard";
  
    // Fetch extra work applications from API
    const fetchExtraWorkData = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        
        if (!token) {
          throw new Error("No authentication token found");
        }
  
        console.log("Fetching data with token:", token);
  
        const response = await fetch(`${API_BASE_URL}/getAllExtraWorkByAdmin`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
  
        console.log("Response status:", response.status);
  
        if (!response.ok) {
          // Handle different HTTP status codes
          if (response.status === 401) {
            throw new Error("Authentication failed. Please log in again.");
          } else if (response.status === 403) {
            throw new Error("You don't have permission to access this resource.");
          } else if (response.status === 404) {
            throw new Error("API endpoint not found.");
          } else {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
        }
  
        const result = await response.json();
        console.log("Raw API Response:", result);
  
        // Check if the API returned success
        if (!result.success) {
          throw new Error(result.message || "API request failed");
        }
  
        const data = result.data || [];
  
        console.log("Raw Extra Work Data from API:", data);
  
        // Transform API data to match component structure
        const transformedData = data.map((item, index) => ({
        id: item._id || `extra-work-${index}`,
        work: item.extraWork || "FULL DAY",
        name: item.name || "Unknown Employee",
        empId: item.EMPID || "N/A",
        task: item.description || "No description provided",
        status: (item.status || "pending").toLowerCase(),
        date: item.DateString || new Date().toISOString().split("T")[0],
      }));
  
        console.log("Transformed Extra Work Data:", transformedData);
        setWorkApplications(transformedData);
        
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
        showNotification(`Error: ${error.message}`, 'error');
      } finally {
        setLoading(false);
      }
    };
  
    // Call fetch on component mount - REMOVED DUPLICATE useEffect
    useEffect(() => {
      fetchExtraWorkData();
    }, []);
  
    // Work approval system functions - UPDATED to handle API calls
    const handleWorkApprove = async (id) => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/ApproveExtraWork`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            extraWorkId: id,
            status: "Approved"
          }),
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const result = await response.json();
        
        if (result.success) {
          setWorkApplications(prev => 
            prev.map(app => 
              app.id === id ? { ...app, status: 'approved' } : app
            )
          );
          showNotification('Work application approved successfully!', 'success');
        } else {
          throw new Error(result.message || "Failed to update status");
        }
      } catch (error) {
        console.error("Error approving work:", error);
        showNotification(`Error: ${error.message}`, 'error');
      }
    };
  
    const handleWorkReject = async (id) => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/ApproveExtraWork`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            extraWorkId: id,
            status: "Rejected"
          }),
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const result = await response.json();
        
        if (result.success) {
          setWorkApplications(prev => 
            prev.map(app => 
              app.id === id ? { ...app, status: 'rejected' } : app
            )
          );
          showNotification('Work application rejected successfully!', 'success');
        } else {
          throw new Error(result.message || "Failed to update status");
        }
      } catch (error) {
        console.error("Error rejecting work:", error);
        showNotification(`Error: ${error.message}`, 'error');
      }
    };
  
   // Filter work applications based on active tab, search term, and date range
    const getFilteredWorkApplications = () => {
      return workApplications.filter(app => {
        // Safely check if app exists
        if (!app) return false;
        
        const matchesTab = app.status === workActiveTab;
        
        // Safe search with fallbacks for undefined values
        const safeName = (app.name || '').toLowerCase();
        const safeEmpId = (app.empId || '').toString();
        const safeTask = (app.task || '').toLowerCase();
        const safeSearchTerm = (workSearchTerm || '').toLowerCase();
        
        const matchesSearch =
          safeName.includes(safeSearchTerm) ||
          safeEmpId.includes(workSearchTerm) || // Keep original case for ID
          safeTask.includes(safeSearchTerm);
  
        let matchesDateRange = true;
        if (workDateFrom && workDateTo && app.date) {
          try {
            // Handle different date formats safely
            let appDate;
            if (app.date.includes('/')) {
              // Handle dd/mm/yyyy format
              const [day, month, year] = app.date.split("/");
              appDate = new Date(`${year}-${month}-${day}`);
            } else {
              // Handle yyyy-mm-dd format
              appDate = new Date(app.date);
            }
  
            // Check if date is valid
            if (isNaN(appDate.getTime())) {
              matchesDateRange = true; // Don't filter out invalid dates
            } else {
              const fromDate = new Date(workDateFrom);
              const toDate = new Date(workDateTo);
              
              // Set time to beginning and end of day for proper comparison
              fromDate.setHours(0, 0, 0, 0);
              toDate.setHours(23, 59, 59, 999);
              appDate.setHours(12, 0, 0, 0); // Set to midday for stable comparison
  
              matchesDateRange = appDate >= fromDate && appDate <= toDate;
            }
          } catch (error) {
            console.error("Error parsing date:", error, app);
            matchesDateRange = true; // Don't filter out if date parsing fails
          }
        }
  
        return matchesTab && matchesSearch && matchesDateRange;
      });
    };
    
    // Get count for each tab
    const getWorkTabCount = (status) => {
      return workApplications.filter(app => app.status === status).length;
    };
  
    // Work Application Card Component
    const WorkApplicationCard = ({ app }) => (
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4 shadow-sm">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Work: {app.work === 0.5 ? 'Half Day' : 'Full day'}</h3>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            app.status === 'approved' ? 'bg-green-100 text-green-800' :
            'bg-red-100 text-red-800'
          }`}>
            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
          </span>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <span className="text-lg mr-2">👤</span>
            <span className="text-sm">Name: {app.name}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <span className="text-lg mr-2">🆔</span>
            <span className="text-sm">Emp ID: {app.empId}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <span className="text-lg mr-2">📅</span>
            <span className="text-sm">Date: {app.date}</span>
          </div>
          <div className="flex items-start text-gray-600">
            <span className="text-lg mr-2 mt-0.5">💼</span>
            <span className="text-sm">Task: {app.task}</span>
          </div>
        </div>
        
        {app.status === 'pending' && (
          <div className="flex gap-3">
            <button
              onClick={() => handleWorkApprove(app.id)}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
            >
              APPROVE
            </button>
            <button
              onClick={() => handleWorkReject(app.id)}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
            >
              REJECT
            </button>
          </div>
        )}
      </div>
    );

  // --- Fetch Notes for popup ---
  const fetchNotesPopupData = async (date) => {
    setPopupNotesLoading(true);
    setPopupNotes([]);
    try {
      const token = localStorage.getItem('token');
      const notesRes = await fetch('https://bandymoot.com/api/v1/attendance/getAttendanceByDate', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ date: date })
      });
      
      console.log('Notes API Response Status:', notesRes.status);
      console.log("DateString",date);
      
      if (!notesRes.ok) {
        throw new Error(`HTTP ${notesRes.status}: ${await notesRes.text()}`);
      }
      
      const notesJson = await notesRes.json();
      console.log('Notes API Response:', notesJson);
      
      const notesData = notesJson.data || [];
      
      // Filter out entries without notes
      const notesWithContent = notesData.filter(item => 
        item.Notes && item.Notes.trim() !== ''
      );
      
      setPopupNotes(notesWithContent);
      showNotification(`Found ${notesWithContent.length} notes for ${date}`, 'success');
      
    } catch (error) {
      console.error('Error fetching notes:', error);
      showNotification('Failed to fetch notes: ' + error.message, 'error');
      setPopupNotes([]);
    } finally {
      setPopupNotesLoading(false);
    }
  };

  // --- Handle calendar date click ---
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const formatTime = (time) => {
    if (time === '--:--') return '--';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const getStatus = (statusCode, lateIn) => {
    if (statusCode === 'A') return 'Absent';
    if (statusCode === 'P') {
      return lateIn > '00:05' ? 'Late' : 'Present';
    }
    return 'Unknown';
  };

  // Filter data based on search and filters
  const getFilteredData = () => {
    const transformedData = transformAttendanceData(attendanceData);
    return transformedData.filter(emp => {
      const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !statusFilter || emp.status.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  };

  // Calculate stats
  const calculateStats = () => {
    const transformedData = transformAttendanceData(attendanceData);
    const presentCount = transformedData.filter(emp => emp.status === 'Present').length;
    const absentCount = transformedData.filter(emp => emp.status === 'Absent').length;
    const lateCount = transformedData.filter(emp => emp.status === 'Late').length;
    const totalCount = transformedData.length;
    return { presentCount, absentCount, lateCount, totalCount };
  };

  const { presentCount, absentCount, lateCount, totalCount } = calculateStats();

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Export functions
  const exportToPDF = () => {
    showNotification('PDF export initiated!', 'success');
  };

  const exportToExcel = () => {
    showNotification('Excel export initiated!', 'success');
  };

  // Quick action functions
  const viewSchedule = () => {
    showNotification('Schedule view opened!', 'success');
  };

  const filteredData = getFilteredData();

  // Handle view change (month/year)
  const handleViewChange = (view) => {
    setDateFilter(view);
  };

  // Load Font Awesome CSS
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p>Loading attendance data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="font-sans bg-gray-50 min-h-screen text-gray-800 text-sm">
      <div className="max-w-7xl mx-auto p-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-xl p-5 transition-all cursor-pointer hover:shadow-md">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-100 text-green-800 flex items-center justify-center text-xl">
                <i className="fas fa-user-check"></i>
              </div>
              <div>
                <div className="text-2xl font-bold">{presentCount + lateCount}</div>
                <div className="text-sm text-gray-500 font-medium">Present Today</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 transition-all cursor-pointer hover:shadow-md">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-red-100 text-red-800 flex items-center justify-center text-xl">
                <i className="fas fa-user-times"></i>
              </div>
              <div>
                <div className="text-2xl font-bold">{absentCount}</div>
                <div className="text-sm text-gray-500 font-medium">Absent Today</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 transition-all cursor-pointer hover:shadow-md">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-yellow-100 text-yellow-800 flex items-center justify-center text-xl">
                <i className="fas fa-user-clock"></i>
              </div>
              <div>
                <div className="text-2xl font-bold">{lateCount}</div>
                <div className="text-sm text-gray-500 font-medium">Late Arrivals</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 transition-all cursor-pointer hover:shadow-md">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center text-xl">
                <i className="fas fa-users"></i>
              </div>
              <div>
                <div className="text-2xl font-bold">{totalCount}</div>
                <div className="text-sm text-gray-500 font-medium">Total Employees</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Attendance Section */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-5 text-gray-800 flex items-center gap-2 pb-3 border-b border-gray-200">
              <i className="fas fa-table"></i>
              Today's Attendance ({currentdate})
            </h2>
            <div className="flex flex-wrap gap-3 mb-5">
              <input
                type="text"
                className="flex-1 min-w-[140px] px-3 py-2 border border-gray-300 rounded text-sm transition-all bg-white focus:border-blue-500 focus:outline-none"
                placeholder="Search employee..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                className="flex-1 min-w-[140px] px-3 py-2 border border-gray-300 rounded text-sm transition-all bg-white focus:border-blue-500 focus:outline-none"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
              </select>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full mt-4 text-sm">
                <thead>
                  <tr>
                    <th className="px-3 py-3 text-left border-b border-gray-200 bg-gray-50 text-gray-700 font-semibold text-xs uppercase tracking-wider">Employee</th>
                    <th className="px-3 py-3 text-left border-b border-gray-200 bg-gray-50 text-gray-700 font-semibold text-xs uppercase tracking-wider">Employee ID</th>
                    <th className="px-3 py-3 text-left border-b border-gray-200 bg-gray-50 text-gray-700 font-semibold text-xs uppercase tracking-wider">Check In</th>
                    <th className="px-3 py-3 text-left border-b border-gray-200 bg-gray-50 text-gray-700 font-semibold text-xs uppercase tracking-wider">Check Out</th>
                    <th className="px-3 py-3 text-left border-b border-gray-200 bg-gray-50 text-gray-700 font-semibold text-xs uppercase tracking-wider">Hours</th>
                    <th className="px-3 py-3 text-left border-b border-gray-200 bg-gray-50 text-gray-700 font-semibold text-xs uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((emp, index) => (
                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="px-3 py-3">{emp.name}</td>
                      <td className="px-3 py-3 font-medium">{emp.id}</td>
                      <td className="px-3 py-3">{emp.checkIn}</td>
                      <td className="px-3 py-3">{emp.checkOut}</td>
                      <td className="px-3 py-3">{emp.hours}</td>
                      <td className="px-3 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold uppercase tracking-wide ${
                          emp.status === 'Present' ? 'bg-green-100 text-green-800' :
                          emp.status === 'Absent' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {emp.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            {/* Current Time Display */}
            <div className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl p-5 text-center mb-5">
              <div className="text-2xl font-bold mb-1">{currentTime.toLocaleTimeString()}</div>
              <div className="text-xs opacity-90 mb-4">
                {currentTime.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
            {/* Calendar Section */}
            <div className="mb-5">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-semibold text-gray-700">
                  <i className="fas fa-calendar-alt mr-2"></i>
                  Attendance Calendar
                </h3>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleViewChange('day')}
                    className={`px-2 py-1 text-xs rounded transition-colors ${dateFilter === 'day' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    Day
                  </button>
                  <button
                    onClick={() => handleViewChange('month')}
                    className={`px-2 py-1 text-xs rounded transition-colors ${dateFilter === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    Month
                  </button>
                  <button
                    onClick={() => handleViewChange('year')}
                    className={`px-2 py-1 text-xs rounded transition-colors ${dateFilter === 'year' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    Year
                  </button>
                </div>
              </div>
              <Calendar
                onChange={handleDateChange}
                value={selectedDate}
                view={dateFilter === 'day' ? undefined : dateFilter === 'month' ? 'year' : 'decade'}
                className="border border-gray-200 rounded-lg p-2 w-full react-calendar-custom"
              />
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-5">
              <h4 className="text-sm font-semibold mb-3 text-gray-700 flex items-center gap-2">
                <i className="fas fa-download"></i> Export Reports
              </h4>
              <div className="flex gap-2">
                <button
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-xs font-medium flex items-center justify-center gap-1 transition-colors"
                  onClick={exportToPDF}
                >
                  <i className="fas fa-file-pdf"></i>
                  PDF
                </button>
                <button
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-xs font-medium flex items-center justify-center gap-1 transition-colors"
                  onClick={exportToExcel}
                >
                  <i className="fas fa-file-excel"></i>
                  Excel
                </button>
              </div>
            </div>
            {/* --- Quick Action --- */}
            <h3 className="text-sm font-semibold mb-3 text-gray-700 flex items-center gap-2 pb-2 border-b border-gray-200">
              <i className="fas fa-bolt"></i>
              Quick Actions
            </h3>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => navigate('/workplan')}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-xs font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <i className="fas fa-chart-bar"></i>
                View Workplan
              </button>
              <button
                className="w-full bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-xs font-medium flex items-center justify-center gap-2 transition-colors"
                onClick={viewSchedule}
              >
                <i className="fas fa-calendar-alt"></i>
                View Schedule
              </button>
              {/* --- Notes button --- */}
              <button
                className="w-full bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-xs font-medium flex items-center justify-center gap-2 transition-colors"
                onClick={() => {
                  fetchNotesPopupData(getFormattedDate(selectedDate));
                  setShowNotesPopup(true);
                }}
              >
                <i className="fas fa-sticky-note"></i>
                Employee Notes
              </button>

              {/* Extra Notes */}
              <button
                className="w-full bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-xs font-medium flex items-center justify-center gap-2 transition-colors"
                onClick={() => 
                  // navigate('/extraWork')
                  setShowWorkApprovalPopup(true)
                }
              >
                <i className="fas fa-sticky-note"></i>
                Extra Work Details
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- Notes Popup Modal --- */}
      <Modal 
        open={showNotesPopup} 
        onClose={() => setShowNotesPopup(false)}
        title={`Employee Notes - ${getFormattedDate(selectedDate)}`}
        width="max-w-2xl"
      >
        {popupNotesLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mb-2"></div>
            <p className="text-gray-600">Loading notes...</p>
          </div>
        ) : (
          <div>
            {popupNotes.length > 0 ? (
              <div className="space-y-3">
                {popupNotes.map((note, idx) => (
                  <div key={idx} className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-medium text-gray-800">{note.Name || note.Name}</span>
                        <span className="text-gray-600 mx-2">-</span>
                        <span className="font-semibold text-purple-800">{note.Empcode}</span>
                      </div>
                      <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                        Note
                      </span>
                    </div>
                    <div className="text-gray-700 text-sm bg-white p-3 rounded border border-gray-200">
                      {note.Notes}
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      Added on: {note.date || getFormattedDate(selectedDate)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <i className="fas fa-sticky-note text-4xl text-gray-300 mb-3"></i>
                <p className="text-gray-500">No notes found for this date.</p>
                <p className="text-gray-400 text-sm mt-1">Employees haven't added any notes for {getFormattedDate(selectedDate)}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Work Approval System Popup */}
      <Modal 
        open={showWorkApprovalPopup} 
        onClose={() => setShowWorkApprovalPopup(false)}
        title="Extra Work Approval System"
        width="max-w-2xl"
      >
        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-center">
              <span className="text-red-500 mr-2">❌</span>
              <span className="text-red-700 font-medium">Error: {error}</span>
            </div>
            <button
              onClick={fetchExtraWorkData}
              className="mt-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading applications...</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Tab Navigation */}
            <div className="flex bg-gray-100 mb-4 rounded-lg overflow-hidden">
              <button
                onClick={() => setWorkActiveTab('pending')}
                className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                  workActiveTab === 'pending' 
                    ? 'bg-black text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Pending ({getWorkTabCount('pending')})
              </button>
              <button
                onClick={() => setWorkActiveTab('approved')}
                className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                  workActiveTab === 'approved' 
                    ? 'bg-black text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Approved ({getWorkTabCount('approved')})
              </button>
              <button
                onClick={() => setWorkActiveTab('rejected')}
                className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                  workActiveTab === 'rejected' 
                    ? 'bg-black text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Rejected ({getWorkTabCount('rejected')})
              </button>
            </div>

            {/* Filters */}
            <div className="space-y-3 mb-4 bg-gray-50 p-4 rounded-lg">
              {/* Refresh Button */}
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-700">Filters</h4>
                <button
                  onClick={fetchExtraWorkData}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs transition-colors"
                >
                  🔄 Refresh
                </button>
              </div>

              {/* Date Range */}
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">📅</span>
                  <input
                    type={workDateFrom ? "date" : "text"}
                    value={workDateFrom}
                    onFocus={(e) => (e.target.type = "date")}
                    onBlur={(e) => {
                      if (!e.target.value) e.target.type = "text";
                    }}
                    onChange={(e) => setWorkDateFrom(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="From Date"
                  />
                </div>
                <div className="flex-1 relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">📅</span>
                  <input
                    type={workDateTo ? "date" : "text"}
                    value={workDateTo}
                    onFocus={(e) => (e.target.type = "date")}
                    onBlur={(e) => {
                      if (!e.target.value) e.target.type = "text";
                    }}
                    onChange={(e) => setWorkDateTo(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="To Date"
                  />
                </div> 
              </div>

              {/* Search */}
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
                <input
                  type="text"
                  value={workSearchTerm}
                  onChange={(e) => setWorkSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search Name, Employee ID, or Task..."
                />
              </div>
            </div>

            {/* Applications List */}
            <div className="max-h-96 overflow-y-auto">
              {getFilteredWorkApplications().length > 0 ? (
                getFilteredWorkApplications().map(app => (
                  app ? <WorkApplicationCard key={app.id} app={app} /> : null
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <div className="text-4xl mb-4">📋</div>
                  <p className="text-lg font-medium">No {workActiveTab} applications found</p>
                  {(workSearchTerm || workDateFrom || workDateTo) && (
                    <p className="text-sm mt-2">Try adjusting your search or date filters</p>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </Modal>

      {/* Notification */}
      {notification && (
        <div className={`fixed top-5 right-5 p-4 rounded-lg shadow-lg text-sm font-medium z-50 border-l-4 max-w-sm ${
          notification.type === 'error' 
            ? 'bg-red-50 border-red-500 text-red-700' 
            : 'bg-green-50 border-green-500 text-green-700'
        }`}>
          <div className="flex items-center">
            <span className="mr-2">{notification.type === 'error' ? '❌' : '✅'}</span>
            {notification.message}
          </div>
        </div>
      )}

      {/* Notification */}
      {/* {notification && (
        <div className={`fixed top-5 right-5 p-4 rounded-lg shadow-lg text-sm font-medium z-50 border-l-4 max-w-sm ${
          notification.type === 'error' 
            ? 'bg-red-50 border-red-500 text-red-700' 
            : 'bg-green-50 border-green-500 text-green-700'
        }`}>
          <div className="flex items-center">
            <i className={`fas ${
              notification.type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'
            } mr-2`}></i>
            {notification.message}
          </div>
        </div>
      )} */}

      {/* Custom Calendar CSS */}
      <style jsx global>{`
        .react-calendar-custom {
          width: 100%;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          padding: 0.5rem;
          font-family: inherit;
        }
        .react-calendar-custom .react-calendar__navigation {
          display: flex;
          height: 44px;
          margin-bottom: 1em;
          background-color: #f8fafc;
          border-radius: 0.375rem;
        }
        .react-calendar-custom .react-calendar__navigation button {
          min-width: 44px;
          background: none;
          border: none;
          font-weight: 600;
          color: #334155;
        }
        .react-calendar-custom .react-calendar__navigation button:enabled:hover,
        .react-calendar-custom .react-calendar__navigation button:enabled:focus {
          background-color: #e2e8f0;
        }
        .react-calendar-custom .react-calendar__month-view__weekdays {
          text-align: center;
          text-transform: uppercase;
          font-weight: 600;
          font-size: 0.75em;
          color: #64748b;
        }
        .react-calendar-custom .react-calendar__month-view__days__day--weekend {
          color: #dc2626;
        }
        .react-calendar-custom .react-calendar__tile[aria-label$="Friday"],
        .react-calendar-custom .react-calendar__tile[aria-label$="Saturday"] {
          color: #dc2626;
        }
        .react-calendar-custom .react-calendar__tile {
          max-width: 100%;
          padding: 0.5em 0.5em;
          background: none;
          text-align: center;
          line-height: 16px;
          border-radius: 0.25rem;
        }
        .react-calendar-custom .react-calendar__tile:enabled:hover,
        .react-calendar-custom .react-calendar__tile:enabled:focus {
          background-color: #e2e8f0;
        }
        .react-calendar-custom .react-calendar__tile--now {
          background: #dbeafe;
          color: #1e40af;
          font-weight: bold;
        }
        .react-calendar-custom .react-calendar__tile--active {
          background: #3b82f6;
          color: white;
          font-weight: bold;
        }
        .react-calendar-custom .react-calendar__tile--active:enabled:hover,
        .react-calendar-custom .react-calendar__tile--active:enabled:focus {
          background: #2563eb;
        }
      `}</style>
    </div>
  );
};

export default AdminAttendance;