const AppointMent = ({ name,email, number, Date, time, message }) => {
  return `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
    }
    .container {
      padding: 20px;
      border: 1px solid #eee;
      max-width: 600px;
      margin: auto;
      background-color: #f9f9f9;
    }
    h2 {
      color: #007BFF;
    }
    p {
      margin: 5px 0;
    }
    .label {
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>New Message Received</h2>
    <p><span class="label">Name:</span> ${name}</p>
    <p><span class="label">Email:</span> ${email}</p>
    <p><span class="label">Phone Number:</span> ${number}</p>
    <p><span class="label">Date:</span> ${Date}</p>
    <p><span class="label">Time:</span> ${time}</p>
    <p><span class="label">Message:</span></p>
    <p>${message}</p>
  </div>
</body>
</html>
`;
};

module.exports = AppointMent;
