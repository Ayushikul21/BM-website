import React, { useState, useEffect } from 'react';
import { Calendar, Clock, TrendingUp, Users, AlertCircle, CheckCircle, XCircle, Coffee, MapPin, RefreshCw } from 'lucide-react';

const UserAttendance = () => {
  const [currentDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [userdata, setUserdata] = useState([]);
  const [loading, setLoading] = useState(false);
  const [attendanceStats, setAttendanceStats] = useState({
    totalPresent: 0,
    totalAbsent: 0,
    totalLate: 0,
    totalLeave: 0,
    totalWorkingDays: 0,
    totalWeekends: 0
  });

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch data when month/year changes
  useEffect(() => {
    fetchAttendanceData();
  }, [selectedMonth, selectedYear]);

  // Helper function to parse date strings
  const parseDateString = (dateStr) => {
    if (!dateStr) return null;
    const parts = dateStr.split('/');
    if (parts.length !== 3) return null;
    
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    
    return new Date(year, month, day);
  };

  // Helper function to get date range for the selected month
  const getDateRange = () => {
    const firstDay = new Date(selectedYear, selectedMonth, 1);
    const lastDay = new Date(selectedYear, selectedMonth + 1, 0);
    
    const formatDate = (date) => {
      return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
    };

    const fromDate = formatDate(firstDay);
    const toDate = formatDate(lastDay);
    
    console.log(`Fetching data from ${fromDate} to ${toDate}`);
    
    return {
      fromDate,
      toDate,
      firstDay,
      lastDay
    };
  };

  // Helper function to check if a date is weekend (Friday or Saturday)
  const isWeekend = (date) => {
    const day = date.getDay();
    return day === 5 || day === 6; // Friday = 5, Saturday = 6
  };

  // Helper function to parse time string and check if late
  const isLateArrival = (timeString) => {
    if (!timeString || timeString === '-') return false;
    
    // Parse time string (assuming format like "09:30" or "9:30 AM")
    const time = timeString.replace(/[^\d:]/g, '');
    const [hours, minutes] = time.split(':').map(Number);
    
    // Consider late if after 9:00 AM
    return hours > 9 || (hours === 9 && minutes > 0);
  };

  // Function to calculate attendance statistics
  const calculateStats = (data) => {
    const { firstDay, lastDay } = getDateRange();
    const daysInMonth = lastDay.getDate();
    const today = new Date();
    
    let totalPresent = 0;
    let totalAbsent = 0;
    let totalLate = 0;
    let totalLeave = 0;
    let totalWeekends = 0;
    let totalWorkingDays = 0;

    // Create a map of attendance records by date for easy lookup
    const attendanceMap = new Map();
    data.forEach(record => {
      const recordDate = parseDateString(record.DateString);
      if (recordDate) {
        const dateKey = recordDate.toISOString().split('T')[0];
        attendanceMap.set(dateKey, record);
      }
    });

    // Process each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(selectedYear, selectedMonth, day);
      const dateKey = currentDate.toISOString().split('T')[0];
      
      if (isWeekend(currentDate)) {
        totalWeekends++;
      } else {
        // Only count working days
        totalWorkingDays++;
        
        // Only process attendance for past dates and today
        if (currentDate <= today) {
          const attendanceRecord = attendanceMap.get(dateKey);
          
          if (attendanceRecord) {
            if (attendanceRecord.INTime && attendanceRecord.INTime !== '--:--') {
              if (isLateArrival(attendanceRecord.INTime)) {
                totalLate++;
              } else {
                totalPresent++;
              }
            } else {
              // Check if it's a planned leave
              if (attendanceRecord.Status === 'Leave' || 
                  (attendanceRecord.Remarks && attendanceRecord.Remarks.includes('Leave'))) {
                totalLeave++;
              } else {
                totalAbsent++;
              }
            }
          } else {
            // No record found for this working day - mark as absent
            totalAbsent++;
          }
        }
        // Future dates are not counted in any category
      }
    }

    return {
      totalPresent,
      totalAbsent,
      totalLate,
      totalLeave,
      totalWorkingDays,
      totalWeekends
    };
  };

  // Helper function to map status codes to display text
  const getDisplayStatus = (statusCode) => {
    if (statusCode === 'A') return 'Absent';
    if (statusCode === 'P') return 'Present';
    if (statusCode === 'L') return 'Leave';
    if (statusCode === 'WO') return 'Weekend';
    return statusCode; // Return as-is for other cases
  };

  const fetchAttendanceData = async () => {
    setLoading(true);
    const { fromDate, toDate } = getDateRange();
    
    const url = `https://api.etimeoffice.com/api/DownloadInOutPunchData?Empcode=10118&FromDate=${fromDate}&ToDate=${toDate}`;
    
    console.log('API URL:', url);
    console.log('Date Range:', { fromDate, toDate });

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${btoa(`BANDYMOOT001:OMDUBEY:Rudra@123:true`)}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      const attendanceData = data.InOutPunchData || [];
      console.log('Attendance Data:', attendanceData);
      
      // Filter data to only include records within the selected month
      const filteredData = attendanceData.filter(record => {
        const recordDate = parseDateString(record.DateString);
        return recordDate && 
               recordDate.getMonth() === selectedMonth && 
               recordDate.getFullYear() === selectedYear;
      });
      
      setUserdata(filteredData);
      setAttendanceStats(calculateStats(filteredData));
      
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      // Set empty data on error
      setUserdata([]);
      setAttendanceStats({
        totalPresent: 0,
        totalAbsent: 0,
        totalLate: 0,
        totalLeave: 0,
        totalWorkingDays: 0,
        totalWeekends: 0
      });
    } finally {
      setLoading(false);
    }
  };

  // Generate complete attendance history including missing dates
  const generateAttendanceHistory = () => {
    const { lastDay } = getDateRange();
    const daysInMonth = lastDay.getDate();
    const today = new Date();
    
    // Create a map of existing records
    const recordMap = new Map();
    userdata.forEach(record => {
      const recordDate = parseDateString(record.DateString);
      if (recordDate) {
        const dateKey = recordDate.toISOString().split('T')[0];
        recordMap.set(dateKey, record);
      }
    });

    // Generate complete history for the month
    const history = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(selectedYear, selectedMonth, day);
      const dateKey = date.toISOString().split('T')[0];
      
      // Skip future dates
      if (date > today) continue;
      
      let record = recordMap.get(dateKey);
      
      if (!record) {
        // Create empty record for missing dates
        record = {
          DateString: `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`,
          INTime: '--:--',
          OUTTime: '--:--',
          WorkTime: '0',
          Status: isWeekend(date) ? 'Weekend' : 'Absent',
          Remarks: ''
        };
      }
      
      history.push({
        ...record,
        dateObj: date
      });
    }
    
    return history;
  };

  // Generate calendar data with attendance status
  const generateCalendarData = () => {
    const firstDay = new Date(selectedYear, selectedMonth, 1);
    const lastDay = new Date(selectedYear, selectedMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    const today = new Date();

    const calendarDays = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      calendarDays.push(null);
    }

    // Create a map of attendance records by date for easy lookup
    const attendanceMap = new Map();
    userdata.forEach(record => {
      const recordDate = parseDateString(record.DateString);
      if (recordDate) {
        const dateKey = recordDate.toISOString().split('T')[0];
        attendanceMap.set(dateKey, record);
      }
    });

    // Add days of the month with attendance status
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(selectedYear, selectedMonth, day);
      const dateKey = date.toISOString().split('T')[0];
      const dateStr = date.toISOString().split('T')[0];
      
      let status = 'Future'; // Default for future dates
      
      // Check if it's a weekend
      if (isWeekend(date)) {
        status = 'Weekend';
      } else if (date <= today) {
        // Only determine status for past dates and today
        const attendanceRecord = attendanceMap.get(dateKey);
        
        if (attendanceRecord) {
          
          if (attendanceRecord.INTime && attendanceRecord.INTime !== '--:--') {
            status = isLateArrival(attendanceRecord.INTime) ? 'Late' : 'Present';
          } else {
            status = (attendanceRecord.Status === 'Leave' || 
                     (attendanceRecord.Remarks && attendanceRecord.Remarks.includes('Leave'))) 
                     ? 'Leave' : 'Absent';
            
          }
        } else {
          // No record found for this working day
          status = 'Absent';
        }
      }
      
      calendarDays.push({
        day,
        date: dateStr,
        status,
        fullDate: date
      });
    }

    return calendarDays;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Present': return 'bg-green-100 text-green-800 border-green-200';
      case 'Absent': return 'bg-red-100 text-red-800 border-red-200';
      case 'Late': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Leave': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Weekend': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Future': return 'bg-gray-100 text-gray-500 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Present': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'Absent': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'Late': return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'Leave': return <Coffee className="w-4 h-4 text-blue-600" />;
      case 'Weekend': return <Users className="w-4 h-4 text-purple-600" />;
      default: return <CheckCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Calculate attendance percentage correctly
  const calculateAttendancePercentage = () => {
    const totalDaysConsidered = attendanceStats.totalPresent + attendanceStats.totalAbsent + attendanceStats.totalLate + attendanceStats.totalLeave;
    
    if (totalDaysConsidered === 0) return 0;
    
    // Attendance percentage = (Present + Late) / Total Days Considered * 100
    // This ensures it never exceeds 100%
    const presentDays = attendanceStats.totalPresent + attendanceStats.totalLate;
    return Math.round((presentDays / totalDaysConsidered) * 100);
  };

  const attendancePercentage = calculateAttendancePercentage();

  // Today's schedule
  const todaySchedule = {
    shiftTime: '09:05 AM - 06:00 PM',
    breakTime: '01:00 PM - 02:00 PM',
    lunchBreak: '12:00 PM - 01:00 PM',
    department: 'Software Development',
    location: 'Floor 3, Building A',
    supervisor: 'John Smith'
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Attendance Dashboard</h1>
              <p className="text-gray-600">Track your attendance, view history, and manage your schedule</p>
            </div>
            <button
              onClick={fetchAttendanceData}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Present Days</p>
                <p className="text-2xl font-bold text-green-600">{attendanceStats.totalPresent}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Absent Days</p>
                <p className="text-2xl font-bold text-red-600">{attendanceStats.totalAbsent}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Late Arrivals</p>
                <p className="text-2xl font-bold text-yellow-600">{attendanceStats.totalLate}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Leave Days</p>
                <p className="text-2xl font-bold text-blue-600">{attendanceStats.totalLeave}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Coffee className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Weekends</p>
                <p className="text-2xl font-bold text-purple-600">{attendanceStats.totalWeekends}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Percentage */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Attendance Rate</h3>
            <span className="text-2xl font-bold text-green-600">{attendancePercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-green-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${attendancePercentage}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {attendanceStats.totalPresent + attendanceStats.totalLate} out of {attendanceStats.totalPresent + attendanceStats.totalAbsent + attendanceStats.totalLate + attendanceStats.totalLeave} counted days
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Clock, Calendar, and Today's Schedule */}
          <div className="lg:col-span-1">
            {/* Current Time Clock */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Current Time
              </h3>
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {currentTime.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit', 
                    second: '2-digit',
                    hour12: true 
                  })}
                </div>
                <div className="text-sm text-gray-600">
                  {currentTime.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
            </div>

            {/* Mini Calendar */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Calendar
                </h3>
                <div className="flex items-center space-x-2">
                  <select 
                    value={selectedMonth} 
                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                    className="border border-gray-300 rounded px-2 py-1 text-xs"
                  >
                    {monthNames.map((month, index) => (
                      <option key={index} value={index}>{month.substring(0, 3)}</option>
                    ))}
                  </select>
                  <select 
                    value={selectedYear} 
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    className="border border-gray-300 rounded px-2 py-1 text-xs"
                  >
                    <option value={2024}>2024</option>
                    <option value={2025}>2025</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                  <div key={day} className="text-center text-xs font-medium text-gray-600 py-1">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {generateCalendarData().map((day, index) => (
                  <div key={index} className="aspect-square">
                    {day ? (
                      <div className={`w-full h-full flex items-center justify-center text-xs border rounded ${getStatusColor(day.status)} cursor-pointer hover:shadow-sm transition-shadow`}>
                        {day.day}
                      </div>
                    ) : (
                      <div className="w-full h-full"></div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Legend */}
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded mr-1"></div>
                  <span>Present</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded mr-1"></div>
                  <span>Absent</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-500 rounded mr-1"></div>
                  <span>Late</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded mr-1"></div>
                  <span>Leave</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded mr-1"></div>
                  <span>Weekend</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded mr-1"></div>
                  <span>Future</span>
                </div>
              </div>
            </div>

            {/* Today's Schedule */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Today's Schedule
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Shift Time</span>
                  <span className="text-sm text-gray-900">{todaySchedule.shiftTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Lunch Break</span>
                  <span className="text-sm text-gray-900">{todaySchedule.lunchBreak}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Tea Break</span>
                  <span className="text-sm text-gray-900">{todaySchedule.breakTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Department</span>
                  <span className="text-sm text-gray-900">{todaySchedule.department}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Location</span>
                  <span className="text-sm text-gray-900 flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {todaySchedule.location}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Supervisor</span>
                  <span className="text-sm text-gray-900">{todaySchedule.supervisor}</span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Weekends</span>
                    <span className="text-sm text-gray-900">Friday & Saturday</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Attendance History */}
          <div className="lg:col-span-2">
            {/* Attendance History */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Attendance History - {monthNames[selectedMonth]} {selectedYear}
              </h3>
              
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mr-2" />
                  <span className="text-gray-600">Loading attendance data...</span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Punch In</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Punch Out</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Hours</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {generateAttendanceHistory().length > 0 ? (
                        generateAttendanceHistory()
                          .sort((a, b) => new Date(b.dateObj) - new Date(a.dateObj)) // Sort by date descending
                          .map((item, index) => {
                            const recordDate = parseDateString(item.DateString) || item.dateObj;
                            const isLate = isLateArrival(item.INTime);
                            
                            // Modified status determination logic
                            let status;
                            if (item.INTime && item.INTime !== '--:--') {
                              status = isLate ? 'Late' : 'Present';
                            } else if (item.Status === 'Leave' || (item.Remarks && item.Remarks.includes('Leave'))) {
                              status = 'Leave';
                            } else {
                              status = getDisplayStatus(item.Status);
                            }
                            
                            return (
                              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="py-3 px-4 text-sm text-gray-900">
                                  {recordDate.toLocaleDateString('en-US', { 
                                    weekday: 'short', 
                                    month: 'short', 
                                    day: 'numeric' 
                                  })}
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900">{item.INTime || '--:--'}</td>
                                <td className="py-3 px-4 text-sm text-gray-900">{item.OUTTime || '--:--'}</td>
                                <td className="py-3 px-4 text-sm text-gray-900">{item.WorkTime || '0'}h</td>
                                <td className="py-3 px-4">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                                    {getStatusIcon(status)}
                                    <span className="ml-1">{status}</span>
                                  </span>
                                </td>
                              </tr>
                            );
                          })
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center py-8 text-gray-500">
                            No attendance data found for {monthNames[selectedMonth]} {selectedYear}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAttendance;