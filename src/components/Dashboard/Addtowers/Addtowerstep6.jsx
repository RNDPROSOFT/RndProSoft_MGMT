import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Dashhome from '../Dashhome/Dashhome';
import Dashheader from '../Dashheader/Dashheader';
import api from './../../../api.js';

const Addtowerstep6 = () => {

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
      console.log(response, 'Full Response');
      
      // Check if response.data.data exists and contains the block data
      if (response.data && response.data.data) {
        setBlockData([response.data.data]);  // Wrap response.data.data in an array
        console.log(response.data.data,'responsedata')
      } else {
        setBlockData([]);  // Fallback to empty array if no block data is available
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
    facing: 'EAST',
    vasthu: '',
    furnishingType: 'FULLY-FURNISHED',
    isAvaliable: 'BOOKED',
    parkingSlot: '',
    sqFeet: '',
    priceStartRange: '',
    priceEndRange: '',
    constructionStatus: 'READYTOMOVE',
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
  
      return { ...prevData, [name]: value };
    });
  };
  
  

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form Data: ', formData);
  
    // Create FormData object to send form data including files
    const formDataToSend = new FormData();
  
    // Append non-file form data, except priceStartUnit and priceEndUnit
    Object.keys(formData).forEach((key) => {
      if (key !== "priceStartUnit" && key !== "priceEndUnit" && key !== "flatImages" && key !== "flatPlanImages") {
        formDataToSend.append(key, formData[key]);
      }
    });
  
    // Append files only once
    if (formData.flatImages) {
      formDataToSend.append('flatImages', formData.flatImages);
    }
    if (formData.flatPlanImages) {
      formDataToSend.append('flatPlanImages', formData.flatPlanImages);
    }
  
    try {
      const response = await api.addFlats(formDataToSend);
      console.log('Step 6 Success:', response.data);
  
      if (response.status === 200) {
        alert("Flats added successfully");
        console.log('Data successfully submitted:', response.data);
      } else {
        console.error('Failed to submit data:', response);
      }
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };
  
  
  
  

  return (
    <>
      <Dashheader />
      <div className="addtowerstep6">
        <h2>Step 6 - Add Flat Details</h2>
        <form onSubmit={handleSubmit} className="form-container">
          <div className="form-group">
            <label>Flat Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Floor:</label>
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
            <label>Flat Number:</label>
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
  <label>Block:</label>
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
            <label>Bedrooms:</label>
            <input
              type="text"
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Facing:</label>
            <select
              name="facing"
              value={formData.facing}
              onChange={handleChange}
              required
              className="form-select"
            >
              <option value="EAST">East</option>
              <option value="WEST">West</option>
              <option value="NORTH">North</option>
              <option value="SOUTH">South</option>
            </select>
          </div>

          <div className="form-group">
            <label>Vastu:</label>
            <input
              type="text"
              name="vasthu"
              value={formData.vasthu}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Furnishing Type:</label>
            <select
              name="furnishingType"
              value={formData.furnishingType}
              onChange={handleChange}
              required
              className="form-select"
            >
              <option value="FULLY-FURNISHED">FULLY-FURNISHED</option>
              <option value="SEMI-FURNISHED">SEMI-FURNISHED</option>
              <option value="UNFURNISHED">NON-FURNISHED</option>
            </select>
          </div>

          <div className="form-group">
            <label>Availability:</label>
            <select
              name="isAvaliable"
              value={formData.isAvaliable}
              onChange={handleChange}
              required
              className="form-select"
            >
              <option value="BOOKED">BOOKED</option>
              <option value="AVAILABLE">AVALIABLE</option>
              <option value="AVAILABLE">ONHOLD</option>
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
    required
  />
  <div className="radio-group">
    <label>
      <input
        type="radio"
        name="priceStartUnit"
        value="Lakhs"
        checked={formData.priceStartUnit === "Lakhs"}
        onChange={handleChange}
        required
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
        required
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
    required
  />
  <div className="radio-group">
    <label>
      <input
        type="radio"
        name="priceEndUnit"
        value="Lakhs"
        checked={formData.priceEndUnit === "Lakhs"}
        onChange={handleChange}
        required
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
        required
      />
      Crores
    </label>
  </div>
</div>
<div className="form-group">
            <label>Square Feet:</label>
            <input
              type="text"
              name="sqFeet"
              value={formData.sqFeet}
              onChange={handleChange}
              className="form-input"
            />
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
              <option value="READYTOMOVE">Ready to Move</option>
              <option value="UNDERCONSTRUCTION">Under Construction</option>
            </select>
          </div>

          <div className="form-group">
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
          </div>

          <button type="submit" className="form-button">Submit</button>
        </form>
      </div>
    </>
  );
};

export default Addtowerstep6;
