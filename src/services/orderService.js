import { api } from "./apiService.js";

// Order Service
export const orderService = {
  // Get all orders
  getAllOrders: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const url = `/orders${queryParams ? `?${queryParams}` : ""}`;
      return await api.get(url);
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  },

  // Get order by ID
  getOrderById: async (id) => {
    try {
      return await api.get(`/orders/${id}`);
    } catch (error) {
      console.error("Error fetching order:", error);
      throw error;
    }
  },

  // Create new order
  createOrder: async (orderData) => {
    try {
      return await api.post("/orders", orderData);
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  },

  // Update order
  updateOrder: async (id, orderData) => {
    try {
      return await api.put(`/orders/${id}`, orderData);
    } catch (error) {
      console.error("Error updating order:", error);
      throw error;
    }
  },

  // Delete order
  deleteOrder: async (id) => {
    try {
      return await api.delete(`/orders/${id}`);
    } catch (error) {
      console.error("Error deleting order:", error);
      throw error;
    }
  },

  // Update order status
  updateOrderStatus: async (id, status) => {
    try {
      return await api.put(`/orders/${id}/status`, { status });
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  },
};

export default orderService;
