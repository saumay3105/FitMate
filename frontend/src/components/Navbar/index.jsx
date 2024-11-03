import React, { useState } from "react";
import { Link,useNavigate } from "react-router-dom"; // Import Link for routing
import "./Navbar.css";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [error, setError] = useState("");
  const { currentUser,logout } = useAuth();
  const isLoggedIn = !!currentUser;
  const navigate = useNavigate()
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
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">
          FitMate
        </Link>

        <div className="nav-links">
          <Link to="#fitness" className="nav-link">
            Fitness
          </Link>
          <Link to="#nutrition" className="nav-link">
            Nutrition
          </Link>
          <Link to="#progress" className="nav-link">
            Progress
          </Link>
        </div>

        <div className="nav-right">
          <div className="location">
            <span>📍</span>
            <span>Pune</span>
          </div>

          {isLoggedIn ? (
            <div className="user-section">
              <span className="user-greeting">Hi, {currentUser.email}</span>
              <button className="cta-button">My Profile</button>
              <button className="cta-button" variant="link" onClick={handleLogOut}> Log Out</button>
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
        <Link to="#fitness" className="nav-link">
          Fitness
        </Link>
        <Link to="#nutrition" className="nav-link">
          Nutrition
        </Link>
        <Link to="#progress" className="nav-link">
          Progress
        </Link>

        {isLoggedIn ? (
          <div className="user-section">
            <span className="user-greeting">Hi,{currentUser.email}</span>
            <button className="cta-button">My Profile</button>
            <button className="cta-button" variant="link" onClick={handleLogOut}> Log Out</button>
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
