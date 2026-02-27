// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const MyOrders = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/orders");
//         setOrders(res.data);
//       } catch (error) {
//         console.log(error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, []);

//   if (loading) return <h2 style={{ padding: "20px" }}>Loading...</h2>;

//   if (orders.length === 0)
//     return <h2 style={{ padding: "20px" }}>No Orders Yet</h2>;

//   return (
//     <div style={{ padding: "30px" }}>
//       <h2 style={{ marginBottom: "20px" }}>My Orders</h2>

//       {orders.map((order) => (
//         <div
//           key={order._id}
//           style={{
//             border: "1px solid #ddd",
//             padding: "20px",
//             marginBottom: "20px",
//             borderRadius: "8px",
//           }}
//         >
//           <p><strong>Total:</strong> ₹ {order.totalAmount}</p>
//           <p><strong>Status:</strong> {order.status}</p>

//           {order.items && order.items.map((item, index) => (
//             <div
//               key={index}
//               style={{
//                 display: "flex",
//                 gap: "15px",
//                 marginBottom: "10px",
//                 alignItems: "center",
//               }}
//             >
//               <img src={item.image} alt="" width="70" />
//               <div>
//                 <p>{item.name}</p>
//                 <p>Qty: {item.quantity}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default MyOrders;
