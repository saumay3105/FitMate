import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import "./OnboardingForm.css";

const OnboardingForm = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: currentUser.email, // Pre-filled from auth context
    age: "",
    weight: "",
    height: "",
    fitnessGoals: [],
    dietaryPreferences: [],
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const fitnessGoalOptions = [
    "weight loss",
    "muscle gain",
    "maintain weight",
    "increase endurance",
  ];

  const dietaryPreferenceOptions = [
    "vegetarian",
    "non-vegetarian",
    "vegan",
    "gluten-free",
    "lactose-free",
    "none",
  ];

  const validateStep = (stepNumber) => {
    const newErrors = {};

    switch (stepNumber) {
      case 1:
        if (!formData.fullName.trim()) newErrors.fullName = "Name is required";
        break;
      case 2:
        if (!formData.age) newErrors.age = "Age is required";
        if (!formData.weight) newErrors.weight = "Weight is required";
        if (!formData.height) newErrors.height = "Height is required";
        break;
      case 3:
        if (formData.fitnessGoals.length === 0) {
          newErrors.fitnessGoals = "Please select at least one fitness goal";
        }
        if (formData.dietaryPreferences.length === 0) {
          newErrors.dietaryPreferences =
            "Please select at least one dietary preference";
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCheckboxChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value],
    }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setLoading(true);
    try {
      const response = await fetch("https://fitmate-hp51.onrender.com/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        navigate("/");
      } else {
        const data = await response.json();
        setErrors({ submit: data.message || "Failed to save user data" });
      }
    } catch (error) {
      setErrors({ submit: "Network error occurred" });
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="form-group">
      <div className="input-container">
        <label>Full Name</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          className={errors.fullName ? "error" : ""}
        />
        {errors.fullName && (
          <span className="error-message">{errors.fullName}</span>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="form-group">
      <div className="input-container">
        <label>Age</label>
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleInputChange}
          className={errors.age ? "error" : ""}
        />
        {errors.age && <span className="error-message">{errors.age}</span>}
      </div>
      <div className="input-container">
        <label>Weight (kg)</label>
        <input
          type="number"
          name="weight"
          value={formData.weight}
          onChange={handleInputChange}
          className={errors.weight ? "error" : ""}
        />
        {errors.weight && (
          <span className="error-message">{errors.weight}</span>
        )}
      </div>
      <div className="input-container">
        <label>Height (cm)</label>
        <input
          type="number"
          name="height"
          value={formData.height}
          onChange={handleInputChange}
          className={errors.height ? "error" : ""}
        />
        {errors.height && (
          <span className="error-message">{errors.height}</span>
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="form-group">
      <div className="checkbox-group">
        <label className="group-label">Fitness Goals</label>
        <div className="checkbox-container">
          {fitnessGoalOptions.map((goal) => (
            <label key={goal} className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.fitnessGoals.includes(goal)}
                onChange={() => handleCheckboxChange("fitnessGoals", goal)}
              />
              <span>{goal}</span>
            </label>
          ))}
        </div>
        {errors.fitnessGoals && (
          <span className="error-message">{errors.fitnessGoals}</span>
        )}
      </div>
      <div className="checkbox-group">
        <label className="group-label">Dietary Preferences</label>
        <div className="checkbox-container">
          {dietaryPreferenceOptions.map((pref) => (
            <label key={pref} className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.dietaryPreferences.includes(pref)}
                onChange={() =>
                  handleCheckboxChange("dietaryPreferences", pref)
                }
              />
              <span>{pref}</span>
            </label>
          ))}
        </div>
        {errors.dietaryPreferences && (
          <span className="error-message">{errors.dietaryPreferences}</span>
        )}
      </div>
    </div>
  );

  return (
    <div className="onboarding-container">
      <div className="onboarding-card">
        <div className="form-header">
          <h2>Create Your Profile</h2>
          <span className="step-indicator">Step {step} of 3</span>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <div className="form-content">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {errors.submit && (
            <div className="error-message submit-error">{errors.submit}</div>
          )}
        </div>

        <div className="button-group">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="btn btn-secondary"
            >
              <ArrowLeft className="icon" />
              Back
            </button>
          )}
          {step < 3 ? (
            <button onClick={handleNext} className="btn btn-primary">
              Next
              <ArrowRight className="icon" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? "Saving..." : "Complete Profile"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingForm;
