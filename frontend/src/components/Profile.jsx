import React, { useEffect, useState, useCallback } from "react";
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
  const [deleteRequested, setDeleteRequested] = useState(false); // ✅ NEW

  /* ================= FETCH PROFILE ================= */
  const fetchProfile = useCallback(async () => {
    const res = await API.get("/api/auth/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUser(res.data);
    setFormData(res.data);

    // ✅ check delete status
    setDeleteRequested(res.data.deleteRequested || false);
  }, [token]);

  /* ================= FETCH ADDRESSES ================= */
  const fetchAddresses = useCallback(async () => {
    const res = await API.get("/api/address", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setAddresses(res.data);
  }, [token]);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchProfile();
    fetchAddresses();
  }, [token, navigate, fetchProfile, fetchAddresses]);

  /* ================= UPDATE PROFILE ================= */
  const updateProfile = async () => {
    await API.put("/api/auth/update-profile", formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert("Profile updated");
  };

  /* ================= CHANGE PASSWORD ================= */
  const changePassword = async () => {
    await API.put("/api/auth/change-password", passwordData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert("Password changed");
  };

  /* ================= ADD ADDRESS ================= */
  const addAddress = async () => {
    try {
      await API.post("/api/address", newAddress, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowForm(false);
      setNewAddress({});
      fetchAddresses();
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  /* ================= DELETE ADDRESS ================= */
  async function deleteAddress(id) {
    await API.delete(`/api/auth/delete-address/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchAddresses();
  }

  /* ================= REQUEST ACCOUNT DELETE ================= */
  const requestDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure?\n\nYour account will be deleted after 30 days if you do not login again."
    );

    if (!confirmDelete) return;

    try {
      const res = await API.post(
        "/api/auth/request-delete-account",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert(res.data.message);
      setDeleteRequested(true);

    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  const cancelDeleteAccount = async () => {
    const confirmCancel = window.confirm(
      "Do you want to cancel account deletion request?"
    );

    if (!confirmCancel) return;

    try {
      const res = await API.post(
        "/api/auth/cancel-delete-account",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert(res.data.message);

      setDeleteRequested(false);

    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  /* ================= LOGOUT ================= */
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

        {/* ✅ DELETE / CANCEL BUTTON */}
        {!deleteRequested ? (
          <button
            onClick={requestDeleteAccount}
            style={{
              ...btn,
              background: "#c0392b",
              cursor: "pointer",
            }}
          >
            Delete Account
          </button>
        ) : (
          <button
            onClick={cancelDeleteAccount}
            style={{
              ...btn,
              background: "#27ae60",
              cursor: "pointer",
            }}
          >
            Cancel Delete Request
          </button>
        )}

        {/* ✅ MESSAGE */}
        {deleteRequested && (
          <p style={{ color: "#ff7675", marginTop: 10, fontSize: 12 }}>
            Your account will be deleted in 30 days if you do not login again.
          </p>
        )}

        <button onClick={logout} style={{ ...btn, background: "#e74c3c" }}>
          Logout
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: 50 }}>

        {activeTab === "profile" && (
          <>
            <h2>Edit Profile</h2>

            <input
              value={formData.name || ""}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="First Name"
            />
            <br /><br />

            <input
              value={formData.lastName || ""}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              placeholder="Last Name"
            />
            <br /><br />

            <input
              value={formData.phone || ""}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Phone"
            />
            <br /><br />

            <button onClick={updateProfile}>Save Changes</button>
          </>
        )}

        {activeTab === "password" && (
          <>
            <h2>Change Password</h2>

            <input
              type="password"
              placeholder="Current Password"
              onChange={(e) =>
                setPasswordData({ ...passwordData, currentPassword: e.target.value })
              }
            />
            <br /><br />

            <input
              type="password"
              placeholder="New Password"
              onChange={(e) =>
                setPasswordData({ ...passwordData, newPassword: e.target.value })
              }
            />
            <br /><br />

            <button onClick={changePassword}>Update Password</button>
          </>
        )}

        {activeTab === "address" && (
          <>
            <h2>Saved Addresses</h2>

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
  cursor: "pointer",
};

export default Profile;