import apiService from "./apiService";

const adminService = {
  // Dashboard stats
  getDashboardStats: async () => {
    try {
      const response = await apiService.get("/admin/dashboard/stats");
      return response;
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      throw error;
    }
  },

  // User management
  getUsers: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await apiService.get(`/admin/users?${queryParams}`);
      return response;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  updateUserStatus: async (userId, status) => {
    try {
      const response = await apiService.put(`/admin/users/${userId}/status`, {
        status,
      });
      return response;
    } catch (error) {
      console.error("Error updating user status:", error);
      throw error;
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await apiService.delete(`/admin/users/${userId}`);
      return response;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  },

  // Product management
  getProducts: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await apiService.get(`/admin/products?${queryParams}`);
      return response;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  updateProductStatus: async (productId, status) => {
    try {
      const response = await apiService.put(
        `/admin/products/${productId}/status`,
        { status }
      );
      return response;
    } catch (error) {
      console.error("Error updating product status:", error);
      throw error;
    }
  },

  deleteProduct: async (productId) => {
    try {
      const response = await apiService.delete(`/admin/products/${productId}`);
      return response;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  },

  // Order management
  getOrders: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await apiService.get(`/admin/orders?${queryParams}`);
      return response;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  },

  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await apiService.put(`/admin/orders/${orderId}/status`, {
        status,
      });
      return response;
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  },

  // Seller management
  getSellers: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await apiService.get(`/admin/sellers?${queryParams}`);
      return response;
    } catch (error) {
      console.error("Error fetching sellers:", error);
      throw error;
    }
  },

  approveSeller: async (sellerId) => {
    try {
      const response = await apiService.put(
        `/admin/sellers/${sellerId}/approve`
      );
      return response;
    } catch (error) {
      console.error("Error approving seller:", error);
      throw error;
    }
  },

  rejectSeller: async (sellerId, reason) => {
    try {
      const response = await apiService.put(
        `/admin/sellers/${sellerId}/reject`,
        { reason }
      );
      return response;
    } catch (error) {
      console.error("Error rejecting seller:", error);
      throw error;
    }
  },

  // Reports
  getReports: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await apiService.get(`/admin/reports?${queryParams}`);
      return response;
    } catch (error) {
      console.error("Error fetching reports:", error);
      throw error;
    }
  },

  resolveReport: async (reportId) => {
    try {
      const response = await apiService.put(
        `/admin/reports/${reportId}/resolve`
      );
      return response;
    } catch (error) {
      console.error("Error resolving report:", error);
      throw error;
    }
  },

  // Settings
  getSettings: async () => {
    try {
      const response = await apiService.get("/admin/settings");
      return response;
    } catch (error) {
      console.error("Error fetching settings:", error);
      throw error;
    }
  },

  updateSettings: async (settings) => {
    try {
      const response = await apiService.put("/admin/settings", settings);
      return response;
    } catch (error) {
      console.error("Error updating settings:", error);
      throw error;
    }
  },

  // Admin management (Super Admin only)
  createAdmin: async (adminData) => {
    try {
      const response = await apiService.post("/admin/create-admin", adminData);
      return response;
    } catch (error) {
      console.error("Error creating admin:", error);
      throw error;
    }
  },

  getAdmins: async () => {
    try {
      const response = await apiService.get("/admin/admins");
      return response;
    } catch (error) {
      console.error("Error fetching admins:", error);
      throw error;
    }
  },

  // Check if current user is super admin
  isSuperAdmin: () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user.email === "dat@gmail.com" && user.role === "admin";
  },
};

export default adminService;
