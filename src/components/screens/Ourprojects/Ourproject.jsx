import React, { useState, useEffect } from 'react';
import api from './../../../api.js';
import Header from '../../Header/Header';
import './ourprojects.css';

const Ourproject = () => {
  const [towers, setTowers] = useState([]);
  const [filteredTowers, setFilteredTowers] = useState([]);
  const [states, setStates] = useState([]); // Store states from API
  
  const [constructionStatus, setConstructionStatus] = useState('');
  const [projectType, setProjectType] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [allTowers, setAllTowers] = useState([]); // Store original unfiltered towers


  const GetTowerDetails = async (projectId = "", constructionStatus = "", projectType = "", state = "") => {
    try {
      let response = await api.getTowerdetailsforUser(projectId, constructionStatus, projectType, state);
      console.log("Full API Response:", response.data);
  
      if (response.data?.data?.length > 0 && Array.isArray(response.data.data[0].data)) {
        console.log("Extracted Towers Data:", response.data.data[0].data);
        setAllTowers(response.data.data[0].data); // Store full unfiltered list
        console.log(response.data.data[0].data,'dataa')
        setTowers(response.data.data[0].data);
        setFilteredTowers(response.data.data[0].data);
      } else {
        console.log("No Data Found!");
        setAllTowers([]);
        setTowers([]);
        setFilteredTowers([]);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      setAllTowers([]);
      setTowers([]);
      setFilteredTowers([]);
    }
  };
  

  

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
    GetTowerDetails();
    GetStates();
  }, []);

  // Filtering Function
  useEffect(() => {
    let filtered = allTowers.filter(tower =>
      (constructionStatus ? tower.constructionStatus === constructionStatus : true) &&
      (projectType ? tower.projectType === projectType : true) &&
      (selectedState ? tower.state === selectedState : true)
    );
    setFilteredTowers(filtered);
  }, [constructionStatus, projectType, selectedState, allTowers]);
  


  const [selectedProject, setSelectedProject] = useState('');
const [selectedProjectId, setSelectedProjectId] = useState('');
useEffect(() => {
  GetTowerDetails(selectedProjectId, constructionStatus, projectType, selectedState);
}, [selectedProjectId, constructionStatus, projectType, selectedState]);





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

  const handleSelectClick = async () => {
    await GetTowerDetails(); // Call API
  };
 

  return (
    <>
      <Header />
              <div className="our-projects-container">
      {/* Filters Section */}
      <div className="filters-container">
      <h3 className="filters-title">Filter Towers</h3> {/* Added Title */}

        
    
      <select
      onClick={handleSelectClick} // Fetch data when clicking dropdown
      onChange={(e) => setConstructionStatus(e.target.value)}
      value={constructionStatus}
    >
      <option value="">Select Construction Status</option>

      {allTowers.length > 0 ? (
        [...new Set(allTowers.map((tower) => tower.constructionStatus))].map((status, index) => (
          <option key={index} value={status}>
            {status}
          </option>
        ))
      ) : (
        <option disabled>Loading...</option>
      )}
    </select>




<select  onClick={handleSelectClick}  onChange={(e) => setProjectType(e.target.value)} value={projectType}>
  <option value="">Select Project Type</option>
  {Array.from(new Set(allTowers.map(tower => tower.projectType))).map((type, index) => (
    <option key={index} value={type}>{type}</option>
  ))}
</select>


<select onChange={(e) => setSelectedState(e.target.value)} value={selectedState}>
  <option value="">Select State</option>
  {states.map((stateObj, index) => (
    <option key={index} value={stateObj.state}>{stateObj.state}</option>
  ))}                   
</select>

   <select
  onChange={(e) => {
    const project = projects.find(proj => proj._id === e.target.value);
    setSelectedProject(e.target.value);
    const projectId = project ? project._id : '';
    setSelectedProjectId(projectId);
    GetTowerDetails(projectId); // Fetch towers based on project _id
  }}
  value={selectedProject}
>
  <option value="">Select Patterned Project</option>
  {projects.map((project, index) => (
    <option key={index} value={project._id}>{project.name}</option>
  ))}
</select>




  </div>

      {/* Display Filtered Towers */}
      <div className="alltowersforuser">
        {filteredTowers.length > 0 ? (
          filteredTowers.map((tower, index) => (
            <div key={index} className="tower-card">
              <div className="tower-image-wrapper">
                <img
                  src={tower.logoLink?.[0] || "default-logo.jpg"}
                  alt={tower.title || "No Title"}
                  className="tower-image"
                />
                <span className="construction-status">{tower.constructionStatus}</span>
              </div>
              <div className="tower-content">
                <h2 className="tower-title">{tower.title} - {tower.project}</h2>
                <p className="tower-details"><strong>Location:</strong> {tower.city}, {tower.state}</p>
                <p className="tower-details"><strong>Price Range:</strong> {tower.priceStartRange} - {tower.priceEndRange}</p>
                <p className="tower-details"><strong>Project Type:</strong> {tower.projectType}</p>
                <p className="tower-details"><strong>Total Units:</strong> {tower.totalUnits}</p>
                <p className="tower-details"><strong>Development Size:</strong> {tower.developmentSize} acres</p>
                <p className="tower-details"><strong>RERA No:</strong> {tower.reraNo}</p>
                <button className="view-details-btn">
                  View Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No projects found.</p>
        )}
      </div>
      </div>
    </>
  );
};

export default Ourproject;
