import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ProductFilters = React.memo(
  ({
    searchTerm = "",
    onSearchChange,
    selectedCategory = "",
    onCategoryChange,
    selectedStatus = "",
    onStatusChange,
    selectedPrice = "",
    onPriceChange,
    onAddProduct,
    onExportProducts,
    onClearFilters,
    hasActiveFilters = false,
    variant = "seller", // "admin" | "seller" - chỉ để phân quyền
    // eslint-disable-next-line no-unused-vars
  }) => {
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
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) =>
                  onSearchChange && onSearchChange(e.target.value)
                }
                className="pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-300 w-64"
              />
            </div>

            {/* Category Filter */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
              <select
                value={selectedCategory}
                onChange={(e) =>
                  onCategoryChange && onCategoryChange(e.target.value)
                }
                className="relative bg-white border border-gray-300 rounded-lg px-3 py-2 pr-7 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-300 appearance-none cursor-pointer"
              >
                <option value="">🏷️ Tất cả danh mục</option>
                <option value="electronics">📱 Điện tử</option>
                <option value="fashion">👕 Thời trang</option>
                <option value="home">🏠 Gia dụng</option>
                <option value="beauty">💄 Làm đẹp</option>
                <option value="sports">⚽ Thể thao</option>
                <option value="books">📚 Sách</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <FontAwesomeIcon
                  icon={["fas", "chevron-down"]}
                  className="w-3 h-3 text-gray-400"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
              <select
                value={selectedStatus}
                onChange={(e) =>
                  onStatusChange && onStatusChange(e.target.value)
                }
                className="relative bg-white border border-gray-300 rounded-lg px-3 py-2 pr-7 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 hover:border-green-300 appearance-none cursor-pointer"
              >
                <option value="">📊 Tất cả trạng thái</option>
                <option value="active">✅ Hoạt động</option>
                <option value="inactive">❌ Không hoạt động</option>
                <option value="pending">⏳ Chờ duyệt</option>
                <option value="draft">📝 Bản nháp</option>
                <option value="out_of_stock">📦 Hết hàng</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <FontAwesomeIcon
                  icon={["fas", "chevron-down"]}
                  className="w-3 h-3 text-gray-400"
                />
              </div>
            </div>

            {/* Price Filter */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
              <select
                value={selectedPrice}
                onChange={(e) => onPriceChange && onPriceChange(e.target.value)}
                className="relative bg-white border border-gray-300 rounded-lg px-3 py-2 pr-7 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200 hover:border-yellow-300 appearance-none cursor-pointer"
              >
                <option value="">💰 Tất cả giá</option>
                <option value="0-100000">💵 Dưới 100K</option>
                <option value="100000-500000">💶 100K - 500K</option>
                <option value="500000-1000000">💷 500K - 1M</option>
                <option value="1000000-">💸 Trên 1M</option>
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
                onClick={onClearFilters}
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
            {/* Add Product Button */}
            {onAddProduct && (
              <button
                onClick={onAddProduct}
                className="group relative flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium text-sm transition-all duration-200 transform hover:scale-105 hover:-translate-y-0.5 shadow-md hover:shadow-lg overflow-hidden"
                title="Thêm sản phẩm mới"
              >
                <FontAwesomeIcon icon={["fas", "plus"]} className="w-4 h-4" />
                <span>Thêm sản phẩm</span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
              </button>
            )}

            {/* Export Button */}
            {onExportProducts && (
              <button
                onClick={onExportProducts}
                className="group relative flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg font-medium text-sm transition-all duration-200 transform hover:scale-105 hover:-translate-y-0.5 shadow-md hover:shadow-lg overflow-hidden"
              >
                <FontAwesomeIcon
                  icon={["fas", "file-export"]}
                  className="w-4 h-4"
                />
                <span>Xuất Excel</span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
);

ProductFilters.displayName = "ProductFilters";

ProductFilters.propTypes = {
  searchTerm: PropTypes.string,
  onSearchChange: PropTypes.func,
  selectedCategory: PropTypes.string,
  onCategoryChange: PropTypes.func,
  selectedStatus: PropTypes.string,
  onStatusChange: PropTypes.func,
  selectedPrice: PropTypes.string,
  onPriceChange: PropTypes.func,
  onAddProduct: PropTypes.func,
  onExportProducts: PropTypes.func,
  onClearFilters: PropTypes.func,
  hasActiveFilters: PropTypes.bool,
  variant: PropTypes.oneOf(["admin", "seller"]),
};

export default ProductFilters;
