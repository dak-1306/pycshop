import { useState, useEffect, useCallback } from "react";
import userService from "../../lib/services/userService.js";

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Filters
  const [filters, setFilters] = useState({
    search: "",
    role: "",
    status: "",
    sortBy: "created_at",
    sortOrder: "desc",
  });

  // Fetch users
  const fetchUsers = useCallback(
    async (params = {}) => {
      setIsLoading(true);
      setError(null);

      try {
        const queryParams = {
          page: params.page || pagination.page,
          limit: params.limit || pagination.limit,
          ...filters,
          ...params,
        };

        const response = await userService.getUsers(queryParams);

        setUsers(response.data || []);
        setPagination({
          page: response.pagination?.page || 1,
          limit: response.pagination?.limit || 10,
          total: response.pagination?.total || 0,
          totalPages: response.pagination?.totalPages || 0,
        });
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(err.message || "Failed to fetch users");
      } finally {
        setIsLoading(false);
      }
    },
    [filters, pagination.page, pagination.limit]
  );

  // Get single user
  const getUser = async (id) => {
    try {
      const response = await userService.getUser(id);
      return response;
    } catch (err) {
      console.error("Error fetching user:", err);
      throw err;
    }
  };

  // Create user
  const createUser = async (userData) => {
    try {
      setIsLoading(true);
      const response = await userService.createUser(userData);
      await fetchUsers();
      return response;
    } catch (err) {
      console.error("Error creating user:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Update user
  const updateUser = async (id, userData) => {
    try {
      setIsLoading(true);
      const response = await userService.updateUser(id, userData);
      await fetchUsers();
      return response;
    } catch (err) {
      console.error("Error updating user:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete user
  const deleteUser = async (id) => {
    try {
      setIsLoading(true);
      await userService.deleteUser(id);
      await fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Ban/unban user
  const toggleUserStatus = async (id, status) => {
    try {
      setIsLoading(true);
      const response = await userService.updateUserStatus(id, status);
      await fetchUsers();
      return response;
    } catch (err) {
      console.error("Error updating user status:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Update filters
  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Change page
  const changePage = (page) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  // Load initial data
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    // State
    users,
    isLoading,
    error,
    pagination,
    filters,

    // Actions
    fetchUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    updateFilters,
    changePage,
    refetch: fetchUsers,
  };
};
