import React, { useState } from 'react';
import './contact.css';
import Footer from '../../Footer/Footer';
import Header from '../../Header/Header';
import api from './../../../api.js';
import { useToasts } from "react-toast-notifications";

const Contactus = () => {
  const { addToast } = useToasts();
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    emailId: '',
    countryCode: '91',
    scheduleDate: '',
    scheduleTime: '',
    marketingUpdates: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

 

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await api.enquiryForm(formData);
    
    if (response.status === 200) {
      console.log('Form submitted successfully', response.data);
      addToast( "Enquiry form submitted successfully", {
        appearance: "success",
        autoDismiss: true,
      });
      // alert('Form submitted successfully')

       // Reset form fields
       setFormData({
        name: '',
        mobile: '',
        emailId: '',
        countryCode: '91',
        scheduleDate: '',
        scheduleTime: '',
        marketingUpdates: false
      });
      
    } else {
      addToast( "something went wrong", {
        appearance: "error",
        autoDismiss: true,
      });
      console.error('Failed to submit form');
    }
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
};


  return (
    <>
      <Header />
      <div className="contactus1">
        <div className="contact-container1">
          <div className="contact-header1">
            <h2>Enquiry</h2>
            <p>We’d love to hear from you! Whether you have questions or need assistance, feel free to reach out to us.</p>
          </div>

          <form onSubmit={handleSubmit} className="contact-form1">
            <div className="form-group1">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="form-input1"
              />
            </div>

            <div className="form-group mobile-group1">
              <label htmlFor="mobile">Mobile</label>
              <div className="mobile-container1">
                <select
                  id="countryCode"
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  required
                  className="form-input country-code1"
                >
                  <option value="91">+91 (India)</option>
                  <option value="1">+1 (USA)</option>
                  <option value="44">+44 (UK)</option>
                  <option value="61">+61 (Australia)</option>
                </select>
                <input
                  type="text"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                  className="form-input mobile-number1"
                />
              </div>
            </div>

            <div className="form-group1">
              <label htmlFor="emailId">Email ID</label>
              <input
                type="email"
                id="emailId"
                name="emailId"
                value={formData.emailId}
                onChange={handleChange}
                required
                className="form-input1"
              />
            </div>

            <div className="form-group1">
              <label htmlFor="scheduleDate">Schedule Date</label>
              <input
                type="date"
                id="scheduleDate"
                name="scheduleDate"
                value={formData.scheduleDate}
                onChange={handleChange}
                required
                className="form-input1"
              />
            </div>

            <div className="form-group1">
              <label htmlFor="scheduleTime">Schedule Time</label>
              <input
                type="time"
                id="scheduleTime"
                name="scheduleTime"
                value={formData.scheduleTime}
                onChange={handleChange}
                required
                className="form-input1"
              />
            </div>

            <div className="form-group1">
              <label htmlFor="marketingUpdates">
                <input
                  type="checkbox"
                  id="marketingUpdates"
                  name="marketingUpdates"
                  checked={formData.marketingUpdates}
                  onChange={handleChange}
                  className="form-checkbox1"
                />
                Receive Marketing Updates
              </label>
            </div>

            <button type="submit" className="submit-btn1">
              Submit
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contactus;
