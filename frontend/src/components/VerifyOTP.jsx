import { useState } from "react";
import API from "../api";
import { useLocation, useNavigate } from "react-router-dom";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;
  const type = location.state?.type; // "signup" or "login"

  const handleVerify = async () => {
    try {
      if (!email) {
        alert("Session expired. Please try again.");
        return navigate("/login");
      }

      let url =
        type === "login"
          ? "/api/auth/verify-login-otp"
          : "/api/auth/verify-otp";

      const res = await API.post(url, {
        email,
        otp: otp.toString()
      });
      console.log("EMAIL:", email);
      console.log("OTP:", otp);

      // 🔐 If LOGIN → store token
      if (type === "login") {
        localStorage.setItem("token", res.data.token);
        navigate("/");
      } else {
        alert("Signup successful. Please login.");
        navigate("/login");
      }

    } catch (error) {
      alert(error.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Enter OTP</h2>

      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />

      <br /><br />

      <button onClick={handleVerify}>
        Verify OTP
      </button>
    </div>
  );
};

export default VerifyOTP;

