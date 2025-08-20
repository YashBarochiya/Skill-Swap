const mongoose = require("mongoose");

const skillSchema = mongoose.Schema({
    name:{type:String, required:true},
    description: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    level:{type: String, enum:["Beginner","Intermediate","Expert"], requried:true},
    createdAt:{type:Date, default:Date.now}
})

module.exports = mongoose.model("Skill", skillSchema);