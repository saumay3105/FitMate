const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  email: {
    type: String,
    ref: "User", // Reference to User model using email instead of userId
    required: true,
    unique: true, // Email should be unique
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  weight: {
    type: Number, // User's weight at the time of entry
  },
  bodyFatPercentage: {
    type: Number, // User's body fat percentage at the time of entry
  },
  muscleMass: {
    type: Number, // User's muscle mass at the time of entry (if available)
  },
  workoutsCompleted: [
    {
      workoutPlanId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "WorkoutPlan",
        required: true,
      },
      exercises: [
        {
          exerciseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "WorkoutPlan.exercises", // Reference to specific exercise
            required: true,
          },
          name: {
            type: String,
            required: true,
          },
          setsCompleted: {
            type: Number,
            default: 0,
          },
          repsCompleted: {
            type: Number,
            default: 0,
          },
          durationCompleted: {
            type: Number,
            default: 0,
          },
          isCompleted: {
            type: Boolean,
            default: false,
          },
        },
      ],
    },
  ],
  dietPlansFollowed: [
    {
      dietPlanId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DietPlan",
        required: true,
      },
      meals: [
        {
          mealType: {
            type: String,
            enum: ["breakfast", "lunch", "dinner", "snack"],
            required: true,
          },
          isCompleted: {
            type: Boolean,
            default: false, // Marks if the meal was completed as per diet plan
          },
        },
      ],
    },
  ],
  notes: {
    type: String, // Any additional notes (e.g., energy levels, mood)
  },
});

const Progress = mongoose.model("Progress", progressSchema);
module.exports = Progress;
