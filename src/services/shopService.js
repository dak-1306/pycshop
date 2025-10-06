import apiService from "./apiService.js";

class ShopService {
  // Get all categories for shop creation
  static async getCategories() {
    try {
      const response = await apiService.get("/shops/categories");
      return response; // Return full response object with success and categories
    } catch (error) {
      console.error("ShopService - getCategories error:", error);
      throw error;
    }
  }

  // Get shop information for current seller
  static async getShopInfo() {
    try {
      const response = await apiService.get("/shops/info");
      return response;
    } catch (error) {
      console.error("ShopService - getShopInfo error:", error);
      throw error;
    }
  }

  // Create new shop
  static async createShop(shopData) {
    try {
      const response = await apiService.post("/shops/create", shopData);
      return response.data;
    } catch (error) {
      console.error("ShopService - createShop error:", error);
      throw error;
    }
  }

  // Update shop information
  static async updateShop(shopData) {
    try {
      const response = await apiService.put("/shops/update", shopData);
      return response.data;
    } catch (error) {
      console.error("ShopService - updateShop error:", error);
      throw error;
    }
  }

  // Become seller (from buyer to seller with shop creation)
  static async becomeSeller(shopData) {
    try {
      console.log("ShopService - becomeSeller called with:", shopData);
      const response = await apiService.post("/shops/become-seller", shopData);
      console.log("ShopService - becomeSeller response:", response);

      // apiService returns direct JSON, not wrapped in .data
      return response;
    } catch (error) {
      console.error("ShopService - becomeSeller error:", error);
      throw error;
    }
  }

  // Get seller's products
  static async getSellerProducts(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append("page", params.page);
      if (params.limit) queryParams.append("limit", params.limit);
      if (params.search) queryParams.append("search", params.search);
      if (params.status) queryParams.append("status", params.status);
      if (params.sortBy) queryParams.append("sortBy", params.sortBy);
      if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

      const url = `/seller/products${
        queryParams.toString() ? "?" + queryParams.toString() : ""
      }`;
      const response = await apiService.get(url);
      return response.data;
    } catch (error) {
      console.error("ShopService - getSellerProducts error:", error);
      throw error;
    }
  }

  // Add new product
  static async addProduct(productData) {
    try {
      const response = await apiService.post("/seller/products", productData);
      return response.data;
    } catch (error) {
      console.error("ShopService - addProduct error:", error);
      throw error;
    }
  }

  // Update product
  static async updateProduct(productId, productData) {
    try {
      const response = await apiService.put(
        `/seller/products/${productId}`,
        productData
      );
      return response.data;
    } catch (error) {
      console.error("ShopService - updateProduct error:", error);
      throw error;
    }
  }

  // Delete product
  static async deleteProduct(productId) {
    try {
      const response = await apiService.delete(`/seller/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error("ShopService - deleteProduct error:", error);
      throw error;
    }
  }

  // Add stock to product (restock)
  static async restockProduct(productId, stockData) {
    try {
      const response = await apiService.post(
        `/seller/products/${productId}/stock`,
        stockData
      );
      return response.data;
    } catch (error) {
      console.error("ShopService - restockProduct error:", error);
      throw error;
    }
  }

  // Get product categories for seller
  static async getSellerCategories() {
    try {
      const response = await apiService.get("/seller/categories");
      return response.data;
    } catch (error) {
      console.error("ShopService - getSellerCategories error:", error);
      throw error;
    }
  }

  // Upload product images
  static async uploadProductImages(files) {
    try {
      const formData = new FormData();

      // Add up to 15 images
      const maxImages = Math.min(files.length, 15);
      for (let i = 0; i < maxImages; i++) {
        formData.append("images", files[i]);
      }

      const response = await apiService.post("/images/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("ShopService - uploadProductImages error:", error);
      throw error;
    }
  }

  // Get product by ID (for editing)
  static async getProductById(productId) {
    try {
      const response = await apiService.get(`/seller/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error("ShopService - getProductById error:", error);
      throw error;
    }
  }

  // Get stock history for a product
  static async getStockHistory(productId, params = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append("page", params.page);
      if (params.limit) queryParams.append("limit", params.limit);

      const url = `/seller/products/${productId}/stock/history${
        queryParams.toString() ? "?" + queryParams.toString() : ""
      }`;
      const response = await apiService.get(url);
      return response.data;
    } catch (error) {
      console.error("ShopService - getStockHistory error:", error);
      throw error;
    }
  }
}

export default ShopService;
