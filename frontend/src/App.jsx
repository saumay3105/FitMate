import { useState } from "react";

import "./App.css";
import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import { AuthProvider } from "./context/AuthContext";
import Signup from "./pages/SignUp/Signup";
import Navbar from "./components/Navbar";
import ForgotPassword from "./pages/ForgotPassword";
import WorkoutPage from "./pages/WorkoutPage";
import Profile from "./pages/Profile";
import DietPlan from "./pages/DietPlan";
function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/workout" element={<WorkoutPage />} />
            <Route path="/dietplan" element={<DietPlan />} />
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
