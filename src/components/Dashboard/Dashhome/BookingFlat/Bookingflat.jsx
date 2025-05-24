import React, { useState, useEffect, use } from "react";
import { Form, Input, Button, Row, Col, Typography, message, Select, Radio } from "antd";
import { useLocation,useNavigate } from "react-router-dom";
import Dashheader from "../../Dashheader/Dashheader";
import api from "./../../../../api.js";
import "./bookingflat.css";
import { useToasts } from "react-toast-notifications";
import Loading from '../../../../utilis/Loading.js';
import utilis from '../../../../utilis';


const { Title } = Typography;
const { Option } = Select;

const disabledStyle = {
  backgroundColor: "#f5f5f5", // Light gray background
  border: "1px solid #d9d9d9", // Light border
  color: "#bfbfbf", // Gray text color
  cursor: "not-allowed", // Not-allowed cursor
};

const BookingFlat = () => {
  let navigate = useNavigate();
   const [loading, setLoading] = useState(false);
  const { addToast } = useToasts();
  const location = useLocation();
  // const towerId = location.state?.towerId || localStorage.getItem("selectedTowerId");
  const storedData = JSON.parse(localStorage.getItem("AdminDetails")) || {};
  const managementId = storedData?.data?.data?._id || null;
  const { towerId, flatId } = location.state || {};

  useEffect(() => {
    console.log("Tower ID:", towerId);
    console.log("Flat ID:", flatId);
  }, [towerId, flatId]);

  const initialData = {
    flatId: "",
    blockId: "",
    towerId: "",
    projectId: "",
    companyId: "",
    userId: "",
    govtIdProof: "",
    towerName: "",
    unitType: "",
    flatNo: "",
    block: "",
    floor: '',
    facing: "",
    sqFeet: '',
    sqPrice: '',
    specialFeature: "",
    specialFeaturePrice: '',
    installmentType: "",
    intrestRate:'',
    installmentMonths: "",
    discount: '',
    parkingSlot: "", // Default to empty string for "Yes"
    parkingCharges: '',
    gst: '',
    totalAmount: '',
    createdBy: managementId
  };

  const [formData, setFormData] = useState(initialData);
  const [form] = Form.useForm(); // Create a form instance

  const calculateTotalAmount = (updatedFormData = {}) => {
    const {
      sqFeet = 0,
      sqPrice = 0,
      specialFeaturePrice = 0,
      parkingCharges = 0,
      discount = 0,
      intrestRate = 0,
      gst = 0,
    } = updatedFormData;

    const sqFeetNum = parseFloat(sqFeet) || 0;
    const sqPriceNum = parseFloat(sqPrice) || 0;
    const specialFeaturePriceNum = parseFloat(specialFeaturePrice) || 0;
    const parkingChargesNum = parseFloat(parkingCharges) || 0;
    const discountNum = parseFloat(discount) || 0;
    const intrestRateNum = parseFloat(intrestRate) || 0;
    const gstNum = parseFloat(gst) || 0;

    const amount = sqFeetNum * sqPriceNum;
    const total = amount + specialFeaturePriceNum + parkingChargesNum;
    const discountAmount = (total * discountNum) / 100;
    const afterDiscountAmount = total - discountAmount;
    const withInterest = afterDiscountAmount + (afterDiscountAmount * (intrestRateNum / 100));
    const gstAmount = (withInterest * gstNum) / 100;
    // Round up the total amount for display and backend
    const totalAmount = Math.round(withInterest + gstAmount);

    setFormData((prevFormData) => ({
      ...prevFormData,
      totalAmount,
    }));

    form.setFieldsValue({
      totalAmount,
    });

    return totalAmount;
  };

  useEffect(() => {
    // Trigger calculation after fetching flat details
    calculateTotalAmount(formData);
  }, [formData]);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
  
    setFormData((prevFormData) => {
      const updatedFormData = { ...prevFormData, [name]: value };
  
      // Call calculateTotalAmount with the updated values
      calculateTotalAmount(updatedFormData);
  
      return updatedFormData;
    });
  
    form.setFieldsValue({
      [name]: value,
    });
  };
  const handleSelectChange = (value) => {
    const selectedPlan = emiplans.find((plan) => plan._id === value);
    console.log("Selected Plan:", selectedPlan); // Debugging: Check the selected plan
    if (selectedPlan) {
      setFormData((prevFormData) => ({
        ...prevFormData, // Preserve existing formData
        installmentType: selectedPlan.name, // Update the selected installment type
        intrestRate: selectedPlan.intrestRate !== undefined ? selectedPlan.intrestRate : "", // Handle 0 as a valid value
         installmentMonths: selectedPlan.months, // for backend
      }));
      form.setFieldsValue({
        ...form.getFieldsValue(), // Preserve existing form values
        installmentType: selectedPlan.name,
        intrestRate: selectedPlan.intrestRate !== undefined ? selectedPlan.intrestRate : "", // Update the form field for interest rate
         months: selectedPlan.months, // <-- set months here
      });
    } else {
      console.error("Selected plan not found or missing intrestRate field.");
    }
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    setLoading(true);
  
    // Ensure totalAmount is calculated before submission
    calculateTotalAmount(formData);
  
    console.log("Payload being sent to backend:", formData);
  
    const dataToSend = {
      ...formData,
      userId: formData.userId,
      govtIdProof: form.getFieldValue("govtIdProof"),
      flatId: formData.flatId,
      blockId: formData.blockId,
      towerId: formData.towerId,
      projectId: formData.projectId,
      companyId: formData.companyId,
      createdBy: formData.createdBy,
      discount: parseFloat(formData.discount) || 0,
      parkingCharges: parseFloat(formData.parkingCharges) || 0,
      sqFeet: parseFloat(formData.sqFeet) || 0,
      sqPrice: parseFloat(formData.sqPrice) || 0,
      specialFeaturePrice: parseFloat(formData.specialFeaturePrice) || 0,
      gst: parseFloat(formData.gst) || 0,
      // Always round up totalAmount before sending to backend
      totalAmount: Math.round(parseFloat(formData.totalAmount) || 0),
      installmentMonths:parseFloat(formData.installmentMonths) || 0,
      intrestRate: parseFloat(formData.intrestRate) || 0,
      bedrooms: formData.bedrooms, // Add bedrooms here
    };
  
    try {
      const response = await api.bookingFlats(dataToSend);
      console.log("Booking successful:", response.data);
      
      if (response.data.success) {
        addToast("Booking flat successfully", {
          appearance: "success",
          autoDismiss: true,
        });
      } else {
        addToast(response.data?.message || "Something went wrong!", {
          appearance: "error",
          autoDismiss: true,
        });
      }
    } catch (error) {
      console.error("Error booking flat:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch flat details from the API
  const GetFlatdetails = async () => {
    try {
      let response = await api.getParticularFlatsDetailsForBooking(flatId);
      const fetchedFlat = response.data.data[0]; // Assuming the first flat in the list for pre-filling
      console.log(fetchedFlat, 'fetchedFlat');
      if(response.status === 401){
        console.log("Session Expired! Redirecting to Login.");
        localStorage.removeItem(utilis.string.localStorage.sessionId);
        localStorage.removeItem(utilis.string.localStorage.userData);
        navigate('/');
      }
      // Pre-fill form fields using Ant Design's form instance
      form.setFieldsValue({
        // towerName: fetchedFlat.name,
        towerName: fetchedFlat.towerDetails?.name, // Use towerDetails.name instead of flat name
        unitType: fetchedFlat.unitType,
        flatNo: fetchedFlat.flatNo,
        // block: fetchedFlat.blockName,
        block: fetchedFlat.blockDetails?.name, // Use blockDetails.name instead of block name
        floor: fetchedFlat.floor,
        facing: fetchedFlat.facing,
        sqFeet: fetchedFlat.sqFeet,
        sqPrice: fetchedFlat.sqPrice,
        specialFeature: fetchedFlat.specialFeature,
        specialFeaturePrice: fetchedFlat.specialFeaturePrice,
        bedrooms: fetchedFlat.bedrooms, // Add bedrooms here
        // parkingSlot: fetchedFlat.parkingSlot,
        // Keep other fields empty or set default values if needed
      });

      // Update state for all fields
      setFormData((prevFormData) => ({
        ...prevFormData,
        flatId: fetchedFlat._id,
        blockId: fetchedFlat.blockId,
        towerId: fetchedFlat.towerId,
        projectId: fetchedFlat.projectId,
        companyId: fetchedFlat.companyId,
        sqFeet: fetchedFlat.sqFeet, // Ensure sqFeet is set in formData
        sqPrice: fetchedFlat.sqPrice, // Ensure sqPrice is set in formData
        specialFeaturePrice: fetchedFlat.specialFeaturePrice, // Ensure specialFeaturePrice is set
        // block: fetchedFlat.blockName,
        block: fetchedFlat.blockDetails?.name, // Use blockDetails.name here as well
        floor: fetchedFlat.floor,
        facing: fetchedFlat.facing,
        flatNo: fetchedFlat.flatNo,
        // towerName: fetchedFlat.name,
        towerName: fetchedFlat.towerDetails?.name, // Use towerDetails.name here as well
        unitType: fetchedFlat.unitType,
        userId: prevFormData.userId, // Keep existing userId if needed
        createdBy: prevFormData.createdBy,
        bedrooms: fetchedFlat.bedrooms, // Add bedrooms here
        specialFeature: fetchedFlat.specialFeature, // Ensure specialFeature is set in formData
      }));

      // Trigger calculation after setting formData
      setTimeout(() => calculateTotalAmount(), 0);
    } catch (error) {
      console.error("Error fetching flat details:", error);
    }
  };

  useEffect(() => {
    GetFlatdetails();
  }, []); // Empty dependency array to only fetch once when the component mounts


  const [emiplans, setEmiplans] = useState([]);
  // Fetch EMI plans from API
  const Getemiplans = async () => {
    try {
      let response = await api.getAllEmiPlans();
      setEmiplans(response.data.data);
      console.log(response.data.data, 'emiplans');
    } catch (error) {
      console.error("Error fetching EMI plans:", error);
    }
  };

  useEffect(() => {
    Getemiplans();
  }, []);

  const [gst, setGst] = useState("");
   // Fetch States from API
   const GetGst = async () => {
    try {
      let response = await api.getGst();
      console.log("GST API Response:", response.data);
      if (response.data.data.length > 0) {
        const gstValue = response.data.data[0].gst; // Extract GST value
        setGst(gstValue); // Update local GST state
        setFormData((prevFormData) => ({
          ...prevFormData,
          gst: gstValue, // Update GST in formData
        }));
        form.setFieldsValue({
          ...form.getFieldsValue(),
          gst: gstValue, // Prefill GST field in the form
        });
        console.log("Prefilled GST:", gstValue);
      }
    } catch (error) {
      console.error("Error fetching GST:", error);
    }
  };

  useEffect(() => {
    GetGst();
  }, []);

  const handleParkingOptionChange = (e) => {
    const value = e.target.value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      parkingSlot: value === "Yes" ? "" : "NA", // Set "NA" if "No" is selected
      parkingCharges: value === "Yes" ? prevFormData.parkingCharges : 0, // Set parkingCharges to 0 if "No"
    }));
    form.setFieldsValue({
      parkingSlot: value === "Yes" ? "" : "NA",
      parkingCharges: value === "Yes" ? form.getFieldValue("parkingCharges") : 0, // Update form field
    });
  };

 

  const [userdetails, setuserdetails] = useState([]); // Store API response
  const [phoneNumber, setPhoneNumber] = useState(""); // Store phone number entered
  const [userName, setUserName] = useState(""); // Store the name to auto-fill

  const [phoneValidation, setPhoneValidation] = useState({
    validateStatus: "",
    help: "",
});

