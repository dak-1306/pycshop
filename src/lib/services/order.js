import { api } from "./apiService.js";

/**
 * Order Service - Unified service for all order operations
 *
 * Backend Architecture:
 * - Buyer routes: /buyer/orders/* → Product Service (5002)
 * - Seller routes: /seller/orders/* → Product Service (5002)
 * - Admin routes: /admin/orders/* → Admin Service (5006)
 * All requests go through API Gateway (5000)
 */

// =================== BUYER OPERATIONS ===================

/**
 * Get buyer's orders
 * @param {Object} params - Query parameters
 * @returns {Promise} API response
 */
export const getBuyerOrders = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams(params).toString();
    const url = `/buyer/orders${queryParams ? `?${queryParams}` : ""}`;
    return await api.get(url);
  } catch (error) {
    console.error("Error fetching buyer orders:", error);
    throw error;
  }
};

/**
 * Get buyer's order by ID
 * @param {string|number} id - Order ID
 * @returns {Promise} API response
 */
export const getBuyerOrderById = async (id) => {
  try {
    return await api.get(`/buyer/orders/${id}`);
  } catch (error) {
    console.error("Error fetching buyer order by ID:", error);
    throw error;
  }
};

/**
 * Create new order (buyer)
 * @param {Object} orderData - Order data
 * @returns {Promise} API response
 */
export const createOrder = async (orderData) => {
  try {
    return await api.post("/buyer/orders", orderData);
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

/**
 * Update order (buyer)
 * @param {string|number} id - Order ID
 * @param {Object} orderData - Order data
 * @returns {Promise} API response
 */
export const updateBuyerOrder = async (id, orderData) => {
  try {
    return await api.put(`/buyer/orders/${id}`, orderData);
  } catch (error) {
    console.error("Error updating buyer order:", error);
    throw error;
  }
};

/**
 * Cancel order (buyer)
 * @param {string|number} id - Order ID
 * @returns {Promise} API response
 */
export const cancelBuyerOrder = async (id) => {
  try {
    return await api.patch(`/buyer/orders/${id}/cancel`);
  } catch (error) {
    console.error("Error cancelling buyer order:", error);
    throw error;
  }
};

/**
 * Update order status (buyer)
 * @param {string|number} id - Order ID
 * @param {string} status - New status
 * @returns {Promise} API response
 */
export const updateBuyerOrderStatus = async (id, status) => {
  try {
    return await api.patch(`/buyer/orders/${id}/status`, { status });
  } catch (error) {
    console.error("Error updating buyer order status:", error);
    throw error;
  }
};

/**
 * Get buyer order statistics
 * @returns {Promise} API response
 */
export const getBuyerOrderStats = async () => {
  try {
    return await api.get("/buyer/orders/stats");
  } catch (error) {
    console.error("Error fetching buyer order stats:", error);
    throw error;
  }
};

// =================== SELLER OPERATIONS ===================

/**
 * Get seller's orders
 * @param {Object} params - Query parameters
 * @returns {Promise} API response
 */
export const getSellerOrders = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams(params).toString();
    const url = `/seller/orders${queryParams ? `?${queryParams}` : ""}`;
    return await api.get(url);
  } catch (error) {
    console.error("Error fetching seller orders:", error);
    throw error;
  }
};

/**
 * Get seller's order by ID
 * @param {string|number} id - Order ID
 * @returns {Promise} API response
 */
export const getSellerOrderById = async (id) => {
  try {
    return await api.get(`/seller/orders/${id}`);
  } catch (error) {
    console.error("Error fetching seller order by ID:", error);
    throw error;
  }
};

/**
 * Update order (seller)
 * @param {string|number} id - Order ID
 * @param {Object} orderData - Order data
 * @returns {Promise} API response
 */
export const updateSellerOrder = async (id, orderData) => {
  try {
    return await api.put(`/seller/orders/${id}`, orderData);
  } catch (error) {
    console.error("Error updating seller order:", error);
    throw error;
  }
};

