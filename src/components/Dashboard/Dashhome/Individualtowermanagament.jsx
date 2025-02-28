import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Skeleton, Typography, Card, Row, Col } from "antd";
import { PhoneOutlined, EnvironmentOutlined } from "@ant-design/icons";
import api from "./../../../api.js";
import Dashheader from "../Dashheader/Dashheader";
import Loading from "../../../utilis/Loading.js";
import './individualtowermanagement.css'

const { Title, Text } = Typography;

const Individualtowermanagement = () => {
  const [loading, setLoading] = useState(true);
  const { towerName } = useParams();
  const towerId = localStorage.getItem("selectedTowerId"); // Retrieve _id

  const [towerDetails, setTowerDetails] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchTowerDetails = async () => {
      if (!towerId) {
        console.error("No tower ID found in storage");
        return;
      }
      setLoading(true); // Show loading
      try {
        const response = await api.getindividualtowerdetails(towerId);
        if (response.status === 200) {
          setTowerDetails(response.data.data[0]);
        }
      } catch (error) {
        console.error("Error fetching tower details:", error);
      }finally {
        setLoading(false);
        console.log("Loading set to false"); // Debugging log
      }
    };

    fetchTowerDetails();
  }, [towerId]);

  useEffect(() => {
    if (towerDetails?.galary?.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === towerDetails.galary.length - 1 ? 0 : prevIndex + 1
        );
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [towerDetails]);

  return (
    <>
      <Dashheader />
      <div className="individualtower">
        <div className="individualtower-container">
        {loading ? <Loading /> : ( // Use the reusable Loading component
            <Row className="tower-row">
              {/* Gallery Section (60%) */}
              <Col xs={24} md={14} className="gallery-container">
                {towerDetails?.galary?.length > 0 ? (
                  <div className="gallery-slider">
                    {towerDetails.galary.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt="Gallery"
                        className={`gallery-img ${index === currentIndex ? "active" : ""}`}
                      />
                    ))}
                  </div>
                ) : (
                  <Text type="secondary">No images available</Text>
                )}
              </Col>

              {/* Tower Details Section (40%) */}
              <Col xs={24} md={10} className="details-container">
                <Card className="details-card">
                  <Title level={1}>
                    <strong>{towerDetails.name}</strong>
                  </Title>
                  <Text type="secondary">
                    {towerDetails.city}, {towerDetails.state}, {towerDetails.street} -{" "}
                    {towerDetails.pinCode}
                  </Text>
                  <br />
                  <Text strong>RERA No: </Text> {towerDetails.reraNo}
                  <br />
                  <Button type="primary" className="price-button">
                    {towerDetails.priceStartRange} onwards
                  </Button>

                  <div className="extra-details">
                    <Text>
                      <strong>Project Type:</strong> {towerDetails.projectType}
                    </Text>
                    <Text>
                      <strong>Development Size:</strong> {towerDetails.developmentSize}
                    </Text>
                    <Text>
                      <strong>Total Units:</strong> {towerDetails.totalUnits}
                    </Text>
                  </div>

                  {/* Call & Location Buttons */}
                  <div className="action-buttons">
                    <Button icon={<PhoneOutlined />} type="default">
                      Call
                    </Button>
                    <Button icon={<EnvironmentOutlined />} type="default">
                      Location
                    </Button>
                  </div>
                </Card>
              </Col>
            </Row>
          )}
        </div>

        <div className="individualtowersabout">
              <h2>About Us</h2>
              {towerDetails?.aboutDetails?.[0]?.map((item, index) => (
                <div key={index} className="about-item">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
        {/* Tower Location Section */}
        {towerDetails?.location?.length > 0 && (
          <div className="location-container">
            <h2 className="location-title">📍 Tower Location</h2>
            <div
              className="map-iframe fade-in"
              dangerouslySetInnerHTML={{ __html: towerDetails.location[0] }}
            ></div>
          </div>
        )}
      </div>
    </>
  );
};

export default Individualtowermanagement;
