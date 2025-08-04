const express=require('express')
const router=express.Router()
const { perchaseItem,getAllPerchaseItem,deletePerchaseItem,updatePerchaseItem } = require('../../controller/PerchaseOrder/Perchase')

router.post('/perchaseOrder', perchaseItem)
router.get('/getAllPerchaseItem', getAllPerchaseItem)
router.delete('/deletePerchaseItem', deletePerchaseItem)
router.put('/updatePerchaseItem', updatePerchaseItem)
module.exports = router;