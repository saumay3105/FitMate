import React, { useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";

const Signup = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signup } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match");
    }

    try {
      setError("");
      setLoading(true);
      const result = await signup(emailRef.current.value, passwordRef.current.value);
      navigate('/onboarding');
      console.log("Signup successful:", result.user);
    } catch (err) {
      console.error("Error signing up:", err);
      setError(err.message || "Failed to create an account");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="signup-page-card">
      <h2 className="signup-page-title">Sign Up</h2>
      {error && <div className="signup-page-alert-error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="signup-page-form-group">
          <label className="signup-page-form-label" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            ref={emailRef}
            className="signup-page-form-control"
            autoComplete="email"
            required
          />
        </div>
        <div className="signup-page-form-group">
          <label className="signup-page-form-label" htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            ref={passwordRef}
            className="signup-page-form-control"
            autoComplete="new-password"
            required
          />
        </div>
        <div className="signup-page-form-group">
          <label className="signup-page-form-label" htmlFor="password-confirm">Confirm Password</label>
          <input
            type="password"
            id="password-confirm"
            ref={passwordConfirmRef}
            className="signup-page-form-control"
            autoComplete="new-password"
            required
          />
        </div>
        <button disabled={loading} className="signup-page-submit-btn" type="submit">
          Sign Up
        </button>
      </form>
      <div className="signup-page-footer">
        Already have an account? <Link to="/login">Log In</Link>
      </div>
    </div>
  );
};

export default Signup;