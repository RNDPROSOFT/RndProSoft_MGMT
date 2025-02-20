import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Dashheader from '../Dashheader/Dashheader';
import api from './../../../api.js';
import config from './../../../utilis/config'
import { Select } from 'antd';  // <-- Add this import for Select

const AddTowersStep4 = () => {

  const [showExitPopup, setShowExitPopup] = useState(false);
    
    
      const handleExit = () => {
        setShowExitPopup(false); // Hide the popup
        navigate('/login/dashboard', { replace: true }); // Navigate to the dashboard
      };
      
  const [apiData, setApidata] = useState([]);

  const [developerOptions, setDeveloperOptions] = useState([]);
  const handleDeveloperChange = (value) => {
    setFormData({ ...formData, developerId: value });
    console.log("Selected Developer ID:", value);  // This will be the _id sent to backend
  };
  

  useEffect(() => {
    axios
      .get(`${config.baseUrl}/${config.apiName.getDeveloperdetails}`)
      .then((response) => {
        setApidata(response.data.data);
        const options = response.data.data.map((developer) => ({
          value: developer._id,
          label: developer.title,
        }));
        setDeveloperOptions(options);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);
  

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

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData({ ...formData, [name]: value });
  //   console.log(setFormData({ ...formData, [name]: value }))
    
  // };
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
    const companyId = response.data?._id || response.data?.data?.companyId;
    console.log('Extracted Tower ID:', towerId);
    const projectId = response.data?._id || response.data?.data?.projectId;
    console.log('Extracted Tower ID:', towerId);
    
    
    alert("navigating step5")
    // Navigate to Step 3 if the response status is 200
    navigate('/addtowers/step5', { state: { towerId: towerId,companyId:companyId,projectId:projectId } , replace: true});
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
          {/* <input type="text" name="developerId" placeholder="Developer ID" value={formData.developerId} onChange={handleChange} required /> */}
          <select
  name="developerId"
  value={formData.developerId}
  onChange={handleChange}
  required
>
  <option value="">Select Developer</option>
  {apiData.map((developer) => (
    <option key={developer._id} value={developer._id}>
      {developer.title}
    </option>
  ))}
</select>
       
        
          <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
          <input type="text" name="appatAge" placeholder="Appat Age" value={formData.appatAge} onChange={handleChange} required />

          {/* Hidden fields */}
          <input type="hidden" name="createdBy3" value={formData.createdBy3} />  {/* Updated this field name */}
          <input type="hidden" name="step" value={formData.step} />
          <input type="hidden" name="towerId" value={formData.towerId} />

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
    </>
  );
};

export default AddTowersStep4;
