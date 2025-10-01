import { api } from "./apiService.js";

// Product Service
export const productService = {
  // Get all products
  getAllProducts: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const url = `/products${queryParams ? `?${queryParams}` : ""}`;
      return await api.get(url);
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  // Get product by ID
  getProductById: async (id) => {
    try {
      return await api.get(`/products/${id}`);
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  },

  // Create new product
  createProduct: async (productData) => {
    try {
      return await api.post("/products", productData);
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  },

  // Update product
  updateProduct: async (id, productData) => {
    try {
      return await api.put(`/products/${id}`, productData);
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  },

  // Delete product
  deleteProduct: async (id) => {
    try {
      return await api.delete(`/products/${id}`);
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  },

  // Get product statistics
  getProductStats: async () => {
    try {
      return await api.get("/products/stats");
    } catch (error) {
      console.error("Error fetching product stats:", error);
      throw error;
    }
  },
};

export default productService;
