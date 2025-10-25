import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import ProductFilters from "./ProductFilters";
import ProductTable from "./ProductTable";
import ProductStats from "./ProductStats";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ProductManagement = React.memo(
  ({
    // Data
    products = [],
    stats = null,

    // Actions
    onAddProduct,
    onViewProduct,
    onEditProduct,
    onDeleteProduct,
    onExportProducts,

    // Filters
    onSearchChange,
    onCategoryFilter,
    onStatusFilter,
    onPriceFilter,

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
      category: "",
      status: "",
      price: "",
    });

    // Handle filter changes
    const handleFilterChange = (newFilters) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));

      // Call parent callbacks
      if (newFilters.search !== undefined && onSearchChange) {
        onSearchChange(newFilters.search);
      }
      if (newFilters.category !== undefined && onCategoryFilter) {
        onCategoryFilter(newFilters.category);
      }
      if (newFilters.status !== undefined && onStatusFilter) {
        onStatusFilter(newFilters.status);
      }
      if (newFilters.price !== undefined && onPriceFilter) {
        onPriceFilter(newFilters.price);
      }
    };

    // Clear all filters
    const handleClearFilters = () => {
      const clearedFilters = {
        search: "",
        category: "",
        status: "",
        price: "",
      };
      setFilters(clearedFilters);
      handleFilterChange(clearedFilters);
    };

    // Check if any filters are active
    const hasActiveFilters = useMemo(() => {
      return (
        filters.search || filters.category || filters.status || filters.price
      );
    }, [filters]);

    // Loading state
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải sản phẩm...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {variant === "admin" ? "Quản lý sản phẩm" : "Sản phẩm của tôi"}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {variant === "admin"
              ? "Quản lý tất cả sản phẩm trong hệ thống"
              : "Quản lý và theo dõi sản phẩm của bạn"}
          </p>
        </div>

        {/* Stats */}
        {stats && <ProductStats stats={stats} variant={variant} />}

        {/* Filters */}
        <ProductFilters
          searchTerm={filters.search}
          selectedCategory={filters.category}
          selectedStatus={filters.status}
          selectedPrice={filters.price}
          onSearchChange={(search) => handleFilterChange({ search })}
          onCategoryChange={(category) => handleFilterChange({ category })}
          onStatusChange={(status) => handleFilterChange({ status })}
          onPriceChange={(price) => handleFilterChange({ price })}
          onClearFilters={handleClearFilters}
          hasActiveFilters={hasActiveFilters}
          onAddProduct={onAddProduct}
          onExportProducts={onExportProducts}
          variant={variant}
        />

        {/* Products Table */}
        <ProductTable
          products={products}
          onViewProduct={onViewProduct}
          onEditProduct={onEditProduct}
          onDeleteProduct={onDeleteProduct}
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

ProductManagement.displayName = "ProductManagement";

ProductManagement.propTypes = {
  // Data
  products: PropTypes.array,
  stats: PropTypes.object,

  // Actions
  onAddProduct: PropTypes.func,
  onViewProduct: PropTypes.func,
  onEditProduct: PropTypes.func,
  onDeleteProduct: PropTypes.func,
  onExportProducts: PropTypes.func,

  // Filters
  onSearchChange: PropTypes.func,
  onCategoryFilter: PropTypes.func,
  onStatusFilter: PropTypes.func,
  onPriceFilter: PropTypes.func,

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

export default ProductManagement;
