import { sellerOrderService } from "../../lib/services/order.js";
import useOrdersCommon from "../common/useOrders.js";
import { SELLER_CONSTANTS } from "../../lib/constants/index.js";

export const useOrders = () => {
  // Use common hook with seller-specific configuration
  const commonHook = useOrdersCommon({
    role: "seller",
    service: sellerOrderService,
    canDelete: false, // Sellers cannot delete orders
    pageSize: 10,
  });

  // Seller-specific state for backward compatibility
  const currentOrder =
    commonHook.selectedOrder || SELLER_CONSTANTS.DEFAULT_ORDER;
  const orderToDelete = commonHook.selectedOrder;

  // Map common hook's search to seller's searchTerm for backward compatibility
  const searchTerm = commonHook.searchValue;
  const setSearchTerm = commonHook.setSearchValue;
  const selectedFilter = commonHook.statusFilter || "Tất cả";
  const setSelectedFilter = (filter) =>
    commonHook.setStatusFilter(filter === "Tất cả" ? "" : filter);

  const isLoading = commonHook.isLoading;
  const error = commonHook.error;
  const totalPages = commonHook.totalPages;
  const currentPage = commonHook.currentPage;
  const setCurrentPage = commonHook.setCurrentPage;

  // Use common hook's modal states and handlers
  const modalMode = commonHook.modalMode;
  const showOrderModal = commonHook.showOrderModal;
  const showDetailModal = commonHook.showDetailModal;
  const showDeleteModal = commonHook.showDeleteModal;

  // Seller-specific functions using common hook
  const handleViewOrder = commonHook.handleViewOrder;
  const handleEditOrder = commonHook.handleEditOrder;
  const handleAddOrder = commonHook.handleAddOrder;
  const handleSaveOrder = commonHook.handleSaveOrder;
  const handleDeleteOrder = commonHook.handleDeleteOrder;
  const confirmDeleteOrder = commonHook.confirmDeleteOrder;

  // Modal operations from common hook
  const handleCloseOrderModal = commonHook.handleCloseOrderModal;
  const handleCloseDetailModal = commonHook.handleCloseDetailModal;
  const handleCloseDeleteModal = commonHook.handleCloseDeleteModal;

  // Filter operations
  const handleResetFilters = () => {
    commonHook.setSearchValue("");
    commonHook.setStatusFilter("");
    commonHook.setCurrentPage(1);
  };

  // Add aliases for backward compatibility
  const handleCancelOrder = handleDeleteOrder;
  const confirmCancelOrder = confirmDeleteOrder;

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    commonHook.setCurrentPage(1);
  };

  // Use common hook utilities
  const handleExport = commonHook.handleExport;
  const formatCurrency = commonHook.formatCurrency;
  const getStatusColor = commonHook.getStatusColor;
  const formatNumber = commonHook.formatNumber;

  return {
    // State (mapped for backward compatibility)
    orders: commonHook.orders,
    currentOrder,
    setCurrentOrder: (order) =>
      commonHook.setSelectedOrder && commonHook.setSelectedOrder(order),
    modalMode,
    showOrderModal,
    showDetailModal,
    showDeleteModal,
    orderToDelete,
    searchTerm,
    setSearchTerm,
    selectedFilter,
    setSelectedFilter,
    currentPage,
    setCurrentPage,
    totalPages,
    isLoading,
    error,

    // Actions
    handleViewOrder,
    handleEditOrder,
    handleAddOrder,
    handleSaveOrder,
    handleDeleteOrder,
    confirmDeleteOrder,
    handleCancelOrder,
    confirmCancelOrder,
    handleCloseOrderModal,
    handleCloseDetailModal,
    handleCloseDeleteModal,
    handleFilterChange,
    handleResetFilters,
    handleExport,

    // Utility functions
    formatCurrency,
    getStatusColor,
    formatNumber,

    // Constants
    // Return array form for UI filters (backwards-compatible mapping)
    orderStatuses:
      SELLER_CONSTANTS.ORDER_STATUSES_ARRAY ||
      Object.values(SELLER_CONSTANTS.ORDER_STATUSES),
    orderCategories: SELLER_CONSTANTS.ORDER_CATEGORIES,

    // Additional common hook features
    refresh: commonHook.refresh,
  };
};
