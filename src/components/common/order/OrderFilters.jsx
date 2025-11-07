import React from "react";
import PropTypes from "prop-types";
import SearchBar from "../ui/SearchBar";
import FilterSelect from "../ui/FilterSelect";
import FilterContainer from "../ui/FilterContainer";

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

    // Filter options
    const statusOptions = [
      { value: "pending", label: "⏳ Chờ xử lý" },
      { value: "processing", label: "🔄 Đang xử lý" },
      { value: "completed", label: "✅ Hoàn thành" },
      { value: "cancelled", label: "❌ Đã hủy" },
    ];

    const paymentOptions = [
      { value: "paid", label: "💚 Đã thanh toán" },
      { value: "pending", label: "⏰ Chờ thanh toán" },
      { value: "failed", label: "� Thất bại" },
    ];

    // Action buttons
    const actionButtons = [];

    // Add Order Button - chỉ hiện với admin
    if (variant === "admin" && onAddOrder) {
      actionButtons.push({
        label: "Tạo đơn hàng",
        onClick: onAddOrder,
        icon: ["fas", "plus"],
        className:
          "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white",
        title: "Tạo đơn hàng mới",
      });
    }

    // Export Button
    if (onExport) {
      actionButtons.push({
        label: "Xuất báo cáo",
        onClick: onExport,
        icon: ["fas", "file-export"],
        className:
          "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white",
        title: "Xuất báo cáo đơn hàng",
      });
    }

    return (
      <FilterContainer
        hasActiveFilters={hasActiveFilters}
        onResetFilters={onResetFilters}
        actionButtons={actionButtons}
      >
        {/* Search Input */}
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={onSearchChange}
          variant={variant}
          placeholder="Tìm kiếm đơn hàng..."
          size="compact"
          icon="fontawesome"
        />

        {/* Status Filter */}
        <FilterSelect
          value={statusFilter}
          onChange={onStatusChange}
          options={statusOptions}
          placeholder="📦 Tất cả trạng thái"
          gradientFrom="blue-400"
          gradientTo="blue-600"
          focusColor="blue-500"
        />

        {/* Payment Filter */}
        <FilterSelect
          value={paymentFilter}
          onChange={onPaymentChange}
          options={paymentOptions}
          placeholder="💳 Tất cả thanh toán"
          gradientFrom="green-400"
          gradientTo="green-600"
          focusColor="green-500"
        />
      </FilterContainer>
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
