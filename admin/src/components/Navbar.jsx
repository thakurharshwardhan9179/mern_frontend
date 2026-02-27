import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <h2>Gym Management</h2>
      </div>

      {/* Hamburger */}
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>

      <div className={`nav-right ${menuOpen ? "active" : ""}`}>
        {!user && (
          <>
            <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
            <Link to="/signup" className="signup-btn" onClick={() => setMenuOpen(false)}>
              Signup
            </Link>
          </>
        )}

        {user?.role === "admin" && (
          <>
            <Link to="/admin" onClick={() => setMenuOpen(false)}>Dashboard</Link>
            <Link to="/admin/add-member" onClick={() => setMenuOpen(false)}>Add Member</Link>
            <Link to="/admin/members" onClick={() => setMenuOpen(false)}>Members</Link>
            <Link to="/admin/announcement" onClick={() => setMenuOpen(false)}>Announcement</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}

        {user?.role === "member" && (
          <>
            <Link to="/member/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
            <Link to="/member/announcements" onClick={() => setMenuOpen(false)}>Announcements</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
