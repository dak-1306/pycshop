import api from "./api.js";

export const orderService = {
  // Get all orders
  getOrders: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await api.get(`/orders?${queryString}`);
      return response;
    } catch (error) {
      console.error("Get orders error:", error);
      throw error;
    }
  },

  // Get single order
  getOrder: async (id) => {
    try {
      const response = await api.get(`/orders/${id}`);
      return response;
    } catch (error) {
      console.error("Get order error:", error);
      throw error;
    }
  },

  // Create order
  createOrder: async (orderData) => {
    try {
      const response = await api.post("/orders", orderData);
      return response;
    } catch (error) {
      console.error("Create order error:", error);
      throw error;
    }
  },

  // Update order status
  updateOrderStatus: async (id, status) => {
    try {
      const response = await api.patch(`/orders/${id}/status`, { status });
      return response;
    } catch (error) {
      console.error("Update order status error:", error);
      throw error;
    }
  },

  // Cancel order
  cancelOrder: async (id) => {
    try {
      const response = await api.patch(`/orders/${id}/cancel`);
      return response;
    } catch (error) {
      console.error("Cancel order error:", error);
      throw error;
    }
  },

  // Get seller orders
  getSellerOrders: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await api.get(`/seller/orders?${queryString}`);
      return response;
    } catch (error) {
      console.error("Get seller orders error:", error);
      throw error;
    }
  },

  // Get buyer orders
  getBuyerOrders: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await api.get(`/buyer/orders?${queryString}`);
      return response;
    } catch (error) {
      console.error("Get buyer orders error:", error);
      throw error;
    }
  },
};

export default orderService;
