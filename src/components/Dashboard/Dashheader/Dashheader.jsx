import React, { useState, useEffect } from 'react';  
import './dashheader.css';
import websitelogo from './../../../assests/images/lyonoralogo.png';
import { Link, useNavigate, useParams } from 'react-router-dom'; 
import api from './../../../api.js';
import utilis from '../../../utilis/index.js';
import { FiSettings } from 'react-icons/fi';
import config from './../../../utilis/config'
import axios from 'axios';




const Dashheader = () => {
  let navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false); // State for logout popup
  const [showAddDeveloperPopup, setShowAddDeveloperPopup] = useState(false);
  const [engineerName, setEngineerName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [image, setImage] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
    const [openDropdown, setOpenDropdown] = useState(null); // State for dropdown visibility
  
  
  
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setImage(files[0]);
    } else if (name === 'engineerName') {
      setEngineerName(value);
    } else if (name === 'companyName') {
      setCompanyName(value);
    } else if (name === 'phoneNumber') {
      setPhoneNumber(value);
    }
    
    console.log(`${name}:`, value);  // Check state change for each input
  };
  
  

  const handleFormSubmit = async (e) => {
    e.preventDefault();

     // Check if the image size exceeds 1MB (1MB = 1048576 bytes)
  if (image && image.size > 1048576) {
    alert("Image size should be 1MB or less. Please upload a smaller image.");
    return; // Stop form submission if the image is too large
  }

  
    const formData = new FormData();
    formData.append('name', engineerName);       // Backend expects 'name'
    formData.append('title', companyName);       // Backend expects 'title'
    formData.append('phone', phoneNumber);       // Backend expects 'phone'
    formData.append('devlogo', image);           // Backend expects 'devlogo'
  
    // Debugging: Check the FormData entries
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
  
    try {
      const response = await api.addDeveloper(formData);
      console.log('Response:', response);
      if (response.data.success) {
        alert('Developer added successfully!');
          // Reset input fields after successful submission
      setEngineerName('');
      setCompanyName('');
      setImage('');
      setPhoneNumber('');
      
      // Optionally close the popup
      setShowAddDeveloperPopup(false);



      } else {
        alert(`Failed to add developer: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Error occurred:', error);
      alert('An error occurred while adding the developer.');
    }
  };
  
  
  
  


  // const { mgmtId } = useParams(); 

//this below line is locally storing data
  // const storedData = JSON.parse(localStorage.getItem('AdminDetails'));

  // let managementId = storedData.data.data._id
  // Safely get storedData
const storedData = JSON.parse(localStorage.getItem('AdminDetails')) || {};
let managementId = storedData?.data?.data?._id || null;

// Redirect to login if no admin details
useEffect(() => {
  if (!managementId) {
    navigate('/login');
  }
}, [managementId, navigate]);

 


  
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  // Function to handle logout confirmation
  const handleLogoutClick = (e) => {
    e.preventDefault(); // Prevent the default navigation
    setShowLogoutPopup(true); // Show the logout confirmation popup
  };
  

    



  // Function to handle the actual logout action
  const confirmLogout = async() => {
   
     setShowLogoutPopup(false);
    try{
      console.log('enter into try')
        
  
       let response= await api.logOut(managementId)
       console.log(response,"response")

       if (response.data.success){
            // navigate('/login')
            localStorage.removeItem('AdminDetails');  
            navigate('/login');
            window.history.replaceState(null, '', '/login');
       }else {
           alert('failed to logout')
       }
  }
    catch (e) {
      console.log('hbcjkb')
    }
  };
  



  








  // Function to cancel logout
  const cancelLogout = () => {
    setShowLogoutPopup(false); // Close the popup without logging out
  };











  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);

const toggleSettingsDropdown = () => {
  setShowSettingsDropdown(!showSettingsDropdown);
};

// Close dropdown when clicking outside
useEffect(() => {
  const handleClickOutside = (event) => {
    if (!event.target.closest('.settings-container')) {
      setShowSettingsDropdown(false);
    }
  };
  document.addEventListener('click', handleClickOutside);
  return () => {
    document.removeEventListener('click', handleClickOutside);
  };
}, []);

const [showGstPopup, setShowGstPopup] = useState(false);
const [showGstForm, setShowGstForm] = useState(false);
const [gst, setGst] = useState("");
const [remarks, setRemarks] = useState("");

// const handleGstClick = () => {
//   setShowGstPopup(true); // Show the popup when GST is clicked
// };

// const handleClosePopup = () => {
//   setShowGstPopup(false);
//   setShowGstForm(false); // Reset form when closing popup
// };

// const handleGstUpdate = (e) => {
//   e.preventDefault();
//   console.log("GST:", gst, "Remarks:", remarks);
//   handleClosePopup(); // Close popup after submission
// };



  // Function to open the GST popup
  const handleGstClick = () => {
    setShowGstPopup(true);
    setOpenDropdown(null); // Close the dropdown when clicking GST

  };
  
  // Function to close the GST popup
  const handleClosePopup = () => {
    setShowGstPopup(false);
  };


   // Fetch States from API
   const GetGst = async () => {
    try {
      let response = await api.getGst();
      console.log("GST API Response:", response.data);
        if (response.data.data.length > 0) {
          setGstId(response.data.data[0]._id); // Store GST ID
          setGst(response.data.data[0].gst); // Set GST value
        }
      console.log("Fetched Gst:", response.data.data);
    } catch (error) {
      console.error("Error fetching Gst:", error);
    }
  };

  useEffect(() => {
   
    GetGst();
  }, []);

 


  const handleGstUpdate = async (e) => {
    e.preventDefault();
    const storedData = JSON.parse(localStorage.getItem('AdminDetails')) || {};
    let managementId = storedData?.data?.data?._id || null;
    const body = {
      gstId: gstId,
      gst: parseInt(gst),
      updatedBy: managementId,
      remarks,
      isVisible: true
    };
  
    try {
      let response= await api.updateGst(body)
      console.log(response,"response")
      alert("GST updated successfully!");
       // Clear the remarks field
    setRemarks("");
      setShowGstForm(false)
     
      setShowGstPopup(false); // Close the popup after updating
    } catch (error) {
      console.error("Error updating GST:", error);
      alert("Failed to update GST");
    }
  };
  
  const [gstId, setGstId] = useState(""); // State for GST ID

  





  return (
    <>
      <div className="dashheader">
        <div className="websitelogo">
          <img src={websitelogo} alt="Website Logo" />
        </div>
        
        {/* Navigation for large screens */}
        <div className="navigationscreens large-screen">
          <Link to="/login/dashboard">Dashboard</Link>
          <Link to="/dashboard/addtowers">Add Towers</Link>
          <Link to="/dashboard/addusers">Add Management</Link>
          <Link to="/dashboard/addcustomer">Add Customer</Link>
          <Link to="/dashboard/Addproject">Add Project</Link>
          <Link to="#"  onClick={() => setShowAddDeveloperPopup(true)}>Add Developers</Link>
         
          {/* Use Link for logout with onClick handler */}
          <Link to="#" onClick={handleLogoutClick} className="logout-btn">
            Logout
          </Link>
          <div className="settings-container">
  <div className="settings-icon" onClick={toggleSettingsDropdown}>
    <FiSettings size={20} />
  </div>

  {showSettingsDropdown && (
    <div className="settings-dropdown">
   
  <Link onClick={handleGstClick}>GST</Link>


    </div>
  )}
</div>

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
              <button
                className="close-menu"
                onClick={toggleMenu}
                aria-label="Close menu"
              >
                ✖
              </button>
              <Link to="/login/dashboard" onClick={toggleMenu}>
                Dashboard
              </Link>
              <Link to="/dashboard/addtowers" onClick={toggleMenu}>
                Add Towers
              </Link>
              <Link to="/dashboard/addusers" onClick={toggleMenu}>
                Add users
              </Link>
              <Link to="#"  onClick={() => setShowAddDeveloperPopup(true)}>Add Developers</Link>
              <Link onClick={handleGstClick}>GST</Link>
              {/* Use Link for logout with onClick handler */}
              <Link to="#" onClick={handleLogoutClick} className="logout-btn">
                Logout
              </Link>
              {/* <div className="settings-container">
  <div className="settings-icon" onClick={toggleSettingsDropdown}>
    <FiSettings size={20} />
  </div>

  {showSettingsDropdown && (
    <div className="settings-dropdown">
   
  <Link onClick={handleGstClick}>GST</Link>


    </div>
  )}
</div> */}

              
            </div>
          )}
        </div>
      </div>

      {/* Full-screen Logout confirmation popup */}
      {showLogoutPopup && (
        <div className="logout-popup">
          <div className="popup-content">
            <p>Are you sure you want to logout?</p>
            <div className="popup-actions">
              <button onClick={confirmLogout}>Yes</button>
              <button onClick={cancelLogout}>No</button>
            </div>
          </div>
        </div>
      )}






    
{showAddDeveloperPopup && (
  <div className="popup-overlay">
    <div className="popup-content">
      <h2>Add Developer</h2>
      <form onSubmit={handleFormSubmit}>
        <label>
          Engineer Name:
          <input
            type="text"
            name="engineerName"
            value={engineerName} // use state variable here
            onChange={handleInputChange}
            required
            placeholder="Enter Engineer Name"
          />
        </label>
        
        <label>
          Company Name:
          <input
            type="text"
            name="companyName"
            value={companyName} // use state variable here
            onChange={handleInputChange}
            required
            placeholder="Enter Company Name"
          />
        </label>

        <label>
          Upload Image:
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleInputChange}
            required
          />
        </label>

        <label>
          Phone Number:
          <input
            type="tel"
            name="phoneNumber"
            value={phoneNumber} // use state variable here
            onChange={handleInputChange}
            required
            placeholder="Enter Phone Number"
          />
        </label>
       

        <div className="popup-buttons">
          <button type="submit" className="submit-button">Submit</button>
          <button type="button" onClick={() => setShowAddDeveloperPopup(false)} className="cancel-button">Cancel</button>
        </div>
      </form>
    </div>
  </div>
)}



{showGstPopup && (
  <div className="gst-popup">
    <div className="popup-content">
      {showGstForm ? (
        // GST Update Form
       <form className="gst-form-container" onSubmit={handleGstUpdate}>
  <h2 className="gst-form-title">Update GST</h2>

  <div className="gst-form-group">
    <label className="gst-form-label">GST:</label>
    <input
  type="number"
  className="gst-form-input"
  value={gst}
  onChange={(e) => setGst(e.target.value)}
  required
 
/>

  </div>

  <div className="gst-form-group">
    <label className="gst-form-label">Remarks:</label>
    <textarea
      className="gst-form-textarea"
      value={remarks}
      onChange={(e) => setRemarks(e.target.value)}
      required
    />
  </div>

  <div className="gst-form-actions">
    <button type="submit" className="gst-form-submit">Submit</button>
    <button className="gst-form-close" onClick={handleClosePopup}>Close</button>
  </div>
</form>

      ) : (
        // Initial GST Popup
        <>
          <h2>GST Management</h2>
          <button onClick={() => setShowGstForm(true)}>Update GST</button>
          <button className="close-popup" onClick={handleClosePopup}>Close</button>
        </>
      )}
    </div>
  </div>
)}

    </>
  );
};

export default Dashheader;
