import React, { useEffect, useState } from "react";
import { useLocation,useNavigate  } from "react-router-dom";
import Dashheader from "../../Dashheader/Dashheader";
import api from "./../../../../api.js";
import "./updateflats.css";
import { useToasts } from "react-toast-notifications";
import utilis from "../../../../utilis";
const Updateflats = () => {
  let navigate = useNavigate();
        const { addToast } = useToasts();
  const location = useLocation();
  const towerId = location.state?.towerId || "";
  const [flatDetails, setFlatDetails] = useState([]);
  const storedData = JSON.parse(localStorage.getItem("AdminDetails")) || {};
  let managementId = storedData?.data?.data?._id || null;

  useEffect(() => {
    const fetchTowerDetails = async () => {
      if (!towerId) {
        console.error("No tower ID found in storage");
        return;
      }
      try {
        const response = await api.getindividualtowerdetails(towerId);
        console.log("API Response:", response?.data);
        if(response.status === 401){
          console.log("Session Expired! Redirecting to Login.");
          localStorage.removeItem(utilis.string.localStorage.sessionId);
          localStorage.removeItem(utilis.string.localStorage.userData);
          navigate('/');
        }
        if (response?.status === 200 && response?.data?.data?.length > 0) {
          const details = response.data.data[0];
          setFlatDetails(details.flatDetails || []);
          console.log("Updated Flat Details:", details.flatDetails);
        } else {
          console.error("Invalid data received from API");
        }
      } catch (error) {
        console.error("Error fetching tower details:", error);
      }
    };
    fetchTowerDetails();
  }, [towerId]);

  const handleInputChange = (index, field, value) => {
    const updatedFlats = [...flatDetails];
    updatedFlats[index] = { ...updatedFlats[index], [field]: value };
    setFlatDetails(updatedFlats);
  };

  const handleSave = async (flatId, flat) => {
    const updatedData = {
      name: flat.name,
      floor: flat.floor,
      flatNo: flat.flatNo,
      bedrooms: flat.bedrooms,
      sqFeet: flat.sqFeet,
      sqPrice: flat.sqPrice,
      specialFeature: flat.specialFeature,
      unitType: flat.unitType,

      specialFeaturePrice: flat.specialFeaturePrice,
      facing: flat.facing,
      vasthu: flat.vasthu,
      furnishingType: flat.furnishingType,
      parkingSlot: flat.parkingSlot,
      priceStartRange: flat.priceStartRange,
      priceEndRange: flat.priceEndRange,
      constructionStatus: flat.constructionStatus,
      updatedBy: managementId,
      // flatAge: "0",
      _id: flatId,
    };
  
    try {
      const response = await api.updateFlatdetails(updatedData);
      if (response.status === 200) {
        console.log("Flat updated successfully:", response.data);
        addToast("Flat updated successfully!", {
          appearance: "success",
          autoDismiss: true,
        });
      } else {
        console.error("Failed to update flat:", response);
        addToast("Failed to update flat. Please try again.", {
          appearance: "error",
          autoDismiss: true,
        });
      }
    } catch (error) {
      console.error("Error updating flat:", error);
      addToast("An error occurred while updating the flat.", {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };
  const companyId = flatDetails.length > 0 ? flatDetails[0]?.companyId : "";
  const projectId = flatDetails.length > 0 ? flatDetails[0]?.projectId : "";
  const blockId  = flatDetails.length > 0 ? flatDetails[0]?.blockId  : "";
  console.log(companyId,projectId,blockId,'blockId')
  const handleNewFlatSave = async (flat) => {
    const newFlatData = {
      name: flat.name,
      floor: flat.floor,
      flatNo: flat.flatNo,
      bedrooms: flat.bedrooms,
      sqFeet: flat.sqFeet,
      sqPrice: flat.sqPrice,
      specialFeature: flat.specialFeature,
      unitType: flat.unitType,
      specialFeaturePrice: flat.specialFeaturePrice,
      facing: flat.facing,
      vasthu: flat.vasthu,
      furnishingType: flat.furnishingType,
      parkingSlot: flat.parkingSlot,
      priceStartRange: flat.priceStartRange,
      priceEndRange: flat.priceEndRange,
      constructionStatus: flat.constructionStatus,
      // flatAge: "0",
      createdBy: managementId,
      blockId: blockId,
      projectId: projectId,
      towerId: towerId,
      companyId: companyId,
      isAvaliable: "AVALIABLE",
    };
  
    try {
      const response = await api.addFlats(newFlatData);
      if (response.status === 200) {
        console.log("New flat added successfully:", response.data);
        addToast("New flat added successfully!", {
          appearance: "success",
          autoDismiss: true,
        });
  
        // Replace temp ID with real ID from backend
        setFlatDetails((prevFlats) =>
          prevFlats.map((f) =>
            f._id === flat._id ? { ...flat, _id: response.data.data._id } : f
          )
        );
      } else {
        console.error("Failed to add new flat:", response);
        addToast("Failed to add new flat. Please try again.", {
          appearance: "error",
          autoDismiss: true,
        });
      }
    } catch (error) {
      console.error("Error adding new flat:", error);
      addToast("An error occurred while adding the flat.", {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };
  
  
  const handleAddFlat = () => {
    const newFlat = {
      _id: `temp_${Date.now()}`, // Temporary ID
      name: "",
      floor: "",
      flatNo: "",
      bedrooms: "",
      sqFeet: "",
      sqPrice: "",
      specialFeature: "",
      unitType: "",
      specialFeaturePrice: "",
      facing: "",
      vasthu: "",
      furnishingType: "",
      parkingSlot: "",
      priceStartRange: "",
      priceEndRange: "",
      constructionStatus: "",
      
    };
  
    setFlatDetails([...flatDetails, newFlat]);
  };
  
  

  return (
    <>
      <Dashheader />
      <div className="updateflatdetails-container">
        <h2 className="updateflatdetails-heading">Flat Details</h2>
        {flatDetails.length > 0 ? (
          <table className="updateflatdetails-table">
            <thead>
              <tr>
                <th>Flat Name</th>
                <th>Floor</th>
                <th>Flat No</th>
                <th>Bedrooms</th>
                <th>Sq. Feet</th>
                <th>Sq. Price</th>
                <th>Special Feature</th>
                <th>Unit Type</th>
                <th>isAvaliable</th>
                <th>Special Feature Price</th>
                
                <th>Facing</th>
                <th>Vasthu</th>
                <th>Furnishing</th>
                <th>Parking Slot</th>
                <th>Price Start</th>
                <th>Price End</th>
                <th>Construction Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {flatDetails.map((flat, index) => (
                <tr key={flat._id}>
                  <td><input type="text" value={flat.name} onChange={(e) => handleInputChange(index, "name", e.target.value)} /></td>
                  <td><input type="number" value={flat.floor} onChange={(e) => handleInputChange(index, "floor", e.target.value)} /></td>
                  <td><input type="text" value={flat.flatNo} onChange={(e) => handleInputChange(index, "flatNo", e.target.value)} /></td>
                  <td><input type="text" value={flat.bedrooms} onChange={(e) => handleInputChange(index, "bedrooms", e.target.value)} /></td>
                  <td><input type="text" value={flat.sqFeet} onChange={(e) => handleInputChange(index, "sqFeet", e.target.value)} /></td>
                  <td><input type="text" value={flat.sqPrice} onChange={(e) => handleInputChange(index, "sqPrice", e.target.value)} /></td>
                  <td><input type="text" value={flat.specialFeature} onChange={(e) => handleInputChange(index, "specialFeature", e.target.value)} /></td>
                  <td><input type="text" value={flat.unitType} onChange={(e) => handleInputChange(index, "unitType", e.target.value)} /></td>

                  <td><input type="text" value={flat.isAvaliable} onChange={(e) => handleInputChange(index, "isAvaliable", e.target.value)} /></td>

                  <td><input type="text" value={flat.specialFeaturePrice} onChange={(e) => handleInputChange(index, "specialFeaturePrice", e.target.value)} /></td>
                  <td><input type="text" value={flat.facing} onChange={(e) => handleInputChange(index, "facing", e.target.value)} /></td>
                  <td><input type="text" value={flat.vasthu} onChange={(e) => handleInputChange(index, "vasthu", e.target.value)} /></td>
                  <td><input type="text" value={flat.furnishingType} onChange={(e) => handleInputChange(index, "furnishingType", e.target.value)} /></td>
                  <td><input type="text" value={flat.parkingSlot} onChange={(e) => handleInputChange(index, "parkingSlot", e.target.value)} /></td>
                  <td><input type="text" value={flat.priceStartRange} onChange={(e) => handleInputChange(index, "priceStartRange", e.target.value)} /></td>
                  <td><input type="text" value={flat.priceEndRange} onChange={(e) => handleInputChange(index, "priceEndRange", e.target.value)} /></td>
                  <td><input type="text" value={flat.constructionStatus} onChange={(e) => handleInputChange(index, "constructionStatus", e.target.value)} /></td>
                  {/* <td><button className="updateflatdetails-save-btn" onClick={() => handleSave(flat._id, flat)}>Save</button></td> */}
                  <td>
  <button 
    className="updateflatdetails-save-btn" 
    onClick={() => flat._id.startsWith("temp_") ? handleNewFlatSave(flat) : handleSave(flat._id, flat)}
  >
    Save
  </button>
</td>

                </tr>
              ))}
            </tbody>
          </table>
        ) : <p>No flat details available.</p>}
        <button className="add-flat-btn" onClick={handleAddFlat}>Add More Flats</button>
      </div>
    </>
  );
};

export default Updateflats;
