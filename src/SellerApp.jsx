import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Dashboard from "./pages/seller/Dashboard";
import ShopPage from "./pages/seller/ShopPage";
import ManageProduct from "./pages/seller/ManageProduct";
import Order from "./pages/seller/Order";
import "./index.css";

function SellerApp() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/seller/dashboard" replace />}
          />
          <Route path="/seller/dashboard" element={<Dashboard />} />
          <Route path="/seller/shop-page" element={<ShopPage />} />
          <Route path="/seller/manage-product" element={<ManageProduct />} />
          <Route path="/seller/order" element={<Order />} />
        </Routes>
      </Router>
    </div>
  );
}

export default SellerApp;
