// routes/messageRoutes.js
const express = require("express");
const { getAllUsers, banUser, unbanUser, getUserbyID, addCategory, updateCategory, deleteCategory, getAllCategories, getCategory } = require("../controllers/admincontroller");
const {authMiddleware, authorizeRoles}= require("../middleware/authmiddleware");

const router = express.Router();

//get all user model data
router.get("/users", authMiddleware, authorizeRoles, getAllUsers);

//ban the user
router.patch("/users/:id/ban", authMiddleware, authorizeRoles, banUser);

//fetch all the details related to user
router.get("/user/:id",authMiddleware, authorizeRoles, getUserbyID)

//unban the user
router.patch("/users/:id/unban", authMiddleware, authorizeRoles, unbanUser);

//add the category
router.post("/add-category", authMiddleware, authorizeRoles, addCategory);

// update the category
router.put("/update-category/:id", authMiddleware, authorizeRoles, updateCategory);

//get all the category 
router.get("/categories",authMiddleware,getAllCategories)


//get category by id
router.get("/category/:id",authMiddleware,getCategory)
//delete the category
router.delete("/delete-category/:name", authMiddleware, authorizeRoles, deleteCategory);

module.exports = router;