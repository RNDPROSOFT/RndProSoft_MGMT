  import React, { useState, useEffect } from 'react';  
  import './dashheader.css';
  import websitelogo from './../../../assests/images/lyonoralogo.png';
  import { Link, useNavigate, useParams } from 'react-router-dom'; 
  import api from './../../../api.js';
  import utilis from '../../../utilis/index.js';
  import { FiSettings } from 'react-icons/fi';
  import config from './../../../utilis/config'
  import axios from 'axios';
  import { useToasts } from "react-toast-notifications";



  const Dashheader = () => {
     const { addToast } = useToasts();
    const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
    const [showCustomerDropdownMobile, setShowCustomerDropdownMobile] = useState(false);
    const [showPartnerDropdown, setShowPartnerDropdown] = useState(false);
    const [showPartnerDropdownMobile, setShowPartnerDropdownMobile] = useState(false);
    const [showEmiDropdownMobile, setShowEmiDropdownMobile] = useState(false);
    const [showUpdateEmi, setShowUpdateEmi] = useState(false);
    const [updateemiremarks, setupdateemiRemarks] = useState({});


    


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
      // formData.append('title', companyName);       
      formData.append('phone', phoneNumber);       // Backend expects 'phone'
      // formData.append('devlogo', null);         
    
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
      navigate('/');
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
              navigate('/');
              window.history.replaceState(null, '', '/');
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

  const [showEmiPopup, setShowEmiPopup] = useState(false);

  const [showCreateEmiForm, setShowCreateEmiForm] = useState(false);



  const [emiData, setEmiData] = useState({
    name: "",
    months: "",
    intrestRate: "",
    createdBy:managementId, // Hidden field
  });

  const handleEmiClick = () => {
    setShowEmiPopup(true);
    setShowCreateEmiForm(false); // Ensure form is hidden initially
  };

  const handlehistoryClick = () => {
    console.log('Navigating to history');
    navigate("/dashboard/bookingflats");
    // alert('Navigating to history');
  };
  
  // Handle form input changes
  const handleCreateEmiChange = (e) => {
    setEmiData({ ...emiData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleCreateEmiSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.createEmiPlan(emiData);
      console.log("EMI Created Successfully", response.data);
      if (response.data.success) {
        // alert(`${firstName} is added successfully`);
        addToast( `emi plan created successfully`, {
          appearance: "success",
          autoDismiss: true,
        })
        setEmiData({
          name:"",
          months: "",
          intrestRate: "",
          createdBy:managementId

        })
      }
      else{
        addToast( response.data?.message || "Something went wrong!", {
          appearance: "error",
          autoDismiss: true,
        })
      }
      handleClosePopup();
     
    } catch (error) {
      console.error("Error creating EMI:", error);
      alert("Failed to create EMI plan.");
    }
  };


  

    // Function to open the GST popup
    const handleGstClick = () => {
      setShowGstPopup(true);
      setOpenDropdown(null); // Close the dropdown when clicking GST

    };
    
    // Function to close the GST popup
    const handleClosePopup = () => {
      setShowGstPopup(false);
      setShowEmiPopup(false)
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
        // console.log("Fetched Gst:", response.data.data);
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
        if (response.data.success) {
          // alert(`${firstName} is added successfully`);
          addToast( `Gst updated scuucessfully`, {
            appearance: "success",
            autoDismiss: true,
          })
         
        }
        else{
          addToast( response.data?.message || "Something went wrong!", {
            appearance: "error",
            autoDismiss: true,
          })
        }
        // alert("GST updated successfully!");
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

    const [getAllEmiPlans, setgetAllEmiPlans] = useState([]);

    // Fetch project details using the API
    const GetAllEmiPlans = async () => {

      try {
        let response = await api.getAllEmiPlans();
        setgetAllEmiPlans(response.data.data);
        console.log(response.data.data ,'emiplans')
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
  
    useEffect(() => {
      GetAllEmiPlans();
    }, []);
  
   
    // Handle Remarks Change
  const handleUpdateEmiRemarksChange = (id, value) => {
    setupdateemiRemarks((prev) => ({ ...prev, [id]: value }));
  };
  const [updatedEmiData, setUpdatedEmiData] = useState({});

// Function to handle input changes
const handleEmiFieldChange = (id, field, value) => {
  setUpdatedEmiData((prevData) => ({
    ...prevData,
    [id]: {
      ...prevData[id],
      [field]: value,
    },
  }));
};


const handleUpdateEmi = async (id) => {
  try {
    // Get the previous data from the original EMI plan
    const previousData = getAllEmiPlans.find((plan) => plan._id === id);

    if (!previousData) {
      alert("EMI plan not found!");
      return;
    }

    // Get the updated data (if changed) or keep the previous value
    const updatedData = updatedEmiData[id] || {};

    const updateData = {
      _id: id,
      name: updatedData.name !== undefined ? updatedData.name : previousData.name,
      months: updatedData.months !== undefined ? updatedData.months : previousData.months,
      intrestRate: updatedData.intrestRate !== undefined ? updatedData.intrestRate : previousData.intrestRate,
      isVisible: updatedData.isVisible !== undefined ? updatedData.isVisible : previousData.isVisible,
      updatedBy: managementId,
      remarks: updateemiremarks[id] || "", // Remarks from state
    };

    // Send API request to update EMI plan
    const response = await api.updateEmiPlan(updateData);

    if (response.status === 200) {
      console.log("EMI Plan Updated Successfully:", response.data);
      addToast("EMI updated successfully", { appearance: "success", autoDismiss: true });

      // Refresh EMI plans after update
      GetAllEmiPlans();
    } else {
      console.error("Failed to update EMI plan:", response);
      addToast(response.data?.message || "Something went wrong!", { appearance: "error", autoDismiss: true });
    }
  } catch (error) {
    console.error("Error updating EMI plan:", error);
    alert("Error updating EMI plan");
  }
};


 
    return (
      <>
        <div className="dashheader">
          <div className="websitelogo">
            <img src={websitelogo} alt="Website Logo" />
          </div>
          
          {/* Navigation for large screens */}
          <div className="navigationscreens large-screen">
            <Link to="/login/dashboard">Dashboard</Link>
            <Link to="/dashboard/addtowers">Add Project</Link>
            <Link to="/dashboard/addusers">Add Management</Link>
            <Link to="/dashboard/advancepayment">Advance Payment</Link>

            {/* <Link to="/dashboard/addcustomer">Add Customer</Link> */}
            <div 
    className="customer-dropdown-container" 
    onMouseEnter={() => setShowCustomerDropdown(true)} 
    onMouseLeave={() => setShowCustomerDropdown(false)}
  >
    <Link to="#" className="customer-main-link">Customer</Link>
    <div className={`customer-dropdown ${showCustomerDropdown ? "show" : ""}`}>
      <Link to="/dashboard/addcustomer">Add Customer</Link>
      <Link to="/dashboard/getcustomerlist">Customer Details</Link>
      {/* <Link to="/dashboard/editcustomer">Edit Customer</Link> */}
    </div>
  </div>

  {/* for partner */}
  <div 
    className="customer-dropdown-container" 
    onMouseEnter={() => setShowPartnerDropdown(true)} 
    onMouseLeave={() => setShowPartnerDropdown(false)}
  >
    <Link to="#" className="customer-main-link">Partner</Link>
    <div className={`customer-dropdown ${showPartnerDropdown ? "show" : ""}`}>
      <Link to="/dashboard/Addproject">Add Partner</Link>
      <Link to="/dashboard/partnerdetails">Partner</Link>
      {/* <Link to="/dashboard/editpartner">Edit Partner</Link> */}
    </div>
  </div>
            {/* <Link to="/dashboard/Addproject">Add Partner</Link> */}
            
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
    
    <div className="dropdown-menu">
  <Link onClick={handleGstClick} className="dropdown-itemheader">GST</Link>
  <Link onClick={handleEmiClick} className="dropdown-itemheader">EMI</Link>
  <Link to='/dashboard/history' className="dropdown-itemheader">Report</Link>

</div>


    


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
                  Add Project
                </Link>
                <Link to="/dashboard/addusers" onClick={toggleMenu}>
                  Add Management
                </Link>
                <Link to="/dashboard/advancepayment">Advance Payment</Link>
                <Link to='/dashboard/history' className="dropdown-itemheader">Report</Link>
                {/* Add Customer with Dropdown */}
                <div className={`customer-dropdown-container-mobile ${showCustomerDropdownMobile ? 'show' : ''}`}>
    <Link to="#" onClick={() => setShowCustomerDropdownMobile(!showCustomerDropdownMobile)}>
     Customer       ▼
    </Link>
    <div className="customer-dropdown-mobile">
      <Link to="/dashboard/addcustomer" onClick={toggleMenu}>Add Customer</Link>
      <Link to="/dashboard/getcustomerlist">Customer Details</Link>

      {/* <Link to="/dashboard/editcustomer" onClick={toggleMenu}>Edit Customer</Link> */}
    </div>
  </div>
{/* for partners */}

{/* const [showPartnerDropdownMobile, setShowPartnerDropdownMobile] = useState(false); */}



 <div className={`customer-dropdown-container-mobile ${showPartnerDropdownMobile ? 'show' : ''}`}>
    <Link to="#" onClick={() => setShowPartnerDropdownMobile(!showPartnerDropdownMobile)}>
  Partner      ▼
    </Link>
    <div className="customer-dropdown-mobile">
      <Link to="/dashboard/Addproject" onClick={toggleMenu}>Add Partner</Link>
      <Link to="/dashboard/partnerdetails">Partner</Link>
      {/* <Link to="/dashboard/editpartner" onClick={toggleMenu}>Edit Partner</Link> */}
    </div>
  </div>
             
  <Link onClick={handleEmiClick} className="dropdown-itemheader">EMI</Link>
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
          
          {/* <label>
            Company Name:
            <input
              type="text"
              name="companyName"
              value={companyName} // use state variable here
              onChange={handleInputChange}
              required
              placeholder="Enter Company Name"
            />
          </label> */}

          {/* <label>
            Upload Image:
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleInputChange}
              required
            />
          </label> */}

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





{showEmiPopup && (
  <div className="gst-popup">
    <div className="popup-content">
      {!showCreateEmiForm && !showUpdateEmi ? ( // Show options if no form is open
        <>
          <h2>EMI PLANS</h2>
          <button onClick={() => setShowCreateEmiForm(true)}>Create EMI</button>
          <button onClick={() => setShowUpdateEmi(true)}>Update EMI</button>
          <button className="close-popup" onClick={handleClosePopup}>Close</button>
        </>
      ) : showCreateEmiForm ? ( // Show Create EMI Form
        <form onSubmit={handleCreateEmiSubmit} className="emi-form">
          <h2>Create EMI Plan</h2>
          <input type="text" name="name" placeholder="Plan Name" value={emiData.name} onChange={handleCreateEmiChange} required />
          <input type="number" name="months" placeholder="Number of Months" value={emiData.months} onChange={handleCreateEmiChange} required />
          <input type="number" name="intrestRate" placeholder="Interest Rate (%)" step="0.1" value={emiData.intrestRate} onChange={handleCreateEmiChange} required />
          <button type="submit">Submit</button>
          <button className="close-popup" onClick={handleClosePopup}>Cancel</button>
        </form>
      ) : ( // Show Update EMI List
        <div className="update-emi">
  {/* Close (X) Button */}
  <button className="close-button" onClick={handleClosePopup}>✖</button>
  
  <h2>Update EMI</h2>
  
  <div className="emi-list">
    {getAllEmiPlans.length > 0 ? (
      getAllEmiPlans.map((plan) => (
        <div className="emi-item" key={plan._id}>
          <input 
            type="text" 
            value={updatedEmiData[plan._id]?.name || plan.name} 
            onChange={(e) => handleEmiFieldChange(plan._id, "name", e.target.value)}
          />

          <input 
            type="number" 
            value={updatedEmiData[plan._id]?.months || plan.months}  
            onChange={(e) => handleEmiFieldChange(plan._id, "months", e.target.value)}
          />

          <input 
            type="number" 
            value={updatedEmiData[plan._id]?.intrestRate || plan.intrestRate}  
            onChange={(e) => handleEmiFieldChange(plan._id, "intrestRate", e.target.value)}
          />
          
          {/* Remarks Field */}
          <textarea
            placeholder="Enter remarks..."
            value={updateemiremarks[plan._id] || ""}
            onChange={(e) => handleUpdateEmiRemarksChange(plan._id, e.target.value)}
          />

          {/* Checkbox for isVisible */}
          <label>
            <input 
              type="checkbox" 
              checked={updatedEmiData[plan._id]?.isVisible ?? plan.isVisible}  
              onChange={(e) => handleEmiFieldChange(plan._id, "isVisible", e.target.checked)}
            />
            Is Visible
          </label>

          {/* Update EMI Button */}
          <button className="update-button" onClick={() => handleUpdateEmi(plan._id)}>
            Update EMI
          </button>
        </div>
      ))
    ) : (
      <p>Loading EMI Plans...</p>
    )}
  </div>
</div>
      )}
    </div>
  </div>
)}



      </>
    );
  };

  export default Dashheader;
