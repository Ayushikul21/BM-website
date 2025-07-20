const User = require('../../models/User')
const Leave = require('../../models/Leave')
const leaveInfo = require('../../models/LeaveInfo')
const cron = require('node-cron');
const mailSender = require('../../utils/mailSender');
const leaveRequestTemplate = require('../../mail/template/leaveTemplate');
const LeaveInfo = require('../../models/LeaveInfo');

exports.leave = async (req, res) => {
    try {
        const { startdate, enddate, leaveType, description } = req.body
        const Userid = req.user.id
        const user = await User.findById(Userid)
        const name = user.firstName + " " + user.lastName
        const email = user.email
        //console.log("hello",startdate,enddate,leaveType,description)  
        //console.log("hello",startdate,enddate,leaveType,description,name,email)
        //console.log("hellow",name,Userid)
        if (!leaveType || !startdate || !enddate || !description) {
            return res.status(403).send({
                success: false,
                message: "All Field are required"
            })
        }
        console.log("starte", startdate)
        const startdate1 = new Date(startdate)
        const enddate1 = new Date(enddate)
        console.log("Newdate", startdate1)
        const newleave = await Leave.create({ name, email, startdate: startdate1, enddate: enddate1, leaveType, userId: Userid, description })

        const mailResponse = await mailSender(email,"Leave Approval Request",leaveRequestTemplate({name, email, leaveType, fromDate: startdate1.toLocaleDateString(),toDate: enddate1.toLocaleDateString(), reason: description}));
		//console.log("Email sent successfully: ", mailResponse);
        res.status(200).json({
            success: true,
            data: newleave,
            message: "Leave approval request Created Successfully",
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: "Failed to create Leave approval",
            error: error.message,
        })
    }
}

