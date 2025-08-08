import axios from "axios";

const API_URL = "http://localhost:4000/api/analytics";

export const getAnalytics = {
  // Get user metrics over time
  getUserMetrics: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user metrics:", error);
      return [
        {
          // Return default data if error
          weight: 0,
          caloriesConsumed: 0,
          workoutsDone: 0,
          goalProgress: 0,
          date: new Date(),
        },
      ];
    }
  },

  // Get workout analytics
  getWorkoutAnalytics: async () => {
    try {
      const response = await axios.get(`${API_URL}/workouts`);
      return response.data;
    } catch (error) {
      console.error("Error fetching workout analytics:", error);
      return [];
    }
  },

  // Get diet analytics
  getDietAnalytics: async () => {
    try {
      const response = await axios.get(`${API_URL}/diets`);
      return response.data;
    } catch (error) {
      console.error("Error fetching diet analytics:", error);
      return [];
    }
  },

  // Get user progress
  getUserProgress: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/progress/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user progress:", error);
      return [
        {
          date: new Date(),
          weight: 0,
          caloriesConsumed: 0,
        },
      ];
    }
  },
};
