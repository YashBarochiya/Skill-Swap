const express = require("express");
const { addSkill, getUserSkills, updateSkill, deleteSkill, getallSkill,addlearnSkill,deletelearnSkill} = require("../controllers/skillcontroller");
const { authMiddleware, authorizeRoles } = require("../middleware/authmiddleware");
const router = express.Router();

router.get("/list",getallSkill);
router.post("/add",authMiddleware,addSkill);
router.get("/:userId",authMiddleware, getUserSkills);  
router.put("/update/:id",authMiddleware, updateSkill);       
router.delete("/delete/:id",authMiddleware, deleteSkill);
router.post("/add-learnskill",authMiddleware,addlearnSkill);
router.delete("/delete-learnskill",authMiddleware,deletelearnSkill);
module.exports = router;

