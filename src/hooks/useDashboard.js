import { useState, useEffect } from "react";
import {
  DEFAULT_STATS,
  MOCK_RECENT_ORDERS,
  MOCK_RECENT_USERS,
  MOCK_CHART_DATA,
  QUICK_ACTIONS,
  DASHBOARD_ORDER_STATUS_COLORS,
} from "../constants/dashboardConstants.jsx";

export const useDashboard = () => {
  // State management
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [recentOrders, setRecentOrders] = useState(MOCK_RECENT_ORDERS);
  const [recentUsers, setRecentUsers] = useState(MOCK_RECENT_USERS);
  const [chartData, setChartData] = useState(MOCK_CHART_DATA);
  const [quickActions] = useState(QUICK_ACTIONS);
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
        setRecentOrders(MOCK_RECENT_ORDERS);
        setRecentUsers(MOCK_RECENT_USERS);
        setChartData(MOCK_CHART_DATA);
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
    totalUsers: {
      value: stats.totalUsers,
      formattedValue: formatNumber(stats.totalUsers),
      label: "Tổng người dùng",
      icon: "👥",
    },
    totalOrders: {
      value: stats.totalOrders,
      formattedValue: formatNumber(stats.totalOrders),
      label: "Tổng đơn hàng",
      icon: "📦",
    },
    totalProducts: {
      value: stats.totalProducts,
      formattedValue: formatNumber(stats.totalProducts),
      label: "Tổng sản phẩm",
      icon: "🛍️",
    },
    totalRevenue: {
      value: stats.totalRevenue,
      formattedValue: formatCurrency(stats.totalRevenue),
      label: "Tổng doanh thu",
      icon: "💰",
    },
    todayOrders: {
      value: stats.todayOrders,
      formattedValue: formatNumber(stats.todayOrders),
      label: "Đơn hàng hôm nay",
      icon: "📈",
    },
    todayUsers: {
      value: stats.todayUsers,
      formattedValue: formatNumber(stats.todayUsers),
      label: "Người dùng mới",
      icon: "👤",
    },
    monthlyGrowth: {
      value: stats.monthlyGrowth,
      formattedValue: `${stats.monthlyGrowth}%`,
      label: "Tăng trưởng tháng",
      icon: "📊",
      changeIcon: getChangeIcon(true),
      changeColor: getChangeColor(true),
    },
    orderGrowth: {
      value: stats.orderGrowth,
      formattedValue: `${stats.orderGrowth}%`,
      label: "Tăng trưởng đơn hàng",
      icon: "🚀",
      changeIcon: getChangeIcon(true),
      changeColor: getChangeColor(true),
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
      setRecentOrders([...MOCK_RECENT_ORDERS]);
    } catch (error) {
      console.error("Error refreshing orders:", error);
    }
  };

  const refreshUsers = async () => {
    try {
      // In real app, this would refresh user data from API
      await new Promise((resolve) => setTimeout(resolve, 500));
      setRecentUsers([...MOCK_RECENT_USERS]);
    } catch (error) {
      console.error("Error refreshing users:", error);
    }
  };

  return {
    // State
    stats: processedStats,
    recentOrders,
    recentUsers,
    chartData,
    quickActions,
    isLoading,

    // Utility functions
    formatCurrency,
    getStatusColor,
    formatNumber,

    // Actions
    refreshStats,
    refreshOrders,
    refreshUsers,
  };
};
