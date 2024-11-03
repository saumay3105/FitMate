import { useState } from "react";

import "./App.css";
import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import { AuthProvider } from "./context/AuthContext";
import Signup from "./pages/SignUp/Signup";
import Navbar from "./components/Navbar";
import ForgotPassword from "./pages/ForgotPassword";
function App() {
  const [count, setCount] = useState(0);
  return (
    <div className="hero">
      
      <Router>
        <AuthProvider>
        <Navbar />
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword/>} />
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
