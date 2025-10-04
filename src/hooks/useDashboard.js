import { useState, useEffect } from "react";
import {
  MOCK_RECENT_ORDERS,
  MOCK_RECENT_USERS,
  MOCK_CHART_DATA,
  DASHBOARD_ORDER_STATUS_COLORS,
} from "../constants/dashboardConstants.jsx";

export const useDashboard = () => {
  // State management
  const [recentOrders, setRecentOrders] = useState(MOCK_RECENT_ORDERS);
  const [recentUsers, setRecentUsers] = useState(MOCK_RECENT_USERS);
  const [chartData, setChartData] = useState(MOCK_CHART_DATA);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize dashboard data
  useEffect(() => {
    const initializeDashboard = async () => {
      setIsLoading(true);

      // Simulate API calls
      try {
        // In real app, these would be API calls
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate loading

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
    recentOrders,
    recentUsers,
    chartData,
    isLoading,

    // Utility functions
    formatCurrency,
    getStatusColor,
    formatNumber,

    // Actions
    refreshOrders,
    refreshUsers,
  };
};
