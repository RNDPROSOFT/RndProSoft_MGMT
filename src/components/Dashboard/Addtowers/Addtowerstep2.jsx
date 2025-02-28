import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Dashheader from '../Dashheader/Dashheader';
import api from './../../../api.js';
import { useToasts } from "react-toast-notifications";

const AddTowersStep2 = () => {

   const [showExitPopup, setShowExitPopup] = useState(false);
  
  
    const handleExit = () => {
      setShowExitPopup(false); // Hide the popup
      navigate('/login/dashboard', { replace: true }); // Navigate to the dashboard
    };
    
  
    
  
  const { addToast } = useToasts();
  const navigate = useNavigate();
  const location = useLocation();
  const { towerId, companyId, projectId } = location.state || {}; // Receive values from Step 1

  useEffect(() => {
    console.log('🚀 Received towerId, companyId, projectId in Step 2:', towerId, companyId, projectId);
  }, [towerId, companyId, projectId]);

  const storedData = JSON.parse(localStorage.getItem('AdminDetails')) || {};
  let managementId = storedData?.data?.data?._id || null;

  // Initial form data state
  const [formData, setFormData] = useState({
    name: '',
    noOfFloors: '',
    noOfFlats: '',
    parkingSpace: '',
    createdBy: managementId,
    step: 2,
    towerId: towerId || '',
    companyId: companyId || '',
    projectId: projectId || '',
  });

  const [blocks, setBlocks] = useState([]); // State to track the blocks
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(true); // State to track form visibility

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await api.addTowers(formData);
      console.log('Step 2 Success:', response.data);
      setMessage({ type: 'success', text: 'Step 2 completed successfully!' });

      if (response.status === 200) {
        addToast("Step 2 submitted successfully", {
          appearance: "success",
          autoDismiss: true,
        });

        // Add the current block to the list of blocks
        setBlocks([...blocks, formData]);

        // Hide the form after the first block is added
        setIsFormVisible(false);
      } else {
        addToast("Something went wrong", {
          appearance: "error",
          autoDismiss: true,
        });
        console.error('Failed to submit form');
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error submitting Step 2. Please try again.' });
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMore = () => {
    // Show the form again when adding more blocks
    setIsFormVisible(true);
    // Reset form for adding more blocks
    setFormData({
      name: '',
      noOfFloors: '',
      noOfFlats: '',
      parkingSpace: '',
      createdBy: managementId,
      step: 2,
      towerId: towerId || '',
      companyId: companyId || '',
      projectId: projectId || '',
    });
  };

  const handleNavigateToStep3 = () => {
    if (blocks.length > 0) {
      addToast("navigating to step3", {
        appearance: "success",
        autoDismiss: true,
      });
      // Only navigate to Step 3 if at least one block is added
      navigate('/addtowers/step3', { state: { towerId, companyId, projectId ,replace: true  } });
    } else {
      addToast("Please add at least one block before proceeding.", {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  return (
    <>
      <Dashheader />
      <div className="addtowers">
        <h2>Add Project - Step 2</h2>

        {message && <div className={`message ${message.type}`}>{message.text}</div>}

        {/* Show the previously added blocks above the current form */}
        {blocks.length > 0 && blocks.map((block, index) => (
          <div key={index} className="added-block">
            <h3>Block {index + 1} Details:</h3>
            <p>Name: {block.name}</p>
            <p>No of Floors: {block.noOfFloors}</p>
            <p>No of Flats: {block.noOfFlats}</p>
            <p>Parking Space: {block.parkingSpace}</p>
            {/* Add any other fields you need to display */}
          </div>
        ))}

        {/* Form for adding more blocks, visible when isFormVisible is true */}
        {isFormVisible && (
          <form onSubmit={handleSubmit} className="addtowers-form">
            <input
              type="text"
              name="name"
              placeholder="Block Name (e.g., Block A)"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="noOfFloors"
              placeholder="No of Floors"
              value={formData.noOfFloors}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="noOfFlats"
              placeholder="No of Flats"
              value={formData.noOfFlats}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="parkingSpace"
              placeholder="Parking Space"
              value={formData.parkingSpace}
              onChange={handleChange}
              required
            />

            {/* Hidden fields */}
            <input type="hidden" name="createdBy" value={formData.createdBy} />
            <input type="hidden" name="step" value={formData.step} />
            <input type="hidden" name="towerId" value={formData.towerId} />

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
        )}

        {/* Show Add More button */}
        {blocks.length > 0 && (
          <button onClick={handleAddMore} className='step2navigation'>
            Add More Blocks
          </button>
        )}

        {/* Show Navigate to Step 3 button after adding at least one block */}
        {blocks.length > 0 && (
          
          <button onClick={handleNavigateToStep3} className='step2navigation'>
            Navigate to Step 3
          </button>
        )}

        
      </div>
    </>
  );
};

export default AddTowersStep2;
