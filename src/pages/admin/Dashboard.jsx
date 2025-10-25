import React from "react";
import RecentOrdersTable from "../../components/common/dashboard/RecentOrdersTable";
import RecentUsersTable from "../../components/admin/dashboard/RecentUsersTable";
import AdminChartsSection from "../../components/admin/dashboard/charts/AdminChartsSection";
import ChartRefreshButton from "../../components/admin/dashboard/ChartRefreshButton";
import SystemPerformanceMetrics from "../../components/admin/dashboard/SystemPerformanceMetrics";
import DashboardInsights from "../../components/admin/dashboard/DashboardInsights";
import StatsCards from "../../components/common/dashboard/StatsCards";
import StatsOverview from "../../components/admin/reports/StatsOverview";
import { useDashboard } from "../../hooks/common/useDashboard";
import { useAdminReports } from "../../hooks/admin/useAdminReports";
import { ADMIN_CONSTANTS } from "../../lib/constants/adminConstants";

const Dashboard = () => {
  const {
    recentOrders,
    recentUsers,
    chartData,
    isLoading: dashboardLoading,
    error: dashboardError,
    refreshDashboard,
  } = useDashboard("admin");

  const {
    overviewStats,
    isLoading: reportsLoading,
    error: reportsError,
  } = useAdminReports();

  // Fallback data when API fails
  const fallbackStats = ADMIN_CONSTANTS.FALLBACK_STATS;

  const safeOverviewStats = overviewStats || fallbackStats;
  const isLoading =
    (dashboardLoading || reportsLoading) && !dashboardError && !reportsError;

  // Show error notification if APIs fail
  const hasErrors = dashboardError || reportsError;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {ADMIN_CONSTANTS.PAGES.DASHBOARD.LOADING}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-8 flex justify-between items-start">
        <ChartRefreshButton
          onRefresh={refreshDashboard}
          isLoading={isLoading}
        />
      </div>
      {/* Error Notification */}
      {hasErrors && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <span className="text-red-600">
              {ADMIN_CONSTANTS.UI_TEXT.WARNING_ICON}
            </span>
            <h3 className="text-red-800 font-semibold">
              {ADMIN_CONSTANTS.ERROR_MESSAGES.API_CONNECTION_ERROR}
            </h3>
          </div>
          <p className="text-red-700 text-sm mt-1">
            {ADMIN_CONSTANTS.ERROR_MESSAGES.API_CONNECTION_MESSAGE}
          </p>
        </div>
      )}

      {/* System Overview */}
      <StatsOverview stats={safeOverviewStats} />

      {/* Performance Metrics */}
      <SystemPerformanceMetrics data={safeOverviewStats} />

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
      <AdminChartsSection
        chartData={chartData || {}}
        isLoading={isLoading}
        error={dashboardError}
      />
      {/* Dashboard Insights */}
      <DashboardInsights data={safeOverviewStats} />
      {/* Data Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <RecentOrdersTable
          variant="admin"
          orderData={recentOrders || []}
          getStatusColor={(status) =>
            ADMIN_CONSTANTS.ORDER_STATUS_COLORS[status] ||
            ADMIN_CONSTANTS.ORDER_STATUS_COLORS.default
          }
        />
        <RecentUsersTable recentUsers={recentUsers || []} />
      </div>
    </div>
  );
};

export default Dashboard;
