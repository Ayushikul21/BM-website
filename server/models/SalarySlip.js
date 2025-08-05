const mongoose = require('mongoose');

const salarySlipSchema = new mongoose.Schema({
employeeId:{
  type:String,
  required: true,
  }  ,
  payrollMonth: { type: String, required: true },
  earnings: {
    basic: { type: Number, required: true },
    hra: { type: Number, default: 0 },
    special: { type: Number, default: 0 },
    arrearSpecial: { type: Number, default: 0 },
    totalEarnings: { type: Number }
  },
  deductions: {
    providentFund: { type: Number, default: 0 },
    incomeTax: { type: Number, default: 0 },
    totalDeductions: { type: Number }
  },
  netPay: { type: Number }
});

// salarySlipSchema.pre('save', function (next) {
//   this.earnings.totalEarnings =
//     this.earnings.basic +
//     this.earnings.hra +
//     this.earnings.special +
//     this.earnings.arrearSpecial;

//   this.deductions.totalDeductions =
//     this.deductions.providentFund +
//     this.deductions.incomeTax;

//   this.netPay = this.earnings.totalEarnings - this.deductions.totalDeductions;

//   next();
// });

module.exports = mongoose.model('SalarySlip', salarySlipSchema);
