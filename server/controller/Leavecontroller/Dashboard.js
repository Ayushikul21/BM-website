const User = require("../../models/User")
const LeaveInfo = require("../../models/LeaveInfo")
const Leave = require("../../models/Leave")


exports.userDetails=async(req,res)=>{
    try {
        const userId=req.user.id
        const userData=await User.findById(userId).populate("additionalDetails").populate("leaveDetails").populate("SalarySlip").exec()
        const leaveInfo=await LeaveInfo.findOne({_id:userData.leaveDetails}).populate("takenLeave").exec()
        if(!userData){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }
        return res.status(200).json({   
            success:true,
            message:"User data fetched successfully",
            data:userData,
            leaveData:leaveInfo
        })
    } catch (error) {
        return res.status(500).json({   
            success:false,
            message:"Internal server error"
        })
    }
}

exports.leaveDetails=async(req,res)=>{
    try {
        console.log("hello 3")
        const {leaveId}=req.body
        if(!leaveId){
            return res.status(400).json({
                success:false,
                message:"leaveId is required"
            })
        }
        const leaveDetails=await Leave.findById(leaveId)
        console.log("hello 1")
        res.status(200).json({
            success:true,
            message:"get successfully",
            data:leaveDetails
        })
    
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success:false,
            message:"problem to get"

        })
    }
}




exports.creditleave=async(req,res)=>{
    try {
        const {userId}=req.body
        const userData=await User.findById(userId).populate("leaveDetails").exec()
        if(!userData){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }
        const userLeaveInfo=await LeaveInfo.findById(userData.leaveDetails)
        userLeaveInfo.creditleave=userLeaveInfo.creditleave+userLeaveInfo.awailbleLeave
        await userLeaveInfo.save()
        res.status(200).json({
            success:true,
            message:"Leave credited successfully",
            data:userLeaveInfo
        })
    } catch (error) {
        console.log(error)
    }
}
exports.awailbleset=async(req,res)=>{
    try {
        await LeaveInfo.updateMany({},{ $set: { awailbleLeave: 2 } });
        //await LeaveInfo.save()
        res.status(200).json({
            success:true,
            message:"Leave set successfully"
        })  
    } catch (error) {
        console.log(error)
    }
}
exports.awailbleReset=async(req,res)=>{
    try {
        await LeaveInfo.updateMany({},{ $set: { awailbleLeave: 0 } });
        res.status(200).json({
            success:true,
            message:"Leave reset successfully"
        })
    } catch (error) {
        console.log(error)
    }
}