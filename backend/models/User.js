const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
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

const User = mongoose.model("User", userSchema);
module.exports = User;
