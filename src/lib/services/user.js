import api from "./api.js";

export const userService = {
  // Get all users (admin only)
  getUsers: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await api.get(`/users?${queryString}`);
      return response;
    } catch (error) {
      console.error("Get users error:", error);
      throw error;
    }
  },

  // Get single user
  getUser: async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response;
    } catch (error) {
      console.error("Get user error:", error);
      throw error;
    }
  },

  // Create user (admin only)
  createUser: async (userData) => {
    try {
      const response = await api.post("/users", userData);
      return response;
    } catch (error) {
      console.error("Create user error:", error);
      throw error;
    }
  },

  // Update user
  updateUser: async (id, userData) => {
    try {
      const response = await api.put(`/users/${id}`, userData);
      return response;
    } catch (error) {
      console.error("Update user error:", error);
      throw error;
    }
  },

  // Delete user (admin only)
  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/users/${id}`);
      return response;
    } catch (error) {
      console.error("Delete user error:", error);
      throw error;
    }
  },

  // Update user status (ban/unban)
  updateUserStatus: async (id, status) => {
    try {
      const response = await api.patch(`/users/${id}/status`, { status });
      return response;
    } catch (error) {
      console.error("Update user status error:", error);
      throw error;
    }
  },

  // Update user role
  updateUserRole: async (id, role) => {
    try {
      const response = await api.patch(`/users/${id}/role`, { role });
      return response;
    } catch (error) {
      console.error("Update user role error:", error);
      throw error;
    }
  },
};

export default userService;
