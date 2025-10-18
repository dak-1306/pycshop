import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const OrderFilters = React.memo(
  ({
    filters,
    selectedFilter,
    searchTerm,
    onFilterChange,
    onResetFilters,
    onAddOrder,
    onExport,
    variant = "seller", // "admin" | "seller"
    // Admin specific props
    onSearchChange,
    statusFilter,
    onStatusChange,
    paymentFilter,
    onPaymentChange,
    onUpdateStatus, // Prop cho nút tạo đơn hàng (tên prop giữ nguyên để tương thích)
  }) => {
    // Ensure filters is an array for safe mapping. Support legacy object form as fallback.
    const normalizedFilters = Array.isArray(filters)
      ? filters
      : filters && typeof filters === "object"
      ? Object.values(filters)
      : [];
    // Render Admin variant
    if (variant === "admin") {
      return (
        <div className="bg-white rounded-xl shadow-sm border p-4">
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
                  placeholder="Tìm kiếm..."
                  value={searchTerm || ""}
                  onChange={(e) =>
                    onSearchChange && onSearchChange(e.target.value)
                  }
                  className="pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-300"
                />
              </div>
              {/* Status Filter */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
                <select
                  value={statusFilter || ""}
                  onChange={(e) =>
                    onStatusChange && onStatusChange(e.target.value)
                  }
                  className="relative bg-white border border-gray-300 rounded-lg px-3 py-2 pr-7 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-300 appearance-none cursor-pointer"
                >
                  <option value="">
                    <FontAwesomeIcon icon={["fas", "box"]} className="mr-1" />
                    Tất cả trạng thái
                  </option>
                  <option value="pending">
                    <FontAwesomeIcon
                      icon={["fas", "hourglass-half"]}
                      className="mr-1"
                    />
                    Chờ xử lý
                  </option>
                  <option value="processing">
                    <FontAwesomeIcon icon={["fas", "sync"]} className="mr-1" />
                    Đang xử lý
                  </option>
                  <option value="completed">
                    <FontAwesomeIcon icon={["fas", "check"]} className="mr-1" />
                    Hoàn thành
                  </option>
                  <option value="cancelled">
                    <FontAwesomeIcon icon={["fas", "times"]} className="mr-1" />
                    Đã hủy
                  </option>
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
                  value={paymentFilter || ""}
                  onChange={(e) =>
                    onPaymentChange && onPaymentChange(e.target.value)
                  }
                  className="relative bg-white border border-gray-300 rounded-lg px-3 py-2 pr-7 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 hover:border-green-300 appearance-none cursor-pointer"
                >
                  <option value="">
                    <FontAwesomeIcon icon={["fas", "box"]} className="mr-1" />{" "}
                    Tất cả thanh toán
                  </option>
                  <option value="paid">
                    <FontAwesomeIcon icon={["fas", "check"]} className="mr-1" />{" "}
                    Đã thanh toán
                  </option>
                  <option value="pending">
                    <FontAwesomeIcon
                      icon={["fas", "hourglass-half"]}
                      className="mr-1"
                    />{" "}
                    Chờ thanh toán
                  </option>
                  <option value="failed">
                    <FontAwesomeIcon icon={["fas", "times"]} className="mr-1" />{" "}
                    Thất bại
                  </option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <FontAwesomeIcon
                    icon={["fas", "chevron-down"]}
                    className="w-3 h-3 text-gray-400"
                  />
                </div>
              </div>{" "}
              {/* Create Order Button */}
              <button
                onClick={onUpdateStatus}
                className="group relative flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium text-sm transition-all duration-200 transform hover:scale-105 hover:-translate-y-0.5 shadow-md hover:shadow-lg overflow-hidden"
                title="Tạo đơn hàng mới"
              >
                <FontAwesomeIcon icon={["fas", "plus"]} className="mr-1" />
                <span>Tạo đơn hàng</span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
              </button>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={onExport}
                className="group relative flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg font-medium text-sm transition-all duration-200 transform hover:scale-105 hover:-translate-y-0.5 shadow-md hover:shadow-lg overflow-hidden"
              >
                <FontAwesomeIcon
                  icon={["fas", "file-export"]}
                  className="mr-1"
                />
                <span>Xuất báo cáo</span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Render Seller variant (default)
    return (
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-6">
          {/* Filter Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            {normalizedFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => onFilterChange(filter)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedFilter === filter
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md transform scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900"
                }`}
              >
                {filter} ▼
              </button>
            ))}

            {/* Reset Button */}
            <button
              onClick={onResetFilters}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl ml-2 group"
              title="Reset bộ lọc"
            >
              <FontAwesomeIcon
                icon={["fas", "rotate"]}
                className="w-6 h-6 transition-transform group-hover:rotate-180 duration-300"
              />
              {(selectedFilter !== "Tất cả" || searchTerm) && (
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">!</span>
                </div>
              )}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={onAddOrder}
              className="group relative bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3.5 rounded-xl flex items-center gap-3 transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 shadow-lg hover:shadow-xl font-semibold text-sm uppercase tracking-wide"
              title="Thêm đơn hàng mới"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-xl transition-opacity duration-300"></div>
              <span className="relative z-10">
                <FontAwesomeIcon icon={["fas", "plus"]} className="mr-1" /> Thêm
                đơn hàng
              </span>
            </button>

            <button
              onClick={onExport}
              className="group relative bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-3.5 rounded-xl flex items-center gap-3 transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 shadow-lg hover:shadow-xl font-semibold text-sm uppercase tracking-wide"
              title="Xuất dữ liệu Excel"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-xl transition-opacity duration-300"></div>
              <span className="relative z-10">
                <FontAwesomeIcon
                  icon={["fas", "file-export"]}
                  className="mr-1"
                />{" "}
                Xuất Excel
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }
);

OrderFilters.displayName = "OrderFilters";

OrderFilters.propTypes = {
  filters: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  selectedFilter: PropTypes.string,
  searchTerm: PropTypes.string,
  onFilterChange: PropTypes.func,
  onResetFilters: PropTypes.func,
  onAddOrder: PropTypes.func,
  onExport: PropTypes.func,
  variant: PropTypes.oneOf(["admin", "seller"]),
  // Admin specific props
  onSearchChange: PropTypes.func,
  statusFilter: PropTypes.string,
  onStatusChange: PropTypes.func,
  paymentFilter: PropTypes.string,
  onPaymentChange: PropTypes.func,
  onUpdateStatus: PropTypes.func,
};

export default OrderFilters;
