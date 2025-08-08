const mongoose = require("mongoose");

const calorieTrackerSchema = new mongoose.Schema({
  email: {
    type: String,
    ref: "User",
    required: true,
  },
  foods: [
    {
      name: {
        type: String,
        required: true,
      },
      calories: {
        type: Number,
        required: true,
      },
    },
  ],
  dailyTotalCalories: {
    type: Number,
    required: true,
  },
  dailyTargetCalories: {
    type: Number,
    required: true,
  },
});

// Create indexes for frequently queried fields
calorieTrackerSchema.index({ email: 1 }); // User email lookup
calorieTrackerSchema.index({ dailyTotalCalories: 1 }); // Total calories queries
calorieTrackerSchema.index({ dailyTargetCalories: 1 }); // Target calories queries
calorieTrackerSchema.index({ email: 1, dailyTotalCalories: 1 }); // Compound index for user's calorie tracking
calorieTrackerSchema.index({ "foods.name": 1 }); // Food name lookup

const CalorieTracker = mongoose.model("CalorieTracker", calorieTrackerSchema);
module.exports = CalorieTracker;
