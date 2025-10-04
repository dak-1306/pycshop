import React from "react";
import AdminRecentOrdersTable from "../../components/dashboard/AdminRecentOrdersTable";
import RecentUsersTable from "../../components/dashboard/RecentUsersTable";
import AdminChartsSection from "../../components/dashboard/AdminChartsSection";
import StatsOverview from "../../components/reports/StatsOverview";
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

      {/* Charts Section */}
      <AdminChartsSection chartData={chartData} />

      {/* Data Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <AdminRecentOrdersTable recentOrders={recentOrders} />
        <RecentUsersTable recentUsers={recentUsers} />
      </div>
    </div>
  );
};

export default Dashboard;
