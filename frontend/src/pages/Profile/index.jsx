import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import "./Profile.css";
import human from "../../assets/human.jpg";

const fitnessGoalsEnum = [
  "weight loss",
  "muscle gain",
  "maintain weight",
  "increase endurance",
];

const dietaryPreferencesEnum = [
  "vegetarian",
  "non-vegetarian",
  "vegan",
  "gluten-free",
  "lactose-free",
  "none",
];

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/users/${currentUser.email}`);
        setUserData(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch user data. Please try again later.");
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.email) {
      fetchUserData();
    }
  }, [currentUser?.email]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `http://localhost:4000/api/users/${currentUser.email}`,
        {
          age: userData.age,
          weight: userData.weight,
          height: userData.height,
          fitnessGoals: userData.fitnessGoals,
          dietaryPreferences: userData.dietaryPreferences,
        }
      );
      setUserData(response.data);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError("Failed to update profile. Please try again later.");
      console.error("Error updating user data:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGoalToggle = (goal) => {
    setUserData((prev) => ({
      ...prev,
      fitnessGoals: prev.fitnessGoals.includes(goal)
        ? prev.fitnessGoals.filter((g) => g !== goal)
        : [...prev.fitnessGoals, goal],
    }));
  };

  const handleDietaryToggle = (preference) => {
    setUserData((prev) => ({
      ...prev,
      dietaryPreferences: prev.dietaryPreferences.includes(preference)
        ? prev.dietaryPreferences.filter((p) => p !== preference)
        : [...prev.dietaryPreferences, preference],
    }));
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <i className="fas fa-exclamation-circle"></i>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="retry-button"
        >
          <i className="fas fa-redo"></i> Retry
        </button>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="error-container">
        <p>No user data found.</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-image-container">
          <img src={human} alt="Profile" className="profile-image" />
          <div className="profile-image-overlay">
            <i className="fas fa-camera"></i>
          </div>
        </div>
        <h1>{userData.fullName}</h1>
        <p className="email">{userData.email}</p>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h2>Personal Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Age</label>
              {isEditing ? (
                <input
                  type="number"
                  name="age"
                  value={userData.age}
                  onChange={handleChange}
                />
              ) : (
                <span>{userData.age} years</span>
              )}
            </div>
            <div className="info-item">
              <label>Weight</label>
              {isEditing ? (
                <input
                  type="number"
                  name="weight"
                  value={userData.weight}
                  onChange={handleChange}
                />
              ) : (
                <span>{userData.weight} kg</span>
              )}
            </div>
            <div className="info-item">
              <label>Height</label>
              {isEditing ? (
                <input
                  type="number"
                  name="height"
                  value={userData.height}
                  onChange={handleChange}
                />
              ) : (
                <span>{userData.height} cm</span>
              )}
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h2>Fitness Goals</h2>
          <div className="goals-grid">
            {fitnessGoalsEnum.map((goal) => (
              <div
                key={goal}
                className={`goal-item ${
                  userData.fitnessGoals.includes(goal) ? "active" : ""
                } ${isEditing ? "editable" : ""}`}
                onClick={() => isEditing && handleGoalToggle(goal)}
              >
                <i
                  className={`fas fa-${
                    goal === "weight loss"
                      ? "weight"
                      : goal === "muscle gain"
                      ? "dumbbell"
                      : goal === "maintain weight"
                      ? "balance-scale"
                      : "running"
                  }`}
                ></i>
                <span>{goal}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="profile-section">
          <h2>Dietary Preferences</h2>
          <div className="dietary-grid">
            {dietaryPreferencesEnum.map((preference) => (
              <div
                key={preference}
                className={`dietary-item ${
                  userData.dietaryPreferences.includes(preference)
                    ? "active"
                    : ""
                } ${isEditing ? "editable" : ""}`}
                onClick={() => isEditing && handleDietaryToggle(preference)}
              >
                <i
                  className={`fas fa-${
                    preference === "vegetarian"
                      ? "carrot"
                      : preference === "non-vegetarian"
                      ? "drumstick-bite"
                      : preference === "vegan"
                      ? "leaf"
                      : preference === "gluten-free"
                      ? "bread-slice"
                      : preference === "lactose-free"
                      ? "cheese"
                      : "utensils"
                  }`}
                ></i>
                <span>{preference}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="button-container">
          {isEditing ? (
            <button className="save-button" onClick={handleSave}>
              <i className="fas fa-save"></i> Save Changes
            </button>
          ) : (
            <button className="edit-button" onClick={handleEdit}>
              <i className="fas fa-edit"></i> Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
