import React from "react";
import { Link } from "react-router-dom";
import SellerLayout from "../../components/layout/SellerLayout";
import StatsCards from "../../components/dashboard/StatsCards";
import ChartsSection from "../../components/dashboard/ChartsSection";
import RecentOrdersTable from "../../components/dashboard/RecentOrdersTable";
import { useDashboard } from "../../hooks/useDashboard";

const Dashboard = () => {
  const { stats, orderData, getStatusColor } = useDashboard();

  return (
    <SellerLayout title="Dashboard">
      <div className="p-8">
        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Thao tác nhanh
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link
              to="/seller/shop-info"
              className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg transition duration-200 text-center"
            >
              <div className="text-2xl mb-2">🏪</div>
              <div className="font-medium">Thông tin Shop</div>
              <div className="text-sm opacity-90">Xem & chỉnh sửa</div>
            </Link>

            <Link
              to="/seller/manage-products"
              className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-lg transition duration-200 text-center"
            >
              <div className="text-2xl mb-2">📦</div>
              <div className="font-medium">Quản lý sản phẩm</div>
              <div className="text-sm opacity-90">Thêm, sửa, xóa</div>
            </Link>

            <Link
              to="/seller/orders"
              className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-lg transition duration-200 text-center"
            >
              <div className="text-2xl mb-2">📋</div>
              <div className="font-medium">Đơn hàng</div>
              <div className="text-sm opacity-90">Xử lý đơn hàng</div>
            </Link>

            <Link
              to="/seller/analytics"
              className="bg-purple-500 hover:bg-purple-600 text-white p-4 rounded-lg transition duration-200 text-center"
            >
              <div className="text-2xl mb-2">📊</div>
              <div className="font-medium">Thống kê</div>
              <div className="text-sm opacity-90">Doanh thu & báo cáo</div>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Charts Section */}
        <ChartsSection />

        {/* Recent Orders Table */}
        <RecentOrdersTable
          orderData={orderData}
          getStatusColor={getStatusColor}
        />
      </div>
    </SellerLayout>
  );
};

export default Dashboard;
