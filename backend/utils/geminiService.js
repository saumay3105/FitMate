const { GoogleGenerativeAI } = require("@google/generative-ai");

class GeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
  }

  sanitizeJsonString(str) {
    // Remove any potential markdown code block syntax
    str = str.replace(/```json\s*|\s*```/g, "");

    // Remove any potential whitespace at start/end
    str = str.trim();

    // Handle potential single quotes instead of double quotes
    str = str.replace(/'/g, '"');

    // Try to fix common JSON formatting issues
    str = str.replace(/(\w+):/g, '"$1":'); // Add quotes to property names
    str = str.replace(/\\/g, ""); // Remove any errant backslashes

    return str;
  }

  validateWorkoutPlan(plan) {
    // Basic validation of workout plan structure
    if (!plan.planId || !Array.isArray(plan.exercises)) {
      throw new Error("Invalid workout plan structure");
    }

    return {
      planId: plan.planId,
      exercises: plan.exercises.map((exercise) => ({
        name: exercise.name || "Unnamed Exercise",
        sets: Number(exercise.sets) || 3,
        reps: Number(exercise.reps) || 10,
        duration: Number(exercise.duration) || 5,
      })),
    };
  }

  validateDietPlan(plan) {
    // Basic validation of diet plan structure
    if (!plan.planId || !Array.isArray(plan.meals)) {
      throw new Error("Invalid diet plan structure");
    }

    return {
      planId: plan.planId,
      meals: plan.meals.map((meal) => ({
        mealType: meal.mealType || "snack",
        foods: Array.isArray(meal.foods) ? meal.foods : [],
        calories: Number(meal.calories) || 0,
        proteins: Number(meal.proteins) || 0,
        carbs: Number(meal.carbs) || 0,
        fats: Number(meal.fats) || 0,
      })),
    };
  }

  async generateWorkoutPlan(userProfile) {
    const prompt = `Generate a workout plan in pure JSON format (no markdown, no code blocks) for:
Age: ${userProfile.age}
Weight: ${userProfile.weight}kg
Height: ${userProfile.height}cm
Fitness Goals: ${userProfile.fitnessGoals.join(", ")}

Return only a JSON object with this exact structure (no additional text):
{
    "planId": "WP_123",
    "exercises": [
        {
            "name": "exercise name here",
            "sets": 3,
            "reps": 10,
            "duration": 5
        }
    ]
}`;

    try {
      const result = await this.model.generateContent(prompt);
      const responseText = result.response.text();


      const cleanResponse = this.sanitizeJsonString(responseText);

      const parsedResponse = JSON.parse(cleanResponse);
      const validatedPlan = this.validateWorkoutPlan(parsedResponse);

      return validatedPlan;
    } catch (error) {
      console.error("Workout plan generation error:", error);
      console.error("Error details:", error.message);

      // Fallback workout plan with timestamp-based ID
      return {
        planId: `WP_${Date.now()}`,
        exercises: [
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
      };
    }
  }

  async generateDietPlan(userProfile) {
    const prompt = `Generate a diet plan in pure JSON format (no markdown, no code blocks) for:
Age: ${userProfile.age}
Weight: ${userProfile.weight}kg
Height: ${userProfile.height}cm
Dietary Preferences: ${userProfile.dietaryPreferences.join(", ")}

Return only a JSON object with this exact structure (no additional text):
{
    "planId": "DP_123",
    "meals": [
        {
            "mealType": "breakfast",
            "foods": ["food item 1", "food item 2"],
            "calories": 400,
            "proteins": 20,
            "carbs": 50,
            "fats": 15
        }
    ]
}`;

    try {
      const result = await this.model.generateContent(prompt);
      const responseText = result.response.text();


      const cleanResponse = this.sanitizeJsonString(responseText);

      const parsedResponse = JSON.parse(cleanResponse);
      const validatedPlan = this.validateDietPlan(parsedResponse);

      return validatedPlan;
    } catch (error) {
      console.error("Diet plan generation error:", error);
      console.error("Error details:", error.message);

      // Fallback diet plan with timestamp-based ID
      return {
        planId: `DP_${Date.now()}`,
        meals: [
          {
            mealType: "breakfast",
            foods: ["Oatmeal", "Banana", "Eggs"],
            calories: 400,
            proteins: 20,
            carbs: 50,
            fats: 15,
          },
          {
            mealType: "lunch",
            foods: ["Chicken breast", "Brown rice", "Vegetables"],
            calories: 600,
            proteins: 40,
            carbs: 65,
            fats: 20,
          },
        ],
      };
    }
  }
}

module.exports = new GeminiService();
