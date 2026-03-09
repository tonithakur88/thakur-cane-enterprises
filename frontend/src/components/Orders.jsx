import React, { useEffect, useState } from "react";
import API from "../api";

const statusSteps = [
  "Placed",
  "Shipped",
  "Arrived at Hub",
  "Out for Delivery",
  "Delivered",
];

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");

      const { data } = await API.get(
        "/api/orders/my-orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(data);
    };

    fetchOrders();
  }, []);

  const getStepIndex = (status) => statusSteps.indexOf(status);

  return (
    <div
      style={{
        padding: "70px 8%",
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 20% 20%, #1e293b, #0f172a 40%, #020617)",
        color: "#fff",
        fontFamily: "sans-serif",
      }}
    >
      <h2
        style={{
          fontSize: "34px",
          marginBottom: "50px",
          fontWeight: "700",
          letterSpacing: "1px",
          background: "linear-gradient(90deg,#00f5a0,#00d9f5)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        🚚 My Orders
      </h2>

      {orders.map((order) =>
        order.items.map((item, index) => {
          const currentStep = getStepIndex(order.status);
          const progressPercent =
            (currentStep / (statusSteps.length - 1)) * 100;

          const isCancelled = order.status === "Cancelled";
          const isDelivered = order.status === "Delivered";

          const progressColor = isCancelled
            ? "linear-gradient(90deg,#ff4d4f,#ff0000)"
            : isDelivered
              ? "linear-gradient(90deg,#00c853,#00ff95)"
              : "linear-gradient(90deg,#00f5a0,#00d9f5)";

          return (
            <div
              key={`${order._id}-${index}`}
              style={{
                position: "relative",
                backdropFilter: "blur(18px)",
                background:
                  "linear-gradient(145deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))",
                border: "1px solid rgba(255,255,255,0.08)",
                padding: "30px",
                marginBottom: "40px",
                borderRadius: "22px",
                boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
                transition: "all 0.4s ease",
                overflow: "hidden",
              }}
            >
              {/* Animated Top Shine */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  height: "3px",
                  width: "100%",
                  background: progressColor,
                  animation: "shineMove 3s linear infinite",
                }}
              />

              {/* Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  marginBottom: "20px",
                  fontSize: "13px",
                  opacity: 0.7,
                }}
              >
                <span>Order ID: {order._id}</span>
                <span>
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Product Section */}
              <div
                style={{
                  display: "flex",
                  gap: "25px",
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <img
                  src={item.image}
                  alt=""
                  style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "cover",
                    borderRadius: "18px",
                    transition: "0.4s",
                  }}
                />

                <div style={{ flex: 1 }}>
                  <h4 style={{ marginBottom: "10px" }}>
                    {item.name}
                  </h4>

                  <p style={{ opacity: 0.7 }}>
                    Quantity: {item.quantity}
                  </p>

                  <p
                    style={{
                      marginTop: "6px",
                      fontWeight: "600",
                    }}
                  >
                    ₹ {item.price * item.quantity}
                  </p>

                  {/* Status Badge */}
                  <span
                    style={{
                      display: "inline-block",
                      marginTop: "12px",
                      padding: "8px 18px",
                      borderRadius: "30px",
                      fontSize: "12px",
                      fontWeight: "600",
                      background: isCancelled
                        ? "#ff4d4f"
                        : isDelivered
                          ? "#00c853"
                          : "#00d9f5",
                      color: "#000",
                      boxShadow: `0 0 15px ${isCancelled
                          ? "#ff0000"
                          : isDelivered
                            ? "#00ff95"
                            : "#00f5a0"
                        }`,
                    }}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Address */}
              {order.shippingAddress && (
                <div
                  style={{
                    marginTop: "25px",
                    padding: "18px",
                    borderRadius: "14px",
                    background:
                      "rgba(255,255,255,0.05)",
                    fontSize: "13px",
                    lineHeight: "1.6",
                    opacity: 0.85,
                  }}
                >
                  <strong>Delivery Address</strong>
                  <p>{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.phone}</p>
                  <p>
                    {order.shippingAddress.address},{" "}
                    {order.shippingAddress.city},{" "}
                    {order.shippingAddress.state} -{" "}
                    {order.shippingAddress.pincode}
                  </p>
                </div>
              )}

              {/* Animated Progress */}
              <div style={{ marginTop: "30px" }}>
                <div
                  style={{
                    height: "8px",
                    width: "100%",
                    background:
                      "rgba(255,255,255,0.1)",
                    borderRadius: "20px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${isCancelled || isDelivered ? 100 : progressPercent}%`,
                      background: progressColor,
                      transition:
                        "width 0.6s ease-in-out",
                      boxShadow:
                        "0 0 20px rgba(0,255,200,0.7)",
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    marginTop: "10px",
                    fontSize: "12px",
                    opacity: 0.7,
                  }}
                >
                  {statusSteps.map((step, i) => (
                    <span
                      key={step}
                      style={{
                        color:
                          i <= currentStep
                            ? "#00f5a0"
                            : "#777",
                        fontWeight:
                          i === currentStep
                            ? "600"
                            : "400",
                      }}
                    >
                      {step}
                    </span>
                  ))}
                </div>
              </div>

              {/* Buttons (Logic untouched) */}
              <div
                style={{
                  marginTop: "25px",
                  display: "flex",
                  gap: "15px",
                  flexWrap: "wrap",
                }}
              >
                {(order.status === "Placed" ||
                  order.status === "Shipped") && (
                    <button
                      onClick={async () => {
                        try {
                          const token =
                            localStorage.getItem(
                              "token"
                            );

                          const res = await fetch(
                            `/api/orders/cancel/${order._id}`,
                            {
                              method: "PUT",
                              headers: {
                                "Content-Type":
                                  "application/json",
                                Authorization: `Bearer ${token}`,
                              },
                            }
                          );

                          const data =
                            await res.json();

                          if (!res.ok) {
                            alert(data.message);
                            return;
                          }

                          alert("Order Cancelled");
                          window.location.reload();
                        } catch (err) {
                          alert(
                            "Something went wrong"
                          );
                        }
                      }}
                      style={{
                        padding: "10px 20px",
                        borderRadius: "8px",
                        border: "none",
                        cursor: "pointer",
                        background:
                          "linear-gradient(90deg,#ff4d4f,#ff0000)",
                        color: "#fff",
                        fontSize: "13px",
                        boxShadow:
                          "0 0 15px rgba(255,0,0,0.6)",
                      }}
                    >
                      Cancel Order
                    </button>
                  )}

                {order.status === "Delivered" && (
                  <button
                    onClick={() => {
                      const token =
                        localStorage.getItem(
                          "token"
                        );

                      window.open(
                        `/orders/invoice/${order._id}?token=${token}`,
                        "_blank"
                      );
                    }}
                    style={{
                      padding: "10px 20px",
                      borderRadius: "8px",
                      border: "none",
                      cursor: "pointer",
                      background:
                        "linear-gradient(90deg,#007bff,#00d4ff)",
                      color: "#fff",
                      fontSize: "13px",
                      boxShadow:
                        "0 0 15px rgba(0,150,255,0.6)",
                    }}
                  >
                    Download Invoice
                  </button>
                )}
              </div>
            </div>
          );
        })
      )}

      <style>
        {`
        @keyframes shineMove {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}
      </style>
    </div>
  );
};

export default Orders;

