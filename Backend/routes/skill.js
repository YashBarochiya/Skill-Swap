const express = require("express");
const { addSkill, getUserSkills, updateSkill, deleteSkill, getSkill,addlearnSkill,deletelearnSkill} = require("../controllers/skillcontroller");
const { authMiddleware, authorizeRoles } = require("../middleware/authmiddleware");
const router = express.Router();

router.get("/user/:id",authMiddleware,getSkill);
router.post("/add-skill",authMiddleware,addSkill);
router.get("/:userId", getUserSkills);  
router.put("/update/:id",authMiddleware, updateSkill);       
router.delete("/delete/:id",authMiddleware, deleteSkill);


//not really needed because it is present in profile-update
router.post("/add-learnskill",authMiddleware,addlearnSkill);
router.delete("/delete-learnskill",authMiddleware,deletelearnSkill);
module.exports = router;

