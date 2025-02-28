import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './addtowers.css';
import Dashheader from '../Dashheader/Dashheader';
import api from './../../../api.js';
import config from './../../../utilis/config';
import { useToasts } from "react-toast-notifications";

const Addtowers = () => {
   const { addToast } = useToasts();
  const [projects, setProjects] = useState([]);
  
const [selectedProject, setSelectedProject] = useState('');


  const [apiData, setApidata] = useState([]);
  const [showExitPopup, setShowExitPopup] = useState(false);


  const handleExit = () => {
    setShowExitPopup(false); // Hide the popup
    navigate('/login/dashboard', { replace: true }); // Navigate to the dashboard
  };
  

  useEffect(() => {
    // Fetch States from API
    const GetStates = async () => {
      try {
        let response = await api.getStateandcitiesformanagement();
        setApidata(response.data.data);
        console.log("Fetched States:", response.data.data);
      } catch (error) {
        console.error("Error fetching states:", error);
      }
    };

    GetStates();
  }, []);

 

  const GetprojectDetails = async () => {
    try {
      let response = await api.getProjectdetails();
      console.log(response, "responseeeeeeeeeeeeeee of get Apiiiiiiiiiiiiiii");
  
      // Store projects in state
      setProjects(response.data.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };
  useEffect(() => {
    GetprojectDetails();   
  }, []);
  


    const storedData = JSON.parse(localStorage.getItem('AdminDetails')) || {};
let managementId = storedData?.data?.data?._id || null;
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    // title: '',
    priceStartRange: '',
    priceEndRange: '',
    city: '',
    state: '',
    street: '',
    pinCode: '',
    location: '',
    createdBy1: managementId,
    step: 1,
    companyId: '',
  });

  const [logo, setLogo] = useState(null);
  const [walkThroughVideo, setWalkThroughVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file inputs separately
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      if (name === 'logo') {
        setLogo(files[0]); // Store file object
      } else if (name === 'walkThroughVideo') {
        setWalkThroughVideo(files[0]); // Store file object
      }
    }
  };



 
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    setMessage(null);

    // Validate file sizes
    if (logo && logo.size > 1048576) {
      alert('Logo size should be 1MB or less.');
      setLoading(false);
      return;
    }

    if (walkThroughVideo && walkThroughVideo.size > 9242880) {
      alert('Walkthrough Video size should be 5MB or less.');
      setLoading(false);
      return;
    }

     // Ensure latest values are inside formData
  const updatedFormData = {
    ...formData,
    priceStartRange: `${priceStartRange} ${priceStartUnit}`,
    priceEndRange: `${priceEndRange} ${priceEndUnit}`,
    projectId: selectedProject,
    companyId: selectedProject ? projects.find(project => project._id === selectedProject)?.companyId : '', // Use companyId from selected project
  };

          
    const data = new FormData();

   // Append all text fields
  Object.keys(updatedFormData).forEach((key) => {
    data.append(key, updatedFormData[key]);
  });
    
    // Append files separately
    if (logo) data.append('logo', logo);
    if (walkThroughVideo) data.append('walkThroughVideo', walkThroughVideo);

    // Debugging: Log FormData contents
    for (let pair of data.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      console.log('Submitting data to API...');
      const response = await api.addTowers(data);
      console.log('  Response:', response );

      console.log('API Response:', response.data);
      setMessage({ type: 'success', text: 'Tower added successfully!' });
            // alert('navigating to step2')
      // Navigate to Step 2 with towerId
      // const towerId = response.data?._id || response.data?.data?._id;
      // console.log('Extracted Tower ID:', towerId);
      

      // navigate('/addtowers/step2', { state: { towerId:towerId  }, replace: true });
      // Check if the response is successful
    if (response.data?._id || response.data?.data?._id) {
      addToast( "step1 submitted successfully", {
        appearance: "success",
        autoDismiss: true,
      });
      const towerId = response.data?._id || response.data?.data?._id;
      console.log('Extracted Tower ID:', towerId);

     // Navigate to Step 2 with towerId, companyId, and projectId
     navigate('/addtowers/step2', { 
      state: { 
        towerId, 
        companyId: updatedFormData.companyId, 
        projectId: updatedFormData.projectId 
      },
      replace: true 
    });
    }
    else{
      addToast( "something went wrong", {
        appearance: "error",
        autoDismiss: true,
      });
      console.error('Failed to submit form');
    }

      

    } catch (error) {
      console.error('API Error:', error);
      setMessage({ type: 'error', text: 'Error submitting form. Please try again.' });
    } finally {
      setLoading(false);
    }
  };



  const [priceStartRange, setPriceStartRange] = useState("");
