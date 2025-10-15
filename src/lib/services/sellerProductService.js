// Seller Product Service - Unified product and image management
const API_BASE_URL = "http://localhost:5002/seller";

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Create headers with auth token
const createHeaders = () => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Create headers for multipart form data
const createMultipartHeaders = () => {
  const token = getAuthToken();
  return {
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// ================== PRODUCT MANAGEMENT ==================

// Get seller's products with pagination and filters
export const getSellerProducts = async (params = {}) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = "",
      status = "",
      sortBy = "created_date",
      sortOrder = "DESC",
    } = params;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      sortOrder,
    });

    if (search) queryParams.append("search", search);
    if (status) queryParams.append("status", status);

    const response = await fetch(`${API_BASE_URL}/products?${queryParams}`, {
      method: "GET",
      headers: createHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Lỗi khi lấy danh sách sản phẩm");
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting seller products:", error);
    throw error;
  }
};

// Add new product (without images)
export const addProduct = async (productData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Lỗi khi thêm sản phẩm");
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};

// Update product - Unified function supports both JSON and FormData
export const updateProduct = async (productId, productData, options = {}) => {
  try {
    const {
      newImageFiles = [],
      imagesToDelete = [],
      newImageUrls = [],
      imageOrder = null, // New: array of image IDs/URLs in desired order
    } = options;

    // Check if we need to handle images
    const hasImages =
      newImageFiles.length > 0 ||
      imagesToDelete.length > 0 ||
      newImageUrls.length > 0 ||
      imageOrder !== null;

    if (hasImages) {
      // Use FormData for image uploads
      const formData = new FormData();

      // Add basic product info
      formData.append("tenSanPham", productData.tenSanPham || "");
      formData.append("moTa", productData.moTa || "");
      formData.append("gia", productData.gia || "0");
      formData.append("danhMuc", productData.danhMuc || "1");
      formData.append("trangThai", productData.trangThai || "active");

      // Add images to delete (as JSON string)
      if (imagesToDelete.length > 0) {
        formData.append("imagesToDelete", JSON.stringify(imagesToDelete));
      }

      // Add new image URLs (as JSON string)
      if (newImageUrls.length > 0) {
        formData.append("newImageUrls", JSON.stringify(newImageUrls));
      }

      // Add image order (as JSON string)
      if (imageOrder && imageOrder.length > 0) {
        formData.append("imageOrder", JSON.stringify(imageOrder));
      }

      // Add new image files
      if (newImageFiles.length > 0) {
        newImageFiles.forEach((file) => {
          formData.append("newImages", file);
        });
      }

      console.log("[SERVICE] Updating product with FormData:", {
        productId,
        newImageFiles: newImageFiles.length,
        imagesToDelete: imagesToDelete.length,
        newImageUrls: newImageUrls.length,
        imageOrder: imageOrder ? imageOrder.length : 0,
      });

      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: "PUT",
        headers: createMultipartHeaders(), // No Content-Type for FormData
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Lỗi khi cập nhật sản phẩm");
      }

      return await response.json();
    } else {
      // Use JSON for simple updates without images
      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: "PUT",
        headers: createHeaders(),
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Lỗi khi cập nhật sản phẩm");
      }

      return await response.json();
    }
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

// DEPRECATED: Use updateProduct instead
export const updateProductWithImages = async (
  productId,
  productData,
  options = {}
) => {
  console.warn(
    "[DEPRECATED] updateProductWithImages is deprecated. Use updateProduct instead."
  );
  return updateProduct(productId, productData, options);
};

// Get product by ID
export const getProductById = async (productId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: "GET",
      headers: createHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Lỗi khi lấy thông tin sản phẩm");
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting product by ID:", error);
    throw error;
  }
};

// Delete product
export const deleteProduct = async (productId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: "DELETE",
      headers: createHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Lỗi khi xóa sản phẩm");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

// ================== STOCK MANAGEMENT ==================

// Add stock to product
export const addStock = async (productId, stockData) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/products/${productId}/stock`,
      {
        method: "POST",
        headers: createHeaders(),
        body: JSON.stringify(stockData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Lỗi khi nhập hàng");
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding stock:", error);
    throw error;
  }
};

// Get stock history
export const getStockHistory = async (productId, params = {}) => {
  try {
    const { page = 1, limit = 10 } = params;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await fetch(
      `${API_BASE_URL}/products/${productId}/stock-history?${queryParams}`,
      {
        method: "GET",
        headers: createHeaders(),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Lỗi khi lấy lịch sử tồn kho");
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting stock history:", error);
    throw error;
  }
};

// ================== IMAGE MANAGEMENT ==================

// Upload product images (files)
export const uploadProductImages = async (productId, imageFiles) => {
  try {
    const formData = new FormData();

    // Add image files to FormData
    if (Array.isArray(imageFiles)) {
      imageFiles.forEach((file) => {
        formData.append("images", file);
      });
    } else {
      formData.append("images", imageFiles);
    }

    const response = await fetch(
      `${API_BASE_URL}/products/${productId}/upload-images`,
      {
        method: "POST",
        headers: createMultipartHeaders(),
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Lỗi khi upload ảnh");
    }

    return await response.json();
  } catch (error) {
    console.error("Error uploading images:", error);
    throw error;
  }
};

// Add product images by URL
export const addProductImages = async (productId, imageUrls) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/products/${productId}/images`,
      {
        method: "POST",
        headers: createHeaders(),
        body: JSON.stringify({ images: imageUrls }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Lỗi khi thêm ảnh");
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding images:", error);
    throw error;
  }
};

// Get product images
export const getProductImages = async (productId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/products/${productId}/images`,
      {
        method: "GET",
        headers: createHeaders(),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Lỗi khi lấy danh sách ảnh");
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting product images:", error);
    throw error;
  }
};

// Delete product image
export const deleteProductImage = async (productId, imageId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/products/${productId}/images/${imageId}`,
      {
        method: "DELETE",
        headers: createHeaders(),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Lỗi khi xóa ảnh");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error;
  }
};

// ================== CATEGORY MANAGEMENT ==================

// Get categories
export const getCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: "GET",
      headers: createHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Lỗi khi lấy danh sách danh mục");
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting categories:", error);
    throw error;
  }
};

// ================== UTILITY FUNCTIONS ==================

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getAuthToken();
};

// Handle authentication errors
export const handleAuthError = (error) => {
  if (error.message.includes("token") || error.message.includes("auth")) {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }
  throw error;
};

// Export default service object
const sellerProductService = {
  // Product management
  getSellerProducts,
  addProduct,
  updateProduct,
  // updateProductWithImages, // DEPRECATED - use updateProduct instead
  getProductById,
  deleteProduct,

  // Stock management
  addStock,
  getStockHistory,

  // Image management
  uploadProductImages,
  addProductImages,
  getProductImages,
  deleteProductImage,

  // Category management
  getCategories,

  // Utilities
  isAuthenticated,
  handleAuthError,
};

export default sellerProductService;
