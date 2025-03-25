import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import './addusers.css';
import api from './../../../api.js';
import Dashheader from '../Dashheader/Dashheader';
import { useToasts } from "react-toast-notifications";
import utilis from '../../../utilis';

const Addusers = () => {
  let navigate = useNavigate();
    const { addToast } = useToasts();
  // State to hold form data
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailId, setEmailId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('Male');

  // Function to handle form submission
  const handleSubmit =async (e) => {
    console.log('enter into')
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try{
      console.log('entering in try')
        let body={
          firstName:firstName,
          lastName:lastName,
          username:username,
          password:password,
          emailId:emailId,
          phoneNumber:phoneNumber,
          birthDate:birthDate,
          gender:gender
        }
        console.log(body,"body")
        let response= await api.addManagement(body)
       console.log(response,"response")
       if(response.status === 401){
        console.log("Session Expired! Redirecting to Login.");
        localStorage.removeItem(utilis.string.localStorage.sessionId);
        localStorage.removeItem(utilis.string.localStorage.userData);
        navigate('/');
      }
       if (response.data.success) {
        // alert(`${firstName} is added successfully`);
        addToast( `${firstName} is added successfully`, {
          appearance: "success",
          autoDismiss: true,
        });
  
        // Reset the form fields after successful submission
        setFirstName('');
        setLastName('');
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        setEmailId('');
        setPhoneNumber('');
        setBirthDate('');
        setGender('Male');
      } else {
        // alert(`Failed to add ${firstName}`);
        addToast( `Failed to add ${firstName}`, {
          appearance: "error",
          autoDismiss: true,
        });
      }
      
    }catch{
          console.log('getting error')
    }
  }

  return (
    <>
      <Dashheader />
      <div className="addusers">
        <div className="addusers-container">
          <h2 className="addusers-title">Add Management</h2>
          <form onSubmit={handleSubmit} className="addusers-form">
            <div className="addusers-form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>

            <div className="addusers-form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>

            <div className="addusers-form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="addusers-form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="addusers-form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div className="addusers-form-group">
              <label htmlFor="emailId">Email</label>
              <input
                type="email"
                id="emailId"
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
                required
              />
            </div>

            <div className="addusers-form-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="text"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>

            <div className="addusers-form-group">
              <label htmlFor="birthDate">Birth Date</label>
              <input
                type="date"
                id="birthDate"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
              />
            </div>

            <div className="addusers-form-group">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <button type="submit" className="addusers-submit-btn">Add User</button>
          </form>
        </div>
      </div>




          

    </>
  );
};

export default Addusers;
