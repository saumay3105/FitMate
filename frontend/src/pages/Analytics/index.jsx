import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getAnalytics } from "../../services/analyticsService";
import MetricsCard from "../../components/Analytics/MetricsCard";
import ProgressChart from "../../components/Analytics/ProgressChart";
import "./Analytics.css";

const Analytics = () => {
  const { currentUser } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [workoutAnalytics, setWorkoutAnalytics] = useState(null);
  const [dietAnalytics, setDietAnalytics] = useState(null);
  const [userProgress, setUserProgress] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [metricsData, workoutData, dietData, progressData] =
          await Promise.all([
            getAnalytics.getUserMetrics(currentUser.email),
            getAnalytics.getWorkoutAnalytics(),
            getAnalytics.getDietAnalytics(),
            getAnalytics.getUserProgress(currentUser.email),
          ]);

        setMetrics(metricsData[0]); // Most recent metrics
        setWorkoutAnalytics(workoutData);
        setDietAnalytics(dietData);
        setUserProgress(progressData);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      }
    };

    if (currentUser) {
      fetchData();
    }
  }, [currentUser]);

  if (!metrics || !workoutAnalytics || !dietAnalytics || !userProgress) {
    return <div>Loading...</div>;
  }

  return (
    <div className="analytics-dashboard">
      <h1>Fitness Analytics Dashboard</h1>

      <div className="analytics-grid">
        <MetricsCard
          title="Current Weight"
          value={`${metrics.weight} kg`}
          icon="⚖️"
          trend={calculateTrend(userProgress, "weight")}
        />
        <MetricsCard
          title="Calories Consumed"
          value={`${metrics.caloriesConsumed} kcal`}
          icon="🍎"
          trend={calculateTrend(userProgress, "caloriesConsumed")}
        />
        <MetricsCard
          title="Workouts Completed"
          value={metrics.workoutsDone}
          icon="💪"
        />
        <MetricsCard
          title="Goal Progress"
          value={`${metrics.goalProgress}%`}
          icon="🎯"
        />
      </div>

      <h2 className="section-title">Your Progress</h2>
      <div className="analytics-charts">
        <ProgressChart
          data={userProgress.map((p) => ({
            date: p.date,
            value: p.weight,
          }))}
          title="Weight Progress"
        />
        <ProgressChart
          data={userProgress.map((p) => ({
            date: p.date,
            value: p.caloriesConsumed,
          }))}
          title="Calorie Intake"
        />
      </div>

      <h2 className="section-title">Popular Workouts</h2>
      <div className="analytics-charts">
        <ProgressChart
          data={workoutAnalytics.map((w) => ({
            date: w.date,
            value: w.popularityScore,
            label: w.workoutType,
          }))}
          title="Workout Popularity"
        />
      </div>

      <h2 className="section-title">Diet Plan Analytics</h2>
      <div className="analytics-charts">
        <ProgressChart
          data={dietAnalytics.map((d) => ({
            date: d.date,
            value: d.popularityScore,
            label: d.dietType,
          }))}
          title="Diet Plan Effectiveness"
        />
      </div>
    </div>
  );
};

// Helper function to calculate trend
const calculateTrend = (data, metric) => {
  if (!data || data.length < 2) return 0;
  const latest = data[0][metric];
  const previous = data[1][metric];
  return (((latest - previous) / previous) * 100).toFixed(1);
};

export default Analytics;
