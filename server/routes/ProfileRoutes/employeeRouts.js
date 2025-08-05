const express = require('express');
const router = express.Router();
const {
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  //deleteEmployee
} = require('../../controller/EmployeeProfile/employeeController');
const { auth, isAdmin,isEmployees } = require('../../midlewere/Auth');

//router.post('/:id', createEmployee);
router.get('/allemployees',auth,isAdmin, getAllEmployees);
router.post('/findemployeeID',auth,isAdmin, getEmployeeById);
router.put('/updateemployee',auth,isEmployees, updateEmployee);
//router.delete('/:id', deleteEmployee);

module.exports = router;
