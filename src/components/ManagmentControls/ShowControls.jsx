import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Switch, Typography } from 'antd';
import Dashheader from '../Dashboard/Dashheader/Dashheader';
import api from './../../api.js';
import { useToasts } from "react-toast-notifications";
import utilis from '../../utilis';
import Loading from '../../utilis/Loading.js';

const { Title } = Typography;

const ShowControls = () => {
  
  const navigate = useNavigate();
  const { addToast } = useToasts();
  const { id, firstName } = useParams();
  const [loading, setLoading] = useState(false);
  const [controlsforadmin, setcontrolsforadmin] = useState(null); // original fetched controls
  const [controlStates, setControlStates] = useState({}); // editable controls

const Getcontrolsforadmin = async () => {
    try {
        setLoading(true);
        let response = await api.getControlsForAdmin(id);
        const controlsData = response.data.data[0];
        setcontrolsforadmin(controlsData);

        // Initialize editable control states (exclude metadata)
        const excludedKeys = ['_id', 'mgmtId', 'createdBy', 'createdOn', 'updated', '__v', 'isDeleted'];
        const filteredControls = Object.keys(controlsData)
            .filter(key => !excludedKeys.includes(key))
            .reduce((obj, key) => {
                obj[key] = controlsData[key];
                return obj;
            }, {});

        setControlStates(filteredControls);

        console.log("Fetched controls for admin:", controlsData);
    } catch (error) {
        console.error("Error fetching controls:", error);
    } finally {
        setLoading(false); // Stop loading
    }
};

  useEffect(() => {
    Getcontrolsforadmin();
  }, []);

  const storedData = JSON.parse(localStorage.getItem('AdminDetails')) || {};
  const updatedById = storedData?.data?.data?._id || null; // updatedBy

  const updateControlImmediately = async (updatedKey, updatedValue) => {
    setLoading(true);

    const postData = {
        mgmtId: id, // Management ID
        [updatedKey]: updatedValue, // Only the updated field
        updatedBy: updatedById, // Admin ID
    };

    console.log("Instant Submit Data:", postData);

    try {
        const response = await api.postParticularManagementDetails(postData);

        if (response.status === 401) {
            console.log("Session Expired! Redirecting to Login.");
            localStorage.removeItem(utilis.string.localStorage.sessionId);
            localStorage.removeItem(utilis.string.localStorage.userData);
            navigate('/');
        } else if (response.status === 200) {
            addToast(`${updatedKey} updated successfully`, {
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
        if (error.response?.status === 404) {
            console.error("API Endpoint not found:", error.response);
            addToast("API Endpoint not found. Please contact support.", {
                appearance: "error",
                autoDismiss: true,
            });
        } else {
            console.error("Error submitting control:", error);
            addToast("Error updating control!", {
                appearance: "error",
                autoDismiss: true,
            });
        }
    } finally {
        setLoading(false);
    }
};

  const handleSwitchChange = (key, checked) => {
    setControlStates(prev => ({
      ...prev,
      [key]: checked
    }));
    updateControlImmediately(key, checked);  // Instant API hit
  };

  return (
    <>
      <Dashheader />
      {loading ? (
      <Loading/>
    ) : (
      <div style={{ padding: '20px' }}>
        <Title level={3} style={{ textAlign: 'center' }}>Controls for {firstName}</Title>
        {/* <p><strong>Management ID:</strong> {id}</p> */}

        {controlsforadmin && (
          <Card title="Access Controls" bordered={true}>
            <Row gutter={[16, 16]}>
              {Object.entries(controlStates).map(([key, value]) => (
    <Col xs={24} sm={12} md={8} lg={6} key={key}>
        <Card size="small">
            <p style={{ marginBottom: '8px', textTransform: 'capitalize' }}>
                {key.replace(/([A-Z])/g, ' $1')}
            </p>
            <Switch
                checked={value}
                loading={loading}
                onChange={(checked) => handleSwitchChange(key, checked)}
                disabled={controlStates.allControls && key !== 'allControls'} // Disable other fields if allControls is true
            />
        </Card>
    </Col>
))}
            </Row>
          </Card>
        )}
      </div>
      )}
    </>
  );
};

export default ShowControls;
