import React from "react";
import { useAdminReports } from "../../hooks/admin/useAdminReports";
import { ADMIN_CONSTANTS } from "../../lib/constants/adminConstants";
import UserAnalytics from "../../components/admin/reports/UserAnalytics";
import OrderAnalytics from "../../components/admin/reports/OrderAnalytics";
import ProductAnalytics from "../../components/admin/reports/ProductAnalytics";
import FinancialReports from "../../components/admin/reports/FinancialReports";
import ReportFilters from "../../components/admin/reports/ReportFilters";
import ExportDropdown from "../../components/admin/reports/ExportDropdown";
import StatsCards from "../../components/common/dashboard/StatsCards";

const Reports = () => {
  const {
    // Date range filters
    dateRange,
    setDateRange,

    // Analytics data
    userAnalytics,
    orderAnalytics,
    productAnalytics,
    financialData,

    // Loading states
    isLoading,

    // Actions
    handleExportReport,
    handleRefreshData,
  } = useAdminReports();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {ADMIN_CONSTANTS.PAGES.REPORTS.LOADING}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            {" "}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {ADMIN_CONSTANTS.PAGES.REPORTS.TITLE}
            </h1>
            <p className="text-gray-600">
              {ADMIN_CONSTANTS.PAGES.REPORTS.SUBTITLE}
            </p>
          </div>

          <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleRefreshData}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>{" "}
              {ADMIN_CONSTANTS.ERROR_MESSAGES.REFRESH_DATA}
            </button>{" "}
            <ExportDropdown onExport={handleExportReport} />
          </div>
        </div>
      </div>
      {/* Date Range Filters */}
      <ReportFilters dateRange={dateRange} onDateRangeChange={setDateRange} />
      {/* System Overview */}
      <StatsCards
        variant="admin"
        stats={{
          totalUsers: userAnalytics?.totalUsers || 0,
          totalOrders: orderAnalytics?.totalOrders || 0,
          totalProducts: productAnalytics?.totalProducts || 0,
          totalRevenue: financialData?.totalRevenue || 0,
        }}
      />
      {/* Advanced Filters */}
      {/* Detailed Analytics */}
      {/* Analytics Sections */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
        {/* User Analytics */}
        <UserAnalytics data={userAnalytics} />

        {/* Order Analytics */}
        <OrderAnalytics data={orderAnalytics} />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
        {/* Product Analytics */}
        <ProductAnalytics data={productAnalytics} />

        {/* Financial Reports */}
        <FinancialReports data={financialData} />
      </div>{" "}
      {/* Recent Reports Management */}
    </div>
  );
};

export default Reports;
