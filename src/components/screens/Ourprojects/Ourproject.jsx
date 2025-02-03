import React, { useState, useEffect } from 'react';
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';
import './ourprojects.css';
import { locations } from './../../Location/Location.jsx';
import { useLocation } from 'react-router-dom';

const Ourproject = () => {
  // State initialization
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedBHK, setSelectedBHK] = useState("");
  const [selectedConstructionStatus, setSelectedConstructionStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFlats, setFilteredFlats] = useState([]);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // Effect to set initial filter values based on URL query params
  useEffect(() => {
    const city = queryParams.get('city') || "";
    const bhk = queryParams.get('bhk') || "";
    const status = queryParams.get('status') || "";

    setSelectedCity(city);
    setSelectedBHK(bhk);
    setSelectedConstructionStatus(status);
  }, [location]);

  // Effect to filter flats whenever filters or search query change
  useEffect(() => {
    const allFlats = Object.values(locations).flat();

    // Apply filters
    const filtered = allFlats.filter((flat) => {
      const matchesCity = !selectedCity || flat.city.toLowerCase() === selectedCity.toLowerCase();
      const matchesBHK = !selectedBHK || flat.bhkType === selectedBHK;
      const matchesStatus = !selectedConstructionStatus || flat.constructionStatus === selectedConstructionStatus;
      const matchesSearch = !searchQuery || (flat.city && flat.city.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCity && matchesBHK && matchesStatus && matchesSearch;
    });

    setFilteredFlats(filtered);
  }, [selectedCity, selectedBHK, selectedConstructionStatus, searchQuery]);

  // Effect to load all flats when the component is mounted
  useEffect(() => {
    const allFlats = Object.values(locations).flat();
    setFilteredFlats(allFlats);
  }, []);

  return (
    <>
      <Header />
      <div className="ourprojects">
        <div className="filter-container">
          {/* City Dropdown */}
          <select onChange={(e) => setSelectedCity(e.target.value)} value={selectedCity}>
            <option value="">Select City</option>
            {Object.values(locations).flat().map((flat) => (
              <option key={flat.id} value={flat.city}>{flat.city}</option>
            ))}
          </select>

          {/* BHK Type Dropdown */}
          <select onChange={(e) => setSelectedBHK(e.target.value)} value={selectedBHK}>
            <option value="">Select BHK Type</option>
            {["1BHK", "2BHK", "3BHK", "4BHK", "5BHK+"].map((bhk) => (
              <option key={bhk} value={bhk}>{bhk}</option>
            ))}
          </select>

          {/* Construction Status Dropdown */}
          <select onChange={(e) => setSelectedConstructionStatus(e.target.value)} value={selectedConstructionStatus}>
            <option value="">Select Construction Status</option>
            {["Ready to Move", "Under Construction", "New Launch"].map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        {/* Display Filtered Flats */}
        <div className="flats-container">
          {filteredFlats.length > 0 ? (
            filteredFlats.map((flat) => (
              <div key={flat.id} className="flat-card">
                <div className="flat-image-container">
                  <img src={flat.image} alt="Flat" className="flat-image" />
                  <div className="construction-status">{flat.constructionStatus}</div>
                </div>
                <div className="flat-details">
                  <h3>{flat.city} - {flat.bhkType}</h3>
                  <p>Status: {flat.constructionStatus}</p>
                  <p>Price: {/* Add price here if available */}</p>
                  <p>Area: {/* Add area here if available */}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No flats found based on your filters.</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Ourproject;
