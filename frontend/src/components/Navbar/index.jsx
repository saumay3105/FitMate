import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const isLoggedIn = !!currentUser;
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/users/${currentUser?.email}`
        );
        setUserName(response.data.fullName);
      } catch (error) {
        console.log(error);
        setError("Failed to fetch user name");
      }
    };

    if (isLoggedIn) {
      fetchUserName();
    }
  }, [currentUser]);

  async function handleLogOut() {
    setError("");
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.log(error);
      setError("Failed to log Out");
    }
  }

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">
          FitMate
        </Link>

        <div className="nav-right">
          <div className="location">
            <span>📍</span>
            <span>Pune</span>
          </div>

          {isLoggedIn ? (
            <div className="user-section">
              <div className="nav-links">
                <Link to="/workout" className="nav-link">
                  Fitness
                </Link>
                <Link to="/dietplan" className="nav-link">
                  Nutrition
                </Link>
                <Link to="/calorie-tracker" className="nav-link">
                  Calorie Tracker
                </Link>
              </div>
              <span className="user-greeting">Hi, {userName}</span>
              <button onClick={handleProfileClick} className="cta-button">
                My Profile
              </button>
              <button
                className="cta-button"
                variant="link"
                onClick={handleLogOut}
              >
                {" "}
                Log Out
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="cta-button">
                Log In
              </Link>
              <Link to="/signup" className="cta-button">
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button
          className="mobile-menu-button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          ☰
        </button>
      </div>

      <div className={`mobile-menu ${isMobileMenuOpen ? "active" : ""}`}>
        <Link to="/workout" className="nav-link">
          Fitness
        </Link>
        <Link to="/dietplan" className="nav-link">
          Nutrition
        </Link>
        <Link to="/calorie-tracker" className="nav-link">
          Calorie Tracker
        </Link>

        {isLoggedIn ? (
          <div className="user-section">
            <span className="user-greeting">Hi, {userName}</span>
            <button onClick={handleProfileClick} className="cta-button">
              My Profile
            </button>
            <button
              className="cta-button"
              variant="link"
              onClick={handleLogOut}
            >
              {" "}
              Log Out
            </button>
          </div>
        ) : (
          <>
            <Link to="/login" className="cta-button">
              Log In
            </Link>
            <Link to="/signup" className="cta-button">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
