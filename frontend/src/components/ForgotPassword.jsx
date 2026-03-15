import { useState } from "react";
import API from "../api";

const ForgotPassword = () => {

  const [email,setEmail] = useState("");
  const [otp,setOtp] = useState("");
  const [newPassword,setNewPassword] = useState("");
  const [step,setStep] = useState(1);

  const sendOtp = async () => {

    try{

      await API.post("/api/auth/forgot-password",{email});

      alert("OTP sent to email");

      setStep(2);

    }catch(err){

      alert(err.response?.data?.message || "Error");

    }

  };

  const verifyOtp = async () => {

    try{

      await API.post("/api/auth/reset-password",{
        email,
        otp,
        newPassword
      });

      alert("Password changed successfully");

      window.location.href="/login";

    }catch(err){

      alert(err.response?.data?.message || "Error");

    }

  };

  return(

    <div style={{padding:"40px"}}>

      <h2>Forgot Password</h2>

      {step===1 && (

        <>
          <input
          placeholder="Enter Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          />

          <br/><br/>

          <button onClick={sendOtp}>
            Send OTP
          </button>

        </>
      )}

      {step===2 && (

        <>
          <input
          placeholder="OTP"
          value={otp}
          onChange={(e)=>setOtp(e.target.value)}
          />

          <br/><br/>

          <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e)=>setNewPassword(e.target.value)}
          />

          <br/><br/>

          <button onClick={verifyOtp}>
            Reset Password
          </button>

        </>

      )}

    </div>

  );

};

export default ForgotPassword;