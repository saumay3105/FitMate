const User = require("../models/User");
const CalorieTracker = require("../models/Calories");

const calorieTrackerController = {
  async getCalorieTracker(req, res) {
    try {
      const { email } = req.params;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const savedCalorieTracker = await CalorieTracker.findOne({ email });
      if (savedCalorieTracker) {
        return res.json(savedCalorieTracker);
      }

      const newCalorieTracker = new CalorieTracker({
        email: user.email,
        foods: [],
        dailyTotalCalories: 0,
        dailyTargetCalories: 2000,
      });
      await newCalorieTracker.save();
      res.json(newCalorieTracker);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async addFood(req, res) {
    try {
      const { email, name, calories } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const calorieTracker = await CalorieTracker.findOneAndUpdate(
        { email },
        {
          $push: { foods: { name, calories } },
          $inc: { dailyTotalCalories: calories },
        },
        { new: true }
      );

      if (!calorieTracker) {
        return res.status(404).json({ message: "Calorie tracker not found" });
      }

      res.status(201).json(calorieTracker);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async deleteFood(req, res) {
    try {
      const { email, name, calories } = req.body;
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // First find the tracker to verify the food exists
      const tracker = await CalorieTracker.findOne({ email });
      const foodToDelete = tracker.foods.find(
        (f) => f.name === name && f.calories === calories
      );
  
      if (!foodToDelete) {
        return res.status(404).json({ message: "Food item not found" });
      }
  
      // Now update with the specific food item
      const calorieTracker = await CalorieTracker.findOneAndUpdate(
        { email },
        {
          $pull: { foods: { name: name, calories: calories } }, // Match both name and calories
          $inc: { dailyTotalCalories: -Math.abs(calories) }, // Use Math.abs to ensure positive number
        },
        { new: true }
      );
  
      if (!calorieTracker) {
        return res.status(404).json({ message: "Calorie tracker not found" });
      }
  
      res.status(200).json(calorieTracker);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  


  async updateTargetCalories(req, res) {
    try {
      const { email, dailyTargetCalories } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const calorieTracker = await CalorieTracker.findOneAndUpdate(
        { email },
        { dailyTargetCalories },
        { new: true }
      );

      if (!calorieTracker) {
        return res.status(404).json({ message: "Calorie tracker not found" });
      }

      res.json(calorieTracker);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async resetCalorieTracker(req, res) {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      await CalorieTracker.findOneAndUpdate(
        { email },
        { foods: [], dailyTotalCalories: 0 },
        { new: true }
      );

      res.json({ message: "Calorie tracker reset successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = calorieTrackerController;
