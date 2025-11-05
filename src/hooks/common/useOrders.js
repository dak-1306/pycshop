import { useState, useEffect, useCallback } from "react";
import { ORDER_STATUS_COLORS } from "../../lib/constants/index.js";

/**
 * Shared orders hook for both admin and seller
 * @param {Object} options Configuration object
 * @param {string} options.role - 'admin' or 'seller'
 * @param {Object} options.service - Service object with API methods
 * @param {Array} options.mockData - Optional mock data for development
 * @param {boolean} options.canDelete - Whether user can delete orders
 * @param {number} options.pageSize - Items per page
 * @param {Object} options.initialStats - Initial stats for admin
 */
export const useOrdersCommon = (options = {}) => {
  const {
    role = "seller",
    service = null,
    mockData = null,
    canDelete = false,
    pageSize = 10,
    initialStats = null,
  } = options;

  // Core state
  const [orders, setOrders] = useState(mockData || []);
  const [isLoading, setIsLoading] = useState(!mockData);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(initialStats);

  // Filter and pagination state
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal states
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalMode, setModalMode] = useState("add");

  // Load orders from API or use mock data
  const loadOrders = useCallback(async () => {
    if (mockData) {
      setOrders(mockData);
      setIsLoading(false);
      return;
    }

    if (!service?.getOrders && !service?.getSellerOrders) {
      console.warn("No service provided for loading orders");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const fetchMethod =
        role === "admin"
          ? service.getOrders || service.getAdminOrders
          : service.getSellerOrders || service.getOrders;

      const response = await fetchMethod({
        page: currentPage,
        limit: pageSize,
        search: searchValue,
        status:
          statusFilter !== "Tất cả" && statusFilter ? statusFilter : undefined,
        paymentStatus: paymentFilter || undefined,
      });

      const ordersData =
        response?.data?.orders || response?.data || response || [];
      setOrders(Array.isArray(ordersData) ? ordersData : []);
    } catch (err) {
      console.error(`Error loading ${role} orders:`, err);
      setError(`Failed to load ${role} orders`);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, [
    service,
    mockData,
    role,
    currentPage,
    pageSize,
    searchValue,
    statusFilter,
    paymentFilter,
  ]);

  // Load orders on mount and when filters change
  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Filtering logic
  const filteredOrders = orders.filter((order) => {
    // Handle different data structures
    const customerName =
      order.customer || order.customerName || order.TenNguoiNhan || "";
    const orderId = order.id || order.ID_DonHang || "";
    const email = order.email || order.Email || "";
    const orderStatus = order.status || order.TrangThai || "";
    const paymentStatus = order.paymentStatus || order.TrangThaiThanhToan || "";
    const productName =
      order.productName ||
      (order.ChiTietDonHang && order.ChiTietDonHang[0]?.TenSanPham) ||
      order.items ||
      "";

    // Search matching
    const matchesSearch =
      !searchValue ||
      String(customerName || "")
        .toLowerCase()
        .includes(searchValue.toLowerCase()) ||
      String(orderId || "")
        .toLowerCase()
        .includes(searchValue.toLowerCase()) ||
      String(email || "")
        .toLowerCase()
        .includes(searchValue.toLowerCase()) ||
      String(productName || "")
        .toLowerCase()
        .includes(searchValue.toLowerCase());

    // Status filtering
    const matchesStatus =
      !statusFilter ||
      statusFilter === "Tất cả" ||
      orderStatus === statusFilter;
    const matchesPayment = !paymentFilter || paymentStatus === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / pageSize);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Utility functions
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);
  };

  const getStatusColor = (status) => {
    return ORDER_STATUS_COLORS[status] || ORDER_STATUS_COLORS.default;
  };

  const formatNumber = (number) => {
    return (number || 0).toLocaleString();
  };

  // CRUD Operations
  const handleViewOrder = (orderId) => {
    const order = orders.find((o) => (o.id || o.ID_DonHang) === orderId);
    if (order) {
      setSelectedOrder(order);
      setShowDetailModal(true);
    }
  };

  const handleEditOrder = (orderId) => {
    const order = orders.find((o) => (o.id || o.ID_DonHang) === orderId);
    if (order) {
      setSelectedOrder(order);
      setModalMode("edit");
      setShowOrderModal(true);
    }
  };

  const handleAddOrder = () => {
    setModalMode("add");
    setSelectedOrder(null);
    setShowOrderModal(true);
  };

  const handleDeleteOrder = (orderId) => {
    if (!canDelete) {
      alert(`${role === "seller" ? "Seller" : "User"} không thể xóa đơn hàng!`);
      return;
    }

    const order = orders.find((o) => (o.id || o.ID_DonHang) === orderId);
    if (order) {
      setSelectedOrder(order);
      setShowDeleteModal(true);
    }
  };

  const handleSaveOrder = async (formData) => {
    // Basic validation
    if (!formData.customer || !formData.email || !formData.total) {
      alert("😱 Vui lòng điền đầy đủ thông tin!");
      return;
    }

    try {
      if (modalMode === "add") {
        const newOrder = {
          id: `ORD-${Date.now()}`,
          customer: formData.customer,
          customerName: formData.customer,
          email: formData.email,
          total: formData.total,
          totalAmount: formData.total,
          items: formData.items,
          productName: formData.items,
          status: formData.status || "pending",
          paymentStatus: formData.paymentStatus || "pending",
          seller: formData.seller,
          sellerName: formData.seller,
          createdAt: new Date().toISOString(),
          createdDate: new Date().toISOString().split("T")[0],
        };

        // Call API if service available
        if (service?.createOrder) {
          await service.createOrder(newOrder);
          await loadOrders(); // Reload from server
        } else {
          setOrders([...orders, newOrder]);
        }

        // Update stats for admin
        if (stats && setStats) {
          setStats((prev) => ({
            ...prev,
            totalOrders: prev.totalOrders + 1,
            pendingOrders:
              newOrder.status === "pending"
                ? prev.pendingOrders + 1
                : prev.pendingOrders,
          }));
        }

        alert("🎉 Tạo đơn hàng thành công!");
      } else if (modalMode === "edit" && selectedOrder) {
        const updatedOrder = { ...selectedOrder, ...formData };

        // Call API if service available
        if (service?.updateOrder) {
          const response = await service.updateOrder(updatedOrder);
          if (response?.success) {
            await loadOrders(); // Reload from server
          }
        } else {
          setOrders(
            orders.map((order) =>
              (order.id || order.ID_DonHang) ===
              (selectedOrder.id || selectedOrder.ID_DonHang)
                ? updatedOrder
                : order
            )
          );
        }

        alert("🎉 Cập nhật đơn hàng thành công!");
      }

      handleCloseOrderModal();
    } catch (error) {
      console.error("Error saving order:", error);
      alert("❌ Lỗi khi lưu đơn hàng: " + (error.message || "Unknown error"));
    }
  };

  const confirmDeleteOrder = async () => {
    if (!selectedOrder || !canDelete) return;

    try {
      // Call API if service available
      if (service?.deleteOrder) {
        const response = await service.deleteOrder(
          selectedOrder.id || selectedOrder.ID_DonHang
        );
        if (response?.success) {
          await loadOrders(); // Reload from server
        }
      } else {
        setOrders(
          orders.filter(
            (order) =>
              (order.id || order.ID_DonHang) !==
              (selectedOrder.id || selectedOrder.ID_DonHang)
          )
        );
      }

      // Update stats for admin
      if (stats && setStats) {
        setStats((prev) => ({
          ...prev,
          totalOrders: prev.totalOrders - 1,
          completedOrders:
            selectedOrder.status === "completed"
              ? prev.completedOrders - 1
              : prev.completedOrders,
        }));
      }

      setShowDeleteModal(false);
      setSelectedOrder(null);
      alert("🗑️ Xóa đơn hàng thành công!");
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("❌ Lỗi khi xóa đơn hàng: " + (error.message || "Unknown error"));
    }
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        const currentId = order.id || order.ID_DonHang;
        return currentId === orderId ? { ...order, status: newStatus } : order;
      })
    );
  };

  // Modal handlers
  const handleCloseOrderModal = () => {
    setShowOrderModal(false);
    setSelectedOrder(null);
    setModalMode("add");
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedOrder(null);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedOrder(null);
  };

  // Filter handlers
  const handleFilterChange = (filter) => {
    setStatusFilter(filter);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchValue("");
    setStatusFilter("");
    setPaymentFilter("");
    setCurrentPage(1);
  };

  // Export functionality
  const handleExport = () => {
    try {
      const headers = [
        "ID",
        "Khách hàng",
        "Email",
        "Tổng tiền",
        "Số lượng",
        "Trạng thái",
        "Thanh toán",
        "Ngày tạo",
        "Người bán",
      ];

      const csvContent = [
        headers,
        ...filteredOrders.map((order) => [
          order.id || order.ID_DonHang || "",
          order.customer || order.customerName || order.TenNguoiNhan || "",
          order.email || order.Email || "",
          order.total || order.totalAmount || order.TongTien || "",
          order.items || order.productName || "",
          order.status || order.TrangThai || "",
          order.paymentStatus || order.TrangThaiThanhToan || "",
          order.createdDate || order.createdAt || order.NgayTao || "",
          order.seller || order.sellerName || order.TenNguoiBan || "",
        ]),
      ]
        .map((row) => row.join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `orders_${role}_${
        new Date().toISOString().split("T")[0]
      }.csv`;
      link.click();
      window.URL.revokeObjectURL(url);

      alert("📊 Đã xuất dữ liệu thành công!");
    } catch (error) {
      console.error("Export error:", error);
      alert("❌ Lỗi khi xuất dữ liệu!");
    }
  };

  return {
    // Core data
    orders: paginatedOrders,
    allOrders: filteredOrders,
    isLoading,
    error,
    stats,

    // Filter & pagination
    searchValue,
    setSearchValue,
    statusFilter,
    setStatusFilter,
    paymentFilter,
    setPaymentFilter,
    currentPage,
    setCurrentPage,
    totalPages,
    pageSize,

    // Modal states
    showOrderModal,
    showDetailModal,
    showDeleteModal,
    selectedOrder,
    modalMode,

    // CRUD operations
    handleViewOrder,
    handleEditOrder,
    handleAddOrder,
    handleDeleteOrder,
    handleSaveOrder,
    confirmDeleteOrder,
    handleUpdateOrderStatus,

    // Modal handlers
    handleCloseOrderModal,
    handleCloseDetailModal,
    handleCloseDeleteModal,

    // Filter handlers
    handleFilterChange,
    handleResetFilters,

    // Utilities
    formatCurrency,
    getStatusColor,
    formatNumber,
    handleExport,

    // Refresh function
    refresh: loadOrders,
  };
};

export default useOrdersCommon;
