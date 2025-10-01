import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/seller/Dashboard";
import ManageProduct from "./pages/seller/ManageProduct";
import Order from "./pages/seller/Order";
import ShopPage from "./pages/seller/ShopPage";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Main Homepage */}
            <Route path="/" element={<HomePage />} />

            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Seller Routes */}
            <Route path="/seller/dashboard" element={<Dashboard />} />
            <Route path="/seller/manage-product" element={<ManageProduct />} />
            <Route path="/seller/order" element={<Order />} />
            <Route path="/seller/shop-page" element={<ShopPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
