const mongoose=require('mongoose');
const leaveSchema=new mongoose.Schema(
    {
        name:{
            type:String,
            require:true
        },
        email:{
            type:String,
            require:true
        },
        userId:{
            type:String,
            require:true
        },
        startdate:{
            type:Date,
            default:Date.now
        },
        enddate:{
            type:Date,
            default:Date.now
        },
        leaveType:{
            type:String,
            require:true
        },
        description:{
            type:String,
            require:true
        },
        status:{
            type:String,
            enum: ['Pending', 'Approved', 'Rejected', 'Cancelled'],
            default: 'Pending'
        },
        isawailbleleave:{
            type:Number,
            default:0
        },
        isextraleave:{
            type:Number,
            default:0
        },
        iscreditleave:{
            type:Number,    
            default:0
        },
        leavedays:{
            type:Number,    
            default:0
        },
        createdAt: {
		type: Date,
		default: Date.now,
		//expires: 60 * 5, // The document will be automatically deleted after 5 minutes of its creation time
	},  
    }
)

module.exports = mongoose.model("Leave", leaveSchema);;