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

const DietPlan = mongoose.model("DietPlan", dietPlanSchema);
module.exports = DietPlan;
