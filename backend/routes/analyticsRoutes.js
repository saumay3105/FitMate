const express = require("express");
const router = express.Router();
const User = require("../models/User");
const WorkoutPlan = require("../models/WorkoutPlan");
const DietPlan = require("../models/DietPlan");
const CalorieTracker = require("../models/Calories");

// Get user metrics
router.get("/user/:userId", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const calorieData = await CalorieTracker.find({ email: req.params.userId })
      .sort({ _id: -1 })
      .limit(1);

    const workoutData = await WorkoutPlan.find({ email: req.params.userId });

    const metrics = {
      weight: user.weight,
      caloriesConsumed: calorieData[0]?.dailyTotalCalories || 0,
      workoutsDone: workoutData.length,
      goalProgress: calculateGoalProgress(user, workoutData),
      date: new Date(),
    };

    res.json([metrics]); // Wrap in array to match frontend expectations
  } catch (error) {
    console.error("Error in /user/:userId:", error);
    res.status(500).json({ message: error.message });
  }
});

// Get workout analytics
router.get("/workouts", async (req, res) => {
  try {
    const workoutData = await WorkoutPlan.aggregate([
      {
        $group: {
          _id: "$planId",
          totalUsers: { $sum: 1 },
          popularityScore: { $sum: 1 },
        },
      },
      {
        $project: {
          workoutType: "$_id",
          totalUsers: 1,
          popularityScore: 1,
          date: new Date(),
        },
      },
      { $sort: { popularityScore: -1 } },
      { $limit: 10 },
    ]);

    res.json(workoutData);
  } catch (error) {
    console.error("Error in /workouts:", error);
    res.status(500).json({ message: error.message });
  }
});

// Get diet analytics
router.get("/diets", async (req, res) => {
  try {
    const dietData = await DietPlan.aggregate([
      {
        $group: {
          _id: "$planId",
          totalUsers: { $sum: 1 },
          popularityScore: { $sum: 1 },
        },
      },
      {
        $project: {
          dietType: "$_id",
          totalUsers: 1,
          popularityScore: 1,
          date: new Date(),
        },
      },
      { $sort: { popularityScore: -1 } },
      { $limit: 10 },
    ]);

    res.json(dietData);
  } catch (error) {
    console.error("Error in /diets:", error);
    res.status(500).json({ message: error.message });
  }
});

// Get user progress metrics
router.get("/progress/:userId", async (req, res) => {
  try {
    // Get user's weight history (we'll simulate this with current weight)
    const user = await User.findOne({ email: req.params.userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get calorie history
    const calorieHistory = await CalorieTracker.find({
      email: req.params.userId,
    })
      .sort({ _id: -1 })
      .limit(7);

    // Create progress data points
    const progressData = calorieHistory.map((entry) => ({
      date: entry._id.getTimestamp(),
      weight: user.weight, // Using current weight as we don't have historical data
      caloriesConsumed: entry.dailyTotalCalories,
    }));

    res.json(progressData);
  } catch (error) {
    console.error("Error in /progress/:userId:", error);
    res.status(500).json({ message: error.message });
  }
});

// Helper function to calculate goal progress
function calculateGoalProgress(user, workouts) {
  // Simple progress calculation based on number of workouts
  // You can make this more sophisticated based on your requirements
  const targetWorkouts = 20; // Example target
  const progress = (workouts.length / targetWorkouts) * 100;
  return Math.min(Math.round(progress), 100);
}

module.exports = router;
