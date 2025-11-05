import { api } from "./apiService.js";

/**
 * Product Service - Unified service for all product operations
 *
 * Backend Architecture:
 * - Buyer routes: /products/* → Product Service (5002)
 * - Seller routes: /seller/* → Product Service (5002)
 * - Admin routes: /admin/* → Admin Service (5006)
 * All requests go through API Gateway (5000)
 */

// =================== BUYER OPERATIONS (Public) ===================

/**
 * Get products with pagination and filters (public)
 * @param {Object} params - Query parameters
 * @returns {Promise} API response
 */
export const getProducts = async (params = {}) => {
  try {
    // Filter out undefined, null, and empty string values
    const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        acc[key] = value;
      }
      return acc;
    }, {});

    const queryParams = new URLSearchParams(cleanParams).toString();
    const url = `/products${queryParams ? `?${queryParams}` : ""}`;
    return await api.get(url);
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

/**
 * Get single product by ID (public)
 * @param {string|number} id - Product ID
 * @returns {Promise} API response
 */
export const getProductById = async (id) => {
  try {
    return await api.get(`/products/${id}`);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    throw error;
  }
};

/**
 * Get all categories (public)
 * @returns {Promise} API response
 */
export const getCategories = async () => {
  try {
    return await api.get("/products/categories");
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

/**
 * Search products (public)
 * @param {Object} params - Search parameters
 * @returns {Promise} API response
 */
export const searchProducts = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams(params).toString();
    const url = `/products/search${queryParams ? `?${queryParams}` : ""}`;
    return await api.get(url);
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
};

/**
 * Get products by category (public)
 * @param {string|number} categoryId - Category ID
 * @param {Object} params - Additional filters
 * @returns {Promise} API response
 */
export const getProductsByCategory = async (categoryId, params = {}) => {
  try {
    const queryParams = new URLSearchParams({
      category: categoryId,
      ...params,
      // Handle price range
      ...(params.priceRange?.min && { minPrice: params.priceRange.min }),
      ...(params.priceRange?.max && { maxPrice: params.priceRange.max }),
    });

    // Remove priceRange from params since we converted it
    delete queryParams.priceRange;

    const url = `/products?${queryParams.toString()}`;
    return await api.get(url);
  } catch (error) {
    console.error("Error fetching products by category:", error);
    throw error;
  }
};

/**
 * Get similar products (public)
 * @param {string|number} productId - Product ID
 * @param {number} limit - Number of similar products
 * @returns {Promise} API response
 */
export const getSimilarProducts = async (productId, limit = 4) => {
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
};

// =================== REVIEWS & RATINGS (Public) ===================

/**
 * Get product reviews (public)
 * @param {string|number} productId - Product ID
 * @param {Object} params - Query parameters
 * @returns {Promise} API response
 */
export const getProductReviews = async (productId, params = {}) => {
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
};

/**
 * Get product rating statistics (public)
 * @param {string|number} productId - Product ID
 * @returns {Promise} API response
 */
export const getProductRatingStats = async (productId) => {
  try {
    return await api.get(`/products/${productId}/rating-stats`);
  } catch (error) {
    console.error("Error fetching product rating stats:", error);
    throw error;
  }
};

// =================== SELLER OPERATIONS (Authenticated) ===================

/**
 * Get seller's products with filters
 * @param {Object} params - Query parameters
 * @returns {Promise} API response
 */
export const getSellerProducts = async (params = {}) => {
  try {
    // Filter out undefined, null, and empty string values
    const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        acc[key] = value;
      }
      return acc;
    }, {});

    const queryParams = new URLSearchParams(cleanParams).toString();
    const url = `/seller/products${queryParams ? `?${queryParams}` : ""}`;

    console.log("[getSellerProducts] Clean params:", cleanParams);
    console.log("[getSellerProducts] Final URL:", url);

    return await api.get(url);
  } catch (error) {
    console.error("Error fetching seller products:", error);
    throw error;
  }
};

