const express = require("express");
const router = express.Router();
const planController = require("../controllers/planController");

router.get("/workout/:email", planController.getWorkoutPlan);
router.get("/diet/:email", planController.getDietPlan);

module.exports = router;
