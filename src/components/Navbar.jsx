import { useState } from "react";
import { NavLink } from "react-router-dom";

import "./Navbar.css";

import logo from "../assets/logo.png";

function Navbar() {

  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">

      {/* LOGO + COLLEGE NAME */}
      <div className="navbar-logo">

        <img
          src={logo}
          alt="Shree Narayana Guru College Logo"
        />

        <span>
          SHREE NARAYANA GURU COMPOSITE PU COLLEGE
        </span>

      </div>


      {/* DESKTOP NAVIGATION */}
      <div className="navbar-links">

        <NavLink to="/home">
          Home
        </NavLink>

        <NavLink to="/home#about">
          About
        </NavLink>

        <NavLink to="/courses">
          Courses
        </NavLink>

        <NavLink to="/facilities">
          Facilities
        </NavLink>

        <NavLink to="/events">
          Events
        </NavLink>

        <NavLink to="/achievements">
          Achievements
        </NavLink>

        <NavLink to="/faculties">
          Faculties
        </NavLink>

        <NavLink to="/contact">
          Contact
        </NavLink>

      </div>


      {/* MOBILE / TABLET MENU BUTTON */}
      <button
        className={`menu-button ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Open navigation menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>


      {/* MOBILE / TABLET MENU */}
      <div className={`mobile-menu ${menuOpen ? "show" : ""}`}>

        <NavLink
          to="/home"
          onClick={closeMenu}
        >
          Home
        </NavLink>

        <NavLink
          to="/home#about"
          onClick={closeMenu}
        >
          About
        </NavLink>

        <NavLink
          to="/courses"
          onClick={closeMenu}
        >
          Courses
        </NavLink>

        <NavLink
          to="/facilities"
          onClick={closeMenu}
        >
          Facilities
        </NavLink>

        <NavLink
          to="/events"
          onClick={closeMenu}
        >
          Events
        </NavLink>

        <NavLink
          to="/achievements"
          onClick={closeMenu}
        >
          Achievements
        </NavLink>

        <NavLink
          to="/faculties"
          onClick={closeMenu}
        >
          Faculties
        </NavLink>

        <NavLink
          to="/contact"
          onClick={closeMenu}
        >
          Contact
        </NavLink>

      </div>

    </nav>
  );
}

export default Navbar;