import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Dashheader from '../Dashheader/Dashheader';
import './dashboard.css'; // Ensure to import the updated CSS
import config from './../../../utilis/config'
import { FiSettings } from 'react-icons/fi';
import api from './../../../api.js';


const Dashhome = () => {
  const [apiData, setApidata] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null); // State for dropdown visibility
  const [showGstForm, setShowGstForm] = useState(false);
const [gst, setGst] = useState(5); // Default GST value
const [remarks, setRemarks] = useState(""); // Remarks input

 // Fetch States from API
 const GetTowers = async () => {
  try {
    let response = await api.getTowerdetails();
    setApidata(response.data.data);
    console.log("Fetched Towers:", response.data.data);
  } catch (error) {
    console.error("Error Towers states:", error);
  }
};

useEffect(() => {
 
  GetTowers();
}, []);

 

  


  
  
  
  



  return (
    <>
      <Dashheader />
      <div className="dashhome">
        <div className="cards-container">
          {apiData.length > 0 ? (
            apiData.map((tower) => (
              <div key={tower._id} className="tower-card">
                <div className="image-container">
                  <img
                    src={tower.logoLink || 'https://via.placeholder.com/600x400'} // Full-width image
                    alt={tower.name}
                    className="tower-image"
                  />
                  <div className="construction-status">{tower.constructionStatus || 'In Progress'}</div>

                  
                </div>
                <div className="card-info">
                  <h3>{tower.city}-{tower.bedrooms || 'N/A'}</h3>
                  <h3>{tower.name}</h3>
                  <p><strong>Title:</strong> {tower.title}</p>
                  <p><strong>RERA No:</strong> {tower.reraNo || 'N/A'}</p>
                  <p><strong>Price Range:</strong> {tower.priceStartRange || 'N/A'} - {tower.priceEndRange || 'N/A'}</p>
                  <p><strong>State:</strong> {tower.state || 'N/A'}</p>
                  {/* <p><strong>Bedrooms:</strong> {tower.bedrooms || 'N/A'}</p> */}
                </div>
              </div>
            ))
          ) : (
            <p>No data available</p>
          )}
        </div>
      </div>
     
    </>
  );
};

export default Dashhome;
