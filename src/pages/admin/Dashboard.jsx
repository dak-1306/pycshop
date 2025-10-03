import React from "react";
import AdminStatsCards from "../../components/dashboard/AdminStatsCards";
import AdminRecentOrdersTable from "../../components/dashboard/AdminRecentOrdersTable";
import RecentUsersTable from "../../components/dashboard/RecentUsersTable";
import AdminChartsSection from "../../components/dashboard/AdminChartsSection";
import QuickActions from "../../components/dashboard/QuickActions";
import { useDashboard } from "../../hooks/useDashboard";

const Dashboard = () => {
  const {
    stats,
    recentOrders,
    recentUsers,
    chartData,
    quickActions,
    isLoading,
  } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Quick Actions */}
      <QuickActions actions={quickActions} />

      {/* Statistics Cards */}
      <AdminStatsCards stats={stats} />

      {/* Charts Section */}
      <AdminChartsSection chartData={chartData} />

      {/* Data Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AdminRecentOrdersTable recentOrders={recentOrders} />
        <RecentUsersTable recentUsers={recentUsers} />
      </div>
    </div>
  );
};

export default Dashboard;
