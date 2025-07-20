const mongoose = require('mongoose');
const leaveInfoSchema = new mongoose.Schema(
    {
        takenLeave: [{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Leave",
        }],
        awailbleLeave:
        {
            type: Number,
            default: 2,
        },
        creditleave: {
            type: Number,
            default: 0
        },
        extraleave: { type: Number, default: 0 },
        
        Totalleave: {
            type: Number,
            default: 0
        },
    }
)

module.exports = mongoose.model("LeaveInfo", leaveInfoSchema);