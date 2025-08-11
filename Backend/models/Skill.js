const mongoose = require("mongoose");

const skillSchema = mongoose.Schema({
    name:{type:String, required:true},
    user:{type:mongoose.Schema.Types.ObjectId, ref:"User", required:true},
    description: String,
    level:{type: String, enum:["Beginner","Intermediate","Expert"], requried:true},
    createdAt:{type:Date, default:Date.now}
})