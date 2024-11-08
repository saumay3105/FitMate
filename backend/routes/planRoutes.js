// routes/planRoutes.js
const express = require("express");
const router = express.Router();
const planController = require("../controllers/planController");

router.get("/workout/:email", planController.getWorkoutPlan);
router.post("/workout", planController.saveWorkoutPlan);
router.put("/workout", planController.updateWorkoutPlan);
router.get("/workout/:email/day/:day", planController.getDayWorkout);

router.get("/diet/:email", planController.getDietPlan);
router.post("/diet", planController.saveDietPlan);
router.put("/diet", planController.updateDietPlan);

module.exports = router;
