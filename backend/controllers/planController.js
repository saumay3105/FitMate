const User = require("../models/User");
const geminiService = require("../utils/geminiService");

const planController = {
  async getWorkoutPlan(req, res) {
    try {
      const { email } = req.params;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const workoutPlan = await geminiService.generateWorkoutPlan(user);
      res.json(workoutPlan);
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

      const dietPlan = await geminiService.generateDietPlan(user);
      res.json(dietPlan);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = planController;
