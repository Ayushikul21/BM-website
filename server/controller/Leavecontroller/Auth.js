const User=require('../../models/User')
const LeaveInfo=require('../../models/LeaveInfo')
const Leave=require('../../models/Leave')
const Employee=require('../../models/Employee')
const bcrypt = require("bcrypt")
const jwt=require("jsonwebtoken")
const otpGenerator=require('otp-generator')
const OTP=require('../../models/OTP')
require('dotenv').config()
const mailSender = require("../../utils/mailSender")
const  passwordUpdated  = require("../../mail/template/passwordUpdate")




exports.signup=async(req,res)=>{
  console.log(req.body)
    try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      employeeId,
    
    }=req.body
    if(!firstName ||!lastName||!email||!password||!confirmPassword||
        !accountType||!employeeId
    ) {
        return res.status(403).send({
            success:false,
            message:"All Field are required"
        })
    } 
    console.log("helloG")
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Password and Confirm Password do not match. Please try again.",
      })
    }
    // Check if user already exists
    const existUser=await User.findOne({email})
    if(existUser){
        return res.status(403).send({
            success:false,
            message:"Allready User exist"
        })
    }

console.log("hello11111")
const profileDetails=await Employee.create({
  department: "Not Assigned",
  // costCenter: "Not Assigned",
  // location: "Not Assigned",
  // designation: "Not Assigned",  
  // dateOfBirth: "Not Assigned",
  // dateOfJoining: "Not Assigned",
  // residentialStatus: "Not Assigned",
  // pfNumber: "Not Assigned",
  // esiNumber: "Not Assigned",
  // epsNumber: "Not Assigned",

  // phoneNumber: "Not Assigned",
  // permanentAddress: "Not Assigned",
  // currentAddress: "Not Assigned",
  // bankDetails: {
  //   accountNumber:"Not Assigned",
  //   bankName: "Not Assigned",
  //   ifscCode: "Not Assigned",
  //   branchName: "Not Assigned",
  //   adharNumber: "Not Assigned",
  //   panNumber: "Not Assigned",  

  // },
//   bloodGroup: "Not Assigned",
//   nationality: "Not Assigned",
//   secondaryeducation: {
//     tenth: {
//       schoolName: "Not Assigned",
//       yearOfPassing: "Not Assigned",
//       percentage: "Not Assigned", 
//       board: "Not Assigned",
//   },
//   twelfth: {
//       schoolName: "Not Assigned", 
//       yearOfPassing: "Not Assigned",
//       percentage: "Not Assigned",
//       board: "Not Assigned",
//   },
// },
// graduation: {
//     collegeName: "Not Assigned",  
//     graduationYear: "Not Assigned",
//     percentage: "Not Assigned",
//   CGPA: "Not Assigned",
//   Backlogs: "Not Assigned",
// },
//   maritalStatus: "Not Assigned",      
//   dateOfMarriage: "Not Assigned",
//   documents: {
//     resume: "Not Assigned",
//     signature: "Not Assigned",
//   },
  
})
console.log("hello22222")
  // Create leave data for the user
const leaveData=await LeaveInfo.create({
  availableLeave: 2,
  creditLeave: 0,
  extraLeave: 0,
  totalLeave: 0,
})

// Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      accountType: accountType,
      employeeId: employeeId,
      leaveDetails: leaveData._id,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}${lastName}`,
    })
    return res.status(200).json({
      success: true,
      user,
      message: "User registered successfully",
    })

    } catch (error) {
        console.error(error)
    return res.status(500).json({
      success: false,
      message: "User cannot be registered. Please try again.",
    })
    }
}

exports.login=async(req,res)=>{
    try {
        const {email,password}=req.body
        if (!email || !password) {
        return res.status(400).json({
        success: false,
        message: `Please Fill up All the Required Fields`,
      })
    }
    const user = await User.findOne({ email })

    // If user not found with provided email
    if (!user) {
      // Return 401 Unauthorized status code with error message
      return res.status(401).json({
        success: false,
        message: `User is not Registered with Us Please SignUp to Continue`,
      })
    }
    //genrate JWT token and compare password
    if(await bcrypt.compare(password,user.password)){
        const token=jwt.sign(
            { email: user.email, id: user._id, accountType: user.accountType },
        process.env.JWT_SECRET,
        {
          expiresIn: "24h",
        }
        )
        user.token = token
        user.password = undefined
        // Set cookie for token and return success response
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      }
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: `User Login Success`,
      })  
    }
    else{
        return res.status(401).json({
        success: false,
        message: `Password is incorrect`,
      })
    }

    } catch (error) {
        console.error(error)
    // Return 500 Internal Server Error status code with error message
    return res.status(500).json({
      success: false,
      message: `Login Failure Please Try Again`,
    })
    }
}

exports.sendotp=async(req,res)=>{
    try {
    const { email } = req.body
    const checkUserPresent = await User.findOne({ email })
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: `User is Already Registered`,
      })
    }
     var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    })
    const result = await OTP.findOne({ otp: otp })
    console.log("Result is Generate OTP Func")
    console.log("OTP", otp)
    console.log("Result", result)
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      })
      result = await OTP.findOne({ otp: otp })
    }
    const otpPayload = { email, otp }
    const otpBody = await OTP.create(otpPayload)
    console.log("OTP Body", otpBody)
    res.status(200).json({
      success: true,
      message: `OTP Sent Successfully`,
      otp,
    })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ success: false, error: error.message })
    }
}

exports.varifyemail=async(req,res)=>{
  try {
    const {email,otp}=req.body
    const otpresponse=await OTP.find({email}).sort({ createdAt: -1 }).limit(1)
    console.log(otpresponse)
    console.log("hellow")
    if (otpresponse.length === 0) {
      // OTP not found for the email
      return res.status(400).json({
        success: false,
        message: "The OTP is not valid",
      })
    } else if (otp !== otpresponse[0].otp) {
      // Invalid OTP
      return res.status(400).json({
        success: false,
        message: "The OTP is not valid",
      })
    }
    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    })
    
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Error verifying email. Please try again.",
    })
  }
}

exports.changePassword = async (req, res) => {
  try {
    // Get user data from req.user
    const userDetails = await User.findById(req.user.id)

    // Get old password, new password, and confirm new password from req.body
    const { oldPassword, newPassword } = req.body

    // Validate old password
    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      userDetails.password
    )
    if (!isPasswordMatch) {
      // If old password does not match, return a 401 (Unauthorized) error
      return res
        .status(401)
        .json({ success: false, message: "The password is incorrect" })
    }

    // Update password
    const encryptedPassword = await bcrypt.hash(newPassword, 10)
    const updatedUserDetails = await User.findByIdAndUpdate(
      req.user.id,
      { password: encryptedPassword },
      { new: true }
    )

    // Send notification email
    try {
      const emailResponse = await mailSender(
        updatedUserDetails.email,
        "Password for your account has been updated",
        passwordUpdated(
          updatedUserDetails.email,
          `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
        )
      )
      console.log("Email sent successfully:", emailResponse.response)
    } catch (error) {
      // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
      console.error("Error occurred while sending email:", error)
      return res.status(500).json({
        success: false,
        message: "Error occurred while sending email",
        error: error.message,
      })
    }

    // Return success response
    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" })
  } catch (error) {
    // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
    console.error("Error occurred while updating password:", error)
    return res.status(500).json({
      success: false,
      message: "Error occurred while updating password",
      error: error.message,
    })
  }
}

exports.logout = async (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,         // use true if using HTTPS
      sameSite: "None",     // or 'Lax' depending on frontend setup
    });

    // Return success response
    return res.status(200).json({
      success: true,
      message: "User logged out successfully",
    })
  } catch (error) {
    // If there's an error during logout, log the error and return a 500 (Internal Server Error) error
    console.error("Error occurred during logout:", error)
    return res.status(500).json({
      success: false,
      message: "Error occurred during logout",
      error: error.message,
    })
  }
}

exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body

    // Validate input
    if (!email || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email and new password are required",
      })
    }

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update user's password
    user.password = hashedPassword
    await user.save()

    // Send notification email
    try {
      const emailResponse = await mailSender(
        user.email,
        "Your password has been reset",
        passwordUpdated(
          user.email,
          `Your password has been successfully reset.`
        )
      )
      console.log("Email sent successfully:", emailResponse.response)
    } catch (error) {
      console.error("Error occurred while sending email:", error)
      return res.status(500).json({
        success: false,
        message: "Error occurred while sending email",
        error: error.message,
      })
    }

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    })
  } catch (error) {
    console.error("Error occurred while resetting password:", error)
    return res.status(500).json({
      success: false,
      message: "Error occurred while resetting password",
      error: error.message,
    })
  }
}
  