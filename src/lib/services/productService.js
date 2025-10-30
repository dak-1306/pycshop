import { api } from "./apiService.js";

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
      // Temporary: call product service directly
      const response = await fetch("http://localhost:5002/categories");
      return await response.json();
    } catch (error) {
      console.error("Error fetching categories:", error);
      return { success: false, message: error.message };
    }
  },

  // Get products by category
  getProductsByCategory: async (categoryId, filters = {}) => {
    try {
      const params = {
        category: categoryId,
        ...filters,
        // Handle price range
        ...(filters.priceRange?.min && { minPrice: filters.priceRange.min }),
        ...(filters.priceRange?.max && { maxPrice: filters.priceRange.max }),
      };

      // Remove priceRange from params since we converted it to minPrice/maxPrice
      delete params.priceRange;

      const queryParams = new URLSearchParams(params).toString();
      const url = `/products${queryParams ? `?${queryParams}` : ""}`;
      return await api.get(url);
    } catch (error) {
      console.error("Error fetching products by category:", error);
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
      // Temporary: call product service directly
      const queryParams = new URLSearchParams(params).toString();
      const url = `http://localhost:5002/search${
        queryParams ? `?${queryParams}` : ""
      }`;
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      console.error("Error searching products:", error);
      return { success: false, message: error.message };
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
      return await api.get("/admin/products/stats");
    } catch (error) {
      console.error("Error fetching product stats:", error);
      throw error;
    }
  },

  // Additional methods from product.js
  // Upload product images
  uploadProductImages: async (productId, images) => {
    try {
      const formData = new FormData();

      // Handle multiple files
      if (Array.isArray(images)) {
        images.forEach((image) => {
          formData.append(`images`, image);
        });
      } else {
        formData.append("images", images);
      }

      const response = await api.upload(
        `/products/${productId}/images`,
        formData
      );
      return response;
    } catch (error) {
      console.error("Upload product images error:", error);
      throw error;
    }
  },

  // Get seller products
  getSellerProducts: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await api.get(`/seller/products?${queryString}`);
      return response;
    } catch (error) {
      console.error("Get seller products error:", error);
      throw error;
    }
  },

  // Update product status
  updateProductStatus: async (id, status) => {
    try {
      const response = await api.patch(`/products/${id}/status`, { status });
      return response;
    } catch (error) {
      console.error("Update product status error:", error);
      throw error;
    }
  },
};

export default productService;
