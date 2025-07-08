import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminWorkplan from './AdminWorkplan';

const AdminAttendance = () => {
  const navigate = useNavigate();

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
  const [currentTime, setCurrentTime] = useState(new Date());
  const [clockedIn, setClockedIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [notification, setNotification] = useState(null);

  // Sample data
  const attendanceData = [
    { name: "Vandana Srivastav", id: "EMP001", department: "IT", checkIn: "09:00 AM", status: "Present", hours: "8.0h" },
    { name: "Ayushi Kulshrestha", id: "EMP002", department: "IT", checkIn: "09:45 AM", status: "Late", hours: "8.0h" },
    { name: "Shakshi Sharma", id: "EMP003", department: "IT", checkIn: "--", status: "Absent", hours: "0h" },
    { name: "Riddhima", id: "EMP004", department: "IT", checkIn: "08:55 AM", status: "Present", hours: "8.0h" },
    { name: "Rushda", id: "EMP005", department: "IT", checkIn: "09:30 AM", status: "Late", hours: "7.2h" },
    { name: "Atul", id: "EMP006", department: "IT", checkIn: "09:15 AM", status: "Present", hours: "7.8h" },
    { name: "Arvind", id: "EMP007", department: "IT", checkIn: "08:45 AM", status: "Present", hours: "8.2h" },
    { name: "Afnan", id: "EMP008", department: "IT", checkIn: "09:10 AM", status: "Present", hours: "7.9h" },
    { name: "Adarsh", id: "EMP009", department: "IT", checkIn: "09:05 AM", status: "Present", hours: "8.0h" }
  ];

  // // Update time every second
  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setCurrentTime(new Date());
  //   }, 1000);

  //   return () => clearInterval(timer);
  // }, []);

  // Filter data based on search and filters
  const getFilteredData = () => {
    return attendanceData.filter(emp => {
      const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !statusFilter || emp.status.toLowerCase().includes(statusFilter.toLowerCase());
      const matchesDepartment = !departmentFilter || emp.department.toLowerCase().includes(departmentFilter.toLowerCase());
      
      return matchesSearch && matchesStatus && matchesDepartment;
    });
  };

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // // Clock in/out functionality
  // const toggleClock = () => {
  //   if (clockedIn) {
  //     setClockedIn(false);
  //     showNotification('Clocked out successfully!', 'success');
  //   } else {
  //     setClockedIn(true);
  //     showNotification('Clocked in successfully!', 'success');
  //   }
  // };

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
  const presentCount = filteredData.filter(emp => emp.status === 'Present').length;
  const absentCount = filteredData.filter(emp => emp.status === 'Absent').length;
  const lateCount = filteredData.filter(emp => emp.status === 'Late').length;

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        {/* Stats Grid */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statContent}>
              <div style={{...styles.statIcon, ...styles.statIconPresent}}>
                <i className="fas fa-user-check"></i>
              </div>
              <div style={styles.statDetails}>
                <div style={styles.statNumber}>11</div>
                <div style={styles.statLabel}>Present Today</div>
              </div>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statContent}>
              <div style={{...styles.statIcon, ...styles.statIconAbsent}}>
                <i className="fas fa-user-times"></i>
              </div>
              <div style={styles.statDetails}>
                <div style={styles.statNumber}>1</div>
                <div style={styles.statLabel}>Absent Today</div>
              </div>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statContent}>
              <div style={{...styles.statIcon, ...styles.statIconLate}}>
                <i className="fas fa-user-clock"></i>
              </div>
              <div style={styles.statDetails}>
                <div style={styles.statNumber}>1</div>
                <div style={styles.statLabel}>Late Arrivals</div>
              </div>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statContent}>
              <div style={{...styles.statIcon, ...styles.statIconTotal}}>
                <i className="fas fa-users"></i>
              </div>
              <div style={styles.statDetails}>
                <div style={styles.statNumber}>16</div>
                <div style={styles.statLabel}>Total Employees</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={styles.mainContent}>
          {/* Attendance Section */}
          <div style={styles.attendanceSection}>
            <h2 style={styles.sectionTitle}>
              <i className="fas fa-table"></i>
              Today's Attendance
            </h2>
            
            <div style={styles.filterSection}>
              <input
                type="text"
                style={styles.filterInput}
                placeholder="Search employee..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                style={styles.filterInput}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
              </select>
              <select
                style={styles.filterInput}
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
              >
                <option value="">All Departments</option>
                <option value="IT">IT</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <table style={styles.attendanceTable}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>Employee</th>
                  <th style={styles.tableHeader}>Employee ID</th>
                  <th style={styles.tableHeader}>Department</th>
                  <th style={styles.tableHeader}>Check In</th>
                  <th style={styles.tableHeader}>Status</th>
                  <th style={styles.tableHeader}>Hours</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((emp, index) => (
                  <tr key={index} style={styles.tableRow}>
                    <td style={styles.tableCell}>{emp.name}</td>
                    <td style={styles.tableCell}>{emp.id}</td>
                    <td style={styles.tableCell}>{emp.department}</td>
                    <td style={styles.tableCell}>{emp.checkIn}</td>
                    <td style={styles.tableCell}>
                      <span style={{
                        ...styles.statusBadge,
                        ...styles[`status${emp.status}`]
                      }}>
                        {emp.status}
                      </span>
                    </td>
                    <td style={styles.tableCell}>{emp.hours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Quick Actions */}
          <div style={styles.quickActions}>
            <div style={styles.clockInSection}>
              <div style={styles.currentTime}>
                {currentTime.toLocaleTimeString()}
              </div>
              <div style={styles.currentDate}>
                {currentTime.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              {/* <button style={styles.clockBtn} onClick={toggleClock}>
                <i className={clockedIn ? "fas fa-sign-out-alt" : "fas fa-clock"}></i>
                {clockedIn ? ' Clock Out' : ' Clock In'}
              </button> */}
            </div>

            <div style={styles.exportSection}>
              <h4 style={styles.exportTitle}>
                <i className="fas fa-download"></i> Export Reports
              </h4>
              <div style={styles.exportButtons}>
                <button style={{...styles.actionBtn, ...styles.pdfBtn}} onClick={exportToPDF}>
                  <i className="fas fa-file-pdf"></i>
                  PDF
                </button>
                <button style={{...styles.actionBtn, ...styles.exportBtn}} onClick={exportToExcel}>
                  <i className="fas fa-file-excel"></i>
                  Excel
                </button>
              </div>
            </div>

            <h3 style={styles.sectionTitle}>
              <i className="fas fa-bolt"></i>
              Quick Actions
            </h3>
            
            <div style={styles.quickActionsList}>
              <button 
                onClick={() => navigate('/workplan')}
                style={{...styles.actionBtn, ...styles.actionBtnFullWidth}}>
                <i className="fas fa-chart-bar"></i>
                View Workplan
              </button>
              
              <button style={{...styles.actionBtn, ...styles.actionBtnFullWidth}} onClick={viewSchedule}>
                <i className="fas fa-calendar-alt"></i>
                View Schedule
              </button>
              
              <button style={{...styles.actionBtn, ...styles.actionBtnFullWidth}} onClick={sendNotifications}>
                <i className="fas fa-bell"></i>
                Send Notifications
              </button>

              <button style={{...styles.actionBtn, ...styles.actionBtnFullWidth}} onClick={generateDetailedReport}>
                <i className="fas fa-chart-line"></i>
                Detailed Analytics
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div style={{
          ...styles.notification,
          ...styles.notificationShow,
          ...(notification.type === 'error' ? styles.notificationError : {})
        }}>
          {notification.message}
        </div>
      )}
    </div>
  );
};

