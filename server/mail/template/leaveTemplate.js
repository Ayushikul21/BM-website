const leaveRequestTemplate = ({ name,email, leaveType, fromDate, toDate, reason }) => {
  return `<!DOCTYPE html>
  <html>
  
  <head>
    <meta charset="UTF-8">
    <title>Leave Request</title>
    <style>
      body {
        background-color: #ffffff;
        font-family: Arial, sans-serif;
        font-size: 16px;
        line-height: 1.5;
        color: #333333;
        margin: 0;
        padding: 0;
      }

      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        text-align: center;
      }

      .logo {
        max-width: 200px;
        margin-bottom: 20px;
      }

      .message {
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 20px;
        color: #000;
      }

      .body {
        text-align: left;
        font-size: 16px;
        background: #f9f9f9;
        padding: 20px;
        border-radius: 8px;
      }

      .info {
        margin-bottom: 10px;
      }

      .highlight {
        font-weight: bold;
        color: #000000;
      }

      .footer {
        font-size: 14px;
        color: #999999;
        margin-top: 20px;
      }
    </style>
  </head>
  
  <body>
    <div class="container">
      <a href="https://yourcompanysite.com">
        <img class="logo" src="https://i.ibb.co/7Xyj3PC/logo.png" alt="Company Logo">
      </a>
      <div class="message">Leave Request Notification</div>
      <div class="body">
        <div class="info"><span class="highlight">Name:</span> ${name}</div>
        <div class="info"><span class="highlight">Email:</span> ${email}</div>
        <div class="info"><span class="highlight">Type of Leave:</span> ${leaveType}</div>
        <div class="info"><span class="highlight">From:</span> ${fromDate}</div>
        <div class="info"><span class="highlight">To:</span> ${toDate}</div>
        <div class="info"><span class="highlight">Reason:</span> ${reason}</div>
      </div>
      <div class="footer">
        If you have any questions, contact <a href="mailto:hr@yourcompany.com">hr@yourcompany.com</a>
      </div>
    </div>
  </body>
  </html>`;
};

module.exports = leaveRequestTemplate;
