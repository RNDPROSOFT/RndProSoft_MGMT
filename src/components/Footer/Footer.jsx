import React from 'react';
import { Link } from 'react-router-dom';
import './footer.css';

const Footer = () => {
  return (
    <div className="footer">
      {/* Footer Links */}
      <div className="footer-links">
      <Link to="/">Home</Link>
        <Link to="/aboutus">About Us</Link>
        {/* <Link to="/ourprojects">Our Projects</Link> */}
        <Link to="/contactus">Contact Us</Link>
        {/* <Link to="/terms">Terms of Service</Link> */}
        <Link to="/privacy">Privacy Policy</Link>
        
      </div>

      {/* Social Media Icons */}
      <div className="social-media">
        <Link to="https://facebook.com" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-facebook"></i>
        </Link>
        <Link to="https://twitter.com" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-twitter"></i>
        </Link>
        <Link to="https://linkedin.com" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-linkedin"></i>
        </Link>
        <Link to="https://instagram.com" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-instagram"></i>
        </Link>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} Real Estate Company | All Rights Reserved | <Link to="/sitemap">Sitemap</Link>
      </div>
    </div>
  );
};

export default Footer;
