import React from "react";
import {
  PRODUCT_CATEGORIES_ARRAY as PRODUCT_CATEGORIES,
  PRODUCT_STATUSES_ARRAY as PRODUCT_STATUSES,
  PRODUCT_STATUS_LABELS,
} from "../../../lib/constants/product.js";
import { useLanguage } from "../../../context/LanguageContext";

const ProductFilters = ({
  searchTerm,
  selectedCategory,
  selectedStatus,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
  onResetFilters,
  onAddProduct,
  onExport,
  showResetButton = false,
  categories = PRODUCT_CATEGORIES,
}) => {
  const { t } = useLanguage();

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      {/* Header with Title and Add Product Button */}
      <div className="items-center mb-4">
        <div className="flex gap-2">
          {onAddProduct && (
            <button
              onClick={onAddProduct}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
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
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              {t("addProduct") || "Thêm sản phẩm"}
            </button>
          )}
          {onExport && (
            <button
              onClick={onExport}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
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
              {t("export") || "Xuất dữ liệu"}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Search Input */}
        <div className="lg:col-span-2">
          {" "}
          <label
            htmlFor="search"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {t("searchProduct")}
          </label>
          <div className="relative">
            <input
              id="search"
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg
              className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
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
        </div>{" "}
        {/* Category Filter */}
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {t("category")}
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {" "}
            <option value="">{t("allCategories")}</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        {/* Status Filter */}
        <div>
          {" "}
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {t("status")}
          </label>
          <select
            id="status"
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {" "}
            <option value="">{t("allStatuses")}</option>
            {PRODUCT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {PRODUCT_STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Reset Filters Button */}
      {showResetButton && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={onResetFilters}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            {t("clearFilters")}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductFilters;