const styles = {
  body: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    background: '#f8fafc',
    minHeight: '100vh',
    color: '#1e293b',
    fontSize: '14px',
    lineHeight: '1.5',
    margin: 0,
    padding: 0,
    boxSizing: 'border-box'
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '16px'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '16px',
    marginBottom: '24px'
  },
  statCard: {
    background: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '20px',
    transition: 'all 0.2s ease',
    position: 'relative',
    cursor: 'pointer'
  },
  statContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  statIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px'
  },
  statIconPresent: {
    background: '#dcfce7',
    color: '#166534'
  },
  statIconAbsent: {
    background: '#fee2e2',
    color: '#991b1b'
  },
  statIconLate: {
    background: '#fef3c7',
    color: '#92400e'
  },
  statIconTotal: {
    background: '#e0e7ff',
    color: '#3730a3'
  },
  statDetails: {
    flex: 1
  },
  statNumber: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1e293b'
  },
  statLabel: {
    fontSize: '13px',
    color: '#64748b',
    fontWeight: '500',
    marginTop: '2px'
  },
  mainContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 320px',
    gap: '24px'
  },
  attendanceSection: {
    background: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)'
  },
  quickActions: {
    background: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '20px',
    color: '#1e293b',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    paddingBottom: '12px',
    borderBottom: '1px solid #e2e8f0'
  },
  filterSection: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
    flexWrap: 'wrap'
  },
  filterInput: {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '13px',
    transition: 'all 0.2s ease',
    flex: 1,
    minWidth: '140px',
    background: 'white'
  },
  attendanceTable: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '16px',
    fontSize: '13px'
  },
  tableHeader: {
    padding: '12px',
    textAlign: 'left',
    borderBottom: '1px solid #e2e8f0',
    background: '#f8fafc',
    color: '#374151',
    fontWeight: '600',
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  tableRow: {
    borderBottom: '1px solid #e2e8f0',
    cursor: 'pointer'
  },
  tableCell: {
    padding: '12px',
    textAlign: 'left',
    borderBottom: '1px solid #e2e8f0'
  },
  statusBadge: {
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  statusPresent: {
    background: '#dcfce7',
    color: '#166534'
  },
  statusAbsent: {
    background: '#fee2e2',
    color: '#991b1b'
  },
  statusLate: {
    background: '#fef3c7',
    color: '#92400e'
  },
  clockInSection: {
    background: 'linear-gradient(135deg, #1e40af, #1e3a8a)',
    color: 'white',
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'center',
    marginBottom: '20px'
  },
  currentTime: {
    fontSize: '24px',
    fontWeight: '700',
    marginBottom: '4px'
  },
  currentDate: {
    fontSize: '12px',
    opacity: '0.9',
    marginBottom: '16px'
  },
  clockBtn: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  exportSection: {
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '20px'
  },
  exportTitle: {
    marginBottom: '12px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151'
  },
  exportButtons: {
    display: 'flex',
    gap: '8px'
  },
  actionBtn: {
    background: '#1e40af',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '12px',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    justifyContent: 'center',
    textDecoration: 'none',
    flex: 1
  },
  actionBtnFullWidth: {
    width: '100%',
    marginBottom: '8px'
  },
  exportBtn: {
    background: '#059669'
  },
  pdfBtn: {
    background: '#dc2626'
  },
  quickActionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  notification: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '12px 16px',
    background: 'white',
    borderRadius: '8px',
    borderLeft: '4px solid #059669',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    fontSize: '13px',
    fontWeight: '500',
    zIndex: 1000
  },
  notificationShow: {
    opacity: 1,
    transform: 'translateX(0)'
  },
  notificationError: {
    borderLeftColor: '#dc2626'
  }
};

export default AdminAttendance;