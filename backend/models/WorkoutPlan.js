const mongoose = require("mongoose");

const workoutPlanSchema = new mongoose.Schema({
  email: {
    type: String,
    ref: "User",
    required: true,
  },
  planId: {
    type: String,
    required: true,
  },
  weeklySchedule: {
    monday: [
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
          required: true,
        },
      },
    ],
    tuesday: [
      {
        name: String,
        sets: Number,
        reps: Number,
        duration: Number,
      },
    ],
    wednesday: [
      {
        name: String,
        sets: Number,
        reps: Number,
        duration: Number,
      },
    ],
    thursday: [
      {
        name: String,
        sets: Number,
        reps: Number,
        duration: Number,
      },
    ],
    friday: [
      {
        name: String,
        sets: Number,
        reps: Number,
        duration: Number,
      },
    ],
    saturday: [
      {
        name: String,
        sets: Number,
        reps: Number,
        duration: Number,
      },
    ],
    sunday: [
      {
        name: String,
        sets: Number,
        reps: Number,
        duration: Number,
      },
    ],
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
  },
});

const WorkoutPlan = mongoose.model("WorkoutPlan", workoutPlanSchema);
module.exports = WorkoutPlan;
