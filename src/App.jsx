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

// Admin imports
import AdminLayout from "./components/layout/AdminLayout";
import AdminRoute from "./components/ProtectedRoute/AdminRoute";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminProducts from "./pages/admin/Products";
import AdminOrders from "./pages/admin/Orders";
import AdminTestPage from "./pages/AdminTestPage";
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
            <Route path="/admin-test" element={<AdminTestPage />} />

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
              <Route
                path="sellers"
                element={
                  <div className="p-6">
                    <h1 className="text-2xl font-bold">Quản lý Seller</h1>
                    <p>Trang đang phát triển...</p>
                  </div>
                }
              />
              <Route
                path="reports"
                element={
                  <div className="p-6">
                    <h1 className="text-2xl font-bold">Báo cáo</h1>
                    <p>Trang đang phát triển...</p>
                  </div>
                }
              />
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
