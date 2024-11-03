import React, { useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css"; // Import the custom CSS file

const Login = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      const result = await login(
        emailRef.current.value,
        passwordRef.current.value
      );
      navigate("/");
      console.log("Login successful:", result.user);
    } catch (err) {
      console.error("Error logging in:", err);
      setError(err.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <div className="card-body">
        <h2 className="card-title">Log In</h2>

        {error && <div className="alert">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              ref={emailRef}
              autoComplete="email"
              required
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              ref={passwordRef}
              autoComplete="new-password"
              required
              className="form-control"
            />
          </div>
          <button disabled={loading} className="button" type="submit">
            Log In
          </button>
        </form>
        <div className="link-container">
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>
      </div>
      <div className="link-container">
        Need an account? <Link to="/signup">Sign Up</Link>
      </div>
    </div>
  );
};

export default Login;
