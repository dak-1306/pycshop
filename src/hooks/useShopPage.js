import { useState, useEffect, useCallback } from "react";
import {
  DEFAULT_SHOP_INFO,
  INITIAL_PRODUCT_STATE,
  MOCK_PRODUCTS,
  PAGINATION_CONFIG,
  MODAL_MODES,
  SHOP_STATUS_COLORS,
  RECENT_ACTIVITIES,
} from "../constants/shopPageConstants";
import { productService } from "../services/productService";

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

      const filters = {
        search: searchTerm,
        category: selectedCategory,
        status: selectedStatus,
        sort: sortBy,
        page: currentPage,
        limit: PAGINATION_CONFIG.itemsPerPage,
      };

      const response = await productService.getAllProducts(filters);

      if (response && response.data) {
        setProducts(response.data.products || []);
        setTotalPages(
          Math.ceil((response.data.total || 0) / PAGINATION_CONFIG.itemsPerPage)
        );
      } else {
        // Use mock data as fallback
        setProducts(MOCK_PRODUCTS);
        setTotalPages(
          Math.ceil(MOCK_PRODUCTS.length / PAGINATION_CONFIG.itemsPerPage)
        );
      }
    } catch (error) {
      console.error("Error loading products:", error);
      setError("Không thể tải danh sách sản phẩm");
      // Set mock data as fallback
      setProducts(MOCK_PRODUCTS);
      setTotalPages(
        Math.ceil(MOCK_PRODUCTS.length / PAGINATION_CONFIG.itemsPerPage)
      );
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCategory, selectedStatus, sortBy, currentPage]);

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

  // Filter and sort products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory || product.category === selectedCategory;
    const matchesStatus = !selectedStatus || product.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

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
      if (modalMode === MODAL_MODES.ADD) {
        const newProduct = {
          ...currentProduct,
          id: Date.now(),
        };
        setProducts((prev) => [...prev, newProduct]);
      } else {
        setProducts((prev) =>
          prev.map((p) => (p.id === currentProduct.id ? currentProduct : p))
        );
      }
      setShowProductModal(false);
      setCurrentProduct(INITIAL_PRODUCT_STATE);
    } catch (error) {
      console.error("Error saving product:", error);
      setError("Không thể lưu sản phẩm");
    }
  };

  const confirmDeleteProduct = async () => {
    try {
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
      setShowDeleteModal(false);
      setProductToDelete(null);
    } catch (error) {
      console.error("Error deleting product:", error);
      setError("Không thể xóa sản phẩm");
    }
  };

  // Shop info management
  const handleEditShopInfo = () => {
    setShowShopEditModal(true);
  };

  const handleSaveShopInfo = (updatedInfo) => {
    setShopInfo((prev) => ({
      ...prev,
      ...updatedInfo,
    }));
    setShowShopEditModal(false);
    alert("Cập nhật thông tin shop thành công!");
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
    filteredProducts,

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

    // Statistics
    shopStats,

    // Constants
    recentActivities: RECENT_ACTIVITIES,
  };
};
