import React from "react";
import PropTypes from "prop-types";

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
                  <svg
                    className="h-4 w-4 text-gray-400 group-focus-within:text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
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
                  <option value="">📦 Tất cả trạng thái</option>
                  <option value="pending">⏳ Chờ xử lý</option>
                  <option value="processing">🔄 Đang xử lý</option>
                  <option value="completed">✅ Hoàn thành</option>
                  <option value="cancelled">❌ Đã hủy</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg
                    className="w-3 h-3 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
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
                  <option value="">💳 Tất cả thanh toán</option>
                  <option value="paid">💚 Đã thanh toán</option>
                  <option value="pending">⏰ Chờ thanh toán</option>
                  <option value="failed">💔 Thất bại</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg
                    className="w-3 h-3 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>{" "}
              {/* Create Order Button */}
              <button
                onClick={onUpdateStatus}
                className="group relative flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium text-sm transition-all duration-200 transform hover:scale-105 hover:-translate-y-0.5 shadow-md hover:shadow-lg overflow-hidden"
                title="Tạo đơn hàng mới"
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span>Tạo đơn hàng</span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
              </button>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={onExport}
                className="group relative flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg font-medium text-sm transition-all duration-200 transform hover:scale-105 hover:-translate-y-0.5 shadow-md hover:shadow-lg overflow-hidden"
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
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a4 4 0 01-4-4V5a4 4 0 014-4h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a4 4 0 01-4 4z"
                  />
                </svg>
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
              <svg
                className="w-6 h-6 transition-transform group-hover:rotate-180 duration-300"
                fill="currentColor"
                viewBox="0 0 640 640"
              >
                <path d="M129.9 292.5C143.2 199.5 223.3 128 320 128C373 128 421 149.5 455.8 184.2C456 184.4 456.2 184.6 456.4 184.8L464 192L416.1 192C398.4 192 384.1 206.3 384.1 224C384.1 241.7 398.4 256 416.1 256L544.1 256C561.8 256 576.1 241.7 576.1 224L576.1 96C576.1 78.3 561.8 64 544.1 64C526.4 64 512.1 78.3 512.1 96L512.1 149.4L500.8 138.7C454.5 92.6 390.5 64 320 64C191 64 84.3 159.4 66.6 283.5C64.1 301 76.2 317.2 93.7 319.7C111.2 322.2 127.4 310 129.9 292.6zM573.4 356.5C575.9 339 563.7 322.8 546.3 320.3C528.9 317.8 512.6 330 510.1 347.4C496.8 440.4 416.7 511.9 320 511.9C267 511.9 219 490.4 184.2 455.7C184 455.5 183.8 455.3 183.6 455.1L176 447.9L223.9 447.9C241.6 447.9 255.9 433.6 255.9 415.9C255.9 398.2 241.6 383.9 223.9 383.9L96 384C87.5 384 79.3 387.4 73.3 393.5C67.3 399.6 63.9 407.7 64 416.3L65 543.3C65.1 561 79.6 575.2 97.3 575C115 574.8 129.2 560.4 129 542.7L128.6 491.2L139.3 501.3C185.6 547.4 249.5 576 320 576C449 576 555.7 480.6 573.4 356.5z" />
              </svg>
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
              <span className="relative z-10">📋 Thêm đơn hàng</span>
            </button>

            <button
              onClick={onExport}
              className="group relative bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-3.5 rounded-xl flex items-center gap-3 transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 shadow-lg hover:shadow-xl font-semibold text-sm uppercase tracking-wide"
              title="Xuất dữ liệu Excel"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-xl transition-opacity duration-300"></div>
              <span className="relative z-10">📊 Xuất Excel</span>
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
