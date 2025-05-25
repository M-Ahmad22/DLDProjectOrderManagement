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

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
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
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
