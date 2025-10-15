import { api } from "./apiService.js";

// Dashboard Service
export const dashboardService = {
  // Get dashboard statistics
  getStats: async () => {
    try {
      return await api.get("/dashboard/stats");
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      throw error;
    }
  },

  // Get recent orders for dashboard
  getRecentOrders: async (limit = 10) => {
    try {
      return await api.get(`/dashboard/recent-orders?limit=${limit}`);
    } catch (error) {
      console.error("Error fetching recent orders:", error);
      throw error;
    }
  },

  // Get revenue data for charts
  getRevenueData: async (period = "month") => {
    try {
      return await api.get(`/dashboard/revenue?period=${period}`);
    } catch (error) {
      console.error("Error fetching revenue data:", error);
      throw error;
    }
  },

  // Get product analytics
  getProductAnalytics: async () => {
    try {
      return await api.get("/dashboard/product-analytics");
    } catch (error) {
      console.error("Error fetching product analytics:", error);
      throw error;
    }
  },
};

export default dashboardService;
