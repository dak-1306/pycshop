import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const OrderFilters = React.memo(
  ({
    searchTerm = "",
    onSearchChange,
    statusFilter = "",
    onStatusChange,
    paymentFilter = "",
    onPaymentChange,
    onAddOrder,
    onExport,
    onResetFilters,
    variant = "seller", // "admin" | "seller" - chỉ để phân quyền
  }) => {
    const hasActiveFilters = searchTerm || statusFilter || paymentFilter;

    return (
      <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon
                  icon={["fas", "search"]}
                  className="h-4 w-4 text-gray-400 group-focus-within:text-blue-500"
                />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm đơn hàng..."
                value={searchTerm}
                onChange={(e) =>
                  onSearchChange && onSearchChange(e.target.value)
                }
                className="pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-300 w-64"
              />
            </div>

            {/* Status Filter */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
              <select
                value={statusFilter}
                onChange={(e) =>
                  onStatusChange && onStatusChange(e.target.value)
                }
                className="relative bg-white border border-gray-300 rounded-lg px-3 py-2 pr-7 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-300 appearance-none cursor-pointer"
              >
                <option value="">📦 Tất cả trạng thái</option>
                <option value="pending">⏳ Chờ xử lý</option>
                <option value="processing">🔄 Đang xử lý</option>
                <option value="completed">✅ Hoàn thành</option>
                <option value="cancelled">❌ Đã hủy</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <FontAwesomeIcon
                  icon={["fas", "chevron-down"]}
                  className="w-3 h-3 text-gray-400"
                />
              </div>
            </div>

            {/* Payment Filter */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
              <select
                value={paymentFilter}
                onChange={(e) =>
                  onPaymentChange && onPaymentChange(e.target.value)
                }
                className="relative bg-white border border-gray-300 rounded-lg px-3 py-2 pr-7 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 hover:border-green-300 appearance-none cursor-pointer"
              >
                <option value="">💳 Tất cả thanh toán</option>
                <option value="paid">💚 Đã thanh toán</option>
                <option value="pending">⏰ Chờ thanh toán</option>
                <option value="failed">💔 Thất bại</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <FontAwesomeIcon
                  icon={["fas", "chevron-down"]}
                  className="w-3 h-3 text-gray-400"
                />
              </div>
            </div>

            {/* Reset Button */}
            {hasActiveFilters && (
              <button
                onClick={onResetFilters}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200"
                title="Đặt lại bộ lọc"
              >
                <FontAwesomeIcon
                  icon={["fas", "rotate-left"]}
                  className="w-4 h-4"
                />
                <span className="text-sm">Đặt lại</span>
              </button>
            )}
          </div>

          <div className="flex space-x-2">
            {/* Add Order Button - chỉ hiện với admin */}
            {variant === "admin" && onAddOrder && (
              <button
                onClick={onAddOrder}
                className="group relative flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium text-sm transition-all duration-200 transform hover:scale-105 hover:-translate-y-0.5 shadow-md hover:shadow-lg overflow-hidden"
                title="Tạo đơn hàng mới"
              >
                <FontAwesomeIcon icon={["fas", "plus"]} className="w-4 h-4" />
                <span>Tạo đơn hàng</span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
              </button>
            )}

            {/* Export Button */}
            {onExport && (
              <button
                onClick={onExport}
                className="group relative flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg font-medium text-sm transition-all duration-200 transform hover:scale-105 hover:-translate-y-0.5 shadow-md hover:shadow-lg overflow-hidden"
              >
                <FontAwesomeIcon
                  icon={["fas", "file-export"]}
                  className="w-4 h-4"
                />
                <span>Xuất báo cáo</span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
);

OrderFilters.displayName = "OrderFilters";

OrderFilters.propTypes = {
  searchTerm: PropTypes.string,
  onSearchChange: PropTypes.func,
  statusFilter: PropTypes.string,
  onStatusChange: PropTypes.func,
  paymentFilter: PropTypes.string,
  onPaymentChange: PropTypes.func,
  onAddOrder: PropTypes.func,
  onExport: PropTypes.func,
  onResetFilters: PropTypes.func,
  variant: PropTypes.oneOf(["admin", "seller"]),
};

export default OrderFilters;