exports.approval = async (req, res) => {
    try {
        const { status, leaveId, userId } = req.body
        if (!status || !leaveId || !userId) {
            return res.status(403).send({
                success: false,
                message: "All Field are required"
            })
        }
        if (req.user.accountType == "Employees") {
            return res.status(500).json({
                success: false,
                message: "Only admin approve the lleave"
            })
        }
        if (status == "Rejected") {
            const leaveData = await Leave.findById(leaveId)
            const userData = await User.findById(userId).populate("leaveDetails")
            leaveData.status = status
            await userData.leaveDetails.save()
            await userData.save()
            await leaveData.save()
            await leaveInfo.findByIdAndUpdate(userData.leaveDetails,
                {
                    $push: {
                        takenLeave: leaveData._id
                    }
                },
                { new: true }
            )
            return res.status(200).json({
                success: true,
                data: leaveData,
                message: "Leave Rejected...."
            })
        }
        console.log("hello word...")
        let leaveData = await Leave.findById(leaveId)
        const userData = await User.findById(userId).populate("leaveDetails")
        leaveData.status = status
        const date1 = leaveData.startdate;
        const date2 = leaveData.enddate;
            // Difference in milliseconds
        const diffInMs = date2 - date1;
            // Convert to days
        const leaveDays = diffInMs / (1000 * 60 * 60 * 24) + 1;
        leaveData.leavedays = leaveDays;
        const date3 = new Date(date1); // Reference date
        const startOfTargetDate = new Date(date3);
        startOfTargetDate.setDate(startOfTargetDate.getDate() - 3);
        startOfTargetDate.setHours(0, 0, 0, 0); // 00:00:00 of that day

        const endOfTargetDate = new Date(startOfTargetDate);
        endOfTargetDate.setDate(endOfTargetDate.getDate() + 1); // Next day 00:00:00
        console.log("startOfTargetDate", startOfTargetDate)
        console.log("endOfTargetDate", endOfTargetDate)

        // const threeDaysBefore = new Date(date1);
        // threeDaysBefore.setDate(date1.getDate() - 3);
        // threeDaysBefore.setHours(0, 0, 0, 0); // Reset to start of the day
        // console.log("threeDaysBefore", threeDaysBefore)
        // threeDaysBefore.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
        const leavedatabefore = await Leave.findOne({ userId: userId, startdate: { $gte: startOfTargetDate,$lt: endOfTargetDate} })
        console.log("leavedatabefore", leavedatabefore)
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const leaveDaystating = days[date1.getDay()];
        console.log("leaveDaystating", leaveDaystating)
        if(leaveData || userData.leaveDetails.awailbleLeave || userData.leaveDetails.creditleave ) {

            if(leavedatabefore && leavedatabefore.status == "Approved" && leaveDaystating == "Sunday") {
                console.log("defferent days1")
               let numberOfleave=leaveDays+2
               
                let remainingLeave = userData.leaveDetails.awailbleLeave - numberOfleave;
                userData.leaveDetails.creditleave = userData.leaveDetails.creditleave + remainingLeave;
                userData.leaveDetails.awailbleLeave = 0;
                console.log("remainingLeave")
                
            }
            else{
                console.log("defferent days2")
                let remainingLeave = userData.leaveDetails.awailbleLeave - leaveDays;
                userData.leaveDetails.creditleave = userData.leaveDetails.creditleave + remainingLeave;
                userData.leaveDetails.awailbleLeave = 0;
            }
            if(userData.leaveDetails.creditleave < 0) {
                console.log("hello word...123")
                userData.leaveDetails.extraleave =userData.leaveDetails.extraleave + Math.abs(userData.leaveDetails.creditleave);
                userData.leaveDetails.creditleave = 0;
            }

        }

        // //await leaveData.save()
        // if (leaveData.enddate.getTime() == leaveData.startdate.getTime()) {
        //     const date = leaveData.startdate; // Example date
        //     const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        //     const dayOfWeek = days[date.getDay()];
        //     if (dayOfWeek == "Sunday") {
        //         const threeDaysBefore = new Date(date);
        //         threeDaysBefore.setDate(date.getDate() - 3);
        //         console.log("threeDaysBefore", threeDaysBefore)
        //         const leavedatabefore = await Leave.findOne({ userId: userId, startdate: { $gte: threeDaysBefore } })
        //         console.log("leavedatabefore", leavedatabefore)
        //         if (leavedatabefore && leavedatabefore.status == "Approved") {
        //             console.log("defferent days1")
        //             if (userData.leaveDetails.awailbleLeave > 0) {
        //                 userData.leaveDetails.awailbleLeave = userData.leaveDetails.awailbleLeave - 1
        //                 userData.leaveDetails.extraleave = userData.leaveDetails.extraleave + 2
        //                 leaveData.isawailbleleave = 1
        //                 leaveData.isextraleave = 2
        //             }

        //             else {
        //                 console.log("defferent days2")
        //                 userData.leaveDetails.extraleave = userData.leaveDetails.extraleave + 3
        //                 leaveData.isextraleave = 3
        //             }
        //         }
        //         else {

        //          if (userData.leaveDetails.awailbleLeave > 0) {
        //             userData.leaveDetails.awailbleLeave = userData.leaveDetails.awailbleLeave - 1
        //             leaveData.isawailbleleave = 1
        //         }
        //         else {
        //             userData.leaveDetails.extraleave = userData.leaveDetails.extraleave + 1
        //             leaveData.isextraleave = 1
        //         }
        //        }
        //     }
        //     else {
        //         if (userData.leaveDetails.awailbleLeave > 0) {
        //             console.log("defferent days12")
        //             userData.leaveDetails.awailbleLeave = userData.leaveDetails.awailbleLeave - 1
        //             leaveData.isawailbleleave = 1
        //             console.log("defferent days123")
        //         }
        //         else {
        //             userData.leaveDetails.extraleave = userData.leaveDetails.extraleave + 1
        //             leaveData.isextraleave = 1
        //         }
        //     }
        // }

        // else {
        //     const date1 = leaveData.startdate;
        //     const date2 = leaveData.enddate;

        //     // Difference in milliseconds
        //     const diffInMs = date2 - date1;

        //     // Convert to days
        //     const diffInDays1 = diffInMs / (1000 * 60 * 60 * 24);
        //     const diffInDays = diffInDays1 + 1; // Adding 1 to include the end date
        //     console.log("defferent days", diffInDays)
        //     //const userData = await User.findById(userId).populate("leaveDetails")
        //     console.log("defferent days1234",userData)
        //     console.log("userData.leaveDetails", userData.leaveDetails.awailbleLeave)
        //     if (userData.leaveDetails.awailbleLeave > 0) {
        //         console.log("defferent days13")
        //         let a = diffInDays - userData.leaveDetails.awailbleLeave
        //         userData.leaveDetails.extraleave = a
        //         leaveData.isawailbleleave = userData.leaveDetails.awailbleLeave
        //         leaveData.isextraleave = a
        //         userData.leaveDetails.awailbleLeave = 0
        //         console.log("defferent days14")
        //         await userData.leaveDetails.save()
        //     }
        //     else {
        //         //const userData1=await User.findById(userId)
        //         console.log("hello word...1234")
        //         userData.leaveDetails.extraleave = userData.leaveDetails.extraleave + diffInDays
        //         leaveData.isextraleave = diffInDays
        //         //console.log("hello word...2")
        //     }
        // }

        await userData.leaveDetails.save()
        await userData.save()
        await leaveData.save()
        await leaveInfo.findByIdAndUpdate( userData.leaveDetails,
            {
                $push: {
                    takenLeave: leaveData._id
                }
            },
            { new: true }
        )
        //const userDetails=await User.findById({_id:userId})
        res.status(200).json({
            success: true,
            data: leaveData,
            message: "Leave Approve...."
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: " Leave Not approval",
            error: error.message,
        })
    }
}