/**
 * Get seller's product by ID
 * @param {string|number} id - Product ID
 * @returns {Promise} API response
 */
export const getSellerProductById = async (id) => {
  try {
    return await api.get(`/seller/products/${id}`);
  } catch (error) {
    console.error("Error fetching seller product by ID:", error);
    throw error;
  }
};

/**
 * Create new product (seller)
 * @param {Object} productData - Product data
 * @returns {Promise} API response
 */
export const createProduct = async (productData) => {
  try {
    return await api.post("/seller/products", productData);
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

/**
 * Update product (seller)
 * @param {string|number} id - Product ID
 * @param {Object} productData - Product data
 * @param {Object} options - Image management options
 * @returns {Promise} API response
 */
export const updateProduct = async (id, productData, options = {}) => {
  try {
    const {
      newImageFiles = [],
      imagesToDelete = [],
      newImageUrls = [],
      imageOrder = null,
    } = options;

    const hasImages =
      newImageFiles.length > 0 ||
      imagesToDelete.length > 0 ||
      newImageUrls.length > 0 ||
      imageOrder !== null;

    if (hasImages) {
      // Use FormData for image operations
      const formData = new FormData();

      // Add product data
      Object.entries(productData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      // Add image operations
      if (imagesToDelete.length > 0) {
        formData.append("imagesToDelete", JSON.stringify(imagesToDelete));
      }
      if (newImageUrls.length > 0) {
        formData.append("newImageUrls", JSON.stringify(newImageUrls));
      }
      if (imageOrder) {
        formData.append("imageOrder", JSON.stringify(imageOrder));
      }
      if (newImageFiles.length > 0) {
        newImageFiles.forEach((file) => {
          formData.append("newImages", file);
        });
      }

      return await api.upload(`/seller/products/${id}`, formData);
    } else {
      // Simple JSON update
      return await api.put(`/seller/products/${id}`, productData);
    }
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

/**
 * Delete product (seller)
 * @param {string|number} id - Product ID
 * @returns {Promise} API response
 */
export const deleteProduct = async (id) => {
  try {
    return await api.delete(`/seller/products/${id}`);
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

// =================== IMAGE MANAGEMENT (Seller) ===================

/**
 * Upload product images
 * @param {string|number} productId - Product ID
 * @param {File|File[]} imageFiles - Image files
 * @returns {Promise} API response
 */
export const uploadProductImages = async (productId, imageFiles) => {
  try {
    const formData = new FormData();

    if (Array.isArray(imageFiles)) {
      imageFiles.forEach((file) => {
        formData.append("images", file);
      });
    } else {
      formData.append("images", imageFiles);
    }

    return await api.upload(
      `/seller/products/${productId}/upload-images`,
      formData
    );
  } catch (error) {
    console.error("Error uploading product images:", error);
    throw error;
  }
};

/**
 * Add product images by URL
 * @param {string|number} productId - Product ID
 * @param {string[]} imageUrls - Array of image URLs
 * @returns {Promise} API response
 */
export const addProductImages = async (productId, imageUrls) => {
  try {
    return await api.post(`/seller/products/${productId}/images`, {
      images: imageUrls,
    });
  } catch (error) {
    console.error("Error adding product images:", error);
    throw error;
  }
};

/**
 * Get product images
 * @param {string|number} productId - Product ID
 * @returns {Promise} API response
 */
export const getProductImages = async (productId) => {
  try {
    return await api.get(`/seller/products/${productId}/images`);
  } catch (error) {
    console.error("Error fetching product images:", error);
    throw error;
  }
};

/**
 * Delete product image
 * @param {string|number} productId - Product ID
 * @param {string|number} imageId - Image ID
 * @returns {Promise} API response
 */
export const deleteProductImage = async (productId, imageId) => {
  try {
    return await api.delete(`/seller/products/${productId}/images/${imageId}`);
  } catch (error) {
    console.error("Error deleting product image:", error);
    throw error;
  }
};

// =================== STOCK MANAGEMENT (Seller) ===================

/**
 * Add stock to product
 * @param {string|number} productId - Product ID
 * @param {Object} stockData - Stock data
 * @returns {Promise} API response
 */
export const addStock = async (productId, stockData) => {
  try {
    return await api.post(`/seller/products/${productId}/stock`, stockData);
  } catch (error) {
    console.error("Error adding stock:", error);
    throw error;
  }
};

/**
 * Get stock history
 * @param {string|number} productId - Product ID
 * @param {Object} params - Query parameters
 * @returns {Promise} API response
 */
export const getStockHistory = async (productId, params = {}) => {
  try {
    const queryParams = new URLSearchParams(params).toString();
    const url = `/seller/products/${productId}/stock-history${
      queryParams ? `?${queryParams}` : ""
    }`;
    return await api.get(url);
  } catch (error) {
    console.error("Error fetching stock history:", error);
    throw error;
  }
};

// =================== ADMIN OPERATIONS (Admin only) ===================

/**
 * Get all products for admin
 * @param {Object} params - Query parameters
 * @returns {Promise} API response
 */
export const getAdminProducts = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams(params).toString();
    const url = `/admin/products${queryParams ? `?${queryParams}` : ""}`;
    return await api.get(url);
  } catch (error) {
    console.error("Error fetching admin products:", error);
    throw error;
  }
};

/**
 * Update product status (admin)
 * @param {string|number} id - Product ID
 * @param {string} status - New status
 * @returns {Promise} API response
 */
export const updateProductStatus = async (id, status) => {
  try {
    return await api.patch(`/admin/products/${id}/status`, { status });
  } catch (error) {
    console.error("Error updating product status:", error);
    throw error;
  }
};

/**
 * Get product statistics (admin)
 * @returns {Promise} API response
 */
export const getProductStats = async () => {
  try {
    return await api.get("/admin/products/stats");
  } catch (error) {
    console.error("Error fetching product stats:", error);
    throw error;
  }
};

/**
 * Delete product (admin)
 * @param {string|number} id - Product ID
 * @returns {Promise} API response
 */
export const adminDeleteProduct = async (id) => {
  try {
    return await api.delete(`/admin/products/${id}`);
  } catch (error) {
    console.error("Error deleting product (admin):", error);
    throw error;
  }
};

// =================== ROLE-SPECIFIC SERVICE OBJECTS ===================

// Buyer service (public access)
export const buyerProductService = {
  getProducts,
  getProductById,
  searchProducts,
  getProductsByCategory,
  getCategories,
  getSimilarProducts,
  getProductReviews,
  getProductRatingStats,
};

// Seller service (authenticated)
export const sellerProductService = {
  // Product management
  getProducts: getSellerProducts,
  getSellerProducts, // Add explicit method name for hook compatibility
  getProductById: getSellerProductById,
  createProduct,
  updateProduct,
  deleteProduct,

  // Image management
  uploadProductImages,
  addProductImages,
  getProductImages,
  deleteProductImage,

  // Stock management
  addStock,
  getStockHistory,

  // Common
  getCategories,
};

// Admin service (admin access)
export const adminProductService = {
  getProducts: getAdminProducts,
  updateProductStatus,
  getProductStats,
  deleteProduct: adminDeleteProduct,
  getCategories,
};

// =================== DEFAULT EXPORT ===================

// Default export contains all functions
const productService = {
  // Buyer functions
  getProducts,
  getProductById,
  searchProducts,
  getProductsByCategory,
  getCategories,
  getSimilarProducts,
  getProductReviews,
  getProductRatingStats,

  // Seller functions
  getSellerProducts,
  getSellerProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  addProductImages,
  getProductImages,
  deleteProductImage,
  addStock,
  getStockHistory,

  // Admin functions
  getAdminProducts,
  updateProductStatus,
  getProductStats,
  adminDeleteProduct,

  // Role-specific services
  buyer: buyerProductService,
  seller: sellerProductService,
  admin: adminProductService,
};

export default productService;
