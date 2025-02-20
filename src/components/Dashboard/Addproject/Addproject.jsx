import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './addproject.css';
import Dashheader from '../Dashheader/Dashheader';
import api from './../../../api.js';
import config from './../../../utilis/config'

const AddProject = () => {
  const storedData = JSON.parse(localStorage.getItem('AdminDetails')) || {};
  let managementId = storedData?.data?.data?._id || null;

  const [formData, setFormData] = useState({
    name: '',
    title: '',
    phoneNumber: '',
    emailId: '',
    status: '',
    state: '',
    city: '',
    street: '',
    houseNo: '',
    pinCode: '',
    proLogo: null,
    proGalary: [],
    about: '',
    remarks: '',
    isVisible: false,
    createdBy: managementId,
    companyId: ''
  });

  const [projectTitle, setProjectTitle] = useState([]); // Store multiple project titles

  useEffect(() => {
    axios
      .get(`${config.baseUrl}/${config.apiName.getCompanydetails}`)
      .then((response) => {
        if (response.data.data.length > 0) {
          setProjectTitle(response.data.data); // Store the entire array
          console.log(response.data.data)
        }
      })
      .catch((error) => {
        console.error('Error fetching project title:', error);
      });
  }, []);


  // const handleChange = (e) => {
  //   const { name, value, type, checked } = e.target;
  //   setFormData({
  //     ...formData,
  //     [name]: type === 'checkbox' ? checked : value,
  //   });
  // };
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === "companyId") {
      setFormData({
        ...formData,
        companyId: value, // Use the _id directly as the value from dropdown
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };
  
  
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  
    if (name === 'proLogo') {
      if (files[0] && files[0].size > maxSize) {
        alert('Project Logo size should be less than 5MB');
        e.target.value = ''; // Clear file input
        return;
      }
      setFormData({ ...formData, proLogo: files[0] });
    } else if (name === 'proGalary') {
      const validFiles = Array.from(files).filter(file => file.size <= maxSize);
      const invalidFiles = Array.from(files).filter(file => file.size > maxSize);
  
      if (invalidFiles.length > 0) {
        alert('Some images exceed 5MB and were not added.');
        e.target.value = ''; // Clear file input
      }
  
      setFormData({
        ...formData,
        proGalary: [...formData.proGalary, ...validFiles],
      });
    }
  };
  
  

  const removeImage = (index) => {
    setFormData({
      ...formData,
      proGalary: formData.proGalary.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();

    for (let key in formData) {
      if (key === 'proGalary') {
        formData.proGalary.forEach((file) => form.append('proGalary', file));
      } else {
        form.append(key, formData[key]);
      }
    }

    try {
      console.log('Submitting data to API...');
      const response = await api.addProjects(form);
      console.log('API Response:', response);

  // Show success alert
  alert("Project added successfully!");

        // Reset form fields after successful submission
    setFormData({
      name: '',
      title: '',
      phoneNumber: '',
      emailId: '',
      status: '',
      state: '',
      city: '',
      street: '',
      houseNo: '',
      pinCode: '',
      proLogo: null,
      proGalary: [],
      about: '',
      remarks: '',
      isVisible: false,
      createdBy: managementId,
      companyId: ''
    });

    // Reset file inputs manually
    document.querySelectorAll("input[type='file']").forEach(input => input.value = "");
    
    } catch (error) {
      console.error('API Error:', error);
    }

    console.log('Form Data Submitted', formData);
  };

  return (
    <>
      <Dashheader />
      <div className="addproject-container">
        <h2 className="addproject-title">Add Project</h2>
        <form className="addproject-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input type="text" name="name" placeholder="Project Name" onChange={handleChange} value={formData.name} required />
            <input type="text" name="title" placeholder="Project Title" onChange={handleChange}  value={formData.title} required />
           
          </div>
          <div className="form-group">
            <input type="tel" name="phoneNumber" placeholder="Phone Number" onChange={handleChange}  value={formData.phoneNumber} required />
            <input type="email" name="emailId" placeholder="Email ID" onChange={handleChange}  value={formData.emailId} required />
          </div>

          <div className="form-group">
             {/* Project Title Dropdown */}
             <select name="companyId" onChange={handleChange} required>
  <option value="">Select Company</option>
  {projectTitle.map((project) => (
    <option key={project._id} value={project._id}>{project.title}</option>
  ))}
</select>


          </div>
          <div className="form-group">
            <select name="status" onChange={handleChange} required value={formData.status}>
              <option>Construction status</option>
              <option>Ready to Move</option>
              <option>Under Construction</option>
              <option>New Launch</option>
            </select>
          </div>
          <div className="form-group">
            <input type="text" name="state" placeholder="State" onChange={handleChange}  value={formData.state} required />
            <input type="text" name="city" placeholder="City" onChange={handleChange}  value={formData.city} required />
          </div>
          <div className="form-group">
            <input type="text" name="street" placeholder="Street" onChange={handleChange}  value={formData.street} required />
            <input type="text" name="houseNo" placeholder="House No" onChange={handleChange}  value={formData.houseNo} required />
            <input type="text" name="pinCode" placeholder="Pincode" onChange={handleChange}  value={formData.pinCode} required />
          </div>
          <div className="form-group file-input">
            <label>Project Logo</label>
            <input type="file" name="proLogo" onChange={handleFileChange}  required />
          </div>
          <div className="form-group file-input gallery-upload">
            <label>Gallery Images</label>
            <div className="gallery-input">
              <input type="file" name="proGalary" multiple onChange={handleFileChange} id="gallery-upload" />
              <button type="button" onClick={() => document.getElementById('gallery-upload').click()} className="add-image-btn">Add Image</button>
            </div>
          </div>
          <div className="gallery-preview">
            {formData.proGalary.map((file, index) => (
              <div key={index} className="gallery-item">
                <span>{file.name}</span>
                <button type="button" className="remove-btn" onClick={() => removeImage(index)}>Remove</button>
              </div>
            ))}
          </div>
          <textarea name="about" placeholder="About" onChange={handleChange}  value={formData.about} required></textarea>
          <textarea name="remarks" placeholder="Remarks" onChange={handleChange}  value={formData.remarks}></textarea>
          <div className="form-group checkbox-container">
            <input type="checkbox" name="isVisible" onChange={handleChange}  value={formData.isVisible}/>
            <label>Visible</label>
          </div>
          <button type="submit" className="submit-btn">Submit</button>
        </form>
      </div>
    </>
  );
};

export default AddProject;
