import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import API from "../api";

const ProductDetail = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [qty, setQty] = useState(1);
  const [inCart, setInCart] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  const fetchProduct = useCallback(async () => {
    try {
      const { data } = await API.get(
        `/api/products/${id}`
      );
      setProduct(data);
      setSelectedImage(data.image || (data.images && data.images[0]));
    } catch (error) {
      console.error(error);
    }
  }, [id]);

  const checkCart = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const { data } = await API.get(
        "/api/cart",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const exists = data.items.find(
        (item) => item.product._id === id
      );

      if (exists) setInCart(true);
    } catch (error) {
      console.error(error);
    }
  }, [id]);


  useEffect(() => {
    fetchProduct();
    checkCart();
  }, [fetchProduct, checkCart]);

  const addToCart = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Login First ❌");
        return;
      }

      await API.post(
        "/api/cart/add",
        {
          productId: product._id,
          qty,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setInCart(true);
      alert("Added to Cart ✅");
    } catch (error) {
      console.error(error);
      alert("Error adding to cart ❌");
    }
  };


  if (!product) return <h2 style={{ padding: "40px" }}>Loading...</h2>;

  const isActive = product.status === "active";
  const outOfStock = product.stock === 0;

  return (
    <div style={{ padding: "60px 8%", background: "#f8f9fa" }}>
      <div
        style={{
          display: "flex",
          gap: "60px",
          background: "#fff",
          padding: "40px",
          borderRadius: "20px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        {/* LEFT IMAGE SECTION */}
        <div style={{ display: "flex", gap: "20px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {product.images &&
              product.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt="thumb"
                  onClick={() => setSelectedImage(img)}
                  style={{
                    width: "70px",
                    height: "70px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    cursor: "pointer",
                    border:
                      selectedImage === img
                        ? "2px solid #000"
                        : "1px solid #ddd",
                  }}
                />
              ))}
          </div>

          <div
            style={{
              width: "450px",
              height: "450px",
              overflow: "hidden",
              borderRadius: "20px",
            }}
          >
            <img
              src={selectedImage}
              alt={product.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "0.4s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.1)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            />
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: "28px", marginBottom: "10px" }}>
            {product.name}
          </h1>

          <div style={{ fontSize: "26px", fontWeight: "bold", margin: "15px 0" }}>
            ₹ {product.price}
          </div>

          {/* STOCK STATUS */}
          {outOfStock ? (
            <span
              style={{
                background: "#ffe5e5",
                color: "red",
                padding: "6px 12px",
                borderRadius: "20px",
                fontWeight: "bold",
              }}
            >
              Out of Stock
            </span>
          ) : (
            <span
              style={{
                background: "#e6ffed",
                color: "green",
                padding: "6px 12px",
                borderRadius: "20px",
                fontWeight: "bold",
              }}
            >
              In Stock ({product.stock})
            </span>
          )}

          {/* QUANTITY */}
          {!outOfStock && (
            <div
              style={{
                marginTop: "25px",
                display: "flex",
                alignItems: "center",
                gap: "15px",
              }}
            >
              <button
                onClick={() => qty > 1 && setQty(qty - 1)}
                style={qtyBtnStyle}
              >
                −
              </button>

              <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                {qty}
              </span>

              <button
                onClick={() =>
                  qty < product.stock && setQty(qty + 1)
                }
                style={qtyBtnStyle}
              >
                +
              </button>
            </div>
          )}

          {/* ADD TO CART */}
          {isActive && !outOfStock && (
            <button
              onClick={
                inCart
                  ? () => (window.location.href = "/cart")
                  : addToCart
              }
              style={{
                marginTop: "30px",
                padding: "15px 40px",
                fontSize: "16px",
                fontWeight: "bold",
                borderRadius: "12px",
                border: "none",
                background: "linear-gradient(45deg,#111,#333)",
                color: "#fff",
                cursor: "pointer",
                transition: "0.3s",
              }}
            >
              {inCart ? "View Cart 🛒" : "Add To Cart 🛍️"}
            </button>
          )}

          {/* TABS */}
          <div style={{ marginTop: "50px" }}>
            <div style={{ display: "flex", gap: "30px" }}>
              <span
                onClick={() => setActiveTab("description")}
                style={tabStyle(activeTab === "description")}
              >
                Description
              </span>
              <span
                onClick={() => setActiveTab("specs")}
                style={tabStyle(activeTab === "specs")}
              >
                Specifications
              </span>
            </div>

            <div style={{ marginTop: "25px" }}>
              {activeTab === "description" && (
                <p style={{ lineHeight: "1.8", color: "#555" }}>
                  {product.description}
                </p>
              )}

              {activeTab === "specs" && (
                <table style={{ width: "100%" }}>
                  <tbody>
                    {product.specifications &&
                      Object.entries(product.specifications).map(
                        ([key, value], index) => (
                          <tr key={index}>
                            <td
                              style={{
                                padding: "10px",
                                fontWeight: "bold",
                                width: "40%",
                                background: "#f5f5f5",
                              }}
                            >
                              {key}
                            </td>
                            <td style={{ padding: "10px" }}>{value}</td>
                          </tr>
                        )
                      )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const qtyBtnStyle = {
  width: "42px",
  height: "42px",
  borderRadius: "10px",
  border: "1px solid #e0e0e0",
  background: "linear-gradient(145deg, #ffffff, #f3f3f3)",
  cursor: "pointer",
  fontSize: "20px",
  fontWeight: "600",
  color: "#333",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.2s ease-in-out",
  boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
};

const tabStyle = (active) => ({
  cursor: "pointer",
  fontWeight: active ? "bold" : "normal",
  borderBottom: active ? "2px solid #000" : "none",
  paddingBottom: "5px",
});

export default ProductDetail;
