import React, { useState,useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Dashheader from '../Dashheader/Dashheader';
import axios from 'axios';
import api from './../../../api.js';
import { useToasts } from "react-toast-notifications";
import Loading from '../../../utilis/Loading.js';
import utilis from '../../../utilis';

const AddTowersStep3 = () => {
  const { addToast } = useToasts();
  const [showExitPopup, setShowExitPopup] = useState(false);
    
    
      const handleExit = () => {
        setShowExitPopup(false); // Hide the popup
        navigate('/login/dashboard', { replace: true }); // Navigate to the dashboard
      };
      
  const navigate = useNavigate();
  const location = useLocation();
  const { towerId } = location.state || {}; 
 useEffect(() => {
    console.log('🚀 Received towerId in Step 2:', towerId);
  }, [towerId]);

  const storedData = JSON.parse(localStorage.getItem('AdminDetails')) || {};
  let managementId = storedData?.data?.data?._id || null;
      // console.log(towerId,'towerid')
  const [formData, setFormData] = useState({
    towerId: towerId || '',
    projectType: '',
    developmentSize: '',
    totalUnits: '',
    constructionStatus: '',
    // aminities: [''],
    specification:null,
    noOfBlocks: '',
    noOfFlats: '',
    remarks: null,
    createdBy2: managementId,
    step: 3,
  });

  const [bedrooms, setBedrooms] = useState([]);
  const [aminities, setAminities] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [planImages, setPlanImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  
    const validFiles = Array.from(files).filter(file => {
      if (file.size <= maxSize) {
        return true; // Accept file
      } else {
        // alert(`File "${file.name}" exceeds 5MB and will not be uploaded.`);
        addToast(`File "${file.name}" exceeds 1MB and will not be uploaded.`, {
          appearance: "error",
          autoDismiss: true,
        });
        return false; // Reject file
      }
    });
  
    if (name === 'gallery') {
      setGallery([...gallery, ...validFiles]);
    } else if (name === 'planImages') {
      setPlanImages([...planImages, ...validFiles]);
    }
  };
  
  const handleBedroomChange = (e, index) => {
    const newBedrooms = [...bedrooms];
    newBedrooms[index] = e.target.value;
    setBedrooms(newBedrooms);
  };

  const handleAddBedroom = () => {
    setBedrooms([...bedrooms, '']);
  };

  const handleRemoveBedroom = (index) => {
    const newBedrooms = bedrooms.filter((_, i) => i !== index);
    setBedrooms(newBedrooms);
  };

  const handleAminityChange = (e, index) => {
    const newAminities = [...aminities];
    newAminities[index] = e.target.value;
    setAminities(newAminities);
  };

  const handleAddAminity = () => {
    setAminities([...aminities, '']);
  };

  const handleRemoveAminity = (index) => {
    const newAminities = aminities.filter((_, i) => i !== index);
    setAminities(newAminities);
  };



  const handleRemoveGalleryImage = (index) => {
    const newGallery = gallery.filter((_, i) => i !== index);
    setGallery(newGallery);
  };
  
  const handleRemovePlanImage = (index) => {
    const newPlanImages = planImages.filter((_, i) => i !== index);
    setPlanImages(newPlanImages);
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
  
    try {
      const data = new FormData();
  
      // Append text fields
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });
          // Append array fields (PRINT HERE BEFORE SENDING)
    console.log("Aminities being sent to backend:", aminities);
    console.log("Bedrooms being sent to backend:", bedrooms);
      // Append array fields
      bedrooms.forEach((bedroom) => data.append('bedrooms[]', bedroom));
      aminities.forEach((aminity) => data.append('aminities[]', aminity));
  
      // Append file arrays
      gallery.forEach((file) => data.append('gallery', file));
      planImages.forEach((file) => data.append('planImages', file));
  
      // Send FormData to backend
      const response = await api.addTowers(data); // ✅ No changes here
  
      console.log('Response:', response);
      console.log(data)
      if(response.status === 401){
        console.log("Session Expired! Redirecting to Login.");
        localStorage.removeItem(utilis.string.localStorage.sessionId);
        localStorage.removeItem(utilis.string.localStorage.userData);
        navigate('/');
      }
     
      if (response.status === 200) {
        const towerId = response.data?._id || response.data?.data?._id;
        console.log('Extracted Tower ID:', towerId);
        
        addToast( "step3 submitted successfully", {
          appearance: "success",
          autoDismiss: true,
        });
        // alert("navigating step4")
        // Navigate to Step 3 if the response status is 200
        navigate('/addtowers/step4', { state: { towerId: towerId }, replace: true });
      }
   else {
        setMessage({ type: 'error', text: 'Unexpected response format.' });
        addToast(response.data?.message || "Something went wrong!", {
          appearance: "error",
          autoDismiss: true,
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage({
        type: 'error',
        text: 'Error submitting Step 3. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };
  
  
  
  

  return (
    <>
      <Dashheader />
       {loading ? (
            <Loading/>
          ) : (
      <div className="addtowers">
        <h2>Add Project - Step 3</h2>

        {message && <div className={`message ${message.type}`}>{message.text}</div>}

        <form onSubmit={handleSubmit} className="addtowers-form">
          <select name="projectType" value={formData.projectType} onChange={handleChange} required>
            <option value="">Select Project Type*</option>
            <option value="APARTMENT">Apartment</option>
            <option value="VILLA">Villa</option>
            <option value="COMMERCIAL">Commercial</option>
          </select>
          
          <input type="text" name="developmentSize" placeholder="Development Size*" value={formData.developmentSize} onChange={handleChange} required />
          <input type="text" name="totalUnits" placeholder="Total Units*" value={formData.totalUnits} onChange={handleChange} required />
          
          <select name="constructionStatus" value={formData.constructionStatus} onChange={handleChange} required>
            <option value="">Select Construction Status*</option>
            <option value="READY TO MOVE">Ready to Move</option>
            <option value="UNDER CONSTRUCTION">Under Construction</option>
            <option value="NEW LAUNCH">New Launch</option>
          </select>

          <input type="text" name="specification" placeholder="Specification(Optional)" value={formData.specification} onChange={handleChange}  />
          <input type="text" name="noOfBlocks" placeholder="No of Blocks*" value={formData.noOfBlocks} onChange={handleChange} required />
          <input type="text" name="noOfFlats" placeholder="No of Flats*" value={formData.noOfFlats} onChange={handleChange} required />
          <input type="text" name="remarks" placeholder="Remarks(Optional)" value={formData.remarks} onChange={handleChange}  />

          {/* Bedrooms Section */}
          <div className="bedrooms-container">
            <label>Bedrooms* (e.g., 2BHK, 3BHK):</label>
            {bedrooms.map((bedroom, index) => (
              <div key={index} className="bedroom-input">
                <input
                  type="text"
                  value={bedroom}
                  onChange={(e) => handleBedroomChange(e, index)}
                  placeholder={`Bedroom ${index + 1}`}
                  required
                />
                <button type="button" onClick={() => handleRemoveBedroom(index)}>Remove</button>
              </div>
            ))}
            <button type="button" onClick={handleAddBedroom}>Add More +</button>
          </div>

          {/* Aminities Section */}
          {/* <div className="aminities-container">
            <label>Aminities(Optional):</label>
            {aminities.map((aminity, index) => (
              <div key={index} className="aminity-input">
                <input
                  type="text"
                  value={aminity}
                  onChange={(e) => handleAminityChange(e, index)}
                  placeholder={`Aminity ${index + 1}`}
                  
                />
                <button type="button" className="remove-button" onClick={() => handleRemoveAminity(index)}>Remove</button>
              </div>
            ))}
            <button type="button" className="add-button" onClick={handleAddAminity}>Add More +</button>
          </div> */}

          {/* Gallery Section */}
          <div className="gallery-container">
  <label>Gallery Images:*</label>
  <button type="button" onClick={() => document.getElementById('gallery').click()}>
    Add More +
  </button>
  <input
    id="gallery"
    type="file"
    name="gallery"
    multiple
    accept="image/*"
    style={{ display: 'none' }}
    onChange={handleFileChange}
  />
  {gallery.map((file, index) => (
    <div key={index} className="gallery-item">
      <p>{file.name}</p>
      <button
        type="button"
        className="remove-button"
        onClick={() => handleRemoveGalleryImage(index)}
      >
        Remove
      </button>
    </div>
  ))}
</div>


          {/* Plan Images Section */}
          <div className="plan-images-container">
  <label>Plan Images:*</label>
  <button type="button" onClick={() => document.getElementById('planImages').click()}>
    Add More +
  </button>
  <input
    id="planImages"
    type="file"
    name="planImages"
    multiple
    accept="image/*"
    style={{ display: 'none' }}
    onChange={handleFileChange}
    required
  />
  {planImages.map((file, index) => (
    <div key={index} className="plan-image-item">
      <p>{file.name}</p>
      <button
        type="button"
        className="remove-button"
        onClick={() => handleRemovePlanImage(index)}
      >
        Remove
      </button>
    </div>
  ))}
</div>

          
          <button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'save and next'}
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
       )}
    </>
  );
};

export default AddTowersStep3;
