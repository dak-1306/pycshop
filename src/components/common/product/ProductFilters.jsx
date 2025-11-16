import React from "react";
import PropTypes from "prop-types";
import SearchBar from "../ui/SearchBar";
import FilterSelect from "../ui/FilterSelect";
import FilterContainer from "../ui/FilterContainer";

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
  }) => {
    // Filter options
    const categoryOptions = [
      { value: "electronics", label: "📱 Điện tử" },
      { value: "fashion", label: "👕 Thời trang" },
      { value: "home", label: "🏠 Gia dụng" },
      { value: "beauty", label: "💄 Làm đẹp" },
      { value: "sports", label: "⚽ Thể thao" },
      { value: "books", label: "📚 Sách" },
    ];

    const statusOptions = [
      { value: "active", label: "✅ Hoạt động" },
      { value: "inactive", label: "❌ Không hoạt động" },
      { value: "pending", label: "⏳ Chờ duyệt" },
      { value: "draft", label: "� Bản nháp" },
      { value: "out_of_stock", label: "� Hết hàng" },
    ];

    const priceOptions = [
      { value: "0-100000", label: "� Dưới 100K" },
      { value: "100000-500000", label: "💶 100K - 500K" },
      { value: "500000-1000000", label: "💷 500K - 1M" },
      { value: "1000000-", label: "💸 Trên 1M" },
    ];

    // Action buttons
    const actionButtons = [];

    // Add Product Button
    if (onAddProduct) {
      actionButtons.push({
        label: "Thêm sản phẩm",
        onClick: onAddProduct,
        
        className:
          "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white",
        title: "Thêm sản phẩm mới",
      });
    }

    // Export Button
    if (onExportProducts) {
      actionButtons.push({
        label: "Xuất Excel",
        onClick: onExportProducts,
        icon: ["fas", "file-export"],
        className:
          "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white",
        title: "Xuất dữ liệu Excel",
      });
    }

    return (
      <FilterContainer
        hasActiveFilters={hasActiveFilters}
        onResetFilters={onClearFilters}
        actionButtons={actionButtons}
      >
        {/* Search Input */}
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={onSearchChange}
          variant={variant}
          placeholder="Tìm kiếm sản phẩm..."
          size="compact"
          icon="fontawesome"
          debounceMs={0}
        />

        {/* Category Filter */}
        <FilterSelect
          value={selectedCategory}
          onChange={onCategoryChange}
          options={categoryOptions}
          placeholder="🏷️ Tất cả danh mục"
          gradientFrom="blue-400"
          gradientTo="blue-600"
          focusColor="blue-500"
        />

        {/* Status Filter */}
        <FilterSelect
          value={selectedStatus}
          onChange={onStatusChange}
          options={statusOptions}
          placeholder="📊 Tất cả trạng thái"
          gradientFrom="green-400"
          gradientTo="green-600"
          focusColor="green-500"
        />

        {/* Price Filter */}
        <FilterSelect
          value={selectedPrice}
          onChange={onPriceChange}
          options={priceOptions}
          placeholder="💰 Tất cả giá"
          gradientFrom="yellow-400"
          gradientTo="yellow-600"
          focusColor="yellow-500"
        />
      </FilterContainer>
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
