import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Dashheader from '../Dashheader/Dashheader';
import api from './../../../api.js';

const AddTowersStep4 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { towerId } = location.state || {};

  useEffect(() => {
    console.log('Received towerId in Step 4:', towerId);
  }, [towerId]);

  const storedData = JSON.parse(localStorage.getItem('AdminDetails')) || {};
  let managementId = storedData?.data?.data?._id || null;

  const [formData, setFormData] = useState({
    reraNo: '',
    apparRegistrationNo: '',
    gst: '',
    approvalNo: '',
    DICPApprovalNo: '',
    govtCertificate: '',
    developerId: '',
    phone: '',
    appatAge: '',
    createdBy3: managementId,  // Updated this field name to 'createdBy3'
    step: 4,
    towerId: towerId || '',
  });
  

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    console.log(setFormData({ ...formData, [name]: value }))
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

   try {
  const response = await api.addTowers(formData);
  console.log('Step 4 Success:', response);  // Log the entire response object
  setMessage({ type: 'success', text: 'Step 4 completed successfully!' });
 
  if (response.status === 200) {
    const towerId = response.data?._id || response.data?.data?._id;
    console.log('Extracted Tower ID:', towerId);
    
    
    alert("navigating step5")
    // Navigate to Step 3 if the response status is 200
    navigate('/addtowers/step5', { state: { towerId: towerId } , replace: true});
  }
else {
    setMessage({ type: 'error', text: 'Unexpected response format.' });
    alert("step4 not added sucessfully")
  }
 
} catch (error) {
  console.error('Error response:', error?.response);  // Log detailed error info from response
  setMessage({ type: 'error', text: error?.response?.data?.message || 'Error submitting Step 4. Please try again.' });
}
 finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dashheader />
      <div className="addtowers">
        <h2>Add Towers - Step 4</h2>

        {message && <div className={`message ${message.type}`}>{message.text}</div>}

        <form onSubmit={handleSubmit} className="addtowers-form">
          {/* New fields */}
          <input type="text" name="reraNo" placeholder="RERA No." value={formData.reraNo} onChange={handleChange} required />
          <input type="text" name="apparRegistrationNo" placeholder="Appar Registration No." value={formData.apparRegistrationNo} onChange={handleChange} required />
          <input type="text" name="gst" placeholder="GST" value={formData.gst} onChange={handleChange} required />
          <input type="text" name="approvalNo" placeholder="Approval No." value={formData.approvalNo} onChange={handleChange} required />
          <input type="text" name="DICPApprovalNo" placeholder="DICP Approval No." value={formData.DICPApprovalNo} onChange={handleChange} required />
          <input type="text" name="govtCertificate" placeholder="Govt Certificate" value={formData.govtCertificate} onChange={handleChange} required />
          <input type="text" name="developerId" placeholder="Developer ID" value={formData.developerId} onChange={handleChange} required />
          <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
          <input type="text" name="appatAge" placeholder="Appat Age" value={formData.appatAge} onChange={handleChange} required />

          {/* Hidden fields */}
          <input type="hidden" name="createdBy3" value={formData.createdBy3} />  {/* Updated this field name */}
          <input type="hidden" name="step" value={formData.step} />
          <input type="hidden" name="towerId" value={formData.towerId} />

          <button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'save and next'}
          </button>
        </form>
      </div>
    </>
  );
};

export default AddTowersStep4;
