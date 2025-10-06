import React from "react";
import RecentOrdersTable from "../../components/common/dashboard/RecentOrdersTable";
import RecentUsersTable from "../../components/admin/dashboard/RecentUsersTable";
import ChartsSection from "../../components/common/dashboard/ChartsSection";
import StatsCards from "../../components/common/dashboard/StatsCards";
import StatsOverview from "../../components/admin/reports/StatsOverview";
import { useDashboard } from "../../hooks/useDashboard";
import { useAdminReports } from "../../hooks/useAdminReports";

const Dashboard = () => {
  const {
    recentOrders,
    recentUsers,
    chartData,
    isLoading: dashboardLoading,
    error: dashboardError,
  } = useDashboard();

  const {
    overviewStats,
    isLoading: reportsLoading,
    error: reportsError,
  } = useAdminReports();

  // Fallback data when API fails
  const fallbackStats = {
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    activeUsers: 0,
    pendingOrders: 0,
  };

  const safeOverviewStats = overviewStats || fallbackStats;
  const isLoading =
    (dashboardLoading || reportsLoading) && !dashboardError && !reportsError;

  // Show error notification if APIs fail
  const hasErrors = dashboardError || reportsError;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🏠 Dashboard</h1>
        <p className="text-gray-600">
          Tổng quan hoạt động và quản lý hệ thống PycShop
        </p>
      </div>

      {/* Error Notification */}
      {hasErrors && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <span className="text-red-600">⚠️</span>
            <h3 className="text-red-800 font-semibold">Lỗi kết nối API</h3>
          </div>
          <p className="text-red-700 text-sm mt-1">
            Không thể kết nối đến server. Hiển thị dữ liệu mặc định.
          </p>
        </div>
      )}

      {/* System Overview */}
      <StatsOverview stats={safeOverviewStats} />

      {/* Stats Cards */}
      <StatsCards
        variant="admin"
        stats={{
          totalUsers: safeOverviewStats.totalUsers,
          totalOrders: safeOverviewStats.totalOrders,
          totalRevenue: safeOverviewStats.totalRevenue,
          totalProducts: safeOverviewStats.totalProducts,
        }}
      />

      {/* Charts Section */}
      <ChartsSection variant="admin" chartData={chartData} />

      {/* Data Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <RecentOrdersTable
          variant="admin"
          orderData={recentOrders || []}
          getStatusColor={(status) => {
            switch (status) {
              case "completed":
                return "bg-green-100 text-green-800";
              case "pending":
                return "bg-yellow-100 text-yellow-800";
              case "cancelled":
                return "bg-red-100 text-red-800";
              default:
                return "bg-gray-100 text-gray-800";
            }
          }}
        />
        <RecentUsersTable recentUsers={recentUsers || []} />
      </div>
    </div>
  );
};

export default Dashboard;
