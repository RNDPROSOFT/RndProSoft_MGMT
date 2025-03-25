import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Dashheader from '../Dashheader/Dashheader';
import api from './../../../api.js';
import config from './../../../utilis/config'
import { Select } from 'antd';  // <-- Add this import for Select
import { useToasts } from "react-toast-notifications";
import Loading from '../../../utilis/Loading.js';
import utilis from '../../../utilis';
const AddTowersStep4 = () => {
  
 const { addToast } = useToasts();
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
  


  // Fetch project details using the API
  const GetdeveloperDetails = async () => {
    try {
      let response = await api.getDeveloperdetails();
      setApidata(response.data.data);
      console.log(response.data.data)
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    GetdeveloperDetails();
  }, []);
  // useEffect(() => {
  //   axios
  //     .get(`${config.baseUrl}/${config.apiName.getDeveloperdetails}`)
  //     .then((response) => {
  //       setApidata(response.data.data);
  //       const options = response.data.data.map((developer) => ({
  //         value: developer._id,
  //         label: developer.title,
  //       }));
  //       setDeveloperOptions(options);
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching data:', error);
  //     });
  // }, []);
  

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
    gstNo: '',
    developerId: '',
    phone:0,
    appatAge: 0,
    createdBy3: managementId,
    step: 4,
    towerId: towerId || '',
    otherStateRegNo: [''], // Array to store "State or Local No."
    otherCentralRegNo: [''], // Array to store "Other Central No."
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
  

  const handleAddStateLocalNo = () => {
    setFormData({ ...formData, otherStateRegNo: [...formData.otherStateRegNo, ''] });
  };
  
  const handleRemoveStateLocalNo = (index) => {
    const updatedotherStateRegNo = formData.otherStateRegNo.filter((_, i) => i !== index);
    setFormData({ ...formData, otherStateRegNo: updatedotherStateRegNo });
  };
  
  const handleAddCentralRegNo = () => {
    setFormData({ ...formData, otherCentralRegNo: [...formData.otherCentralRegNo, ''] });
  };
  
  const handleRemoveCentralRegNo = (index) => {
    const updatedotherCentralRegNo = formData.otherCentralRegNo.filter((_, i) => i !== index);
    setFormData({ ...formData, otherCentralRegNo: updatedotherCentralRegNo });
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
  
    try {
      const response = await api.addTowers(formData);
      console.log('Step 4 Success:', response);  // Log the entire response object
      if(response.status === 401){
        console.log("Session Expired! Redirecting to Login.");
        localStorage.removeItem(utilis.string.localStorage.sessionId);
        localStorage.removeItem(utilis.string.localStorage.userData);
        navigate('/');
      }
      setMessage({ type: 'success', text: 'Step 4 completed successfully!' });
  
      if (response.status === 200) {
        const towerId = response.data?._id || response.data?.data?._id;
        const companyId = response.data?._id || response.data?.data?.companyId;
        const projectId = response.data?._id || response.data?.data?.projectId;
        
        addToast("Step 4 successfully completed", {
          appearance: "success",
          autoDismiss: true,
        });
  
        navigate('/addtowers/step5', { state: { towerId, companyId, projectId }, replace: true });
      } else {
        setMessage({ type: 'error', text: 'Unexpected response format.' });
        addToast(response.data?.message || "Something went wrong!", {
          appearance: "error",
          autoDismiss: true,
        });
      }
    } catch (error) {
      console.error('Error response:', error?.response);
      setMessage({ type: 'error', text: error?.response?.data?.message || 'Error submitting Step 4. Please try again.' });
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
        <h2>Add Project - Step 4</h2>

        {message && <div className={`message ${message.type}`}>{message.text}</div>}

        <form onSubmit={handleSubmit} className="addtowers-form">
          {/* New fields */}
          <input type="text" name="reraNo" placeholder="RERA No.*" value={formData.reraNo} onChange={handleChange} required />
          {/* <input type="text" name="otherStateRegNo" placeholder="State or Local No.*" value={formData.otherStateRegNo} onChange={handleChange} required /> */}
           {/* Dynamic fields for State or Local No. */}
  {formData.otherStateRegNo.map((stateLocalNo, index) => (
    <div key={index}>
      <input
        type="text"
        name={`otherStateRegNo[${index}]`}
        placeholder="State or Local No.*"
        value={stateLocalNo}
        onChange={(e) => {
          const updatedotherStateRegNo = [...formData.otherStateRegNo];
          updatedotherStateRegNo[index] = e.target.value;
          setFormData({ ...formData, otherStateRegNo: updatedotherStateRegNo });
        }}
        required
      />
      <button type="button" onClick={() => handleRemoveStateLocalNo(index)}>
        Remove
      </button>
    </div>
  ))}
  <button type="button" onClick={handleAddStateLocalNo}>
    Add State or Local No.
  </button>

          <input type="text" name="gstNo" placeholder="GSTNO*" value={formData.gstNo} onChange={handleChange} required />
          {/* <input type="text" name="approvalNo" placeholder="Approval No." value={formData.approvalNo} onChange={handleChange} required /> */}
          {/* <input type="text" name="DICPApprovalNo" placeholder="DICP Approval No." value={formData.DICPApprovalNo} onChange={handleChange} required /> */}
          {/* <input type="text" name="otherCentralRegNo" placeholder="Other Central No*" value={formData.otherCentralRegNo} onChange={handleChange} required /> */}

          {/* Dynamic fields for Other Central No. */}
  {formData.otherCentralRegNo.map((centralRegNo, index) => (
    <div key={index}>
      <input
        type="text"
        name={`otherCentralRegNo[${index}]`}
        placeholder="Other Central No.*"
        value={centralRegNo}
        onChange={(e) => {
          const updatedotherCentralRegNo = [...formData.otherCentralRegNo];
          updatedotherCentralRegNo[index] = e.target.value;
          setFormData({ ...formData, otherCentralRegNo: updatedotherCentralRegNo });
        }}
        required
      />
      <button type="button" onClick={() => handleRemoveCentralRegNo(index)}>
        Remove
      </button>
    </div>
  ))}
  <button type="button" onClick={handleAddCentralRegNo}>
    Add Other Central No.
  </button>

          {/* <input type="text" name="developerId" placeholder="Developer ID" value={formData.developerId} onChange={handleChange} required /> */}
          <select
  name="developerId"
  value={formData.developerId}
  onChange={handleChange}
  required
>
  <option value="">Select Developer*</option>
  {apiData.map((developer) => (
    <option key={developer._id} value={developer._id}>
      {developer.name}
    </option>
  ))}
</select>
       
        
          {/* <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange}  /> */}
          {/* <input type="text" name="appatAge" placeholder="Appat Age" value={formData.appatAge} onChange={handleChange}  /> */}

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
         )}
    </>
  );
};

export default AddTowersStep4;
