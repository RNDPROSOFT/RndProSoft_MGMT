import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './home.css';
import Footer from '../../Footer/Footer';
import Header from '../../Header/Header';
import { locations } from './../../Location/Location.jsx';
import api from './../../../api.js';
import config from './../../../utilis/config';

import bangalore from './../../../assests/images/Bangalore1.png'
import hyderabad from './../../../assests/images/Hyderabad1.png'
import Kerala from './../../../assests/images/Kerala1.png'
import Chennai from './../../../assests/images/Chennai1.png'
import Aboutus from '../Aboutus/Aboutus.jsx';

const Home = () => {
 
  const [selectedConstructionStatus, setSelectedConstructionStatus] = useState('');
  const [selectedProjectType, setSelectedProjectType] = useState('');
  
  const navigate = useNavigate();

  const handleSearch = () => {
    const queryParams = new URLSearchParams({
      constructionStatus: selectedConstructionStatus,
      projectType: selectedProjectType,
      state: selectedState
    }).toString();
  
    navigate(`/ourprojects?${queryParams}`);
  };
  
   const [filteredTowers, setFilteredTowers] = useState([]);
  const [projects, setProjects] = useState([]);

  // Fetch project details using the API
  const GetprojectDetails = async () => {
    try {
      let response = await api.getallprojectsforuser();
      setProjects(response.data.data);
      console.log(response.data.data)
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    GetprojectDetails();
  }, []);
  




 const [states, setStates] = useState([]); // Store states from API
  const [towers, setTowers] = useState([]);
  const [constructionStatus, setConstructionStatus] = useState('');
  const [projectType, setProjectType] = useState('');
  const [selectedState, setSelectedState] = useState('');
  
  // Fetch States from API
  const GetStates = async () => {
    try {
      let response = await api.getStateandcities();
      setStates(response.data.data);
      console.log("Fetched States:", response.data.data);
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  useEffect(() => {
   
    GetStates();
  }, []);

  // Filtering Function
  useEffect(() => {
    let filtered = towers.filter(tower =>
      (constructionStatus ? tower.constructionStatus === constructionStatus : true) &&
      (projectType ? tower.projectType === projectType : true) &&
      (selectedState ? tower.state === selectedState : true)
    );
    setFilteredTowers(filtered);
  }, [constructionStatus, projectType, selectedState, towers]);



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
               <select onChange={(e) => setSelectedConstructionStatus(e.target.value)} className='homefilter-select'>
      <option value="">Select Construction Status</option>
      <option value="Under Construction">Under Construction</option>
      <option value="Ready to Move">Ready to Move</option>
      <option value="New Launch">New Launch</option>
     
    </select>

    <select onChange={(e) => setSelectedProjectType(e.target.value)} className='homefilter-select'>
      <option value="">Select Project Type</option>
      <option value="Apartment">Apartment</option>
      <option value="Commercial">Commercial</option>
      <option value="Villa">Villa</option>    

    </select>

    <select onChange={(e) => setSelectedState(e.target.value)} className='homefilter-select'>
      <option value="">Select State</option>
        {states.map((stateObj, index) => (
          <option key={index} value={stateObj.state}>{stateObj.state}</option>
        ))}                   
    </select>
    <button className="homesearch-btn" onClick={handleSearch}>Search</button>

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
          <div className="userclientproject">
      <h2>Our Partnered Projects</h2>
      <div className="projects-container">
        {projects.map((project) => (
          <div key={project.projectId} className="project-card">
            <div className="project-image">
              <img
                src={project.proLogo}
                alt={project.name}
                className="project-logo"
              />
              <img
                src={project.proGalary[0]} // Assuming the first image in the gallery
                alt={project.title}
                className="project-thumbnail"
              />
            </div>
            <div className="project-info">
              <h3>{project.name}-{project.title}</h3>
             
              <p>{project.about}</p>
              
              <p>
                <strong>Status:</strong> {project.status}
              </p>
              <p>
                <strong>Location:</strong> {project.city}, {project.state}
              </p>
              <p>
                <strong>EmailId:</strong> {project.emailId}
              </p>
              {/* <p>
                <strong>Contact:</strong> {project.phoneNumber}
              </p> */}
              <button className="view-details-btn">
            View Details
          </button>
            </div>
          </div>
        ))}
      </div>
    </div>
        
      </div>



      <Aboutus/>

      {/* <Footer /> */}



          


    </>
  );
};

export default Home;
