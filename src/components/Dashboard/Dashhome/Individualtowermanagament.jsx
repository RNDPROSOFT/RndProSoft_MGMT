import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "./../../../api.js";
import Dashheader from "../Dashheader/Dashheader";
import Loading from "../../../utilis/Loading.js";
import "./individualtowermanagement.css";
import { useToasts } from "react-toast-notifications";
import utilis from "../../../utilis";

const Individualtowermanagement = () => {
    
    const { addToast } = useToasts();
  const [loading, setLoading] = useState(true);
  const { towerName } = useParams();
  const towerId = localStorage.getItem("selectedTowerId") || "";
  console.log("Retrieved towerId from localStorage:", towerId);

  const [towerDetails, setTowerDetails] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchTowerDetails = async () => {
      if (!towerId) {
        console.error("No tower ID found in storage");
        return;
      }
      setLoading(true);
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

          setProjectVisible(details.isVisible === true);
          setTowerDetails(details);
          setFormData({
            name: details.name || details.towerName || "Default Name",
            ...details,
            amenities: Array.isArray(details.amenities)
              ? details.amenities.join(", ")
              : details.amenities || "",
            bedrooms: Array.isArray(details.bedrooms)
              ? details.bedrooms.join(", ")
              : details.bedrooms || "",
            towerId,
            updatedBy: "677e58f1281e7de5a0dc42bf",
          });

          localStorage.setItem("originalTowerData", JSON.stringify(details));
        } else {
          console.error("Invalid data received from API");
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
    console.log(`Updating ${name}:`, value);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!formData.name || formData.name.trim() === "") {
      // alert("Name is required.");
      console.error("Error: Name field is missing in formData");
      return;
    }
  
    const storedData = JSON.parse(localStorage.getItem("AdminDetails")) || {};
    let managementId = storedData?.data?.data?._id || null;
  
    const originalData = JSON.parse(localStorage.getItem("originalTowerData")) || {};
  
    // Extract only the displayed fields
    const payload = {
      name: formData.name,
      city: formData.city,
      state: formData.state,
      street: formData.street,
      pinCode: Number(formData.pinCode) || 0,
      reraNo: formData.reraNo,
      // gstNo: formData.gstNo,
      gstNo: Array.isArray(formData.gstNo)
      ? formData.gstNo
      : formData.gstNo?.trim()
          ? formData.gstNo.split(",").map((item) => item.trim())
          : [], // Ensure gstNo is not empty
      // otherStateRegNo: formData.otherStateRegNo,
      otherStateRegNo: Array.isArray(formData.otherStateRegNo)
  ? formData.otherStateRegNo
  : formData.otherStateRegNo?.trim()
      ? formData.otherStateRegNo.split(",").map((item) => item.trim())
      : [], // Ensure otherStateRegNo is not empty
      bedrooms: formData.bedrooms?.split(",").map((b) => b.trim()) || [],
      totalUnits: formData.totalUnits,
      constructionStatus: formData.constructionStatus,
      // amenities: formData.amenities?.split(",").map((a) => a.trim()) || [],
      location: formData.location,
      noOfFlats: Number(formData.noOfFlats) || 0,
      noOfBlocks: Number(formData.noOfBlocks) || 0,
      remarks: formData.remarks,
      projectType: formData.projectType,
      developmentSize: formData.developmentSize,
      apparRegistrationNo: formData.apparRegistrationNo,
      // otherCentralRegNo: formData.otherCentralRegNo,
      otherCentralRegNo: Array.isArray(formData.otherCentralRegNo)
      ? formData.otherCentralRegNo
      : formData.otherCentralRegNo?.split(",").map((item) => item.trim()) || [],
      priceStartRange: formData.priceStartRange,
      priceEndRange: formData.priceEndRange,
      // appatAge : Number(formData.appatAge) || 0,
      towerId: formData.towerId,
      updatedBy: managementId,
    };
  
    console.log("Payload being sent:", payload);
  
    try {
      const response = await api.updateProjectdetails(payload);
      console.log("API Response:", response);
      if (response.status === 200) {
        setTowerDetails(payload);
        addToast(response.data?.message ||"project details updated successfully", {
          appearance: "success",
          autoDismiss: true,
        });
        // alert("Update successful!");
      } else {
        // alert("Update failed! Please check the data.");
        addToast("Update failed! Please check the data.", {
          appearance: "error",
          autoDismiss: true,
        });
      }
    } catch (error) {
      console.error("Error updating tower details:", error);
      addToast("Update failed!", {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };
  

  const fields = [
    { key: "name", label: "Tower Name", type: "text" },
    { key: "city", label: "City", type: "text" },
    { key: "state", label: "State", type: "text" },
    { key: "street", label: "Street", type: "text" },
    { key: "pinCode", label: "Pincode", type: "number" },
    { key: "reraNo", label: "RERA No", type: "text" },
    { key: "gstNo", label: "GST NO", type: "text" },
    { key: "otherStateRegNo", label: "STATE/LOCALNO", type: "text" },
    { key: "otherCentralRegNo", label: "Other Central", type: "text" },
    { key: "bedrooms", label: "Bedrooms", type: "text" },
    { key: "totalUnits", label: "Total Units", type: "text" },
    { key: "constructionStatus", label: "Construction Status", type: "text" },
    // { key: "amenities", label: "Amenities", type: "text" },
    { key: "location", label: "Location", type: "text" },
    { key: "noOfFlats", label: "No. of Flats", type: "number" },
    { key: "noOfBlocks", label: "No. of Blocks", type: "number" },
    { key: "remarks", label: "Remarks", type: "text" },
    { key: "projectType", label: "Project Type", type: "text" },
    { key: "developmentSize", label: "Development Size", type: "text" },
    // { key: "apparRegistrationNo", label: "Appar Registration No", type: "text" },
   
    { key: "priceStartRange", label: "Price Start Range", type: "text" },
    { key: "priceEndRange", label: "Price End Range", type: "text" },
    // {key:"appatAge",label:"Appat Age",type:"number"},
  ];


  const handleAboutChange = (e, mainIndex, subIndex, field) => {
    const { value } = e.target;
  
    setFormData((prevData) => {
      const updatedAboutDetails = [...prevData.aboutDetails];
  
      // Update the specific title/description in the about array
      updatedAboutDetails[mainIndex].about[subIndex][field] = value;
  
      return {
        ...prevData,
        aboutDetails: updatedAboutDetails,
      };
    });
  };
  
  const [aboutDetails, setAboutDetails] = useState(null);
  
  const handleaboutSave = async (mainIndex, subIndex) => {
    const storedData = JSON.parse(localStorage.getItem("AdminDetails")) || {};
    let managementId = storedData?.data?.data?._id || null;
  
    // Get the specific about item based on indexes
    const aboutItem = formData.aboutDetails[mainIndex].about[subIndex];
  
    if (!aboutItem) {
      console.error("Error: About details are missing.");
      return;
    }
  
    // Construct the payload for the selected about item
    const payload = {
      about: [aboutItem],  // Send only the selected item
      updatedBy: managementId,
      aboutId: formData.aboutDetails[mainIndex]._id,  // Send the correct aboutId
    };
  
    console.log("Payload being sent:", JSON.stringify(payload, null, 2));
  
    try {
      const response = await api.updateAboutdetails(payload);
      console.log("API Response:", response);
      if (response.status === 200) {
        addToast("About details updated successfully", {
          appearance: "success",
          autoDismiss: true,
        });
      } else {
        addToast("Update failed! Please check the data.", {
          appearance: "error",
          autoDismiss: true,
        });
      }
    } catch (error) {
      console.error("Error updating about details:", error);
      addToast("Update failed!", {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };
  
  
  



const storedData = JSON.parse(localStorage.getItem("AdminDetails")) || {};
let managementId = storedData?.data?.data?._id || null;

const [aboutformData, setAboutFormData] = useState({
  about: [],
  createdBy4: managementId,
  step: 5,
  towerId: towerId || "",
  companyId: formData?.companyId || "",  // Ensure it's assigned correctly
  projectId: formData?.projectId || "",  // Ensure it's assigned correctly
});
useEffect(() => {
  if (formData?.companyId && formData?.projectId) {
    setAboutFormData((prevData) => ({
      ...prevData,
      companyId: formData.companyId,
      projectId: formData.projectId,
    }));
  }
}, [formData]);


const handlenewAboutChange = (e, index, field) => {
  const { value } = e.target;
  
  setAboutFormData((prevData) => {
    const updatedData = [...prevData.about];
    updatedData[index] = { ...updatedData[index], [field]: value };

    return { ...prevData, about: updatedData };
  });
};

// ✅ Add a new About entry safely
const handleAddAbout = () => {
  setAboutFormData((prevData) => ({
    ...prevData,
    about: [...prevData.about, { title: "", description: "" }],
  }));
};

// ✅ Remove an About entry safely
const handleRemoveAbout = (index) => {
  setAboutFormData((prevData) => ({
    ...prevData,
    about: prevData.about.filter((_, i) => i !== index),
  }));
};

// ✅ Submit the About data separately
const handleSubmitAbout = async (e) => {
  e.preventDefault();
  setLoading(true); // ✅ Ensure loading starts before request

  try {
    const response = await api.addTowers(aboutformData); // Send only aboutformData

    console.log("Step 5 Success:", response.data);

    if (response.status === 200) {
      addToast("New about added successfully", {
        appearance: "success",
        autoDismiss: true,
      });
    } else {
      addToast("Something went wrong", {
        appearance: "error",
        autoDismiss: true,
      });
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    setLoading(false); // ✅ Stop loading after request
  }
};


const navigate = useNavigate();

const handleblocksdetails = () => {
  const towerId = localStorage.getItem("selectedTowerId") || "";
  console.log("Retrieved towerId from localStorage:", towerId);

  navigate("/dashboard/updateblocks", { state: { towerId } });
};

const handleflatsdetails = () => {
  const towerId = localStorage.getItem("selectedTowerId") || "";
  console.log("Retrieved towerId from localStorage:", towerId);

  navigate("/dashboard/updateflats", { state: { towerId } });
};

const handleimagesdetails= () => {
  const towerId = localStorage.getItem("selectedTowerId") || "";
  console.log("Retrieved towerId from localStorage:", towerId);

  navigate("/dashboard/updateimages", { state: { towerId } });
};
const [projectVisible, setProjectVisible] = useState(true); // Default value
const handleToggle = async () => {
  const newValue = !projectVisible;
  setProjectVisible(newValue);

  const payload = {
    towerId: towerId, // Replace with dynamic towerId if needed
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
      <div className="individualtower">

        {loading ? (
          <Loading />
        ) : (
          
          <div className="individualtower-container">
               <div className="towervisible">
    <label className="towervisible-label">Project Visibility</label>
    <div className="toggle-container" onClick={handleToggle}>
      <div className={`toggle-btn ${projectVisible ? "active" : ""}`}>
        {projectVisible ? "Yes" : "No"}
      </div>
    </div>
  </div>
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

      <div className="individualabouttowerdetails">
  <table className="project-details-table">
    <caption>About Details</caption>
    <tbody>
      {formData.aboutDetails?.map((aboutItem, mainIndex) =>
        aboutItem.about.map((subItem, subIndex) => (
          <tr key={`${mainIndex}-${subIndex}`}>
            <td>
              <input
                type="text"
                placeholder="Title"
                value={subItem.title}
                onChange={(e) => handleAboutChange(e, mainIndex, subIndex, "title")}
              />
            </td>
            <td>
              <input
                type="text"
                placeholder="Description"
                value={subItem.description}
                onChange={(e) => handleAboutChange(e, mainIndex, subIndex, "description")}
              />
            </td>
            <td>
              <button onClick={() => handleaboutSave(mainIndex, subIndex)}>
                Save
              </button>
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>



<div className="particularprojectnew-about-container">
  <h2 className="particularprojectnew-about-heading">About Section</h2>

  {aboutformData.about.map((item, index) => (
    <div key={index} className="particularprojectnew-about-fields">
      <input
        type="text"
        name={`about.${index}.title`}
        value={item.title}
        onChange={(e) => handlenewAboutChange(e, index, "title")}
        placeholder="Enter Title"
        className="particularprojectnew-about-input"
      />
      <textarea
        name={`about.${index}.description`}
        value={item.description}
        onChange={(e) => handlenewAboutChange(e, index, "description")}
        placeholder="Enter Description"
        className="particularprojectnew-about-textarea"
      />
      <button
        className="particularprojectnew-about-remove-btn"
        onClick={() => handleRemoveAbout(index)}
      >
        Remove
      </button>
    </div>
  ))}

  <div className="particularprojectnew-about-buttons">
    <button className="particularprojectnew-about-add-btn" onClick={handleAddAbout}>
      + Add About
    </button>

    {/* ✅ Show Save Button Only If At Least One Entry Exists */}
    {aboutformData.about.length > 0 && (
      <button className="particularprojectnew-about-save-btn" onClick={handleSubmitAbout}>
        Save
      </button>
    )}
  </div>
</div>






      <div className="blocksflats">
        <button className="particularprojectblockflats" onClick={handleblocksdetails}>Update Blocks</button>
        <button className="particularprojectblockflats" onClick={handleflatsdetails}>Update Flats</button>
        <button className="particularprojectblockflats" onClick={handleimagesdetails}>Update Images</button>
        
      </div>

    </>
  );
};

export default Individualtowermanagement;
