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
  } = useDashboard();

  const { overviewStats, isLoading: reportsLoading } = useAdminReports();

  const isLoading = dashboardLoading || reportsLoading;

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

      {/* System Overview */}
      <StatsOverview stats={overviewStats} />

      {/* Stats Cards */}
      <StatsCards
        variant="admin"
        stats={{
          totalUsers: overviewStats?.totalUsers || 0,
          totalOrders: overviewStats?.totalOrders || 0,
          totalRevenue: overviewStats?.totalRevenue || 0,
          totalProducts: overviewStats?.totalProducts || 0,
        }}
      />

      {/* Charts Section */}
      <ChartsSection variant="admin" />

      {/* Data Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <RecentOrdersTable
          variant="admin"
          orderData={recentOrders}
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
        <RecentUsersTable recentUsers={recentUsers} />
      </div>
    </div>
  );
};

export default Dashboard;
