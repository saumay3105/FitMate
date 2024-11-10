const User = require("../models/User");
const WorkoutPlan = require("../models/WorkoutPlan");
const DietPlan = require("../models/DietPlan");
const geminiService = require("../utils/geminiService");

const planController = {
  async getWorkoutPlan(req, res) {
    try {
      const { email } = req.params;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const savedWorkoutPlan = await WorkoutPlan.findOne({ email });
      if (savedWorkoutPlan) {
        return res.json(savedWorkoutPlan);
      }

      const workoutPlan = await geminiService.generateWorkoutPlan(user);
      const newWorkoutPlan = new WorkoutPlan({
        email: user.email,
        planId: workoutPlan.planId,
        weeklySchedule: workoutPlan.weeklySchedule,
        startDate: workoutPlan.startDate,
        endDate: workoutPlan.endDate,
      });
      await newWorkoutPlan.save();
      res.json(newWorkoutPlan);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getWorkoutPlans(req, res) {
    try {
      const { email } = req.params;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const workoutPlans = await WorkoutPlan.find({ email });
      res.json(workoutPlans);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async saveWorkoutPlan(req, res) {
    try {
      const { email, weeklySchedule, startDate, endDate } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const workoutPlan = new WorkoutPlan({
        email: user.email,
        planId: `workout-${user.email}-${Date.now()}`,
        weeklySchedule,
        startDate,
        endDate,
      });
      await workoutPlan.save();
      res.status(201).json(workoutPlan);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async updateWorkoutPlan(req, res) {
    try {
      const { email, planId, weeklySchedule, startDate, endDate } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const workoutPlan = await WorkoutPlan.findOneAndUpdate(
        { email, planId },
        { weeklySchedule, startDate, endDate },
        { new: true }
      );

      if (!workoutPlan) {
        return res.status(404).json({ message: "Workout plan not found" });
      }

      res.json(workoutPlan);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getDayWorkout(req, res) {
    try {
      const { email, day } = req.params;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const workoutPlan = await WorkoutPlan.findOne({ email });
      if (!workoutPlan) {
        return res.status(404).json({ message: "Workout plan not found" });
      }

      const dayWorkout = workoutPlan.weeklySchedule[day.toLowerCase()];
      if (!dayWorkout) {
        return res.status(404).json({ message: "Invalid day" });
      }

      res.json({
        day,
        exercises: dayWorkout,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getDietPlan(req, res) {
    try {
      const { email } = req.params;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const savedDietPlan = await DietPlan.findOne({ email });
      if (savedDietPlan) {
        return res.json(savedDietPlan);
      }

      const dietPlan = await geminiService.generateDietPlan(user);

      const newDietPlan = new DietPlan({
        email: user.email,
        planId: dietPlan.planId,
        meals: dietPlan.meals,
        dailyTotalMacros: dietPlan.dailyTotalMacros, 
      });

      await newDietPlan.save();
      res.json(newDietPlan);
    } catch (error) {
      console.error("Diet plan error:", error);
      res.status(500).json({ message: error.message });
    }
  },

  async getDietPlans(req, res) {
    try {
      const { email } = req.params;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const dietPlans = await DietPlan.find({ email });
      res.json(dietPlans);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async saveDietPlan(req, res) {
    try {
      const { email, meals } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

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

      const dietPlan = new DietPlan({
        email: user.email,
        planId: `diet-${user.email}-${Date.now()}`,
        meals,
        dailyTotalMacros,
      });

      await dietPlan.save();
      res.status(201).json(dietPlan);
    } catch (error) {
      console.error("Save diet plan error:", error);
      res.status(500).json({ message: error.message });
    }
  },

  async updateDietPlan(req, res) {
    try {
      const { email, planId, meals } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

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

      const dietPlan = await DietPlan.findOneAndUpdate(
        { email, planId },
        { meals, dailyTotalMacros },
        { new: true }
      );

      if (!dietPlan) {
        return res.status(404).json({ message: "Diet plan not found" });
      }

      res.json(dietPlan);
    } catch (error) {
      console.error("Update diet plan error:", error);
      res.status(500).json({ message: error.message });
    }
  },

  _calculateDailyTotalMacros(meals) {
    return meals.reduce(
      (acc, meal) => ({
        calories: acc.calories + (Number(meal.calories) || 0),
        proteins: acc.proteins + (Number(meal.macros.proteins) || 0),
        carbohydrates:
          acc.carbohydrates + (Number(meal.macros.carbohydrates) || 0),
        fats: acc.fats + (Number(meal.macros.fats) || 0),
      }),
      { calories: 0, proteins: 0, carbohydrates: 0, fats: 0 }
    );
  },

  async regenerateWorkoutPlan(req, res) {
    try {
      const { email, additionalComment } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      await WorkoutPlan.findOneAndDelete({ email });

      const workoutPlan = await geminiService.generateWorkoutPlan(
        user,
        additionalComment
      );
      const newWorkoutPlan = new WorkoutPlan({
        email: user.email,
        planId: workoutPlan.planId,
        weeklySchedule: workoutPlan.weeklySchedule,
        startDate: workoutPlan.startDate,
        endDate: workoutPlan.endDate,
      });

      await newWorkoutPlan.save();
      res.json(newWorkoutPlan);
    } catch (error) {
      console.error("Regenerate workout plan error:", error);
      res.status(500).json({ message: error.message });
    }
  },

  async regenerateDietPlan(req, res) {
    try {
      const { email, additionalComment } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      await DietPlan.findOneAndDelete({ email });

      const dietPlan = await geminiService.generateDietPlan(
        user,
        additionalComment
      );

      const newDietPlan = new DietPlan({
        email: user.email,
        planId: dietPlan.planId,
        meals: dietPlan.meals,
        dailyTotalMacros: dietPlan.dailyTotalMacros,
      });

      await newDietPlan.save();
      res.json(newDietPlan);
    } catch (error) {
      console.error("Regenerate diet plan error:", error);
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = planController;
