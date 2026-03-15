<<<<<<< HEAD
import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await API.post(
        "/api/admin/login",
        { email, password }
      );

      console.log("LOGIN RESPONSE:", res.data);

      if (!res.data.token) {
        setError("Login failed");
        return;
      }

      localStorage.setItem("adminToken", res.data.token);
      navigate("/admin");

    } catch (err) {
      console.error("LOGIN ERROR:", err.response?.data);
      setError("Invalid admin credentials");
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "400px", margin: "auto" }}>
      <h2>Admin Login</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />

        <button type="submit" style={{ padding: "10px", width: "100%" }}>
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
=======
import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await API.post(
        "/api/admin/login",
        { email, password }
      );

      console.log("LOGIN RESPONSE:", res.data);

      if (!res.data.token) {
        setError("Login failed");
        return;
      }

      localStorage.setItem("adminToken", res.data.token);
      navigate("/admin");

    } catch (err) {
      console.error("LOGIN ERROR:", err.response?.data);
      setError("Invalid admin credentials");
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "400px", margin: "auto" }}>
      <h2>Admin Login</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />

        <button type="submit" style={{ padding: "10px", width: "100%" }}>
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
>>>>>>> 00f8281ee8d9b73c8ba973b193294f36d4283ebb
