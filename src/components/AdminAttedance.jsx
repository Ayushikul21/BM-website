import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

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
  const [dateFilter, setDateFilter] = useState('month'); // 'month', 'year'

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
        const response = await fetch(attendanceApi, {
          headers: {
            'Authorization': `Basic ${btoa(`BANDYMOOT001:OMDUBEY:Rudra@123:true`)}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch attendance data');
        }
        
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
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

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

  // // Helper functions
  // const getDepartmentFromRemark = (remark) => {
  //   if (remark.includes('MIS-EI')) return 'IT';
  //   if (remark.includes('MIS-LT')) return 'IT';
  //   return 'Other';
  // };

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
    setTimeout(() => setNotification(null), 3000);
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

  const sendNotifications = () => {
    showNotification('Notifications sent!', 'success');
  };

  const generateDetailedReport = () => {
    showNotification('Generating detailed report...', 'success');
  };

  const filteredData = getFilteredData();

  // Handle date change from calendar
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

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
          <div className="bg-white border border-gray-200 rounded-xl p-5 transition-all cursor-pointer">
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
          <div className="bg-white border border-gray-200 rounded-xl p-5 transition-all cursor-pointer">
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
          <div className="bg-white border border-gray-200 rounded-xl p-5 transition-all cursor-pointer">
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
          <div className="bg-white border border-gray-200 rounded-xl p-5 transition-all cursor-pointer">
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
                className="flex-1 min-w-[140px] px-3 py-2 border border-gray-300 rounded text-sm transition-all bg-white"
                placeholder="Search employee..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                className="flex-1 min-w-[140px] px-3 py-2 border border-gray-300 rounded text-sm transition-all bg-white"
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
                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer">
                      <td className="px-3 py-3">{emp.name}</td>
                      <td className="px-3 py-3">{emp.id}</td>
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
            <div className="bg-gradient-to-r from-blue-800 to-blue-900 text-black rounded-xl p-5 text-center mb-5">
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
                    className={`px-2 py-1 text-xs rounded ${dateFilter === 'day' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                  >
                    Day
                  </button>
                  <button 
                    onClick={() => handleViewChange('month')}
                    className={`px-2 py-1 text-xs rounded ${dateFilter === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                  >
                    Month
                  </button>
                  <button 
                    onClick={() => handleViewChange('year')}
                    className={`px-2 py-1 text-xs rounded ${dateFilter === 'year' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                  >
                    Year
                  </button>
                </div>
              </div>
              <Calendar
                onChange={handleDateChange}
                value={selectedDate}
                view={dateFilter === 'day' ? undefined : dateFilter === 'month' ? 'year' : 'decade'}
                className="border border-gray-200 rounded-lg p-2 w-full"
              />
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-5">
              <h4 className="text-sm font-semibold mb-3 text-gray-700 flex items-center gap-2">
                <i className="fas fa-download"></i> Export Reports
              </h4>
              <div className="flex gap-2">
                <button 
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-xs font-medium flex items-center justify-center gap-1"
                  onClick={exportToPDF}
                >
                  <i className="fas fa-file-pdf"></i>
                  PDF
                </button>
                <button 
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-xs font-medium flex items-center justify-center gap-1"
                  onClick={exportToExcel}
                >
                  <i className="fas fa-file-excel"></i>
                  Excel
                </button>
              </div>
            </div>

            <h3 className="text-sm font-semibold mb-3 text-gray-700 flex items-center gap-2 pb-2 border-b border-gray-200">
              <i className="fas fa-bolt"></i>
              Quick Actions
            </h3>
            
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => navigate('/workplan')}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-xs font-medium flex items-center justify-center gap-2"
              >
                <i className="fas fa-chart-bar"></i>
                View Workplan
              </button>
              
              <button 
                className="w-full bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-xs font-medium flex items-center justify-center gap-2"
                onClick={viewSchedule}
              >
                <i className="fas fa-calendar-alt"></i>
                View Schedule
              </button>
              
              <button 
                className="w-full bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-xs font-medium flex items-center justify-center gap-2"
                onClick={sendNotifications}
              >
                <i className="fas fa-bell"></i>
                Send Notifications
              </button>

              <button 
                className="w-full bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-xs font-medium flex items-center justify-center gap-2"
                onClick={generateDetailedReport}
              >
                <i className="fas fa-chart-line"></i>
                Detailed Analytics
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`fixed top-5 right-5 p-3 px-4 bg-white rounded-lg shadow-lg text-sm font-medium z-50 border-l-4 ${
          notification.type === 'error' ? 'border-red-500' : 'border-green-500'
        }`}>
          {notification.message}
        </div>
      )}

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
        
        /* Highlight Friday and Saturday as weekends */
        .react-calendar-custom .react-calendar__month-view__days__day--weekend {
          color: #dc2626;
        }
        
        /* Specifically target Friday (5) and Saturday (6) */
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