import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Dashheader from '../Dashheader/Dashheader';
import api from './../../../api.js';

const AddTowersStep5 = () => {
  
  const [showExitPopup, setShowExitPopup] = useState(false);
    
    
      const handleExit = () => {
        setShowExitPopup(false); // Hide the popup
        navigate('/login/dashboard', { replace: true }); // Navigate to the dashboard
      };
      
  const navigate = useNavigate();
  const location = useLocation();
  const { towerId, companyId, projectId  } = location.state || {}; // Receive towerId from previous steps

  useEffect(() => {
    console.log('🚀 Received towerId in Step 5:', towerId,companyId,projectId);
  }, [towerId, companyId, projectId ]);

  const storedData = JSON.parse(localStorage.getItem('AdminDetails')) || {};
  let managementId = storedData?.data?.data?._id || null;

  const [formData, setFormData] = useState({
    about: [{ title: '', description: '' }],
    createdBy4: managementId,
    step: 5,
    towerId: towerId || '', // Ensure towerId is set
    companyId:companyId ,
    projectId:projectId,
    isVisible :''
  });


  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const [arrayName, index, fieldName] = name.split('.'); // Handle nested field
    const updatedData = [...formData[arrayName]];
    updatedData[index][fieldName] = value;
    setFormData({ ...formData, [arrayName]: updatedData });
  };

  // Add a new entry to the "about" field array
  const handleAdd = () => {
    setFormData({
      ...formData,
      about: [...formData.about, { title: '', description: '' }],
    });
  };

  // Remove an entry from the "about" field array
  const handleRemove = (index) => {
    const updatedAbout = formData.about.filter((_, i) => i !== index);
    setFormData({ ...formData, about: updatedAbout });
  };
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
// Validate isVisible selection
if (formData.isVisible === '') {
  setErrors({ ...errors, isVisible: 'Please select Yes or No.' });
  setLoading(false);
  return;
}
    try {
      const response = await api.addTowers(formData);
      console.log('Step 5 Success:', response.data);
      setMessage({ type: 'success', text: 'Step 5 completed successfully!' });

      if (response.status === 200) {
        const towerId = response.data?._id || response.data?.data?._id;
    console.log('Extracted Tower ID:', towerId);
    const companyId = response.data?._id || response.data?.data?.companyId;
    console.log('Extracted Tower ID:', towerId);
    const projectId = response.data?._id || response.data?.data?.projectId;
    console.log('Extracted Tower ID:', towerId);;
        
       
    alert("navigating step5")
    // Navigate to Step 3 if the response status is 200
    navigate('/addtowers/step6', { state: { towerId: towerId,companyId:companyId,projectId:projectId }});
       
        
       
      }

    } catch (error) {
      setMessage({ type: 'error', text: 'Error submitting Step 5. Please try again.' });
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dashheader />
      <div className="addtowers">
        <h2>Add Towers - Step 5</h2>

        {message && <div className={`message ${message.type}`}>{message.text}</div>}

        <form onSubmit={handleSubmit} className="addtowers-form">
          {formData.about.map((aboutField, index) => (
            <div key={index} className="about-field" style={{ padding: '15px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
              <input
                type="text"
                name={`about.${index}.title`}
                placeholder="About Tower Title"
                value={aboutField.title}
                onChange={handleChange}
                required
                style={{ padding: '10px', width: '100%', marginBottom: '10px' }}
              />
              <textarea
                name={`about.${index}.description`}
                placeholder="About Tower Description"
                value={aboutField.description}
                onChange={handleChange}
                required
                style={{ padding: '10px', width: '100%', marginBottom: '10px' }}
              />
              <button
                type="button"
                onClick={() => handleRemove(index)}
               
              >
                Remove
              </button>
            </div>
          ))}

          <button type="button" onClick={handleAdd} style={{ padding: '10px 15px', background: 'white', color: 'orange', border: '2px solid orange', borderRadius: '5px', marginTop: '10px', cursor: 'pointer' }}>
            Add More
          </button>
     {/* Publish toggle switch */}
<div style={{ marginTop: '15px', display: 'flex', alignItems: 'center' }}>
  <label style={{ marginRight: '10px', fontWeight: 'bold' }}>
    Do you want to publish this tower to users?
  </label>
  <label className="switch">
    <input
      type="checkbox"
      name="isVisible"
      checked={formData.isVisible === true}  // Yes = true, No = false
      onChange={(e) => {
        setFormData({ ...formData, isVisible: e.target.checked });
        setErrors({ ...errors, isVisible: '' }); // Clear error when selected
      }}
    />
    <span className="slider round"></span>
  </label>
</div>

{/* Show error message if isVisible is not selected */}
{errors.isVisible && <p style={{ color: 'red', marginTop: '5px' }}>{errors.isVisible}</p>}



          {/* Hidden fields */}
          <input type="hidden" name="createdBy4" value={formData.createdBy4} />
          <input type="hidden" name="step" value={formData.step} />
          <input type="hidden" name="towerId" value={formData.towerId} />

          <button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Save and next'}
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

export default AddTowersStep5;
