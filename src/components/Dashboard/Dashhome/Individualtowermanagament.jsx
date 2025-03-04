import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "./../../../api.js";
import Dashheader from "../Dashheader/Dashheader";
import Loading from "../../../utilis/Loading.js";
import "./individualtowermanagement.css";

const Individualtowermanagement = () => {
  const [loading, setLoading] = useState(true);
  const { towerName } = useParams();
  const towerId = localStorage.getItem("selectedTowerId");
  const [towerDetails, setTowerDetails] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchTowerDetails = async () => {
      if (!towerId) return console.error("No tower ID found in storage");
      setLoading(true);
      try {
        const response = await api.getindividualtowerdetails(towerId);
        if (response.status === 200) {
          const details = response.data.data[0];
          console.log(details,'details')
          const mappedName = details.name || details.towerName || "";
          setTowerDetails(details);
          setFormData({
            name: mappedName,
            ...details,
            aminities: details.aminities ? details.aminities.join(", ") : "",  // Convert array to string
            towerId,
            updatedBy: "677e58f1281e7de5a0dc42bf",
          });
        }
      } catch (error) {
        console.error("Error fetching tower details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTowerDetails();
  }, [towerId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!formData.name || formData.name.trim() === "") {
      alert("Name is required.");
      return;
    }
    const payload = {
      ...formData,
      aminities: formData.aminities
        ? formData.aminities.split(",").map((item) => item.trim()) // Convert back to an array
        : [],
    };

    try {
      const response = await api.updateProjectdetails(towerId, payload);
      if (response.status === 200) {
        setTowerDetails(payload);
        alert("Update successful!");
      }
    } catch (error) {
      console.error("Error updating tower details:", error);
      alert("Update failed!");
    }
  };

  const fields = [
    { key: "name", label: "Tower Name", type: "text" },
    { key: "city", label: "City", type: "text" },
    { key: "state", label: "State", type: "text" },
    { key: "street", label: "Street", type: "text" },
    { key: "pinCode", label: "Pincode", type: "number" },
    { key: "reraNo", label: "RERA No", type: "text" },
    { key: "DICPApprovalNo", label: "DICP Approval No", type: "text" },
    { key: "approvalNo", label: "Approval No", type: "text" },
    { key: "bedrooms", label: "Bedrooms", type: "text" },
    { key: "totalUnits", label: "Total Units", type: "text" },
    { key: "constructionStatus", label: "Construction Status", type: "text" },
    { key: "aminities", label: "Amenities (comma-separated)", type: "text" }, // Updated label for clarity
    { key: "location", label: "Location", type: "text" },
    { key: "noOfFlats", label: "No. of Flats", type: "number" },
    { key: "noOfBlocks", label: "No. of Blocks", type: "number" },
    { key: "remarks", label: "Remarks", type: "text" },
    { key: "projectType", label: "Project Type", type: "text" },
    { key: "developmentSize", label: "Development Size", type: "text" },
  ];

  return (
    <>
      <Dashheader />
      <div className="individualtower">
        {loading ? (
          <Loading />
        ) : (
          <div className="individualtower-container">
            <div className="tower-row">
              <div className="details-container">
                <table className="project-details-table">
                  <caption>Project Details</caption>
                  <tbody>
                    {fields.map((field) => (
                      <tr key={field.key}>
                        <th>{field.label}</th>
                        <td>
                          <input
                            type={field.type}
                            name={field.key}
                            value={formData[field.key] || ""}
                            onChange={handleInputChange}
                          />
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan="2" style={{ textAlign: "center" }}>
                        <button onClick={handleSave}>Save</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Individualtowermanagement;
