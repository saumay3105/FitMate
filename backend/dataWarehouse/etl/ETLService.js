const {
  UserMetrics,
  WorkoutAnalytics,
  DietAnalytics,
} = require("../schemas/AnalyticsSchema");
const User = require("../../models/User");
const WorkoutPlan = require("../../models/WorkoutPlan");
const DietPlan = require("../../models/DietPlan");
const Calories = require("../../models/Calories");

class ETLService {
  static async transformUserMetrics() {
    const pipeline = [
      {
        $lookup: {
          from: "calories",
          localField: "_id",
          foreignField: "userId",
          as: "calorieData",
        },
      },
      {
        $lookup: {
          from: "workoutplans",
          localField: "_id",
          foreignField: "userId",
          as: "workoutData",
        },
      },
      {
        $project: {
          userId: "$_id",
          date: new Date(),
          weight: "$weight",
          caloriesConsumed: { $avg: "$calorieData.calories" },
          workoutsDone: { $size: "$workoutData" },
          goalProgress: "$progressPercentage",
        },
      },
    ];

    const userData = await User.aggregate(pipeline);
    await UserMetrics.insertMany(userData);
  }

  static async transformWorkoutAnalytics() {
    const pipeline = [
      {
        $group: {
          _id: "$type",
          totalUsers: { $sum: 1 },
          averageCompletionRate: { $avg: "$completionRate" },
        },
      },
      {
        $project: {
          workoutType: "$_id",
          totalUsers: 1,
          averageCompletionRate: 1,
          popularityScore: {
            $multiply: ["$totalUsers", "$averageCompletionRate"],
          },
          date: new Date(),
        },
      },
    ];

    const workoutData = await WorkoutPlan.aggregate(pipeline);
    await WorkoutAnalytics.insertMany(workoutData);
  }

  static async transformDietAnalytics() {
    const pipeline = [
      {
        $group: {
          _id: "$dietType",
          totalUsers: { $sum: 1 },
          averageAdherence: { $avg: "$adherenceRate" },
        },
      },
      {
        $project: {
          dietType: "$_id",
          totalUsers: 1,
          averageAdherence: 1,
          popularityScore: {
            $multiply: ["$totalUsers", "$averageAdherence"],
          },
          date: new Date(),
        },
      },
    ];

    const dietData = await DietPlan.aggregate(pipeline);
    await DietAnalytics.insertMany(dietData);
  }

  static async runETLJob() {
    try {
      await this.transformUserMetrics();
      await this.transformWorkoutAnalytics();
      await this.transformDietAnalytics();
      console.log("ETL job completed successfully");
    } catch (error) {
      console.error("ETL job failed:", error);
      throw error;
    }
  }
}

module.exports = ETLService;