exports.Cancleleave = async (req, res) => {
    try {
        const { leaveID, userID } = req.body
        const user = req.user.id
        console.log("user", user)
        const leaveData = await Leave.findById(leaveID )
        const userData = await User.findById(userID).populate("leaveDetails")
        const userDetails = await User.findById(user)
        const currentDate = new Date();
        if(req.user.accountType == "Employees" && leaveData.startdate.getTime() > currentDate.getTime()) {

            leaveData.status = "Cancelled"
            userData.leaveDetails.extraleave= userData.leaveDetails.extraleave - leaveData.leavedays
            if(userData.leaveDetails.extraleave < 0) {
                userData.leaveDetails.creditleave = userData.leaveDetails.creditleave + Math.abs(userData.leaveDetails.extraleave);
                userData.leaveDetails.extraleave = 0;
            }
        }
        else if (req.user.accountType == "Admin") {
            leaveData.status = "Cancelled"
            userData.leaveDetails.extraleave= userData.leaveDetails.extraleave - leaveData.leavedays
            if(userData.leaveDetails.extraleave < 0) {
                userData.leaveDetails.creditleave = userData.leaveDetails.creditleave + Math.abs(userData.leaveDetails.extraleave);
                userData.leaveDetails.extraleave = 0;
            }
        }
        else {
            return res.status(403).send({
                success: false,
                message: "You can't cancel leave after start date"
            })
        }



        // if (leaveData.startdate.getTime() > currentDate.getTime()) {
        //     console.log("hello....2", user.accountType)
        //     if (userDetails.accountType == "Employees") {
        //         console.log("hello....")
        //         if (leaveData.status == "Approved") {
        //             console.log("hello....3")
        //             userDetails1.leaveDetails.awailbleLeave = userDetails1.leaveDetails.awailbleLeave + leaveData.isawailbleleave,
        //             userDetails1.leaveDetails.extraleave = userDetails1.leaveDetails.extraleave - leaveData.isextraleave
        //             leaveData.status = "Cancelled"
        //             leaveData.isawailbleleave = 0
        //             leaveData.isextraleave = 0
        //         }
        //     }
        // }


        // if (leaveData.startdate <= currentDate) {
        //     console.log("hello....4")
        //     if (userDetails.accountType == "Admin") {
        //         if( leaveData.status == "Approved") {
        //             console.log("hello....1")
        //         userDetails1.leaveDetails.awailbleLeave = userDetails1.leaveDetails.awailbleLeave + leaveData.isawailbleleave,
        //         userDetails1.leaveDetails.extraleave = userDetails1.leaveDetails.extraleave - leaveData.isextraleave
        //         leaveData.status = "Cancelled"
        //         leaveData.isawailbleleave = 0    
        //         leaveData.isextraleave = 0
        //         }
                
        //     }
        //     else {
        //         return res.status(403).send({
        //             success: false,
        //             message: "You can't cancel leave after start date"
        //         })
        //     }

        // }
        await userData.leaveDetails.save()
        await userData.save()
        await leaveData.save()

        res.status(200).json({
            success: true,
            data: await Leave.findById(leaveID),
            message: "Successfull cancal..."
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: " Leave Not Cancle",
            error: error.message,
        })
    }
}

exports.leaveDelete = async (req, res) => {
    try {
        const { leaveID } = req.body
        if (!leaveID) {
            return res.status(403).send({
                success: false,
                message: "Leave ID is required"
            })
        }
        const leaveData = await Leave.findById(leaveID);
        if(leaveData.status!="Pending" && leaveData.enddate.getTime() < new Date().getTime()) {
        await LeaveInfo.findByIdAndUpdate(leaveData.userId, 
            {
                $pull: {
                    takenLeave: leaveID
                }
            },
            { new: true }
        );
        await Leave.findByIdAndDelete(leaveID);
        return res.status(200).json({
            success: true,
            message: "Leave deleted successfully",
        });
        }

        await Leave.findByIdAndDelete(leaveID);
        res.status(200).json({
            success: true,
            message: "Leave deleted successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to delete leave",
            error: error.message,
        });
    }
}