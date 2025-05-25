import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Common.css";

const Login = ({ onLogin, isAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin"); // You can also make this selectable if needed
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/Login", {
        email,
        password,
        role,
      });

      if (res.data.success && res.data.user.role === "admin") {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.user.role);
        if (onLogin) onLogin();
        // No need to navigate here; App will handle redirect based on auth state
      } else {
        setError("Invalid credentials or unauthorized role.");
      }
    } catch (err) {
      setError("Login failed");
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleLogin} className="auth-form">
        <h2 className="auth-title">Admin Login</h2>
        {error && <p className="auth-error">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          className="auth-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="auth-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="auth-button auth-button-login">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
