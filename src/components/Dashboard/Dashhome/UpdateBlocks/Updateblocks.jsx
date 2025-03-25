import React, { useEffect, useState } from "react";
import { useLocation,useNavigate  } from "react-router-dom";
import "./updateblock.css";
import Dashheader from "../../Dashheader/Dashheader";
import api from "./../../../../api.js";
import { useToasts } from "react-toast-notifications";

import utilis from "../../../../utilis";

const Updateblocks = () => {
      const { addToast } = useToasts();
  const location = useLocation();
  const towerId = location.state?.towerId || "";
  const [blockDetails, setBlockDetails] = useState([]);
  const [newBlocks, setNewBlocks] = useState([]); // State for newly added blocks
    let navigate = useNavigate();
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
          console.log(details, "details");

          

          // Set only block details
          if (details.blockDetails) {
            setBlockDetails(details.blockDetails);
          }
        } else {
          console.error("Invalid data received from API");
        }
      } catch (error) {
        console.error("Error fetching tower details:", error);
      }
    };
    fetchTowerDetails();
  }, [towerId]);

  console.log("Received towerId in updateblocks:", towerId);

  // Handle input changes for existing blocks
  const handleInputChange = (index, field, value) => {
    const updatedBlocks = [...blockDetails];
    updatedBlocks[index] = { ...updatedBlocks[index], [field]: value };
    setBlockDetails(updatedBlocks);
  };

  // Handle input changes for new blocks
  const handleNewBlockInputChange = (index, field, value) => {
    const updatedNewBlocks = [...newBlocks];
    updatedNewBlocks[index] = { ...updatedNewBlocks[index], [field]: value };
    setNewBlocks(updatedNewBlocks);
  };

  const storedData = JSON.parse(localStorage.getItem("AdminDetails")) || {};
  let managementId = storedData?.data?.data?._id || null;
  const companyId = blockDetails.length > 0 ? blockDetails[0]?.companyId : "";
  const projectId = blockDetails.length > 0 ? blockDetails[0]?.projectId : "";


  // Handle saving existing block details
  const handleSave = async (blockId, block) => {
    const updatedData = {
      _id: blockId,
      name: block.name,
      noOfFloors: block.noOfFloors,
      noOfFlats: block.noOfFlats,
      parkingSpace: block.parkingSpace,
      updatedBy: managementId,
    };

    try {
      const response = await api.updateBlockdetails(updatedData);
      if (response.status === 200) {
        console.log("Block updated successfully:", response.data);
        addToast("Block updated successfully!", {
          appearance: "success",
          autoDismiss: true,
        });
     
      } else {
        console.error("Failed to update block:", response);
        addToast("something went wrong", {
          appearance: "error",
          autoDismiss: true,
        });
      }
    } catch (error) {
      console.error("Error updating block:", error);
    }
  };

  // Handle adding a new block
  const handleAddNewBlock = () => {
    setNewBlocks([
      ...newBlocks,
      {
        name: "",
        noOfFloors: "",
        noOfFlats: "",
        parkingSpace: "NA",
      },
    ]);
  };

  // Handle saving new block details
  const handleSaveNewBlock = async (block) => {
    try {
      const response = await api.addTowers({
        // towerId,
        name: block.name,
        noOfFloors: block.noOfFloors,
        noOfFlats: block.noOfFlats,
        parkingSpace: block.parkingSpace,
        createdBy: managementId,
        step : 2,
        towerId:towerId,
        companyId:companyId,
        projectId:projectId,
      });

      if (response.status === 200) {
        console.log("New block added successfully:", response.data);
        // alert("New block added successfully!");
        addToast("New block added successfully!", {
          appearance: "success",
          autoDismiss: true,
        });
        setNewBlocks(newBlocks.filter((b) => b !== block)); // Remove saved block from state
      } else {
        console.error("Failed to add new block:", response);
        addToast("something went wrong", {
          appearance: "error",
          autoDismiss: true,
        });
        
      }
    } catch (error) {
      console.error("Error adding new block:", error);
    }
  };
  
