import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import OrderFilters from "./OrderFilters";
import OrderTable from "./OrderTable";
import OrderStats from "./OrderStats";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const OrderManagement = React.memo(
  ({
    // Data
    orders = [],
    stats = null,

    // Actions
    onCreateOrder,
    onViewOrder,
    onEditOrder,
    onDeleteOrder,
    onCancelOrder,
    onExportOrders,

    // Filters
    onSearchChange,
    onStatusFilter,
    onDateRangeFilter,
    onPaymentFilter,

    // Pagination
    currentPage = 1,
    totalPages = 1,
    onPageChange,

    // Config
    variant = "seller", // "admin" | "seller"
    isLoading = false,

    // Styling
    getStatusColor,
  }) => {
    const [filters, setFilters] = useState({
      search: "",
      status: "all",
      dateRange: "all",
      paymentStatus: "all",
    });

    // Handle filter changes
    const handleFilterChange = (newFilters) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));

      // Call parent callbacks
      if (newFilters.search !== undefined && onSearchChange) {
        onSearchChange(newFilters.search);
      }
      if (newFilters.status !== undefined && onStatusFilter) {
        onStatusFilter(newFilters.status);
      }
      if (newFilters.dateRange !== undefined && onDateRangeFilter) {
        onDateRangeFilter(newFilters.dateRange);
      }
      if (newFilters.paymentStatus !== undefined && onPaymentFilter) {
        onPaymentFilter(newFilters.paymentStatus);
      }
    };

    // Clear all filters
    const handleClearFilters = () => {
      const clearedFilters = {
        search: "",
        status: "all",
        dateRange: "all",
        paymentStatus: "all",
      };
      setFilters(clearedFilters);
      handleFilterChange(clearedFilters);
    };

    // Check if any filters are active
    const hasActiveFilters = useMemo(() => {
      return (
        filters.search ||
        filters.status !== "all" ||
        filters.dateRange !== "all" ||
        filters.paymentStatus !== "all"
      );
    }, [filters]);

    // Loading state
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải đơn hàng...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {variant === "admin" ? "Quản lý đơn hàng" : "Đơn hàng của tôi"}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {variant === "admin"
                ? "Quản lý tất cả đơn hàng trong hệ thống"
                : "Theo dõi và quản lý đơn hàng của bạn"}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            {onExportOrders && (
              <button
                onClick={onExportOrders}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <FontAwesomeIcon
                  icon={["fas", "download"]}
                  className="w-4 h-4"
                />
                Xuất Excel
              </button>
            )}

            {onCreateOrder && (
              <button
                onClick={onCreateOrder}
                className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors duration-200 ${
                  variant === "admin"
                    ? "bg-blue-600 border border-blue-600 hover:bg-blue-700"
                    : "bg-gradient-to-r from-orange-500 to-red-500 hover:shadow-lg transform hover:scale-105"
                }`}
              >
                <FontAwesomeIcon icon={["fas", "plus"]} className="w-4 h-4" />
                {variant === "admin" ? "Tạo đơn hàng" : "Thêm đơn hàng"}
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        {stats && <OrderStats stats={stats} variant={variant} />}

        {/* Filters */}
        <OrderFilters
          searchTerm={filters.search}
          selectedStatus={filters.status}
          selectedDateRange={filters.dateRange}
          selectedPaymentStatus={filters.paymentStatus}
          onSearchChange={(search) => handleFilterChange({ search })}
          onStatusChange={(status) => handleFilterChange({ status })}
          onDateRangeChange={(dateRange) => handleFilterChange({ dateRange })}
          onPaymentStatusChange={(paymentStatus) =>
            handleFilterChange({ paymentStatus })
          }
          onClearFilters={handleClearFilters}
          hasActiveFilters={hasActiveFilters}
          variant={variant}
        />

        {/* Orders Table */}
        <OrderTable
          orders={orders}
          onViewOrder={onViewOrder}
          onEditOrder={onEditOrder}
          onDeleteOrder={onDeleteOrder}
          onCancelOrder={onCancelOrder}
          getStatusColor={getStatusColor}
          variant={variant}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-6 py-4 border-t border-gray-200 rounded-b-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-700">
                <span>
                  Trang {currentPage} trong tổng số {totalPages} trang
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onPageChange && onPageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FontAwesomeIcon
                    icon={["fas", "chevron-left"]}
                    className="w-4 h-4"
                  />
                </button>

                {/* Page numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, currentPage - 2) + i;
                  if (pageNum > totalPages) return null;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => onPageChange && onPageChange(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-medium border ${
                        pageNum === currentPage
                          ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => onPageChange && onPageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FontAwesomeIcon
                    icon={["fas", "chevron-right"]}
                    className="w-4 h-4"
                  />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

OrderManagement.displayName = "OrderManagement";

OrderManagement.propTypes = {
  // Data
  orders: PropTypes.array,
  stats: PropTypes.object,

  // Actions
  onCreateOrder: PropTypes.func,
  onViewOrder: PropTypes.func,
  onEditOrder: PropTypes.func,
  onDeleteOrder: PropTypes.func,
  onCancelOrder: PropTypes.func,
  onExportOrders: PropTypes.func,

  // Filters
  onSearchChange: PropTypes.func,
  onStatusFilter: PropTypes.func,
  onDateRangeFilter: PropTypes.func,
  onPaymentFilter: PropTypes.func,

  // Pagination
  currentPage: PropTypes.number,
  totalPages: PropTypes.number,
  onPageChange: PropTypes.func,

  // Config
  variant: PropTypes.oneOf(["admin", "seller"]),
  isLoading: PropTypes.bool,

  // Styling
  getStatusColor: PropTypes.func,
};

export default OrderManagement;
