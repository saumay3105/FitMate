const express = require("express");
const router = express.Router();
const calorieTrackerController = require("../controllers/calorieTrackerController");

router.get("/tracker/:email", calorieTrackerController.getCalorieTracker);
router.post("/tracker/add-food", calorieTrackerController.addFood);
router.delete(
  "/tracker/delete-food",
  calorieTrackerController.deleteFood
);
router.put(
  "/tracker/update-target",
  calorieTrackerController.updateTargetCalories
);
router.post("/tracker/reset", calorieTrackerController.resetCalorieTracker);

module.exports = router;
