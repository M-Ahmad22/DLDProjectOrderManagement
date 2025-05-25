import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/Signup", {
        name,
        email,
        password,
        role,
      });

      if (res.data.success) {
        setMessage(res.data.message);
        // navigate("/login");
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError("Signup failed");
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSignup} className="auth-form">
        <h2 className="auth-title">Admin Signup</h2>
        {message && <p className="auth-message">{message}</p>}
        {error && <p className="auth-error">{error}</p>}
        <input
          type="text"
          placeholder="Name"
          className="auth-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
        <button type="submit" className="auth-button auth-button-signup">
          Signup
        </button>
      </form>
    </div>
  );
};

export default Signup;
