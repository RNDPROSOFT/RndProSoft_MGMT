import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import api from './../../api.js';
import './checkhistory.css';
import Dashheader from '../Dashboard/Dashheader/Dashheader';

const Checkhistory = () => {
  const [Flat, setFlat] = useState([]); 
  const [payment, setPayment] = useState([]);

  // Fetch Flat History details
  const GetFlathistorydetails = async () => {
    try {
      let response = await api.getFlatHistory();
      setFlat(response.data.data);
      console.log("Fetched Flat history:", response.data.data);
    } catch (error) {
      console.error("Error fetching Flat history:", error);
    }
  };

  useEffect(() => {
    GetFlathistorydetails();
  }, []);

  // Fetch Payment History details
  const getPaymentHistory = async () => {
    try {
      let response = await api.getPaymentHistory();
      setPayment(response.data.data);
      console.log("Fetched Payment history:", response.data.data);
    } catch (error) {
      console.error("Error fetching Payment history:", error);
    }
  };

  useEffect(() => {
    getPaymentHistory();
  }, []);

  // Define table columns for Flat History
  const flatColumns = [
    { title: 'Tower Name', dataIndex: 'towerName', key: 'towerName' },
    { title: 'Unit Type', dataIndex: 'unitType', key: 'unitType' },
    { title: 'Flat No', dataIndex: 'flatNo', key: 'flatNo' },
    { title: 'Block', dataIndex: 'block', key: 'block' },
    { title: 'Floor', dataIndex: 'floor', key: 'floor' },
    { title: 'User Name', dataIndex: 'userName', key: 'userName' },
    { title: 'User Phone', dataIndex: 'userPhone', key: 'userPhone' },
    { 
      title: 'Total Amount', 
      dataIndex: 'totalAmount', 
      key: 'totalAmount',
      render: (amount) => `₹${amount.toLocaleString()}`, // Format with commas
    },
    { 
      title: 'Download Receipt', 
      dataIndex: 'url', 
      key: 'url',
      render: (url) => (
        <a href={url} target="_blank" rel="noopener noreferrer">
          Download PDF
        </a>
      ),
    },
  ];

  // Define table columns for Payment History
  const paymentColumns = [
    { title: 'Invoice Number', dataIndex: 'invoiceNumber', key: 'invoiceNumber' },
    { title: 'Tower Name', dataIndex: 'towerName', key: 'towerName' },
    { title: 'Flat No', dataIndex: 'flatNo', key: 'flatNo' },
    { title: 'Floor', dataIndex: 'floor', key: 'floor' },
    { title: 'Unit Type', dataIndex: 'unitType', key: 'unitType' },
    { title: 'User Name', dataIndex: 'userName', key: 'userName' },
    { title: 'Payment Mode', dataIndex: 'paymentMode', key: 'paymentMode' },
    { 
      title: 'Total Amount', 
      dataIndex: 'totalAmount', 
      key: 'totalAmount',
      render: (amount) => `₹${amount.toLocaleString()}`,
    },
    { 
      title: 'Download Receipt', 
      dataIndex: 'url', 
      key: 'url',
      render: (url) => (
        <a href={url} target="_blank" rel="noopener noreferrer">
          Download PDF
        </a>
      ),
    },
  ];

  return (
    <>
      <Dashheader />
      <div className="checkflathistory">
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Flat History</h2>
        <Table columns={flatColumns} dataSource={Flat} rowKey="_id" pagination={{ pageSize: 10 }} />
      </div>

      <div className="checkpaymenthistory">
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Payment History</h2>
        <Table columns={paymentColumns} dataSource={payment} rowKey="_id" pagination={{ pageSize: 10 }} />
      </div>
    </>
  );
};

export default Checkhistory;
