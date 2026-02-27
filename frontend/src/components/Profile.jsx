// FULL PROFESSIONAL DASHBOARD VERSION
// (Large code – safe copy paste)

import React, { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [activeTab, setActiveTab] = useState("profile");
  const [showForm, setShowForm] = useState(false);
  const [newAddress, setNewAddress] = useState({});
  const [formData, setFormData] = useState({});
  const [passwordData, setPasswordData] = useState({});

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchProfile();
    fetchAddresses();
  }, []);

  const fetchProfile = async () => {
    const res = await API.get("/api/auth/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUser(res.data);
    setFormData(res.data);
  };

  const fetchAddresses = async () => {
    const res = await API.get("/api/address", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setAddresses(res.data);
  };

  const updateProfile = async () => {
    await API.put("/api/auth/update-profile", formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert("Profile updated");
  };

  const changePassword = async () => {
    await API.put("/api/auth/change-password", passwordData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert("Password changed");
  };

  const addAddress = async () => {
    try {
      const res = await  API.post(
        "/api/address",
        newAddress,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log(res.data); // should show address object

      setShowForm(false);
      setNewAddress({});
      fetchAddresses();

    } catch (err) {
      console.log(err.response?.data);
    }
  };

  const deleteAddress = async (id) => {
    await API.delete(`/api/auth/delete-address/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchAddresses();
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (!user) return <div style={{ padding: 50 }}>Loading...</div>;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f4f6f9" }}>
      {/* Sidebar */}
      <div style={{ width: 250, background: "#111", color: "#fff", padding: 30 }}>
        <h3>My Account</h3>

        <button onClick={() => setActiveTab("profile")} style={btn}>
          Profile Info
        </button>

        <button onClick={() => setActiveTab("password")} style={btn}>
          Change Password
        </button>

        <button onClick={() => setActiveTab("address")} style={btn}>
          Manage Addresses
        </button>

        <button onClick={() => navigate("/orders")} style={btn}>
          My Orders
        </button>

        <button onClick={logout} style={{ ...btn, background: "#e74c3c" }}>
          Logout
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: 50 }}>
        {activeTab === "profile" && (
          <>
            <h2>Edit Profile</h2>
            <input value={formData.name || ""} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="First Name" />
            <br /><br />
            <input value={formData.lastName || ""} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} placeholder="Last Name" />
            <br /><br />
            <input value={formData.phone || ""} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="Phone" />
            <br /><br />
            <button onClick={updateProfile}>Save Changes</button>
          </>
        )}

        {activeTab === "password" && (
          <>
            <h2>Change Password</h2>
            <input type="password" placeholder="Current Password"
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} />
            <br /><br />
            <input type="password" placeholder="New Password"
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} />
            <br /><br />
            <button onClick={changePassword}>Update Password</button>
          </>
        )}

        {activeTab === "address" && (
          <>
            <h2>Saved Addresses</h2>

            {/* ✅ ADD ADDRESS BUTTON */}
            <button
              onClick={() => setShowForm(!showForm)}
              style={{
                padding: "8px 15px",
                background: "#111",
                color: "#fff",
                border: "none",
                marginBottom: "20px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              {showForm ? "Close Form" : "Add New Address"}
            </button>

            {/* ✅ ADDRESS FORM */}
            {showForm && (
              <div style={{ background: "#fff", padding: 20, marginBottom: 20 }}>
                <input
                  placeholder="Full Name"
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, fullName: e.target.value })
                  }
                /><br /><br />

                <input
                  placeholder="Phone"
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, phone: e.target.value })
                  }
                /><br /><br />

                <input
                  placeholder="Address Line"
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, house: e.target.value })
                  }
                /><br /><br />

                <input
                  placeholder="City"
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, city: e.target.value })
                  }
                /><br /><br />

                <input
                  placeholder="State"
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, state: e.target.value })
                  }
                /><br /><br />

                <input
                  placeholder="Pincode"
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, pincode: e.target.value })
                  }
                /><br /><br />

                <button onClick={addAddress}>Save Address</button>
              </div>
            )}

            {/* ✅ ADDRESS LIST */}
            {addresses.map((addr) => (
              <div
                key={addr._id}
                style={{
                  background: "#fff",
                  padding: 20,
                  marginBottom: 15,
                  borderRadius: 8,
                }}
              >
                <p>{addr.fullName}</p>
                <p>{addr.phone}</p>
                <p>
                  {addr.addressLine}, {addr.city}, {addr.state} - {addr.pincode}
                </p>

                <button onClick={() => deleteAddress(addr._id)}>
                  Delete
                </button>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

const btn = {
  display: "block",
  width: "100%",
  margin: "10px 0",
  padding: "10px",
  background: "transparent",
  color: "#fff",
  border: "none",
  textAlign: "left",
  cursor: "pointer"
};

export default Profile;