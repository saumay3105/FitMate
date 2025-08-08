const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  age: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  fitnessGoals: {
    type: [String],
    enum: [
      "weight loss",
      "muscle gain",
      "maintain weight",
      "increase endurance",
    ],
    required: true,
  },
  dietaryPreferences: {
    type: [String],
    enum: [
      "vegetarian",
      "non-vegetarian",
      "vegan",
      "gluten-free",
      "lactose-free",
      "none",
    ],
    required: true,
  },
});

// Create indexes for frequently queried fields
userSchema.index({ email: 1 }, { unique: true }); // Email lookup
userSchema.index({ fitnessGoals: 1 }); // Fitness goals queries
userSchema.index({ dietaryPreferences: 1 }); // Dietary preferences queries
userSchema.index({ weight: 1, height: 1 }); // Compound index for physical attributes

const User = mongoose.model("User", userSchema);
module.exports = User;
