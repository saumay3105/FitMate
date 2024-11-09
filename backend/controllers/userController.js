const User = require("../models/User");

const userController = {
  // Create a new user
  async createUser(req, res) {
    try {
      const {
        fullName,
        email,
        age,
        weight,
        height,
        fitnessGoals,
        dietaryPreferences,
      } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Create and save the new user
      const user = new User({
        fullName,
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

  // Update an existing user
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

  // Get a user by email
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
