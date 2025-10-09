const Attendance = require('../../models/AttendenceModel/Attendence');
const axios = require('axios');

exports.fetchAndSaveAttendance = async () => {
  try {

    const formatDate = (date = new Date()) => {
      const day = String(date.getDate()).padStart(2, '0');      // 2-digit day
      const month = String(date.getMonth() + 1).padStart(2, '0'); // 2-digit month
      const year = date.getFullYear();                          // 4-digit year
      return `${day}/${month}/${year}`;
    };

    const fromDate = formatDate();  // today's date
    const toDate = formatDate();
    console.log(`Fetching attendance from ${fromDate} to ${toDate}`);
    // const fromDate = '10/07/2025';
    // const toDate = '10/07/2025';
    const url = `https://api.etimeoffice.com/api/DownloadInOutPunchData?Empcode=ALL&FromDate=${fromDate}&ToDate=${toDate}`;
    const response = await axios.get(url, {
      auth: {
        username: "BANDYMOOT001:OMDUBEY:Rudra@123:true",
        password: "BANDYMOOT001:OMDUBEY:Rudra@123:true"
      },
      headers: {
        'Accept': 'application/json'
      }
    });
    console.log(`Fetching data from URL: ${url}`);
    const attendanceList = response.data.InOutPunchData;
    console.log(`Received attendance data: ${attendanceList.length} records`);
    console.log(`Fetched attendance records`);

    if (Array.isArray(attendanceList)) {
      for (const data of attendanceList) {
       
        await Attendance.create(data);
      }
    } else {
      console.error('Unexpected data format from API:', attendanceList);
    }
  } catch (error) {
    console.error('Error fetching or saving data:', error.message);
  }
};

exports.updateAttendance = async (req, res) => {
  try {
   const formatDate = (date = new Date()) => {
      const day = String(date.getDate()).padStart(2, '0');      // 2-digit day
      const month = String(date.getMonth() + 1).padStart(2, '0'); // 2-digit month
      const year = date.getFullYear();                          // 4-digit year
      return `${day}/${month}/${year}`;
    };

    const fromDate = formatDate();  // today's date
    const toDate = formatDate();

    const url = `https://api.etimeoffice.com/api/DownloadInOutPunchData?Empcode=ALL&FromDate=${fromDate}&ToDate=${toDate}`;

    const response = await axios.get(url, {
      auth: {
        username: "BANDYMOOT001:OMDUBEY:Rudra@123:true",
        password: "BANDYMOOT001:OMDUBEY:Rudra@123:true"
      }
    });

    const data = response.data.InOutPunchData;

    for (const record of data) {
      const {
        Empcode,
        OUTTime,
        WorkTime,
        OverTime,
        BreakTime,
        Status,
        DateString,
        Remark,
        Erl_Out,
        Late_In
      } = record;
      // Check if record already exists
      const existing = await Attendance.findOne({ Empcode, DateString });

      if (existing) {
        // Update all fields
        existing.OUTTime = OUTTime;
        existing.WorkTime = WorkTime;
        existing.OverTime = OverTime;
        existing.BreakTime = BreakTime;
        existing.Status = Status;
        existing.Remark = Remark;
        existing.Erl_Out = Erl_Out;
        existing.Late_In = Late_In;

        await existing.save();
        console.log(`Processing record for EmpCode: ${Empcode}, Date: ${DateString}`);
      }
    }

    res.status(200).json({ message: "Attendance data updated successfully." });
  } catch (err) {
    console.error("Error updating attendance:", err.message);
    //res.status(500).json({ error: "Something went wrong." });
  }
};

exports.getAttendanceByDate = async (req, res) => {
  try {
    const { date } = req.body; // Expecting date in "MM/DD/YYYY" format
    if (!date) {
      return res.status(400).json({ success: false, message: 'Date is required' });
    }
    const attendance = await Attendance.find({ DateString: date });
    return attendance;
  } catch (error) {
    console.error('Error fetching attendance by date:', error.message);
    throw error;
  }
};

exports.updateAttendancebydate = async (req, res) => {
  try {
    const { date, Notes, empcode } = req.body;

    if (!date || !empcode || !Notes) {
      return res.status(400).json({ success: false, message: 'Date and Empcode are required' });
    }

    // Find the attendance record for the given date and empcode
    const attendanceOnDate = await Attendance.findOne({ DateString: date, Empcode: empcode });
    if (!attendanceOnDate) {
      return res.status(404).json({ success: false, message: 'Attendance record notfound' });
    }
    const attendance = await Attendance.findOneAndUpdate(
      { DateString: date, Empcode: empcode },
      { Notes },
      { new: true }
    );

    if (!attendance) {
      return res.status(404).json({ success: false, message: 'Attendance record not found' });
    }

    res.status(200).json({ success: true, data: attendance });
  } catch (error) {
    console.error('Error updating attendance:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

exports.deleteAttendanceByDate = async (req, res) => {
  try {
    const { date } = req.body; // Expecting date in "MM/DD/YYYY" format
    if (!date) {
      return res.status(400).json({ success: false, message: 'Date is required' });
    }
    const attendance = await Attendance.deleteMany({ DateString: date });
    return res.status(200).json({ success: true, message: 'Attendance records deleted successfully' });
  } catch (error) {
    console.error('Error deleting attendance by date:', error.message);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
exports.deleteAttendanceDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.body; // Expecting dates in "MM/DD/YYYY" format
    if (!startDate || !endDate) {
      return res.status(400).json({ success: false, message: 'Start and End dates are required' });
    }
    const attendance = await Attendance.deleteMany({
      DateString: { $gte: startDate, $lte: endDate }
    });
    return res.status(200).json({ success: true, message: 'Attendance records deleted successfully' });
  } catch (error) {
    console.error('Error deleting attendance by date range:', error.message);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

exports.getAttendancebyEmpcodeoneMonth = async (req, res) => {
  try {
    const { empcode } = req.body; // Expecting empcode in the request body
    if (!empcode) {
      return res.status(400).json({ success: false, message: 'Empcode is required' });
    }

    const today = new Date();
    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(today.getMonth() - 1);

    const attendance = await Attendance.find({
      Empcode: empcode,
      DateString: {
        $gte: oneMonthAgo.toISOString().split('T')[0],
        $lte: today.toISOString().split('T')[0]
      }
    });

    return res.status(200).json({ success: true, data: attendance });
  } catch (error) {
    console.error('Error fetching attendance by empcode for one month:', error.message);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}