/**
 * Update order status (seller)
 * @param {string|number} id - Order ID
 * @param {string} status - New status
 * @returns {Promise} API response
 */
export const updateSellerOrderStatus = async (id, status) => {
  try {
    return await api.put(`/seller/orders/${id}/status`, { status });
  } catch (error) {
    console.error("Error updating seller order status:", error);
    throw error;
  }
};

/**
 * Cancel order (seller)
 * @param {string|number} id - Order ID
 * @returns {Promise} API response
 */
export const cancelSellerOrder = async (id) => {
  try {
    return await api.patch(`/seller/orders/${id}/cancel`);
  } catch (error) {
    console.error("Error cancelling seller order:", error);
    throw error;
  }
};

/**
 * Get seller order statistics
 * @returns {Promise} API response
 */
export const getSellerOrderStats = async () => {
  try {
    return await api.get("/seller/orders/stats");
  } catch (error) {
    console.error("Error fetching seller order stats:", error);
    throw error;
  }
};

// =================== ADMIN OPERATIONS ===================

/**
 * Get all orders (admin)
 * @param {Object} params - Query parameters
 * @returns {Promise} API response
 */
export const getAdminOrders = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams(params).toString();
    const url = `/admin/orders${queryParams ? `?${queryParams}` : ""}`;
    return await api.get(url);
  } catch (error) {
    console.error("Error fetching admin orders:", error);
    throw error;
  }
};

/**
 * Get order by ID (admin)
 * @param {string|number} id - Order ID
 * @returns {Promise} API response
 */
export const getAdminOrderById = async (id) => {
  try {
    return await api.get(`/admin/orders/${id}`);
  } catch (error) {
    console.error("Error fetching admin order by ID:", error);
    throw error;
  }
};

/**
 * Update order (admin)
 * @param {string|number} id - Order ID
 * @param {Object} orderData - Order data
 * @returns {Promise} API response
 */
export const updateAdminOrder = async (id, orderData) => {
  try {
    return await api.put(`/admin/orders/${id}`, orderData);
  } catch (error) {
    console.error("Error updating admin order:", error);
    throw error;
  }
};

/**
 * Update order status (admin)
 * @param {string|number} id - Order ID
 * @param {string} status - New status
 * @returns {Promise} API response
 */
export const updateAdminOrderStatus = async (id, status) => {
  try {
    return await api.patch(`/admin/orders/${id}/status`, { status });
  } catch (error) {
    console.error("Error updating admin order status:", error);
    throw error;
  }
};

/**
 * Cancel order (admin)
 * @param {string|number} id - Order ID
 * @returns {Promise} API response
 */
export const cancelAdminOrder = async (id) => {
  try {
    return await api.patch(`/admin/orders/${id}/cancel`);
  } catch (error) {
    console.error("Error cancelling admin order:", error);
    throw error;
  }
};

/**
 * Delete order (admin only)
 * @param {string|number} id - Order ID
 * @returns {Promise} API response
 */
export const deleteOrder = async (id) => {
  try {
    return await api.delete(`/admin/orders/${id}`);
  } catch (error) {
    console.error("Error deleting order:", error);
    throw error;
  }
};

/**
 * Get admin order statistics
 * @returns {Promise} API response
 */
export const getAdminOrderStats = async () => {
  try {
    return await api.get("/admin/orders/stats");
  } catch (error) {
    console.error("Error fetching admin order stats:", error);
    throw error;
  }
};

// =================== GENERIC FUNCTIONS (Backward compatibility) ===================

/**
 * Get orders (generic function with role detection)
 * @param {Object} params - Query parameters
 * @param {string} role - User role ('buyer', 'seller', 'admin')
 * @returns {Promise} API response
 */
export const getOrders = async (params = {}, role = "buyer") => {
  switch (role) {
    case "seller":
      return getSellerOrders(params);
    case "admin":
      return getAdminOrders(params);
    default:
      return getBuyerOrders(params);
  }
};

/**
 * Get order by ID (generic function with role detection)
 * @param {string|number} id - Order ID
 * @param {string} role - User role ('buyer', 'seller', 'admin')
 * @returns {Promise} API response
 */
