const mongoose=require('mongoose');
const perchaseSchema=new mongoose.Schema(
    {
        date:{
            type:String,
            require:true
        },
        description:{
            type:String,
            require:true
        },
        filename:{
            type:String,
            require:true
        },
        ext:{
            type:String,
            require:true
        },
        image:{
            type:String,
     
        }
    },
    {timestamps:true}
)

module.exports = mongoose.model("OrderItem", perchaseSchema);;