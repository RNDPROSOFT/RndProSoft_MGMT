import React, { useState } from 'react';
import websitelogo from './../../assests/images/lyonoralogo.png';
import { Link } from 'react-router-dom';
import './header.css';



const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  

  return (
    <>
      <div className="header">
        <div className="websitelogo">
          <img src={websitelogo} alt="Website Logo" />
        </div>
        {/* Navigation for large screens */}
        <div className="navigationscreens large-screen">
          <Link to="/">Home</Link>
        
          <Link to="/aboutus">About Us</Link>
          <Link to="/ourprojects">Our Projects</Link>
          <Link to="/contactus">Contact Us</Link>
          <Link to="/blogs">Blogs</Link>
          {/* <Link to="/login">Login</Link> */}
          
        </div>
        {/* Toggle button for small screens */}
        <div className="mobile-menu">
  <button
    className="menu-toggle"
    onClick={toggleMenu}
    aria-expanded={isMenuOpen}
    aria-controls="side-navigation"
    aria-label="Toggle navigation menu"
  >
    ☰
  </button>
  {isMenuOpen && (
    <div id="side-navigation" className="side-navigation">
      <button className="close-menu" onClick={toggleMenu} aria-label="Close menu">
        ✖
      </button>
      <Link to="/" onClick={toggleMenu}>
        Home
      </Link>
      <Link to="/aboutus" onClick={toggleMenu}>
        About Us
      </Link>
      <Link to="/ourprojects" onClick={toggleMenu}>
        Our Projects
      </Link>
      <Link to="/contactus" onClick={toggleMenu}>
        Contact Us
      </Link>
      <Link to="/blogs" onClick={toggleMenu}>
        Blogs
      </Link>
    </div>
  )}
</div>

      </div>
    </>
  );
};

export default Header;
