import React, { useState, useEffect } from 'react';import './advancepayment.css';
import { useLocation, useNavigate } from "react-router-dom";
import Dashheader from '../../Dashheader/Dashheader';
import { Input, Form, Row, Col, Button, message } from 'antd';
import api from "./../../../../api.js";
import { useToasts } from "react-toast-notifications";
import Loading from '../../../../utilis/Loading.js';
import { Select } from 'antd'; // Import Select component
import utilis from "../../../../utilis";
const { Option } = Select;


const AdvancePayment = () => {
  let navigate = useNavigate();
  const [bookedFlats, setBookedFlats] = useState([]); // State to store bookedFlatDetails
  const [loading, setLoading] = useState(false);
    const { addToast } = useToasts();
  const [paymentData, setPaymentData] = useState({
    towerName: "",
    unitType: "",
    flatNo: "",
    block: "",
    floor: "",
    withoutGst: "",
    gst: "",
    gstAmount: "",
    totalAmount: "",
    paymentFor: "",
    paymentMode: "",
    referenceNo: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // Update the paymentData state
    setPaymentData((prevData) => {
      const updatedData = {
        ...prevData,
        [name]: value,
      };
  
      // Perform calculations for GST Amount and Total Amount
      if (name === "withoutGst" || name === "gst") {
        const withoutGst = parseFloat(updatedData.withoutGst) || 0; // Convert to number or default to 0
        const gstPercentage = parseFloat(updatedData.gst) || 0; // Convert to number or default to 0
  
        // Calculate GST Amount and Total Amount
        const gstAmount = (withoutGst * gstPercentage) / 100;
        const totalAmount = withoutGst + gstAmount;
  
        updatedData.gstAmount = gstAmount.toFixed(2); // Round to 2 decimal places
        updatedData.totalAmount = totalAmount.toFixed(2); // Round to 2 decimal places
      }
  
      return updatedData;
    });
  };


  
  // Handle form submission and send data to the backend
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true);
  
    try {
      // Create a payload excluding unnecessary fields like username and phoneNumber
      const { username, phoneNumber, aadharNumber, ...payload } = paymentData;
  
      // Convert totalAmount, withoutGst, and gstAmount to numbers
      payload.totalAmount = parseFloat(payload.totalAmount) || 0;
      payload.withoutGst = parseFloat(payload.withoutGst) || 0;
      payload.gstAmount = parseFloat(payload.gstAmount) || 0;
  
      // Send the payment data to the backend
      const response = await api.advancePayment(payload);
      if(response.status === 401){
        console.log("Session Expired! Redirecting to Login.");
        localStorage.removeItem(utilis.string.localStorage.sessionId);
        localStorage.removeItem(utilis.string.localStorage.userData);
        navigate('/');
      }
  
      // Show success message
      if (response.status === 200) {
        addToast(response.data?.message || "Payment details submitted successfully", {
          appearance: "success",
          autoDismiss: true,
        });
  
        // Optionally reset form fields after success
        setPaymentData({
          towerName: "",
          unitType: "",
          flatNo: "",
          block: "",
          floor: "",
          withoutGst: "",
          gst: "",
          gstAmount: "",
          totalAmount: "",
          paymentFor: "",
          paymentMode: "",
          referenceNo: "",
          phoneNumber: "", // Reset phone number for user purposes
          flatId: "",
          blockId: "",
          towerId: "",
          projectId: "",
          companyId: "",
          userId: "",
          bookedFlatId: "",
          createdBy: "",
        });
      } else {
        addToast(response.data?.message || "Something went wrong!", {
          appearance: "error",
          autoDismiss: true,
        });
      }
    } catch (error) {
      // Show error message if the request fails
      message.error("Failed to submit payment details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };



   const [userDetails, setuserDetails] = useState([]); // Store states from API
   // Fetch States from API
   const GetUserDetails = async () => {
    try {
      let response = await api.userdetailsforbooking();
      setuserDetails(response.data.data);
        if(response.status === 401){
              console.log("Session Expired! Redirecting to Login.");
              localStorage.removeItem(utilis.string.localStorage.sessionId);
              localStorage.removeItem(utilis.string.localStorage.userData);
              navigate('/');
            }

      console.log("Fetched userdetails:", response.data.data);
    } catch (error) {
      console.error("Error userdetails:", error);
    }
  };

  useEffect(() => {
    GetUserDetails();
  
  }, []);



  const handleSearch = async () => {
    if (paymentData.phoneNumber.length === 10) {
      try {
        const response = await api.userdetailsforbooking(paymentData.phoneNumber);
        if (response.status === 200 && response.data.data.result?.length > 0) {
          const userDetails = response.data.data.result[0];
          const bookedFlatDetails = response.data.data.bookedFlatDetails;
  
          // Remove duplicate flatNo values
          const uniqueFlats = [...new Map(bookedFlatDetails.map(flat => [flat.flatNo, flat])).values()];
          setBookedFlats(uniqueFlats);
  
          // Prefill the form with the first flat's details (optional)
          if (uniqueFlats.length > 0) {
            const firstFlat = uniqueFlats[0];
            setPaymentData((prevData) => ({
              ...prevData,
              username: userDetails.name || "",
              aadharNumber: userDetails.govtIdProof?.[0] || "",
              phoneNumber: userDetails.phoneNumber || "",
              towerName: firstFlat.towerName || "",
              unitType: firstFlat.unitType || "",
              flatNo: firstFlat.flatNo || "",
              block: firstFlat.block || "",
              floor: firstFlat.floor || "",
              gst: firstFlat.gst || "",
              paymentFor: firstFlat.flatNo || "", // Set the first flatNo as default
              flatId: firstFlat.flatId || "",
              blockId: firstFlat.blockId || "",
              towerId: firstFlat.towerId || "",
              projectId: firstFlat.projectId || "",
              companyId: firstFlat.companyId || "",
              userId: userDetails._id || "",
              bookedFlatId: firstFlat._id || "",
              createdBy: firstFlat.createdBy || "",
            }));
          }
  
          message.success("User details and flat details fetched successfully.");
        } else {
          setBookedFlats([]); // Clear bookedFlats if no data found
          message.error("No user details or flat details found for this phone number.");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        message.error("Failed to fetch user details. Please try again.");
      }
    } else {
      message.error("Please enter a valid 10-digit phone number.");
    }
  };

  
  const [gst, setGst] = useState(""); // GST percentage state

// Fetch GST from API
const GetGst = async () => {
  try {
    let response = await api.getGst();
    console.log("Full GST API Response:", response);

    // Correctly access the GST value from the nested structure
    if (response.data && response.data.data && response.data.data.length > 0 && response.data.data[0].gst !== undefined) {
      setGst(response.data.data[0].gst); // Set GST percentage
    } else {
      console.error("GST data not found in API response.");
      console.log("Response structure:", response.data); // Log the response structure
      setGst(0); // Default value
    }
  } catch (error) {
    console.error("Error fetching GST:", error);
  }
};

useEffect(() => {
  console.log("GST State Updated:", gst);
}, [gst]);

useEffect(() => {
  GetGst();
}, []);


const handleFlatSelection = (flatNo) => {
  // Find the selected flat's details
  const selectedFlat = bookedFlats.find((flat) => flat.flatNo === flatNo);
  if (selectedFlat) {
    setPaymentData((prevData) => ({
      ...prevData,
      towerName: selectedFlat.towerName || "",
      unitType: selectedFlat.unitType || "",
      flatNo: selectedFlat.flatNo || "",
      block: selectedFlat.block || "",
      floor: selectedFlat.floor || "",
      gst: selectedFlat.gst || "",
      paymentFor: selectedFlat.flatNo || "",
      flatId: selectedFlat.flatId || "",
      blockId: selectedFlat.blockId || "",
      towerId: selectedFlat.towerId || "",
      projectId: selectedFlat.projectId || "",
      companyId: selectedFlat.companyId || "",
      userId: selectedFlat.userId || "",
      bookedFlatId: selectedFlat._id || "",
      createdBy: selectedFlat.createdBy || "",
    }));
  }
};
  return (
    <>
      <Dashheader />
       {loading ? (
            <Loading/>
          ) : (
      <div className="advancepayment">
        <div className="advancepayment__header">
          <h2>Enter Advance Payment Details</h2>
        </div>
             {/* Phone Number Field in Top-Right Corner */}
       {/* Phone Number Field with Search Button */}
       <div className="advancepayment__phone">
        <Form.Item label="Enter Customer Phone Number">
          <div className="advancepayment__phone-container">
            <Input
              type="text"
              name="phoneNumber"
              value={paymentData.phoneNumber}
              onChange={(e) =>
                setPaymentData({ ...paymentData, phoneNumber: e.target.value })
              }
              placeholder="Enter Phone Number"
              className="advancepayment__input"
            />
            <Button
              type="primary"
              className="advancepayment__search-button"
              onClick={handleSearch}
            >
              Search
            </Button>
          </div>
        </Form.Item>
      </div>

        <Form layout="vertical" onSubmitCapture={handleSubmit}>
          <Row gutter={16}>
            {/* Row 1: Tower Name, Unit Type, Flat No */}
            <Col span={8}>
            <Form.Item label="Payment For">
  <Select
    value={paymentData.paymentFor}
    onChange={(flatNo) => handleFlatSelection(flatNo)} // Handle flat selection
    placeholder="Select Flat No"
  >
    {bookedFlats.map((flat) => (
      <Option key={flat.flatNo} value={flat.flatNo}>
        {flat.flatNo}
      </Option>
    ))}
  </Select>
</Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="User Name">
                <Input 
                  type="text" 
                  name="username" 
                  value={paymentData.username} 
                  onChange={handleChange} 
                  placeholder="Enter user Name" 
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Aadhar Number">
                <Input 
                  type="text" 
                  name="aadharNumber" 
                  value={paymentData.aadharNumber} 
                  onChange={handleChange} 
                  placeholder="Enter aadhar Number" 
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Tower Name">
                <Input 
                  type="text" 
                  name="towerName" 
                  value={paymentData.towerName} 
                  onChange={handleChange} 
                  placeholder="Enter Tower Name" 
                />
              </Form.Item>
            </Col>
          
            <Col span={8}>
              <Form.Item label="Unit Type">
                <Input 
                  type="text" 
                  name="unitType" 
                  value={paymentData.unitType} 
                  onChange={handleChange} 
                  placeholder="Enter Unit Type" 
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Flat No">
                <Input 
                  type="text" 
                  name="flatNo" 
                  value={paymentData.flatNo} 
                  onChange={handleChange} 
                  placeholder="Enter Flat No" 
                />
              </Form.Item>
            </Col>
          </Row>
                <Row>
                {/* <Col span={8}>
              <Form.Item label="Phone Number">
  <Input 
    type="text" 
    name="phoneNumber" 
    value={paymentData.phoneNumber} 
    onChange={handleChange} 
    placeholder="Enter Phone Number" 
  />
</Form.Item>
            </Col> */}
            
                </Row>
          <Row gutter={16}>
            {/* Row 2: Block, Floor, Amount Without GST */}
            <Col span={8}>
              <Form.Item label="Block">
                <Input 
                  type="text" 
                  name="block" 
                  value={paymentData.block} 
                  onChange={handleChange} 
                  placeholder="Enter Block" 
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Floor">
                <Input 
                  type="number" 
                  name="floor" 
                  value={paymentData.floor} 
                  onChange={handleChange} 
                  placeholder="Enter Floor" 
                />
              </Form.Item>
            </Col>
            <Col span={8}>
    <Form.Item label="Amount (Without GST)">
      <Input
        type="number"
        name="withoutGst"
        value={paymentData.withoutGst}
        onChange={handleChange}
        placeholder="Enter Amount Without GST"
      />
    </Form.Item>
  </Col>
          </Row>

          <Row gutter={16}>
            {/* Row 3: GST Percentage, GST Amount, Total Amount */}
            <Col span={8}>
            <Form.Item label="GST Percentage">
  <Input
    type="number"
    name="gst"
    value={gst} // Use the fetched GST percentage
    readOnly // Make it read-only if needed
    placeholder="GST Percentage"
  />
</Form.Item>
  </Col>
  <Col span={8}>
    <Form.Item label="GST Amount">
      <Input
        type="number"
        name="gstAmount"
        value={paymentData.gstAmount}
        readOnly
        placeholder="GST Amount"
      />
    </Form.Item>
  </Col>
  <Col span={8}>
    <Form.Item label="Total Amount">
      <Input
        type="number"
        name="totalAmount"
        value={paymentData.totalAmount}
        readOnly
        placeholder="Total Amount"
      />
    </Form.Item>
  </Col>
          </Row>

          <Row gutter={16}>
            {/* Row 4: Payment For, Payment Mode, Reference No */}
          
            <Col span={8}>
              <Form.Item label="Payment Mode">
                <Input 
                  type="text" 
                  name="paymentMode" 
                  value={paymentData.paymentMode} 
                  onChange={handleChange} 
                  placeholder="Enter Payment Mode" 
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Reference No">
                <Input 
                  type="text" 
                  name="referenceNo" 
                  value={paymentData.referenceNo} 
                  onChange={handleChange} 
                  placeholder="Enter Reference No" 
                />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={24} style={{ textAlign: 'center' }}>
              <Button 
                type="primary" 
                htmlType="submit" 
                className="advancepayment__submit">
                Submit
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
      )}
    </>
  );
};

export default AdvancePayment;
