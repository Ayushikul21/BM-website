const express = require('express');
const router = express.Router();
const {
  createSalarySlip,
  getAllSalarySlips,
  getSalarySlipById,
  updateSalarySlip,
  deleteSalarySlip,
  getallSalarySlipById
} = require('../../controller/EmployeeProfile/salaryController');

const { auth, isAdmin, isEmployees } = require('../../midlewere/Auth');  
// CRUD
router.post('/createsalaryslip',auth,isAdmin, createSalarySlip);
router.put('/updatesalaryslip',auth,isAdmin, updateSalarySlip);
router.post('/deletesalaryslipByuser',auth, deleteSalarySlip);


router.get('/getAllsalaryslip',auth,isAdmin, getAllSalarySlips);
router.post('/getsalaryslipbyid',auth,isAdmin, getSalarySlipById);
router.post('/getallsalaryslipbyID',auth,getallSalarySlipById);

module.exports = router;
