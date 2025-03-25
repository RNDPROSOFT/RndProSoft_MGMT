import React, { useState, useEffect } from "react";
import { Modal, Input, Select, Button } from "antd"; // Import Ant Design components
import api from "./../../../../api.js";
import "./flatdetails.css";
import Dashheader from "../../Dashheader/Dashheader";
import { useLocation, useNavigate } from "react-router-dom";
import Loading from "../../../../utilis/Loading.js";
import { useToasts } from "react-toast-notifications";
import utilis from "../../../../utilis";

const Flatdetails = () => {
   const { addToast } = useToasts();
  const [loading, setLoading] = useState(true);
  const [flatDetails, setFlatDetails] = useState([]);
  const [error, setError] = useState(null);
  const [selectedFlat, setSelectedFlat] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [isEstimationModalOpen, setIsEstimationModalOpen] = useState(false); // New state for estimation form

  const location = useLocation();
  const towerId = location.state?.towerId || localStorage.getItem("selectedTowerId");
  const storedData = JSON.parse(localStorage.getItem("AdminDetails")) || {};
  let managementId = storedData?.data?.data?._id || null;
  const [formData, setFormData] = useState({
    name: "",
    towerName: "",
    phone: '',
    countryCode: "+91",
    emailId: "",
    address: "",
    pinCode: '',
    flatNo: "",
    blockNo: "",
    sqFeet: "",
    sqPrice: "",
    unitType: "",
    specialFeaturePrice: "",
    specialFeature: "",
    totalAmount: "",
    installmentType: "",
    intrestRate: '',
    remarks: "",
    createdBy:managementId,
  });

  const GetFlatDetails = async () => {
    if (!towerId) {
      setError("No Tower ID found.");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      let response = await api.getAllFlatsDetailsForBooking(towerId);
      let allFlats = response.data.data;
      if(response.status === 401){
        console.log("Session Expired! Redirecting to Login.");
        localStorage.removeItem(utilis.string.localStorage.sessionId);
        localStorage.removeItem(utilis.string.localStorage.userData);
        navigate('/');
      }
      console.log(response.data.data ,'flatdetails')
      let filteredFlats = allFlats.filter((flat) => String(flat.towerId) === String(towerId));

      setFlatDetails(filteredFlats.length > 0 ? filteredFlats : allFlats);
    } catch (error) {
      console.error("Error fetching flat details:", error);
      setError("Failed to load flat details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetFlatDetails();
  }, []);

  const openModal = (flat) => {
    setSelectedFlat(flat);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFlat(null);
  };

  const openEstimationModal = () => {
    if (selectedFlat) {
     // Ensure the values are treated as numbers (use parseFloat or Number())
     const sqFeet = parseFloat(selectedFlat.sqFeet) || 0;  // Default to 0 if NaN
     const sqPrice = parseFloat(selectedFlat.sqPrice) || 0;  // Default to 0 if NaN
     const specialFeaturePrice = parseFloat(selectedFlat.specialFeaturePrice) || 0;  // Default to 0 if NaN
     const intrestRate = parseFloat(selectedFlat.intrestRate) || 0;  // Default to 0 if NaN
     console.log("sqFeet:", sqFeet);
     console.log("sqPrice:", sqPrice);
     console.log("specialFeaturePrice:", specialFeaturePrice);
     console.log("intrestRate:", intrestRate);
     const A = sqFeet * sqPrice;
     const B = A + specialFeaturePrice;
     const totalAmount = B + (B * (intrestRate / 100));  // Calculate total amount
      setFormData({
        ...formData,
        towerName:selectedFlat.name || "",
        flatNo: selectedFlat.flatNo || "",
        blockNo: selectedFlat.blockName || "",
        sqFeet: selectedFlat.sqFeet || "",
        sqPrice: selectedFlat.sqPrice || "",
        unitType: selectedFlat.unitType || "", // ensure this is being set
        specialFeaturePrice: selectedFlat.specialFeaturePrice || "",
        specialFeature: selectedFlat.specialFeature || "",
        totalAmount: totalAmount || 0,  // Set calculated total amount
      });
    }
    setIsEstimationModalOpen(true);
  };
  

  const closeEstimationModal = () => {
    setIsEstimationModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


 

  const [emiplans, setEmiplans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Fetch EMI plans from API
  const Getemiplans = async () => {
    try {
      let response = await api.getAllEmiPlans();
      setEmiplans(response.data.data);
    } catch (error) {
      console.error("Error fetching EMI plans:", error);
    }
  };

  useEffect(() => {
    Getemiplans();
  }, []);


  const { Option } = Select;
// Handle Installment Type selection
const handleSelectChange = (value) => {
  // Find the selected EMI plan
  const plan = emiplans.find((p) => p._id === value);
  setSelectedPlan(plan);

  // Recalculate totalAmount based on the interest rate of the selected plan
  if (plan) {
    const sqFeet = parseFloat(formData.sqFeet) || 0;
    const sqPrice = parseFloat(formData.sqPrice) || 0;
    const specialFeaturePrice = parseFloat(formData.specialFeaturePrice) || 0;
    
    // Calculate A (sqFeet * sqPrice)
    const A = sqFeet * sqPrice;
    
    // Calculate B (A + specialFeaturePrice)
    const B = A + specialFeaturePrice;
    
    // Recalculate totalAmount (B + (B * interestRate / 100))
    const totalAmount = B + (B * (plan.intrestRate / 100)); 

    // Update formData with new interest rate and calculated totalAmount
    setFormData({
      ...formData,
      installmentType: plan.name || "",
      intrestRate: plan.intrestRate || 0,
      totalAmount: totalAmount || 0,
      
    });
  }
};

const handleSubmit = async (e) => {  // ✅ Add 'async' here
  e.preventDefault();

  console.log("Form Data before submit: ", formData);

  try {
    const response = await api.createEstimationForm(formData);  // ✅ 'await' works inside 'async'
    if(response.status === 401){
      console.log("Session Expired! Redirecting to Login.");
      localStorage.removeItem(utilis.string.localStorage.sessionId);
      localStorage.removeItem(utilis.string.localStorage.userData);
      navigate('/');
    }

    if (response.status === 200) {
     

      addToast("create estimation sent successfully", {
        appearance: "success",
        autoDismiss: true,
      });
      setIsEstimationModalOpen(false)
          // Reset form data
  setFormData({
    name: "",
    towerName: "",
    phone: '',
    countryCode: "+91",
    emailId: "",
    address: "",
    pinCode: '',
    flatNo: "",
    blockNo: "",
    sqFeet: "",
    sqPrice: "",
    unitType: "",
    specialFeaturePrice: "",
    specialFeature: "",
    totalAmount: "",
    installmentType: "",
    intrestRate: '',
    remarks: "",
    createdBy:managementId,
  });

  // Optional: Reset selected plan if needed
  setSelectedPlan(null);


    } else {
      addToast(response.data?.message || "Something went wrong!", {
        appearance: "error",
        autoDismiss: true,
      });
    }
  } catch (error) {
  
    console.error('Error:', error);
  } 
};

let navigate=useNavigate()
  const handleBookFlat=()=>{
    const towerId = localStorage.getItem("selectedTowerId") || "";
  console.log("Retrieved towerId from localStorage:", towerId);
    navigate('/dashboard/bookingflats', { state: { towerId } })
  }

  return (
    <>
      <Dashheader />
      <div className="flat-details-container">
        <h2 className="flat-details-title">Flat Details</h2>

        {loading ? (
          <Loading />
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : flatDetails.length > 0 ? (
          <>
            <div className="flat-buttons-container">
            {flatDetails.map((flat) => (
  <button
    key={flat._id}
    className={`flat-button ${flat.isAvaliable === "AVALIABLE" ? "available" : "not-available"}`}
    onClick={() => openModal(flat)}
    disabled={flat.isAvaliable !== "AVALIABLE"} // Disable if flat is not available
  >
    {flat.flatNo}-({flat.bedrooms})
    <br />
    <div className="blockname">
      Block- {flat.blockName?.toUpperCase()}
    </div>
  </button>
))}
            </div>

            {/* Flat Details Modal */}
           
{/* Flat Details Modal */}
<Modal
  title={`${selectedFlat?.projectName} - FLAT NO: ${selectedFlat?.flatNo}`}
  open={isModalOpen}
  onCancel={closeModal}
  footer={null}
  width={600}
>
  {selectedFlat && (
    <div className="flat-card">
      <div className="flat-card-body">
        {/* <p><strong>Price&nbsp;:&nbsp; </strong> {selectedFlat.priceStartRange?.toUpperCase()} - {selectedFlat.priceEndRange?.toUpperCase()}</p> */}
        <p><strong>Size&nbsp;:&nbsp;  </strong> {selectedFlat.sqFeet} SQPT</p>
        <p><strong>Bedrooms&nbsp;:&nbsp;</strong> {selectedFlat.bedrooms?.toUpperCase()}</p>
        <p><strong>Furnishing&nbsp;:&nbsp;</strong> {selectedFlat.furnishingType?.toUpperCase()}</p>
        <p><strong>Facing&nbsp;:&nbsp;</strong> {selectedFlat.facing?.toUpperCase()}</p>
        <p><strong>Unit Type&nbsp;:&nbsp;</strong> {selectedFlat.unitType?.toUpperCase()}</p>
        <p><strong>Construction Status&nbsp;:&nbsp;</strong> {selectedFlat.constructionStatus?.toUpperCase()}</p>
        <p><strong>Block&nbsp;:&nbsp;</strong> {selectedFlat.blockName?.toUpperCase()} |&nbsp; <strong>Floor&nbsp;:&nbsp;</strong> {selectedFlat.floor}</p>
        {/* <p><strong>Parking&nbsp;:&nbsp;</strong> {selectedFlat.parkingSlot?.toUpperCase()}</p> */}
        {/* <p><strong>Vasthu&nbsp;:&nbsp;</strong> {selectedFlat.vasthu?.toUpperCase()}</p> */}
      </div>
      {/* Show buttons only if the flat is available (isAvaliable is "AVALIABLE") */}
      {selectedFlat.isAvaliable === "AVALIABLE" && (
        <div className="flat-action-buttons">
          <button className="action-button create-estimation" onClick={openEstimationModal}>Create Estimation</button>
          <button className="action-button book-flat" onClick={handleBookFlat}>Book Flat</button>
        </div>
      )}
    </div>
  )}
</Modal>

            {/* Estimation Form Modal */}
         {/* Estimation Form Modal */}
<Modal
  title="Create Estimation"
  open={isEstimationModalOpen}
  onCancel={closeEstimationModal}
  footer={null}
  width={1000}
  className="createestimation-modal"
>
  <div className="createestimation-form">
    <div className="createestimation-form-grid">
      {[
        { label: "Name", name: "name", placeholder: "Enter Name" },
        { label: "Tower Name", name: "towerName", placeholder: "Enter Tower Name" },
        { label: "Phone", name: "phone", placeholder: "Enter Phone" },
        { label: "Country Code", name: "countryCode", placeholder: "Enter Country Code" },
        { label: "Email ID", name: "emailId", placeholder: "Enter Email" },
        { label: "Address", name: "address", placeholder: "Enter Address" },
        { label: "Pin Code", name: "pinCode", placeholder: "Enter Pin Code" },
        { label: "Flat No", name: "flatNo", placeholder: "Enter Flat No" },
        { label: "Block No", name: "blockNo", placeholder: "Enter Block No" },
        { label: "Square Feet", name: "sqFeet", placeholder: "Enter Square Feet" },
        { label: "Unit Type", name: "unitType", placeholder: "Enter Unit Type" },
        { label: "Square Feet Amount", name: "sqPrice", placeholder: "Enter Price per Sq Ft" },
        { label: "Premium Add-On", name: "specialFeature", placeholder: "Enter Special Feature" },
        { label: "Premium Add-On Price", name: "specialFeaturePrice", placeholder: "Enter Special Feature Price" },
        { label: "Total Amount", name: "totalAmount", placeholder: "Enter Total Amount" },
        { label: "Remarks", name: "remarks", placeholder: "Enter Remarks" },
      ].map((field) => (
        <div key={field.name} className="createestimation-form-field">
          <label className="createestimation-form-label">{field.label.toUpperCase()}:</label>
          <Input
            name={field.name}
            value={formData[field.name]}
            onChange={handleInputChange}
            placeholder={field.placeholder}
            className="createestimation-form-input"
          />
        </div>
      ))}

      {/* Installment Type Dropdown */}
      <div className="createestimation-form-field">
        <label className="createestimation-form-label">Installment Type:</label>
        <Select
          className="createestimation-form-select"
          onChange={handleSelectChange}
          value={selectedPlan?._id || ""}
          placeholder="Select Installment Type"
        >
          <option value="">Select Installment Type</option>
          {emiplans.map((plan) => (
            <Option key={plan._id} value={plan._id}>
              {plan.name}
            </Option>
          ))}
        </Select>
      </div>

      {/* Interest Rate (Disabled) */}
      <div className="createestimation-form-field">
        <label className="createestimation-form-label">Interest Rate:</label>
        <Input
          name="intrestRate"
          value={formData.intrestRate}
          disabled
          className="createestimation-form-input-disabled"
        />
      </div>
    </div>

    <Button
      type="primary"
      className="createestimation-submit-button"
      onClick={handleSubmit}
    >
      Submit
    </Button>
  </div>
</Modal>





          </>
        ) : (
          <p className="no-flats">No flats available for this tower.</p>
        )}
      </div>
    </>
  );
};

export default Flatdetails;
