import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CalorieTracker.css";
import { useAuth } from "../../context/AuthContext";

const CalorieTracker = () => {
  const [foods, setFoods] = useState([]);
  const [newFood, setNewFood] = useState("");
  const [newCalories, setNewCalories] = useState(0);
  const [targetCalories, setTargetCalories] = useState(2000);
  const [totalCalories, setTotalCalories] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [dietPlan, setDietPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchCalorieTracker();
    fetchDietPlan();
  }, []);

  const fetchCalorieTracker = async () => {
    try {
      const email = currentUser.email;
      const response = await axios.get(
        `https://fitmate-hp51.onrender.com/api/calorie/tracker/${email}`
      );
      setFoods(response.data.foods);
      setTargetCalories(response.data.dailyTargetCalories);
      setTotalCalories(response.data.dailyTotalCalories);
    } catch (error) {
      console.error("Error fetching calorie tracker:", error);
    }
  };

  const fetchDietPlan = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { data } = await axios.get(
        `https://fitmate-hp51.onrender.com/api/plans/diet/${currentUser.email}`
      );
      setDietPlan(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch diet plan");
    } finally {
      setIsLoading(false);
    }
  };

  const addFood = async () => {
    if (newFood.trim() !== "" && newCalories > 0) {
      try {
        const email = currentUser.email;
        const response = await axios.post(
          "https://fitmate-hp51.onrender.com/api/calorie/tracker/add-food",
          {
            email,
            name: newFood,
            calories: newCalories,
          }
        );
        setFoods(response.data.foods);
        setTotalCalories(response.data.dailyTotalCalories);
        setNewFood("");
        setNewCalories(0);
      } catch (error) {
        console.error("Error adding food:", error);
      }
    }
  };

  const deleteFood = async (name, calories) => {
    try {
      const email = currentUser.email;
      const response = await axios.delete(
        `https://fitmate-hp51.onrender.com/api/calorie/tracker/delete-food`,
        {
          data: {
            email,
            name,
            calories,
          },
        }
      );
      setFoods(response.data.foods);
      setTotalCalories(response.data.dailyTotalCalories);
    } catch (error) {
      console.error("Error deleting food:", error);
    }
  };

  const updateTargetCalories = async () => {
    try {
      const email = currentUser.email;
      await axios.put(
        "https://fitmate-hp51.onrender.com/api/calorie/tracker/update-target",
        {
          email,
          dailyTargetCalories: parseInt(targetCalories),
        }
      );
    } catch (error) {
      console.error("Error updating target calories:", error);
    }
  };

  const resetCalorieTracker = async () => {
    try {
      const email = currentUser.email;
      await axios.post("https://fitmate-hp51.onrender.com/api/calorie/tracker/reset", {
        email,
      });
      setFoods([]);
      setTotalCalories(0);
    } catch (error) {
      console.error("Error resetting calorie tracker:", error);
    }
  };

  useEffect(() => {
    setShowNotification(totalCalories >= targetCalories);
  }, [totalCalories, targetCalories]);

  const addMealToFoodLog = (meal) => {
    setFoods([
      ...foods,
      {
        name: meal.mealType,
        calories: meal.calories,
      },
    ]);
    setTotalCalories(totalCalories + meal.calories);
  };

  if (isLoading) {
    return <div className="calorie-tracker-loading">Loading...</div>;
  }

  if (!dietPlan) {
    return <div className="calorie-tracker-loading">Loading diet plan...</div>;
  }

  return (
    <div className="calorie-tracker-container">
      {error && <div className="calorie-tracker-alert error">{error}</div>}
      <div className="calorie-tracker-sidebar">
        <h2>Your Diet Plan</h2>
        <div className="diet-plan-meals">
          {dietPlan.meals.map((meal, index) => (
            <div key={index} className="diet-plan-meal">
              <h3>
                {meal.mealType.charAt(0).toUpperCase() + meal.mealType.slice(1)}
              </h3>
              <div className="diet-plan-meal-info">
                <div className="diet-plan-meal-foods">
                  {meal.foods.map((food, foodIndex) => (
                    <div key={foodIndex} className="diet-plan-meal-food">
                      {food}
                    </div>
                  ))}
                </div>
                <div className="diet-plan-meal-macros">
                  <div className="diet-plan-meal-macro">
                    <span>Calories:</span> {meal.calories} kcal
                  </div>
                  <div className="diet-plan-meal-macro">
                    <span>Protein:</span> {meal.macros.proteins}g
                  </div>
                  <div className="diet-plan-meal-macro">
                    <span>Carbs:</span> {meal.macros.carbohydrates}g
                  </div>
                  <div className="diet-plan-meal-macro">
                    <span>Fats:</span> {meal.macros.fats}g
                  </div>
                </div>
              </div>
              <button
                className="diet-plan-meal-add"
                onClick={() => addMealToFoodLog(meal)}
              >
                Add to Food Log
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="calorie-tracker-main">
        <h1 className="heading">Calorie Tracker</h1>
        <div className="food-input">
          <input
            type="text"
            placeholder="Food name"
            value={newFood}
            onChange={(event) => setNewFood(event.target.value)}
          />
          <input
            type="number"
            placeholder="Calories"
            value={newCalories}
            onChange={(event) => setNewCalories(parseInt(event.target.value))}
          />
          <button onClick={addFood}>Add Food</button>
        </div>
        <div className="food-list">
          <h2>Food Log</h2>
          <ul>
            {foods.map((food, index) => (
              <li key={index}>
                {food.name} - {food.calories} calories{" "}
                <button onClick={() => deleteFood(food.name, food.calories)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="calorie-summary">
          <h2>Calorie Summary</h2>
          <p>Total Calories: {totalCalories}</p>
          <p>Target Calories: {targetCalories}</p>
          {showNotification && (
            <div className="notification">Target calories reached!</div>
          )}
          <input
            type="number"
            placeholder="Set target calories"
            value={targetCalories}
            onChange={(event) => {
              setTargetCalories(parseInt(event.target.value) || 0);
            }}
          />
          <button className="reset" onClick={updateTargetCalories}>Update Target</button>
          <button className="reset" onClick={resetCalorieTracker}>
            Reset Tracker
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalorieTracker;
