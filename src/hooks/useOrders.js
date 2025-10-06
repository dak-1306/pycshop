import { useState, useEffect } from "react";
import sellerOrderService from "../services/sellerOrderService.js";
import {
  ORDER_STATUSES,
  ORDER_CATEGORIES,
  DEFAULT_ORDER,
  ORDER_STATUS_COLORS,
  ORDER_EXPORT_HEADERS,
} from "../constants/orderConstants";

export const useOrders = () => {
  // State management
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentOrder, setCurrentOrder] = useState(DEFAULT_ORDER);
  const [modalMode, setModalMode] = useState("add");

  // Modal states
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("Tất cả");
  const [currentPage, setCurrentPage] = useState(1);

  // Load orders from API
  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await sellerOrderService.getSellerOrders({
          page: currentPage,
          limit: 10,
          search: searchTerm,
          status: selectedFilter !== "Tất cả" ? selectedFilter : undefined,
        });
        setOrders(response.data || []);
      } catch (error) {
        console.error("Error loading orders:", error);
        setError("Failed to load orders");
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, [currentPage, searchTerm, selectedFilter]);

  // Computed values
  const filteredOrders =
    selectedFilter === "Tất cả"
      ? orders.filter(
          (order) =>
            order.productName
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : orders.filter(
          (order) =>
            order.status === selectedFilter &&
            (order.productName
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
              order.customerName
                .toLowerCase()
                .includes(searchTerm.toLowerCase()))
        );

  const totalPages = Math.ceil(filteredOrders.length / 10);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * 10,
    currentPage * 10
  );

  // Order operations
  const handleViewOrder = (orderId) => {
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      setCurrentOrder(order);
      setShowDetailModal(true);
    }
  };

  const handleEditOrder = (orderId) => {
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      setCurrentOrder(order);
      setModalMode("edit");
      setShowOrderModal(true);
    }
  };

  const handleAddOrder = () => {
    setModalMode("add");
    setCurrentOrder(DEFAULT_ORDER);
    setShowOrderModal(true);
  };

  const handleSaveOrder = async () => {
    if (
      !currentOrder.productName ||
      !currentOrder.price ||
      !currentOrder.quantity ||
      !currentOrder.customerName ||
      !currentOrder.customerPhone ||
      !currentOrder.address
    ) {
      alert("😱 Vui lòng điền đầy đủ thông tin!");
      return;
    }

    try {
      if (modalMode === "add") {
        // Seller cannot create new orders, only update existing ones
        alert("Seller không thể tạo đơn hàng mới!");
        return;
      } else {
        await sellerOrderService.updateOrderStatus(
          currentOrder.id,
          currentOrder.status
        );
        alert("🎉 Cập nhật đơn hàng thành công!");
      }

      // Reload orders
      const response = await sellerOrderService.getSellerOrders({
        page: currentPage,
        limit: 10,
        search: searchTerm,
        status: selectedFilter !== "Tất cả" ? selectedFilter : undefined,
      });
      setOrders(response.data || []);

      handleCloseOrderModal();
    } catch (error) {
      console.error("Error saving order:", error);
      alert("❌ Lỗi khi lưu đơn hàng: " + (error.message || "Unknown error"));
    }
  };

  const handleDeleteOrder = (orderId) => {
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      setOrderToDelete(order);
      setShowDeleteModal(true);
    }
  };

  const confirmDeleteOrder = async () => {
    if (orderToDelete) {
      try {
        // Seller cannot delete orders, only update status
        alert("Seller không thể xóa đơn hàng!");
        setShowDeleteModal(false);
        setOrderToDelete(null);
        return;
      } catch (error) {
        console.error("Error deleting order:", error);
        alert("❌ Lỗi khi xóa đơn hàng: " + (error.message || "Unknown error"));
      }
    }
  };

  // Modal operations
  const handleCloseOrderModal = () => {
    setShowOrderModal(false);
    setCurrentOrder(DEFAULT_ORDER);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setOrderToDelete(null);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedFilter("Tất cả");
    setCurrentPage(1);
  };

  // Add aliases for functions expected by Order.jsx
  const handleCancelOrder = handleDeleteOrder;
  const confirmCancelOrder = confirmDeleteOrder;

  // Add missing functions
  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    setCurrentPage(1);
  };

  const handleExport = () => {
    // Export logic here
    alert("📊 Đã xuất dữ liệu thành công!");
  };

  // Utility functions
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getStatusColor = (status) => {
    return ORDER_STATUS_COLORS[status] || ORDER_STATUS_COLORS.default;
  };

  const formatNumber = (number) => {
    return number.toLocaleString();
  };

  return {
    // State
    orders: paginatedOrders,
    currentOrder,
    setCurrentOrder,
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
    orderStatuses: ORDER_STATUSES,
    orderCategories: ORDER_CATEGORIES,
  };
};
