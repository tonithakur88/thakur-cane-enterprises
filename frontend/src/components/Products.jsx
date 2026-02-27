import React, { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await API.get(
          "/products"
        );
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // ⚠️ Existing cart logic untouched (future safe)
  // const addToCart = (product) => {
  //   if (product.status !== "active" || product.stock === 0) return;

  //   const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

  //   const itemIndex = existingCart.findIndex(
  //     (item) => item._id === product._id
  //   );

  //   if (itemIndex > -1) {
  //     existingCart[itemIndex].qty += 1;
  //   } else {
  //     existingCart.push({ ...product, qty: 1 });
  //   }

  //   localStorage.setItem("cart", JSON.stringify(existingCart));
  //   alert("Added to cart ✅");
  // };

  return (
    <div style={{ padding: "40px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "40px" }}>
        Our Products
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "30px",
        }}
      >
        {products.map((product) => {
          const isActive = product.status === "active";
          const outOfStock = isActive && product.stock === 0;
          const fewLeft =
            isActive && product.stock > 0 && product.stock <= 5;

          return (
            <div
              key={product._id}
              onClick={() =>
                isActive && navigate(`/product/${product._id}`)
              }
              style={{
                background: "#fff",
                padding: "20px",
                borderRadius: "15px",
                boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
                cursor: isActive ? "pointer" : "default",
                transition: "0.3s",
              }}
            >
              <img
                src={product.image}
                alt={product.name}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "10px",
                  marginBottom: "15px",
                }}
              />

              <h3>{product.name}</h3>

              {isActive && product.price && (
                <p
                  style={{
                    fontWeight: "bold",
                    fontSize: "18px",
                    margin: "10px 0",
                  }}
                >
                  ₹ {product.price}
                </p>
              )}

              {/* STOCK WARNINGS */}
              {outOfStock && (
                <p style={{ color: "red", fontWeight: "bold" }}>
                  Out of Stock
                </p>
              )}

              {fewLeft && (
                <p style={{ color: "orange", fontWeight: "bold" }}>
                  🔥 Hurry! Few items left
                </p>
              )}

              {!isActive && (
                <p style={{ color: "#999", fontWeight: "bold" }}>
                  Coming Soon
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Products;
