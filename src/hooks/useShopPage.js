import { useState, useEffect, useCallback } from "react";
import {
  DEFAULT_SHOP_INFO,
  INITIAL_PRODUCT_STATE,
  PAGINATION_CONFIG,
  MODAL_MODES,
  SHOP_STATUS_COLORS,
  RECENT_ACTIVITIES,
} from "../constants/shopPageConstants";
import ShopService from "../services/shopService";

export const useShopPage = () => {
  // Shop Info State
  const [shopInfo, setShopInfo] = useState(DEFAULT_SHOP_INFO);

  // Product States
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [sortBy, setSortBy] = useState("name");

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal States
  const [showProductModal, setShowProductModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showShopEditModal, setShowShopEditModal] = useState(false);
  const [modalMode, setModalMode] = useState(MODAL_MODES.ADD);
  const [currentProduct, setCurrentProduct] = useState(INITIAL_PRODUCT_STATE);
  const [productToDelete, setProductToDelete] = useState(null);

  // Load products from API
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Loading products with params:", {
        page: currentPage,
        limit: PAGINATION_CONFIG.itemsPerPage,
        search: searchTerm || undefined,
        category: selectedCategory || undefined,
        status: selectedStatus || undefined,
        sortBy,
        sortOrder: "desc",
      });

      // Load products using ShopService
      const response = await ShopService.getSellerProducts({
        page: currentPage,
        limit: PAGINATION_CONFIG.itemsPerPage,
        search: searchTerm || undefined,
        category: selectedCategory || undefined,
        status: selectedStatus || undefined,
        sortBy,
        sortOrder: "desc",
      });

      console.log("Products response:", response);

      if (response && response.success) {
        setProducts(response.data || []);
        setTotalPages(
          Math.ceil(
            (response.pagination?.total || 0) / PAGINATION_CONFIG.itemsPerPage
          )
        );
        console.log(
          "Products loaded successfully:",
          response.data?.length || 0,
          "products"
        );
      } else {
        console.log("No products found or unsuccessful response");
        setProducts([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error loading products:", error);
      setError("Không thể tải danh sách sản phẩm");
      setProducts([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCategory, selectedStatus, sortBy, currentPage]);

  // Load shop info separately
  const loadShopInfo = useCallback(async () => {
    try {
      console.log("Loading shop info...");
      const shopResponse = await ShopService.getShopInfo();
      console.log("Shop info response:", shopResponse);

      if (shopResponse && shopResponse.success && shopResponse.shop) {
        setShopInfo(shopResponse.shop);
        console.log("Shop info loaded successfully:", shopResponse.shop);
      } else {
        console.log("No shop info found or unsuccessful response");
      }
    } catch (error) {
      console.error("Error loading shop info:", error);
      // Keep default shop info if error
    }
  }, []);

  // Initial load for shop info
  useEffect(() => {
    loadShopInfo();
  }, [loadShopInfo]);

  // Load products when filters change
  useEffect(() => {
    loadProducts();
  }, [
    searchTerm,
    selectedCategory,
    selectedStatus,
    sortBy,
    currentPage,
    loadProducts,
  ]);

  // Utility functions
  const getStatusColor = (status) => {
    return SHOP_STATUS_COLORS[status] || "bg-gray-100 text-gray-800";
  };

  const formatPrice = (price) => {
    return typeof price === "number"
      ? price.toLocaleString("vi-VN") + " VNĐ"
      : price;
  };

  // Product CRUD operations
  const handleAddProduct = () => {
    setCurrentProduct(INITIAL_PRODUCT_STATE);
    setModalMode(MODAL_MODES.ADD);
    setShowProductModal(true);
  };

  const handleEditProduct = (product) => {
    setCurrentProduct({ ...product });
    setModalMode(MODAL_MODES.EDIT);
    setShowProductModal(true);
  };

  const handleDeleteProduct = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleSaveProduct = async () => {
    try {
      setLoading(true);

      if (modalMode === MODAL_MODES.ADD) {
        const response = await ShopService.addProduct(currentProduct);
        if (response.success) {
          setShowProductModal(false);
          setCurrentProduct(INITIAL_PRODUCT_STATE);
          alert("Thêm sản phẩm thành công!");
          loadProducts(); // Reload products
        } else {
          alert(response.message || "Có lỗi xảy ra khi thêm sản phẩm");
        }
      } else {
        const response = await ShopService.updateProduct(
          currentProduct.id,
          currentProduct
        );
        if (response.success) {
          setShowProductModal(false);
          setCurrentProduct(INITIAL_PRODUCT_STATE);
          alert("Cập nhật sản phẩm thành công!");
          loadProducts(); // Reload products
        } else {
          alert(response.message || "Có lỗi xảy ra khi cập nhật sản phẩm");
        }
      }
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Không thể lưu sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteProduct = async () => {
    try {
      setLoading(true);
      const response = await ShopService.deleteProduct(productToDelete.id);

      if (response.success) {
        setShowDeleteModal(false);
        setProductToDelete(null);
        alert("Xóa sản phẩm thành công!");
        loadProducts(); // Reload products
      } else {
        alert(response.message || "Có lỗi xảy ra khi xóa sản phẩm");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Không thể xóa sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  // Shop info management
  const handleEditShopInfo = () => {
    setShowShopEditModal(true);
  };

  const handleSaveShopInfo = async (updatedInfo) => {
    try {
      setLoading(true);
      const response = await ShopService.updateShop(updatedInfo);

      if (response.success) {
        setShopInfo((prev) => ({
          ...prev,
          ...updatedInfo,
        }));
        setShowShopEditModal(false);
        alert("Cập nhật thông tin shop thành công!");
        // Reload shop info to get latest data
        loadShopInfo();
      } else {
        alert(response.message || "Có lỗi xảy ra khi cập nhật shop");
      }
    } catch (error) {
      console.error("Error updating shop info:", error);
      alert("Có lỗi xảy ra khi cập nhật shop");
    } finally {
      setLoading(false);
    }
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedStatus("");
    setSortBy("name");
    setCurrentPage(1);
  };

  // Statistics calculations
  const shopStats = {
    totalProducts: products.length,
    inStockProducts: products.filter((p) => p.status === "Còn hàng").length,
    outOfStockProducts: products.filter((p) => p.status === "Hết hàng").length,
    averageRating: 4.8,
  };

  return {
    // Shop Info
    shopInfo,
    setShopInfo,

    // Products
    products,
    loading,
    error,

    // Search & Filter
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedStatus,
    setSelectedStatus,
    sortBy,
    setSortBy,

    // Pagination
    currentPage,
    setCurrentPage,
    totalPages,

    // Modals
    showProductModal,
    setShowProductModal,
    showDeleteModal,
    setShowDeleteModal,
    showShopEditModal,
    setShowShopEditModal,
    modalMode,
    currentProduct,
    setCurrentProduct,
    productToDelete,

    // Utility Functions
    getStatusColor,
    formatPrice,

    // CRUD Operations
    handleAddProduct,
    handleEditProduct,
    handleDeleteProduct,
    handleSaveProduct,
    confirmDeleteProduct,

    // Shop Management
    handleEditShopInfo,
    handleSaveShopInfo,

    // Other Functions
    handleResetFilters,
    loadProducts,
    loadShopInfo,

    // Statistics
    shopStats,

    // Constants
    recentActivities: RECENT_ACTIVITIES,
  };
};
