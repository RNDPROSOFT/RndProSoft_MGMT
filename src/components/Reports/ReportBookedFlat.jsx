import React, { useState, useEffect } from 'react';
import { DatePicker, Button, Menu, Row, Col, Table, Empty, Select } from 'antd';
import {  ArrowLeftOutlined } from '@ant-design/icons';
import Dashheader from '../Dashboard/Dashheader/Dashheader';
import api from './../../api.js';
import * as XLSX from 'xlsx';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

const { RangePicker } = DatePicker;

const ReportBookedFlat = () => {
  const navigate = useNavigate();
  const [dates, setDates] = useState([dayjs().startOf('month'), dayjs()]);
  const [tower, setTower] = useState("ALL");
  const [towerList, setTowerList] = useState([]);
  const [selectedTowerName, setSelectedTowerName] = useState("ALL"); // this is what you'll send to API

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    { title: 'Booking ID', dataIndex: 'bookedNo', key: 'bookedNo' },
    { title: 'Flat No', dataIndex: 'flatNo', key: 'flatNo' },
    { title: 'Tower', dataIndex: 'towerName', key: 'towerName' },
    { title: 'Block', dataIndex: 'block', key: 'block' },
    { title: 'Floor', dataIndex: 'floor', key: 'floor' },
    { title: 'Owner Name', dataIndex: 'userName', key: 'userName' },
    { title: 'Phone', dataIndex: 'userPhone', key: 'userPhone' },
    {
      title: 'Booking Date',
      dataIndex: 'createdOn',
      key: 'createdOn',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Total Amount (₹)',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount) => amount.toLocaleString('en-IN'),
    },
    {
      title: 'Interest Rate (%)',
      dataIndex: 'intrestRate',
      key: 'intrestRate',
    },
    {
      title: 'GST (₹)',
      dataIndex: 'gstAmount',
      key: 'gstAmount',
      render: (gst) => gst.toLocaleString('en-IN'),
    },
    { title: 'Parking Slot', dataIndex: 'parkingSlot', key: 'parkingSlot' },
    {
      title: 'Booking PDF',
      dataIndex: 'url',
      key: 'url',
      render: (url) => (
        <a href={url} target="_blank" rel="noopener noreferrer">
          Download
        </a>
      ),
    },
  ];
  useEffect(() => {
    if (dates[0] && dates[1]) {
      fetchData();
    }
  }, [dates, tower]);
 
  const fetchData = async () => {
    setLoading(true);
    const params = {
      startDate: dates[0]?.format('YYYY-MM-DD'),
      endDate: dates[1]?.format('YYYY-MM-DD'),
      towerName: selectedTowerName // send selected name to API
    };

    try {
      const response = await api.getBookedFlat(params);
      if (response.success && Array.isArray(response.data)) {
        setData(response.data);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (value) => {
    setDates(value);
  };

 


  const handleDownload = () => {
    if (!data || data.length === 0) {
      return;
    }
    // Prepare data for Excel (remove unwanted fields if needed)
    const exportData = data.map(({ _id, url, ...rest }) => rest);
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'BookedFlats');
    XLSX.writeFile(workbook, 'BookedFlatsReport.xlsx');
  };

 
 useEffect(() => {
    getTowerNames();
  }, []);

 useEffect(() => {
  if (dates[0] && dates[1]) {
    fetchData();
  }
}, [selectedTowerName]); // triggers on tower change


const getTowerNames = async () => {
  try {
    const response = await api.getTowerNames();
    console.log(response, "response");

    if (response.data.success && Array.isArray(response.data.data)) {
      const names = [
        { label: 'ALL', value: 'ALL' },
        ...response.data.data.map(tower => ({
          label: tower.name,
          value: tower.name,
        })),
      ];
      setTowerList(names);
      console.log(names, "tower names");
      setSelectedTowerName('ALL');
    } else {
      console.error('Failed to fetch tower names');
    }
  } catch (error) {
    console.error('Error fetching tower names:', error);
  }
};



  const handleTowerSelect = ({ key }) => {
    setSelectedTowerName(key);
    fetchData();
  };
   const towerMenu = (
    <Menu onClick={handleTowerSelect}>
      {towerList.map(tower => (
        <Menu.Item key={tower.key}>{tower.label}</Menu.Item>
      ))}
    </Menu>
  );
  return (
    <>
      <Dashheader />
      <div style={{ padding: '20px' }}>
        <Button onClick={() => navigate('/dashboard/reports')} style={{ marginBottom: 16, background: '#1890ff', color: '#fff', border: 'none' }}>
          <ArrowLeftOutlined style={{ marginRight: 6 }} />
          Back To reports
        </Button>
        <h1 className="text-center">Booked Flat History</h1>

        <Row gutter={[16, 16]} justify="center">
          <Col xs={24} sm={8}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <div style={{ width: '55%' }}>
                <span style={{ fontSize: 14, color: '#555', fontWeight: 500 }}>Start Date</span>
                <DatePicker
                  value={dates[0]}
                  onChange={date => setDates([date, dates[1]])}
                  style={{ width: '100%', height: 40, fontSize: 16 }}
                  placeholder="Start date"
                  size="large"
                />
              </div>
              <div style={{ width: '55%' }}>
                <span style={{ fontSize: 14, color: '#555', fontWeight: 500 }}>End Date</span>
                <DatePicker
                  value={dates[1]}
                  onChange={date => setDates([dates[0], date])}
                  style={{ width: '100%', height: 40, fontSize: 16 }}
                  placeholder="End date"
                  size="large"
                />
              </div>
            </div>
          </Col>
          <Col xs={24} sm={8}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 14, color: '#555', fontWeight: 500, marginBottom: 4 }}>Project Name</span>
              <Select
                style={{ width: '100%', height: 44, fontSize: 16 }}
                value={selectedTowerName}
                onChange={(value) => {
                  setSelectedTowerName(value);
                  fetchData();
                }}
                options={towerList}
                placeholder="Select Tower"
                size="large"
              />
            </div>
          </Col>
          <Col xs={24} sm={8} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <Button type="primary" onClick={handleDownload} style={{ width: '50%' }}>
              Download Report
            </Button>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={data}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10, showSizeChanger: false }}
          locale={{
            emptyText: <Empty description="No booked flats found" />,
          }}
          style={{ marginTop: '20px' }}
        />
      </div>
    </>
  );
};

export default ReportBookedFlat;