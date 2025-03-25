import React, { useState, useEffect,useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from './../../../../api.js';
import './partnerdetails.css'
import Dashheader from './../../Dashheader/Dashheader'
import utilis from '../../../../utilis';

const Partnerdetails = () => {
    const [projects, setProjects] = useState([]);


    const navigate = useNavigate();
    // Fetch project details using the API
  const GetpartnerDetails = async () => {
    try {
      let response = await api.getPartnerdetails();
      setProjects(response.data.data);
      console.log(response.data.data)
      if(response.status === 401){
        console.log("Session Expired! Redirecting to Login.");
        localStorage.removeItem(utilis.string.localStorage.sessionId);
        localStorage.removeItem(utilis.string.localStorage.userData);
        navigate('/');
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    GetpartnerDetails();
  }, []);
  

  const handleViewDetails = (_id) => {
    console.log("Navigating to:", `/dashboard/editpartner/${_id}`); 
    navigate(`/dashboard/editpartner/${_id}`);
  };
  
        
  return (
    <>
    <Dashheader/>

    <div className="userclientproject">
      <h2>Our Partnered Projects</h2>
      <div className="projects-container">
        {projects.map((project) => (
          <div key={project.projectId} className="project-card">
          
            <div className="project-info">
              <h3>{project.name}</h3>
             
             
            
              <button className="view-details-btn" onClick={() => handleViewDetails(project._id)}>
  View Details
</button>


            </div> 
         </div>
        ))}
      </div>
    </div>

    
    
    </>
    
  )
}

export default Partnerdetails