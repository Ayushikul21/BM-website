import React, { useState, useEffect } from 'react';
import { Calendar, Clock, TrendingUp, Users, AlertCircle, CheckCircle, XCircle, Coffee, PlusCircle, FileText, Briefcase, RefreshCw } from 'lucide-react';

const UserAttendance = () => {
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
    return hours > 9 || (hours === 9 && minutes > 5);
  };

  // Function to calculate attendance statistics
  const calculateStats = (data) => {
    const { lastDay } = getDateRange();
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

  const [empId, setEmpId] = useState();

  useEffect(() => {
      const fetchUserDetails = async () => {
        try {
          const response = await fetch('https://bandymoot.com/api/v1/Dashboard/userDetails', {
            method: 'GET',
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const result = await response.json();
          const data = result.data;
          console.log("User data:", data);
          setEmpId(data.employeeId);
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      };
      fetchUserDetails();
    }, []);
  

  const fetchAttendanceData = async () => {
    if (!empId) {
      console.log('Employee ID not available yet');
      return;
    }
    
    setLoading(true);
    const { fromDate, toDate } = getDateRange();
    console.log('Employee ID:', empId);
    const url = `https://api.etimeoffice.com/api/DownloadInOutPunchData?Empcode=${empId}&FromDate=${fromDate}&ToDate=${toDate}`;
    
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
        throw new Error(`HTTPS ${response.status}: ${response.statusText}`);
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

  // Fetch attendance data when empId or month/year changes
  useEffect(() => {
    if (empId) {
      fetchAttendanceData();
    }
  }, [selectedMonth, selectedYear, empId]);

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

  // Add this state for selected calendar date
  const [selectedDate, setSelectedDate] = useState(null);

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
      // FIX: Use local date string instead of ISO string to avoid timezone issues
      const localDateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
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
        date: localDateStr, // Use local date string instead of ISO
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

  // Helper: format date to yyyy-mm-dd (for all date keys) - FIXED timezone issue
  const toISODate = (date) => {
    if (!date) return '';
    if (typeof date === 'string' && date.match(/^\d{4}-\d{2}-\d{2}$/)) return date;
    
    // Accepts Date object or string in dd/mm/yyyy
    let d;
    if (typeof date === 'string' && date.includes('/')) {
      const [day, month, year] = date.split('/');
      d = new Date(year, month - 1, day);
    } else if (typeof date === 'string') {
      // If it's already in yyyy-mm-dd format, parse as local date
      const [year, month, day] = date.split('-');
      d = new Date(year, month - 1, day);
    } else {
      d = new Date(date);
    }
    
    // Use local date components to avoid timezone issues
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Add Note state
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('attendanceNotes');
    return saved ? JSON.parse(saved) : {};
  });

  const [noteText, setNoteText] = useState('');
  const [noteError, setNoteError] = useState('');

  // Add this state for loading extra work API
  const [extraWorkLoading, setExtraWorkLoading] = useState(false);
  const [extraWorkSuccess, setExtraWorkSuccess] = useState('');
  const [extraWorkApiError, setExtraWorkApiError] = useState('');

  // Helper: convert yyyy-mm-dd to dd/mm/yyyy
  const toDDMMYYYY = (dateStr) => {
    if (!dateStr) return '';
    // Parse as local date to avoid timezone issues
    const [year, month, day] = dateStr.split('-');
    const d = new Date(year, month - 1, day);
    const dayFormatted = String(d.getDate()).padStart(2, '0');
    const monthFormatted = String(d.getMonth() + 1).padStart(2, '0');
    const yearFormatted = d.getFullYear();
    return `${dayFormatted}/${monthFormatted}/${yearFormatted}`;
  };

  // Extra Work state
  const [extraWorks, setExtraWorks] = useState(() => {
    const saved = localStorage.getItem('attendanceExtraWorks');
    return saved ? JSON.parse(saved) : {};
  });

  const [extraHours, setExtraHours] = useState('0.5');
  const [extraText, setExtraText] = useState('');
  const [extraError, setExtraError] = useState('');

  // Persist notes and extraWorks
  useEffect(() => {
    localStorage.setItem('attendanceNotes', JSON.stringify(notes));
  }, [notes]);
  useEffect(() => {
    localStorage.setItem('attendanceExtraWorks', JSON.stringify(extraWorks));
  }, [extraWorks]);

  // Helper: format date to readable string - FIXED timezone issue
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    // Parse as local date to avoid timezone issues
    let d;
    if (typeof dateStr === 'string' && dateStr.includes('/')) {
      const [day, month, year] = dateStr.split('/');
      d = new Date(year, month - 1, day);
    } else if (typeof dateStr === 'string') {
      const [year, month, day] = dateStr.split('-');
      d = new Date(year, month - 1, day);
    } else {
      d = new Date(dateStr);
    }
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Add this state for loading and success/error for notes API
  const [noteLoading, setNoteLoading] = useState(false);
  const [noteSuccess, setNoteSuccess] = useState('');
  const [noteApiError, setNoteApiError] = useState('');

  // Add state for fetched notes from API
  const [fetchedNotes, setFetchedNotes] = useState({});

  // Fetch notes from API when empId or month/year changes
  useEffect(() => {
    const fetchNotes = async () => {
      if (!empId) return;
      const { fromDate, toDate } = getDateRange();
      try {
        const response = await fetch('https://bandymoot.com/api/v1/attendance/GetEmployeeAttendanceByDate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            empcode: empId,
            fromDate, // format: dd/mm/yyyy
            toDate    // format: dd/mm/yyyy
          })
        });
        
        console.log('Fetching notes for:', { empId, fromDate, toDate });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Notes API error:', errorText);
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        
        const result = await response.json();
        console.log('Notes API response:', result);
        
        // Assuming result.data is an array of attendance objects with Notes and date
        const mapped = {};
        (result.data || []).forEach(item => {
          // item.date is expected as dd/mm/yyyy
          const dateStr = item.date || item.DateString || '';
          if (dateStr && item.Notes) {
            const [day, month, year] = dateStr.split('/');
            if (day && month && year) {
              const key = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
              mapped[key] = item.Notes;
            }
          }
        });
        setFetchedNotes(mapped);
      } catch (err) {
        console.error('Error fetching notes:', err);
        setFetchedNotes({});
      }
    };
    fetchNotes();
  }, [empId, selectedMonth, selectedYear]);

  // Merge local notes (just added) and fetchedNotes (from API)
  const getNoteForDate = (date) => {
    const key = toISODate(date);
    return notes[key] || fetchedNotes[key] || '';
  };

  // Update handleAddNote to call the API
  const handleAddNote = async (e) => {
    e.preventDefault();
    setNoteError('');
    setNoteApiError('');
    setNoteSuccess('');
    
    if (!selectedDate || !noteText.trim()) {
      setNoteError('Please select a date and enter a note.');
      return;
    }
    
    if (!empId) {
      setNoteApiError('Employee ID not available. Please try again.');
      return;
    }
    
    const key = toISODate(selectedDate);
    if (notes[key] || fetchedNotes[key]) {
      setNoteError('Note already exists for this date.');
      return;
    }
    
    setNoteLoading(true);
    try {
      const payload = {
        date: toDDMMYYYY(selectedDate),
        Notes: noteText.trim(),
        empcode: empId
      };
      
      console.log('Adding note with payload:', payload);
      
      const response = await fetch('https://bandymoot.com/api/v1/attendance/updateAttendanceNotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });
      
      console.log('Note API response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Note API error:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const result = await response.json();
      console.log('Note API success:', result);
      
      // Update both local state and refetch notes
      setNotes({ ...notes, [key]: noteText.trim() });
      setNoteSuccess('Note added successfully!');
      setNoteText('');
      
      // Refetch notes to ensure we have the latest data
      const { fromDate, toDate } = getDateRange();
      const notesResponse = await fetch('https://bandymoot.com/api/v1/attendance/GetEmployeeAttendanceByDate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          empcode: empId,
          fromDate,
          toDate
        })
      });
      
      if (notesResponse.ok) {
        const notesResult = await notesResponse.json();
        const mapped = {};
        (notesResult.data || []).forEach(item => {
          const dateStr = item.date || item.DateString || '';
          if (dateStr && item.Notes) {
            const [day, month, year] = dateStr.split('/');
            if (day && month && year) {
              const notesKey = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
              mapped[notesKey] = item.Notes;
            }
          }
        });
        setFetchedNotes(mapped);
      }
      
    } catch (err) {
      console.error('Error adding note:', err);
      setNoteApiError('Failed to add note. Please try again.');
    } finally {
      setNoteLoading(false);
    }
  };

  // Add Extra Work Handler (with API call)
  const handleAddExtraWork = async (e) => {
    e.preventDefault();
    setExtraError('');
    setExtraWorkApiError('');
    setExtraWorkSuccess('');
    
    if (!selectedDate || !extraText.trim()) {
      setExtraError('Please select a date and describe your work.');
      return;
    }
    
    if (!empId) {
      setExtraWorkApiError('Employee ID not available. Please try again.');
      return;
    }
    
    const key = toISODate(selectedDate);
    if (extraWorks[key] || fetchedExtraWorks[key]) {
      setExtraError('Extra work already logged for this date.');
      return;
    }
    
    setExtraWorkLoading(true);
    try {
      const payload = {
        date: toDDMMYYYY(selectedDate),
        extraWork: parseFloat(extraHours),
        description: extraText.trim(),
        employeeId: empId
      };
      
      console.log('Adding extra work with payload:', payload);
      
      const response = await fetch('https://bandymoot.com/api/v1/Dashboard/extraWorkInhours', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });
      
      console.log('Extra work API response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Extra work API error:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const result = await response.json();
      console.log('Extra work API success:', result);
      
      // Save with status 'pending'
      setExtraWorks({
        ...extraWorks,
        [key]: { hours: extraHours, text: extraText.trim(), status: 'pending' }
      });
      setExtraWorkSuccess('Extra work added successfully!');
      setExtraHours('0.5');
      setExtraText('');
      
      // Refetch extra works to ensure we have the latest data
      const extraWorksResponse = await fetch('https://bandymoot.com/api/v1/Dashboard/getAllExtraWorkByUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ employeeId: empId })
      });
      
      if (extraWorksResponse.ok) {
        const extraWorksResult = await extraWorksResponse.json();
        const mapped = {};
        (extraWorksResult.data || []).forEach(item => {
          const [day, month, year] = item.date.split('/');
          const extraKey = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
          mapped[extraKey] = {
            hours: String(item.extraWork),
            text: item.description,
            status: item.status ? item.status.toLowerCase() : 'pending'
          };
        });
        setFetchedExtraWorks(mapped);
      }
      
    } catch (err) {
      console.error('Error adding extra work:', err);
      setExtraWorkApiError('Failed to add extra work. Please try again.');
    } finally {
      setExtraWorkLoading(false);
    }
  };

  // Add state for fetched extra work data
  const [fetchedExtraWorks, setFetchedExtraWorks] = useState({});

  // Fetch extra work data from API on mount or when empId changes
  useEffect(() => {
    const fetchExtraWorks = async () => {
      if (!empId) return;
      try {
        const response = await fetch('https://bandymoot.com/api/v1/Dashboard/getAllExtraWorkByUser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ employeeId: empId })
        });
        
        console.log('Fetching extra works for employee:', empId);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Extra works API error:', errorText);
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        
        const result = await response.json();
        console.log('Extra works API response:', result);
        
        const mapped = {};
        (result.data || []).forEach(item => {
          if (item.date) {
            const [day, month, year] = item.date.split('/');
            const key = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            mapped[key] = {
              hours: String(item.extraWork),
              text: item.description,
              status: item.status ? item.status.toLowerCase() : 'pending'
            };
          }
        });
        setFetchedExtraWorks(mapped);
      } catch (err) {
        console.error('Error fetching extra works:', err);
        setFetchedExtraWorks({});
      }
    };
    fetchExtraWorks();
  }, [empId]);

  // Merge local extraWorks (for just-added) and fetchedExtraWorks (from API)
  const getExtraWorkForDate = (date) => {
    const key = toISODate(date);
    // Prefer local (just added), else fetched from API
    return extraWorks[key] || fetchedExtraWorks[key];
  };

  // Calendar click handler - FIXED timezone issue
  const handleCalendarDayClick = (day) => {
    console.log("Clicked day:", day);
    if (!day || day.status === 'Future') return;
    
    // Use the local date string directly (yyyy-mm-dd format)
    setSelectedDate(day.date);
    
    setNoteError('');
    setExtraError('');
    setNoteText('');
    setExtraText('');
    setExtraHours('0.5');
    setNoteSuccess('');
    setExtraWorkSuccess('');
    setNoteApiError('');
    setExtraWorkApiError('');
  };

  // Today's schedule
  const todaySchedule = {
    shiftTime: '09:00 AM - 06:00 PM',
    lunchBreak: '12:00 PM - 01:00 PM',
    department: 'SAP DATA ANALYST'
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
                <p className="text-2xl font-bold text-green-600">{attendanceStats.totalPresent + attendanceStats.totalLate}</p>
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
                      <button
                        type="button"
                        className={`w-full h-full flex items-center justify-center text-xs border rounded ${getStatusColor(day.status)} cursor-pointer hover:shadow-sm transition-shadow ${selectedDate === day.date ? 'ring-2 ring-blue-400' : ''}`}
                        onClick={() => handleCalendarDayClick(day)}
                        disabled={day.status === 'Future'}
                        tabIndex={day.status === 'Future' ? -1 : 0}
                      >
                        {day.day}
                      </button>
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

              {/* Show note/extra work for selected date */}
              {selectedDate && (
                <div className="mt-6">
                  <div className="mb-2 text-sm font-semibold text-blue-700 flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(selectedDate)}
                  </div>
                  {/* Note Section */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-100">
                    <h4 className="text-base font-semibold text-gray-900 flex items-center mb-2">
                      <FileText className="w-4 h-4 mr-2" />
                      Note
                    </h4>
                    {getNoteForDate(selectedDate) ? (
                      <div className="text-gray-800 text-sm">{getNoteForDate(selectedDate)}</div>
                    ) : (
                      <form onSubmit={handleAddNote} className="space-y-2">
                        <textarea
                          className="border border-gray-300 rounded px-2 py-1 w-full text-sm"
                          rows={2}
                          maxLength={200}
                          value={noteText}
                          onChange={e => setNoteText(e.target.value)}
                          placeholder="Write your note here..."
                        />
                        {noteError && <div className="text-xs text-red-600">{noteError}</div>}
                        {noteApiError && <div className="text-xs text-red-600">{noteApiError}</div>}
                        {noteSuccess && <div className="text-xs text-green-600">{noteSuccess}</div>}
                        <button
                          type="submit"
                          className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm disabled:opacity-50"
                          disabled={!noteText.trim() || getNoteForDate(selectedDate) || noteLoading}
                        >
                          {noteLoading ? (
                            <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                          ) : (
                            <PlusCircle className="w-4 h-4 mr-1" />
                          )}
                          Add Note
                        </button>
                      </form>
                    )}
                  </div>
                  {/* Extra Work Section */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <h4 className="text-base font-semibold text-gray-900 flex items-center mb-2">
                      <Briefcase className="w-4 h-4 mr-2" />
                      Extra Work
                    </h4>
                    {getExtraWorkForDate(selectedDate) ? (
                      <div className="relative">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">
                            {getExtraWorkForDate(selectedDate).hours === '1' ? 'Full Day' : 'Half Day'}
                          </div>
                          <div className="text-gray-800 text-sm">{getExtraWorkForDate(selectedDate).text}</div>
                        </div>
                        {/* Status badge at the end corner */}
                        <div className="absolute top-2 right-2">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold
                              ${
                                getExtraWorkForDate(selectedDate).status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : getExtraWorkForDate(selectedDate).status === 'approved'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }
                            `}
                          >
                            {getExtraWorkForDate(selectedDate).status === 'pending' && 'Pending'}
                            {getExtraWorkForDate(selectedDate).status === 'approved' && 'Approved'}
                            {getExtraWorkForDate(selectedDate).status === 'rejected' && 'Rejected'}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleAddExtraWork} className="space-y-2">
                        <div className="flex space-x-2 mb-1">
                          <label className={`flex items-center px-2 py-1 border rounded cursor-pointer text-sm ${extraHours === '0.5' ? 'bg-blue-100 border-blue-400' : 'bg-white border-gray-300'}`}>
                            <input
                              type="radio"
                              name="hours"
                              value="0.5"
                              checked={extraHours === '0.5'}
                              onChange={() => setExtraHours('0.5')}
                              className="mr-1"
                            />
                            Half Day (0.5)
                          </label>
                          <label className={`flex items-center px-2 py-1 border rounded cursor-pointer text-sm ${extraHours === '1' ? 'bg-blue-100 border-blue-400' : 'bg-white border-gray-300'}`}>
                            <input
                              type="radio"
                              name="hours"
                              value="1"
                              checked={extraHours === '1'}
                              onChange={() => setExtraHours('1')}
                              className="mr-1"
                            />
                            Full Day (1)
                          </label>
                        </div>
                        <textarea
                          className="border border-gray-300 rounded px-2 py-1 w-full text-sm"
                          rows={2}
                          maxLength={200}
                          value={extraText}
                          onChange={e => setExtraText(e.target.value)}
                          placeholder="Describe your extra work..."
                        />
                        {extraError && <div className="text-xs text-red-600">{extraError}</div>}
                        {extraWorkApiError && <div className="text-xs text-red-600">{extraWorkApiError}</div>}
                        {extraWorkSuccess && <div className="text-xs text-green-600">{extraWorkSuccess}</div>}
                        <button
                          type="submit"
                          className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm disabled:opacity-50"
                          disabled={!extraText.trim() || getExtraWorkForDate(selectedDate) || extraWorkLoading}
                        >
                          {extraWorkLoading ? (
                            <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                          ) : (
                            <PlusCircle className="w-4 h-4 mr-1" />
                          )}
                          Add Extra Work
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Today's Schedule */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                 Schedule
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
                  <span className="text-sm font-medium text-gray-600">Department</span>
                  <span className="text-sm text-gray-900">{todaySchedule.department}</span>
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