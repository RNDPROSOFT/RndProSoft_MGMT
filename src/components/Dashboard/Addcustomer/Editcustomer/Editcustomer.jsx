import React, { useEffect, useState } from 'react';
import Dashheader from '../../Dashheader/Dashheader';
import api from './../../../../api.js';

const Editcustomer = () => {
  const [editCustomer, setEditCustomer] = useState([]);

  

  // Corrected function name
  const fetchCustomerDetails = async () => {
    try {
      let response = await api.updateCustomerdetails();  // Make sure this API exists
      setEditCustomer(response.data.data);
      console.log("Fetched customer:", response.data.data);
    } catch (error) {
      console.error("Error fetching customer:", error);
    }
  };

  useEffect(() => {
    fetchCustomerDetails();
  }, []);

  return (
    <>
      <Dashheader />
     
    </>
  );
};

export default Editcustomer;
