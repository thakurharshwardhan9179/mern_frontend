import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const logoutHandler = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <h2 className="logo">Gym Management</h2>

      <ul className="nav-links">
        {!token && (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Signup</Link></li>
          </>
        )}

        {token && role === "admin" && (
          <>
            <li><Link to="/admin">Dashboard</Link></li>
            <li><Link to="/admin/add-member">Add Member</Link></li>
            <li><Link to="/admin/members">Members</Link></li>
            <li><Link to="/admin/announcement">Announcement</Link></li>
          </>
        )}

        {token && role === "member" && (
          <li><Link to="/member/announcements">Announcements</Link></li>
        )}
           {token && role === "member" && (
  <>
    <li><Link to="/member/dashboard">Dashboard</Link></li>
    {/* <li><Link to="/member/announcements">Announcements</Link></li> */}
  </>
)}

        {token && (
          <li>
            <button className="logout-btn" onClick={logoutHandler}>
              Logout
            </button>
          </li>
        )}
     

      </ul>
    </nav>
  );
};

export default Navbar;
