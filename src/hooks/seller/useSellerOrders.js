import { useState, useEffect } from "react";
import {
  getSellerOrders,
  updateSellerOrderStatus,
} from "../../lib/services/order";
import { useToast } from "../useToast";

export const useSellerOrders = () => {
  // State
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);

  // Filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Modals
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const { showSuccess, showError, showWarning } = useToast();

  // Load seller orders
  const loadOrders = async (page = 1, status = "all") => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page,
        limit: 10,
        status: status !== "all" ? status : undefined,
      };

      const response = await getSellerOrders(params);

      if (response.success) {
        setOrders(response.data || []);
        setTotalPages(response.pagination?.totalPages || 1);
        setTotalOrders(response.pagination?.totalOrders || 0);
        setCurrentPage(page);
      } else {
        throw new Error(response.message || "Không thể tải danh sách đơn hàng");
      }
    } catch (error) {
      console.error("Error loading seller orders:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Lỗi khi tải danh sách đơn hàng"
      );
      showError(
        error.response?.data?.message ||
          error.message ||
          "Lỗi khi tải danh sách đơn hàng"
      );
    } finally {
      setLoading(false);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setLoading(true);

      const response = await updateSellerOrderStatus(orderId, newStatus);

      if (response.success) {
        // Update local state
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.orderId === orderId ? { ...order, status: newStatus } : order
          )
        );

        showSuccess(`Đã cập nhật trạng thái đơn hàng #${orderId} thành công!`);

        // Reload orders to get fresh data
        await loadOrders(currentPage, statusFilter);
      } else {
        throw new Error(
          response.message || "Không thể cập nhật trạng thái đơn hàng"
        );
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      showError(error.message || "Lỗi khi cập nhật trạng thái đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  // Handle status filter change
  const handleStatusFilter = async (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
    await loadOrders(1, status);
  };

  // Handle page change
  const handlePageChange = async (page) => {
    await loadOrders(page, statusFilter);
  };

  // Handle view order detail
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  // Handle edit order
  const handleEditOrder = (order) => {
    setSelectedOrder(order);
    setShowEditModal(true);
  };

  // Handle save order (update status)
  const handleSaveOrder = async (updatedOrder) => {
    try {
      await updateOrderStatus(
        updatedOrder.orderId || updatedOrder.id,
        updatedOrder.status
      );
      setShowEditModal(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error("Error saving order:", error);
    }
  };

  // Close modals
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedOrder(null);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedOrder(null);
  };

  // Get status display info
  const getStatusInfo = (status) => {
    const statusMap = {
      pending: {
        label: "Chờ xác nhận",
        color: "bg-yellow-100 text-yellow-800",
        icon: "fa-clock",
      },
      confirmed: {
        label: "Đã xác nhận",
        color: "bg-blue-100 text-blue-800",
        icon: "fa-check-circle",
      },
      shipped: {
        label: "Đang giao hàng",
        color: "bg-orange-100 text-orange-800",
        icon: "fa-truck",
      },
      delivered: {
        label: "Đã giao hàng",
        color: "bg-green-100 text-green-800",
        icon: "fa-check",
      },
      cancelled: {
        label: "Đã hủy",
        color: "bg-red-100 text-red-800",
        icon: "fa-times",
      },
    };
    return (
      statusMap[status] || {
        label: status,
        color: "bg-gray-100 text-gray-800",
        icon: "fa-question",
      }
    );
  };

  // Filter orders by search term
  const getFilteredOrders = () => {
    if (!searchTerm) return orders;

    return orders.filter(
      (order) =>
        order.buyerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.buyerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.orderId?.toString().includes(searchTerm) ||
        order.items?.some((item) =>
          item.productName?.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
  };

  // Load orders on mount
  useEffect(() => {
    loadOrders();
  }, []);

  return {
    // State
    orders: getFilteredOrders(),
    loading,
    error,

    // Pagination
    currentPage,
    totalPages,
    totalOrders,

    // Filters
    statusFilter,
    searchTerm,
    setSearchTerm,

    // Modals
    selectedOrder,
    showEditModal,
    showDetailModal,

    // Actions
    loadOrders,
    updateOrderStatus,
    handleStatusFilter,
    handlePageChange,
    handleViewOrder,
    handleEditOrder,
    handleSaveOrder,
    handleCloseEditModal,
    handleCloseDetailModal,

    // Utils
    getStatusInfo,
  };
};

export default useSellerOrders;
