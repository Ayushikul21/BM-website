// Import the required modules
const express = require("express")
const router = express.Router()

// Import the required controllers and middleware functions
const {
  login,
  signup,
  sendotp,
varifyemail,
changePassword

} = require("../../controller/Leavecontroller/Auth")

const { auth } = require("../../midlewere/Auth")

// Routes for Login, Signup, and Authentication

// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************

router.post("/login", login)
router.post("/signup", signup)
router.post("/sendotp", sendotp)
router.post("/verifyotp", varifyemail)
router.post("/changepassword", auth, changePassword)

// Export the router for use in the main application
module.exports = router