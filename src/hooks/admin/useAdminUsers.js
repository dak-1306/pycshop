import { useState, useCallback, useEffect } from "react";
import { useUsers } from "../api/useUsers.js";
import adminService from "../../services/adminService.js";
import {
  DEFAULT_USER_STATS,
  USER_STATUS_COLORS,
  USER_ROLE_COLORS,
} from "../constants/userConstants";

export const useAdminUsers = () => {
  // Use the existing useUsers hook as base
  const {
    users,
    isLoading,
    error: usersError,
    filters,
    updateFilters,
    deleteUser: baseDeleteUser,
    toggleUserStatus,
    refetch,
  } = useUsers();

  // Additional state for admin-specific features
  const [stats, setStats] = useState(DEFAULT_USER_STATS);
  const [error, setError] = useState(null);

  // Extract filter values for compatibility with old interface
  const searchValue = filters.search || "";
  const roleFilter = filters.role || "";
  const statusFilter = filters.status || "";

  // Set filter functions
  const setSearchValue = useCallback(
    (value) => {
      updateFilters({ search: value });
    },
    [updateFilters]
  );

  const setRoleFilter = useCallback(
    (value) => {
      updateFilters({ role: value });
    },
    [updateFilters]
  );

  const setStatusFilter = useCallback(
    (value) => {
      updateFilters({ status: value });
    },
    [updateFilters]
  );

  // Fetch dashboard stats
  const fetchStats = useCallback(async () => {
    try {
      console.log("[useAdminUsers] Fetching dashboard stats...");
      const dashboardData = await adminService.getDashboardStats();
      console.log("[useAdminUsers] Dashboard stats:", dashboardData);

      const newStats = {
        totalUsers:
          dashboardData.stats?.totalUsers || dashboardData.totalUsers || 0,
        activeUsers:
          dashboardData.stats?.activeUsers || dashboardData.activeUsers || 0,
        customers:
          dashboardData.stats?.customers || dashboardData.customers || 0,
        sellers: dashboardData.stats?.sellers || dashboardData.sellers || 0,
      };
      setStats(newStats);
      setError(null);
    } catch (statsError) {
      console.warn("[useAdminUsers] Failed to fetch stats:", statsError);
      setStats(DEFAULT_USER_STATS);
      setError("Failed to load stats: " + statsError.message);
    }
  }, []);

  // Combined error state
  const combinedError = error || usersError;

  // Load stats on mount
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

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
  const handleViewUser = useCallback((user) => {
    console.log("[useAdminUsers] View user:", user);
    // TODO: Implement view user modal/page
    alert(`Xem thông tin user: ${user.name || user.email}`);
  }, []);

  const handleEditUser = useCallback(
    async (user) => {
      try {
        console.log("[useAdminUsers] Toggling user status:", user);

        const newStatus = user.status === "active" ? "inactive" : "active";

        // Use toggleUserStatus from useUsers hook
        await toggleUserStatus(user.id, newStatus);

        console.log("[useAdminUsers] User status updated successfully");
        alert(
          `Đã ${newStatus === "active" ? "kích hoạt" : "vô hiệu hóa"} user: ${
            user.name || user.email
          }`
        );
      } catch (error) {
        console.error("[useAdminUsers] Error updating user:", error);
        setError("Failed to update user: " + error.message);
        alert("Lỗi khi cập nhật trạng thái user: " + error.message);
      }
    },
    [toggleUserStatus]
  );

  const handleDeleteUser = useCallback(
    async (user) => {
      try {
        // Confirm before delete
        const confirmDelete = window.confirm(
          `Bạn có chắc chắn muốn xóa user: ${user.name || user.email}?`
        );

        if (!confirmDelete) return;

        console.log("[useAdminUsers] Deleting user:", user);

        // Use deleteUser from useUsers hook
        await baseDeleteUser(user.id);

        console.log("[useAdminUsers] User deleted successfully");
        alert(`Đã xóa user: ${user.name || user.email}`);
      } catch (error) {
        console.error("[useAdminUsers] Error deleting user:", error);
        setError("Failed to delete user: " + error.message);
        alert("Lỗi khi xóa user: " + error.message);
      }
    },
    [baseDeleteUser]
  );

  const handleAddUser = useCallback(() => {
    console.log("[useAdminUsers] Add new user");
    // TODO: Implement add user modal/form
    alert("Tính năng thêm user mới đang được phát triển");
  }, []);

  // Processed stats - UserStats component expects simple structure
  const processedStats = {
    totalUsers: stats.totalUsers || 0,
    activeUsers: stats.activeUsers || 0,
    customers: stats.customers || 0,
    sellers: stats.sellers || 0,
  };

  return {
    // State
    users,
    stats: processedStats,
    isLoading,
    error: combinedError,

    // Filter states
    searchValue,
    setSearchValue,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,

    // Data actions
    fetchStats,
    refetch,

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
