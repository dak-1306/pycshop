import { useState, useEffect } from "react";
import {
  MOCK_USERS,
  DEFAULT_USER_STATS,
  USER_STATUS_COLORS,
  USER_ROLE_COLORS,
} from "../constants/userConstants";

export const useAdminUsers = () => {
  // State management
  const [users, setUsers] = useState(MOCK_USERS);
  const [stats, setStats] = useState(DEFAULT_USER_STATS);
  const [isLoading, setIsLoading] = useState(true);

  // Filter states
  const [searchValue, setSearchValue] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Initialize data
  useEffect(() => {
    const initializeUsers = async () => {
      setIsLoading(true);

      // Simulate API calls
      try {
        // In real app, these would be API calls
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate loading

        setUsers(MOCK_USERS);
        setStats(DEFAULT_USER_STATS);
      } catch (error) {
        console.error("Error loading users data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeUsers();
  }, []);

  // Utility functions
  const formatNumber = (number) => {
    return number.toLocaleString();
  };

  const getStatusColor = (status) => {
    return USER_STATUS_COLORS[status] || USER_STATUS_COLORS.default;
  };

  const getRoleColor = (role) => {
    return USER_ROLE_COLORS[role] || USER_ROLE_COLORS.default;
  };

  // Event handlers
  const handleViewUser = (user) => {
    console.log("View user:", user);
    // Implement view user logic
  };

  const handleEditUser = (user) => {
    console.log("Edit user:", user);
    // Implement edit user logic
  };

  const handleDeleteUser = (user) => {
    console.log("Delete user:", user);
    // Implement delete user logic
  };

  const handleAddUser = () => {
    console.log("Add new user");
    // Implement add user logic
  };

  // Processed stats
  const processedStats = {
    totalUsers: {
      value: stats.totalUsers,
      formattedValue: formatNumber(stats.totalUsers),
      label: "Tổng người dùng",
      icon: "👥",
    },
    activeUsers: {
      value: stats.activeUsers,
      formattedValue: formatNumber(stats.activeUsers),
      label: "Người dùng hoạt động",
      icon: "✅",
    },
    customers: {
      value: stats.customers,
      formattedValue: formatNumber(stats.customers),
      label: "Khách hàng",
      icon: "🛒",
    },
    sellers: {
      value: stats.sellers,
      formattedValue: formatNumber(stats.sellers),
      label: "Người bán",
      icon: "🏪",
    },
  };

  return {
    // State
    users,
    stats: processedStats,
    isLoading,

    // Filter states
    searchValue,
    setSearchValue,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,

    // Utility functions
    formatNumber,
    getStatusColor,
    getRoleColor,

    // Event handlers
    handleViewUser,
    handleEditUser,
    handleDeleteUser,
    handleAddUser,
  };
};
