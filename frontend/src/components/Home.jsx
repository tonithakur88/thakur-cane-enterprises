import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const images = [
  "https://images.unsplash.com/photo-1603048297172-c92544798d5a?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1598514982901-3c0c8b1b9e80?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1592928301188-9c4fdb6b3a5d?auto=format&fit=crop&w=1600&q=80",
];

const Home = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const slider = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(slider);
  }, []);

  return (
    <div style={styles.container}>
      {/* Background Slider */}
      {images.map((img, index) => (
        <div
          key={index}
          style={{
            ...styles.slide,
            backgroundImage: `url(${img})`,
            opacity: index === current ? 1 : 0,
          }}
        />
      ))}

      {/* Glass Content */}
      <div style={styles.content}>
        <h1 style={styles.title}>
          PURE ORGANIC JAGGERY
        </h1>
        <p style={styles.subtitle}>
          From Our Sugarcane Fields To Your Home
        </p>

        <button
          style={styles.button}
          onClick={() => navigate("/products")}
        >
          Explore Products
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: "relative",
    height: "100vh",
    width: "100%",
    overflow: "hidden",
  },

  slide: {
    position: "absolute",
    height: "100%",
    width: "100%",
    backgroundSize: "cover",
    backgroundPosition: "center",
    transition: "opacity 1.5s ease-in-out",
    backgroundRepeat: "no-repeat",
  },

  content: {
    position: "relative",
    zIndex: 2,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    color: "white",
    backdropFilter: "blur(6px)",
    background: "rgba(0,0,0,0.35)",
  },

  title: {
    fontSize: "60px",
    letterSpacing: "3px",
    marginBottom: "20px",
    animation: "fadeIn 2s ease-in-out",
  },

  subtitle: {
    fontSize: "24px",
    marginBottom: "40px",
    opacity: 0.9,
  },

  button: {
    padding: "15px 40px",
    fontSize: "18px",
    border: "none",
    borderRadius: "50px",
    background: "linear-gradient(45deg,#2e7d32,#66bb6a)",
    color: "white",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
};

export default Home;