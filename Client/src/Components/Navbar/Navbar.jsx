import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import Login from "../Login-Signup/Login";
import Signup from "../Login-Signup/Signup";
import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  const [showModal, setShowModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const toggleModal = () => setShowModal(!showModal);
  const switchForm = () => setIsLogin(!isLogin);

  return (
    <>
      <div className="navbar">
        <div className="navbar-left">
          <h1 className="navTitle">DLD PROJECTS</h1>
          {/* <Link to="/">Home</Link> */}
        </div>
        <div className="navbar-right">
          <span
            className="admin-icon"
            onClick={toggleModal}
            style={{ cursor: "pointer", color: "white", fontSize: "24px" }}
          >
            <FaUserCircle />
          </span>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={toggleModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="modal-close" onClick={toggleModal}>
              &times;
            </span>
            {isLogin ? (
              <>
                <Login />
                <p className="toggle-link" onClick={switchForm}>
                  Don’t have an account? <strong>Signup</strong>
                </p>
              </>
            ) : (
              <>
                <Signup />
                <p className="toggle-link" onClick={switchForm}>
                  Already have an account? <strong>Login</strong>
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
