import { Link } from "react-router-dom";
import "./Navbar.css";

const PublicNavbar = () => {
  return (
    <nav className="navbar">
      <h2 className="logo">🏋️ GymPro</h2>

      <div className="links">
        <Link to="/">Home</Link>
        {/* <Link to="/login">Login</Link>
        <Link to="/signup" className="btn-nav">Join Now</Link> */}
      </div>
    </nav>
  );
};

export default PublicNavbar;