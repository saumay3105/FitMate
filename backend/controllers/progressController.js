const Progress = require("../models/Progress");

const progressController = {
  async createProgress(req, res) {
    try {
      const progress = new Progress(req.body);
      await progress.save();
      res.status(201).json(progress);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getProgressByUser(req, res) {
    try {
      const { email } = req.params; 
      const progress = await Progress.find({ email }).sort({ date: -1 });

      if (!progress.length) {
        return res.status(404).json({ message: "No progress data found" });
      }

      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async updateProgress(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      console.log("ID:", id);

      const progress = await Progress.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      });

      if (!progress) {
        return res.status(404).json({ message: "Progress not found" });
      }

      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = progressController;
