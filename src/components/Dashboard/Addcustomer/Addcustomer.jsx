import React, { useState } from "react";
import Dashheader from '../Dashheader/Dashheader';
import './addcustomer.css';
import api from './../../../api.js';

const AddCustomer = () => {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    birthDate: "",
    gender: "",
    emailId: "",
    phoneNumber: "",
    phoneNumber2: "",
    countryCode: "91",
    countryCode2: "91",
    whatsappNumber: "",
    govtIdProof: "",
    houseNo: "",
    street: "",
    city: "",
    state: "",
    pinCode: "",
    source: "",
    occupation: "",
    registeredBy: "677e58f1281e7de5a0dc42bf",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        console.log('Submitting data to API...');
        const response = await api.addCustomer(formData);
  
        console.log('API Response:', response.formData);

      const data = await response.json();
      setLoading(false);
      const storedData = JSON.parse(localStorage.getItem('AdminDetails')) || {};
      let managementId = storedData?.data?.data?._id || null;

      if (response.ok) {
        alert("Customer added successfully!");
        setFormData({
          name: "",
          surname: "",
          birthDate: "",
          gender: "",
          emailId: "",
          phoneNumber: "",
          phoneNumber2: "",
          countryCode: "91",
          countryCode2: "91",
          whatsappNumber: "",
          govtIdProof: "",
          houseNo: "",
          street: "",
          city: "",
          state: "",
          pinCode: "",
          source: "",
          occupation: "",
          registeredBy: managementId,
        });
      } else {
        alert(data.message || "Something went wrong!");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
      alert("Failed to add customer.");
    }
  };

  return (
    <>
      <Dashheader />
      <div className="addcustomer">
        <div className="addcustomer-container">
          <h2 className="addcustomer-title">Add Customer</h2>
          <form onSubmit={handleSubmit}>
            <div className="addcustomer-form-group">
              <label>Name *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="addcustomer-form-group">
              <label>Surname *</label>
              <input type="text" name="surname" value={formData.surname} onChange={handleChange} required />
            </div>

            <div className="addcustomer-form-group">
              <label>Birth Date *</label>
              <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} required />
            </div>

            <div className="addcustomer-form-group">
              <label>Gender *</label>
              <select name="gender" value={formData.gender} onChange={handleChange} required>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="addcustomer-form-group">
              <label>Email ID *</label>
              <input type="email" name="emailId" value={formData.emailId} onChange={handleChange} required />
            </div>

            <div className="addcustomer-form-group">
              <label>Phone Number *</label>
              <div className="phone-input">
                <select name="countryCode" value={formData.countryCode} onChange={handleChange}>
                  <option value="91">+91</option>
                  <option value="1">+1</option>
                  <option value="44">+44</option>
                  <option value="61">+61</option>
                </select>
                <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
              </div>
            </div>

            <div className="addcustomer-form-group">
              <label>Alternate Phone Number</label>
              <div className="phone-input">
                <select name="countryCode2" value={formData.countryCode2} onChange={handleChange}>
                  <option value="91">+91</option>
                  <option value="1">+1</option>
                  <option value="44">+44</option>
                  <option value="61">+61</option>
                </select>
                <input type="text" name="phoneNumber2" value={formData.phoneNumber2} onChange={handleChange} />
              </div>
            </div>

            <div className="addcustomer-form-group">
              <label>WhatsApp Number *</label>
              <input type="text" name="whatsappNumber" value={formData.whatsappNumber} onChange={handleChange} required />
            </div>

            <div className="addcustomer-form-group">
              <label>City *</label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} required />
            </div>

            <div className="addcustomer-form-group">
              <label>State *</label>
              <input type="text" name="state" value={formData.state} onChange={handleChange} required />
            </div>

            <div className="addcustomer-form-group">
              <label>Pin Code *</label>
              <input type="text" name="pinCode" value={formData.pinCode} onChange={handleChange} required />
            </div>

            <div className="addcustomer-form-group">
  <label>Government ID Proof *</label>
  <input type="text" name="govtIdProof" value={formData.govtIdProof} onChange={handleChange} required />
</div>

<div className="addcustomer-form-group">
  <label>House No *</label>
  <input type="text" name="houseNo" value={formData.houseNo} onChange={handleChange} required />
</div>

<div className="addcustomer-form-group">
  <label>Street *</label>
  <input type="text" name="street" value={formData.street} onChange={handleChange} required />
</div>

<div className="addcustomer-form-group">
  <label>Source *</label>
  <input type="text" name="source" value={formData.source} onChange={handleChange} required />
</div>

<div className="addcustomer-form-group">
  <label>Occupation *</label>
  <input type="text" name="occupation" value={formData.occupation} onChange={handleChange} required />
</div>


            <button type="submit" className="addcustomer-submit-btn" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddCustomer;
    