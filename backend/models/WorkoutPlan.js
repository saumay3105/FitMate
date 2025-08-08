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

// Create indexes for frequently queried fields
workoutPlanSchema.index({ email: 1 }); // User email lookup
workoutPlanSchema.index({ planId: 1 }, { unique: true }); // Plan ID lookup
workoutPlanSchema.index({ startDate: 1, endDate: 1 }); // Date range queries
workoutPlanSchema.index({ "weeklySchedule.monday.name": 1 }); // Exercise name lookup
workoutPlanSchema.index({ email: 1, startDate: -1 }); // Compound index for user's recent workouts

const WorkoutPlan = mongoose.model("WorkoutPlan", workoutPlanSchema);
module.exports = WorkoutPlan;
