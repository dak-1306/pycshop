import { api } from "../lib/services/apiService.js";

// Product Service
export const productService = {
  // Get products with pagination and filters
  getProducts: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const url = `/products${queryParams ? `?${queryParams}` : ""}`;
      return await api.get(url);
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  // Get all products (legacy method)
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

  // Get categories
  getCategories: async () => {
    try {
      return await api.get("/products/categories");
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  // Get product by ID
  getProductById: async (id) => {
    try {
      return await api.get(`/products/${id}`);
    } catch (error) {
      console.error("Error fetching product by ID:", error);
      throw error;
    }
  },

  // Search products
  searchProducts: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const url = `/products/search${queryParams ? `?${queryParams}` : ""}`;
      return await api.get(url);
    } catch (error) {
      console.error("Error searching products:", error);
      throw error;
    }
  },

  // Get product reviews
  getProductReviews: async (productId, params = {}) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const url = `/products/${productId}/reviews${
        queryParams ? `?${queryParams}` : ""
      }`;
      return await api.get(url);
    } catch (error) {
      console.error("Error fetching product reviews:", error);
      throw error;
    }
  },

  // Get product rating statistics
  getProductRatingStats: async (productId) => {
    try {
      return await api.get(`/products/${productId}/rating-stats`);
    } catch (error) {
      console.error("Error fetching product rating stats:", error);
      throw error;
    }
  },

  // Get similar products
  getSimilarProducts: async (productId, limit = 4) => {
    try {
      const queryParams = new URLSearchParams({ limit }).toString();
      const url = `/products/${productId}/similar${
        queryParams ? `?${queryParams}` : ""
      }`;
      return await api.get(url);
    } catch (error) {
      console.error("Error fetching similar products:", error);
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
