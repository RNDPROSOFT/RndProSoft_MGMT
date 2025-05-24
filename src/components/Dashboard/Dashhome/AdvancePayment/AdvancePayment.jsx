import React, { useState, useEffect } from 'react';import './advancepayment.css';
import { useLocation, useNavigate } from "react-router-dom";
import Dashheader from '../../Dashheader/Dashheader';
import { Input, Form, Row, Col, Button, message } from 'antd';
import api from "./../../../../api.js";
import { useToasts } from "react-toast-notifications";
import Loading from '../../../../utilis/Loading.js';
import { Select } from 'antd'; // Import Select component
import utilis from "../../../../utilis";
import { Radio, Space } from 'antd';
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
    // withoutIntrest: "",
    block: "",
    floor: "",
    bedrooms: "",
    withoutGst: "",
    gst: "",
    gstAmount: "",
    totalAmount: "",
    paymentFor: "",
    paymentMode: "",
    referenceNo: "",
    // EMI fields
    transactionFor: "",
    installmentType: "",
    installmentMonths: "",
    emiAmount: "",
    emiId: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // For EMI option, restrict withoutGst to balanceAmount
    if (paymentOption === 'emi' && name === 'withoutGst') {
      const entered = parseFloat(value) || 0;
      if (entered > balanceAmount) {
        message.error(`Amount (Without GST) cannot be greater than Balance Amount (${balanceAmount})`);
        return; // Do not update state if invalid
      }
    }

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

        // Round up all amounts
        updatedData.withoutGst = withoutGst ? Math.round(withoutGst) : '';
        updatedData.gstAmount = gstAmount ? Math.round(gstAmount) : '';
        updatedData.totalAmount = totalAmount ? Math.round(totalAmount) : '';
      }

      return updatedData;
    });
  };


  
  // Handle form submission and send data to the backend
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true);
    console.log("Total Amount:", paymentData.totalAmount);
    // Validate the total amount based on paymentCount
    if (bookedFlats.length > 0) {
      const selectedFlat = bookedFlats.find(flat => flat.flatNo === paymentData.flatNo);
      if (selectedFlat) {
        const paymentCount = selectedFlat.paymentCount || 0;
        if (paymentCount === 0 && Number(paymentData.totalAmount) < 500000) {
          setLoading(false); // Stop the loading state
          addToast("Total Amount must be 500,000 or more to proceed for the first payment.", {
            appearance: "error",
            autoDismiss: true,
          });
          return; // Stop form submission
        }
      }
    }
    try {
      // Create a payload excluding unnecessary fields like username and phoneNumber
      const { username, phoneNumber, aadharNumber, ...payload } = paymentData;

      // Set transactionFor and emiId based on paymentOption
      if (paymentOption === 'token') {
        payload.transactionFor = 'TOKEN'; // Send 'TOKEN' for token payments
        payload.emiId = null; // Send emiId as null for token payments
      } else if (paymentOption === 'emi') {
        payload.transactionFor = 'EMI';
      }

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
          bedrooms: "",
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
          // Reset EMI fields
          transactionFor: "",
          installmentType: "",
          installmentMonths: "",
          emiAmount: "",
          emiId: ""
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
            // Set payment option based on paymentCount
            if (firstFlat.paymentCount === 0) {
              setPaymentOption('token');
            } else {
              setPaymentOption('emi');
            }

            // Calculate emiAmount: totalAmount - withoutGst
            let emiAmount = '';
            if (firstFlat.totalAmount && paymentData.withoutGst) {
              emiAmount = Number(firstFlat.totalAmount) - Number(paymentData.withoutGst);
            } else if (firstFlat.totalAmount) {
              emiAmount = Number(firstFlat.totalAmount);
            }

            setPaymentData((prevData) => ({
              ...prevData,
              username: userDetails.name || "",
              aadharNumber: userDetails.govtIdProof?.[0] || "",
              phoneNumber: userDetails.phoneNumber || "",
              towerName: firstFlat.towerName || "",
              unitType: firstFlat.unitType || "",
              flatNo: firstFlat.flatNo || "",
              // withoutIntrest: firstFlat.withoutIntrest || "",
              block: firstFlat.block || "",
              floor: firstFlat.floor || "",
              bedrooms: firstFlat.bedrooms || "",
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
              // Prefill installmentType and installmentMonths if available
              installmentType: firstFlat.installmentType || "",
              installmentMonths: firstFlat.installmentMonths || "",
              // emiAmount: emiAmount !== '' ? emiAmount : ''
              emiAmount:firstFlat.withoutIntrest || ""
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
    // Set payment option based on paymentCount
    if (selectedFlat.paymentCount === 0) {
      setPaymentOption('token');
    } else {
      setPaymentOption('emi');
    }
    // Calculate emiAmount: totalAmount - withoutGst
    let emiAmount = '';
    if (selectedFlat.totalAmount && paymentData.withoutGst) {
      emiAmount = Number(selectedFlat.totalAmount) - Number(paymentData.withoutGst);
    } else if (selectedFlat.totalAmount) {
      emiAmount = Number(selectedFlat.totalAmount);
    }
    setPaymentData((prevData) => ({
      ...prevData,
      towerName: selectedFlat.towerName || "",
      unitType: selectedFlat.unitType || "",
      flatNo: selectedFlat.flatNo || "",
      block: selectedFlat.block || "",
      floor: selectedFlat.floor || "",
      bedrooms: selectedFlat.bedrooms || "",
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
      // Prefill installmentType and installmentMonths if available
      installmentType: selectedFlat.installmentType || "",
      installmentMonths: selectedFlat.installmentMonths || "",
      emiAmount: emiAmount !== '' ? emiAmount : ''
    }));
  }
};

const [paymentOption, setPaymentOption] = useState('');

  const handlePaymentChange = (e) => {
    setPaymentOption(e.target.value);
  };



  const [emiDetails, setemiDetails] = useState([]); // Store states from API
  const [balanceAmount, setBalanceAmount] = useState(0); // Store balance amount for EMI
// Fetch EMI details from API using flatId and userId from paymentData
const GetEmiDetails = async () => {
  try {
    // Use bookedFlatId (the _id from bookedFlatDetails) as flatId for EMI details API
    if (paymentData.bookedFlatId && paymentData.userId) {
      let response = await api.getEmiDetailsForPaymentPage(paymentData.bookedFlatId, paymentData.userId);
      setemiDetails(response.data.data);
      console.log("Fetched emidetails:", response.data.data);

      // If EMI option is selected
      if (paymentOption === 'emi') {
        if (Array.isArray(response.data.data) && response.data.data.length > 0) {
          const firstEmi = response.data.data[0];
          setPaymentData((prevData) => ({
            ...prevData,
            installmentMonths: firstEmi.month || '',
            emiId: firstEmi._id || '',
            emiAmount: firstEmi.amount ? Math.round(firstEmi.amount) : 0
          }));
          // Calculate balance amount: amount - sum of partialPayment[].withoutGst
          let paid = 0;
          if (Array.isArray(firstEmi.partialPayment) && firstEmi.partialPayment.length > 0) {
            paid = firstEmi.partialPayment.reduce((sum, p) => sum + (p.withoutGst || 0), 0);
          }
          setBalanceAmount(firstEmi.amount - paid);
        } else {
          // No EMI data found, set emiAmount and balance to 0
          setPaymentData((prevData) => ({
            ...prevData,
            installmentMonths: '',
            emiId: '',
            emiAmount: 0
          }));
          setBalanceAmount(0);
        }
      }
    }
  } catch (error) {
    console.error("Error emidetails:", error);
    // On error, if EMI option, set emiAmount and balance to 0
    if (paymentOption === 'emi') {
      setPaymentData((prevData) => ({
        ...prevData,
        installmentMonths: '',
        emiId: '',
        emiAmount: 0
      }));
      setBalanceAmount(0);
    }
  }
};


// Fetch EMI details whenever flatId or userId changes
useEffect(() => {
  GetEmiDetails();
}, [paymentData.flatId, paymentData.userId]);
  return (
    <>
      <Dashheader />
       {loading ? (
            <Loading/>
          ) : (
      <div className="advancepayment">
        <div className="advancepayment__header">
          <h2>Enter Payment Details</h2>
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

               <div className="paymentbooleanbutton" style={{ marginBottom: '20px' }}>
      <div className="flex items-center space-x-4 bg-white p-4 rounded-xl shadow-md w-max">
        <span className="font-medium text-gray-700"> Select Payment Option : </span>
       <Radio.Group
  name="paymentOption"
  onChange={handlePaymentChange}
  value={paymentOption}
>
  <Space>
    <Radio value="token">Token Amount</Radio>
    <Radio value="emi">EMI</Radio>
  </Space>
</Radio.Group>
      
      </div>
    </div>


        <Form layout="vertical" onSubmitCapture={handleSubmit}>
          {/* Token Amount Option Fields */}
          {paymentOption === 'token' && (
            <>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item label="Payment For">
                    <Select
                      value={paymentData.paymentFor}
                      onChange={(flatNo) => handleFlatSelection(flatNo)}
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
              <Row gutter={16}>
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
                <Col span={8}>
                  <Form.Item label="bedrooms">
                    <Input
                      name="bedrooms"
                      value={paymentData.bedrooms}
                      onChange={handleChange}
                      placeholder="Enter bedrooms"
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="GST Percentage">
                    <Input
                      type="number"
                      name="gst"
                      value={gst}
                      readOnly
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
              </Row>
              <Row gutter={16}>
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
                <Col span={8}>
                  <Form.Item label="Select Payment Mode">
                    <Select
                      name="paymentMode"
                      value={paymentData.paymentMode}
                      onChange={(value) => handleChange({ target: { name: 'paymentMode', value } })}
                      placeholder="Select Payment Mode"
                    >
                      <Option value="" disabled>Select Payment Mode</Option>
                      <Option value="CHECK">CHECK</Option>
                      <Option value="CASH">CASH</Option>
                      <Option value="BANK_TRANSFER">BANK_TRANSFER</Option>
                    </Select>
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
            </>
          )}

          {/* EMI Option Fields */}
          {paymentOption === 'emi' && (
            <>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item label="Payment For">
                    <Select
                      value={paymentData.paymentFor}
                      onChange={(flatNo) => handleFlatSelection(flatNo)}
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
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item label="Transaction For">
                    <Input
                      name="transactionFor"
                      value={paymentData.transactionFor || "EMI"}
                      readOnly
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Installment Type">
                    <Input
                      name="installmentType"
                      value={paymentData.installmentType || ""}
                      onChange={handleChange}
                      placeholder="e.g. 10-MONTHS"
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Installment Months">
                    <Input
                      type="number"
                      name="installmentMonths"
                      value={paymentData.installmentMonths || ""}
                      onChange={handleChange}
                      placeholder="e.g. 1"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item label="EMI Amount">
                    <Input
                      type="number"
                      name="emiAmount"
                      value={paymentData.emiAmount || ""}
                      onChange={handleChange}
                      placeholder="Enter EMI Amount"
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Balance Amount">
                    <Input
                      type="number"
                      name="balanceAmount"
                      value={balanceAmount}
                      readOnly
                      placeholder="Balance Amount"
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  {/* Show Due Date (endDate from first EMI object) if available */}
                  {emiDetails && emiDetails.length > 0 && emiDetails[0].endDate && (
                    <Form.Item label="Due Date">
                      <Input
                        value={
                          emiDetails[0].endDate
                            ? (() => {
                                // Only take date part and format as DD-MM-YYYY
                                const dateStr = emiDetails[0].endDate.split('T')[0];
                                const [year, month, day] = dateStr.split('-');
                                return `${day}-${month}-${year}`;
                              })()
                            : ''
                        }
                        readOnly
                      />
                    </Form.Item>
                  )}
                </Col>
              </Row>
              <Row gutter={16}>
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
                <Col span={8}>
                  <Form.Item label="bedrooms">
                    <Input
                      name="bedrooms"
                      value={paymentData.bedrooms}
                      onChange={handleChange}
                      placeholder="Enter bedrooms"
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="GST Percentage">
                    <Input
                      type="number"
                      name="gst"
                      value={gst}
                      readOnly
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
              </Row>
              <Row gutter={16}>
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
                <Col span={8}>
                  <Form.Item label="Select Payment Mode">
                    <Select
                      name="paymentMode"
                      value={paymentData.paymentMode}
                      onChange={(value) => handleChange({ target: { name: 'paymentMode', value } })}
                      placeholder="Select Payment Mode"
                    >
                      <Option value="" disabled>Select Payment Mode</Option>
                      <Option value="CHECK">CHECK</Option>
                      <Option value="CASH">CASH</Option>
                      <Option value="BANK_TRANSFER">BANK_TRANSFER</Option>
                    </Select>
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
            </>
          )}

          <Row>
            <Col span={24} style={{ textAlign: 'center' }}>
              <Button
                type="primary"
                htmlType="submit"
                className="advancepayment__submit"
                disabled={paymentOption === 'emi' && (!paymentData.emiAmount || paymentData.emiAmount === 0)}
              >
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
