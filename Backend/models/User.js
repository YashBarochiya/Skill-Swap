const mongoose = require("mongoose");
const bcrypt = require("bcrypt")

const userSchema = mongoose.Schema({
    name:{type:String, requried:true},
    email:{type:String, requried:true , unique : true},
    password:{type:String, requried:true},
    role: { type: String, enum: ["user", "admin"], default: "user" },

    // For Google OAuth
    googleId: { type: String },

    // For password reset
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },

    isBanned: {type: Boolean,default: false},
    createdAt:{type:Date, default:Date.now}
});



module.exports = mongoose.model("User",userSchema); 
