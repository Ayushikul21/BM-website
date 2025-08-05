const mongoose = require('mongoose');
const appointmentSchema = new mongoose.Schema(
    {
        date: {
            type: String,
            require: true
        },
        time: {
            type: String,
            require: true
        },
        status: {
            type: String,
            enum: ['Availble', 'Booked'],
            default: 'Availble'
        },
        AppointmentUser: {
           type:String,
        },



    },
    { timestamps: true }
)

module.exports = mongoose.model("AppointMent", appointmentSchema);;