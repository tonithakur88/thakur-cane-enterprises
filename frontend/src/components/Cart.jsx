<<<<<<< HEAD
import React, { useEffect, useState, useCallback } from "react";
import API from "../api";

const Cart = () => {
  const [cart, setCart] = useState({ items: [] });
  const [token, setToken] = useState(null);

  // ================= TOKEN =================
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      window.location.href = "/login";
    } else {
      setToken(storedToken);
    }
  }, []);

  // ================= FETCH CART =================
  const fetchCart = useCallback(async () => {
    if (!token) return;

    try {
      const { data } = await API.get(
        "/api/cart",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(data);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      } else {
        console.error(error);
      }
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchCart();
    }
  }, [fetchCart, token]);

  // ================= UPDATE QTY =================
  const updateQty = async (productId, qty) => {
    try {
      if (qty < 0) return; // allow 0

      await API.put(
        "/api/cart/update",
        { productId, qty },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchCart();
    } catch (error) {
      console.error(error);
    }
  };

  const totalAmount = cart.items.reduce(
    (acc, item) => acc + (item.product?.price || 0) * item.qty,
    0
  );

  // ================= RAZORPAY =================
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const payNow = async () => {
    window.location.href = "/checkout"; // ✅ Now address handled there
  };

  if (!cart.items.length) {
    return (
      <div style={emptyStyle}>
        <h2>Your Cart Feels Lonely 🛒</h2>
        <p>Add something amazing to make it happy.</p>
      </div>
    );
  }

  return (
    <div style={container}>
      <h2 style={{ marginBottom: "30px" }}>Your Smart Cart</h2>

      <div style={layout}>
        {/* LEFT SIDE – ITEMS */}
        <div style={{ flex: 2 }}>
          {cart.items
            .filter((item) => item.product)
            .map((item) => (
              <div key={item.product._id} style={card}>
                <div style={imageWrapper}>
                  <img
                    src={
                      item.product.images?.length > 0
                        ? item.product.images[0]
                        : item.product.image
                    }
                    alt={item.product.name}
                    style={imageStyle}
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <h3 style={{ marginBottom: "5px" }}>
                    {item.product.name}
                  </h3>

                  <p style={{ color: "#666" }}>
                    ₹ {item.product.price}
                  </p>

                  <div style={qtyBox}>
                    <button
                      style={qtyBtn}
                      onClick={() =>
                        updateQty(item.product._id, item.qty - 1)
                      }
                    >
                      −
                    </button>

                    <span style={{ padding: "0 15px" }}>
                      {item.qty}
                    </span>

                    <button
                      style={qtyBtn}
                      onClick={() =>
                        updateQty(item.product._id, item.qty + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                </div>

                <div style={priceTag}>
                  ₹ {item.product.price * item.qty}
                </div>
              </div>
            ))}
        </div>

        {/* RIGHT SIDE – SUMMARY */}
        <div style={summaryCard}>
          <h3>Cart Summary</h3>

          <div style={summaryRow}>
            <span>Items</span>
            <span>{cart.items.length}</span>
          </div>

          <div style={summaryRow}>
            <span>Total</span>
            <strong>₹ {totalAmount}</strong>
          </div>

          <button style={checkoutBtn} onClick={payNow}>
            Continue to Checkout →
          </button>

          <p style={{ fontSize: "12px", color: "#777", marginTop: "10px" }}>
            Secure checkout powered by Razorpay
          </p>
        </div>
      </div>
    </div>
  );
};

/* ================= STYLES ================= */

const container = {
  padding: "40px 8%",
  background: "linear-gradient(135deg,#f5f7fa,#e4ecf5)",
  minHeight: "100vh",
};

const layout = {
  display: "flex",
  gap: "40px",
};

const card = {
  display: "flex",
  alignItems: "center",
  background: "#fff",
  padding: "20px",
  borderRadius: "15px",
  marginBottom: "20px",
  boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
  transition: "0.3s",
};

const imageWrapper = {
  width: "100px",
  height: "100px",
  marginRight: "20px",
  borderRadius: "15px",
  overflow: "hidden",
};

const imageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const qtyBox = {
  display: "flex",
  alignItems: "center",
  marginTop: "10px",
  background: "#f1f3f6",
  borderRadius: "30px",
  padding: "5px 10px",
  width: "fit-content",
};

const qtyBtn = {
  border: "none",
  background: "#111",
  color: "#fff",
  width: "28px",
  height: "28px",
  borderRadius: "50%",
  cursor: "pointer",
};

const priceTag = {
  fontWeight: "bold",
  fontSize: "18px",
  color: "#2e7d32",
};

const summaryCard = {
  flex: 1,
  background: "#fff",
  padding: "25px",
  borderRadius: "15px",
  height: "fit-content",
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
};

const summaryRow = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "10px",
};

const checkoutBtn = {
  width: "100%",
  padding: "14px",
  background: "linear-gradient(90deg,#111,#2e7d32)",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  marginTop: "20px",
  fontWeight: "bold",
};

const emptyStyle = {
  padding: "100px",
  textAlign: "center",
  fontSize: "20px",
};

=======
import React, { useEffect, useState, useCallback } from "react";
import API from "../api";

const Cart = () => {
  const [cart, setCart] = useState({ items: [] });
  const [token, setToken] = useState(null);

  // ================= TOKEN =================
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      window.location.href = "/login";
    } else {
      setToken(storedToken);
    }
  }, []);

  // ================= FETCH CART =================
  const fetchCart = useCallback(async () => {
    if (!token) return;

    try {
      const { data } = await API.get(
        "/api/cart",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(data);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      } else {
        console.error(error);
      }
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchCart();
    }
  }, [fetchCart, token]);

  // ================= UPDATE QTY =================
  const updateQty = async (productId, qty) => {
    try {
      if (qty < 0) return; // allow 0

      await API.put(
        "/api/cart/update",
        { productId, qty },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchCart();
    } catch (error) {
      console.error(error);
    }
  };

  const totalAmount = cart.items.reduce(
    (acc, item) => acc + (item.product?.price || 0) * item.qty,
    0
  );

  // ================= RAZORPAY =================
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const payNow = async () => {
    window.location.href = "/checkout"; // ✅ Now address handled there
  };

  if (!cart.items.length) {
    return (
      <div style={emptyStyle}>
        <h2>Your Cart Feels Lonely 🛒</h2>
        <p>Add something amazing to make it happy.</p>
      </div>
    );
  }

  return (
    <div style={container}>
      <h2 style={{ marginBottom: "30px" }}>Your Smart Cart</h2>

      <div style={layout}>
        {/* LEFT SIDE – ITEMS */}
        <div style={{ flex: 2 }}>
          {cart.items
            .filter((item) => item.product)
            .map((item) => (
              <div key={item.product._id} style={card}>
                <div style={imageWrapper}>
                  <img
                    src={
                      item.product.images?.length > 0
                        ? item.product.images[0]
                        : item.product.image
                    }
                    alt={item.product.name}
                    style={imageStyle}
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <h3 style={{ marginBottom: "5px" }}>
                    {item.product.name}
                  </h3>

                  <p style={{ color: "#666" }}>
                    ₹ {item.product.price}
                  </p>

                  <div style={qtyBox}>
                    <button
                      style={qtyBtn}
                      onClick={() =>
                        updateQty(item.product._id, item.qty - 1)
                      }
                    >
                      −
                    </button>

                    <span style={{ padding: "0 15px" }}>
                      {item.qty}
                    </span>

                    <button
                      style={qtyBtn}
                      onClick={() =>
                        updateQty(item.product._id, item.qty + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                </div>

                <div style={priceTag}>
                  ₹ {item.product.price * item.qty}
                </div>
              </div>
            ))}
        </div>

        {/* RIGHT SIDE – SUMMARY */}
        <div style={summaryCard}>
          <h3>Cart Summary</h3>

          <div style={summaryRow}>
            <span>Items</span>
            <span>{cart.items.length}</span>
          </div>

          <div style={summaryRow}>
            <span>Total</span>
            <strong>₹ {totalAmount}</strong>
          </div>

          <button style={checkoutBtn} onClick={payNow}>
            Continue to Checkout →
          </button>

          <p style={{ fontSize: "12px", color: "#777", marginTop: "10px" }}>
            Secure checkout powered by Razorpay
          </p>
        </div>
      </div>
    </div>
  );
};

/* ================= STYLES ================= */

const container = {
  padding: "40px 8%",
  background: "linear-gradient(135deg,#f5f7fa,#e4ecf5)",
  minHeight: "100vh",
};

const layout = {
  display: "flex",
  gap: "40px",
};

const card = {
  display: "flex",
  alignItems: "center",
  background: "#fff",
  padding: "20px",
  borderRadius: "15px",
  marginBottom: "20px",
  boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
  transition: "0.3s",
};

const imageWrapper = {
  width: "100px",
  height: "100px",
  marginRight: "20px",
  borderRadius: "15px",
  overflow: "hidden",
};

const imageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const qtyBox = {
  display: "flex",
  alignItems: "center",
  marginTop: "10px",
  background: "#f1f3f6",
  borderRadius: "30px",
  padding: "5px 10px",
  width: "fit-content",
};

const qtyBtn = {
  border: "none",
  background: "#111",
  color: "#fff",
  width: "28px",
  height: "28px",
  borderRadius: "50%",
  cursor: "pointer",
};

const priceTag = {
  fontWeight: "bold",
  fontSize: "18px",
  color: "#2e7d32",
};

const summaryCard = {
  flex: 1,
  background: "#fff",
  padding: "25px",
  borderRadius: "15px",
  height: "fit-content",
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
};

const summaryRow = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "10px",
};

const checkoutBtn = {
  width: "100%",
  padding: "14px",
  background: "linear-gradient(90deg,#111,#2e7d32)",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  marginTop: "20px",
  fontWeight: "bold",
};

const emptyStyle = {
  padding: "100px",
  textAlign: "center",
  fontSize: "20px",
};

>>>>>>> 00f8281ee8d9b73c8ba973b193294f36d4283ebb
export default Cart;