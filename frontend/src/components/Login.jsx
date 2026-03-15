import { useState, useEffect } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // ✅ PROTECT LOGIN ROUTE
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/api/auth/login", {
        email,
        password,
      });

      alert(res.data.message);

      navigate("/verify-otp", {
        state: { email, type: "login" },
      });

    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "radial-gradient(circle at 20% 20%, #1e293b, #0f172a 40%, #020617)",
        fontFamily: "sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Floating Glow Background */}
      <div
        style={{
          position: "absolute",
          width: "500px",
          height: "500px",
          background:
            "radial-gradient(circle, rgba(0,245,160,0.25), transparent 70%)",
          filter: "blur(120px)",
          animation: "floatGlow 6s ease-in-out infinite alternate",
        }}
      />

      <form
        onSubmit={handleLogin}
        style={{
          backdropFilter: "blur(20px)",
          background:
            "linear-gradient(145deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))",
          border: "1px solid rgba(255,255,255,0.08)",
          padding: "50px 40px",
          borderRadius: "24px",
          width: "350px",
          boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
          position: "relative",
          zIndex: 2,
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "35px",
            fontSize: "30px",
            fontWeight: "700",
            background:
              "linear-gradient(90deg,#00f5a0,#00d9f5)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Welcome Back
        </h2>

        {/* Email */}
        <div style={{ marginBottom: "25px" }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.05)",
              color: "#fff",
              fontSize: "14px",
              outline: "none",
              transition: "0.3s",
            }}
            onFocus={(e) =>
            (e.target.style.boxShadow =
              "0 0 15px rgba(0,245,160,0.6)")
            }
            onBlur={(e) =>
              (e.target.style.boxShadow = "none")
            }
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: "30px" }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.05)",
              color: "#fff",
              fontSize: "14px",
              outline: "none",
              transition: "0.3s",
            }}
            onFocus={(e) =>
            (e.target.style.boxShadow =
              "0 0 15px rgba(0,245,160,0.6)")
            }
            onBlur={(e) =>
              (e.target.style.boxShadow = "none")
            }
          />
        </div>

        <p
          style={{
            textAlign: "right",
            marginTop: "-15px",
            marginBottom: "20px",
            fontSize: "12px"
          }}
        >
          <Link
            to="/forgot-password"
            style={{
              color: "#00f5a0",
              textDecoration: "none"
            }}
          >
            Forgot Password?
          </Link>
        </p>

        {/* Login Button */}
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "12px",
            border: "none",
            cursor: "pointer",
            fontSize: "15px",
            fontWeight: "600",
            color: "#000",
            background:
              "linear-gradient(90deg,#00f5a0,#00d9f5)",
            boxShadow:
              "0 0 20px rgba(0,245,160,0.6)",
            transition: "0.3s",
          }}
          onMouseEnter={(e) =>
            (e.target.style.transform = "scale(1.05)")
          }
          onMouseLeave={(e) =>
            (e.target.style.transform = "scale(1)")
          }
        >
          Login
        </button>
        {/* Signup Redirect */}
        <p
          style={{
            marginTop: "25px",
            textAlign: "center",
            fontSize: "13px",
            color: "rgba(255,255,255,0.7)",
          }}
        >
          New here?{" "}
          <Link
            to="/signup"
            style={{
              background: "linear-gradient(90deg,#00f5a0,#00d9f5)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: "600",
              textDecoration: "none",
              position: "relative",
            }}
          >
            Create an Account
          </Link>
        </p>
      </form>

      {/* Animations */}
      <style>
        {`
        @keyframes floatGlow {
          0% { transform: translateY(-20px); }
          100% { transform: translateY(20px); }
        }
      `}
      </style>
    </div>
  );
};

export default Login;