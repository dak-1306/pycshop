import React from "react";
import { useAdminReports } from "../../hooks/useAdminReports";
import UserAnalytics from "../../components/admin/reports/UserAnalytics";
import OrderAnalytics from "../../components/admin/reports/OrderAnalytics";
import ProductAnalytics from "../../components/admin/reports/ProductAnalytics";
import FinancialReports from "../../components/admin/reports/FinancialReports";
import ViolationReports from "../../components/admin/reports/ViolationReports";
import ReportFilters from "../../components/admin/reports/ReportFilters";

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
    violationData,

    // Loading states
    isLoading,

    // Actions
    handleExportReport,
    handleRefreshData,
  } = useAdminReports();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu báo cáo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              📊 Báo cáo & Thống kê
            </h1>
            <p className="text-gray-600">
              Tổng quan và phân tích chi tiết hoạt động hệ thống PycShop
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
              </svg>
              Làm mới
            </button>

            <button
              onClick={handleExportReport}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
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
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Xuất báo cáo
            </button>
          </div>
        </div>
      </div>

      {/* Date Range Filters */}
      <ReportFilters dateRange={dateRange} onDateRangeChange={setDateRange} />

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
      </div>

      {/* Violation Reports */}
      <ViolationReports data={violationData} />
    </div>
  );
};

export default Reports;