const handlePhoneNumberChange = async (e) => {
  const enteredPhone = e.target.value.trim(); // Trim any extra spaces
  setPhoneNumber(enteredPhone);

  if (enteredPhone) {
    try {
      // Call the API to fetch user details
      let response = await api.userdetailsforbooking(enteredPhone);
      console.log("API Response:", response.data); // Debugging: Log the API response

      // Access the correct array in the API response
      if (response.data && response.data.data && Array.isArray(response.data.data.result)) {
        const user = response.data.data.result.find(
          user => String(user.phoneNumber) === String(enteredPhone)
        );

        if (user) {
          const userId = user._id || "User ID not found"; // Use the correct userId for backend
          const userName = user.name || ""; // Use name for display
          const govtIdProof = user.govtIdProof?.[0] || ""; // Get the first ID proof or set empty if not available
          console.log("User found:", userId, userName, govtIdProof); // Debugging: Log the userId, name, and ID proof

          setUserName(userName); // Update the state with the name

          // Update the form fields for name and govtIdProof
          form.setFieldsValue({
            userId: userName, // Display the name in the form
            govtIdProof: govtIdProof,
          });

          // Update formData with the correct userId for backend submission
          setFormData((prevFormData) => ({
            ...prevFormData,
            userId: userId, // Store the correct userId for backend
          }));

          // Clear validation message
          setPhoneValidation({
            validateStatus: "success",
            help: "",
          });
        } else {
          console.warn("No user found for the entered phone number."); // Debugging: Log if no user is found
          setUserName("");
          form.setFieldsValue({
            userId: "",
            govtIdProof: "",
          });

          // Set validation message
          setPhoneValidation({
            validateStatus: "error",
            help: "The entered phone number is invalid or not matched.",
          });
        }
      } else {
        console.warn("Invalid API response or no data found."); // Debugging: Log if the response is invalid
        setUserName("");
        form.setFieldsValue({
          userId: "",
          govtIdProof: "",
        });

        // Set validation message
        setPhoneValidation({
          validateStatus: "error",
          help: "The entered phone number is invalid or not matched.",
        });
      }
    } catch (error) {
      console.error("Error fetching user details:", error); // Debugging: Log the error
      setUserName("");
      form.setFieldsValue({
        userId: "",
        govtIdProof: "",
      });

      // Set validation message
      setPhoneValidation({
        validateStatus: "error",
        help: "An error occurred while fetching user details.",
      });
    }
  } else {
    console.log("Phone number is empty."); // Debugging: Log if the phone number is empty
    setUserName("");
    form.setFieldsValue({
      userId: "",
      govtIdProof: "",
    });

    // Set validation message
    setPhoneValidation({
      validateStatus: "warning",
      help: "Please enter a phone number.",
    });
  }
};


