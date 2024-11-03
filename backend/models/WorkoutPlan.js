const mongoose = require("mongoose");

const workoutPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  planId: {
    type: String,
    required: true,
  },
  exercises: [
    {
      name: {
        type: String,
        required: true,
      },
      sets: {
        type: Number,
        required: true,
      },
      reps: {
        type: Number,
        required: true,
      },
      duration: {
        type: Number,
        required: true, // in minutes
      },
    },
  ],
});

const WorkoutPlan = mongoose.model("WorkoutPlan", workoutPlanSchema);
module.exports = WorkoutPlan;
