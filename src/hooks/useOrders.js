import { useState, useEffect } from "react";
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

  // Mock data initialization
  useEffect(() => {
    setOrders([
      {
        id: 1,
        image: null,
        productName: "iPhone 15 Pro Max 256GB",
        price: "29,990,000",
        quantity: 1,
        category: "Điện thoại",
        status: "Đang giao",
        customerName: "Nguyễn Văn A",
        customerPhone: "0123456789",
        address: "123 Đường ABC, Quận 1, TP.HCM",
        actions: ["view", "edit"],
      },
      {
        id: 2,
        image: null,
        productName: "Samsung Galaxy S24 Ultra",
        price: "26,990,000",
        quantity: 2,
        category: "Điện thoại",
        status: "Hoàn tất",
        customerName: "Trần Thị B",
        customerPhone: "0987654321",
        address: "456 Đường XYZ, Quận 2, TP.HCM",
        actions: ["view", "edit"],
      },
      {
        id: 3,
        image: null,
        productName: "MacBook Air M3 15 inch",
        price: "34,990,000",
        quantity: 1,
        category: "Laptop",
        status: "Đang xử lý",
        customerName: "Lê Văn C",
        customerPhone: "0369258147",
        address: "789 Đường DEF, Quận 3, TP.HCM",
        actions: ["view", "edit"],
      },
      {
        id: 4,
        image: null,
        productName: "iPad Pro 12.9 inch M2",
        price: "24,990,000",
        quantity: 1,
        category: "Máy tính bảng",
        status: "Đã hủy",
        customerName: "Phạm Thị D",
        customerPhone: "0741852963",
        address: "321 Đường GHI, Quận 4, TP.HCM",
        actions: ["view", "edit"],
      },
      {
        id: 5,
        image: null,
        productName: "AirPods Pro 2nd Gen",
        price: "6,990,000",
        quantity: 3,
        category: "Phụ kiện",
        status: "Hoàn tất",
        customerName: "Hoàng Văn E",
        customerPhone: "0852741963",
        address: "654 Đường JKL, Quận 5, TP.HCM",
        actions: ["view", "edit"],
      },
      {
        id: 6,
        image: null,
        productName: "Apple Watch Series 9",
        price: "9,990,000",
        quantity: 1,
        category: "Phụ kiện",
        status: "Đang giao",
        customerName: "Vũ Thị F",
        customerPhone: "0963852741",
        address: "987 Đường MNO, Quận 6, TP.HCM",
        actions: ["view", "edit"],
      },
    ]);
  }, []);

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

  // Order actions
  const handleViewOrder = (orderId) => {
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      setCurrentOrder(order);
      setShowDetailModal(true);
    }
  };

  const handleAddOrder = () => {
    setModalMode("add");
    setCurrentOrder(DEFAULT_ORDER);
    setShowOrderModal(true);
  };

  const handleEditOrder = (orderId) => {
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      setModalMode("edit");
      setCurrentOrder({
        ...order,
        price: order.price.replace(/,/g, ""), // Remove commas for editing
      });
      setShowOrderModal(true);
    }
  };

  const handleSaveOrder = () => {
    if (
      !currentOrder.productName ||
      !currentOrder.price ||
      !currentOrder.quantity ||
      !currentOrder.customerName ||
      !currentOrder.customerPhone
    ) {
      alert("😱 Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    if (modalMode === "add") {
      const newOrder = {
        id: orders.length + 1,
        productName: currentOrder.productName,
        price: Number(currentOrder.price).toLocaleString(),
        quantity: Number(currentOrder.quantity),
        category: currentOrder.category || "Khác",
        status: currentOrder.status,
        customerName: currentOrder.customerName,
        customerPhone: currentOrder.customerPhone,
        address: currentOrder.address,
        image: null,
        actions: ["view", "edit"],
      };
      setOrders([...orders, newOrder]);
      alert("🎉 Thêm đơn hàng thành công!");
    } else {
      const updatedOrders = orders.map((order) =>
        order.id === currentOrder.id
          ? {
              ...currentOrder,
              price: Number(currentOrder.price).toLocaleString(),
              quantity: Number(currentOrder.quantity),
            }
          : order
      );
      setOrders(updatedOrders);
      alert("🎉 Cập nhật đơn hàng thành công!");
    }

    handleCloseOrderModal();
  };

  const handleDeleteOrder = (orderId) => {
    const order = orders.find((o) => o.id === orderId);
    setOrderToDelete(order);
    setShowDeleteModal(true);
  };

  const confirmDeleteOrder = () => {
    if (orderToDelete) {
      setOrders(orders.filter((order) => order.id !== orderToDelete.id));
      setShowDeleteModal(false);
      setOrderToDelete(null);
      alert("🗑️ Đã xóa đơn hàng thành công!");
    }
  };

  // Modal handlers
  const handleCloseOrderModal = () => {
    setShowOrderModal(false);
    setCurrentOrder(DEFAULT_ORDER);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setCurrentOrder(DEFAULT_ORDER);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setOrderToDelete(null);
  };

  // Filter actions
  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedFilter("Tất cả");
    setCurrentPage(1);
  };

  // Export functionality
  const handleExport = () => {
    const csvContent = [
      ORDER_EXPORT_HEADERS.join(","),
      ...filteredOrders.map((order) =>
        [
          order.id,
          `"${order.productName}"`,
          `"${order.price}"`,
          order.quantity,
          `"${order.category}"`,
          `"${order.status}"`,
          `"${order.customerName || "N/A"}"`,
          `"${order.customerPhone || "N/A"}"`,
          `"${order.address || "N/A"}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `don-hang-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    alert("📊 Đã xuất dữ liệu thành công!");
  };

  // Helper functions
  const getStatusColor = (status) => {
    return ORDER_STATUS_COLORS[status] || ORDER_STATUS_COLORS.default;
  };

  return {
    // State
    orders: filteredOrders,
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

    // Actions
    handleViewOrder,
    handleAddOrder,
    handleEditOrder,
    handleSaveOrder,
    handleDeleteOrder,
    confirmDeleteOrder,
    handleCloseOrderModal,
    handleCloseDetailModal,
    handleCloseDeleteModal,
    handleFilterChange,
    handleResetFilters,
    handleExport,
    getStatusColor,

    // Constants
    orderStatuses: ORDER_STATUSES,
    orderCategories: ORDER_CATEGORIES,
  };
};
