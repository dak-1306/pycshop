import { useState, useEffect } from "react";
import adminService from "../services/adminService.js";
import {
  MOCK_USERS,
  DEFAULT_USER_STATS,
  USER_STATUS_COLORS,
  USER_ROLE_COLORS,
} from "../constants/userConstants";

export const useAdminUsers = () => {
  // State management
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(DEFAULT_USER_STATS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [searchValue, setSearchValue] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Initialize data
  useEffect(() => {
    const initializeUsers = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await adminService.getUsers({
          search: searchValue,
          role: roleFilter,
          status: statusFilter,
        });
        setUsers(response.data || []);

        // Get user stats from dashboard API
        const dashboardData = await adminService.getDashboardStats();
        setStats({
          total: dashboardData.stats.totalUsers || 0,
          active: dashboardData.stats.activeUsers || 0,
          inactive: dashboardData.stats.inactiveUsers || 0,
          newThisMonth: dashboardData.stats.newUsersThisMonth || 0,
        });
      } catch (error) {
        console.error("Error loading users data:", error);
        setError("Failed to load users data");
        // Fallback to mock data
        setUsers(MOCK_USERS);
        setStats(DEFAULT_USER_STATS);
      } finally {
        setIsLoading(false);
      }
    };

    initializeUsers();
  }, [searchValue, roleFilter, statusFilter]);

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

  const handleEditUser = async (user) => {
    try {
      await adminService.updateUserStatus(user.id, {
        status: user.status === "active" ? "inactive" : "active",
      });
      // Reload users
      const response = await adminService.getUsers({
        search: searchValue,
        role: roleFilter,
        status: statusFilter,
      });
      setUsers(response.data || []);
      console.log("User status updated:", user);
    } catch (error) {
      console.error("Error updating user:", error);
      setError("Failed to update user");
    }
  };

  const handleDeleteUser = async (user) => {
    try {
      await adminService.deleteUser(user.id);
      // Reload users
      const response = await adminService.getUsers({
        search: searchValue,
        role: roleFilter,
        status: statusFilter,
      });
      setUsers(response.data || []);
      console.log("User deleted:", user);
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("Failed to delete user");
    }
  };

  const handleAddUser = () => {
    console.log("Add new user");
    // Implement add user logic - could open modal
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
    error,

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
