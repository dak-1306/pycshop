import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import { AuthProvider } from "./context/AuthContext";

// Seller pages
import Dashboard from "./pages/seller/Dashboard";
import ShopPage from "./pages/seller/ShopPage";
import ManageProduct from "./pages/seller/ManageProduct";
import Order from "./pages/seller/Order";

// Auth pages (placeholder imports - tạo sau nếu cần)
// import Login from "./pages/auth/Login";
// import Register from "./pages/auth/Register";

import "./App.css";

function App() {
  return (
    <AuthProvider>
      <div className="app">
        <Router>
          <Routes>
            {/* Main Homepage */}
            <Route path="/" element={<HomePage />} />

            {/* Auth Routes (tạm comment để tránh lỗi import) */}
            {/* <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} /> */}

            {/* Seller Routes */}
            <Route
              path="/seller"
              element={<Navigate to="/seller/dashboard" replace />}
            />
            <Route path="/seller/dashboard" element={<Dashboard />} />
            <Route path="/seller/shop-page" element={<ShopPage />} />
            <Route path="/seller/manage-product" element={<ManageProduct />} />
            <Route path="/seller/order" element={<Order />} />

            {/* Redirect unknown routes to homepage */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;
