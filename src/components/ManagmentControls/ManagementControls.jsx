import React, { useState, useEffect } from 'react';
import { Table, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import Loading from '../../utilis/Loading.js';


import api from './../../api.js';
import Dashheader from '../Dashboard/Dashheader/Dashheader.jsx';

const ManagementControls = () => {
  const [management, setManagement] = useState([]);
   const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const GetManagementdetails = async () => {
    setLoading(true);
    try {
      let response = await api.getManagementList();
      setManagement(response.data.data);
    } catch (error) {
      console.error("Error fetching management details:", error);
    }finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    GetManagementdetails();
  }, []);

  const handleShowControls = (record) => {
    navigate(`/dashboard/showcontrols/${record._id}/${record.firstName}`); 
  };
  

  const columns = [
    { title: 'Management ID', dataIndex: 'managementId', key: 'managementId' },
    { title: 'First Name', dataIndex: 'firstName', key: 'firstName' },
    { title: 'Last Name', dataIndex: 'lastName', key: 'lastName' },
    { title: 'Gender', dataIndex: 'gender', key: 'gender' },
    { title: 'Email', dataIndex: 'emailId', key: 'emailId' },
    { title: 'Phone Number', dataIndex: 'phoneNumber', key: 'phoneNumber' },
    {
      title: 'Created On',
      dataIndex: 'createdOn',
      key: 'createdOn',
      render: (date) => new Date(date).toLocaleDateString('en-CA'),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button type="primary" onClick={() => handleShowControls(record)}>
          Show Controls
        </Button>
      ),
    },
  ];

  return (
    <>
      <Dashheader/>
      {loading ? (
      <Loading/>
    ) : (

      <div className="managementlist">
      <h2 className="management-heading">Management Lists</h2>
      <Table
        columns={columns}
        dataSource={management}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
      />

      </div>
       )}
      
    </>
  );
};

export default ManagementControls;
