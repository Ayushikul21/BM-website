const Employee = require('../../models/Employee'); // Assuming you have an Employee model
const User = require('../../models/User'); // Assuming you have a User model


// Get all employees
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await User.find().populate('additionalDetails').exec();
    if (!employees || employees.length === 0) {
      return res.status(404).json({ error: 'No employees found' });
    }
    return res.status(200).json({
      success: true,
      message: 'Employees fetched successfully',
      data:employees,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get employee by ID
exports.getEmployeeById = async (req, res) => {
  try {
    const { employeeId } = req.body;
    const employee = await User.findOne({employeeId: employeeId}).populate('additionalDetails');
    if (!employee) return res.status(404).json({ error: 'Employee not found' });
   return res.status(200).json({
      success: true,  
      message: 'Employee fetched successfully',
      data: employee,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update employee
exports.updateEmployee = async (req, res) => {
  try {
    console.log('Update Employee Request:', req.body);
    const  userId  = req.user.id;
    //const userId = req.user.id; // Assuming you have user ID from auth middleware
    const updates = req.body;
    if(!updates){
      return res.status(400).json({ error: 'No updates provided' });
    }
    const userdata = await User.findById(userId);
    if (!userdata || !userdata.additionalDetails) {
      return res.status(404).json({ error: 'User or employee details not found' });
    }

    // Perform update
    const employee = await Employee.findByIdAndUpdate(userdata.additionalDetails, updates, {
      new: true,
      runValidators: true,
    });

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.status(200).json({
      message: 'Employee updated successfully',
      employee,
    });
  } catch (error) {
    console.error('Update Error:', error.message);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};

