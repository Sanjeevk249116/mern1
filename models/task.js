const mongoose=require("mongoose");

const TaskSchema=mongoose.Schema({
    title:{type:String,required:true},
    position:{type:String,required:true},
    category:{type:String,required:true},
    rank:{type:String,required:true},
    content:{type:String,required:true},
    heading:{type:String,required:true},
    user_Id:{type:String,required:true},

})

const TaskModel=mongoose.model("tasknew",TaskSchema)

module.exports={TaskModel}