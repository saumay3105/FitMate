import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import "./WorkoutPage.css";

const WorkoutPage = () => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [additionalComment, setAdditionalComment] = useState("");
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [editedWorkoutPlan, setEditedWorkoutPlan] = useState(null);

  const api = axios.create({
    baseURL: "https://fitmate-hp51.onrender.com/api",
    headers: {
      "Content-Type": "application/json",
    },
  });

  useEffect(() => {
    if (currentUser?.email) {
      fetchUserData();
      fetchWorkoutPlan();
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

  const fetchWorkoutPlan = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { data } = await api.get(`/plans/workout/${currentUser.email}`);
      setWorkoutPlan(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch workout plan");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerateWorkout = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { data } = await api.post("plans/workout/regenerate", {
        email: currentUser.email,
        additionalComment: additionalComment,
      });
      setWorkoutPlan(data);
      setShowCommentModal(false);
      setAdditionalComment("");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to regenerate workout plan"
      );
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

  const startEditing = () => {
    setEditedWorkoutPlan(JSON.parse(JSON.stringify(workoutPlan)));
    setIsEditing(true);
  };

  const handleUpdateExercise = (day, index, field, value) => {
    setEditedWorkoutPlan((prev) => {
      const updated = { ...prev };
      updated.weeklySchedule[day][index][field] = value;
      return updated;
    });
  };

  const handleSaveWorkout = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { data } = await api.put("/plans/workout", {
        ...editedWorkoutPlan,
        email: currentUser.email,
      });
      setWorkoutPlan(data);
      setIsEditing(false);
      setEditedWorkoutPlan(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update workout plan");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDuration = (seconds) => {
    if (seconds === 0) return "";
    if (seconds < 60) return `${seconds} sec`;
    return `${Math.floor(seconds / 60)} min`;
  };

  if (isLoading) {
    return <div className="loading-container">Loading...</div>;
  }

  if (!currentUser) {
    return (
      <div className="auth-alert">
        <div className="alert error">
          Please log in to view your workout plan.
        </div>
      </div>
    );
  }

  if (!userData) {
    return <div className="loading-container">Loading user data...</div>;
  }

  const renderExercise = (exercise, day, index) => {
    if (isEditing) {
      return (
        <div key={index} className="exercise-item editing">
          <input
            type="text"
            value={editedWorkoutPlan.weeklySchedule[day][index].name}
            onChange={(e) =>
              handleUpdateExercise(day, index, "name", e.target.value)
            }
            className="exercise-input"
          />
          <div className="exercise-inputs">
            <div className="input-group">
              <label>Sets:</label>
              <input
                type="number"
                value={editedWorkoutPlan.weeklySchedule[day][index].sets}
                onChange={(e) =>
                  handleUpdateExercise(
                    day,
                    index,
                    "sets",
                    parseInt(e.target.value)
                  )
                }
                min="0"
                className="number-input"
              />
            </div>
            <div className="input-group">
              <label>Reps:</label>
              <input
                type="number"
                value={editedWorkoutPlan.weeklySchedule[day][index].reps}
                onChange={(e) =>
                  handleUpdateExercise(
                    day,
                    index,
                    "reps",
                    parseInt(e.target.value)
                  )
                }
                min="0"
                className="number-input"
              />
            </div>
            <div className="input-group">
              <label>Duration (sec):</label>
              <input
                type="number"
                value={editedWorkoutPlan.weeklySchedule[day][index].duration}
                onChange={(e) =>
                  handleUpdateExercise(
                    day,
                    index,
                    "duration",
                    parseInt(e.target.value)
                  )
                }
                min="0"
                className="number-input"
              />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div key={index} className="exercise-item">
        <div className="exercise-name">{exercise.name}</div>
        {exercise.sets > 0 && (
          <div className="exercise-details">
            {exercise.sets} sets × {exercise.reps} reps
            {exercise.duration > 0 && ` • ${formatDuration(exercise.duration)}`}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="workout-page">
      {error && <div className="alert error">{error}</div>}

      {showCommentModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Additional Comments</h3>
            <textarea
              value={additionalComment}
              onChange={(e) => setAdditionalComment(e.target.value)}
              placeholder="Enter any specific requirements or modifications you'd like for your workout plan..."
              rows={4}
              className="comment-textarea"
            />
            <div className="modal-actions">
              <button
                className="btn secondary"
                onClick={() => {
                  setShowCommentModal(false);
                  setAdditionalComment("");
                }}
              >
                Cancel
              </button>
              <button className="btn primary" onClick={handleRegenerateWorkout}>
                Generate Plan
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="main-content">
        {!workoutPlan ? (
          <div className="preferences-section">
            <div className="preferences-card">
              <h2>Your Fitness Profile</h2>
              <div className="card-content">
                {isEditing ? (
                  <form className="preferences-form">
                    <div className="form-group">
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
                    <div className="form-group">
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
                    <div className="form-group">
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
                    <div className="form-group">
                      <label>Fitness Goals</label>
                      <div className="goals-grid">
                        {[
                          "weight loss",
                          "muscle gain",
                          "increase endurance",
                          "flexibility",
                        ].map((goal) => (
                          <label key={goal} className="goal-checkbox">
                            <input
                              type="checkbox"
                              checked={userData.fitnessGoals.includes(goal)}
                              onChange={(e) => {
                                const goals = e.target.checked
                                  ? [...userData.fitnessGoals, goal]
                                  : userData.fitnessGoals.filter(
                                      (g) => g !== goal
                                    );
                                setUserData({
                                  ...userData,
                                  fitnessGoals: goals,
                                });
                              }}
                            />
                            {goal}
                          </label>
                        ))}
                      </div>
                    </div>
                    <button
                      className="btn primary"
                      onClick={handleSavePreferences}
                    >
                      Save Changes
                    </button>
                  </form>
                ) : (
                  <div className="preferences-summary">
                    <div className="preference-item">
                      <span>Name:</span> {userData.fullName}
                    </div>
                    <div className="preference-item">
                      <span>Age:</span> {userData.age}
                    </div>
                    <div className="preference-item">
                      <span>Weight:</span> {userData.weight} kg
                    </div>
                    <div className="preference-item">
                      <span>Height:</span> {userData.height} cm
                    </div>
                    <div className="preference-item">
                      <span>Goals:</span> {userData.fitnessGoals.join(", ")}
                    </div>
                    <div className="preference-item">
                      <span>Dietary Preferences:</span>{" "}
                      {userData.dietaryPreferences.join(", ")}
                    </div>
                    <button
                      className="btn secondary"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Preferences
                    </button>
                  </div>
                )}
              </div>
            </div>
            <button onClick={fetchWorkoutPlan} className="generate-btn">
              Generate AI Workout Plan
            </button>
          </div>
        ) : (
          <div className="workout-plan">
            <div className="header">
              <h2>Your Weekly Workout Plan</h2>
              <div className="top-actions">
                <button
                  onClick={() => setShowCommentModal(true)}
                  className="btn secondary"
                >
                  Regenerate Plan
                </button>
                {isEditing ? (
                  <>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditedWorkoutPlan(null);
                      }}
                      className="btn secondary"
                    >
                      Cancel
                    </button>
                    <button onClick={handleSaveWorkout} className="btn primary">
                      Save Changes
                    </button>
                  </>
                ) : (
                  <button onClick={startEditing} className="btn primary">
                    Edit Plan
                  </button>
                )}
              </div>
            </div>
            <div className="days-grid">
              {Object.entries(
                isEditing
                  ? editedWorkoutPlan.weeklySchedule
                  : workoutPlan.weeklySchedule
              ).map(([day, exercises]) => (
                <div key={day} className="day-card">
                  <h3>{day.charAt(0).toUpperCase() + day.slice(1)}</h3>
                  <div className="exercises-list">
                    {exercises.map((exercise, index) =>
                      renderExercise(exercise, day, index)
                    )}
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

export default WorkoutPage;
