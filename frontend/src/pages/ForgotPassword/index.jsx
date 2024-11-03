import React, { useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import "./ForgotPassword.css";

function ForgotPassword() {
  const emailRef = useRef();
  const { resetPassword } = useAuth();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setMessage("");
      setError("");
      setLoading(true);
      await resetPassword(emailRef.current.value);
      setMessage("Check your inbox for further instructions");
    } catch (err) {
      console.log(err);
      setError("Failed to reset password");
    }

    setLoading(false);
  }

  return (
    <div className="card">
      <div className="card-body">
        <h2 className="card-title">Password Reset</h2>
        {error && <div className="alert">{error}</div>}
        {message && <div className="alert" style={{ backgroundColor: "#d4edda", color: "#155724" }}>{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" ref={emailRef} className="form-control" required />
          </div>
          <button disabled={loading} className="button" type="submit">
            Reset Password
          </button>
        </form>
        <div className="link-container">
          <Link to="/login">Login</Link>
        </div>
      </div>
      <div className="link-container">
        Need an account? <Link to="/signup">Sign Up</Link>
      </div>
    </div>
  );
}

export default ForgotPassword;
