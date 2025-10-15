import useOrdersCommon from "../common/useOrders.js";
import {
  MOCK_ORDERS,
  DEFAULT_ORDER_STATS,
} from "../../lib/constants/orderConstants.js";

export const useAdminOrders = () => {
  // Use common hook with admin-specific configuration
  const commonHook = useOrdersCommon({
    role: "admin",
    service: null, // Using mock data for now
    mockData: MOCK_ORDERS,
    canDelete: true, // Admins can delete orders
    pageSize: 10,
    initialStats: DEFAULT_ORDER_STATS,
  });

  // Use common hook's functions and state
  const orders = commonHook.allOrders; // Get all filtered orders for admin
  const isLoading = commonHook.isLoading;
  const stats = commonHook.stats || DEFAULT_ORDER_STATS;

  // Filter states from common hook
  const searchValue = commonHook.searchValue;
  const setSearchValue = commonHook.setSearchValue;
  const statusFilter = commonHook.statusFilter;
  const setStatusFilter = commonHook.setStatusFilter;
  const paymentFilter = commonHook.paymentFilter;
  const setPaymentFilter = commonHook.setPaymentFilter;

  // Modal states from common hook
  const showOrderModal = commonHook.showOrderModal;
  const setShowOrderModal = (show) =>
    show ? commonHook.handleAddOrder() : commonHook.handleCloseOrderModal();
  const showDetailModal = commonHook.showDetailModal;
  const setShowDetailModal = (show) =>
    show ? null : commonHook.handleCloseDetailModal();
  const showDeleteModal = commonHook.showDeleteModal;
  const setShowDeleteModal = (show) =>
    show ? null : commonHook.handleCloseDeleteModal();
  const selectedOrder = commonHook.selectedOrder;
  const modalMode = commonHook.modalMode;

  // Pagination from common hook
  const currentPage = commonHook.currentPage;
  const setCurrentPage = commonHook.setCurrentPage;
  const totalItems = orders.length;
  const totalPages = commonHook.totalPages;

  // CRUD Operations from common hook
  const handleViewOrder = commonHook.handleViewOrder;
  const handleDeleteOrder = commonHook.handleDeleteOrder;
  const handleEditOrder = commonHook.handleEditOrder;
  const handleAddOrder = commonHook.handleAddOrder;
  const handleUpdateOrderStatus = commonHook.handleUpdateOrderStatus;
  const confirmDeleteOrder = commonHook.confirmDeleteOrder;
  const handleSaveOrder = commonHook.handleSaveOrder;
  const handleExport = commonHook.handleExport;

  // Utility functions from common hook
  const formatCurrency = commonHook.formatCurrency;
  const getStatusColor = commonHook.getStatusColor;
  const formatNumber = commonHook.formatNumber;

  // Processed stats
  const processedStats = {
    totalOrders: {
      value: stats.totalOrders,
      formattedValue: formatNumber(stats.totalOrders),
      label: "Tổng đơn hàng",
      icon: "📦",
    },
    pendingOrders: {
      value: stats.pendingOrders,
      formattedValue: formatNumber(stats.pendingOrders),
      label: "Đơn chờ xử lý",
      icon: "⏳",
    },
    completedOrders: {
      value: stats.completedOrders,
      formattedValue: formatNumber(stats.completedOrders),
      label: "Đơn hoàn thành",
      icon: "✅",
    },
    totalRevenue: {
      value: stats.totalRevenue,
      formattedValue: formatCurrency(stats.totalRevenue),
      label: "Tổng doanh thu",
      icon: "💰",
    },
  };

  return {
    // State
    orders: commonHook.orders, // Use paginated orders
    stats: processedStats,
    isLoading,

    // Filter states
    searchValue,
    setSearchValue,
    statusFilter,
    setStatusFilter,
    paymentFilter,
    setPaymentFilter,

    // Modal states
    showOrderModal,
    setShowOrderModal,
    showDetailModal,
    setShowDetailModal,
    showDeleteModal,
    setShowDeleteModal,
    selectedOrder,
    modalMode,

    // Form state - simplified for admin
    orderForm: selectedOrder || {
      customer: "",
      email: "",
      total: "",
      items: "",
      status: "pending",
      paymentStatus: "pending",
      seller: "",
    },
    setOrderForm: () => {}, // Admin uses modal directly

    // Utility functions
    formatCurrency,
    getStatusColor,
    formatNumber,

    // Pagination states
    currentPage,
    setCurrentPage,
    totalItems,
    totalPages,

    // CRUD handlers
    handleAddOrder,
    handleEditOrder,
    handleViewOrder,
    handleDeleteOrder,
    handleSaveOrder,
    handleUpdateOrderStatus,
    confirmDeleteOrder,
    handleExport,

    // Additional common hook features
    refresh: commonHook.refresh,
  };
};
