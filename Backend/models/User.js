const mongoose = require("mongoose");


const userSchema = mongoose.Schema({
    name:{type:String, requried:true},
    email:{type:String, requried:true , unique : true},
    password:{type:String, requried:true},
    role: { type: String, enum: ["user", "admin"], default: "user" },
    createdAt:{type:Date, default:Date.now}
})

module.exports = mongoose.model("User",userSchema); 
