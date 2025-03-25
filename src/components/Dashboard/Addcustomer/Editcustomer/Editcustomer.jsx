import React, { useEffect, useState } from 'react';
import Dashheader from '../../Dashheader/Dashheader';
import api from './../../../../api.js';
import { useParams } from "react-router-dom";
import './editcustomer.css'
import { useToasts } from "react-toast-notifications";
import { Link, useNavigate } from 'react-router-dom';
import utilis from '../../../../utilis';

const Editcustomer = () => {
    let navigate = useNavigate();
    const { addToast } = useToasts();
    const { id } = useParams();
    const [customer, setCustomer] = useState({
        name: "",
        surname: "",
        birthDate: "",
        emailId: "",
        phoneNumber2: "",
        houseNo: "",
        street: "",
        city: "",
        state: "",
        pinCode: "",
        source: "",
        occupation: "",
    });
    const storedData = JSON.parse(localStorage.getItem("AdminDetails")) || {};
    let managementId = storedData?.data?.data?._id || null;
    // Fetch Customer Details
    const GetCustomer = async () => {
        try {
            let response = await api.getParticularCustomerdetails(id);
            const customerData = response?.data?.data?.[0] || {};

            // Extract only required fields
            const filteredData = {
                name: customerData.name || "",
                surname: customerData.surname || "",
                birthDate: customerData.birthDate || "",
                emailId: customerData.emailId || "",
                phoneNumber2: customerData.phoneNumber2 || "",
                houseNo: customerData.houseNo || "",
                street: customerData.street || "",
                city: customerData.city || "",
                state: customerData.state || "",
                pinCode: customerData.pinCode || "",
                source: customerData.source || "",
                occupation: customerData.occupation || "",
                updatedBy: managementId, // Hidden field
                _id:id
            };

            setCustomer(filteredData);
            console.log("Fetched customer Data:", filteredData);
        } catch (error) {
            console.error("Error fetching customer details:", error);
        }
    };

    useEffect(() => {
        GetCustomer();
    }, []);

    // Handle Input Change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCustomer({ ...customer, [name]: value });
    };

    // Save Updated Customer Data
    const saveCustomerData = async () => {
        try {
            let response = await api.updateCustomerdetails(customer); 
            if(response.status === 401){
                console.log("Session Expired! Redirecting to Login.");
                localStorage.removeItem(utilis.string.localStorage.sessionId);
                localStorage.removeItem(utilis.string.localStorage.userData);
                navigate('/');
              }
      
            if (response.status === 200) {
              addToast( "customer added successfully", {
                appearance: "success",
                autoDismiss: true,
              });
          } else {
              // alert("Failed to update partner details!");
              addToast( "something went wrong", {
                appearance: "error",
                autoDismiss: true,
              });
          }
            console.log("Customer updated successfully:", response.data);
            // alert("Customer details updated successfully!");
        } catch (error) {
            console.error("Error updating customer details:", error);
            alert("Failed to update customer details.");
        }
    };

    return (
        <>
            <Dashheader />
            <div className="edit-customer-container">
    <h2 className="edit-customer-title">Edit Customer</h2>
    <table className="edit-customer-table">
        <thead className="edit-customer-thead">
            <tr>
                <th className="edit-customer-th">Field</th>
                <th className="edit-customer-th">Value</th>
            </tr>
        </thead>
        <tbody>
    {Object.entries(customer)
        .filter(([key]) => key !== "updatedBy" && key !== "_id") // Exclude fields
        .map(([key, value]) => (
            <tr key={key}>
                <td className="edit-customer-td">{key}</td>
                <td className="edit-customer-td">
                    <input
                        type="text"
                        name={key}
                        value={value}
                        onChange={handleInputChange}
                        className="edit-customer-input"
                    />
                </td>
            </tr>
        ))}
</tbody>

    </table>
    <button className="edit-customer-button" onClick={saveCustomerData}>
        Save
    </button>
</div>

        </>
    );
};

export default Editcustomer;
