const mongoose = require("mongoose");

const UserMetricsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: Date,
  weight: Number,
  caloriesConsumed: Number,
  workoutsDone: Number,
  goalProgress: Number,
});

const WorkoutAnalyticsSchema = new mongoose.Schema({
  workoutType: String,
  totalUsers: Number,
  averageCompletionRate: Number,
  popularityScore: Number,
  date: Date,
});

const DietAnalyticsSchema = new mongoose.Schema({
  dietType: String,
  totalUsers: Number,
  averageAdherence: Number,
  popularityScore: Number,
  date: Date,
});

const UserMetrics = mongoose.model("UserMetrics", UserMetricsSchema);
const WorkoutAnalytics = mongoose.model(
  "WorkoutAnalytics",
  WorkoutAnalyticsSchema
);
const DietAnalytics = mongoose.model("DietAnalytics", DietAnalyticsSchema);

module.exports = {
  UserMetrics,
  WorkoutAnalytics,
  DietAnalytics,
};
