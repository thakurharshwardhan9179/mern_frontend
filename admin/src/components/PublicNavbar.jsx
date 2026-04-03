import { useState } from "react";
import "./PublicNavbar.css";

const PublicNavbar = () => {

const [menuOpen,setMenuOpen] = useState(false);

return ( <nav className="navbar">

  <h1 className="logo">
    <i className="fa-solid fa-dumbbell"></i> FitZon
  </h1>

  {/* HAMBURGER ICON */}

  <div
    className="menu-icon"
    onClick={()=>setMenuOpen(!menuOpen)}
  >
    <i className="fa-solid fa-bars"></i>
  </div>

  {/* NAV LINKS */}

  <div className={menuOpen ? "links active" : "links"}>

    <a href="/#home">
      <i className="fa-solid fa-house"></i> Home
    </a>

    <a href="/#features">
      <i className="fa-solid fa-fire"></i> Features
    </a>

    <a href="/#gallery">
      <i className="fa-solid fa-image"></i> Gallery
    </a>

    <a href="/#trainers">
      <i className="fa-solid fa-user"></i> Trainers
    </a>

    <a href="/#contact">
      <i className="fa-solid fa-phone"></i> Contact
    </a>

  </div>

</nav>

);
};

export default PublicNavbar;
