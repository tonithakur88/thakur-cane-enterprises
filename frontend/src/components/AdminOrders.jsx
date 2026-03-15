<<<<<<< HEAD
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";


const AdminOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const token = localStorage.getItem("adminToken");

    const res = await API.get(
      "/api/orders",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setOrders(res.data);
  };


  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    const token = localStorage.getItem("adminToken");

    await API.put(
      `/api/orders/${id}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchOrders();
  };

  const statusColor = (status) => {
    if (status === "Delivered") return "#28a745";
    if (status === "Out for Delivery") return "#17a2b8";
    if (status === "Arrived at Hub") return "#6f42c1";
    if (status === "Shipped") return "#ff9800";
    return "#007bff";
  };

  const statusFlow = [
    "Placed",
    "Shipped",
    "Arrived at Hub",
    "Out for Delivery",
    "Delivered",
  ];

  return (
    <div
      style={{
        padding: "60px 8%",
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left,#1e293b,#0f172a)",
        color: "#fff",
      }}
    >
      <button
        onClick={() => navigate("/admin")}
        style={{
          marginBottom: "30px",
          padding: "10px 20px",
          background: "#111",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        ← Back to Dashboard
      </button>

      <h2
        style={{
          marginBottom: "50px",
          fontSize: "32px",
          fontWeight: "700",
        }}
      >
        🚀 Admin Order Control Center
      </h2>

      {orders.map((order) =>
        order.items.map((item, index) => {
          const isCancelled =
            order.status === "Cancelled";

          const isDelivered =
            order.status === "Delivered";

          const currentStepIndex =
            statusFlow.indexOf(order.status);

          let progressWidth = 0;

          if (isCancelled || isDelivered) {
            progressWidth = 100;
          } else if (currentStepIndex >= 0) {
            progressWidth =
              ((currentStepIndex + 1) /
                statusFlow.length) *
              100;
          }

          return (
            <div
              key={order._id + index}
              style={{
                backdropFilter: "blur(18px)",
                background:
                  "linear-gradient(145deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))",
                border:
                  "1px solid rgba(255,255,255,0.08)",
                padding: "35px",
                borderRadius: "22px",
                marginBottom: "45px",
                display: "flex",
                gap: "35px",
                alignItems: "center",
                boxShadow:
                  "0 20px 60px rgba(0,0,0,0.5)",
                transition: "all 0.35s ease",
              }}
            >
              {/* PRODUCT IMAGE */}
              <img
                src={item.image}
                alt=""
                style={{
                  width: "140px",
                  height: "140px",
                  objectFit: "cover",
                  borderRadius: "20px",
                }}
              />

              {/* CENTER INFO */}
              <div style={{ flex: 1 }}>
                <h3>{item.name}</h3>
                <p>Qty: {item.quantity}</p>
                <p>
                  ₹ {item.price * item.quantity}
                </p>

                {/* 🔥 PROGRESS BAR */}
                <div style={{ marginTop: "25px" }}>
                  <div
                    style={{
                      height: "6px",
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
                        width: `${progressWidth}%`,
                        background: isCancelled
                          ? "linear-gradient(90deg,#ff4d4f,#ff0000)"
                          : isDelivered
                            ? "linear-gradient(90deg,#00c853,#00ff95)"
                            : "linear-gradient(90deg,#00f5a0,#00d9f5)",
                        transition:
                          "width 0.6s ease",
                        boxShadow: isCancelled
                          ? "0 0 20px rgba(255,0,0,0.8)"
                          : isDelivered
                            ? "0 0 20px rgba(0,255,120,0.8)"
                            : "0 0 20px rgba(0,255,200,0.7)",
                      }}
                    />
                  </div>

                  {/* STATUS LABELS */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      marginTop: "8px",
                      fontSize: "11px",
                      opacity: 0.7,
                    }}
                  >
                    {isCancelled ? (
                      <>
                        <span>Placed</span>
                        <span
                          style={{
                            color: "#ff6b6b",
                            fontWeight: "600",
                          }}
                        >
                          Cancelled
                        </span>
                      </>
                    ) : (
                      statusFlow.map((step) => (
                        <span key={step}>
                          {step}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE */}
              <div style={{ minWidth: "280px" }}>
                <div
                  style={{
                    padding: "8px 18px",
                    borderRadius: "30px",
                    background:
                      statusColor(order.status),
                    display: "inline-block",
                    marginBottom: "15px",
                  }}
                >
                  {order.status}
                </div>

                <div
                  style={{
                    fontSize: "13px",
                    opacity: 0.8,
                    lineHeight: "1.6",
                  }}
                >
                  <strong>
                    Delivery Address
                  </strong>
                  <p>
                    {order.address?.fullName}
                  </p>
                  <p>
                    {order.address?.phone}
                  </p>
                  <p>
                    {
                      order.address
                        ?.addressLine
                    }
                    ,{" "}
                    {order.address?.city}
                  </p>
                  <p>
                    {order.address?.state} -{" "}
                    {
                      order.address
                        ?.pincode
                    }
                  </p>
                </div>

                {/* STATUS BUTTONS */}
                {order.status !==
                  "Cancelled" &&
                  order.status !==
                  "Delivered" && (
                    <div
                      style={{
                        marginTop: "15px",
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "8px",
                      }}
                    >
                      {statusFlow.map(
                        (step) => (
                          <button
                            key={step}
                            onClick={() =>
                              updateStatus(
                                order._id,
                                step
                              )
                            }
                            disabled={
                              order.status ===
                              step
                            }
                            style={{
                              padding:
                                "6px 10px",
                              background:
                                order.status ===
                                  step
                                  ? "#555"
                                  : "#111",
                              color: "#fff",
                              border: "none",
                              borderRadius:
                                "6px",
                              cursor:
                                order.status ===
                                  step
                                  ? "not-allowed"
                                  : "pointer",
                              fontSize: "12px",
                            }}
                          >
                            {step}
                          </button>
                        )
                      )}
                    </div>
                  )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );

};

export default AdminOrders;
=======
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";


const AdminOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const token = localStorage.getItem("adminToken");

    const res = await API.get(
      "/api/orders",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setOrders(res.data);
  };


  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    const token = localStorage.getItem("adminToken");

    await API.put(
      `/api/orders/${id}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchOrders();
  };

  const statusColor = (status) => {
    if (status === "Delivered") return "#28a745";
    if (status === "Out for Delivery") return "#17a2b8";
    if (status === "Arrived at Hub") return "#6f42c1";
    if (status === "Shipped") return "#ff9800";
    return "#007bff";
  };

  const statusFlow = [
    "Placed",
    "Shipped",
    "Arrived at Hub",
    "Out for Delivery",
    "Delivered",
  ];

  return (
    <div
      style={{
        padding: "60px 8%",
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left,#1e293b,#0f172a)",
        color: "#fff",
      }}
    >
      <button
        onClick={() => navigate("/admin")}
        style={{
          marginBottom: "30px",
          padding: "10px 20px",
          background: "#111",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        ← Back to Dashboard
      </button>

      <h2
        style={{
          marginBottom: "50px",
          fontSize: "32px",
          fontWeight: "700",
        }}
      >
        🚀 Admin Order Control Center
      </h2>

      {orders.map((order) =>
        order.items.map((item, index) => {
          const isCancelled =
            order.status === "Cancelled";

          const isDelivered =
            order.status === "Delivered";

          const currentStepIndex =
            statusFlow.indexOf(order.status);

          let progressWidth = 0;

          if (isCancelled || isDelivered) {
            progressWidth = 100;
          } else if (currentStepIndex >= 0) {
            progressWidth =
              ((currentStepIndex + 1) /
                statusFlow.length) *
              100;
          }

          return (
            <div
              key={order._id + index}
              style={{
                backdropFilter: "blur(18px)",
                background:
                  "linear-gradient(145deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))",
                border:
                  "1px solid rgba(255,255,255,0.08)",
                padding: "35px",
                borderRadius: "22px",
                marginBottom: "45px",
                display: "flex",
                gap: "35px",
                alignItems: "center",
                boxShadow:
                  "0 20px 60px rgba(0,0,0,0.5)",
                transition: "all 0.35s ease",
              }}
            >
              {/* PRODUCT IMAGE */}
              <img
                src={item.image}
                alt=""
                style={{
                  width: "140px",
                  height: "140px",
                  objectFit: "cover",
                  borderRadius: "20px",
                }}
              />

              {/* CENTER INFO */}
              <div style={{ flex: 1 }}>
                <h3>{item.name}</h3>
                <p>Qty: {item.quantity}</p>
                <p>
                  ₹ {item.price * item.quantity}
                </p>

                {/* 🔥 PROGRESS BAR */}
                <div style={{ marginTop: "25px" }}>
                  <div
                    style={{
                      height: "6px",
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
                        width: `${progressWidth}%`,
                        background: isCancelled
                          ? "linear-gradient(90deg,#ff4d4f,#ff0000)"
                          : isDelivered
                            ? "linear-gradient(90deg,#00c853,#00ff95)"
                            : "linear-gradient(90deg,#00f5a0,#00d9f5)",
                        transition:
                          "width 0.6s ease",
                        boxShadow: isCancelled
                          ? "0 0 20px rgba(255,0,0,0.8)"
                          : isDelivered
                            ? "0 0 20px rgba(0,255,120,0.8)"
                            : "0 0 20px rgba(0,255,200,0.7)",
                      }}
                    />
                  </div>

                  {/* STATUS LABELS */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      marginTop: "8px",
                      fontSize: "11px",
                      opacity: 0.7,
                    }}
                  >
                    {isCancelled ? (
                      <>
                        <span>Placed</span>
                        <span
                          style={{
                            color: "#ff6b6b",
                            fontWeight: "600",
                          }}
                        >
                          Cancelled
                        </span>
                      </>
                    ) : (
                      statusFlow.map((step) => (
                        <span key={step}>
                          {step}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE */}
              <div style={{ minWidth: "280px" }}>
                <div
                  style={{
                    padding: "8px 18px",
                    borderRadius: "30px",
                    background:
                      statusColor(order.status),
                    display: "inline-block",
                    marginBottom: "15px",
                  }}
                >
                  {order.status}
                </div>

                <div
                  style={{
                    fontSize: "13px",
                    opacity: 0.8,
                    lineHeight: "1.6",
                  }}
                >
                  <strong>
                    Delivery Address
                  </strong>
                  <p>
                    {order.address?.fullName}
                  </p>
                  <p>
                    {order.address?.phone}
                  </p>
                  <p>
                    {
                      order.address
                        ?.addressLine
                    }
                    ,{" "}
                    {order.address?.city}
                  </p>
                  <p>
                    {order.address?.state} -{" "}
                    {
                      order.address
                        ?.pincode
                    }
                  </p>
                </div>

                {/* STATUS BUTTONS */}
                {order.status !==
                  "Cancelled" &&
                  order.status !==
                  "Delivered" && (
                    <div
                      style={{
                        marginTop: "15px",
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "8px",
                      }}
                    >
                      {statusFlow.map(
                        (step) => (
                          <button
                            key={step}
                            onClick={() =>
                              updateStatus(
                                order._id,
                                step
                              )
                            }
                            disabled={
                              order.status ===
                              step
                            }
                            style={{
                              padding:
                                "6px 10px",
                              background:
                                order.status ===
                                  step
                                  ? "#555"
                                  : "#111",
                              color: "#fff",
                              border: "none",
                              borderRadius:
                                "6px",
                              cursor:
                                order.status ===
                                  step
                                  ? "not-allowed"
                                  : "pointer",
                              fontSize: "12px",
                            }}
                          >
                            {step}
                          </button>
                        )
                      )}
                    </div>
                  )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );

};

export default AdminOrders;
>>>>>>> 00f8281ee8d9b73c8ba973b193294f36d4283ebb
