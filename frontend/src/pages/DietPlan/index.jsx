import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import "./DietPlan.css";

const DietPlan = () => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [dietPlan, setDietPlan] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [additionalComment, setAdditionalComment] = useState("");
  const [showCommentModal, setShowCommentModal] = useState(false);

  const api = axios.create({
    baseURL: "https://fitmate-hp51.onrender.com/api",
    headers: {
      "Content-Type": "application/json",
    },
  });

  useEffect(() => {
    if (currentUser?.email) {
      fetchUserData();
      fetchDietPlan();
    }
  }, [currentUser]);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { data } = await api.get(`/users/${currentUser.email}`);
      setUserData(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch user data");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDietPlan = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { data } = await api.get(`/plans/diet/${currentUser.email}`);
      setDietPlan(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch diet plan");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerateDiet = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { data } = await api.post("/plans/diet/regenerate", {
        email: currentUser.email,
        additionalComment: additionalComment,
      });
      setDietPlan(data);
      setShowCommentModal(false);
      setAdditionalComment("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to regenerate diet plan");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePreferences = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { data } = await api.put(`/users/${currentUser.email}`, {
        weight: userData.weight,
        height: userData.height,
        age: userData.age,
        fitnessGoals: userData.fitnessGoals,
        dietaryPreferences: userData.dietaryPreferences,
      });
      setUserData(data);
      setIsEditing(false);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update user preferences"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="diet-loading-container">Loading...</div>;
  }

  if (!currentUser) {
    return (
      <div className="diet-auth-alert">
        <div className="diet-alert error">
          Please log in to view your diet plan.
        </div>
      </div>
    );
  }

  if (!userData) {
    return <div className="diet-loading-container">Loading user data...</div>;
  }

  return (
    <div className="diet-page">
      {error && <div className="diet-alert error">{error}</div>}

      {showCommentModal && (
        <div className="diet-modal-overlay">
          <div className="diet-modal-content">
            <h3>Additional Comments</h3>
            <textarea
              value={additionalComment}
              onChange={(e) => setAdditionalComment(e.target.value)}
              placeholder="Enter any specific dietary requirements or preferences..."
              rows={4}
              className="diet-comment-textarea"
            />
            <div className="diet-modal-actions">
              <button
                className="diet-btn secondary"
                onClick={() => {
                  setShowCommentModal(false);
                  setAdditionalComment("");
                }}
              >
                Cancel
              </button>
              <button
                className="diet-btn primary"
                onClick={handleRegenerateDiet}
              >
                Generate Plan
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="diet-main-content">
        {!dietPlan ? (
          <div className="diet-preferences-section">
            <div className="diet-preferences-card">
              <h2>Your Dietary Profile</h2>
              <div className="diet-card-content">
                {isEditing ? (
                  <form className="diet-preferences-form">
                    <div className="diet-form-group">
                      <label>Age</label>
                      <input
                        type="number"
                        value={userData.age}
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            age: parseInt(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="diet-form-group">
                      <label>Weight (kg)</label>
                      <input
                        type="number"
                        value={userData.weight}
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            weight: parseInt(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="diet-form-group">
                      <label>Height (cm)</label>
                      <input
                        type="number"
                        value={userData.height}
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            height: parseInt(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="diet-form-group">
                      <label>Dietary Preferences</label>
                      <div className="diet-preferences-grid">
                        {[
                          "vegetarian",
                          "vegan",
                          "pescatarian",
                          "gluten-free",
                          "dairy-free",
                          "keto",
                          "paleo",
                        ].map((pref) => (
                          <label
                            key={pref}
                            className="diet-preference-checkbox"
                          >
                            <input
                              type="checkbox"
                              checked={userData.dietaryPreferences.includes(
                                pref
                              )}
                              onChange={(e) => {
                                const prefs = e.target.checked
                                  ? [...userData.dietaryPreferences, pref]
                                  : userData.dietaryPreferences.filter(
                                      (p) => p !== pref
                                    );
                                setUserData({
                                  ...userData,
                                  dietaryPreferences: prefs,
                                });
                              }}
                            />
                            {pref}
                          </label>
                        ))}
                      </div>
                    </div>
                    <button
                      className="diet-btn primary"
                      onClick={handleSavePreferences}
                    >
                      Save Changes
                    </button>
                  </form>
                ) : (
                  <div className="diet-preferences-summary">
                    <div className="diet-preference-item">
                      <span>Name:</span> {userData.fullName}
                    </div>
                    <div className="diet-preference-item">
                      <span>Age:</span> {userData.age}
                    </div>
                    <div className="diet-preference-item">
                      <span>Weight:</span> {userData.weight} kg
                    </div>
                    <div className="diet-preference-item">
                      <span>Height:</span> {userData.height} cm
                    </div>
                    <div className="diet-preference-item">
                      <span>Dietary Preferences:</span>{" "}
                      {userData.dietaryPreferences.join(", ") ||
                        "None specified"}
                    </div>
                    <button
                      className="diet-btn secondary"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Preferences
                    </button>
                  </div>
                )}
              </div>
            </div>
            <button onClick={fetchDietPlan} className="diet-generate-btn">
              Generate AI Diet Plan
            </button>
          </div>
        ) : (
          <div className="diet-diet-plan">
            <div className="diet-header">
              <h2>Your Daily Meal Plan</h2>
              <div className="diet-top-actions">
                <button
                  onClick={() => setShowCommentModal(true)}
                  className="diet-btn secondary"
                >
                  Regenerate Plan
                </button>
              </div>
            </div>
            <div className="diet-daily-macros">
              <h3>Daily Nutritional Goals</h3>
              <div className="diet-macros-grid">
                <div className="diet-macro-card">
                  <span className="diet-macro-label">Calories</span>
                  <span className="diet-macro-value">
                    {dietPlan.dailyTotalMacros.calories} kcal
                  </span>
                </div>
                <div className="diet-macro-card">
                  <span className="diet-macro-label">Protein</span>
                  <span className="diet-macro-value">
                    {dietPlan.dailyTotalMacros.proteins}g
                  </span>
                </div>
                <div className="diet-macro-card">
                  <span className="diet-macro-label">Carbs</span>
                  <span className="diet-macro-value">
                    {dietPlan.dailyTotalMacros.carbohydrates}g
                  </span>
                </div>
                <div className="diet-macro-card">
                  <span className="diet-macro-label">Fats</span>
                  <span className="diet-macro-value">
                    {dietPlan.dailyTotalMacros.fats}g
                  </span>
                </div>
              </div>
            </div>
            <div className="diet-meals-grid">
              {dietPlan.meals.map((meal, index) => (
                <div key={index} className="diet-meal-card">
                  <h3>
                    {meal.mealType.charAt(0).toUpperCase() +
                      meal.mealType.slice(1)}
                  </h3>
                  <div className="diet-meal-content">
                    <div className="diet-foods-list">
                      {meal.foods.map((food, foodIndex) => (
                        <div key={foodIndex} className="diet-food-item">
                          {food}
                        </div>
                      ))}
                    </div>
                    <div className="diet-meal-macros">
                      <div className="diet-macro-item">
                        <span>Calories:</span> {meal.calories} kcal
                      </div>
                      <div className="diet-macro-item">
                        <span>Protein:</span> {meal.macros.proteins}g
                      </div>
                      <div className="diet-macro-item">
                        <span>Carbs:</span> {meal.macros.carbohydrates}g
                      </div>
                      <div className="diet-macro-item">
                        <span>Fats:</span> {meal.macros.fats}g
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DietPlan;
