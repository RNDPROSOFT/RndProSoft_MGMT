import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import api from "./../../../../api.js";
import "./editpartner.css";
import Dashheader from "../../Dashheader/Dashheader";
import { useParams } from "react-router-dom";
import utilis from '../../../../utilis';
const EditPartner = () => {
   const navigate = useNavigate();
  const { id } = useParams();
  const [partner, setPartner] = useState({
    name: "",
    emailId: "",
    phoneNumber: "",
    title: "",
    about: "",
    city: "",
    state: "",
    pinCode: "",
    street: "",
    houseNo: "",
    status: "",
    remarks: "",
  
  });

  const GetPartner = async () => {
    try {
        let response = await api.getParticularPartnerdetails(id); // Pass the projectId (id) correctly
        const partnerData = response?.data?.data?.[0] || {};
        setPartner(partnerData);
        console.log("Fetched Partner Data:", partnerData);
        if(response.status === 401){
          console.log("Session Expired! Redirecting to Login.");
          localStorage.removeItem(utilis.string.localStorage.sessionId);
          localStorage.removeItem(utilis.string.localStorage.userData);
          navigate('/');
        }
    } catch (error) {
        console.error("Error fetching partner details:", error);
    }
};

  useEffect(() => {
    GetPartner();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPartner((prev) => ({ ...prev, [name]: value }));
  };

  const storedData = JSON.parse(localStorage.getItem("AdminDetails")) || {};
  let managementId = storedData?.data?.data?._id || null;
  const handleSave = async () => {
    try {
        const dataToSend = {
            name: partner.name,
            phoneNumber: partner.phoneNumber,
            emailId: partner.emailId,
            about: partner.about,
            status: partner.status,
            remarks: partner.remarks,
            houseNo: partner.houseNo,
            street: partner.street,
            city: partner.city,
            state: partner.state,
            pinCode: Number(partner.pinCode), // Convert to number
            projectId: id, // Hidden field
            updatedBy: managementId, // Hidden field
        };

        console.log("Sending Data to API:", JSON.stringify(dataToSend, null, 2));

        let response = await api.updatePartnerdetails(dataToSend);

        if (response.status === 200) {
            alert("Partner details updated successfully!");
        } else {
            alert("Failed to update partner details!");
        }
    } catch (error) {
        console.error("Error updating partner details:", error.response?.data || error.message);
        alert("Update failed!");
    }
};

  

  return (
    <>
      <Dashheader />
      <div className="edit-partner-container">
        <h2>Edit Partner Details</h2>
        <table className="edit-partner-table">
          <tbody>
            <tr>
              <th>Name:</th>
              <td>
                <input
                  type="text"
                  name="name"
                  value={partner.name || ""}
                  onChange={handleInputChange}
                />
              </td>
            </tr>

            <tr>
              <th>Email:</th>
              <td>
                <input
                  type="email"
                  name="emailId"
                  value={partner.emailId || ""}
                  onChange={handleInputChange}
                />
              </td>
            </tr>

            <tr>
              <th>Phone:</th>
              <td>
                <input
                  type="text"
                  name="phoneNumber"
                  value={partner.phoneNumber || ""}
                  onChange={handleInputChange}
                />
              </td>
            </tr>

            {/* <tr>
              <th>Title:</th>
              <td>
                <input
                  type="text"
                  name="title"
                  value={partner.title || ""}
                  onChange={handleInputChange}
                />
              </td>
            </tr> */}

            <tr>
              <th>About:</th>
              <td>
                <textarea
                  name="about"
                  value={partner.about || ""}
                  onChange={handleInputChange}
                />
              </td>
            </tr>

            {/* <tr>
              <th>Company ID:</th>
              <td>
                <input
                  type="text"
                  name="companyId"
                  value={partner.companyId || ""}
                  disabled
                />
              </td>
            </tr> */}

            <tr>
              <th>City:</th>
              <td>
                <input
                  type="text"
                  name="city"
                  value={partner.city || ""}
                  onChange={handleInputChange}
                />
              </td>
            </tr>

            <tr>
              <th>State:</th>
              <td>
                <input
                  type="text"
                  name="state"
                  value={partner.state || ""}
                  onChange={handleInputChange}
                />
              </td>
            </tr>

            <tr>
              <th>Pin Code:</th>
              <td>
                <input
                  type="text"
                  name="pinCode"
                  value={partner.pinCode || ""}
                  onChange={handleInputChange}
                />
              </td>
            </tr>

            <tr>
              <th>Street:</th>
              <td>
                <input
                  type="text"
                  name="street"
                  value={partner.street || ""}
                  onChange={handleInputChange}
                />
              </td>
            </tr>

            <tr>
              <th>House No:</th>
              <td>
                <input
                  type="text"
                  name="houseNo"
                  value={partner.houseNo || ""}
                  onChange={handleInputChange}
                />
              </td>
            </tr>

            <tr>
              <th>Status:</th>
              <td>
                <input
                  type="text"
                  name="status"
                  value={partner.status || ""}
                  onChange={handleInputChange}
                />
              </td>
            </tr>

            <tr>
              <th>Remarks:</th>
              <td>
                <input
                  type="text"
                  name="remarks"
                  value={partner.remarks || ""}
                  onChange={handleInputChange}
                />
              </td>
            </tr>

            {/* <tr>
              <th>Company Logo:</th>
              <td>
                <img
                  src={partner.proLogo}
                  alt="Company Logo"
                  style={{ width: "100px", height: "100px" }}
                />
              </td>
            </tr> */}

            {/* <tr>
              <th>Project Gallery:</th>
              <td>
                <div className="gallery-container">
                  {partner.proGalary?.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Gallery Image ${index + 1}`}
                      style={{ width: "100px", height: "100px", margin: "5px" }}
                    />
                  ))}
                </div>
              </td>
            </tr> */}
          </tbody>
        </table>

        <button type="button" onClick={handleSave}>
          Save
        </button>
      </div>
    </>
  );
};

export default EditPartner;
