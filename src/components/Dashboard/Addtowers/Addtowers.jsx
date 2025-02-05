import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './addtowers.css';
import Dashheader from '../Dashheader/Dashheader';
import api from './../../../api.js';

const Addtowers = () => {
    const storedData = JSON.parse(localStorage.getItem('AdminDetails')) || {};
let managementId = storedData?.data?.data?._id || null;
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    priceStartRange: '',
    priceEndRange: '',
    city: '',
    state: '',
    street: '',
    pinCode: '',
    location: '',
    createdBy1: managementId,
    step: 1,
  });

  const [logo, setLogo] = useState(null);
  const [walkThroughVideo, setWalkThroughVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file inputs separately
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      if (name === 'logo') {
        setLogo(files[0]); // Store file object
      } else if (name === 'walkThroughVideo') {
        setWalkThroughVideo(files[0]); // Store file object
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Validate file sizes
    if (logo && logo.size > 1048576) {
      alert('Logo size should be 1MB or less.');
      setLoading(false);
      return;
    }

    if (walkThroughVideo && walkThroughVideo.size > 9242880) {
      alert('Walkthrough Video size should be 5MB or less.');
      setLoading(false);
      return;
    }

    const data = new FormData();

    // Append text data
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    // Append files separately
    if (logo) data.append('logo', logo);
    if (walkThroughVideo) data.append('walkThroughVideo', walkThroughVideo);

    // Debugging: Log FormData contents
    for (let pair of data.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      console.log('Submitting data to API...');
      const response = await api.addTowers(data);

      console.log('API Response:', response.data);
      setMessage({ type: 'success', text: 'Tower added successfully!' });
            alert('navigating to step2')
      // Navigate to Step 2 with towerId
      const towerId = response.data?._id || response.data?.data?._id;
      console.log('Extracted Tower ID:', towerId);
      

      navigate('/addtowers/step2', { state: { towerId:towerId  }, replace: true });
      

    } catch (error) {
      console.error('API Error:', error);
      setMessage({ type: 'error', text: 'Error submitting form. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dashheader />
      <div className="addtowers">
        <h2>Add Towers - Step 1</h2>

        {message && <div className={`message ${message.type}`}>{message.text}</div>}

        <form onSubmit={handleSubmit} className="addtowers-form">
          <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
          <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
          <input type="text" name="priceStartRange" placeholder="Price Start Range" value={formData.priceStartRange} onChange={handleChange} required />
          <input type="text" name="priceEndRange" placeholder="Price End Range" value={formData.priceEndRange} onChange={handleChange} required />
          <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} required />
          <input type="text" name="state" placeholder="State" value={formData.state} onChange={handleChange} required />
          <input type="text" name="street" placeholder="Street" value={formData.street} onChange={handleChange} required />
          <input type="text" name="pinCode" placeholder="Pin Code" value={formData.pinCode} onChange={handleChange} required />
          <textarea name="location" placeholder="Location (iframe)" value={formData.location} onChange={handleChange} required />

          <label>Logo (Max 1MB):
            <input type="file" name="logo" accept="image/*" onChange={handleFileChange} required />
          </label>

          <label>Walkthrough Video (Max 5MB):
            <input type="file" name="walkThroughVideo" accept="video/*" onChange={handleFileChange} required />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Save and Next'}
          </button>
        </form>
      </div>
    </>
  );
};

export default Addtowers;
