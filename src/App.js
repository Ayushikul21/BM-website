// import React from 'react';
// import LoginForm from './LoginForm';
// import Dashboard from './Dashboard';
// import LeaveForm from './LeaveForm';
// import { useState } from 'react';
// import './App.css';

// function App() {
//   const [userName, setUserName] = useState('');
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   const handleLogin = (name) => {
//     setUserName(name);
//     setIsLoggedIn(true);
//   };

//   return (
//     <div className="App">
//       {isLoggedIn ? (
//         <Dashboard userName={userName} />
//       ) : (
//         <LoginForm onLogin={handleLogin} />
//       )}
//       {/* <LeaveForm /> */}

//     </div>
//   );
// }

// export default App;

import React, { useState } from 'react';
import LoginForm from './components/LoginForm';
import LeaveForm from './components/LeaveForm';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import MainEmployeeDashboard from './components/MainEmployeeDashboard';
import MainAdminDashboard from './components/MainAdminDashboard';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');

  const userDatabase = {
    'admin001@company.com': { name: 'Admin', role: 'admin' },
    'EMP1001': { name: 'Admin', role: 'admin' },

    'ayushi123@company.com': { name: 'Ayushi Kulshrestha', role: 'user' },
    'EMP2001': { name: 'Ayushi Kulshrestha', role: 'user' },

    'rahul456@company.com': { name: 'Rahul Verma', role: 'user' },
    'EMP2002': { name: 'Rahul Verma', role: 'user' }
  };

  const handleLogin = (idOrEmail) => {
    const user = userDatabase[idOrEmail];
    if (user) {
      setUserName(user.name);
      setUserRole(user.role);
      setCurrentPage(user.role === 'admin' ? 'admin' : 'dashboard');
    } else {
      alert('Invalid Email ID or Employee ID');
    }
  };

  const handleLeaveSubmit = () => {
    setCurrentPage('dashboard');
  };

  return (
    <>
      {currentPage === 'login' && <LoginForm onLogin={handleLogin} />}
      {currentPage === 'leave' && <LeaveForm userName={userName} onSubmit={handleLeaveSubmit}/>}
      {currentPage === 'dashboard' && (
        <Dashboard userName={userName} onSubmit={handleLeaveSubmit} />
      )}
      {currentPage === 'admin' && <AdminDashboard />}
      <MainEmployeeDashboard/>
      <MainAdminDashboard/>
    </>
  );
}

export default App;

