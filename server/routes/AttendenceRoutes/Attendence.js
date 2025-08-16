const express = require('express');
const router = express.Router();

const { fetchAndSaveAttendance, updateAttendance,updateAttendancebydate,deleteAttendanceDateRange } = require('../../controller/Attendence/AttendenceUser');
const {taskmanagement} = require('../../controller/TaskManagement/Tasktoday');
const{ auth }= require('../../midlewere/Auth');
// Route to fetch and save attendance
router.post('/updateAttendanceNotes', updateAttendancebydate);
router.post("/deleteAttendanceDateRange", deleteAttendanceDateRange);
router.post('/fetchAndSaveAttendance', fetchAndSaveAttendance);
// Route to update attendance
router.post('/updateAttendance', updateAttendance);
// Route to manage tasks
router.post('/taskmanagement',auth, taskmanagement);

module.exports = router;