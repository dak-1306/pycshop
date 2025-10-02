import { useState, useEffect } from "react";
import {
  DEFAULT_STATS,
  MOCK_RECENT_ORDERS,
  DASHBOARD_ORDER_STATUS_COLORS,
} from "../constants/dashboardConstants";

export const useDashboard = () => {
  // State management
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [orderData, setOrderData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize dashboard data
  useEffect(() => {
    const initializeDashboard = async () => {
      setIsLoading(true);

      // Simulate API calls
      try {
        // In real app, these would be API calls
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate loading

        setStats(DEFAULT_STATS);
        setOrderData(MOCK_RECENT_ORDERS);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeDashboard();
  }, []);

  // Utility functions
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getStatusColor = (status) => {
    return (
      DASHBOARD_ORDER_STATUS_COLORS[status] ||
      DASHBOARD_ORDER_STATUS_COLORS.default
    );
  };

  const formatNumber = (number) => {
    return number.toLocaleString();
  };

  const getChangeIcon = (isPositive) => {
    return isPositive ? "↑" : "↓";
  };

  const getChangeColor = (isPositive) => {
    return isPositive ? "text-green-600" : "text-red-600";
  };

  // Stats processing
  const processedStats = {
    orders: {
      ...stats.orders,
      formattedValue: formatNumber(stats.orders.value),
      changeIcon: getChangeIcon(stats.orders.isPositive),
      changeColor: getChangeColor(stats.orders.isPositive),
    },
    revenue: {
      ...stats.revenue,
      formattedValue: formatCurrency(stats.revenue.value).split("₫")[0],
      changeIcon: getChangeIcon(stats.revenue.isPositive),
      changeColor: getChangeColor(stats.revenue.isPositive),
    },
    products: {
      ...stats.products,
      formattedValue: formatNumber(stats.products.value),
      changeIcon: getChangeIcon(stats.products.isPositive),
      changeColor: getChangeColor(stats.products.isPositive),
    },
    newCustomers: {
      ...stats.newCustomers,
      formattedValue: formatNumber(stats.newCustomers.value),
      changeIcon: getChangeIcon(stats.newCustomers.isPositive),
      changeColor: getChangeColor(stats.newCustomers.isPositive),
    },
  };

  // Actions (if needed for future enhancements)
  const refreshStats = async () => {
    setIsLoading(true);
    try {
      // In real app, this would refresh data from API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // For now, just reload the same data
      setStats({ ...DEFAULT_STATS });
    } catch (error) {
      console.error("Error refreshing stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshOrders = async () => {
    try {
      // In real app, this would refresh order data from API
      await new Promise((resolve) => setTimeout(resolve, 500));
      setOrderData([...MOCK_RECENT_ORDERS]);
    } catch (error) {
      console.error("Error refreshing orders:", error);
    }
  };

  return {
    // State
    stats: processedStats,
    orderData,
    isLoading,

    // Utility functions
    formatCurrency,
    getStatusColor,
    formatNumber,

    // Actions
    refreshStats,
    refreshOrders,
  };
};
