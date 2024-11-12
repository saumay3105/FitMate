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

const CalorieTracker = mongoose.model("CalorieTracker", calorieTrackerSchema);
module.exports = CalorieTracker;
