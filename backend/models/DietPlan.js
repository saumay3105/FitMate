const mongoose = require("mongoose");

const dietPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  planId: {
    type: String,
    required: true,
  },
  meals: [
    {
      mealType: {
        type: String,
        enum: ["breakfast", "lunch", "dinner", "snack"],
        required: true,
      },
      foods: [
        {
          type: String,
          required: true,
        },
      ],
      calories: {
        type: Number,
        required: true,
      },
    },
  ],
});

const DietPlan = mongoose.model("DietPlan", dietPlanSchema);
module.exports = DietPlan;
