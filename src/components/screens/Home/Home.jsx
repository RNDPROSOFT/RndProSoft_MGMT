import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './home.css';
import Footer from '../../Footer/Footer';
import Header from '../../Header/Header';
import { locations } from './../../Location/Location.jsx';

import bangalore from './../../../assests/images/Bangalore1.png'
import hyderabad from './../../../assests/images/Hyderabad1.png'
import Kerala from './../../../assests/images/Kerala1.png'
import Chennai from './../../../assests/images/Chennai1.png'
import Aboutus from '../Aboutus/Aboutus.jsx';

const Home = () => {
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedBHK, setSelectedBHK] = useState("");
  const [selectedConstructionStatus, setSelectedConstructionStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFlats, setFilteredFlats] = useState([]);
  const navigate = useNavigate(); // Used to navigate programmatically

  useEffect(() => {
    // Get all flats from the locations data initially
    const allFlats = Object.values(locations).flat();
    setFilteredFlats(allFlats);
  }, []);

  // Filter flats based on selected filters
  useEffect(() => {
    const allFlats = Object.values(locations).flat();
    
    // Apply the filters
    const filtered = allFlats.filter((flat) => {
      const matchesCity = !selectedCity || flat.city.toLowerCase() === selectedCity.toLowerCase();
      const matchesBHK = !selectedBHK || flat.bhkType === selectedBHK;
      const matchesStatus = !selectedConstructionStatus || flat.constructionStatus === selectedConstructionStatus;
      const matchesSearch = !searchQuery || (flat.city && flat.city.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCity && matchesBHK && matchesStatus && matchesSearch;
    });

    setFilteredFlats(filtered);
  }, [selectedCity, selectedBHK, selectedConstructionStatus, searchQuery]);

  // Handle filter changes and redirect to OurProjects with filters
  const handleFilterChange = () => {
    const queryParams = new URLSearchParams();
    if (selectedCity) queryParams.append('city', selectedCity);
    if (selectedBHK) queryParams.append('bhk', selectedBHK);
    if (selectedConstructionStatus) queryParams.append('status', selectedConstructionStatus);
  
    navigate(`/ourprojects?${queryParams.toString()}`);
  };
  
    


  return (
    <>
      <Header />
      <div className="home-container">
        {/* Hero Section */}
        <div className="homelaptopbanner1">
          <div className="homehero-contentlaptop">
            {/* <h2>Find Your Dream Home</h2>
            <p>Browse through the best properties available in your area</p> */}
            <div className="homefilter-bar">
            <div className="homefliter1">
            <h2 autoFocus>Find Your Dream Home</h2>
            <p autoFocus>Browse through the best properties available in your area</p>
            </div>
             <div className="homefliter2">
               {/* City Dropdown */}
               <select onChange={(e) => setSelectedCity(e.target.value) } value={selectedCity} className='homefilter-select'>
                <option value="">Select City</option>
                {Object.values(locations).flat().map((flat) => (
                  <option key={flat.id} value={flat.city}>{flat.city}</option>
                ))}
              </select>

              {/* BHK Type Dropdown */}
              <select onChange={(e) => setSelectedBHK(e.target.value)} value={selectedBHK} className='homefilter-select'>
                <option value="">Select BHK Type</option>
                {["1BHK", "2BHK", "3BHK", "4BHK", "5BHK+"].map((bhk) => (
                  <option key={bhk} value={bhk}>{bhk}</option>
                ))}
              </select>

              {/* Construction Status Dropdown */}
              <select onChange={(e) => setSelectedConstructionStatus(e.target.value)} value={selectedConstructionStatus} className='homefilter-select'>
                <option value="">Select Construction Status</option>
                {["Ready to Move", "Under Construction", "New Launch"].map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>

              <button className="homesearch-btn" onClick={handleFilterChange}>Search</button>
             </div>
            </div>
          </div>
        </div>

        <section className="homehero-section">
          <div className="homehero-content">
           <div className="homeherocontent1">
           <h2>Find Your Dream Home</h2>
            <p>Browse through the best properties available in your area</p>
            <Link to="/ourprojects" className="homecta-btn">Explore Projects</Link>
          </div>
           </div>
        </section>

       
          <div className="homelocations">
            <div className="homelocationsheadings">
            <h2>
              our main locations
            </h2>
            </div>
            <div className="homelocationsimage">
              <img src={bangalore} alt="" />
              <img src={hyderabad} alt="" />
              <img src={Kerala} alt="" />
              <img src={Chennai} alt="" />
            </div>
           
          </div>

          {/* <div id="aboutus">
            <Aboutus />
          </div> */}






        {/* About Us Section */}
        {/* <section className="homeabout-us">
          <h2>About Us</h2>
          <p>We are a real estate company dedicated to helping you find the perfect home. Our team of experts is here to assist you every step of the way.</p>
          <Link to="/aboutus" className="homecta-btn">Learn More</Link>
        </section> */}

        {/* Contact Us Section */}
        {/* <section className="homecontact-us">
          <h2>Get in Touch</h2>
          <p>If you have any questions, feel free to contact us and we’ll get back to you shortly.</p>
          <Link to="/contactus" className="homecta-btn">Contact Us</Link>
        </section> */}
      </div>



      <Aboutus/>

      {/* <Footer /> */}
    </>
  );
};

export default Home;
