import React from "react";

const OrderFilters = ({
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
}) => {
  // Render Admin variant
  if (variant === "admin") {
    return (
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Tìm kiếm đơn hàng..."
              value={searchTerm || ""}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <select
              value={statusFilter || ""}
              onChange={(e) => onStatusChange && onStatusChange(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="pending">Chờ xử lý</option>
              <option value="processing">Đang xử lý</option>
              <option value="completed">Hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>

            <select
              value={paymentFilter || ""}
              onChange={(e) =>
                onPaymentChange && onPaymentChange(e.target.value)
              }
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tất cả thanh toán</option>
              <option value="paid">Đã thanh toán</option>
              <option value="pending">Chờ thanh toán</option>
              <option value="failed">Thất bại</option>
            </select>
          </div>

          <button
            onClick={onExport}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Xuất báo cáo
          </button>
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
          {filters.map((filter) => (
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
};

export default OrderFilters;
