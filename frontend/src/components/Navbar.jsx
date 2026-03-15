<<<<<<< HEAD
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";


const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  // const handleLogout = () => {
  //   localStorage.removeItem("token");
  //   navigate("/");   // ya "/" if you prefer home
  // };

  return (
  <div style={styles.navbar}>
    <div style={styles.logo} onClick={() => navigate("/")}>
      🌾 Thakur Cane Enterprises
    </div>

    <div style={styles.links}>
      {location.pathname !== "/" && (
        <button style={styles.linkBtn} onClick={() => navigate("/")}>
          Home
        </button>
      )}

      <button style={styles.linkBtn} onClick={() => navigate("/products")}>
        Products
      </button>

      <button style={styles.linkBtn} onClick={() => navigate("/cart")}>
        Cart
      </button>

      {/* ✅ Only Profile Button When Logged In */}
      {token && (
        <button
          style={styles.linkBtn}
          onClick={() => navigate("/profile")}
        >
          My Account
        </button>
      )}

      {!token && (
        <button style={styles.loginBtn} onClick={() => navigate("/login")}>
          Login
        </button>
      )}
    </div>
  </div>
);
}

const styles = {
  navbar: {
    height: "70px",
    background: "#111",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 40px",
    color: "#fff"
  },
  logo: { fontSize: "22px", fontWeight: "bold", cursor: "pointer" },
  links: { display: "flex", alignItems: "center", gap: "20px" },
  linkBtn: {
    background: "transparent",
    border: "none",
    color: "#fff",
    cursor: "pointer"
  },
  loginBtn: {
    background: "#2ecc71",
    padding: "8px 18px",
    borderRadius: "6px",
    border: "none",
    color: "#fff",
    cursor: "pointer"
  },
  logoutBtn: {
    background: "#e74c3c",
    padding: "8px 18px",
    borderRadius: "6px",
    border: "none",
    color: "#fff",
    cursor: "pointer"
  }
};

=======
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";


const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  // const handleLogout = () => {
  //   localStorage.removeItem("token");
  //   navigate("/");   // ya "/" if you prefer home
  // };

  return (
  <div style={styles.navbar}>
    <div style={styles.logo} onClick={() => navigate("/")}>
      🌾 Thakur Cane Enterprises
    </div>

    <div style={styles.links}>
      {location.pathname !== "/" && (
        <button style={styles.linkBtn} onClick={() => navigate("/")}>
          Home
        </button>
      )}

      <button style={styles.linkBtn} onClick={() => navigate("/products")}>
        Products
      </button>

      <button style={styles.linkBtn} onClick={() => navigate("/cart")}>
        Cart
      </button>

      {/* ✅ Only Profile Button When Logged In */}
      {token && (
        <button
          style={styles.linkBtn}
          onClick={() => navigate("/profile")}
        >
          My Account
        </button>
      )}

      {!token && (
        <button style={styles.loginBtn} onClick={() => navigate("/login")}>
          Login
        </button>
      )}
    </div>
  </div>
);
}

const styles = {
  navbar: {
    height: "70px",
    background: "#111",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 40px",
    color: "#fff"
  },
  logo: { fontSize: "22px", fontWeight: "bold", cursor: "pointer" },
  links: { display: "flex", alignItems: "center", gap: "20px" },
  linkBtn: {
    background: "transparent",
    border: "none",
    color: "#fff",
    cursor: "pointer"
  },
  loginBtn: {
    background: "#2ecc71",
    padding: "8px 18px",
    borderRadius: "6px",
    border: "none",
    color: "#fff",
    cursor: "pointer"
  },
  logoutBtn: {
    background: "#e74c3c",
    padding: "8px 18px",
    borderRadius: "6px",
    border: "none",
    color: "#fff",
    cursor: "pointer"
  }
};

>>>>>>> 00f8281ee8d9b73c8ba973b193294f36d4283ebb
export default Navbar;