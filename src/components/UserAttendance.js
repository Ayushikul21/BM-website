import React, { useState, useEffect } from 'react';
import { Calendar, Clock, TrendingUp, Users, AlertCircle, CheckCircle, XCircle, Coffee, MapPin } from 'lucide-react';

const UserAttendance = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [userdata, setuserdata] = useState({});

  //Update current time every second
  useEffect(() => {
     hello()
     console.log('here:userdata}')
     console.log("i am running high")
     console.log('->', userdata)
  }, []);

  // Sample attendance data
  const attendanceStats = {
    totalPresent: 18,
    totalAbsent: 2,
    totalLate: 3,
    totalLeave: 5,
    totalWorkingDays: 23
  };

  // Sample attendance history
  const attendanceHistory = [
    { date: '2025-01-08', punchIn: '09:00 AM', punchOut: '06:00 PM', hours: '8.5', status: 'Present' },
    { date: '2025-01-07', punchIn: '09:15 AM', punchOut: '06:00 PM', hours: '8.25', status: 'Late' },
    { date: '2025-01-06', punchIn: '09:00 AM', punchOut: '06:00 PM', hours: '8.5', status: 'Present' },
    { date: '2025-01-05', punchIn: '-', punchOut: '-', hours: '0', status: 'Absent' },
    { date: '2025-01-04', punchIn: '09:00 AM', punchOut: '06:00 PM', hours: '8.5', status: 'Present' },
    { date: '2025-01-03', punchIn: '09:30 AM', punchOut: '06:00 PM', hours: '8.0', status: 'Late' },
    { date: '2025-01-02', punchIn: '09:00 AM', punchOut: '06:00 PM', hours: '8.5', status: 'Present' },
    { date: '2025-01-01', punchIn: '-', punchOut: '-', hours: '0', status: 'Leave' }
  ];

  async function hello () {
      const url = "https://api.etimeoffice.com/api/DownloadInOutPunchData?Empcode=10111&FromDate=01/07/2025&ToDate=07/07/2025";

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
        console.log(data)

        let userdata = data.InOutPunchData[0]
        console.log(data.InOutPunchData)
        setuserdata(userdata)
        console.log("bzdbagbadi",userdata)
        // console.log(employeeData)
        // setuserdata(employeeData)
        // console.log("user All details",userdata)
       
      } catch (error) {
        console.error("Error:", error);
        
      }
    };
   
    

  // Today's schedule
  const todaySchedule = {
    shiftTime: '09:00 AM - 06:00 PM',
    breakTime: '01:00 PM - 02:00 PM',
    lunchBreak: '12:00 PM - 01:00 PM',
    department: 'Software Development',
    location: 'Floor 3, Building A',
    supervisor: 'John Smith'
  };

  // Generate calendar data
  const generateCalendarData = () => {
    const firstDay = new Date(selectedYear, selectedMonth, 1);
    const lastDay = new Date(selectedYear, selectedMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const calendarDays = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      calendarDays.push(null);
    }

    // Add days of the month with attendance status
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const attendanceRecord = attendanceHistory.find(record => record.date === dateStr);
      
      calendarDays.push({
        day,
        date: dateStr,
        status: attendanceRecord ? attendanceRecord.status : 'Present'
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
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'P': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'A': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'Late': return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'Leave': return <Coffee className="w-4 h-4 text-blue-600" />;
      default: return <CheckCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const attendancePercentage = Math.round((attendanceStats.totalPresent / attendanceStats.totalWorkingDays) * 100);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Attendance Dashboard</h1>
          <p className="text-gray-600">Track your attendance, view history, and manage your schedule</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
            {attendanceStats.totalPresent} out of {attendanceStats.totalWorkingDays} working days
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
              </div>
            </div>
          </div>

          {/* Right Column - Attendance History */}
          <div className="lg:col-span-2">
            {/* Attendance History */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Recent Attendance History
              </h3>
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
                      <tr className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-900">{userdata.DateString}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{userdata.INTime}</td>

                        <td className="py-3 px-4 text-sm text-gray-900">{userdata.OUTTime}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{userdata.WorkTime}h</td>
                        <td className="py-3 px-4">
                          {/* <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(userdata.status)}`}>
                            {getStatusIcon(userdata.status)}
                            <span className="ml-1">{userdata.status}</span>
                          </span> */}
                        </td>
                      </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAttendance;