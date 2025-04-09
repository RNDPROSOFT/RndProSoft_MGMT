import React, { useState, useEffect } from 'react';
import api from './../../../api.js';
import Dashheader from '../Dashheader/Dashheader';

import './dashboard.css';
import { useLocation,useNavigate  } from "react-router-dom";
import Loading from '../../../utilis/Loading.js';
import utilis from '../../../utilis';

const Dashhome = () => {
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();


  
  useEffect(() => {
    if (location.state?.filters) {
      console.log("Filters received:", location.state.filters); // Debugging
  
      // Set filters first
      setConstructionStatus(location.state.filters.constructionStatus || "");
      setProjectType(location.state.filters.projectType || "");
      setSelectedState(location.state.filters.selectedState || "");
  
      // Fetch towers first
      GetTowerDetails().then((towers) => {
        if (!towers || !Array.isArray(towers)) {
          console.error("Error: Towers data is invalid", towers);
          return;
        }
  
        console.log("Towers fetched:", towers); // Debugging
  
        setTimeout(() => {
          filterProjects(location.state.filters, towers);
        }, 100); // Small delay to ensure state updates before filtering
      }).catch(error => console.error("Error fetching towers:", error));
    } else {
      GetTowerDetails(); // Fetch all towers if no filters exist
    }
  }, [location.state]);
  

  
  
  const [towers, setTowers] = useState([]);
  const [filteredTowers, setFilteredTowers] = useState([]);
  const [states, setStates] = useState([]); // Store states from API
  
  const [constructionStatus, setConstructionStatus] = useState('');
  const [projectType, setProjectType] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [allTowers, setAllTowers] = useState([]); // Store original unfiltered towers


  const GetTowerDetails = async (projectId = "", constructionStatus = "", projectType = "", state = "") => {
    try {
      let response = await api.getTowerdetailsformanagement(projectId, constructionStatus, projectType, state);
      console.log("Full API Response:", response.data);
  

      if(response.status === 401){
        console.log("Session Expired! Redirecting to Login.");
        localStorage.removeItem(utilis.string.localStorage.sessionId);
        localStorage.removeItem(utilis.string.localStorage.userData);
        navigate('/');
      }
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
        return []; // ✅ Return empty array
      }

    } catch (error) {
      console.error("Error fetching projects:", error);
      setAllTowers([]);
      setTowers([]);
      setFilteredTowers([]);
      return []; // ✅ Return empty array
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
    setLoading(true); // Start loading
    try {
      let response = await api.getTowerdetails();
      setProjects(response.data.data);
      console.log(response.data.data)
    } catch (error) {
      console.error("Error fetching projects:", error);
    }finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    GetprojectDetails();
  }, []);

  const handleSelectClick = async () => {
    await GetTowerDetails(); // Call API
  };
  


  const handleViewDetails = (tower) => {
    if (!tower || !tower.name || !tower._id) return;
  
    // Store tower _id in localStorage before navigation
    localStorage.setItem("selectedTowerId", tower._id);
  
    // Convert name to URL-friendly slug
    const slug = tower.name.toLowerCase().replace(/\s+/g, "-");
    navigate(`/individualtowermanagement/${slug}`);
  };
  
  
  const handleFlatDetails = (tower) => {
    if (!tower || !tower.name || !tower._id) return;
  
    // Store tower _id in localStorage before navigation
    localStorage.setItem("selectedTowerId", tower._id);
  
    navigate(`/dashboard/Flatdetails`);
  };
  






const [filteredData, setFilteredData] = useState([]); 
useEffect(() => {
  if (location.state?.filters) {
    console.log("Filters received:", location.state.filters); // Debugging
    setConstructionStatus(location.state.filters.constructionStatus || "");
    setProjectType(location.state.filters.projectType || "");
    setSelectedState(location.state.filters.selectedState || "");
    
    // Apply filter logic
    filterProjects(location.state.filters);
  } else {
    GetTowerDetails(); // Fetch all towers if no filters exist
  }
}, [location.state]);

const filterProjects = (filters, towers) => {
  if (!towers || !Array.isArray(towers)) {
    console.error("Towers data is undefined or not an array:", towers);
    return;
  }

  let filtered = towers.filter((tower) =>
    (filters.constructionStatus ? tower.constructionStatus === filters.constructionStatus : true) &&
    (filters.projectType ? tower.projectType === filters.projectType : true) &&
    (filters.selectedState ? tower.state === filters.selectedState : true)
  );

  console.log("Filtered Projects:", filtered); // Debugging
  setFilteredTowers(filtered); // Update state with filtered results
};


;

  return (
    <>
    
      <Dashheader />
    
      {loading ? (
      <Loading/>
    ) : (

              <div className="our-projects-container">
      {/* Filters Section */}
      <div className="filters-container">
      <h3 className="filters-title">Filter projects</h3> {/* Added Title */}

        
    
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

{/* <select
  onChange={(e) => {
    const project = projects.find(proj => proj._id === e.target.value);
    setSelectedProject(e.target.value);
    const projectId = project ? project._id : '';
    setSelectedProjectId(projectId);
    
    // Fetch Towers based on project selection and other filters
    GetTowerDetails(projectId, constructionStatus, projectType, selectedState);
  }}
  value={selectedProject}
>
  <option value="">Select Patterned Project</option>
  {projects.map((project, index) => (
    <option key={index} value={project._id}>{project.name}</option>
  ))}
</select> */}





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
                <h2 className="tower-title">{tower.name} </h2>
                <p className="tower-details"><strong>Location:</strong> {tower.city}, {tower.state}</p>
                <p className="tower-details"><strong>Price Range:</strong> {tower.priceStartRange} - {tower.priceEndRange}</p>
                <p className="tower-details"><strong>Project Type:</strong> {tower.projectType}</p>
                <p className="tower-details"><strong>Total Units:</strong> {tower.totalUnits}</p>
                <p className="tower-details"><strong>Development Size:</strong> {tower.developmentSize} acres</p>
                <p className="tower-details"><strong>RERA No:</strong> {tower.reraNo}</p>
                <p className="tower-details">
                <strong>Is Visible:</strong> {tower.isVisible ? "Yes" : "No"}
              </p>

                
                <button className="view-details-btn"onClick={() => handleViewDetails(tower)} style={{marginRight:"15px"}}>
                  View Details
                </button>
                <button className="view-details-btn"onClick={() => handleFlatDetails(tower)}>
                  Book Flats
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No projects found.</p>
        )}
      </div>
      </div>
    )}
    </>
  );
};

export default Dashhome;
