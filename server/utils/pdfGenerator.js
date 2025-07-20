const PDFDocument = require('pdfkit');

function generatePDF(slipData) {
  const doc = new PDFDocument();
  let buffers = [];

  doc.on('data', buffers.push.bind(buffers));
  doc.on('end', () => {});

  doc.fontSize(18).text("Salary Slip", { align: 'center' });
  doc.moveDown();

  doc.fontSize(12).text(`Payroll Month: ${slipData.payrollMonth}`);
  doc.moveDown();

  doc.text(`Basic Salary: ₹${slipData.earnings.basic}`);
  doc.text(`House Rent Allowance: ₹${slipData.earnings.hra}`);
  doc.text(`Special Allowance: ₹${slipData.earnings.special}`);
  doc.text(`Arrear Special Allowance: ₹${slipData.earnings.arrearSpecial}`);
  doc.text(`Total Earnings: ₹${slipData.earnings.totalEarnings}`);

  doc.moveDown();
  doc.text(`Provident Fund: ₹${slipData.deductions.providentFund}`);
  doc.text(`Income Tax: ₹${slipData.deductions.incomeTax}`);
  doc.text(`Total Deductions: ₹${slipData.deductions.totalDeductions}`);

  doc.moveDown();
  doc.fontSize(14).text(`Net Pay: ₹${slipData.netPay}`, { bold: true });

  doc.end();

  return new Promise((resolve) => {
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(buffers);
      resolve(pdfBuffer);
    });
  });
}

module.exports = generatePDF;
