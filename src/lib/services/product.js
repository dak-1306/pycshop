import api from "./api.js";

export const productService = {
  // Get all products
  getProducts: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await api.get(`/products?${queryString}`);
      return response;
    } catch (error) {
      console.error("Get products error:", error);
      throw error;
    }
  },

  // Get single product
  getProduct: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response;
    } catch (error) {
      console.error("Get product error:", error);
      throw error;
    }
  },

  // Create product
  createProduct: async (productData) => {
    try {
      const response = await api.post("/products", productData);
      return response;
    } catch (error) {
      console.error("Create product error:", error);
      throw error;
    }
  },

  // Update product
  updateProduct: async (id, productData) => {
    try {
      const response = await api.put(`/products/${id}`, productData);
      return response;
    } catch (error) {
      console.error("Update product error:", error);
      throw error;
    }
  },

  // Delete product
  deleteProduct: async (id) => {
    try {
      const response = await api.delete(`/products/${id}`);
      return response;
    } catch (error) {
      console.error("Delete product error:", error);
      throw error;
    }
  },

  // Upload product images
  uploadProductImages: async (productId, images) => {
    try {
      const formData = new FormData();
      images.forEach((image) => {
        formData.append(`images`, image);
      });

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
