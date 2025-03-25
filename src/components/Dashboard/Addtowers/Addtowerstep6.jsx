import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Dashhome from '../Dashhome/Dashhome';
import Dashheader from '../Dashheader/Dashheader';
import api from './../../../api.js';
import { useToasts } from "react-toast-notifications";
import Loading from '../../../utilis/Loading.js';
import utilis from '../../../utilis';

const Addtowerstep6 = () => {
  const [showExitPopup, setShowExitPopup] = useState(false);
      
      
        const handleExit = () => {
          setShowExitPopup(false); // Hide the popup
          navigate('/login/dashboard', { replace: true }); // Navigate to the dashboard
        };
  let navigate = useNavigate();
  const { addToast } = useToasts();
  const location = useLocation();
   const { towerId, companyId, projectId  } = location.state || {}; // Receive towerId from previous steps

   
     useEffect(() => {
       console.log('🚀 Received towerId in Step 5:', towerId,companyId,projectId);
     }, [towerId, companyId, projectId ]);


     useEffect(() => {
      if (towerId) {
        fetchBlockData(towerId);
      }
    }, [towerId]);
  
    const fetchBlockData = async (towerId) => {
      setLoading(true);
      try {
        const response = await api.getParticularbasedontowers(towerId);
        if (response.data && response.data.data) {
          setBlockData(response.data.data);
          console.log(response.data.data,'blockdata')
        } else {
          setBlockData([]);
        }
      } catch (error) {
        setError("Failed to fetch block data.");
        console.error("Error fetching block data:", error);
      } finally {
        setLoading(false);
      }
    };
  
  
  



  const [blockData, setBlockData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const storedData = JSON.parse(localStorage.getItem('AdminDetails')) || {};
  let managementId = storedData?.data?.data?._id || null;
  const [formData, setFormData] = useState({
    name: '',
    floor: '',
    flatNo: '',
    blockId: '',
    bedrooms: '',
    facing: '',
    vasthu: '',
    furnishingType: 'NA',
    isAvaliable: '',
    parkingSlot: '',
    sqFeet: '',
    sqPrice:'',
    specialFeature:'',
    specialFeaturePrice:'',
    unitType:'',
    priceStartRange: '',
    priceEndRange: '',
    constructionStatus: '',
    flatImages: null,
    flatPlanImages: null,
    towerId:towerId,
   companyId:companyId,
   projectId:projectId,
   createdBy:managementId
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    setFormData((prevData) => {
      if (name === "priceStartUnit") {
        return { 
          ...prevData, 
          priceStartUnit: value,
          priceStartRange: prevData.priceStartRange ? `${prevData.priceStartRange.split(" ")[0]} ${value}` : "" 
        };
      } else if (name === "priceEndUnit") {
        return { 
          ...prevData, 
          priceEndUnit: value,
          priceEndRange: prevData.priceEndRange ? `${prevData.priceEndRange.split(" ")[0]} ${value}` : "" 
        };
      } else if (name === "priceStartRange") {
        return { 
          ...prevData, 
          priceStartRange: value ? `${value} ${prevData.priceStartUnit || ""}` : "" 
        };
      } else if (name === "priceEndRange") {
        return { 
          ...prevData, 
          priceEndRange: value ? `${value} ${prevData.priceEndUnit || ""}` : "" 
        };
      }
      console.log(`Updating ${name} to:`, value); // Debugging log
      return { ...prevData, [name]: value };
    });
  };
  
  

  // const handleFileChange = (e) => {
  //   const { name, files } = e.target;
  //   setFormData({ ...formData, [name]: files[0] });
  // };
  const [gallery, setGallery] = useState([]);
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file && file.size > 1 * 1024 * 1024) { // 1MB limit
      addToast("File size must be less than 1MB", { appearance: "error", autoDismiss: true });
      e.target.value = ""; // Prevents file from being added to the input field
      return;
    }

    setGallery([...gallery, file]); // Only adds valid images
  };


  const [showForm, setShowForm] = useState(true);
  const [submittedFlats, setSubmittedFlats] = useState([]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form Data: ', formData);
  
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key !== "priceStartUnit" && key !== "priceEndUnit" && key !== "flatImages" && key !== "flatPlanImages") {
        formDataToSend.append(key, formData[key]);
      }
    });
  
    if (formData.flatImages) {
      formDataToSend.append('flatImages', formData.flatImages);
    }
    if (formData.flatPlanImages) {
      formDataToSend.append('flatPlanImages', formData.flatPlanImages);
    }
  
    try {
      const response = await api.addFlats(formDataToSend);
      console.log('Step 6 Success:', response.data);
      if(response.status === 401){
        console.log("Session Expired! Redirecting to Login.");
        localStorage.removeItem(utilis.string.localStorage.sessionId);
        localStorage.removeItem(utilis.string.localStorage.userData);
        navigate('/');
      }
  
      if (response.status === 200) {
        addToast("Step 7 submitted successfully", { appearance: "success", autoDismiss: true });
  
        // Store submitted flat details
        setSubmittedFlats([...submittedFlats, formData]);
  
        // Hide form and show Add More button
        setShowForm(false);
      } else {
        addToast(response.data?.message || "Something went wrong!",{ appearance: "error", autoDismiss: true });
      }
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };
  
  // Show form again for new entry
  const handleAddMore = () => {
    setFormData({
      name: '',
      floor: '',
      flatNo: '',
      blockId: '',
      bedrooms: '',
      facing: '',
      vasthu: '',
      furnishingType: 'NA',
      isAvaliable: '',
      parkingSlot: '',
      sqFeet: '',
      sqPrice:'',
      specialFeature:'',
      specialFeaturePrice:'',
      unitType:'',
      priceStartRange: '',
      priceEndRange: '',
      constructionStatus: '',
      flatImages: null,
      flatPlanImages: null,
      towerId:towerId,
     companyId:companyId,
     projectId:projectId,
     createdBy:managementId
    });
  
    setShowForm(true); // Show form again
  };
  
  
  
  
  
  

  return (
    <>
      <Dashheader />
      {loading ? (
            <Loading/>
          ) : (
      <div className="addtowerstep6">
        <h2>Step 7 - Add Flat Details</h2>
         {/* Show submitted flats list */}
    {submittedFlats.length > 0 && (
      <div>
        <h3>Submitted Flats</h3>
        <ul>
          {submittedFlats.map((flat, index) => (
            <li key={index}>
              <strong>Flat No:</strong> {flat.flatNo}, <strong>Floor:</strong> {flat.floor}, 
              <strong>Price:</strong> {flat.priceStartRange} - {flat.priceEndRange}
            </li>
          ))}
        </ul>
      </div>
    )}

        
         {/* Show Form if showForm is true */}
  {showForm ? (
        <form onSubmit={handleSubmit} className="form-container">
          <div className="form-group">
            <label>Flat Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Floor:*</label>
            <input
              type="text"
              name="floor"
              value={formData.floor}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Flat Number:*</label>
            <input
              type="text"
              name="flatNo"
              value={formData.flatNo}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

         
<div className="form-group">
  <label>Block:*</label>
  <select
  name="blockId"
  value={formData.blockId}
  onChange={handleChange}
  required
  className="form-select"
>
  <option value="">Select Block</option>
  {blockData && blockData.length > 0 ? (
    blockData.map((block) => (
      <option key={block._id} value={block._id}>
        {block.name}  {/* Show the name of the block in the dropdown */}
      </option>
    ))
  ) : (
    <option value="">No blocks available</option>
  )}
</select>

</div>

          <div className="form-group">
            <label>Bedrooms:*</label>
            <input type="text" name="bedrooms" value={formData.bedrooms} onChange={handleChange} required className="form-input" />
          </div>

          <div className="form-group">
            <label>Facing:*</label>
            <select
              name="facing"
              value={formData.facing}
              onChange={handleChange}
              required
              className="form-select"
            >
               <option >select facing</option>
              <option value="EAST">East</option>
              <option value="WEST">West</option>
              <option value="NORTH">North</option>
              <option value="SOUTH">South</option>
            </select>
          </div>

         

          <div className="form-group">
            <label>Availability:*</label>
            <select
  name="isAvaliable" // Fix the spelling
  value={formData.isAvaliable} // Ensure it matches state
  onChange={handleChange}
  required
  className="form-select"
>
  <option value="">Select Availability</option>
  <option value="BOOKED">Booked</option>
  <option value="AVALIABLE">Avaliable</option>
  <option value="ONHOLD">On Hold</option>
</select>

          </div>

          
<div className="form-group">
            <label>Square Feet:*</label>
            <input
              type="text"
              name="sqFeet"
              value={formData.sqFeet}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
         
          <div className="form-group">
            <label>Square Price:*</label>
            <input
              type="text"
              name="sqPrice"
              value={formData.sqPrice}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label>special Feature:*</label>
            <input
              type="text"
              name="specialFeature"
              value={formData.specialFeature}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label>special Feature Price:*</label>
            <input
              type="text"
              name="specialFeaturePrice"
              value={formData.specialFeaturePrice}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
         
          <div className="form-group">
            <label>Unit type:*</label>
            <select
              name="unitType"
              value={formData.unitType}
              onChange={handleChange}
              required
              className="form-select"
            >
              <option >SELECT Unit type</option>
              <option value="FALT">FLAT</option>
              <option value="OFFICE">OFFICE</option>
              <option value="SHOWROOM">SHOWROOM</option>
            </select>
          </div> 
          <div className="form-group">
            <label>Vastu:</label>
            <input
              type="text"  name="vasthu"
              value={formData.vasthu}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Furnishing Type:</label>
            <select
              name="furnishingType"
              value={formData.furnishingType}
              onChange={handleChange}
              className="form-select"
            >
               <option> select FURNISHED</option>
              <option value="FULLY-FURNISHED">FULLY-FURNISHED</option>
              <option value="SEMI-FURNISHED">SEMI-FURNISHED</option>
              <option value="NON-FURNISHED">NON-FURNISHED</option>
            </select>
          </div>
          <div className="form-group">
            <label>Parking Slot:</label>
            <input
              type="text"
              name="parkingSlot"
              value={formData.parkingSlot}
              onChange={handleChange}
              className="form-input"
            />
          </div>

         
          <div className="form-group">
  <label>Price Start Range:</label>
  <input
    type="text"
    name="priceStartRange"
    value={formData.priceStartRange}
    onChange={handleChange}
    className="form-input"
    
  />
  <div className="radio-group">
    <label>
      <input
        type="radio"
        name="priceStartUnit"
        value="Lakhs"
        checked={formData.priceStartUnit === "Lakhs"}
        onChange={handleChange}
        
      />
      Lakhs
    </label>
    <label>
      <input
        type="radio"
        name="priceStartUnit"
        value="Crores"
        checked={formData.priceStartUnit === "Crores"}
        onChange={handleChange}
        
      />
      Crores
    </label>
  </div>
</div>

<div className="form-group">
  <label>Price End Range:</label>
  <input
    type="text"
    name="priceEndRange"
    value={formData.priceEndRange}
    onChange={handleChange}
    className="form-input"
    
  />
  <div className="radio-group">
    <label>
      <input
        type="radio"
        name="priceEndUnit"
        value="Lakhs"
        checked={formData.priceEndUnit === "Lakhs"}
        onChange={handleChange}
        
      />
      Lakhs
    </label>
    <label>
      <input
        type="radio"
        name="priceEndUnit"
        value="Crores"
        checked={formData.priceEndUnit === "Crores"}
        onChange={handleChange}
        
      />
      Crores
    </label>
  </div>
</div>         
          <div className="form-group">
            <label>Construction Status:</label>
            <select
              name="constructionStatus"
              value={formData.constructionStatus}
              onChange={handleChange}
              required
              className="form-select"
            >
              <option >SELECT CONSTRUCTION STATUS</option>
              <option value="READYTOMOVE">Ready to Move</option>
              <option value="UNDERCONSTRUCTION">Under Construction</option>
              <option value="NEWLAUNCH">NEW LAUNCH</option>
            </select>
          </div>

          {/* <div className="form-group">
            <label>Flat Images:</label>
            <input
              type="file"
              name="flatImages"
              onChange={handleFileChange}
              accept="image/*"
              className="form-file"
            />
          </div>

          <div className="form-group">
            <label>Flat Plan Images:</label>
            <input
              type="file"
              name="flatPlanImages"
              onChange={handleFileChange}
              accept="image/*"
              className="form-file"
            />
          </div> */}

          <button type="submit" className="submit-btn">Submit</button>
               {/* Exit button */}
        <button
          type="button"
          onClick={() => setShowExitPopup(true)}
          className="exit-button"
        >
          Exit
        </button>
          {showExitPopup && (
              <div className="exit-popup">
                <p>Are you sure you want to exit without saving?</p>
                <button onClick={handleExit}>Yes</button>
                <button onClick={() => setShowExitPopup(false)}>No</button>
              </div>
            )}
        </form> ) : (
    // Show Add More Flats button when form is hidden
    <>
    <button onClick={handleAddMore} className="submit-btn">
      Add More Flats
    </button>
    <button type="button" onClick={() => setShowExitPopup(true)} className="exit-button">Exit</button>
    </>
    
   
  )}
  

{showExitPopup && ( 
  <div className="exit-popup">
    <p>Are you sure you want to exit ?</p>
    <button onClick={handleExit}>Yes</button>
    <button onClick={() => setShowExitPopup(false)}>No</button>
  </div>
)}
      </div>
             )}
    </>
  );
};

export default Addtowerstep6;
