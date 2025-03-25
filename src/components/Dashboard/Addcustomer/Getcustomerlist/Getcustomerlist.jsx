import React, { useState, useEffect } from "react";
import api from "./../../../../api.js";
import { Link, useNavigate } from 'react-router-dom';
import "./getcustomerlist.css";
import Dashheader from "../../Dashheader/Dashheader";
import utilis from '../../../../utilis';
const Getcustomerlist = () => {
      const navigate = useNavigate();
  const [customerlist, setCustomerList] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Search input state
  const [page, setPage] = useState(1); // Page state

  // Fetch customer data from API
  const fetchCustomerList = async () => {
    try {
        console.log(`Fetching customers with search: "${searchQuery}", limit: 5, and page: ${page}`);
        
        let response = await api.getCustomerdetails(searchQuery, 5, page);

        console.log("Full API Response:", response);

        const customers = response.data?.data?.[0]?.data || [];
        console.log("Filtered customer list:", customers);

        setCustomerList(customers);
        if(response.status === 401){
          console.log("Session Expired! Redirecting to Login.");
          localStorage.removeItem(utilis.string.localStorage.sessionId);
          localStorage.removeItem(utilis.string.localStorage.userData);
          navigate('/');
        }

    } catch (error) {
        console.error("Error fetching customer details:", error);
    }
};


  // Fetch data when the component mounts or when search/page changes
  useEffect(() => {
    fetchCustomerList();
  }, [searchQuery, page]);

  const handleViewDetails = (_id) => {
    console.log("Navigating to:", `/dashboard/editpartner/${_id}`); 
    navigate(`/dashboard/editcustomer/${_id}`);
  };

  return (
    <>
      <Dashheader />
      <div className="customerlist-table-container">
        <h2>Customer List</h2>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by Phone Number"
          className="customerlist-search-input"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1); // Reset to first page when searching
          }}
        />

        <table className="customerlist-table">
          <thead>
            <tr>
              <th>S. No</th>
              <th>Name</th>
              <th>Surname</th>
              <th>Gender</th>
              <th>Phone Number</th>
              <th>Email ID</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
  {customerlist.length > 0 ? (
    customerlist.map((customer, index) => (
      <tr key={customer._id}>
        <td>{(page - 1) * 5 + (index + 1)}</td>
        <td>{customer.name}</td>
        <td>{customer.surname}</td>
        <td>{customer.gender}</td>
        <td>{customer.phoneNumber}</td>
        <td>{customer.emailId}</td>
        <td>
          <button className="customerlist-view-btn"  onClick={() => handleViewDetails(customer._id)}>View Details</button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="7" className="customerlist-no-data">No customers found</td>
    </tr>
  )}
</tbody>

        </table>

        {/* Pagination */}
        <div className="customerlist-pagination">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="customerlist-page-btn"
          >
            Previous
          </button>
          <span>Page {page}</span>
          <button
            onClick={() => setPage(page + 1)}
            className="customerlist-page-btn"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default Getcustomerlist;
