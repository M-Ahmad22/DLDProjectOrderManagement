import React from "react";
import Navbar from "../Components/Navbar/Navbar";
import Form from "../Components/Form/Form";
import "./Home.css";
const Home = () => {
  return (
    <div>
      <>
        <div className="HomeCentralCon">
          <Navbar />
          <div className="homeFormCon">
            <Form />
          </div>
        </div>
      </>
    </div>
  );
};

export default Home;
