const mongoose = require("mongoose");

const dietPlanSchema = new mongoose.Schema({
  email: {
    type: String,
    ref: "User",
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
      macros: {
        proteins: {
          type: Number,
          required: true,
        },
        carbohydrates: {
          type: Number,
          required: true,
        },
        fats: {
          type: Number,
          required: true,
        },
      },
    },
  ],
  dailyTotalMacros: {
    calories: {
      type: Number,
      required: true,
    },
    proteins: {
      type: Number,
      required: true,
    },
    carbohydrates: {
      type: Number,
      required: true,
    },
    fats: {
      type: Number,
      required: true,
    },
  },
});

// Create indexes for frequently queried fields
dietPlanSchema.index({ email: 1 }); // User email lookup
dietPlanSchema.index({ planId: 1 }, { unique: true }); // Plan ID lookup
dietPlanSchema.index({ "meals.mealType": 1 }); // Meal type queries
dietPlanSchema.index({ "dailyTotalMacros.calories": 1 }); // Calorie-based queries
dietPlanSchema.index({ email: 1, "dailyTotalMacros.calories": 1 }); // Compound index for user's calorie tracking

const DietPlan = mongoose.model("DietPlan", dietPlanSchema);
module.exports = DietPlan;
