const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const employeeSchema = new mongoose.Schema({
  department: {
    type: String,
    //required: true,
    trim: true
  },
  costCenter: {
    type: String,
    //required: true,
    trim: true
  },
  location: {
    type: String,
    //required: true,
    trim: true
  },
  designation: {
    type: String,
    //required: true,
    trim: true
  },
  dateOfBirth: {
    type: String,
    //required: true
  },
  dateOfJoining: {
    type: String,
   // required: true
  },
  residentialStatus: {
    type: String,
  },
  pfNumber: {
    type: String,
    //required: true,
    trim: true
  },
  esiNumber: {
    type: String,
    trim: true
  },
  epsNumber: {
    type: String,
    trim: true
  },
  phoneNumber: {
    type: Number,
    trim: true
  },
  permanentAddress: {
    type: String,
    trim: true
  },
  currentAddress: {
    type: String,
    trim: true
  },
  bankDetails: {
    accountNumber: String,
    bankName: String,
    ifscCode: String,
    branchName: String,
    adhaarNumber: String,
    panNumber: String
  },
  bloodGroup: {
    type: String,
    trim: true
  },
  maritalStatus: {
    type: String,
  },
  dateOfMarriage:{
    type: String
  },
  nationality:{
    type: String,
    //required: true
  },
  secondaryEducation:{
    tenth:{
        schoolName: {
            type: String,
            //required: true
        },
        board: String,
        yearOfPassing: Number,
        percentage: Number
    },
    twelfth:{
        schoolName:{
            type:String,
            //required: true
        },
        board:String,
        yearOfPassing: Number,
        percentage: Number
    }
  },
  graduation:{
    collegeName: String,
    percentage: Number,
    CGPA: Number,
    Backlogs: String,
    graduationYear: Number
 },
  previousCompany:{
    companyName: String,
    position: String,
    teamLead: String,
    annualSalary: Number,
    startingDate: String,
    endingDate: String,
    reasonOfLeaving:String 
 },
  skills:{
    workExperience: String,
    keySkills:String,
    keyAchivements:String,
    majorProject: String
  },
  professionalReference:{
    referenceName: String,
    relationship: String,
    phoneNumber: Number,
    email: String,
    Company: String,
    position: String
  },
},
 {
  timestamps: true
});


module.exports = mongoose.model('Employee', employeeSchema);