const { GoogleGenerativeAI } = require("@google/generative-ai");

class GeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
  }

  sanitizeJsonString(str) {
    str = str.replace(/```json\s*|\s*```/g, ""); // Remove any markdown formatting
    str = str.trim();
    str = str.replace(/\\([^\w\s])/g, "\\\\$1"); // Escape backslashes correctly
    str = str.replace(/(\w+):/g, '"$1":'); // Ensure keys are in double quotes
    str = str.replace(/'([^']+)'/g, '"$1"'); // Ensure string values are in double quotes
    str = str.replace(/}\s*{/g, "},{"); // Fix broken object boundaries
    str = str.replace(/,\s*$/, ""); // Remove trailing commas

    str = str.replace(/"reps":\s*(\d+)-\d+/g, '"reps": $1');

    return str;
  }

  validateWorkoutPlan(plan, email) {
    if (!plan.planId || !plan.weeklySchedule) {
      throw new Error("Invalid workout plan structure");
    }

    const days = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 28);

    return {
      email,
      planId: plan.planId,
      weeklySchedule: days.reduce((acc, day) => {
        acc[day] = (plan.weeklySchedule[day] || []).map((exercise) => ({
          name: exercise.name || "Rest Day",
          sets: Number(exercise.sets) || 0,
          reps: Number(exercise.reps) || 0,
          duration: Number(exercise.duration) || 0,
        }));
        return acc;
      }, {}),
      startDate,
      endDate,
    };
  }

  calculateDailyTotalMacros(meals) {
    return meals.reduce(
      (acc, meal) => ({
        calories: (acc.calories || 0) + (Number(meal.calories) || 0),
        proteins: (acc.proteins || 0) + (Number(meal.macros?.proteins) || 0),
        carbohydrates:
          (acc.carbohydrates || 0) + (Number(meal.macros?.carbohydrates) || 0),
        fats: (acc.fats || 0) + (Number(meal.macros?.fats) || 0),
      }),
      { calories: 0, proteins: 0, carbohydrates: 0, fats: 0 }
    );
  }

  validateDietPlan(plan, email) {
    if (!plan.planId || !Array.isArray(plan.meals)) {
      throw new Error("Invalid diet plan structure");
    }

    const meals = plan.meals.map((meal) => ({
      mealType: meal.mealType || "snack",
      foods: Array.isArray(meal.foods)
        ? meal.foods
        : [meal.name || "Unnamed Food"],
      calories: Number(meal.calories) || 0,
      macros: {
        proteins: Number(meal.macros?.proteins) || 0,
        carbohydrates: Number(meal.macros?.carbohydrates) || 0,
        fats: Number(meal.macros?.fats) || 0,
      },
    }));

    // Calculate daily totals
    const dailyTotalMacros = meals.reduce(
      (acc, meal) => ({
        calories: acc.calories + (Number(meal.calories) || 0),
        proteins: acc.proteins + (Number(meal.macros.proteins) || 0),
        carbohydrates:
          acc.carbohydrates + (Number(meal.macros.carbohydrates) || 0),
        fats: acc.fats + (Number(meal.macros.fats) || 0),
      }),
      { calories: 0, proteins: 0, carbohydrates: 0, fats: 0 }
    );

    return {
      email,
      planId: plan.planId,
      meals,
      dailyTotalMacros, // Include the calculated totals
    };
  }

  async generateWorkoutPlan(userProfile, additionalComment = "") {
    const prompt = `Generate a comprehensive weekly workout plan in pure JSON format (no markdown, no code blocks) for a user with the following profile:
Age: ${userProfile.age}
Weight: ${userProfile.weight}kg
Height: ${userProfile.height}cm
Fitness Goals: ${userProfile.fitnessGoals.join(", ")}
Additional Requirements: ${additionalComment};

Important: Use single numbers for reps, not ranges.


make sure the response is just json, nothing else, with no syntax errors, make sure array syntax is proper...

The plan should include exercises for each day of the week, considering rest days and muscle group splits. Return only a JSON object with this exact structure (no additional text), make sure the arrays have proper syntax:
{
    "planId": "WP_123",
    "weeklySchedule": {
        "monday": [
            {
                "name": "exercise name here",
                "sets": 3,
                "reps": 10,
                "duration": 5
            }
        ],
        "tuesday": [...],
        "wednesday": [...],
        "thursday": [...],
        "friday": [...],
        "saturday": [...],
        "sunday": [...]
    }
}`;

    try {
      const result = await this.model.generateContent(prompt);
      const responseText = result.response.text();
      console.log("Raw response:", responseText);
      const cleanResponse = this.sanitizeJsonString(responseText);

      let parsedResponse;
      try {
        parsedResponse = JSON.parse(cleanResponse);
      } catch (parseError) {
        throw new Error("JSON parsing error after sanitization");
      }

      const validatedPlan = this.validateWorkoutPlan(
        parsedResponse,
        userProfile.email
      );
      return validatedPlan;
    } catch (error) {
      console.error("Workout plan generation error:", error);
      console.error("Error details:", error.message);

      // Fallback workout plan
      const fallbackPlan = {
        planId: `WP_${Date.now()}`,
        weeklySchedule: {
          monday: [
            {
              name: "Push-ups",
              sets: 3,
              reps: 10,
              duration: 5,
            },
            {
              name: "Squats",
              sets: 3,
              reps: 12,
              duration: 5,
            },
          ],
          tuesday: [{ name: "Rest Day", sets: 0, reps: 0, duration: 0 }],
          wednesday: [
            {
              name: "Pull-ups",
              sets: 3,
              reps: 8,
              duration: 5,
            },
          ],
          thursday: [{ name: "Rest Day", sets: 0, reps: 0, duration: 0 }],
          friday: [
            {
              name: "Deadlifts",
              sets: 3,
              reps: 8,
              duration: 5,
            },
          ],
          saturday: [
            {
              name: "Cardio",
              sets: 1,
              reps: 1,
              duration: 30,
            },
          ],
          sunday: [{ name: "Rest Day", sets: 0, reps: 0, duration: 0 }],
        },
      };

      return this.validateWorkoutPlan(fallbackPlan, userProfile.email);
    }
  }

  async generateDietPlan(userProfile, additionalComment = "") {
    const prompt = `Generate a comprehensive diet plan in pure JSON format (no markdown, no code blocks) for a user with the following profile:
Age: ${userProfile.age}
Weight: ${userProfile.weight}kg
Height: ${userProfile.height}cm
Dietary Preferences: ${userProfile.dietaryPreferences.join(", ")}
Additional Requirements: ${additionalComment};


make sure the dietplan is according to indian diet

follow this schema:
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


The plan should include a variety of balanced meals throughout the day with detailed macro information. Return only a JSON object with this exact structure (no additional text), make sure the arrays have proper syntax:
{
    "planId": "DP_123",
    "meals": [
        {
            "mealType": "breakfast",
            "foods": ["food item 1", "food item 2"],
            "calories": 400,
            "macros": {
                "proteins": 20,
                "carbohydrates": 45,
                "fats": 15
            }
        }
    ]
}`;

    try {
      const result = await this.model.generateContent(prompt);
      const responseText = result.response.text();
      const cleanResponse = this.sanitizeJsonString(responseText);

      let parsedResponse;
      try {
        parsedResponse = JSON.parse(cleanResponse);
      } catch (parseError) {
        throw new Error("JSON parsing error after sanitization");
      }

      const validatedPlan = this.validateDietPlan(
        parsedResponse,
        userProfile.email
      );
      return validatedPlan;
    } catch (error) {
      console.error("Diet plan generation error:", error);
      console.error("Error details:", error.message);

      // Fallback diet plan
      const fallbackPlan = {
        planId: `DP_${Date.now()}`,
        meals: [
          {
            mealType: "breakfast",
            foods: ["Oatmeal", "Banana", "Eggs"],
            calories: 400,
            macros: {
              proteins: 20,
              carbohydrates: 45,
              fats: 15,
            },
          },
          {
            mealType: "lunch",
            foods: ["Grilled Chicken", "Brown Rice", "Steamed Vegetables"],
            calories: 600,
            macros: {
              proteins: 40,
              carbohydrates: 65,
              fats: 20,
            },
          },
          {
            mealType: "dinner",
            foods: ["Salmon", "Sweet Potato", "Broccoli"],
            calories: 500,
            macros: {
              proteins: 35,
              carbohydrates: 50,
              fats: 25,
            },
          },
          {
            mealType: "snack",
            foods: ["Greek Yogurt", "Almonds"],
            calories: 200,
            macros: {
              proteins: 15,
              carbohydrates: 10,
              fats: 12,
            },
          },
        ],
      };

      return this.validateDietPlan(fallbackPlan, userProfile.email);
    }
  }
}

module.exports = new GeminiService();
