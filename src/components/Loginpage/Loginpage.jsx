import React, { useState, useEffect } from "react";
import "./loginpage.css";
import api from './../../api.js';
import { useNavigate } from "react-router-dom"; 
import { Modal , Button} from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useToasts } from "react-toast-notifications";




const Loginpage = () => {
    const { addToast } = useToasts();
  const navigate = useNavigate(); 
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [countdown, setCountdown] = useState(30);
  const [buttonText, setButtonText] = useState("Send OTP");
  const [managementId, setmanagementId] = useState("");
  const [emailId, setemailId] = useState("");
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  // Timer effect for countdown and resend OTP
  useEffect(() => {
    let timer;
    if (otpSent && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      clearInterval(timer);
      setButtonText("Resend OTP"); // Change button text after countdown reaches zero
    }
    return () => clearInterval(timer);
  }, [otpSent, countdown]);

  const handleForgotPassword = async(e) => {
    e.preventDefault();
    if (username.trim()) {
      console.log('enter into ')
      setForgotPasswordMode(true)
      try{
        console.log('enter into try')
          let body={
            username : username, 
           
          }
          console.log(body,"body")
    
         let response= await api.forgotPassword(body)
         console.log(response,"response")

         if(response.data.success){
          setmanagementId(response.data.data._id)
          setemailId(response.data.data.emailId)
         }
         else{

         }
    
          setEmail(response.data.data.emailId)
    
    console.log(response.data.data.emailId,"email")
        
        }
      catch (e) {
        console.log('hbcjkb')
      }

     } else {
    //  alert("enter username")
     addToast( "enter username", {
      appearance: "error",
      autoDismiss: true,
    });
    }
  };

  // const resendOtp = () => {
  //   const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  //   setGeneratedOtp(otpCode);
  //   setOtpSent(true);
  //   setCountdown(30); // Reset countdown on OTP resend
  //   setButtonText("Sent Successfully"); // Update button text after OTP resend
  //   alert(`OTP resent to ${email}: ${otpCode}`); // Simulating OTP resend
  // };

  // const handleSendOtp = (e) => {
  //   e.preventDefault();
  //   if (!email.trim()) {
  //     alert("Please enter your email ID.");
  //     return;
  //   }
  //   // Simulating OTP generation
  //   const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  //   setGeneratedOtp(otpCode);
  //   setOtpSent(true);
  //   setCountdown(30); // Reset countdown on OTP send
  //   setButtonText("Sent Successfully"); // Update button text after OTP sent
  //   alert(`OTP sent to ${email}: ${otpCode}`); // Simulating OTP sent to email
  // };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!otpSent) {
      alert("Please request OTP first.");
      return;
    }
    if (otp !== generatedOtp) {
      alert("Invalid OTP. Please enter the correct OTP.");
      return;
    }
    if (!newPassword.trim() || !confirmPassword.trim()) {
      alert("All fields are required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    setButtonText("OTP Verified Successfully"); // Update button text when OTP is verified
    alert("Password updated successfully!");
    setForgotPasswordMode(false);
    setOtpSent(false);
  };



  const loginApp = async () => {
    console.log("Enter into function");
  
    try {
      console.log("Enter into try block");
  
      let body = {
        username: username,
        fcmToken: "",
        password: password,
      };
  
      console.log("Request Body:", body);
  
      let response = await api.getAdminLogin(body);
  
      console.log("Full Response:", response);
      
      if (!response || !response.data) {
        console.log("Invalid response structure", response);
        addToast(response.data?.message || "Something went wrong!", {
          appearance: "error",
          autoDismiss: true,
        });
        return;
      }
  
      console.log("response.data:", response.data);
      console.log("response.data.success:", response.data?.success);
  
      localStorage.setItem("AdminDetails", JSON.stringify(response));
  
      let email = response.data.data?.emailId || "";
      setEmail(email);
  
      console.log("Email:", email);
  
      if (response.data.success === true) {
        addToast("Login successfully", {
          appearance: "success",
          autoDismiss: true,
        });
  
        localStorage.setItem("userData", JSON.stringify(response.data.data));
        localStorage.setItem("sessionId", response.data.data.sessionId);
  
        const mgmtId = response.data.data._id; 
        navigate(`/login/dashboard`);
      } else {
        console.log("Enter into else block");
        addToast(response.data?.message || "Something went wrong!", {
          appearance: "error",
          autoDismiss: true,
        });
      }
    } catch (error) {
      console.error("API Error:", error);
      addToast(error?.response?.data?.message || "Something went wrong. Please try again.", {
        appearance: "error",
        autoDismiss: true,
      });
    }
    
    
  };
  



const updatePassword=async (e)=>{
  e.preventDefault()
  console.log('enter into ')

    if(newPassword===confirmPassword){
      try{
        console.log('enter into try')
          let body={
            mgmtId:managementId , 
            password:newPassword, 
            emailId:emailId,
            otp
          }
          console.log(body,"body")
    
         let response= await api.updatePassword(body)
         console.log(response,"response")
    //  setEmail(response.data.data.emailId)
     
     console.log(response.data.success,'success')
    
    
    
    if (response.data.success) {
      // alert("Login successful!");
      addToast( "password updated successfully", {
        appearance: "success",
        autoDismiss: true,
      });
      addToast( "Navigating to loginpage please login here", {
        appearance: "success",
        autoDismiss: true,
      });
      setForgotPasswordMode(false); // Ensures the login form stays visible
      setEmail(response.data.data.emailId); 
    } else {
      // alert("Failed to update password. Please try again.");
      addToast( response.data?.message || "Something went wrong!", {
        appearance: "error",
        autoDismiss: true,
      });
    }
  
  }catch (e) {
        console.log('hbcjkb')
      }
    }  
    else{
      // alert("password didn't matched")
      addToast( "password didn't matched", {
        appearance: "error",
        autoDismiss: true,
      });
    }
  

}






  let submitform=(e)=>{
    e.preventDefault()
  }


  // const logout = async () => {
    
  //   try{
  //     console.log('enter into try')
  //       let body={
  //         mgmtId:managementId
  //       }
  //       console.log(body,"body")
  
  //      let response= await api.logOut(body)

  //      console.log(response,"response")
  // }
  //   catch (e) {
  //     console.log('hbcjkb')
  //   }
  // };

  

  return (
    <div className="login-container">
      <div className="login-box">
        {!forgotPasswordMode ? (
          <form className="login-form" onSubmit={submitform}>
            <h2 className="login-title">Welcome to Lyonora</h2>
            <input
              type="text"
              placeholder="Username"
              className="login-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
    
            <input type="password"
             placeholder="Password" 
             className="login-input"
             value={password}
             onChange={(e) => setPassword(e.target.value)}/>
            <button type="submit" onClick={loginApp} className="login-button">Login</button>

            <p className="forgot-password" onClick={handleForgotPassword}>
              Forgot Password?
            </p>
          </form>
        ) : (
          <form className="forgot-password-form">
            <h2 className="login-title">Reset Password</h2>
            <input
              type="text"
              placeholder="Username"
              className="login-input"
              value={username}
              disabled
            />
            <input
              type="email"
              placeholder="Email ID"
              className="login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled
            />
           
            
              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  className="login-input"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="New Password"
                  className="login-input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
             
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="login-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                  <p className="resend-otp">
            Didn't get the code? <span onClick= {handleForgotPassword}>Resend OTP</span>
          </p>
                <button type="submit" onClick={updatePassword} className="login-button">
                  Update Password
                </button>
              </>
            
          </form>
        )}
      </div>



      {/* <Modal
        show={logoutModalOpen}
        onHide={() => setLogoutModalOpen(false)}
        backdrop="static"
        keyboard={false}
        centered
       >
        <Modal.Body>
          <h6 style={{ marginBottom: 25   }}>Are you sure you want to logout.?</h6>
        </Modal.Body>
        <Modal.Footer>
         
          <Button className="cancelButton" variant="secondary" onClick={() => setLogoutModalOpen()} >
          Cancel
        </Button>
          
          <Button className="submitButton" variant="primary"  onClick={() => logout()}>
          Submit
        </Button>
        </Modal.Footer>

 
      </Modal> */}




    </div>
  );
};

export default Loginpage;