export const getOrderById = async (id, role = "buyer") => {
  switch (role) {
    case "seller":
      return getSellerOrderById(id);
    case "admin":
      return getAdminOrderById(id);
    default:
      return getBuyerOrderById(id);
  }
};

/**
 * Update order (generic function with role detection)
 * @param {string|number} id - Order ID
 * @param {Object} orderData - Order data
 * @param {string} role - User role ('buyer', 'seller', 'admin')
 * @returns {Promise} API response
 */
export const updateOrder = async (id, orderData, role = "buyer") => {
  switch (role) {
    case "seller":
      return updateSellerOrder(id, orderData);
    case "admin":
      return updateAdminOrder(id, orderData);
    default:
      return updateBuyerOrder(id, orderData);
  }
};

/**
 * Update order status (generic function with role detection)
 * @param {string|number} id - Order ID
 * @param {string} status - New status
 * @param {string} role - User role ('buyer', 'seller', 'admin')
 * @returns {Promise} API response
 */
export const updateOrderStatus = async (id, status, role = "buyer") => {
  switch (role) {
    case "seller":
      return updateSellerOrderStatus(id, status);
    case "admin":
      return updateAdminOrderStatus(id, status);
    default:
      return updateBuyerOrderStatus(id, status);
  }
};

/**
 * Cancel order (generic function with role detection)
 * @param {string|number} id - Order ID
 * @param {string} role - User role ('buyer', 'seller', 'admin')
 * @returns {Promise} API response
 */
export const cancelOrder = async (id, role = "buyer") => {
  switch (role) {
    case "seller":
      return cancelSellerOrder(id);
    case "admin":
      return cancelAdminOrder(id);
    default:
      return cancelBuyerOrder(id);
  }
};

// =================== ROLE-SPECIFIC SERVICE OBJECTS ===================

// Buyer service
export const buyerOrderService = {
  getOrders: getBuyerOrders,
  getOrderById: getBuyerOrderById,
  createOrder,
  updateOrder: updateBuyerOrder,
  updateOrderStatus: updateBuyerOrderStatus,
  cancelOrder: cancelBuyerOrder,
  getOrderStats: getBuyerOrderStats,
};

// Seller service
export const sellerOrderService = {
  getOrders: getSellerOrders,
  getOrderById: getSellerOrderById,
  updateOrder: updateSellerOrder,
  updateOrderStatus: updateSellerOrderStatus,
  cancelOrder: cancelSellerOrder,
  getOrderStats: getSellerOrderStats,
};

// Admin service
export const adminOrderService = {
  getOrders: getAdminOrders,
  getOrderById: getAdminOrderById,
  updateOrder: updateAdminOrder,
  updateOrderStatus: updateAdminOrderStatus,
  cancelOrder: cancelAdminOrder,
  deleteOrder,
  getOrderStats: getAdminOrderStats,
};

// =================== DEFAULT EXPORT ===================

// Default export contains all functions
const orderService = {
  // Generic functions (with role parameter)
  getOrders,
  getOrderById,
  updateOrder,
  updateOrderStatus,
  cancelOrder,

  // Buyer functions
  getBuyerOrders,
  getBuyerOrderById,
  createOrder,
  updateBuyerOrder,
  updateBuyerOrderStatus,
  cancelBuyerOrder,
  getBuyerOrderStats,

  // Seller functions
  getSellerOrders,
  getSellerOrderById,
  updateSellerOrder,
  updateSellerOrderStatus,
  cancelSellerOrder,
  getSellerOrderStats,

  // Admin functions
  getAdminOrders,
  getAdminOrderById,
  updateAdminOrder,
  updateAdminOrderStatus,
  cancelAdminOrder,
  deleteOrder,
  getAdminOrderStats,

  // Role-specific services
  buyer: buyerOrderService,
  seller: sellerOrderService,
  admin: adminOrderService,

  // Legacy aliases for backward compatibility
  getAllOrders: getAdminOrders,
  getOrder: getOrderById,
};

export default orderService;
