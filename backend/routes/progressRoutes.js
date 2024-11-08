const express = require("express");
const router = express.Router();
const progressController = require("../controllers/progressController");

router.post("/", progressController.createProgress);
router.get("/:email", progressController.getProgressByUser); 
router.put("/:id", progressController.updateProgress);

module.exports = router;
