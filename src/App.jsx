import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ChatProvider } from "./context/ChatContext";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
import { NotificationProvider } from "./context/NotificationContext";
import GlobalChatWidget from "./components/common/GlobalChatWidget/GlobalChatWidget";
import HomePage from "./pages/buyer/Home";
import Dashboard from "./pages/seller/Dashboard";
import ManageProduct from "./pages/seller/ManageProduct";
import Order from "./pages/seller/Order";
import ShopPage from "./pages/seller/ShopPage";
import SellerMessages from "./pages/seller/SellerMessages";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import BecomeSeller from "./pages/seller/BecomeSeller";

// Admin imports
import AdminLayout from "./components/layout/admin/AdminLayout";
import AdminRoute from "./components/admin/ProtectedRoute/AdminRoute";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminProducts from "./pages/admin/Products";
import AdminOrders from "./pages/admin/Orders";
import AdminSellers from "./pages/admin/Sellers";
import AdminReports from "./pages/admin/Reports";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminManagement from "./components/admin/settings/AdminManagement";
import AdminSettings from "./pages/admin/Settings";
import Profile from "./pages/buyer/Profile/Profile";
import ProductDetail from "./pages/buyer/Products/ProductDetail";
import SearchResults from "./pages/buyer/Products/SearchResults";
import CategoryProducts from "./pages/buyer/Products/CategoryProducts";
import ShopProfile from "./pages/buyer/Shop/ShopProfile";
import Checkout from "./pages/buyer/Cart/Checkout";
import Cart from "./pages/buyer/Cart/Cart";
import "./styles/App.css";

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <NotificationProvider>
            <CartProvider>
              <ChatProvider>
                <Router>
                  <div className="app">
                    <Routes>
                      {/* Main Homepage */}
                      <Route path="/" element={<HomePage />} />

                      {/* Search Results */}
                      <Route path="/search" element={<SearchResults />} />

                      {/* Category Products */}
                      <Route
                        path="/category/:categoryId"
                        element={<CategoryProducts />}
                      />

                      {/* Auth Routes */}
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/admin/login" element={<AdminLogin />} />
                      <Route path="/become-seller" element={<BecomeSeller />} />

                      {/* Buyer Routes */}
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/product/:id" element={<ProductDetail />} />
                      <Route path="/shop/:shopId" element={<ShopProfile />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/checkout" element={<Checkout />} />

                      {/* Seller Routes */}
                      <Route path="/seller/dashboard" element={<Dashboard />} />
                      <Route
                        path="/seller/products"
                        element={<ManageProduct />}
                      />
                      <Route path="/seller/orders" element={<Order />} />
                      <Route path="/seller/shop" element={<ShopPage />} />
                      <Route
                        path="/seller/messages"
                        element={<SellerMessages />}
                      />

                      {/* Admin Routes */}
                      <Route
                        path="/admin/*"
                        element={
                          <AdminRoute>
                            <AdminLayout />
                          </AdminRoute>
                        }
                      >
                        <Route
                          index
                          element={<Navigate to="/admin/dashboard" replace />}
                        />
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="users" element={<AdminUsers />} />
                        <Route path="products" element={<AdminProducts />} />
                        <Route path="orders" element={<AdminOrders />} />
                        <Route path="sellers" element={<AdminSellers />} />
                        <Route path="reports" element={<AdminReports />} />
                        <Route
                          path="admin-management"
                          element={<AdminManagement />}
                        />
                        <Route path="settings" element={<AdminSettings />} />
                      </Route>
                    </Routes>

                    {/* Global Chat Widget */}
                    <GlobalChatWidget />
                  </div>{" "}
                </Router>
              </ChatProvider>
            </CartProvider>
          </NotificationProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
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

        {/* Category Products */}
        <Route path="/category/:categoryId" element={<CategoryProducts />} />

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
        <Route path="/seller/messages" element={<SellerMessages />} />
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
          <Route path="admin-management" element={<AdminManagement />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>

      {/* Global Chat Widget */}
      <GlobalChatWidget />
    </div>
  );
};

export default App;
