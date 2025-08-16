const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  Empcode: {
    type: String,
    required: true
  },
  Name: {
    type: String,
    required: true
  },
  INTime: {
    type: String, // HH:mm format
    required: true
  },
  OUTTime: {
    type: String
  },
  Notes: {
    type: String,
    default: ''
 },
  WorkTime: {
    type: String // HH:mm format
  },
  OverTime: {
    type: String
  },
  BreakTime: {
    type: String
  },
  Status: {
    type: String,
    enum: ['P', 'A', 'L', 'WO', 'HL'], // Present, Absent, Leave, Week Off, Holiday
    default: 'P'
  },
  DateString: {
    type: String, // e.g., "10/07/2025"
    required: true
  },
  Remark: {
    type: String
  },
  Erl_Out: {
    type: String // Early Out time, format HH:mm
  },
  Late_In: {
    type: String
  }
},
{timestamps: true}
);

module.exports = mongoose.model('Attendance', attendanceSchema);
