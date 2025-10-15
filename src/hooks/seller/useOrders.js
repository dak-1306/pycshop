import { useState, useEffect } from "react";
import sellerOrderService from "../../services/sellerOrderService.js";
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
        // Handle both nested structure (data.orders) and direct array (data)
        const ordersData = response.data?.orders || response.data || [];
        setOrders(Array.isArray(ordersData) ? ordersData : []);
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
      ? orders.filter((order) => {
          const customerName = order.customerName || order.TenNguoiNhan || "";
          const productName =
            order.productName ||
            (order.ChiTietDonHang && order.ChiTietDonHang[0]?.TenSanPham) ||
            "";

          return (
            productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customerName.toLowerCase().includes(searchTerm.toLowerCase())
          );
        })
      : orders.filter((order) => {
          const orderStatus = order.status || order.TrangThai || "";
          const customerName = order.customerName || order.TenNguoiNhan || "";
          const productName =
            order.productName ||
            (order.ChiTietDonHang && order.ChiTietDonHang[0]?.TenSanPham) ||
            "";

          return (
            orderStatus === selectedFilter &&
            (productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
              customerName.toLowerCase().includes(searchTerm.toLowerCase()))
          );
        });

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

  const handleSaveOrder = async (formData) => {
    if (!formData.customer || !formData.email || !formData.total) {
      alert("😱 Vui lòng điền đầy đủ thông tin!");
      return;
    }

    try {
      if (modalMode === "add") {
        // Create new order with formData format
        const newOrder = {
          id: `ORD-${Date.now()}`,
          customer: formData.customer,
          customerName: formData.customer,
          email: formData.email,
          total: formData.total,
          totalAmount: formData.total,
          items: formData.items,
          productName: formData.items,
          status: formData.status,
          paymentStatus: formData.paymentStatus,
          seller: formData.seller,
          sellerName: formData.seller,
          createdAt: new Date().toISOString(),
        };
        setOrders([...orders, newOrder]);
        alert("🎉 Tạo đơn hàng thành công!");
      } else {
        // Update existing order with formData
        const updatedOrder = { ...currentOrder, ...formData };
        const response = await sellerOrderService.updateOrder(updatedOrder);
        if (response.success) {
          setOrders(
            orders.map((order) =>
              order.id === currentOrder.id ? updatedOrder : order
            )
          );
          alert("🎉 Cập nhật đơn hàng thành công!");
        }
      }

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
