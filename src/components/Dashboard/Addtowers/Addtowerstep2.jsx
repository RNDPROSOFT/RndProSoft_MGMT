import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Dashheader from '../Dashheader/Dashheader';
import api from './../../../api.js';

const AddTowersStep2 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { towerId } = location.state || {}; // Receive towerId from Step 1

  useEffect(() => {
    console.log('🚀 Received towerId in Step 2:', towerId);
  }, [towerId]);
  const storedData = JSON.parse(localStorage.getItem('AdminDetails')) || {};
  let managementId = storedData?.data?.data?._id || null;

  const [formData, setFormData] = useState({
    name: '',
    noOfFloors: '',
    noOfFlats: '',
    parkingSpace: '',
    createdBy: managementId,
    step: 2,
    towerId: towerId || '', // Ensure towerId is set
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const response = await api.addDeveloper(formData);
      console.log('Response:', response);
    try {
      const response = await api.addTowers(formData);
      console.log('Step 2 Success:', response.data);
      setMessage({ type: 'success', text: 'Step 2 completed successfully!' });
  
      if (response.status === 200) {
        const towerId = response.data?.towerId || response.data?.data?.towerId;
        console.log('Extracted Tower ID:', towerId);
        
        alert("navigating step3")
        // Navigate to Step 3 if the response status is 200
        navigate('/addtowers/step3', { state: { towerId: towerId }, replace: true });
      }
  
    } catch (error) {
      setMessage({ type: 'error', text: 'Error submitting Step 2. Please try again.' });
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      <Dashheader />
      <div className="addtowers">
        <h2>Add Towers - Step 2</h2>

        {message && <div className={`message ${message.type}`}>{message.text}</div>}

        <form onSubmit={handleSubmit} className="addtowers-form">
          <input type="text" name="name" placeholder="Block Name (e.g., Block A)" value={formData.name} onChange={handleChange} required />
          <input type="text" name="noOfFloors" placeholder="No of Floors" value={formData.noOfFloors} onChange={handleChange} required />
          <input type="text" name="noOfFlats" placeholder="No of Flats" value={formData.noOfFlats} onChange={handleChange} required />
          <input type="text" name="parkingSpace" placeholder="Parking Space" value={formData.parkingSpace} onChange={handleChange} required />

          {/* Hidden fields */}
          <input type="hidden" name="createdBy" value={formData.createdBy} />
          <input type="hidden" name="step" value={formData.step} />
          <input type="hidden" name="towerId" value={formData.towerId} />

          <button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Save and next'}
          </button>
        </form>
      </div>
    </>
  );
};

export default AddTowersStep2;
