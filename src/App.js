import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';

import LoginForm from './components/LoginForm';
import LeaveForm from './components/LeaveForm';
import MainEmployeeDashboard from './components/MainEmployeeDashboard';
import MainAdminDashboard from './components/MainAdminDashboard';
import AdminWorkplan from './components/AdminWorkplan';
import RegistrationForm from './components/RegistrationForm';
import BankingInformationForm from './components/BankingInformationForm';
import PersonalDetailsForm from './components/PersonalDetailsForm';
import EducationForm from './components/EducationForm';
import EducationForm45 from './components/EducationForm45';
import EmploymentForm from './components/EmploymentForm';
import SkillsProjectsForm from './components/SkillsProjectsForm';
import ProfessionalReferencesForm from './components/ProfessionalReferencesForm';
import DocumentUploadForm from './components/DocumentUploadForm';
import ForgotPassword from './components/ForgotPassword';
import SalaryDetails from './components/SalaryPortalPayslip';



function AppWrapper() {
  const [userName, setUserName] = useState('');
  const [userpassword, setUserPassword] = useState('');
  const [userRole, setUserRole] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // const handleLogin = (idOrEmail) => {
  //   const user = userDatabase[idOrEmail];
  //   if (user) {
  //     setUserName(user.name);
  //     setUserRole(user.role);
  //     setUserPassword(user.password);
  //     setIsLoggedIn(true);
  //     if (user.role === 'admin') {
  //       navigate('/admin');
  //     } else {
  //       navigate('/dashboard');
  //     }
  //   } else {
  //     alert('Invalid Email ID or Employee ID');
  //   }
  // };

  const handleLeaveSubmit = () => {
    navigate('/dashboard');
  };

  return (
    <Routes>
      <Route path="/" element={<RegistrationForm />} />
      <Route path="/banking" element={<BankingInformationForm />} />
      <Route path="/salary" element={<SalaryDetails />} />
      <Route path="/personal" element={<PersonalDetailsForm/>}/>
      <Route path="/education" element={<EducationForm/>}/>
      <Route path="/education45" element={<EducationForm45/>}/>
      <Route path="/employment" element={<EmploymentForm/>}/>
      <Route path="/skills" element={<SkillsProjectsForm/>}/>
      <Route path="/document" element={<DocumentUploadForm/>}/>
      <Route path="/professional" element={<ProfessionalReferencesForm/>}/>
      <Route path="/login" element={<LoginForm/>} />
      <Route path="/forgotPassword" element={<ForgotPassword/>}/>
      <Route path="/leave" element={<LeaveForm userName={userName} onSubmit={handleLeaveSubmit} />} />
      <Route path="/dashboard" element={<MainEmployeeDashboard onSubmit={handleLeaveSubmit}/>} />
      <Route path="/admin" element={<MainAdminDashboard/>}/>
      <Route path="/workplan" element={<AdminWorkplan />}/>
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper/>
    </Router>
  );
}

export default App;
