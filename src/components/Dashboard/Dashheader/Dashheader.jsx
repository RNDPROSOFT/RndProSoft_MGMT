import React, { useState, useEffect } from 'react';  
import './dashheader.css';
import websitelogo from './../../../assests/images/lyonoralogo.png';
import { Link, useNavigate, useParams } from 'react-router-dom'; 
import api from './../../../api.js';
import utilis from '../../../utilis/index.js';


const Dashheader = () => {
  let navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false); // State for logout popup
  const [showAddDeveloperPopup, setShowAddDeveloperPopup] = useState(false);
  const [engineerName, setEngineerName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [image, setImage] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  
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

  return (
    <>
      <div className="dashheader">
        <div className="websitelogo">
          <img src={websitelogo} alt="Website Logo" />
        </div>
        
        {/* Navigation for large screens */}
        <div className="navigationscreens large-screen">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/dashboard/addtowers">Add Towers</Link>
          <Link to="/dashboard/addusers">Add users</Link>
          <Link to="#"  onClick={() => setShowAddDeveloperPopup(true)}>Add Developers</Link>
          {/* Use Link for logout with onClick handler */}
          <Link to="#" onClick={handleLogoutClick} className="logout-btn">
            Logout
          </Link>
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
              <Link to="/dashboard" onClick={toggleMenu}>
                Dashboard
              </Link>
              <Link to="/dashboard/addtowers" onClick={toggleMenu}>
                Add Towers
              </Link>
              <Link to="/dashboard/addusers" onClick={toggleMenu}>
                Add users
              </Link>
              <Link to="#"  onClick={() => setShowAddDeveloperPopup(true)}>Add Developers</Link>
              {/* Use Link for logout with onClick handler */}
              <Link to="#" onClick={handleLogoutClick} className="logout-btn">
                Logout
              </Link>
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





    </>
  );
};

export default Dashheader;
