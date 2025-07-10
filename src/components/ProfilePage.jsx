import React, { useEffect, useRef, useState } from "react";

// Helper for localStorage get/set
const getLS = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
};
const setLS = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const delLS = (key) => localStorage.removeItem(key);

const originalData = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@company.com",
  phone: "+1 (555) 123-4567",
  dateOfBirth: "1990-05-15",
  gender: "male",
  address: "123 Main Street, Apt 4B, New York, NY 10001",
  emergencyName: "Jane Doe",
  emergencyRelation: "Spouse",
  emergencyPhone: "+1 (555) 987-6543",
  emergencyEmail: "jane.doe@email.com",
};

const employmentInfo = [
  { label: "Employee ID", value: "EMP001" },
  { label: "Department", value: "Information Technology" },
  { label: "Position", value: "Software Developer" },
  { label: "Join Date", value: "January 15, 2020" },
  { label: "Employment Type", value: "Full-time" },
  { label: "Manager", value: "Sarah Johnson" },
];

const defaultUser = {
  name: "Sakshi Sharma",
  empId: "10119",
  position: "Software Developer",
};

const ProfilePage = () => {
  // State for forms
  const [profile, setProfile] = useState(() =>
    Object.assign({}, originalData, getLS("profileData", {}))
  );
  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [passwordStrength, setPasswordStrength] = useState("");
  const [notification, setNotification] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(() =>
    localStorage.getItem("profilePhoto") ||
    `https://via.placeholder.com/150/4A90E2/FFFFFF?text=JD`
  );
  const [user, setUser] = useState(() =>
    getLS("currentUser", defaultUser)
  );
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(false);

  // Refs for file input
  const photoInputRef = useRef();

  // Set up keyboard shortcuts and beforeunload
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
      if (e.ctrlKey && e.key === "r") {
        e.preventDefault();
        handleReset();
      }
      if (e.key === "Escape") {
        setNotification(null);
      }
    };
    const onBeforeUnload = (e) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue =
          "You have unsaved changes. Are you sure you want to leave?";
        return e.returnValue;
      }
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, [hasChanges]);

  // Load draft data if any
  useEffect(() => {
    const draft = getLS("profileDataDraft", {});
    if (Object.keys(draft).length) {
      setProfile((prev) => ({ ...prev, ...draft }));
    }
  }, []);

  // Auto-save draft
  useEffect(() => {
    const handler = setTimeout(() => {
      setLS("profileDataDraft", profile);
    }, 1500);
    return () => clearTimeout(handler);
  }, [profile]);

  // Password strength
  useEffect(() => {
    const pwd = password.new;
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    if (!pwd) setPasswordStrength("");
    else if (score < 3) setPasswordStrength("weak");
    else if (score < 5) setPasswordStrength("medium");
    else setPasswordStrength("strong");
  }, [password.new]);

  // Effect: update userName and profileName
  useEffect(() => {
    if (profile.firstName && profile.lastName) {
      setUser((u) => ({
        ...u,
        name: `${profile.firstName} ${profile.lastName}`,
      }));
    }
  }, [profile.firstName, profile.lastName]);

  // Save profile data
  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLS("profileData", profile);
      setLS(
        "currentUser",
        Object.assign({}, user, {
          name: `${profile.firstName} ${profile.lastName}`,
        })
      );
      delLS("profileDataDraft");
      setNotification({ type: "success", message: "Profile updated successfully!" });
      setHasChanges(false);
      setLoading(false);
    }, 1000);
  };

  // Reset profile data
  const handleReset = () => {
    if (
      window.confirm("Are you sure you want to reset all changes?")
    ) {
      delLS("profileData");
      delLS("profileDataDraft");
      setProfile({ ...originalData });
      setHasChanges(false);
      setNotification({
        type: "warning",
        message: "Profile reset to original values",
      });
    }
  };

  // Logout functionality
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      delLS("currentUser");
      delLS("isLoggedIn");
      setNotification({ type: "success", message: "Logged out successfully" });
      setTimeout(() => {
        // window.location.href = 'login.html';
        alert("Redirecting to login page...");
      }, 1500);
    }
  };

  // Change detection
  const handleInput = (e) => {
    setProfile((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setHasChanges(true);
  };

  // Emergency Contact
  const handleEmergencyInput = (e) => {
    setProfile((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setHasChanges(true);
  };

  // Change password
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPassword((p) => ({ ...p, [name]: value }));
  };
  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!password.current) {
      setNotification({
        type: "error",
        message: "Please enter your current password",
      });
      return;
    }
    if (password.new.length < 8) {
      setNotification({
        type: "error",
        message: "New password must be at least 8 characters long",
      });
      return;
    }
    if (password.new !== password.confirm) {
      setNotification({
        type: "error",
        message: "New passwords do not match",
      });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setNotification({
        type: "success",
        message: "Password changed successfully!",
      });
      setPassword({ current: "", new: "", confirm: "" });
      setPasswordStrength("");
    }, 2000);
  };

  // Phone formatting
  const handlePhoneInput = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length >= 10) {
      value = value.replace(
        /(\d{1})(\d{3})(\d{3})(\d{4})/,
        "+$1 ($2) $3-$4"
      );
    }
    setProfile((p) => ({ ...p, phone: value }));
    setHasChanges(true);
  };
  const handleEmergencyPhoneInput = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length >= 10) {
      value = value.replace(
        /(\d{1})(\d{3})(\d{3})(\d{4})/,
        "+$1 ($2) $3-$4"
      );
    }
    setProfile((p) => ({ ...p, emergencyPhone: value }));
    setHasChanges(true);
  };

  // Photo upload
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setNotification({
        type: "error",
        message: "File size too large. Please choose a file under 5MB.",
      });
      return;
    }
    const reader = new window.FileReader();
    reader.onload = (ev) => {
      setPhotoUrl(ev.target.result);
      localStorage.setItem("profilePhoto", ev.target.result);
      setNotification({ type: "success", message: "Profile photo updated!" });
    };
    reader.readAsDataURL(file);
  };

  // Profile pic modal
  const [showPicModal, setShowPicModal] = useState(false);

  // Tooltips
  const tooltips = {
    firstName: "Enter your first name as it appears on official documents",
    lastName: "Enter your last name as it appears on official documents",
    email: "This email will be used for all official communications",
    phone: "Enter your primary contact number",
    dateOfBirth: "This information is used for age verification and benefits",
    emergencyName: "Person to contact in case of emergency",
    emergencyPhone: "Emergency contact phone number",
  };

  // Notification display
  useEffect(() => {
    if (notification) {
      const timeout = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timeout);
    }
  }, [notification]);

  // Render notification
  const Notification = () =>
    notification ? (
      <div
        className={`notification show ${notification.type}`}
        onClick={() => setNotification(null)}
        style={{ cursor: "pointer" }}
      >
        {notification.message}
      </div>
    ) : null;

  // Password strength bar
  const PasswordStrengthBar = () => (
    <div className="password-strength">
      <div
        className={`password-strength-bar ${
          passwordStrength ? passwordStrength : ""
        }`}
        style={{
          width:
            passwordStrength === "weak"
              ? "33%"
              : passwordStrength === "medium"
              ? "66%"
              : passwordStrength === "strong"
              ? "100%"
              : "0%",
        }}
      />
    </div>
  );

  // Highlight changed fields from draft
  useEffect(() => {
    // This would be more elaborate if you want to highlight changed fields.
    // Here we do nothing, but you could add logic here.
  }, []);

  // Render
  return (
    <div>
      <style>{`
        ${/* CSS from your HTML file, unchanged (see original for details) */""}
        /* ... (copy the CSS from your HTML here) ... */
      `}</style>
      <header className="header">
        <div className="logo">
          <h1>Bandy & Moot</h1>
        </div>
        <nav className="nav">
          <a href="salary_portal_dashboard.html" className="nav-link">
            Dashboard
          </a>
          <a href="salary_portal_payslip.html" className="nav-link">
            Payslip
          </a>
          <a href="salary_portal_profile.html" className="nav-link active">
            Profile
          </a>
        </nav>
        <div className="user-info">
          <span id="userName">{`Welcome, ${user.name}`}</span>
          <button className="logout-btn" id="logoutBtn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>
      <main className="main-content">
        <div className="profile-container">
          <div className="profile-sidebar">
            <div className="profile-avatar">
              <img
                src={photoUrl}
                alt="Profile"
                id="profilePic"
                style={{ cursor: "pointer" }}
                onClick={() => setShowPicModal(true)}
              />
              <input
                type="file"
                ref={photoInputRef}
                accept="image/*"
                style={{ display: "none" }}
                onChange={handlePhotoChange}
              />
              <button
                className="change-photo-btn"
                id="changePhotoBtn"
                onClick={() => photoInputRef.current.click()}
              >
                Change Photo
              </button>
            </div>
            <div className="profile-summary">
              <h3 id="profileName">{user.name}</h3>
              <p id="profilePosition">{user.position}</p>
              <p id="profileEmpId">Employee ID: {user.empId}</p>
            </div>
          </div>
          <div className="profile-content">
            <div className="card">
              <h3>Personal Information</h3>
              <form id="personalInfoForm">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={profile.firstName}
                      onChange={handleInput}
                      required
                      title={tooltips.firstName}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={profile.lastName}
                      onChange={handleInput}
                      required
                      title={tooltips.lastName}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={profile.email}
                      onChange={handleInput}
                      required
                      title={tooltips.email}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={profile.phone}
                      onChange={handlePhoneInput}
                      required
                      title={tooltips.phone}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="dateOfBirth">Date of Birth</label>
                    <input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={profile.dateOfBirth}
                      onChange={handleInput}
                      title={tooltips.dateOfBirth}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="gender">Gender</label>
                    <select
                      id="gender"
                      name="gender"
                      value={profile.gender}
                      onChange={handleInput}
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <textarea
                    id="address"
                    name="address"
                    rows={3}
                    value={profile.address}
                    onChange={handleInput}
                  />
                </div>
              </form>
            </div>
            <div className="card">
              <h3>Employment Details</h3>
              <div className="employment-info">
                {employmentInfo.map((item) => (
                  <div className="info-row" key={item.label}>
                    <span className="info-label">{item.label}:</span>
                    <span className="info-value">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <h3>Emergency Contact</h3>
              <form id="emergencyContactForm">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="emergencyName">Contact Name</label>
                    <input
                      type="text"
                      id="emergencyName"
                      name="emergencyName"
                      value={profile.emergencyName}
                      onChange={handleEmergencyInput}
                      required
                      title={tooltips.emergencyName}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="emergencyRelation">Relationship</label>
                    <input
                      type="text"
                      id="emergencyRelation"
                      name="emergencyRelation"
                      value={profile.emergencyRelation}
                      onChange={handleEmergencyInput}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="emergencyPhone">Phone Number</label>
                    <input
                      type="tel"
                      id="emergencyPhone"
                      name="emergencyPhone"
                      value={profile.emergencyPhone}
                      onChange={handleEmergencyPhoneInput}
                      required
                      title={tooltips.emergencyPhone}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="emergencyEmail">Email</label>
                    <input
                      type="email"
                      id="emergencyEmail"
                      name="emergencyEmail"
                      value={profile.emergencyEmail}
                      onChange={handleEmergencyInput}
                    />
                  </div>
                </div>
              </form>
            </div>
            <div className="card">
              <h3>Change Password</h3>
              <form id="passwordChangeForm" onSubmit={handleChangePassword}>
                <div className="form-group">
                  <label htmlFor="currentPassword">Current Password</label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="current"
                    value={password.current}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="new"
                    value={password.new}
                    onChange={handlePasswordChange}
                    required
                  />
                  <PasswordStrengthBar />
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirm"
                    value={password.confirm}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="change-password-btn"
                  disabled={loading}
                  style={loading ? { opacity: 0.6, pointerEvents: "none" } : {}}
                >
                  Change Password
                </button>
              </form>
            </div>
            <div className="profile-actions">
              <button
                type="button"
                className="save-btn"
                id="saveBtn"
                onClick={handleSave}
                disabled={loading}
                style={
                  loading
                    ? { opacity: 0.6, pointerEvents: "none", position: "relative" }
                    : {}
                }
              >
                {loading ? "Saving..." : hasChanges ? "Save Changes*" : "Save Changes"}
              </button>
              <button
                type="button"
                className="cancel-btn"
                id="cancelBtn"
                onClick={handleReset}
                disabled={loading}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </main>
      <Notification />
      {showPicModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.8)",
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
          onClick={() => setShowPicModal(false)}
        >
          <img
            src={photoUrl}
            alt="Profile Large"
            style={{
              maxWidth: "90vw",
              maxHeight: "90vh",
              borderRadius: "10px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ProfilePage;