const [controlsforadmin, setcontrolsforadmin] = useState([]);
const Getcontrolsforadmin = async (event) => {
  if (event) event.preventDefault(); // Only call preventDefault when event is available (in case of click)

  try {
    let response = await api.getControlsForAdmin(managementId);
    console.log(managementId, 'managementId');
    setcontrolsforadmin(response.data.data);
    console.log(response.data.data, 'setcontrolsforadmin');

    const controlsData = response.data.data[0];
    if (controlsData?.allControls === true || controlsData?.discountControls === true) {
      
     
    } 
  } catch (error) {
    console.error("Error setcontrolsforadmin:", error);
    addToast('An error occurred while checking permissions', {
      appearance: 'error',
      autoDismiss: true,
    });
  }
};

useEffect(() => {
  Getcontrolsforadmin();
}, []); // Empty dependency array ensures it runs only once on component mount
 
  return (
    <>
      <Dashheader />
      {loading ? (
      <Loading/>
    ) : (
      <div className="bookingflats-container">
        <Title level={2} className="bookingflats-heading" style={{marginTop:"0px"}}>Book a Flat</Title>
        <Form
          form={form} // Bind the form instance
          onFinish={handleSubmit}
          layout="vertical"
          className="bookingflats-form"
          initialValues={{
            parkingOption: "Yes", // Set default value for parkingOption
          }}
        >
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                label="Tower Name"
                name="towerName"
                rules={[{ required: true, message: 'Please input the tower name!' }]}
              >
                <Input name="towerName" onChange={handleChange} disabled style={disabledStyle} />
              </Form.Item>
            </Col>

            <Col span={8}>
            <Form.Item
    label="PHONE NUMBER"
    name="phoneNumber"
    validateStatus={phoneValidation.validateStatus} // Dynamically set validation status
    help={phoneValidation.help} // Dynamically set validation message
    rules={[{ required: true, message: 'Please input the phone number' }]}
>
    <Input
        value={phoneNumber} // Bind the phone number input
        name="phoneNumber"
        onChange={handlePhoneNumberChange} // Handle phone number change
    />
</Form.Item>
            </Col>

            <Col span={8}>
    <Form.Item
        label="Government ID Proof"
        name="govtIdProof"
        rules={[{ required: true, message: 'Please input the government ID proof!' }]}
    >
        <Input
            value={form.getFieldValue("govtIdProof") || ""} // Display the ID proof if found
            name="govtIdProof"
            readOnly // Make it read-only since the value is auto-filled
        />
    </Form.Item>
</Col>



          

            <Col span={8}>
    <Form.Item
        label="USER DETAILS"
        name="userId"
        rules={[{ required: true, message: 'Please input the user details' }]}
    >
        <Input
            value={userName || ""} // Display the user's name if found
            name="userId"
            readOnly // Make it read-only since the name is auto-filled
        />
    </Form.Item>
</Col>



            <Col span={8}>
              <Form.Item
                label="Unit Type"
                name="unitType"
                rules={[{ required: true, message: 'Please input the unit type!' }]}
              >
                <Input name="unitType" onChange={handleChange} disabled style={disabledStyle} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Flat No"
                name="flatNo"
                rules={[{ required: true, message: 'Please input the flat number!' }]}
              >
                <Input name="flatNo" onChange={handleChange} disabled style={disabledStyle} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Block"
                name="block"
                rules={[{ required: true, message: 'Please input the block!' }]}
              >
                <Input name="block" onChange={handleChange} disabled style={disabledStyle} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Floor"
                name="floor"
                rules={[{ required: true, message: 'Please input the floor number!' }]}
              >
                <Input value={formData.floor} name="floor" onChange={handleChange} type="number" disabled style={disabledStyle} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="bedrooms"
                name="bedrooms"
                rules={[{ required: true, message: 'Please input the bedrooms!' }]}
              >
                <Input value={formData.bedrooms} name="bedrooms" onChange={handleChange}  disabled style={disabledStyle} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Facing"
                name="facing"
                rules={[{ required: true, message: 'Please input the facing direction!' }]}
              >
                <Input value={formData.facing} name="facing" onChange={handleChange} disabled style={disabledStyle} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label=" Per Square Price"
                name="sqPrice"
                rules={[{ required: true, message: 'Please input the square price!' }]}
              >
                <Input
                  value={formData.sqPrice}
                  name="sqPrice"
                  onChange={handleChange}
                  type="number"
                  disabled
                  style={disabledStyle}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label=" Total Square Feet"
                name="sqFeet"
                rules={[{ required: true, message: 'Please input the square feet!' }]}
              >
                <Input
                  value={formData.sqFeet}
                  name="sqFeet"
                  onChange={handleChange}
                  type="number"
                  disabled
                  style={disabledStyle}
                />
              </Form.Item>
            </Col>
            
            <Col span={8}>
              <Form.Item
                label="Special Feature"
                name="specialFeature"
                rules={[{ required: true, message: 'Please input the special feature!' }]}
              >
                <Input value={formData.specialFeature} name="specialFeature" onChange={handleChange} disabled style={disabledStyle} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Special Feature Price"
                name="specialFeaturePrice"
                rules={[{ required: true, message: 'Please input the special feature price!' }]}
              >
                <Input value={formData.specialFeaturePrice} name="specialFeaturePrice" onChange={handleChange} type="number" disabled style={disabledStyle} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Installment Type"
                name="installmentType"
                rules={[{ required: true, message: 'Please select the installment type!' }]}
              >
                <Select
                  onChange={handleSelectChange}
                  value={formData.installmentType}
                  placeholder="Select Installment Type"
                >
                  {emiplans.map((plan) => (
                    <Option key={plan._id} value={plan._id}>
                      {plan.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
             <Col span={8}>
              <Form.Item
                label="Interest months"
                name="months"
                rules={[{ required: true, message: 'Interest months is required!' }]}
              >
                <Input value={formData.months} disabled style={{ ...disabledStyle, color: "black" }} />
              </Form.Item>
            </Col>
            {/* <Col span={8}></Col> */}
            <Col span={8}>
              <Form.Item
                label="Interest Rate"
                name="intrestRate"
                rules={[{ required: true, message: 'Interest rate is required!' }]}
              >
                <Input value={formData.intrestRate} disabled style={{ ...disabledStyle, color: "black" }} />
              </Form.Item>
            </Col>
            <Col span={8}>
  <Form.Item
    label="Discount"
    name="discount"
    rules={[
      { required: true, message: 'Please input the discount!' },
      {
        validator: (_, value) => {
          if (value === undefined || value === null || value === '') {
            return Promise.resolve();
          }
          if (controlsforadmin[0]?.allControls || controlsforadmin[0]?.discountControls) {
            // If allControls or discountControls is true, allow any value
            return Promise.resolve();
          } else {
            // If neither is true, restrict to 5 or below
            if (value >= 0 && value <= 5) {
              return Promise.resolve();
            }
            return Promise.reject(new Error('Discount must be between 0% and 5%!'));
          }
        },
      },
    ]}
  >
    <Input value={formData.discount} name="discount" onChange={handleChange} type="number" />
  </Form.Item>
</Col>
            <Col span={8}>
              <Form.Item
                label="Parking Option"
                name="parkingOption"
                rules={[{ required: true, message: 'Please select if parking is required!' }]}
              >
                <Radio.Group
                  onChange={handleParkingOptionChange}
                  value={formData.parkingSlot === "NA" ? "No" : "Yes"} // Default to "Yes"
                >
                  <Radio value="Yes">Yes</Radio>
                  <Radio value="No">No</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            {formData.parkingSlot !== "NA" && (
              <Col span={8}>
                <Form.Item
                  label="Parking Slot"
                  name="parkingSlot"
                  rules={[{ required: true, message: 'Please input the parking slot!' }]}
                >
                  <Input
                    value={formData.parkingSlot}
                    name="parkingSlot"
                    onChange={handleChange} // Ensure handleChange updates the value
                  />
                </Form.Item>
              </Col>
            )}
            <Col span={8}>
              <Form.Item
                label="Parking Charges"
                name="parkingCharges"
                rules={[{ required: formData.parkingSlot === "", message: 'Please input the parking charges!' }]}
              >
                <Input
                  value={formData.parkingCharges}
                  name="parkingCharges"
                  onChange={handleChange}
                  type="number"
                  disabled={formData.parkingSlot === "NA"} // Disable if parkingSlot is "NA"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="GST"
                name="gst"
                rules={[{ required: true, message: 'Please input the GST!' }]}
              >
                <Input value={formData.gst} name="gst" onChange={handleChange} type="number" disabled style={disabledStyle} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Total Amount"
                name="totalAmount"
                rules={[{ required: true, message: 'Total amount is required!' }]}
              >
                <Input value={formData.totalAmount} disabled style={{ ...disabledStyle, color: "black" }} />
              </Form.Item>
            </Col>
            
          </Row>
          
          <Button type="primary" htmlType="submit" className="bookingflats-submit">
            Book Flat
          </Button>
        </Form>
      </div>
       )}
    </>
  );
};

export default BookingFlat;
      