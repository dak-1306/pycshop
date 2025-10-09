import React from "react";
import {
  PRODUCT_CATEGORIES,
  PRODUCT_STATUSES,
  PRICE_RANGES,
} from "../../../constants/productConstants";

const ProductFilters = ({
  // Seller props (existing)
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  selectedPrice,
  setSelectedPrice,
  onResetFilters,
  onAddProduct,
  onExport,
  // Admin props (new)
  searchValue,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  statusFilter,
  onStatusChange,
  variant = "seller", // "admin" | "seller"
}) => {
  // Render Admin variant
  if (variant === "admin") {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500"
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
                placeholder="Tìm kiếm sản phẩm..."
                value={searchValue || ""}
                onChange={(e) =>
                  onSearchChange && onSearchChange(e.target.value)
                }
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-300"
              />
            </div>

            {/* Category Filter */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
              <select
                value={categoryFilter || ""}
                onChange={(e) =>
                  onCategoryChange && onCategoryChange(e.target.value)
                }
                className="relative bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-300 appearance-none cursor-pointer"
              >
                <option value="">📦 Tất cả danh mục</option>
                {PRODUCT_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
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

            {/* Status Filter */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
              <select
                value={statusFilter || ""}
                onChange={(e) =>
                  onStatusChange && onStatusChange(e.target.value)
                }
                className="relative bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 hover:border-green-300 appearance-none cursor-pointer"
              >
                <option value="">⚡ Tất cả trạng thái</option>
                {PRODUCT_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
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
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onAddProduct}
              className="group relative flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 hover:-translate-y-0.5 shadow-lg hover:shadow-xl overflow-hidden"
            >
              <svg
                className="w-5 h-5"
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
              <span>Thêm sản phẩm</span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
            </button>
            <button
              onClick={onExport}
              className="group relative flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 hover:-translate-y-0.5 shadow-lg hover:shadow-xl overflow-hidden"
            >
              <svg
                className="w-5 h-5"
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
              <span>Xuất Excel</span>
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
        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Category Filter */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
            <select
              value={selectedCategory}
              onChange={(e) =>
                setSelectedCategory && setSelectedCategory(e.target.value)
              }
              className={`relative appearance-none bg-white border-2 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all hover:shadow-md min-w-[160px] font-medium ${
                selectedCategory
                  ? "border-orange-500 bg-orange-50 text-orange-700 shadow-md"
                  : "border-gray-300 text-gray-700 hover:border-orange-300"
              }`}
            >
              <option value="">📂 Danh mục</option>
              {PRODUCT_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg
                className={`w-5 h-5 transition-colors ${
                  selectedCategory ? "text-orange-600" : "text-gray-400"
                }`}
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

          {/* Status Filter */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
            <select
              value={selectedStatus}
              onChange={(e) =>
                setSelectedStatus && setSelectedStatus(e.target.value)
              }
              className={`relative appearance-none bg-white border-2 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all hover:shadow-md min-w-[160px] font-medium ${
                selectedStatus
                  ? "border-green-500 bg-green-50 text-green-700 shadow-md"
                  : "border-gray-300 text-gray-700 hover:border-green-300"
              }`}
            >
              <option value="">🏷️ Trạng thái</option>
              {PRODUCT_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg
                className={`w-5 h-5 transition-colors ${
                  selectedStatus ? "text-green-600" : "text-gray-400"
                }`}
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

          {/* Price Filter */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
            <select
              value={selectedPrice}
              onChange={(e) =>
                setSelectedPrice && setSelectedPrice(e.target.value)
              }
              className={`relative appearance-none bg-white border-2 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all hover:shadow-md min-w-[160px] font-medium ${
                selectedPrice
                  ? "border-purple-500 bg-purple-50 text-purple-700 shadow-md"
                  : "border-gray-300 text-gray-700 hover:border-purple-300"
              }`}
            >
              <option value="">💰 Giá</option>
              {PRICE_RANGES.map((range) => (
                <option key={range} value={range}>
                  {range}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg
                className={`w-5 h-5 transition-colors ${
                  selectedPrice ? "text-purple-600" : "text-gray-400"
                }`}
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

          {/* Reset Button */}
          <button
            onClick={onResetFilters}
            className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl ml-2 group"
            title="Reset bộ lọc"
          >
            <svg
              className="w-6 h-6 transition-transform group-hover:rotate-180 duration-300"
              fill="currentColor"
              viewBox="0 0 640 640"
            >
              <path d="M129.9 292.5C143.2 199.5 223.3 128 320 128C373 128 421 149.5 455.8 184.2C456 184.4 456.2 184.6 456.4 184.8L464 192L416.1 192C398.4 192 384.1 206.3 384.1 224C384.1 241.7 398.4 256 416.1 256L544.1 256C561.8 256 576.1 241.7 576.1 224L576.1 96C576.1 78.3 561.8 64 544.1 64C526.4 64 512.1 78.3 512.1 96L512.1 149.4L500.8 138.7C454.5 92.6 390.5 64 320 64C191 64 84.3 159.4 66.6 283.5C64.1 301 76.2 317.2 93.7 319.7C111.2 322.2 127.4 310 129.9 292.6zM573.4 356.5C575.9 339 563.7 322.8 546.3 320.3C528.9 317.8 512.6 330 510.1 347.4C496.8 440.4 416.7 511.9 320 511.9C267 511.9 219 490.4 184.2 455.7C184 455.5 183.8 455.3 183.6 455.1L176 447.9L223.9 447.9C241.6 447.9 255.9 433.6 255.9 415.9C255.9 398.2 241.6 383.9 223.9 383.9L96 384C87.5 384 79.3 387.4 73.3 393.5C67.3 399.6 63.9 407.7 64 416.3L65 543.3C65.1 561 79.6 575.2 97.3 575C115 574.8 129.2 560.4 129 542.7L128.6 491.2L139.3 501.3C185.6 547.4 249.5 576 320 576C449 576 555.7 480.6 573.4 356.5z" />
            </svg>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onAddProduct}
            className="group relative bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3.5 rounded-xl flex items-center gap-3 transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 shadow-lg hover:shadow-xl font-semibold text-sm uppercase tracking-wide"
            title="Thêm sản phẩm mới"
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-xl transition-opacity duration-300"></div>
            <span className="relative z-10">📦 Thêm sản phẩm</span>
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

export default ProductFilters;
