const TaskTemplate = require('../../mail/template/TaskTemplate');
const mailSender = require('../../utils/mailSender');
const User = require('../../models/User');
exports.taskmanagement = async (req,res) =>{
 try {
     const tasks = req.body || [];
     const email = req.user.email
     const UserName=await User.findById(req.user.id)
     const name = UserName.firstName + ' ' + UserName.lastName;
    if (!tasks.length) {
        return res.status(400).send('No tasks provided');
    }

    const emailContent = TaskTemplate({tasks,name,email});
    const sendmail = await mailSender(
        "avarvind001@bandymoot.com",
        'Your Assigned Tasks',
        emailContent
        );
    res.status(200).send('Email sent successfully');

 } catch (error) {
    console.error('Error in taskmanagement:', error);
    res.status(500).send('Internal Server Error');
    
 }
} 