import React from "react";
import "./Home.css";
import { useAuth } from "../../context/AuthContext";

const Home = () => {
  const { currentUser } = useAuth();
  const isLoggedIn = !!currentUser;
  
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            {isLoggedIn
              ? "Welcome back to your fitness journey"
              : "One membership for all your fitness needs"}
          </h1>
          <p className="hero-subtitle">
            {isLoggedIn
              ? "Continue your progress with AI-powered personalized workouts and nutrition plans"
              : "Get started with AI-powered personalized workouts and nutrition plans"}
          </p>
          <button className="cta-button">
            {isLoggedIn ? "View Your Plan" : "Start Free Trial"}
          </button>
        </div>
      </section>

      <section className="features">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🧠</div>
            <h3 className="feature-title">AI-Powered Plans</h3>
            <p className="feature-description">
              Personalized workout and nutrition plans based on your goals and preferences
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💪</div>
            <h3 className="feature-title">Expert Workouts</h3>
            <p className="feature-description">
              Access to professional workout routines tailored to your fitness level
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🥗</div>
            <h3 className="feature-title">Smart Nutrition</h3>
            <p className="feature-description">
              Customized meal plans that match your dietary preferences and goals
            </p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2 className="cta-title">
          {isLoggedIn
            ? "Ready to level up?"
            : "Transform your fitness journey today"}
        </h2>
        <p className="cta-description">
          {isLoggedIn
            ? "Check out our new AI-powered features to enhance your workout experience"
            : "Join thousands of users who have achieved their fitness goals with FitMate"}
        </p>
        <button className="cta-button">
          {isLoggedIn ? "Explore New Features" : "Get Started"}
        </button>
      </section>
    </div>
  );
};

export default Home;
