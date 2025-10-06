import api from "./api.js";

export const categoryService = {
  // Get all categories
  getCategories: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await api.get(`/categories?${queryString}`);
      return response;
    } catch (error) {
      console.error("Get categories error:", error);
      throw error;
    }
  },

  // Get single category
  getCategory: async (id) => {
    try {
      const response = await api.get(`/categories/${id}`);
      return response;
    } catch (error) {
      console.error("Get category error:", error);
      throw error;
    }
  },

  // Create category
  createCategory: async (categoryData) => {
    try {
      const response = await api.post("/categories", categoryData);
      return response;
    } catch (error) {
      console.error("Create category error:", error);
      throw error;
    }
  },

  // Update category
  updateCategory: async (id, categoryData) => {
    try {
      const response = await api.put(`/categories/${id}`, categoryData);
      return response;
    } catch (error) {
      console.error("Update category error:", error);
      throw error;
    }
  },

  // Delete category
  deleteCategory: async (id) => {
    try {
      const response = await api.delete(`/categories/${id}`);
      return response;
    } catch (error) {
      console.error("Delete category error:", error);
      throw error;
    }
  },
};

export default categoryService;
