import { useState, useEffect } from "react";
import {
  MOCK_ORDERS,
  DEFAULT_ORDER_STATS,
  ORDER_STATUS_COLORS,
} from "../constants/orderConstants";

export const useAdminOrders = () => {
  // State management
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [stats, setStats] = useState(DEFAULT_ORDER_STATS);
  const [isLoading, setIsLoading] = useState(true);

  // Filter states
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Modal states
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"

  // Form state for order modal
  const [orderForm, setOrderForm] = useState({
    customer: "",
    email: "",
    total: "",
    items: "",
    status: "pending",
    paymentStatus: "pending",
    seller: "",
  });

  // Initialize data
  useEffect(() => {
    const initializeOrders = async () => {
      setIsLoading(true);

      // Simulate API calls
      try {
        // In real app, these would be API calls
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate loading

        setOrders(MOCK_ORDERS);
        setStats(DEFAULT_ORDER_STATS);
        setTotalItems(MOCK_ORDERS.length);
        setTotalPages(Math.ceil(MOCK_ORDERS.length / 10));
      } catch (error) {
        console.error("Error loading orders data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeOrders();
  }, []);

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

  // Filtered orders based on search and filters
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customer.toLowerCase().includes(searchValue.toLowerCase()) ||
      order.id.toLowerCase().includes(searchValue.toLowerCase()) ||
      order.email.toLowerCase().includes(searchValue.toLowerCase());

    const matchesStatus = !statusFilter || order.status === statusFilter;
    const matchesPayment =
      !paymentFilter || order.paymentStatus === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  // CRUD Operations will be defined below

  const handleViewOrder = (orderId) => {
    console.log("View order:", orderId);
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      setSelectedOrder(order);
      setShowDetailModal(true);
    }
  };

  const handleDeleteOrder = (orderId) => {
    console.log("Delete order:", orderId);
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      setSelectedOrder(order);
      setShowDeleteModal(true);
    }
  };

  const handleEditOrder = (orderId) => {
    console.log("Edit order:", orderId);
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      setModalMode("edit");
      setSelectedOrder(order);
      setShowOrderModal(true);
    }
  };

  const handleAddOrder = () => {
    setModalMode("add");
    setSelectedOrder(null);
    setShowOrderModal(true);
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    console.log("Update order status:", orderId, newStatus);
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const confirmDeleteOrder = () => {
    if (selectedOrder) {
      setOrders(orders.filter((order) => order.id !== selectedOrder.id));
      // Update stats
      setStats((prev) => ({
        ...prev,
        totalOrders: prev.totalOrders - 1,
        completedOrders:
          selectedOrder.status === "completed"
            ? prev.completedOrders - 1
            : prev.completedOrders,
      }));
      setShowDeleteModal(false);
      setSelectedOrder(null);
    }
  };

  const handleSaveOrder = (formData) => {
    // Basic validation
    if (!formData.customer || !formData.email || !formData.total) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    if (modalMode === "add") {
      const newOrder = {
        id: `ORD-${Date.now()}`,
        ...formData,
        createdDate: new Date().toISOString().split("T")[0],
      };
      setOrders([...orders, newOrder]);
      setStats((prev) => ({
        ...prev,
        totalOrders: prev.totalOrders + 1,
        pendingOrders:
          formData.status === "pending"
            ? prev.pendingOrders + 1
            : prev.pendingOrders,
      }));
    } else if (modalMode === "edit" && selectedOrder) {
      setOrders(
        orders.map((order) =>
          order.id === selectedOrder.id ? { ...order, ...formData } : order
        )
      );
    }

    setShowOrderModal(false);
    setSelectedOrder(null);
  };

  // handleUpdateOrderStatus is defined above

  const handleExport = () => {
    // Mock export functionality
    const csvContent = [
      [
        "ID",
        "Khách hàng",
        "Email",
        "Tổng tiền",
        "Số lượng",
        "Trạng thái",
        "Thanh toán",
        "Ngày tạo",
        "Người bán",
      ],
      ...filteredOrders.map((order) => [
        order.id,
        order.customer,
        order.email,
        order.total,
        order.items,
        order.status,
        order.paymentStatus,
        order.createdDate,
        order.seller,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

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
    orders: filteredOrders,
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

    // Form state
    orderForm,
    setOrderForm,

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
  };
};
