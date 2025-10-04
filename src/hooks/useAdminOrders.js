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

  // Event handlers
  const handleViewOrder = (order) => {
    console.log("View order:", order);
    // Implement view order logic
  };

  const handleUpdateOrder = (order) => {
    console.log("Update order:", order);
    // Implement update order logic
  };

  const handleCancelOrder = (order) => {
    console.log("Cancel order:", order);
    // Implement cancel order logic
  };

  const handleExport = () => {
    console.log("Export orders");
    // Implement export logic
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
    orders,
    stats: processedStats,
    isLoading,

    // Filter states
    searchValue,
    setSearchValue,
    statusFilter,
    setStatusFilter,
    paymentFilter,
    setPaymentFilter,

    // Utility functions
    formatCurrency,
    getStatusColor,
    formatNumber,

    // Event handlers
    handleViewOrder,
    handleUpdateOrder,
    handleCancelOrder,
    handleExport,
  };
};
