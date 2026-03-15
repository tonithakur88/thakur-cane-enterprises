import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Products from "./components/Products";
import ProductDetail from "./components/ProductDetail";
import Cart from "./components/Cart";
import Orders from "./components/Orders";
import Login from "./components/Login";
import Signup from "./components/Signup";
import VerifyOTP from "./components/VerifyOTP";
import Profile from "./components/Profile";
import Admin from "./components/Admin";
import AdminLogin from "./components/AdminLogin";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import AdminOrders from "./components/AdminOrders";
import Checkout from "./components/Checkout";
<<<<<<< HEAD
import ForgotPassword from "./components/ForgotPassword"
=======
>>>>>>> 00f8281ee8d9b73c8ba973b193294f36d4283ebb


function Layout() {
  const location = useLocation();

  const hideNavbar = location.pathname.startsWith("/admin");

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* USER ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
<<<<<<< HEAD
        <Route path="/forgot-password" element={<ForgotPassword />} />
=======
>>>>>>> 00f8281ee8d9b73c8ba973b193294f36d4283ebb
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/checkout" element={<Checkout />} />


        {/* ADMIN LOGIN */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* ADMIN DASHBOARD */}
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <Admin />
            </AdminProtectedRoute>
          }
        />

        {/* ADMIN ORDERS */}
        <Route
          path="/admin/orders"
          element={
            <AdminProtectedRoute>
              <AdminOrders />
            </AdminProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
