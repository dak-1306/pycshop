import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ChatProvider } from "./context/ChatContext";
import GlobalChatWidget from "./components/GlobalChatWidget/GlobalChatWidget";
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
import ProductDetail from "./pages/buyer/Products/ProductDetail";
import SearchResults from "./pages/buyer/Products/SearchResults";
import ShopProfile from "./pages/buyer/Shop/ShopProfile";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <Router>
          <div className="app">
            <Routes>
              {/* Main Homepage */}
              <Route path="/" element={<HomePage />} />

              {/* Search Results */}
              <Route path="/search" element={<SearchResults />} />

              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/become-seller" element={<BecomeSeller />} />

              {/* Buyer Routes */}
              <Route path="/profile" element={<Profile />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/shop/:shopId" element={<ShopProfile />} />

              {/* Seller Routes */}
              <Route path="/seller/dashboard" element={<Dashboard />} />
              <Route path="/seller/products" element={<ManageProduct />} />
              <Route path="/seller/orders" element={<Order />} />
              <Route path="/seller/shop" element={<ShopPage />} />

              {/* Admin Routes */}
              <Route
                path="/admin/*"
                element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                }
              >
                <Route path="dashboard" element={<AdminDashboard />} />
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

            {/* Global Chat Widget */}
            <GlobalChatWidget />
          </div>
        </Router>
      </ChatProvider>
    </AuthProvider>
  );
}

const AppWithChat = () => {
  return (
    <div className="app">
      <Routes>
        {/* Main Homepage */}
        <Route path="/" element={<HomePage />} />

        {/* Search Results */}
        <Route path="/search" element={<SearchResults />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/become-seller" element={<BecomeSeller />} />

        {/* Buyer Routes */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/shop/:shopId" element={<ShopProfile />} />
        <Route
          path="/products"
          element={<div>Trang sản phẩm đang phát triển...</div>}
        />

        {/* Seller Routes */}
        <Route path="/seller/dashboard" element={<Dashboard />} />
        <Route path="/seller/shop-info" element={<ShopPage />} />
        <Route path="/seller/manage-products" element={<ManageProduct />} />
        <Route path="/seller/manage-product" element={<ManageProduct />} />
        <Route path="/seller/orders" element={<Order />} />
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

      {/* Global Chat Widget */}
      <GlobalChatWidget />
    </div>
  );
};

export default App;
