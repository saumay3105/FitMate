const { GoogleGenerativeAI } = require("@google/generative-ai");

class GeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
  }

  async generateWorkoutPlan(userProfile) {
    const prompt = `Generate a workout plan in pure JSON format (no markdown, no code blocks) for:
Age: ${userProfile.age}
Weight: ${userProfile.weight}kg
Height: ${userProfile.height}cm
Fitness Goals: ${userProfile.fitnessGoals.join(", ")}

Return only a JSON object exactly like this (no additional text):
{
    "planId": "WP_123",
    "exercises": [
        {
            "name": "exercise name here",
            "sets": number between 1-5,
            "reps": number between 5-15,
            "duration": number in minutes
        }
    ]
}`;

    try {
      const result = await this.model.generateContent(prompt);
      const cleanResponse = result.response
        .text()
        .replace(/```json\s*|\s*```/g, "")
        .trim();
      return JSON.parse(cleanResponse);
    } catch (error) {
      console.error("Workout plan generation error:", error);
      // Fallback workout plan
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

Return only a JSON object exactly like this (no additional text):
{
    "planId": "DP_123",
    "meals": [
        {
            "mealType": one of ["breakfast", "lunch", "dinner", "snack"],
            "foods": ["food item 1", "food item 2"],
            "calories": total calories for meal,
            "proteins": protein in grams,
            "carbs": carbs in grams,
            "fats": fats in grams
        }
    ]
}`;

    try {
      const result = await this.model.generateContent(prompt);
      const cleanResponse = result.response
        .text()
        .replace(/```json\s*|\s*```/g, "")
        .trim();
      return JSON.parse(cleanResponse);
    } catch (error) {
      console.error("Diet plan generation error:", error);
      // Fallback diet plan
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
