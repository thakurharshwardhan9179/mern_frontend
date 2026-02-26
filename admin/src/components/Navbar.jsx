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
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-left">
          <h2>Gym Management</h2>
        </div>

        <div className="nav-right">
          {!user && (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup" className="signup-btn">
                Signup
              </Link>
            </>
          )}

          {/* ADMIN LINKS */}
          {user?.role === "admin" && (
            <>
              <Link to="/admin">Dashboard</Link>
              <Link to="/admin/add-member">Add Member</Link>
              <Link to="/admin/members">Members</Link>
              <Link to="/admin/announcement">Announcement</Link>
              <button onClick={handleLogout}>Logout</button>
            </>
          )}

          {/* MEMBER LINKS */}
          {user?.role === "member" && (
            <>
              <Link to="/member/dashboard">Dashboard</Link>
              <Link to="/member/announcements">Announcements</Link>
              <button onClick={handleLogout}>Logout</button>
            </>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
