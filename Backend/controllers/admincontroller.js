const Profile = require("../models/Profile");
const Category = require("../models/Category");
const Swap = require("../models/Swap");
const User = require("../models/User");
const Review = require("../models/Review")
const { deleteSkill } = require("./skillcontroller");
const SwapRequest = require("../models/SwapRequest");

exports.getAllUsers = async (req, res) => {
  try {
    const user = await User.find().select("-password");
    res.status(200).json({ message: "Successful", user });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.banUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBanned: true },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User banned successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.unbanUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBanned: false },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User unbanned successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};


// user whole details
exports.getUserbyID = async (req, res) => {
  try {
    const id = req.params.id;
    const profiledata = await Profile.findOne({ user: id })
      .populate("user", "name email")
      .populate({
        path: "teachSkills", // first populate teachSkills
        select: "name description level category",
        populate: {
          path: "category", // then populate the category inside teachSkills
          select: "name description", // pick only fields you need
        },
      })
      .select("-_id");
    if (!profiledata)
      return res.status(404).json({ message: "Profile not found" });



    const swaps = await Swap.find({
      $or: [{ fromUser: id }, { toUser: id }],
    })
      .populate("fromUser", "name email")
      .populate("toUser", "name email")
      .populate({
        path: "skillFromUser1",
        select: "-_id -user",
        populate: { path: "category", select: "name description" },
      })
      .populate({
        path: "skillFromUser2",
        select: "-_id -user",
        populate: { path: "category", select: "name description" },
      })
      .populate("agreementConfirmedBy", "name email")
      .populate("completedBy", "name email");



    const sentReq = await SwapRequest
      .find({ fromUser: id })
      .populate("fromUser", "name email")
      .populate("toUser", "name email")
      .populate({
        path: "offeredSkill",
        select: "name level description category",
        populate: {
          path: "category", // then populate the category inside teachSkills
          select: "name description", // pick only fields you need
        },
      })
      .populate({
        path: "requestedSkill",
        select: "name level description category",
        populate: {
          path: "category", // then populate the category inside teachSkills
          select: "name description", // pick only fields you need
        },
      })
      .select("-_id");

const receiveReq = await SwapRequest
      .find({ toUser: id })
      .populate("fromUser", "name email")
      .populate("toUser", "name email")
      .populate({
        path: "offeredSkill",
        select: "name level description category",
        populate: {
          path: "category", // then populate the category inside teachSkills
          select: "name description", // pick only fields you need
        },
      })
      .populate({
        path: "requestedSkill",
        select: "name level description category",
        populate: {
          path: "category", // then populate the category inside teachSkills
          select: "name description", // pick only fields you need
        },
      })
      .select("-_id");
    const reviewer = await Review.find({reviewer:id})
    .populate("reviewer","name")
    .populate("reviewee","name email")
    .select("-_id");

    const reviewee = await Review.find({reviewee:id})
    .populate("reviewer","name email")
    .populate("reviewee","name")
    .select("-_id");
    res
      .status(200)
      .json({ message: "User Details", profiledata, swaps, sentReq, receiveReq, reviewer, reviewee, });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.getAllCategories = async (req,res)=>{
  try{
    const categories = await Category.find({});
    if(!categories) res.status(204).json({message:"category not available"})
      res.status(200).json({message:"category fetched!!",categories});
  }catch(error){
    res.status(500).json({message:"Server error"});
    console.log(error.message);
  }
}

exports.getCategory = async(req,res)=>{
   try{
    const categories = await Category.findOne({_id:req.params.id});
    if(!categories) res.status(204).json({message:"category not available"})
      res.status(200).json({message:"category fetched!!",categories});
  }catch(error){
    res.status(500).json({message:"Server error"});
    console.log(error.message);
  }
}


exports.addCategory = async (req, res) => {
  try {
    const { name, description, list } = req.body;

    if (!name) res.status(400).json({ message: "name is require" });
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(409).json({ message: "Already Exists" });
    }
    const category = await Category.create({
      name,
      description,
      skills: list,
    });
    await category.save();
    res.status(200).json({ message: "category added" });
  } catch (error) {
    res.status(500).json({
      message: "server error",
    });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params; // category id from URL
    const { name,description, list } = req.body;

    const category = await Category.findOne({ _id:id });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    

    if (description) {
      category.description = description;
    }

    // Ensure category.skills is always an array
    if (!Array.isArray(category.skills)) {
      category.skills = [];
    }
    category.skills=list||[];

    // ✅ Add skills without overwriting old ones
    // if (action === "add" && list && Array.isArray(list)) {
    //   list.forEach((item) => {
    //     if (!category.skills.includes(item)) {
    //       category.skills.push(item);
    //     }
    //   });
    // }

    // // ✅ Remove skills
    // if (action === "remove" && list && Array.isArray(list)) {
    //   category.skills = category.skills.filter((item) => !list.includes(item));
    // }

    await category.save();

    res
      .status(200)
      .json({ message: "Category updated successfully", category });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { name } = req.params; // category id from URL

    const category = await Category.findOneAndDelete({ name });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
