import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    // ✅ Required field validation (lastName optional)
    if (!name || !email || !phone || !password) {
      alert("Please fill all required fields");
      return;
    }

    // ✅ 10 digit phone validation
    if (!/^[0-9]{10}$/.test(phone)) {
      alert("Mobile number must be exactly 10 digits");
      return;
    }

    try {
      const { data } = await API.post(
        "/auth/register",
        {
          name,
          lastName,
          email,
          phone,
          password,
        }
      );

      alert(data.message);

      // OTP verify page
      navigate("/verify-otp", { state: { email, type: "signup" } });

    } catch (error) {
      alert(error.response?.data?.message || "Signup Failed");
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleSignup}>
        <h2>Signup</h2>

        {/* First Name */}
        <label>
          First Name <span style={{ color: "red" }}>*</span>
        </label>
        <input
          style={styles.input}
          type="text"
          placeholder="Enter First Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        {/* Last Name Optional */}
        <label>Last Name (Optional)</label>
        <input
          style={styles.input}
          type="text"
          placeholder="Enter Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

        {/* Email */}
        <label>
          Email <span style={{ color: "red" }}>*</span>
        </label>
        <input
          style={styles.input}
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Phone with Country Code */}
        <label>
          Phone Number <span style={{ color: "red" }}>*</span>
        </label>
        <div style={styles.phoneWrapper}>
          <span style={styles.countryCode}>+91</span>
          <input
            style={styles.phoneInput}
            type="tel"
            placeholder="Enter 10 digit number"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/, ""))}
            maxLength="10"
            required
          />
        </div>

        {/* Password */}
        <label>
          Password <span style={{ color: "red" }}>*</span>
        </label>
        <input
          style={styles.input}
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button style={styles.button} type="submit">
          Signup
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5e6c8",
  },
  form: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    width: "320px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
  },
  input: {
    marginBottom: "15px",
    padding: "10px",
  },
  phoneWrapper: {
    display: "flex",
    marginBottom: "15px",
  },
  countryCode: {
    padding: "10px",
    backgroundColor: "#eee",
    border: "1px solid #ccc",
    borderRight: "none",
  },
  phoneInput: {
    flex: 1,
    padding: "10px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px",
    backgroundColor: "#5C4033",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
};

export default Signup;