const [projectVisible, setProjectVisible] = useState(true); // Default value
const handleToggle = async () => {
  const newValue = !projectVisible;
  setProjectVisible(newValue);

  const payload = {
    towerId: "67a45fac9ddbde51ebd69615", // Replace with dynamic towerId if needed
    isVisible: newValue, // Sending updated value (true/false)
  };

  try {
    const response = await api.isProjectIsvisble(payload); // Ensure API method accepts payload
    if (response.status === 200) {
      console.log("Visibility successfully updated:", response.data);
      addToast("Tower visibility changed successfully!", {
        appearance: "success",
        autoDismiss: true,
      });
    } else {
      console.error("Failed:", response);
      addToast("Something went wrong", {
        appearance: "error",
        autoDismiss: true,
      });
    }
  } catch (error) {
    console.error("Error changing tower visibility:", error);
    addToast("Error changing visibility", {
      appearance: "error",
      autoDismiss: true,
    });
  }
};


  return (
    <>
      <Dashheader />

      <div className="updateblockdetails-container">
        <h2 className="updateblockdetails-heading">Block Details</h2>
        {blockDetails.length > 0 ? (
          <table className="updateblockdetails-table">
            <thead>
              <tr>
                <th className="updateblockdetails-th">Block Name</th>
                <th className="updateblockdetails-th">No of Floors</th>
                <th className="updateblockdetails-th">No of Flats</th>
                <th className="updateblockdetails-th">Parking Space</th>
                <th className="updateblockdetails-th">Action</th>
              </tr>
            </thead>
            <tbody>
              {blockDetails.map((block, index) => (
                <tr key={block._id}>
                  <td className="updateblockdetails-td">
                    <input
                      className="updateblockdetails-input"
                      type="text"
                      value={block.name}
                      onChange={(e) =>
                        handleInputChange(index, "name", e.target.value)
                      }
                    />
                  </td>
                  <td className="updateblockdetails-td">
                    <input
                      className="updateblockdetails-input"
                      type="number"
                      value={block.noOfFloors}
                      onChange={(e) =>
                        handleInputChange(index, "noOfFloors", e.target.value)
                      }
                    />
                  </td>
                  <td className="updateblockdetails-td">
                    <input
                      className="updateblockdetails-input"
                      type="number"
                      value={block.noOfFlats}
                      onChange={(e) =>
                        handleInputChange(index, "noOfFlats", e.target.value)
                      }
                    />
                  </td>
                  <td className="updateblockdetails-td">
                    <input
                      className="updateblockdetails-input"
                      type="text"
                      value={block.parkingSpace}
                      onChange={(e) =>
                        handleInputChange(index, "parkingSpace", e.target.value)
                      }
                    />
                  </td>
                  <td className="updateblockdetails-td">
                    <button
                      className="updateblockdetails-button"
                      onClick={() => handleSave(block._id, block)}
                    >
                      Save
                    </button>
                  </td>
                </tr>
              ))}

              {newBlocks.map((block, index) => (
                <tr key={`new-${index}`}>
                  <td className="updateblockdetails-td">
                    <input
                      className="updateblockdetails-input"
                      type="text"
                      value={block.name}
                      onChange={(e) =>
                        handleNewBlockInputChange(index, "name", e.target.value)
                      }
                    />
                  </td>
                  <td className="updateblockdetails-td">
                    <input
                      className="updateblockdetails-input"
                      type="text"
                      value={block.noOfFloors}
                      onChange={(e) =>
                        handleNewBlockInputChange(index, "noOfFloors", e.target.value)
                      }
                    />
                  </td>
                  <td className="updateblockdetails-td">
                    <input
                      className="updateblockdetails-input"
                      type="text"
                      value={block.noOfFlats}
                      onChange={(e) =>
                        handleNewBlockInputChange(index, "noOfFlats", e.target.value)
                      }
                    />
                  </td>
                  <td className="updateblockdetails-td">
                    <input
                      className="updateblockdetails-input"
                      type="text"
                      value={block.parkingSpace}
                      onChange={(e) =>
                        handleNewBlockInputChange(index, "parkingSpace", e.target.value)
                      }
                    />
                  </td>
                  <td className="updateblockdetails-td">
                    <button
                      className="updateblockdetails-button"
                      onClick={() => handleSaveNewBlock(block)}
                    >
                      Save
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="updateblockdetails-empty">No block details available.</p>
        )}

        <button className="updateblockdetails-button" onClick={handleAddNewBlock}>
          Add New Block
        </button>
      </div>
    </>
  );
};

export default Updateblocks;
