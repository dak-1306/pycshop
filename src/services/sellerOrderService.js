import { api } from "./apiService.js";

// Seller Order Service
export const sellerOrderService = {
  // Get seller's orders
  getSellerOrders: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const url = `/seller/orders${queryParams ? `?${queryParams}` : ""}`;
      return await api.get(url);
    } catch (error) {
      console.error("Error fetching seller orders:", error);
      throw error;
    }
  },

  // Get order by ID
  getOrderById: async (id) => {
    try {
      return await api.get(`/seller/orders/${id}`);
    } catch (error) {
      console.error("Error fetching order:", error);
      throw error;
    }
  },

  // Update order status
  updateOrderStatus: async (id, status) => {
    try {
      return await api.put(`/seller/orders/${id}/status`, { status });
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  },

  // Get order statistics
  getOrderStats: async () => {
    try {
      return await api.get("/seller/orders/stats");
    } catch (error) {
      console.error("Error fetching order stats:", error);
      throw error;
    }
  },
};

export default sellerOrderService;
