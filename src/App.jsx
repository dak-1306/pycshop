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
import BecomeSeller from "./pages/seller/BecomeSeller";

// Admin imports
import AdminLayout from "./components/layout/AdminLayout";
import AdminRoute from "./components/ProtectedRoute/AdminRoute";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminProducts from "./pages/admin/Products";
import AdminOrders from "./pages/admin/Orders";
import AdminSellers from "./pages/admin/Sellers";
import AdminReports from "./pages/admin/Reports";
import AdminLogin from "./pages/admin/AdminLogin";
import Profile from "./pages/buyer/Profile/Profile";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Routes>
            {/* Main Homepage */}
            <Route path="/" element={<HomePage />} />

            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/become-seller" element={<BecomeSeller />} />

            {/* Buyer Routes */}
            <Route path="/profile" element={<Profile />} />

            {/* Seller Routes */}
            <Route path="/seller/dashboard" element={<Dashboard />} />
            <Route path="/seller/manage-product" element={<ManageProduct />} />
            <Route path="/seller/order" element={<Order />} />
            <Route path="/seller/shop-page" element={<ShopPage />} />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="sellers" element={<AdminSellers />} />
              <Route path="reports" element={<AdminReports />} />
              <Route
                path="settings"
                element={
                  <div className="p-6">
                    <h1 className="text-2xl font-bold">Cài đặt</h1>
                    <p>Trang đang phát triển...</p>
                  </div>
                }
              />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
