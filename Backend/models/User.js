const mongoose = require("mongoose");


const userSchema = mongoose.Schema({
    name:{type:String, requried:true},
    email:{type:String, requried:true},
    password:{type:String, requried:true},
    skills:[{type:mongoose.Schema.Types.ObjectId, ref:"Skill"}],
    createdAt:{type:Date, default:Date.now}
})

module.exports = mongoose.model("User",userSchema); 
