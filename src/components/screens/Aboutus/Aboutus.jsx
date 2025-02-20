import { useEffect, useState, useRef } from "react";
import CountUp from 'react-countup'; // Install this using "npm install react-countup"
import './aboutus.css';
import Footer from '../../Footer/Footer';
import Header from '../../Header/Header';

import Expertise from './../../../assests/images/aboutexclusive1.jpg'
import trust from './../../../assests/images/abouttrust1.jpg'
import Exclusive from './../../../assests/images/aboutexpertise1.jpg'

import ceo from './../../../assests/images/ceo.webp'
import aboutimage from '../../../assests/images/aboutusimage1.png'
import api from './../../../api.js';
import Home from "../Home/Home";
import ImageScroller from "./Scrollingimages";
import Amenities from "./Scrollingimages";
const Aboutus = () => {

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    emailId: '',
    countryCode: '91',
    scheduleDate: '',
    scheduleTime: '',
    marketingUpdates: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

 

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await api.enquiryForm(formData);
    
    if (response.status === 200) {
      console.log('Form submitted successfully', response.data);

      alert('Form submitted successfully')

       // Reset form fields
       setFormData({
        name: '',
        mobile: '',
        emailId: '',
        countryCode: '91',
        scheduleDate: '',
        scheduleTime: '',
        marketingUpdates: false
      });
      
    } else {
      console.error('Failed to submit form');
    }
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
};





  const [isVisible, setIsVisible] = useState(false);
  const teamRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (teamRef.current) {
      observer.observe(teamRef.current);
    }

    return () => {
      if (teamRef.current) {
        observer.unobserve(teamRef.current);
      }
    };
  }, []);


  const testimonialsData = [
    {
      name: 'John Doe',
      role: 'Real Estate Investor',
      testimonial: 'This platform helped me find my dream property. Highly recommended for anyone looking for a home!',
    },
    {
      name: 'Jane Smith',
      role: 'Home Buyer',
      testimonial: 'The experience was fantastic! I found exactly what I was looking for, and the team was amazing throughout.',
    },
    {
      name: 'David Lee',
      role: 'Architect',
      testimonial: 'As an architect, I highly appreciate the quality and attention to detail in the properties listed here. A great resource!',
    },
    {
      name: 'Sarah Brown',
      role: 'Property Manager',
      testimonial: 'This site made the process of finding the right investment properties so much easier. Excellent service!',
    },
    {
      name: 'Michael Johnson',
      role: 'Home Buyer',
      testimonial: 'Great platform with a wide range of options. The entire process was smooth and stress-free.',
    },
    {
      name: 'Emily White',
      role: 'Real Estate Agent',
      testimonial: 'Highly efficient platform for finding and selling properties. A must-try for any real estate professional.',
    },
    // Add more testimonials as needed
  ];
  
  const Testimonial = ({ name, role, testimonial }) => (
    <div className="testimonial">
      <p>"{testimonial}"</p>
      <strong>{name}</strong>
      <p className="role">{role}</p>
    </div>
  );
  
  


  return (
    <>
      <Header />
      {/* <div className="home">
      <Home/>
      </div>
      */}
      <div className="aboutus-container">
        <div className="aboutus-content">

            <div className="aboutimage">
              <img src={aboutimage} alt="" />
            </div>
          {/* Left Section */}
          <div className="about-text">
            <h2 autoFocus>About Lyonora</h2>
            <p>
              Lyonora is a premier real estate company dedicated to providing exceptional properties that meet the needs of modern living. 
              Driven by a vision to redefine real estate, we combine innovation, quality, and a customer-first approach to deliver spaces that inspire trust and enrich lives.
            </p>
            <p>
              Since our inception, Lyonora has successfully completed a diverse range of world-class residential, commercial, and retail projects. 
              With every venture, we aim to set new benchmarks in excellence and sustainability. Our properties are designed to meet the evolving needs of modern communities, 
              blending functionality, aesthetics, and environmental responsibility. At Lyonora, we believe in building more than just structures; we build dreams, aspirations, and vibrant communities. Each of our projects is a testament to our 
              commitment to craftsmanship, innovation, and delivering value that exceeds expectations.
            </p>
            {/* <p>
              At Lyonora, we believe in building more than just structures; we build dreams, aspirations, and vibrant communities. Each of our projects is a testament to our 
              commitment to craftsmanship, innovation, and delivering value that exceeds expectations.
            </p>
            <p>
              Our team comprises seasoned professionals who bring decades of experience and a passion for excellence to every project. From architects and designers to 
              engineers and customer support, every member of the Lyonora family shares a common goal: to transform visions into reality and create spaces that resonate with 
              beauty and purpose.
              We are proud to contribute to the growth of cities and neighborhoods, fostering connections and creating landmarks that stand as symbols of quality and trust.
            </p> */}





          </div>

          {/* Right Section */}
          {/* <div className="about-stats">
            <div className="stat">
              <h3>
                <CountUp start={0} end={20} duration={6} />+
              </h3>
              <p>Years of Excellence</p>
            </div>
            <div className="stat">
              <h3>
                <CountUp start={0} end={500} duration={6} />+
              </h3>
              <p>Projects Completed</p>
            </div>
            <div className="stat">
              <h3>
                <CountUp start={0} end={150} duration={6} />+
              </h3>
              <p>Mn. Sq. Ft. Delivered</p>
            </div>
            <div className="stat">
              <h3>
                <CountUp start={0} end={80} duration={6} />+
              </h3>
              <p>Mn. Sq. Ft. Underway</p>
            </div>
          </div> */}
        </div>
      </div>
       {/* Right Section */}
          <div className="about-stats">
            <div className="stat">
              <h3>
                <CountUp start={0} end={20} duration={6} />+
              </h3>
              <p>Years of Excellence</p>
            </div>
            <div className="stat">
              <h3>
                <CountUp start={0} end={500} duration={6} />+
              </h3>
              <p>Projects Completed</p>
            </div>
            <div className="stat">
              <h3>
                <CountUp start={0} end={150} duration={6} />+
              </h3>
              <p>Mn. Sq. Ft. Delivered</p>
            </div>
            <div className="stat">
              <h3>
                <CountUp start={0} end={80} duration={6} />+
              </h3>
              <p>Mn. Sq. Ft. Underway</p>
            </div>
          </div>

      <section className="why-invest">
      <div className="container">
        <h2 className="section-title">Why You Are Investing With Us</h2>
        <div className="reasons">
        <div className="reason">
  <img src={Expertise} alt="Expertise" className="reason-img" />
  <div className="reason-content">
    <h3>Expertise</h3>
    <p>Our team has over 20 years of experience in the real estate market, providing top-tier advice and strategies.</p>
  </div>
</div>

          <div className="reason">
            <img src={trust} alt="Trustworthiness" className="reason-img" />
            <div className="reason-content">
            <h3>Trustworthiness</h3>
            <p>We have a proven track record of transparent dealings and ethical practices that build long-lasting trust.</p>
          </div>
          </div>
          <div className="reason">
            <img src={Exclusive} alt="Exclusive Opportunities" className="reason-img" />
            <div className="reason-content">
            <h3>Exclusive Opportunities</h3>
            <p>We offer access to exclusive investment opportunities that you won’t find anywhere else.</p>
          </div>
          </div>
        </div>
        {/* <div className="cta">
          <p>Let’s build your future together.</p>
          <button className="cta-button">Get Started</button>
        </div> */}
      </div>
    </section>

    <div className="testimonials-section">
      <h2 className="testimonials-heading">What Our Clients Say</h2>
      <div className="testimonials-container">
        <div className="testimonials-wrapper">
          {testimonialsData.map((item, index) => (
            <Testimonial key={index} {...item} />
          ))}
        </div>
      </div>
    </div>
    <section className="team" ref={teamRef}>
      <div className="container">
        <h2>Meet Our Team</h2>
        <div className="team-members">
          <div className={`member ${isVisible ? "visible" : ""}`}>
            <img src={ceo} alt="CEO" />
            <h3>John Doe</h3>
            <p>CEO & Founder</p>
          </div>
          <div className={`member ${isVisible ? "visible" : ""}`}>
            <img src={ceo} alt="Manager" />
            <h3>Jane Smith</h3>
            <p>Operations Manager</p>
          </div>
        </div>
      </div>
    </section>

    <div className="ImageScroller">
      <Amenities/>
    </div>

{/* <div className="homecontactus">
        <div className="homecontact-container">
          <div className="homecontact-header">
            <h2>Enquiry</h2>
            <p>We’d love to hear from you! Whether you have questions or need assistance, feel free to reach out to us.</p>
          </div>

          <form onSubmit={handleSubmit} className="homecontact-form">
            <div className="homeform-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="homeform-input"
              />
            </div>

            <div className="homeform-group homemobile-group">
              <label htmlFor="mobile">Mobile</label>
              <div className="homemobile-container">
                <select
                  id="countryCode"
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  required
                  className="homeform-input country-code"
                >
                  <option value="91">+91 (India)</option>
                  <option value="1">+1 (USA)</option>
                  <option value="44">+44 (UK)</option>
                  <option value="61">+61 (Australia)</option>
                </select>
                <input
                  type="text"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                  className="homeform-input mobile-number"
                />
              </div>
            </div>

            <div className="homeform-group">
              <label htmlFor="emailId">Email ID</label>
              <input
                type="email"
                id="emailId"
                name="emailId"
                value={formData.emailId}
                onChange={handleChange}
                required
                className="homeform-input"
              />
            </div>

            <div className="homeform-group">
              <label htmlFor="scheduleDate">Schedule Date</label>
              <input
                type="date"
                id="scheduleDate"
                name="scheduleDate"
                value={formData.scheduleDate}
                onChange={handleChange}
                required
                className="homeform-input"
              />
            </div>

            <div className="homeform-group">
              <label htmlFor="scheduleTime">Schedule Time</label>
              <input
                type="time"
                id="scheduleTime"
                name="scheduleTime"
                value={formData.scheduleTime}
                onChange={handleChange}
                required
                className="homeform-input"
              />
            </div>

            <div className="homeform-group">
              <label htmlFor="marketingUpdates">
                <input
                  type="checkbox"
                  id="marketingUpdates"
                  name="marketingUpdates"
                  checked={formData.marketingUpdates}
                  onChange={handleChange}
                  className="homeform-checkbox"
                />
                Receive Marketing Updates
              </label>
            </div>

            <button type="submit" className="homesubmit-btn">
              Submit
            </button>
          </form>
        </div>
      </div> */}

      <Footer />
    </>
  );
};

export default Aboutus;