const [priceStartUnit, setPriceStartUnit] = useState("");
const [priceEndRange, setPriceEndRange] = useState("");
const [priceEndUnit, setPriceEndUnit] = useState("");

const handleInputChange = (e) => {
  const { name, value } = e.target;
  if (name === "priceStartRange") setPriceStartRange(value);
  if (name === "priceEndRange") setPriceEndRange(value);
};


  return (
    <>
      <Dashheader />
      <div className="addtowers">
        <h2>Add Project - Step 1</h2>

        {message && <div className={`message ${message.type}`}>{message.text}</div>}

        <form onSubmit={handleSubmit} className="addtowers-form">
          <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
          {/* <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} required /> */}
          {/* <input type="text" name="priceStartRange" placeholder="Price Start Range" value={formData.priceStartRange} onChange={handleChange} required />
          <input type="text" name="priceEndRange" placeholder="Price End Range" value={formData.priceEndRange} onChange={handleChange} required /> */}
          {/* <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} required />
          <input type="text" name="state" placeholder="State" value={formData.state} onChange={handleChange} required /> */}
              <div className="price-range">
  <label>Price Start Range:</label>
  <div className="price-input-group">
    <input
      type="text"
      name="priceStartRange"
      value={priceStartRange}
      onChange={handleInputChange}
      required
    />
    <div className="radio-group">
      <label>
        <input
          type="radio"
          name="priceStartUnit"
          value="Lakhs"
          checked={priceStartUnit === "Lakhs"}
          onChange={(e) => setPriceStartUnit(e.target.value)}
          required
        />
        Lakhs
      </label>
      <label>
        <input
          type="radio"
          name="priceStartUnit"
          value="Crores"
          checked={priceStartUnit === "Crores"}
          onChange={(e) => setPriceStartUnit(e.target.value)}
          required
        />
        Crores
      </label>
    </div>
  </div>
</div>
      
<div className="price-range">
  <label>Price End Range:</label>
  <div className="price-input-group">
    <input
      type="text"
      name="priceEndRange"
      value={priceEndRange}
      onChange={handleInputChange}
      required
    />
    <div className="radio-group">
      <label>
        <input
          type="radio"
          name="priceEndUnit"
          value="Lakhs"
          checked={priceEndUnit === "Lakhs"}
          onChange={(e) => setPriceEndUnit(e.target.value)}
          required
        />
        Lakhs
      </label>
      <label>
        <input
          type="radio"
          name="priceEndUnit"
          value="Crores"
          checked={priceEndUnit === "Crores"}
          onChange={(e) => setPriceEndUnit(e.target.value)}
          required
        />
        Crores
      </label>
    </div>
  </div>
</div>


           <select
        name="state"
        value={formData.state}
        onChange={handleChange}
        required
      >
        <option value="">Select State</option>
        {apiData.map((item) => (
          <option key={item.state} value={item.state}>
            {item.state}
          </option>
        ))}
      </select>

      {/* City dropdown */}
      <select
        name="city"
        value={formData.city}
        onChange={handleChange}
        required
      >
        <option value="">Select City</option>
        {apiData
          .filter((item) => item.state === formData.state) // Filter cities by selected state
          .map((item) => (
            <option key={item.city} value={item.city}>
              {item.city}
            </option>
          ))}
      </select>
      <select
            name="project"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            required
          >
            <option value="">Select Project</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.name}
              </option>
            ))}
          </select>



          <input type="text" name="street" placeholder="Street" value={formData.street} onChange={handleChange} required />
          <input type="text" name="pinCode" placeholder="Pin Code" value={formData.pinCode} onChange={handleChange} required />
          <textarea name="location" placeholder="Location (iframe)" value={formData.location} onChange={handleChange} required />

          <label>Logo (Max 1MB):
            <input type="file" name="logo" accept="image/*" onChange={handleFileChange} required />
          </label>

          <label>Walkthrough Video (Max 5MB):
            <input type="file" name="walkThroughVideo" accept="video/*" onChange={handleFileChange} required />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Save and Next'}
          </button>

               {/* Exit button */}
        <button
          type="button"
          onClick={() => setShowExitPopup(true)}
          className="exit-button"
        >
          Exit
        </button>

        {/* Exit confirmation popup */}
        {showExitPopup && (
          <div className="exit-popup">
            <p>Are you sure you want to exit without saving?</p>
            <button onClick={handleExit}>Yes</button>
            <button onClick={() => setShowExitPopup(false)}>No</button>
          </div>
        )}
        </form>
      </div>
    </>
  );
};

export default Addtowers;
