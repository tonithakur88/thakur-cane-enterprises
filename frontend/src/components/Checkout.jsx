import React, { useEffect, useState } from "react";
import API from "../api";

const Checkout = () => {
  const [cart, setCart] = useState({ items: [] });
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCart();
    fetchAddresses();
  }, []);

  const fetchCart = async () => {
    const { data } = await API.get(
      "/cart",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setCart(data);
  };

  const fetchAddresses = async () => {
    const { data } = await API.get(
      "/auth/my-addresses",
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setAddresses(data);

    // Default select first address
    if (data.length > 0) {
      setSelectedAddress(data[0]);
    }
  };

  const totalAmount = cart.items.reduce(
    (acc, item) => acc + item.product.price * item.qty,
    0
  );

  const loadRazorpay = () =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      document.body.appendChild(script);
    });

  const payNow = async () => {
    if (!selectedAddress) {
      alert("Please select a delivery address");
      return;
    }

    await loadRazorpay();

    const { data } = await API.post(
      "/orders/create-order",
      { amount: totalAmount },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const options = {
      key: data.key,
      amount: data.amount,
      currency: data.currency,
      order_id: data.id,
      handler: async function (response) {
        await API.post(
          "/orders/verify",
          {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            items: cart.items.map((item) => ({
              name: item.product.name,
              price: item.product.price,
              qty: item.qty,
              productId: item.product._id,
            })),
            address: selectedAddress, // ✅ Only selected address
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        await API.delete(
          "/cart/clear",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        alert("Order Placed Successfully 🎉");
        window.location.href = "/orders";
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#f8fafc,#e9f1f7)",
        padding: "60px 8%",
      }}
    >
      {/* 🔥 PREMIUM PROGRESS TRACKER */}
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto 50px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative",
        }}
      >
        {["Cart", "Address", "Payment", "Success"].map(
          (step, index) => {
            const activeIndex = 1; // Checkout page = Address step
            const isActive = index <= activeIndex;

            return (
              <div
                key={step}
                style={{
                  textAlign: "center",
                  flex: 1,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    margin: "0 auto",
                    borderRadius: "50%",
                    background: isActive
                      ? "linear-gradient(90deg,#111,#2e7d32)"
                      : "#e0e0e0",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    transition: "0.3s",
                    boxShadow: isActive
                      ? "0 8px 20px rgba(0,0,0,0.2)"
                      : "none",
                  }}
                >
                  {index + 1}
                </div>

                <p
                  style={{
                    marginTop: "8px",
                    fontSize: "14px",
                    color: isActive ? "#111" : "#888",
                  }}
                >
                  {step}
                </p>

                {index !== 3 && (
                  <div
                    style={{
                      position: "absolute",
                      top: "20px",
                      right: "-50%",
                      width: "100%",
                      height: "3px",
                      background:
                        index < activeIndex
                          ? "#2e7d32"
                          : "#e0e0e0",
                      zIndex: -1,
                    }}
                  />
                )}
              </div>
            );
          }
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "40px",
          maxWidth: "1200px",
          margin: "auto",
        }}
      >
        {/* LEFT SECTION */}
        <div>
          <h2 style={{ marginBottom: "30px" }}>
            Secure Checkout 🔒
          </h2>

          <div
            style={{
              background: "#fff",
              padding: "30px",
              borderRadius: "16px",
              boxShadow: "0 15px 40px rgba(0,0,0,0.06)",
            }}
          >
            <h3 style={{ marginBottom: "20px" }}>
              Select Delivery Address
            </h3>

            {addresses.length === 0 && (
              <p style={{ color: "#888" }}>
                No saved address found. Please add address
                from Profile → Manage Addresses
              </p>
            )}

            {addresses.map((addr) => {
              const active =
                selectedAddress?._id === addr._id;

              return (
                <div
                  key={addr._id}
                  onClick={() => setSelectedAddress(addr)}
                  style={{
                    border: active
                      ? "2px solid #2e7d32"
                      : "1px solid #e0e0e0",
                    padding: "18px",
                    marginBottom: "15px",
                    borderRadius: "12px",
                    cursor: "pointer",
                    background: active
                      ? "#f1fdf4"
                      : "#fff",
                    transition: "0.3s",
                  }}
                >
                  <input
                    type="radio"
                    checked={active}
                    readOnly
                    style={{ marginRight: "10px" }}
                  />

                  <strong>{addr.fullName}</strong>

                  <p style={{ margin: "5px 0" }}>
                    {addr.addressLine}, {addr.city},{" "}
                    {addr.state} - {addr.pincode}
                  </p>

                  <p style={{ fontSize: "14px", color: "#666" }}>
                    📞 {addr.phone}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT SECTION – SUMMARY */}
        <div>
          <div
            style={{
              background: "#fff",
              padding: "30px",
              borderRadius: "16px",
              boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
              position: "sticky",
              top: "40px",
            }}
          >
            <h3 style={{ marginBottom: "20px" }}>
              Order Summary
            </h3>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
                color: "#555",
              }}
            >
              <span>Subtotal</span>
              <span>₹ {totalAmount}</span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "20px",
                color: "#555",
              }}
            >
              <span>Shipping</span>
              <span style={{ color: "#2e7d32" }}>
                Free
              </span>
            </div>

            <hr style={{ marginBottom: "20px" }} />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "18px",
                fontWeight: "bold",
                marginBottom: "15px",
              }}
            >
              <span>Total</span>
              <span>₹ {totalAmount}</span>
            </div>

            {/* 🚚 DELIVERY ESTIMATE */}
            <div
              style={{
                marginBottom: "25px",
                padding: "12px",
                borderRadius: "8px",
                background: "#f1fdf4",
                fontSize: "14px",
                color: "#2e7d32",
              }}
            >
              Estimated Delivery:
              <strong>
                {" "}
                {new Date(
                  Date.now() + 4 * 24 * 60 * 60 * 1000
                ).toDateString()}
              </strong>
            </div>

            <button
              onClick={payNow}
              style={{
                width: "100%",
                padding: "16px",
                background:
                  "linear-gradient(90deg,#111,#2e7d32)",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "0.3s",
              }}
            >
              Pay Securely →
            </button>

            <p
              style={{
                marginTop: "15px",
                fontSize: "13px",
                color: "#777",
                textAlign: "center",
              }}
            >
              🔒 100% Secure Payment Powered by Razorpay
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;