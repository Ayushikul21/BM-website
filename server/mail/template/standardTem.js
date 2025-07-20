
const leaveTemplate = ({ name, email, leaveType, fromDate, toDate, reason }) => {
return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Leave Request</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        
        .email-container {
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        
        .header {
            background: #2c3e50;
            color: white;
            padding: 20px;
            text-align: center;
        }
        
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        
        .content {
            padding: 30px;
        }
        
        .section {
            margin-bottom: 25px;
        }
        
        .section-title {
            font-size: 18px;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 15px;
            border-bottom: 2px solid #3498db;
            padding-bottom: 5px;
        }
        
        .info-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        
        .info-table th,
        .info-table td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        
        .info-table th {
            background-color: #f8f9fa;
            font-weight: bold;
            color: #2c3e50;
            width: 40%;
        }
        
        .info-table tr:hover {
            background-color: #f8f9fa;
        }
        
        .reason-box {
            background: #f8f9fa;
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 15px;
            margin: 15px 0;
        }
        
        .status-badge {
            display: inline-block;
            background: #f39c12;
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
        }
        
        .action-buttons {
            text-align: center;
            margin: 25px 0;
        }
        
        .btn {
            display: inline-block;
            padding: 10px 20px;
            margin: 5px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            text-align: center;
            cursor: pointer;
        }
        
        .btn-approve {
            background: #27ae60;
            color: white;
        }
        
        .btn-decline {
            background: #e74c3c;
            color: white;
        }
        
        .btn:hover {
            opacity: 0.9;
        }
        
        .footer {
            background: #34495e;
            color: white;
            padding: 20px;
            text-align: center;
            font-size: 14px;
        }
        
        .footer a {
            color: #3498db;
            text-decoration: none;
        }
        
        .divider {
            height: 1px;
            background: #ddd;
            margin: 20px 0;
        }
        
        @media (max-width: 600px) {
            body {
                padding: 10px;
            }
            
            .content {
                padding: 20px;
            }
            
            .info-table th,
            .info-table td {
                padding: 8px;
                font-size: 14px;
            }
            
            .btn {
                display: block;
                margin: 10px 0;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <h1>Leave Request Application</h1>
            <span class="status-badge">Pending Review</span>
        </div>
        
        <!-- Content -->
        <div class="content">
            <!-- Employee Information -->
            <div class="section">
                <div class="section-title">Employee Information</div>
                <table class="info-table">
                    <tr>
                        <th>Employee Name</th>
                        <td>${name}</td>
                    </tr>
                    <tr>
                        <th>Employee ID</th>
                        <td>${EmpId}</td>
                    </tr>
                    <tr>
                        <th>Email Address</th>
                        <td>${email}</td>
                    </tr>
                    <tr>
                        <th>Department</th>
                        <td>${department}</td>
                    </tr>
                    <tr>
                        <th>Manager</th>
                        <td>${manager}</td>
                    </tr>
                </table>
            </div>
            
            <!-- Leave Details -->
            <div class="section">
                <div class="section-title">Leave Details</div>
                <table class="info-table">
                    <tr>
                        <th>Leave Type</th>
                        <td>${leaveType}</td>
                    </tr>
                    <tr>
                        <th>From Date</th>
                        <td>${fromDate}</td>
                    </tr>
                    <tr>
                        <th>To Date</th>
                        <td>${toDate}</td>
                    </tr>
                    <tr>
                        <th>Duration</th>
                        <td>${duration}</td>
                    </tr>
                    <tr>
                        <th>Application Date</th>
                        <td>${createAt}</td>
                    </tr>
                </table>
            </div>
            
            <!-- Reason -->
            <div class="section">
                <div class="section-title">Reason for Leave</div>
                <div class="reason-box">
                ${reason}
                </div>
            </div>
            
            <div class="divider"></div>
            
            <!-- Action Buttons -->
            <div class="action-buttons">
                <a href="mailto:hr@company.com?subject=Leave%20Approved%20-%20Priya%20Sharma&body=Leave%20request%20for%20Priya%20Sharma%20has%20been%20approved." class="btn btn-approve">
                    Approve Leave
                </a>
                <a href="mailto:hr@company.com?subject=Leave%20Declined%20-%20Priya%20Sharma&body=Leave%20request%20for%20Priya%20Sharma%20has%20been%20declined." class="btn btn-decline">
                    Decline Leave
                </a>
            </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <p><strong>Human Resources Department</strong></p>
            <p>Bandy&Moot pvt</p>
            <p>Email: <a href="mailto:hr@company.com">hr@company.com</a> | Phone: +91-9876543210</p>
            <p style="font-size: 12px; margin-top: 10px;">
                This is an automated email. Please do not reply directly to this message.
            </p>
        </div>
    </div>
</body>
</html>
`
}
module.exports =  leaveTemplate ;