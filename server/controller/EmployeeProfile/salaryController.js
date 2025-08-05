const SalarySlip = require('../../models/SalarySlip');
//const generatePDF = require('../utils/pdfGenerator');
//const sendSalarySlip = require('../utils/mailSender');
const User = require('../../models/User');
//const SalarySlip = require('../../models/SalarySlip');

// Create
exports.createSalarySlip = async (req, res) => {
  try {
    //console.log('Request body:', req.body);
    const { employeeId, payrollMonth, earnings, deductions } = req.body;
    //console.log('Employee ID:', employeeId);
    const slip = new SalarySlip(req.body);
    await slip.save();
    console.log('Salary slip created:');
     const existingSlip = await User.findOneAndUpdate({employeeId:employeeId},
      {
        $push: {
          SalarySlip: slip._id
         },
      },
      {new: true}
     );

    return res.status(201).json({
      success: true,
      message: 'Salary slip created successfully',  
      slip,
      existingSlip
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Read All
exports.getAllSalarySlips = async (req, res) => {
  try {
    const slips = await SalarySlip.find({});
  if (!slips || slips.length === 0) {
    return res.status(404).json({ error: 'No salary slips found' });
  }
  return res.status(200).json({
    success: true,
    message: 'Salary slips retrieved successfully',
    slips
  });
  } catch (error) {
    console.error('Error fetching salary slips:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Read One
exports.getSalarySlipById = async (req, res) => {
  try {
    const { employeeId } = req.body;
    console.log('Employee ID:', employeeId);
    if (!employeeId) {
      return res.status(400).json({ error: 'Employee ID is required' });
    }
    const slip = await SalarySlip.findOne({employeeId: employeeId});
    if (!slip) {
      return res.status(404).json({ error: 'Salary slip not found' });
    }
    return res.status(200).json({
      success: true,
      message: 'Salary slip retrieved successfully',
      slip
    });
  } catch {
    res.status(404).json({ error: 'Not found' });
  }
};


exports.getallSalarySlipById = async (req, res) => {
  try {
    const { employeeId } = req.body;
    console.log('Employee ID:', employeeId);
    if (!employeeId) {
      return res.status(400).json({ error: 'Employee ID is required' });
    }
    const slip = await SalarySlip.find({employeeId: employeeId});
    if (!slip) {
      return res.status(404).json({ error: 'Salary slip not found' });
    }
    return res.status(200).json({
      success: true,
      message: 'Salary slip retrieved successfully',
      slip
    });
  } catch {
    res.status(404).json({ error: 'Not found' });
  }
};












// Update
exports.updateSalarySlip = async (req, res) => {
  try {
    const {employeeId,salaryId}=req.body;
    if (!employeeId || !salaryId) {
      return res.status(400).json({ error: 'Employee ID and Salary ID are required' });
    }
    const updated = await SalarySlip.findByIdAndUpdate(salaryId, req.body, {
      new: true,
      runValidators: true
    });
    return res.status(200).json({
      success: true,
      message: 'Salary slip updated successfully',
      updated
    }); 
  } catch (err) {
    return res.status(400).json({ error: err.message });  
  }
};

// Delete
exports.deleteSalarySlip = async (req, res) => {
 try {
   const { employeeId, salaryId } = req.body;
  if (!employeeId || !salaryId) {
    return res.status(400).json({ error: 'Employee ID and Salary ID are required' });
  }
  await User.findOneAndUpdate({ employeeId: employeeId },
    {
      $pull: {
        SalarySlip: salaryId
      }
    },
    { new: true }
  );
  await SalarySlip.findByIdAndDelete(salaryId);
  return res.status(200).json({
    success: true,
    message: 'Salary slip deleted successfully'
  });
 } catch (error) {
  res.status(500).json({ error: 'Internal server error' });
  console.error('Error deleting salary slip:', error);  
 }
};

