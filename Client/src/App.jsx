import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Login from "./Components/Login-Signup/Login";
import Signup from "./Components/Login-Signup/Signup";
import Home from "./Pages/Home";
import AdminDashboard from "./Components/AdminDashborad/Admin";
import ProtectedRoute from "./Components/ProtectedRoutes/ProtectedRoutes";

const DebugInfo = ({ isAuthenticated, role }) => {
  const location = useLocation();
  return (
    <div
      style={{
        position: "fixed",
        bottom: 10,
        right: 10,
        backgroundColor: "#eee",
        padding: "8px 12px",
        borderRadius: 4,
        fontSize: 12,
        boxShadow: "0 0 6px rgba(0,0,0,0.1)",
        zIndex: 9999,
      }}
    >
      <div>
        <strong>Debug Info</strong>
      </div>
      <div>Current Path: {location.pathname}</div>
      <div>isAuthenticated: {isAuthenticated ? "true" : "false"}</div>
      <div>Role: {role || "none"}</div>
    </div>
  );
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const [role, setRole] = useState(localStorage.getItem("role") || "");

  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem("token");
      const storedRole = localStorage.getItem("role");
      setIsAuthenticated(!!token);
      setRole(storedRole || "");
      console.log(
        "[Storage Event] isAuthenticated:",
        !!token,
        "role:",
        storedRole
      );
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    console.log(
      "[Auth State Changed] isAuthenticated:",
      isAuthenticated,
      "role:",
      role
    );
  }, [isAuthenticated, role]);

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={
            <Login
              onLogin={() => {
                setIsAuthenticated(true);
                setRole(localStorage.getItem("role") || "");
              }}
              isAuthenticated={isAuthenticated}
            />
          }
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Home />} />

        {/* Protected admin routes */}
        <Route
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              role={role}
              requiredRole="admin"
              redirectPath="/login"
            />
          }
        >
          <Route
            path="/admin"
            element={
              <AdminDashboard
                onLogout={() => {
                  setIsAuthenticated(false);
                  setRole("");
                  localStorage.removeItem("token");
                  localStorage.removeItem("role");
                }}
              />
            }
          />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <DebugInfo isAuthenticated={isAuthenticated} role={role} />
    </Router>
  );
};

export default App;
