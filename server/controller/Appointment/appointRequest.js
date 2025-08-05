const Appointment = require('../../models/AppointSchema/Appointment');
const mailSender = require('../../utils/mailSender');
const AppointMent = require('../../mail/template/mailAppointment');

exports.requestAppointment = async (req, res) => {
    try {   
        // Extracting appointment details from the request body
        const { name, email, number, Date, time, message } =req.body;
        // Validate required fields 
        if (!name || !email || !number || !Date || !time || !message) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Create a new appointment request object
        const mailsend= await mailSender(
            "arvindkumar7081950143@gmail.com",
            "Appointment Request",
             AppointMent({ name, email, number, Date, time, message })
        );
        console.log("Mail sent successfully:", mailsend);
        return res.status(200).json({ message: "Appointment request sent successfully." });
    } catch (error) {
        console.error("Error sending appointment request:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}
        // Save the appointment request to the database
exports.getAppointments = async (req, res) => {
    try {
        // Fetch all appointments from the database
        const appointments = await Appointment.find();
        // Respond with the list of appointments
        return res.status(200).json(appointments);
    } catch (error) {
        console.error("Error fetching appointments:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}

exports.schuduleAppointment = async (req, res) => {
    try {
        // Extracting appointment details from the request body
        const { date, time } = req.body;
        // Validate required fields
        if (!date || !time)
            return res.status(400).json({ message: "All fields are required." });
        // Create a new appointment object
        const newAppointment = new Appointment({
            date,
            time
        });
        // Save the appointment to the database
        await newAppointment.save();
        // Respond with a success message
        return res.status(201).json({ message: "Appointment scheduled successfully." });
    } catch (error) {
        console.error("Error scheduling appointment:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}