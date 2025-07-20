const express=require('express')
const router=express.Router()
const {leaveDetails,creditleave,awailbleset,awailbleReset,userDetails}=require('../../controller/Leavecontroller/Dashboard')
const {auth,isEmployees,isAdmin}=require('../../midlewere/Auth')    

router.post('/leaveDetails',auth,isEmployees,leaveDetails)
//router.get('/getAllleave',getAllleave)
router.get('/userDetails',auth,isEmployees,userDetails)


router.put('/creditleaveInmonth',creditleave)
router.get('/addleaveInmonth',awailbleset)
router.get('/resetleaveInmonth',awailbleReset)
module.exports = router