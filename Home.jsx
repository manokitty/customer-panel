import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home">
      <div className="hero-section">
        <h1>Taste The Difference</h1>
        <p>
          When the going gets tough, the tough get grilling. <br />
          Bringing heat to the meat.
        </p>
        <button className="menu-button" onClick={() => navigate("/menu-management")}>
          Our Menus
        </button>
      </div>
    </div>
  );
};

export default Home;
