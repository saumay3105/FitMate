const User = require("../models/User");

const userController = {
  async createUser(req, res) {
    try {
      const { email, age, weight, height, fitnessGoals, dietaryPreferences } =
        req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const user = new User({
        email,
        age,
        weight,
        height,
        fitnessGoals,
        dietaryPreferences,
      });

      await user.save();
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async updateUser(req, res) {
    try {
      const { email } = req.params;
      const updates = req.body;

      const user = await User.findOneAndUpdate({ email }, updates, {
        new: true,
        runValidators: true,
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getUser(req, res) {
    try {
      const { email } = req.params;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = userController;
