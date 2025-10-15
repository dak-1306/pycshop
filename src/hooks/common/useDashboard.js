import { useState, useEffect, useCallback } from "react";
import adminService from "../../services/adminService.js";
import {
  MOCK_RECENT_ORDERS,
  MOCK_RECENT_USERS,
  MOCK_CHART_DATA,
  DASHBOARD_ORDER_STATUS_COLORS,
  DEFAULT_STATS,
} from "../constants/dashboardConstants.jsx";

export const useDashboard = (variant = "admin") => {
  // State management
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [chartData, setChartData] = useState(MOCK_CHART_DATA);
  const [stats, setStats] = useState({
    orders: 0,
    revenue: 0,
    products: 0,
    newCustomers: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize dashboard data function
  const initializeDashboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (variant === "seller") {
        // For seller dashboard, use mock data or seller-specific APIs
        setStats({
          orders: 25,
          revenue: 15000000,
          products: 42,
          newCustomers: 8,
        });
        setRecentOrders(MOCK_RECENT_ORDERS.slice(0, 5));
        setRecentUsers(MOCK_RECENT_USERS.slice(0, 5));
        setChartData(MOCK_CHART_DATA);
        return;
      }

      // For admin dashboard, fetch real data
      const [dashboardData, chartsData] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getAllChartsData(),
      ]);

      setStats({
        orders: dashboardData.stats.totalOrders || 0,
        revenue: dashboardData.stats.totalRevenue || 0,
        products: dashboardData.stats.totalProducts || 0,
        newCustomers: dashboardData.stats.totalUsers || 0,
      });

      setRecentOrders(dashboardData.recentOrders || []);
      setRecentUsers(dashboardData.recentUsers || []);
      setChartData(chartsData || MOCK_CHART_DATA);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      setError(error.message || "Failed to load dashboard data");

      // Fallback to mock data on error
      setRecentOrders(MOCK_RECENT_ORDERS);
      setRecentUsers(MOCK_RECENT_USERS);
      setChartData(MOCK_CHART_DATA);
      setStats({
        orders: DEFAULT_STATS.todayOrders,
        revenue: DEFAULT_STATS.totalRevenue,
        products: DEFAULT_STATS.totalProducts,
        newCustomers: DEFAULT_STATS.todayUsers,
      });
    } finally {
      setIsLoading(false);
    }
  }, [variant]);

  // Initialize dashboard data on mount
  useEffect(() => {
    initializeDashboard();
  }, [initializeDashboard]);

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
      const orders = await adminService.getOrders({
        limit: 10,
        sortBy: "created_at",
        sortOrder: "desc",
      });
      setRecentOrders(orders.data || []);
    } catch (error) {
      console.error("Error refreshing orders:", error);
      setError("Failed to refresh orders");
    }
  };

  const refreshUsers = async () => {
    try {
      const users = await adminService.getUsers({
        limit: 10,
        sortBy: "created_at",
        sortOrder: "desc",
      });
      setRecentUsers(users.data || []);
    } catch (error) {
      console.error("Error refreshing users:", error);
      setError("Failed to refresh users");
    }
  };

  return {
    // State
    recentOrders,
    recentUsers,
    chartData,
    stats,
    isLoading,
    error,

    // Utility functions
    formatCurrency,
    getStatusColor,
    formatNumber, // Actions
    refreshOrders,
    refreshUsers,
    refreshDashboard: initializeDashboard,
  };
};
