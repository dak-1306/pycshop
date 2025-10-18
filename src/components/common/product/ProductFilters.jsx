import React from "react";
import PropTypes from "prop-types";
import {
  PRODUCT_CATEGORIES_ARRAY as PRODUCT_CATEGORIES,
  PRODUCT_STATUSES_ARRAY as PRODUCT_STATUSES,
  PRODUCT_STATUS_LABELS,
  PRICE_RANGES_ARRAY as PRICE_RANGES,
} from "../../../lib/constants/product.js";
import { useLanguage } from "../../../context/LanguageContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ProductFilters = React.memo(
  ({
    // Common props
    searchTerm,
    searchValue,
    onSearchChange,

    // Category props (normalized)
    selectedCategory,
    categoryFilter,
    setSelectedCategory,
    onCategoryChange,

    // Status props (normalized)
    selectedStatus,
    statusFilter,
    setSelectedStatus,
    onStatusChange,

    // Price props (seller specific)
    selectedPrice,
    setSelectedPrice,

    // Actions
    onResetFilters,
    onAddProduct,
    onExport,

    // Configuration
    variant = "seller", // "admin" | "seller"
    showResetButton = false,
    categories = PRODUCT_CATEGORIES,
  }) => {
    const { t } = useLanguage();

    // Normalize props for different variants
    const normalizedSearchValue = searchValue || searchTerm || "";
    const normalizedCategory = categoryFilter || selectedCategory || "";
    const normalizedStatus = statusFilter || selectedStatus || "";

    const handleSearchChange = (e) => {
      const value = e.target.value;
      if (onSearchChange) {
        onSearchChange(value);
      }
    };

    const handleCategoryChange = (value) => {
      if (onCategoryChange) {
        onCategoryChange(value);
      } else if (setSelectedCategory) {
        setSelectedCategory(value);
      }
    };

    const handleStatusChange = (value) => {
      if (onStatusChange) {
        onStatusChange(value);
      } else if (setSelectedStatus) {
        setSelectedStatus(value);
      }
    };

    const handlePriceChange = (value) => {
      if (setSelectedPrice) {
        setSelectedPrice(value);
      }
    };

    const handleResetFilters = () => {
      if (onResetFilters) {
        onResetFilters();
      } else {
        // Fallback reset
        handleSearchChange({ target: { value: "" } });
        handleCategoryChange("");
        handleStatusChange("");
        if (setSelectedPrice) handlePriceChange("");
      }
    };

    // Render Admin variant
    if (variant === "admin") {
      return (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex flex-wrap items-center gap-4">
              {/* Filter Results Count */}
              {(normalizedSearchValue ||
                normalizedCategory ||
                normalizedStatus) && (
                <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
                  <FontAwesomeIcon icon={["fas", "filter"]} />
                  <span className="text-sm font-medium">
                    {t("activeFilters") || "Bộ lọc đang áp dụng"}
                  </span>
                </div>
              )}

              {/* Search Input */}
              <div className="relative min-w-80">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon
                    icon={["fas", "search"]}
                    className="w-4 h-4 text-gray-400"
                  />
                </div>
                <input
                  type="text"
                  placeholder={t("searchProducts") || "Tìm kiếm sản phẩm..."}
                  value={normalizedSearchValue}
                  onChange={handleSearchChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Category Filter */}
              <select
                value={normalizedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white min-w-48"
              >
                <option value="">
                  {t("allCategories") || "Tất cả danh mục"}
                </option>
                {Array.isArray(categories) &&
                  categories.map((category) => (
                    <option
                      key={category.value || category}
                      value={category.value || category}
                    >
                      {category.label || category}
                    </option>
                  ))}
              </select>

              {/* Status Filter */}
              <select
                value={normalizedStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white min-w-48"
              >
                <option value="">
                  {t("allStatuses") || "Tất cả trạng thái"}
                </option>
                {Array.isArray(PRODUCT_STATUSES) &&
                  PRODUCT_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {PRODUCT_STATUS_LABELS?.[status] || status}
                    </option>
                  ))}
              </select>

              {/* Reset Filters Button */}
              {(normalizedSearchValue ||
                normalizedCategory ||
                normalizedStatus) && (
                <button
                  onClick={handleResetFilters}
                  className="flex items-center gap-2 px-4 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <FontAwesomeIcon icon={["fas", "redo"]} />
                  <span className="text-sm font-medium">
                    {t("resetFilters") || "Đặt lại"}
                  </span>
                </button>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              {onExport && (
                <button
                  onClick={onExport}
                  className="flex items-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors font-medium"
                >
                  <FontAwesomeIcon icon={["fas", "file-export"]} />
                  {t("exportData") || "Xuất dữ liệu"}
                </button>
              )}

              {onAddProduct && (
                <button
                  onClick={onAddProduct}
                  className="flex items-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-medium"
                >
                  <FontAwesomeIcon icon={["fas", "plus"]} />
                  {t("addProduct") || "Thêm sản phẩm"}
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }

    // Render Seller variant (default)
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-6">
        {/* Header with Title and Add Product Button */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <FontAwesomeIcon
                icon={["fas", "filter"]}
                className="text-white w-5 h-5"
              />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {t("productFilters") || "Bộ lọc sản phẩm"}
              </h3>
              <p className="text-sm text-gray-500">
                {t("filterDescription") || "Tìm kiếm và lọc sản phẩm của bạn"}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            {onAddProduct && (
              <button
                onClick={onAddProduct}
                className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all duration-200 transform hover:scale-105 font-medium shadow-sm hover:shadow-md"
              >
                <FontAwesomeIcon icon={["fas", "plus"]} />
                {t("addProduct") || "Thêm sản phẩm"}
              </button>
            )}

            {onExport && (
              <button
                onClick={onExport}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200 transform hover:scale-105 font-medium shadow-sm hover:shadow-md"
              >
                <FontAwesomeIcon icon={["fas", "file-export"]} />
                {t("exportData") || "Xuất dữ liệu"}
              </button>
            )}
          </div>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="relative lg:col-span-2">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FontAwesomeIcon
                icon={["fas", "search"]}
                className="w-5 h-5 text-gray-400"
              />
            </div>
            <input
              type="text"
              placeholder={t("searchProducts") || "Tìm kiếm sản phẩm..."}
              value={normalizedSearchValue}
              onChange={handleSearchChange}
              className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={normalizedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
            >
              <option value="">
                {t("allCategories") || "Tất cả danh mục"}
              </option>
              {Array.isArray(categories) &&
                categories.map((category) => (
                  <option
                    key={category.value || category}
                    value={category.value || category}
                  >
                    {category.label || category}
                  </option>
                ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={normalizedStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
            >
              <option value="">
                {t("allStatuses") || "Tất cả trạng thái"}
              </option>
              {Array.isArray(PRODUCT_STATUSES) &&
                PRODUCT_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {PRODUCT_STATUS_LABELS?.[status] || status}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Price Range Filter (Seller specific) */}
        {setSelectedPrice && PRICE_RANGES && (
          <div className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-1">
                <select
                  value={selectedPrice || ""}
                  onChange={(e) => handlePriceChange(e.target.value)}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
                >
                  <option value="">{t("allPrices") || "Tất cả mức giá"}</option>
                  {Array.isArray(PRICE_RANGES) &&
                    PRICE_RANGES.map((range) => (
                      <option key={range.value} value={range.value}>
                        {range.label}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Reset Button */}
        {(showResetButton ||
          normalizedSearchValue ||
          normalizedCategory ||
          normalizedStatus ||
          selectedPrice) && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all duration-200 border border-gray-300 hover:border-gray-400"
            >
              <FontAwesomeIcon icon={["fas", "redo"]} />
              <span className="text-sm font-medium">
                {t("resetFilters") || "Đặt lại bộ lọc"}
              </span>
            </button>
          </div>
        )}
      </div>
    );
  }
);

ProductFilters.displayName = "ProductFilters";

ProductFilters.propTypes = {
  // Common props
  searchTerm: PropTypes.string,
  searchValue: PropTypes.string,
  onSearchChange: PropTypes.func,

  // Category props (normalized)
  selectedCategory: PropTypes.string,
  categoryFilter: PropTypes.string,
  setSelectedCategory: PropTypes.func,
  onCategoryChange: PropTypes.func,

  // Status props (normalized)
  selectedStatus: PropTypes.string,
  statusFilter: PropTypes.string,
  setSelectedStatus: PropTypes.func,
  onStatusChange: PropTypes.func,

  // Price props (seller specific)
  selectedPrice: PropTypes.string,
  setSelectedPrice: PropTypes.func,

  // Actions
  onResetFilters: PropTypes.func,
  onAddProduct: PropTypes.func,
  onExport: PropTypes.func,

  // Configuration
  variant: PropTypes.oneOf(["admin", "seller"]),
  showResetButton: PropTypes.bool,
  categories: PropTypes.array,
};

export default ProductFilters;
