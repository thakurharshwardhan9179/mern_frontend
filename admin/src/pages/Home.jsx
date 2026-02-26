import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="home">
      {/* HERO SECTION */}
      <section className="hero">
        <div className="overlay"></div>

        <div className="hero-content">
          <h1>
            Transform Your Body <br />
            <span>Build Your Strength</span>
          </h1>

          <p>
            Join the most trusted gym in your city.  
            Modern machines, certified trainers, and a powerful environment
            to achieve your fitness goals.
          </p>

          <div className="hero-buttons">
            <Link to="/signup" className="btn primary">
              Join Now
            </Link>
            <Link to="/login" className="btn secondary">
              Member Login
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <div className="feature-card">
          💪
          <h3>Modern Equipment</h3>
          <p>Latest machines for strength & cardio training.</p>
        </div>

        <div className="feature-card">
          🏋️
          <h3>Expert Trainers</h3>
          <p>Certified trainers to guide your fitness journey.</p>
        </div>

        <div className="feature-card">
          ⏰
          <h3>Flexible Timings</h3>
          <p>Morning & evening batches available.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;