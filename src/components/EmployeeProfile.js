import React, { useState, useEffect } from 'react';
import { Camera, Save, Upload, FileText, Image } from 'lucide-react';

const EmployeeProfile = () => {
  // Initial form data structure
  const initialFormData = {
    // Emergency Contact
    emergencyContactName: '',
    emergencyContactRelationship: '',
    emergencyContactPhone: '',
    emergencyContactEmail: '',

    // Banking Details
    bankName: '',
    accountNumber: '',
    panNumber: '',
    ifscCode: '',
    branchName: '',
    aadharNumber: '',

    // Personal Details
    maritalStatus: '',
    bloodGroup: '',
    nationality: '',
    permanentAddress: '',
    currentAddress: '',

    // Education Information
    tenthSchoolName: '',
    tenthBoard: '',
    tenthYear: '',
    tenthGrade: '',
    tenthPercentage: '',
    twelfthCollegeName: '',
    twelfthBoard: '',
    twelfthYear: '',
    twelfthGrade: '',
    twelfthPercentage: '',
    diplomaCollegeName: '',
    diplomaCourse: '',
    diplomaDuration: '',
    diplomaYear: '',
    diplomaPercentage: '',
    gradCollegeName: '',
    gradCourse: '',
    gradSpecialization: '',
    gradDuration: '',
    gradYear: '',
    gradPercentage: '',
    backlogs: '',

    // Previous Employment
    prevCompanyName: '',
    prevStartDate: '',
    prevEndDate: '',
    prevPosition: '',
    prevExperience: '',
    prevReasonLeaving: '',
    prevManagerName: '',
    prevAnnualSalary: '',

    // Skills & Projects
    keySkills: '',
    projects: '',
    achievements: '',

    // Professional Reference
    referenceName: '',
    referenceRelationship: '',
    referencePhone: '',
    referenceEmail: '',
    referenceCompany: '',
    referencePosition: '',

    //Documents
    Signature: '',
    Resume: '',
  };

  // State for all form data
  const [formData, setFormData] = useState(initialFormData);

  // State for files - store actual File objects AND existing file info
  const [uploadedFiles, setUploadedFiles] = useState({
    signature: null,
    resume: null,
    additionalDocs: [],
    existingSignature: '',
    existingResume: ''
  });

  // Employee data state
  const [employeeData, setEmployeeData] = useState({
    name: '',
    id: '',
    department: '',
    position: '',
    email: '',
    phone: '',
    joinDate: '',
    manager: '',
    avatar: ''
  });

  // State for avatar upload
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [saveStatus, setSaveStatus] = useState('');

  // Required fields configuration
  const requiredFields = {
    // Emergency Contact
    emergencyContactName: true,
    emergencyContactRelationship: true,
    emergencyContactPhone: true,
    
    // Banking Details
    bankName: true,
    accountNumber: true,
    panNumber: true,
    ifscCode: true,
    branchName: true,
    aadharNumber: true,
    
    // Personal Details
    maritalStatus: true,
    bloodGroup: true,
    nationality: true,
    permanentAddress: true,
    currentAddress: true,
    
    // Education - 10th
    tenthSchoolName: true,
    tenthBoard: true,
    tenthYear: true,
    
    // Education - Graduation
    gradCollegeName: true,
    gradCourse: true,
    gradSpecialization: true,
    gradDuration: true,
    gradYear: true,
    gradPercentage: true,
    backlogs: true,
    
    // Skills
    keySkills: true,
  };

  // Calculate profile completion percentage - FIXED VERSION
  const calculateProfileCompletion = () => {
    let completedFields = 0;
    let totalRequiredFields = 0;

    Object.keys(requiredFields).forEach(field => {
      if (requiredFields[field]) {
        totalRequiredFields++;
        if (formData[field] && formData[field].toString().trim() !== '') {
          completedFields++;
        }
      }
    });

    // Check for uploaded files OR existing files - FIXED
    const hasSignature = uploadedFiles.signature || uploadedFiles.existingSignature;
    const hasResume = uploadedFiles.resume || uploadedFiles.existingResume;

    if (hasSignature) completedFields++;
    if (hasResume) completedFields++;
    totalRequiredFields += 2;

    const percentage = Math.round((completedFields / totalRequiredFields) * 100);
    setProfileCompletion(percentage);
    return percentage;
  };


  // Email validation function
  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // Validate required fields - FIXED VERSION
  const validateRequiredFields = () => {
    const missingFields = [];
    
    Object.keys(requiredFields).forEach(field => {
      if (requiredFields[field] && (!formData[field] || formData[field].toString().trim() === '')) {
        // Convert field name to readable format
        const readableName = field.replace(/([A-Z])/g, ' $1')
          .replace(/^./, str => str.toUpperCase())
          .replace('Emergency Contact', '')
          .replace('Tenth', '10th')
          .replace('Twelfth', '12th')
          .replace('Grad', 'Graduation')
          .replace('Prev', 'Previous')
          .trim();
        missingFields.push(readableName);
      }
    });

  // Check file uploads OR existing files - FIXED
    const hasSignature = uploadedFiles.signature || uploadedFiles.existingSignature;
    const hasResume = uploadedFiles.resume || uploadedFiles.existingResume;

    if (!hasSignature) {
      missingFields.push('Digital Signature');
    }
    if (!hasResume) {
      missingFields.push('Resume');
    }

    return missingFields;
  };

  // Map API response to form data - ENHANCED VERSION
  const mapApiResponseToFormData = (apiData) => {
    if (!apiData) return {};
    
    const additionalDetails = apiData.additionalDetails || {};
    const emergencyContact = additionalDetails.Emergency_Contact || {};
    const bankDetails = additionalDetails.bankDetails || {};
    const secondaryEducation = additionalDetails.secondaryEducation || {};
    const tenth = secondaryEducation.tenth || {};
    const twelfth = secondaryEducation.twelfth || {};
    const graduation = additionalDetails.graduation || {};
    const deplomaGraduation = additionalDetails.Deplomagraduation || {};
    const previousCompany = additionalDetails.previousCompany || {};
    const skills = additionalDetails.skills || {};
    const professionalReference = additionalDetails.professionalReference || {};
    const documents = additionalDetails.Documents || {};

    // Store existing document URLs
    if (documents.Signature) {
      setUploadedFiles(prev => ({
        ...prev,
        existingSignature: documents.Signature
      }));
    }
    if (documents.Resume) {
      setUploadedFiles(prev => ({
        ...prev,
        existingResume: documents.Resume
      }));
    }

    return {
      // Emergency Contact
      emergencyContactName: emergencyContact.name || '',
      emergencyContactRelationship: emergencyContact.relationship || '',
      emergencyContactPhone: emergencyContact.phoneNumber?.toString() || '',
      emergencyContactEmail: emergencyContact.email || '',

      // Banking Details
      bankName: bankDetails.bankName || '',
      accountNumber: bankDetails.accountNumber || '',
      panNumber: bankDetails.panNumber || '',
      ifscCode: bankDetails.ifscCode || '',
      branchName: bankDetails.branchName || '',
      aadharNumber: bankDetails.adhaarNumber || '',

      // Personal Details
      maritalStatus: additionalDetails.maritalStatus || '',
      bloodGroup: additionalDetails.bloodGroup || '',
      nationality: additionalDetails.nationality || '',
      permanentAddress: additionalDetails.permanentAddress || '',
      currentAddress: additionalDetails.currentAddress || '',

      // Education Information - 10th
      tenthSchoolName: tenth.schoolName || '',
      tenthBoard: tenth.board || '',
      tenthYear: tenth.yearOfPassing?.toString() || '',
      tenthGrade: tenth.grade || '',
      tenthPercentage: tenth.percentage?.toString() || '',

      // Education Information - 12th
      twelfthCollegeName: twelfth.schoolName || '',
      twelfthBoard: twelfth.board || '',
      twelfthYear: twelfth.yearOfPassing?.toString() || '',
      twelfthGrade: twelfth.grade || '',
      twelfthPercentage: twelfth.percentage?.toString() || '',

      // Education Information - Diploma
      diplomaCollegeName: deplomaGraduation.collegeName || '',
      diplomaCourse: deplomaGraduation.CourseName || '',
      diplomaDuration: deplomaGraduation.graduationDuration?.toString() || '',
      diplomaYear: deplomaGraduation.PassingYear?.toString() || '',
      diplomaPercentage: deplomaGraduation.percentage?.toString() || '',

      // Education Information - Graduation
      gradCollegeName: graduation.collegeName || '',
      gradCourse: graduation.CourseName || '',
      gradSpecialization: graduation.branch || '',
      gradDuration: graduation.graduationDuration?.toString() || '',
      gradYear: graduation.PassingYear?.toString() || '',
      gradPercentage: graduation.percentage?.toString() || '',
      backlogs: graduation.Backlogs || '',

      // Previous Employment
      prevCompanyName: previousCompany.companyName || '',
      prevStartDate: previousCompany.startingDate || '',
      prevEndDate: previousCompany.endingDate || '',
      prevPosition: previousCompany.position || '',
      prevExperience: previousCompany.WorkExprience || '',
      prevReasonLeaving: previousCompany.reasonOfLeaving || '',
      prevManagerName: previousCompany.teamLead || '',
      prevAnnualSalary: previousCompany.annualSalary?.toString() || '',

      // Skills & Projects
      keySkills: skills.keySkills || '',
      projects: skills.majorProject || '',
      achievements: skills.keyAchivements || '',

      // Professional Reference
      referenceName: professionalReference.referenceName || '',
      referenceRelationship: professionalReference.relationship || '',
      referencePhone: professionalReference.phoneNumber?.toString() || '',
      referenceEmail: professionalReference.email || '',
      referenceCompany: professionalReference.Company || '',
      referencePosition: professionalReference.position || '',

      //Documents - these are now handled separately in uploadedFiles state
      Signature: '',
      Resume: '',
    };
  };

  // Fetch user details and profile data
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://bandymoot.com/api/v1/Dashboard/userDetails', {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        const result = await response.json();
        const data = result.data;
        
        if (data) {
          const fullName = `${data.firstName || ''} ${data.lastName || ''}`.trim();
          const emailId = data.email || '';
          const employeeIds = data.employeeId || '';

          // Set employee data
          setEmployeeData({
            name: emailId === "coe211166.cse.coe@cgc.edu.in" ? "Om Prakash Dubey" : fullName,
            email: emailId,
            id: employeeIds,
            department: data.additionalDetails?.department || "",
            position: data.additionalDetails?.position || "",
            phone: data.phoneNumber || "",
            joinDate: data.additionalDetails?.dateOfJoining || "",
            manager: data.additionalDetails?.managerOfemployee || "",
            avatar: data.image || "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
          });

          // Map API data to form data
          const mappedFormData = mapApiResponseToFormData(data);
          setFormData(mappedFormData);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  // Update profile completion when form data changes
  useEffect(() => {
    calculateProfileCompletion();
  }, [formData, uploadedFiles]);

  // Handle input changes
  const handleInputChange = (field, value) => {
    // For phone number, only allow numbers and limit to 10 digits
    if (field === 'emergencyContactPhone' || field === 'referencePhone') {
      value = value.replace(/\D/g, '').slice(0, 10);
    }

    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

 // Handle file uploads - store actual File objects
  const handleFileUpload = (type, files) => {
    const file = files[0];
    if (!file) return;

    setUploadedFiles(prev => {
      const updated = { ...prev };
      if (type === 'additionalDocs') {
        updated[type] = [...(prev[type] || []), file];
      } else {
        updated[type] = file;
        // Clear existing file URL when new file is uploaded
        if (type === 'signature') {
          updated.existingSignature = '';
        } else if (type === 'resume') {
          updated.existingResume = '';
        }
      }
      return updated;
    });
  };

  // Remove uploaded file - ENHANCED VERSION
  const handleRemoveFile = (type, index = null) => {
    setUploadedFiles(prev => {
      const updated = { ...prev };
      if (type === 'additionalDocs' && index !== null) {
        updated[type] = prev[type].filter((_, i) => i !== index);
      } else {
        updated[type] = null;
        // Also clear existing file URL if removing
        if (type === 'signature') {
          updated.existingSignature = '';
        } else if (type === 'resume') {
          updated.existingResume = '';
        }
      }
      return updated;
    });
  };

  // Handle Avatar Changes
  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsUploadingAvatar(true);

      try {
        const reader = new FileReader();
        reader.onload = (e) => {
          setProfileImage(e.target.result);
          setIsUploadingAvatar(false);
        };
        reader.readAsDataURL(file);

      } catch (error) {
        console.error('Avatar upload error:', error);
        alert('Failed to update profile photo. Please try again.');
        setIsUploadingAvatar(false);
      }
    }
  };

  // Format data for API
  const formatDataForAPI = () => {
    return {
      department: employeeData.department,
      position: employeeData.position,
      costCenter: "",
      designation: employeeData.position,
      dateOfBirth: "",
      dateOfJoining: employeeData.joinDate,
      managerOfemployee: employeeData.manager,
      residentialStatus: "",
      pfNumber: "",
      esiNumber: "",
      epsNumber: "",
      Emergency_Contact: {
        name: formData.emergencyContactName || "",
        relationship: formData.emergencyContactRelationship || "",
        phoneNumber: parseInt(formData.emergencyContactPhone) || 0,
        email: formData.emergencyContactEmail || ""
      },
      permanentAddress: formData.permanentAddress || "",
      currentAddress: formData.currentAddress || "",
      bankDetails: {
        accountNumber: formData.accountNumber || "",
        bankName: formData.bankName || "",
        ifscCode: formData.ifscCode || "",
        branchName: formData.branchName || "",
        adhaarNumber: formData.aadharNumber || "",
        panNumber: formData.panNumber || ""
      },
      bloodGroup: formData.bloodGroup || "",
      maritalStatus: formData.maritalStatus || "",
      nationality: formData.nationality || "",
      secondaryEducation: {
        tenth: {
          schoolName: formData.tenthSchoolName || "",
          board: formData.tenthBoard || "",
          yearOfPassing: parseInt(formData.tenthYear) || 0,
          percentage: parseFloat(formData.tenthPercentage) || 0,
          grade: formData.tenthGrade || ""
        },
        twelfth: {
          schoolName: formData.twelfthCollegeName || "",
          board: formData.twelfthBoard || "",
          yearOfPassing: parseInt(formData.twelfthYear) || 0,
          percentage: parseFloat(formData.twelfthPercentage) || 0,
          grade: formData.twelfthGrade || ""
        }
      },
      graduation: {
        collegeName: formData.gradCollegeName || "",
        CourseName: formData.gradCourse || "",
        branch: formData.gradSpecialization || "",
        percentage: parseFloat(formData.gradPercentage) || 0,
        Backlogs: formData.backlogs || "",
        PassingYear: parseInt(formData.gradYear) || 0,
        graduationDuration: parseInt(formData.gradDuration) || 0
      },
      Deplomagraduation: {
        collegeName: formData.diplomaCollegeName || "",
        CourseName: formData.diplomaCourse || "",
        percentage: parseFloat(formData.diplomaPercentage) || 0,
        PassingYear: parseInt(formData.diplomaYear) || 0,
        graduationDuration: parseInt(formData.diplomaDuration) || 0
      },
      previousCompany: {
        companyName: formData.prevCompanyName || "",
        position: formData.prevPosition || "",
        teamLead: formData.prevManagerName || "",
        annualSalary: parseFloat(formData.prevAnnualSalary) || 0,
        startingDate: formData.prevStartDate || "",
        endingDate: formData.prevEndDate || "",
        reasonOfLeaving: formData.prevReasonLeaving || "",
        WorkExprience: formData.prevExperience || ""
      },
      skills: {
        keySkills: formData.keySkills || "",
        keyAchivements: formData.achievements || "",
        majorProject: formData.projects || ""
      },
      professionalReference: {
        referenceName: formData.referenceName || "",
        relationship: formData.referenceRelationship || "",
        phoneNumber: parseInt(formData.referencePhone) || 0,
        email: formData.referenceEmail || "",
        Company: formData.referenceCompany || "",
        position: formData.referencePosition || ""
      }
    };
  };

  // Upload documents function - SIMPLIFIED VERSION
  const uploadDocuments = async () => {
    try {
      // If no files to upload, return success
      if (!uploadedFiles.signature && !uploadedFiles.resume && 
          (!uploadedFiles.additionalDocs || uploadedFiles.additionalDocs.length === 0)) {
        console.log("No documents to upload");
        return { success: true };
      }

      const formDataToSend = new FormData();
      
      // Append signature file if exists
      if (uploadedFiles.signature) {
        formDataToSend.append('Signature', uploadedFiles.signature);
        console.log("Appending signature:", uploadedFiles.signature.name);
      }
      
      // Append resume file if exists
      if (uploadedFiles.resume) {
        formDataToSend.append('Resume', uploadedFiles.resume);
        console.log("Appending resume:", uploadedFiles.resume.name);
      }
      
      // Append additional documents if exist
      if (uploadedFiles.additionalDocs && uploadedFiles.additionalDocs.length > 0) {
        uploadedFiles.additionalDocs.forEach((doc, index) => {
          formDataToSend.append(`additionalDoc${index}`, doc);
          console.log(`Appending additional doc ${index}:`, doc.name);
        });
      }

      console.log("Uploading documents to API...");
      const response = await fetch('https://bandymoot.com/api/v1/employees/uploadDocuments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
          // Note: Don't set Content-Type for FormData, let browser set it with boundary
        },
        body: formDataToSend
      });

      const result = await response.json();
      console.log("Document upload API response:", result);

      if (response.ok) {
        console.log('Documents uploaded successfully');
        return { success: true, data: result };
      } else {
        console.error('Failed to upload documents:', result);
        return { 
          success: false, 
          error: result.message || 'Failed to upload documents' 
        };
      }
    } catch (error) {
      console.error('Error uploading documents:', error);
      return { 
        success: false, 
        error: error.message || 'Network error while uploading documents' 
      };
    }
  };

  // Update employee data via API
  const updateEmployeeData = async () => {
    try {
      const apiData = formatDataForAPI();
      console.log("Sending API Data:", apiData);

      const response = await fetch('https://bandymoot.com/api/v1/employees/updateemployee', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(apiData)
      });

      const result = await response.json();
      console.log('Update API Response:', result);
      await uploadDocuments()

      if (response.ok) {
        console.log('Employee data updated successfully');
        return { success: true, data: result };
      } else {
        console.error('Failed to update employee data:', result);
        return { 
          success: false, 
          error: result.message || 'Failed to update profile data' 
        };
      }
    } catch (error) {
      console.error('Error updating employee data:', error);
      return { 
        success: false, 
        error: error.message || 'Network error while updating profile' 
      };
    }
  };

  // Save all data to API
  const handleSaveChanges = async () => {
    // Validate required fields
    const missingFields = validateRequiredFields();

    if (missingFields.length > 0) {
      alert(`Please fill in all required fields:\n\n• ${missingFields.join('\n• ')}\n\nProfile Completion: ${profileCompletion}%`);
      return;
    }

    try {
      setSaveStatus('saving');
      
      console.log("Starting save process...");
      
      // Step 1: Update employee data via API
      console.log("Step 1: Updating employee data...");
      const updateResult = await updateEmployeeData();
      
      if (!updateResult.success) {
        setSaveStatus('error');
        alert(`Failed to update profile data: ${updateResult.error}`);
        return;
      }

      // Step 2: Upload documents via API
      console.log("Step 2: Uploading documents...");
      const uploadResult = await uploadDocuments();

      if (!uploadResult.success) {
        setSaveStatus('error');
        alert(`Profile data saved but documents failed to upload: ${uploadResult.error}\n\nYou can try uploading documents separately later.`);
        return;
      }

      // Success
      setSaveStatus('success');
      alert(`✅ Profile saved successfully!\n\nProfile Completion: ${profileCompletion}%\n\nAll data has been saved to the server.`);
      
      // Refresh data from API after short delay
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.error('Error in save process:', error);
      setSaveStatus('error');
      alert(`An unexpected error occurred: ${error.message}\n\nPlease try again or contact support if the problem persists.`);
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get file name from URL
  const getFileNameFromUrl = (url) => {
    if (!url) return '';
    return url.split('/').pop() || 'Uploaded File';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading employee profile...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Completion Status */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Profile Completion</h2>
          <span className={`text-lg font-semibold ${
            profileCompletion === 100 ? 'text-green-600' : 'text-orange-600'
          }`}>
            {profileCompletion}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div 
            className={`h-4 rounded-full ${
              profileCompletion === 100 ? 'bg-green-600' : 'bg-blue-600'
            }`}
            style={{ width: `${profileCompletion}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {profileCompletion === 100 
            ? '✅ Your profile is complete! All required fields are filled.'
            : `📝 Fill all required fields (marked with *) to complete your profile.`
          }
        </p>
      </div>

      {/* Main Profile Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <section className="bg-blue-600 text-white p-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <h2 className="text-xl font-bold">My Profile</h2>
        </section>

        {/* Profile Header with Avatar */}
        <div className="flex items-center space-x-6 mb-8 mt-6">
          <div className="relative">
            <div className={`w-24 h-24 rounded-full object-cover border-4 border-blue-100 ${isUploadingAvatar ? 'opacity-50' : ''} overflow-hidden`}>
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <img src={employeeData.avatar} alt="Profile" className="w-full h-full object-cover" />
              )}
            </div>
            {isUploadingAvatar && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                <div className="text-white text-xs">Uploading...</div>
              </div>
            )}
            <div className="absolute bottom-0 right-0">
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id="avatar-upload"
                disabled={isUploadingAvatar}
              />
              <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                <Camera size={16} />
              </label>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-gray-800">{employeeData.name}</h3>
            <p className="text-gray-600">{employeeData.position}</p>
            <p className="text-sm text-gray-500">Employee ID: {employeeData.id}</p>
          </div>
        </div>

        {/* Employee Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
            <p className="text-gray-900 bg-gray-50 p-2 rounded border">{employeeData.id}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <p className="text-gray-900 bg-gray-50 p-2 rounded border">{employeeData.email}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <p className="text-gray-900 bg-gray-50 p-2 rounded border">{employeeData.phone}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <p className="text-gray-900 bg-gray-50 p-2 rounded border">{employeeData.department}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Manager</label>
            <p className="text-gray-900 bg-gray-50 p-2 rounded border">{employeeData.manager}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
            <p className="text-gray-900 bg-gray-50 p-2 rounded border">{employeeData.joinDate}</p>
          </div>
        </div>
      </div>

      {/* Emergency Contact Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <section className="bg-blue-600 text-white p-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mb-6">
          <h2 className="text-xl font-bold">Emergency Contact</h2>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name <span className="text-red-600">*</span></label>
            <input
              type="text"
              placeholder="Enter emergency contact name"
              value={formData.emergencyContactName || ''}
              onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Relationship <span className="text-red-600">*</span></label>
            <select
              value={formData.emergencyContactRelationship || ''}
              onChange={(e) => handleInputChange('emergencyContactRelationship', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select Relationship</option>
              <option value="spouse">Spouse</option>
              <option value="parent">Parent</option>
              <option value="sibling">Sibling</option>
              <option value="child">Child</option>
              <option value="friend">Friend</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number <span className="text-red-600">*</span></label>
            <input
              type="tel"
              placeholder="Enter 10-digit phone number"
              value={formData.emergencyContactPhone || ''}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                handleInputChange('emergencyContactPhone', value);
              }}
              pattern="[0-9]{10}"
              title="Please enter exactly 10 digits"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            {formData.emergencyContactPhone && formData.emergencyContactPhone.length !== 10 && (
              <p className="text-red-500 text-xs mt-1">Phone number must be exactly 10 digits</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              placeholder="Enter email address"
              value={formData.emergencyContactEmail || ''}
              onChange={(e) => handleInputChange('emergencyContactEmail', e.target.value)}
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              title="Please enter a valid email address (e.g., name@example.com)"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {formData.emergencyContactEmail && !isValidEmail(formData.emergencyContactEmail) && (
              <p className="text-red-500 text-xs mt-1">Please enter a valid email address</p>
            )}
          </div>
        </div>
      </div>

      {/* Banking Details Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <section className="bg-blue-600 text-white p-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mb-6">
          <h2 className="text-xl font-bold">Banking Details</h2>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name <span className="text-red-600">*</span></label>
            <input
              type="text"
              placeholder="Enter bank name"
              value={formData.bankName || ''}
              onChange={(e) => handleInputChange('bankName', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Number <span className="text-red-600">*</span></label>
            <input
              type="text"
              placeholder="Enter account number"
              value={formData.accountNumber || ''}
              onChange={(e) => handleInputChange('accountNumber', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number <span className="text-red-600">*</span></label>
            <input
              type="text"
              placeholder="Enter PAN number"
              value={formData.panNumber || ''}
              onChange={(e) => handleInputChange('panNumber', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code <span className="text-red-600">*</span></label>
            <input
              type="text"
              placeholder="Enter IFSC code"
              value={formData.ifscCode || ''}
              onChange={(e) => handleInputChange('ifscCode', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Branch Name <span className="text-red-600">*</span></label>
            <input
              type="text"
              placeholder="Enter branch name"
              value={formData.branchName || ''}
              onChange={(e) => handleInputChange('branchName', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Aadhar Number <span className="text-red-600">*</span></label>
            <input
              type="text"
              placeholder="Enter Aadhar number"
              value={formData.aadharNumber || ''}
              onChange={(e) => handleInputChange('aadharNumber', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Employee Information Form Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <section className="bg-blue-600 text-white p-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mb-6">
          <h2 className="text-xl font-bold">Employee Information Form</h2>
        </section>
        <p className="text-sm text-gray-600 mb-4">All fields in this section are optional</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employee Code</label>
            <input
              type="text"
              placeholder="Enter employee code"
              value={formData.employeeCode || ''}
              onChange={(e) => handleInputChange('employeeCode', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employee Name</label>
            <input
              type="text"
              placeholder="Enter full name"
              value={formData.employeeName || ''}
              onChange={(e) => handleInputChange('employeeName', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <input
              type="text"
              placeholder="Enter department"
              value={formData.empDepartment || ''}
              onChange={(e) => handleInputChange('empDepartment', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cost Centre</label>
            <input
              type="text"
              placeholder="Enter cost centre"
              value={formData.costCentre || ''}
              onChange={(e) => handleInputChange('costCentre', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              placeholder="Enter location"
              value={formData.empLocation || ''}
              onChange={(e) => handleInputChange('empLocation', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
            <input
              type="text"
              placeholder="Enter designation"
              value={formData.empDesignation || ''}
              onChange={(e) => handleInputChange('empDesignation', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <input
              type="date"
              value={formData.dateOfBirth || ''}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Joining</label>
            <input
              type="date"
              value={formData.dateOfJoining || ''}
              onChange={(e) => handleInputChange('dateOfJoining', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Residential Status</label>
            <select
              value={formData.residentialStatus || ''}
              onChange={(e) => handleInputChange('residentialStatus', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select status</option>
              <option value="resident">Resident</option>
              <option value="non_resident">Non-Resident</option>
              <option value="ordinarily_resident">Ordinarily Resident</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">PF Number</label>
            <input
              type="text"
              placeholder="Enter PF number"
              value={formData.pfNumber || ''}
              onChange={(e) => handleInputChange('pfNumber', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ESI Number</label>
            <input
              type="text"
              placeholder="Enter ESI number"
              value={formData.esiNumber || ''}
              onChange={(e) => handleInputChange('esiNumber', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">EPS Number</label>
            <input
              type="text"
              placeholder="Enter EPS number"
              value={formData.epsNumber || ''}
              onChange={(e) => handleInputChange('epsNumber', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Personal Details Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <section className="bg-blue-600 text-white p-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mb-6">
          <h2 className="text-xl font-bold">Personal Details</h2>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status <span className="text-red-600">*</span></label>
            <select
              value={formData.maritalStatus || ''}
              onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Marital Status</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="divorced">Divorced</option>
              <option value="widowed">Widowed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group <span className="text-red-600">*</span></label>
            <select
              value={formData.bloodGroup || ''}
              onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nationality <span className="text-red-600">*</span></label>
            <select
              value={formData.nationality || ''}
              onChange={(e) => handleInputChange('nationality', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Nationality</option>
              <option value="indian">Indian</option>
              <option value="american">American</option>
              <option value="canadian">Canadian</option>
              <option value="british">British</option>
              <option value="australian">Australian</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Permanent Address <span className="text-red-600">*</span></label>
            <textarea
              placeholder="Enter permanent address"
              rows="3"
              value={formData.permanentAddress || ''}
              onChange={(e) => handleInputChange('permanentAddress', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Address <span className="text-red-600">*</span></label>
            <textarea
              placeholder="Enter current address"
              rows="3"
              value={formData.currentAddress || ''}
              onChange={(e) => handleInputChange('currentAddress', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Education Information Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <section className="bg-blue-600 text-white p-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mb-6">
          <h2 className="text-xl font-bold">Education Information</h2>
        </section>

        <h2 className="text-md font-semibold text-gray-800 mb-4">10th Class Information</h2>
        <p className="text-sm text-red-600 mb-4">School name, board, and year are mandatory. Either grade OR percentage is required.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">10th School Name <span className='text-red-600'>*</span></label>
            <input
              type="text"
              placeholder="Enter your 10th school name"
              value={formData.tenthSchoolName || ''}
              onChange={(e) => handleInputChange('tenthSchoolName', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">10th Board <span className='text-red-600'>*</span></label>
            <select
              value={formData.tenthBoard || ''}
              onChange={(e) => handleInputChange('tenthBoard', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Board</option>
              <option value="cbse">CBSE</option>
              <option value="icse">ICSE</option>
              <option value="state_board">State Board</option>
              <option value="up_board">UP Board</option>
              <option value="mp_board">MP Board</option>
              <option value="bihar_board">Bihar Board</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">10th Year of Passing <span className='text-red-600'>*</span></label>
            <input
              type="number"
              placeholder="Enter year"
              min="1980"
              max="2024"
              value={formData.tenthYear || ''}
              onChange={(e) => handleInputChange('tenthYear', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">10th Grade</label>
            <select
              value={formData.tenthGrade || ''}
              onChange={(e) => handleInputChange('tenthGrade', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Grade</option>
              <option value="A+">A+</option>
              <option value="A">A</option>
              <option value="B+">B+</option>
              <option value="B">B</option>
              <option value="C+">C+</option>
              <option value="C">C</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">10th Percentage</label>
            <input
              type="number"
              placeholder="Enter percentage"
              min="0"
              max="100"
              step="0.01"
              value={formData.tenthPercentage || ''}
              onChange={(e) => handleInputChange('tenthPercentage', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* 12th Class Information */}
        <h2 className="text-md font-semibold text-gray-800 mb-4">12th Class Information</h2>
        <p className="text-sm text-gray-600 mb-4">All fields in this section are optional</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">12th College/School Name</label>
            <input
              type="text"
              placeholder="Enter college/school name"
              value={formData.twelfthCollegeName || ''}
              onChange={(e) => handleInputChange('twelfthCollegeName', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">12th Board</label>
            <select
              value={formData.twelfthBoard || ''}
              onChange={(e) => handleInputChange('twelfthBoard', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Board</option>
              <option value="cbse">CBSE</option>
              <option value="icse">ICSE</option>
              <option value="state_board">State Board</option>
              <option value="up_board">UP Board</option>
              <option value="mp_board">MP Board</option>
              <option value="bihar_board">Bihar Board</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">12th Year of Passing</label>
            <input
              type="number"
              placeholder="Enter year"
              min="1980"
              max="2024"
              value={formData.twelfthYear || ''}
              onChange={(e) => handleInputChange('twelfthYear', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">12th Grade</label>
            <select
              value={formData.twelfthGrade || ''}
              onChange={(e) => handleInputChange('twelfthGrade', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Grade</option>
              <option value="A+">A+</option>
              <option value="A">A</option>
              <option value="B+">B+</option>
              <option value="B">B</option>
              <option value="C+">C+</option>
              <option value="C">C</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">12th Percentage</label>
            <input
              type="number"
              placeholder="Enter percentage"
              min="0"
              max="100"
              step="0.01"
              value={formData.twelfthPercentage || ''}
              onChange={(e) => handleInputChange('twelfthPercentage', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Diploma Information */}
        <h2 className="text-md font-semibold text-gray-800 mb-4">Diploma Information</h2>
        <p className="text-sm text-gray-600 mb-4">All fields in this section are optional</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Diploma College/Institute Name</label>
            <input
              type="text"
              placeholder="Enter diploma college/institute name"
              value={formData.diplomaCollegeName || ''}
              onChange={(e) => handleInputChange('diplomaCollegeName', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Diploma Course/Branch</label>
            <select
              value={formData.diplomaCourse || ''}
              onChange={(e) => handleInputChange('diplomaCourse', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Diploma Course</option>
              <option value="mechanical">Mechanical Engineering</option>
              <option value="civil">Civil Engineering</option>
              <option value="electrical">Electrical Engineering</option>
              <option value="electronics">Electronics & Communication</option>
              <option value="computer_science">Computer Science Engineering</option>
              <option value="automobile">Automobile Engineering</option>
              <option value="chemical">Chemical Engineering</option>
              <option value="textile">Textile Engineering</option>
              <option value="pharmacy">Pharmacy</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Diploma Duration</label>
            <select
              value={formData.diplomaDuration || ''}
              onChange={(e) => handleInputChange('diplomaDuration', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Duration</option>
              <option value="2">2 Years</option>
              <option value="3">3 Years</option>
              <option value="4">4 Years</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Diploma Year of Passing</label>
            <input
              type="number"
              placeholder="Enter year"
              min="1980"
              max="2024"
              value={formData.diplomaYear || ''}
              onChange={(e) => handleInputChange('diplomaYear', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Diploma Percentage/CGPA</label>
            <input
              type="text"
              placeholder="e.g., 85% or 8.5 CGPA"
              value={formData.diplomaPercentage || ''}
              onChange={(e) => handleInputChange('diplomaPercentage', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Graduation Information */}
        <h2 className="text-md font-semibold text-gray-800 mb-4">Graduation Information</h2>
        <p className="text-sm text-red-600 mb-4">All fields in this section are mandatory</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Graduation College/University Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter graduation college/university name"
              value={formData.gradCollegeName || ''}
              onChange={(e) => handleInputChange('gradCollegeName', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Graduation Course/Degree <span className="text-red-600">*</span>
            </label>
            <select
              value={formData.gradCourse || ''}
              onChange={(e) => handleInputChange('gradCourse', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select Course</option>
              <option value="btech">B.Tech</option>
              <option value="be">B.E</option>
              <option value="bsc">B.Sc</option>
              <option value="bcom">B.Com</option>
              <option value="ba">B.A</option>
              <option value="bba">BBA</option>
              <option value="bca">BCA</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Specialization/Branch <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter specialization/branch"
              value={formData.gradSpecialization || ''}
              onChange={(e) => handleInputChange('gradSpecialization', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Graduation Duration <span className="text-red-600">*</span>
            </label>
            <select
              value={formData.gradDuration || ''}
              onChange={(e) => handleInputChange('gradDuration', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select Duration</option>
              <option value="3">3 Years</option>
              <option value="4">4 Years</option>
              <option value="5">5 Years</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Graduation Year of Passing <span className="text-red-600">*</span>
            </label>
            <input
              type="number"
              placeholder="Enter year"
              min="1980"
              max="2024"
              value={formData.gradYear || ''}
              onChange={(e) => handleInputChange('gradYear', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Graduation Percentage/CGPA <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., 75% or 7.5 CGPA"
              value={formData.gradPercentage || ''}
              onChange={(e) => handleInputChange('gradPercentage', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Academic Backlogs Information */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-lg font-medium text-blue-900 mb-4">Academic Backlogs Information</h4>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Do you have any backlogs during graduation? <span className="text-red-600">*</span>
            </label>
            <div className="flex items-center space-x-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="backlogs"
                  value="yes"
                  checked={formData.backlogs === 'yes'}
                  onChange={(e) => handleInputChange('backlogs', e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Yes</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="backlogs"
                  value="no"
                  checked={formData.backlogs === 'no'}
                  onChange={(e) => handleInputChange('backlogs', e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">No</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Previous Employment Information Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <section className="bg-blue-600 text-white p-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mb-6">
          <h2 className="text-xl font-bold">Previous Employment Information</h2>
        </section>

        <div className="border-b border-gray-300 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Company & Position Details</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
            <input
              type="text"
              placeholder="Enter company name"
              value={formData.prevCompanyName || ''}
              onChange={(e) => handleInputChange('prevCompanyName', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Starting Date</label>
            <input
              type="date"
              value={formData.prevStartDate || ''}
              onChange={(e) => handleInputChange('prevStartDate', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ending Date</label>
            <input
              type="date"
              value={formData.prevEndDate || ''}
              onChange={(e) => handleInputChange('prevEndDate', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Position/Job Title</label>
            <input
              type="text"
              placeholder="Enter your position"
              value={formData.prevPosition || ''}
              onChange={(e) => handleInputChange('prevPosition', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Work Experience (in months)</label>
            <input
              type="number"
              placeholder="Total experience in months"
              min="0"
              value={formData.prevExperience || ''}
              onChange={(e) => handleInputChange('prevExperience', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Leaving</label>
            <select
              value={formData.prevReasonLeaving || ''}
              onChange={(e) => handleInputChange('prevReasonLeaving', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Reason</option>
              <option value="career_growth">Career Growth</option>
              <option value="better_opportunity">Better Opportunity</option>
              <option value="salary_hike">Salary Hike</option>
              <option value="relocation">Relocation</option>
              <option value="work_life_balance">Work Life Balance</option>
              <option value="company_closure">Company Closure</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Team Lead/Manager Name</label>
            <input
              type="text"
              placeholder="Enter team lead/manager name"
              value={formData.prevManagerName || ''}
              onChange={(e) => handleInputChange('prevManagerName', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Annual Salary</label>
            <input
              type="number"
              placeholder="Enter annual salary"
              min="0"
              value={formData.prevAnnualSalary || ''}
              onChange={(e) => handleInputChange('prevAnnualSalary', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Skills & Projects Information Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <section className="bg-blue-600 text-white p-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mb-6">
          <h2 className="text-xl font-bold">Skills & Projects Information</h2>
        </section>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Key Skills <span className="text-red-600">*</span>
            </label>
            <textarea
              placeholder="e.g., JavaScript, Python, React, Leadership, Communication, Problem Solving..."
              value={formData.keySkills || ''}
              onChange={(e) => handleInputChange('keySkills', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[120px]"
              maxLength="1000"
            />
            <p className="text-xs text-gray-500 mt-2">List your key technical and soft skills separated by commas (minimum 3 characters)</p>
            <p className="text-xs text-gray-400 text-right mt-1">{formData.keySkills?.length || 0}/1000 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Projects</label>
            <textarea
              placeholder="Describe your major projects, technologies used, and your role..."
              value={formData.projects || ''}
              onChange={(e) => handleInputChange('projects', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[120px]"
              maxLength="1000"
            />
            <p className="text-xs text-gray-500 mt-2">Describe your significant projects and contributions</p>
            <p className="text-xs text-gray-400 text-right mt-1">{formData.projects?.length || 0}/1000 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Key Achievements</label>
            <textarea
              placeholder="e.g., Increased system performance by 40%, Led a team of 5 developers, Implemented CI/CD pipeline..."
              value={formData.achievements || ''}
              onChange={(e) => handleInputChange('achievements', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[120px]"
              maxLength="1000"
            />
            <p className="text-xs text-gray-500 mt-2">List your professional achievements and accomplishments</p>
            <p className="text-xs text-gray-400 text-right mt-1">{formData.achievements?.length || 0}/1000 characters</p>
          </div>
        </div>
      </div>

      {/* Documents & Signature Section - FIXED VERSION */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <section className="bg-blue-600 text-white p-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mb-6">
          <h2 className="text-xl font-bold">Documents & Signature</h2>
        </section>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Digital Signature Upload <span className="text-red-600">*</span>
            </label>
            <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center bg-blue-50 hover:bg-blue-100 transition-colors">
              <input
                type="file"
                accept="image/png,image/jpg,image/jpeg"
                onChange={(e) => handleFileUpload('signature', e.target.files)}
                className="hidden"
                id="signature-upload"
              />
              <label htmlFor="signature-upload" className="cursor-pointer">
                {uploadedFiles.signature ? (
                  <div className="space-y-2">
                    <Image className="w-8 h-8 mx-auto text-green-600" />
                    <p className="text-green-600 font-medium">Signature Uploaded</p>
                    <p className="text-sm text-gray-600">{uploadedFiles.signature.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(uploadedFiles.signature.size)}</p>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile('signature')}
                      className="text-red-600 text-sm hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ) : uploadedFiles.existingSignature ? (
                  <div className="space-y-2">
                    <Image className="w-8 h-8 mx-auto text-green-600" />
                    <p className="text-green-600 font-medium">Signature Uploaded</p>
                    <p className="text-sm text-gray-600">{getFileNameFromUrl(uploadedFiles.existingSignature)}</p>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile('signature')}
                      className="text-red-600 text-sm hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-8 h-8 mx-auto text-gray-400" />
                    <p className="text-gray-600 font-medium">Click to upload your signature</p>
                    <p className="text-sm text-gray-500">PNG, JPG, JPEG (Max 5MB)</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Resume Upload <span className="text-red-600">*</span>
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => handleFileUpload('resume', e.target.files)}
                className="hidden"
                id="resume-upload"
              />
              <label htmlFor="resume-upload" className="cursor-pointer">
                {uploadedFiles.resume ? (
                  <div className="space-y-2">
                    <FileText className="w-8 h-8 mx-auto text-green-600" />
                    <p className="text-green-600 font-medium">Resume Uploaded</p>
                    <p className="text-sm text-gray-600">{uploadedFiles.resume.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(uploadedFiles.resume.size)}</p>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile('resume')}
                      className="text-red-600 text-sm hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ) : uploadedFiles.existingResume ? (
                  <div className="space-y-2">
                    <FileText className="w-8 h-8 mx-auto text-green-600" />
                    <p className="text-green-600 font-medium">Resume Uploaded</p>
                    <p className="text-sm text-gray-600">{getFileNameFromUrl(uploadedFiles.existingResume)}</p>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile('resume')}
                      className="text-red-600 text-sm hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <FileText className="w-8 h-8 mx-auto text-gray-400" />
                    <p className="text-gray-600 font-medium">Click to upload your resume</p>
                    <p className="text-sm text-gray-500">PDF, DOC, DOCX (Max 10MB)</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Additional Documents Section (keep as is) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Additional Documents (Optional)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer">
              <input
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                multiple
                onChange={(e) => handleFileUpload('additionalDocs', e.target.files)}
                className="hidden"
                id="additional-docs-upload"
              />
              <label htmlFor="additional-docs-upload" className="cursor-pointer">
                <div className="text-4xl mb-4">📎</div>
                <p className="text-gray-600 font-medium">Click to upload additional documents</p>
                <p className="text-sm text-gray-500 mt-1">Certificates, Portfolio, etc. (Max 15MB each)</p>
              </label>
            </div>
            
            {/* Show uploaded additional documents */}
            {uploadedFiles.additionalDocs && uploadedFiles.additionalDocs.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-gray-700">Uploaded Additional Documents:</p>
                {uploadedFiles.additionalDocs.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                    <div>
                      <p className="text-sm text-gray-600">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile('additionalDocs', index)}
                      className="text-red-600 text-sm hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Professional Reference Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="bg-blue-600 text-white p-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mb-6">
          <h2 className="text-xl font-bold">Professional Reference</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reference Name</label>
            <input
              type="text"
              placeholder="Enter reference name"
              value={formData.referenceName || ''}
              onChange={(e) => handleInputChange('referenceName', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
            <select
              value={formData.referenceRelationship || ''}
              onChange={(e) => handleInputChange('referenceRelationship', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Relationship</option>
              <option value="supervisor">Supervisor</option>
              <option value="manager">Manager</option>
              <option value="colleague">Colleague</option>
              <option value="mentor">Mentor</option>
              <option value="client">Client</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              placeholder="Enter phone number"
              value={formData.referencePhone || ''}
              onChange={(e) => handleInputChange('referencePhone', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              placeholder="Enter email address"
              value={formData.referenceEmail || ''}
              onChange={(e) => handleInputChange('referenceEmail', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company/Organization</label>
            <input
              type="text"
              placeholder="Enter company/organization name"
              value={formData.referenceCompany || ''}
              onChange={(e) => handleInputChange('referenceCompany', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Position Title</label>
            <input
              type="text"
              placeholder="Enter position title"
              value={formData.referencePosition || ''}
              onChange={(e) => handleInputChange('referencePosition', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Single Save Button */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">
              Profile Completion: <span className={`font-semibold ${
                profileCompletion === 100 ? 'text-green-600' : 'text-orange-600'
              }`}>
                {profileCompletion}%
              </span>
            </p>
            {profileCompletion < 100 && (
              <p className="text-xs text-red-600 mt-1">
                Please fill all required fields (marked with *) to complete your profile
              </p>
            )}
          </div>
          <button
            onClick={handleSaveChanges}
            disabled={saveStatus === 'saving'}
            className={`px-8 py-3 rounded-lg transition-colors font-medium flex items-center space-x-2 ${
              saveStatus === 'saving' 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {saveStatus === 'saving' ? (
              <>
                <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Save All Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;