import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Dashheader from '../Dashheader/Dashheader';
import api from './../../../api.js';
import { useToasts } from "react-toast-notifications";
import Loading from '../../../utilis/Loading.js';
import utilis from '../../../utilis';

const AddTowersStep7 = () => {
  const { addToast } = useToasts();
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedList, setSubmittedList] = useState([]); // Store multiple submitted details

  const navigate = useNavigate();
  const location = useLocation();
  const { towerId, companyId, projectId } = location.state || {};

  useEffect(() => {
    console.log('🚀 Received towerId in Step 7:', towerId, companyId, projectId);
  }, [towerId, companyId, projectId]);

  const storedData = JSON.parse(localStorage.getItem('AdminDetails')) || {};
  let managementId = storedData?.data?.data?._id || null;

  const [formData, setFormData] = useState({
    name: '',
    createdBy: managementId,
    step: 6,
    towerId: towerId || '',
    isVisible: '',
    nearbyImage: null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (formData.isVisible === '') {
      setErrors({ ...errors, isVisible: 'Please select Yes or No.' });
      setLoading(false);
      return;
    }

    const isVisibleValue = formData.isVisible === 'yes' ? true : false;
    const dataToSubmit = { ...formData, isVisible: isVisibleValue };

    try {
      const response = await api.addTowers(dataToSubmit);
      console.log('Step 7 Success:', response.data);
       if(response.status === 401){
        console.log("Session Expired! Redirecting to Login.");
        localStorage.removeItem(utilis.string.localStorage.sessionId);
        localStorage.removeItem(utilis.string.localStorage.userData);
        navigate('/');
      }
      setMessage({ type: 'success', text: 'Step 7 completed successfully!' });

      if (response.status === 200) {
        addToast("Step 6 submitted successfully", {
          appearance: "success",
          autoDismiss: true,
        });

        // Store the new submission while keeping old submissions
        setSubmittedList((prevList) => [...prevList, formData]);

        setIsSubmitted(true);
        setFormData({
          name: '',
          createdBy: managementId,
          step: 6,
          towerId: towerId || '',
          isVisible: '',
          nearbyImage: null,
        });
        setErrors({});
      } else {
        addToast(response.data?.message || "Something went wrong!", {
          appearance: "error",
          autoDismiss: true,
        });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error submitting Step 7. Please try again.' });
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  
  const handleExit = () => {
    setShowExitPopup(false);
    navigate('/login/dashboard', { replace: true });
  };
  
  // Navigate to Step 8
  const navigateto = () => {
    navigate("/addtowers/step6", { state: { towerId, companyId, projectId } });
  };

  return (
    <>
      <Dashheader />
      {loading ? (
            <Loading/>
          ) : (
      <div className="addtowers">
        <h2>Add Project - Step 6</h2>
        {message && <div className={`message ${message.type}`}>{message.text}</div>}

        {/* Display Previously Submitted Data */}
        {submittedList.length > 0 && (
          <div className="previous-submissions">
            <h3>Previously Submitted Details</h3>
            {submittedList.map((data, index) => (
              <div key={index} className="submitted-details">
                <p><strong>Tower Name:</strong> {data.name}</p>
                <p><strong>Is Visible:</strong> {data.isVisible === 'yes' ? 'Yes' : 'No'}</p>
                {data.nearbyImage && <p><strong>Nearby Image:</strong> {data.nearbyImage.name}</p>}
                <hr />
              </div>
            ))}
          </div>
        )}

        {/* Show Form for New Entries */}
        {!isSubmitted || submittedList.length === 0 ? (
          <form onSubmit={handleSubmit} className="addtowers-form">
            <div>
              <label htmlFor="towerName">Famous place:*</label>
              <input type="text" id="towerName" name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div>
              <label htmlFor="nearbyImage">Nearby Image:*</label>
              <input type="file" id="nearbyImage" name="nearbyImage" onChange={handleFileChange} />
            </div>

            <div>
              <label style={{ fontWeight: 'bold' }}>Is the tower visible?*</label>
              <div>
                <input type="radio" id="visibleYes" name="isVisible" value="yes" checked={formData.isVisible === 'yes'} onChange={handleChange} />
                <label htmlFor="visibleYes">Yes</label>
              </div>
              <div>
                <input type="radio" id="visibleNo" name="isVisible" value="no" checked={formData.isVisible === 'no'} onChange={handleChange} />
                <label htmlFor="visibleNo">No</label>
              </div>
            </div>
            {errors.isVisible && <p style={{ color: 'red', marginTop: '5px' }}>{errors.isVisible}</p>}

            <button type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Save and Next'}</button>
            <button type="button" onClick={() => setShowExitPopup(true)} className="exit-button">Exit</button>

            {showExitPopup && (
              <div className="exit-popup">
                <p>Are you sure you want to exit without saving?</p>
                <button onClick={handleExit}>Yes</button>
                <button onClick={() => setShowExitPopup(false)}>No</button>
              </div>
            )}
          </form>
        ) : (
          <div className="button-container">
            <button onClick={() => setIsSubmitted(false)} className="submit-btn">Add More</button>
            {submittedList.length > 0 && (
              <button onClick={navigateto} className="submit-btn" style={{marginLeft:"10px"}}>Navigate to step7</button>
            )}
          </div>
        )}
      </div>
       )}
    </>
  );
};

export default AddTowersStep7;
