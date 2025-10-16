import useProductsCommon from "../common/useProducts.js";
import {
  MOCK_PRODUCTS,
  DEFAULT_PRODUCT_STATS,
} from "../../lib/constants/product.js";

// Mock service for admin products
const adminProductService = {
  getProducts: async () => ({
    success: true,
    data: MOCK_PRODUCTS,
    pagination: {
      total: MOCK_PRODUCTS.length,
      totalPages: Math.ceil(MOCK_PRODUCTS.length / 10),
    },
  }),
  // Add other mock methods as needed for admin
  createProduct: async (product) => ({
    success: true,
    data: { id: Date.now(), ...product },
  }),
  updateProduct: async (id, updates) => ({
    success: true,
    data: { id, ...updates },
  }),
  deleteProduct: async (id) => ({ success: true, data: { id } }),
};

export const useAdminProducts = () => {
  // Use common hook with admin-specific configuration
  const commonHook = useProductsCommon({
    role: "admin",
    service: adminProductService,
    canDelete: true, // Admins can delete products
    pageSize: 10,
    hasImageManagement: false, // Simpler admin interface
    hasStockManagement: false, // Admin doesn't manage stock directly
    useMockData: true, // Use mock data for admin
    initialData: MOCK_PRODUCTS, // Provide initial mock data
  });

  // Admin-specific stats calculation from filtered products
  const calculateStats = () => {
    const products = commonHook.products || [];
    const activeCount = products.filter((p) => p.status === "active").length;
    const pendingCount = products.filter((p) => p.status === "pending").length;
    const outOfStockCount = products.filter(
      (p) => p.status === "out_of_stock"
    ).length;
    const inactiveCount = products.filter(
      (p) => p.status === "inactive"
    ).length;

    return {
      totalProducts: products.length,
      activeProducts: activeCount,
      pendingProducts: pendingCount,
      outOfStockProducts: outOfStockCount,
      inactiveProducts: inactiveCount,
    };
  };

  // Format stats for display
  const formatNumber = (number) => {
    return number.toLocaleString();
  };

  const rawStats = calculateStats();
  const processedStats = {
    totalProducts: {
      value: rawStats.totalProducts,
      formattedValue: formatNumber(rawStats.totalProducts),
      label: "Tổng sản phẩm",
      icon: "📦",
    },
    activeProducts: {
      value: rawStats.activeProducts,
      formattedValue: formatNumber(rawStats.activeProducts),
      label: "Sản phẩm hoạt động",
      icon: "✅",
    },
    outOfStockProducts: {
      value: rawStats.outOfStockProducts,
      formattedValue: formatNumber(rawStats.outOfStockProducts),
      label: "Hết hàng",
      icon: "⚠️",
    },
    pendingProducts: {
      value: rawStats.pendingProducts,
      formattedValue: formatNumber(rawStats.pendingProducts),
      label: "Chờ duyệt",
      icon: "⏳",
    },
  };

  // Format currency for admin view
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return {
    // State - map from common hook for backward compatibility
    products: commonHook.products,
    stats: processedStats,
    isLoading: commonHook.isLoading,

    // Filter states
    searchValue: commonHook.searchValue,
    setSearchValue: commonHook.setSearchValue,
    categoryFilter: commonHook.categoryFilter,
    setCategoryFilter: commonHook.setCategoryFilter,
    statusFilter: commonHook.statusFilter,
    setStatusFilter: commonHook.setStatusFilter,

    // Pagination states
    currentPage: commonHook.currentPage,
    setCurrentPage: commonHook.setCurrentPage,
    totalItems: commonHook.totalItems,
    totalPages: commonHook.totalPages,

    // Modal states
    showProductModal: commonHook.showProductModal,
    setShowProductModal: commonHook.setShowProductModal,
    showDetailModal: commonHook.showDetailModal,
    setShowDetailModal: commonHook.setShowDetailModal,
    showDeleteModal: commonHook.showDeleteModal,
    setShowDeleteModal: commonHook.setShowDeleteModal,
    selectedProduct: commonHook.selectedProduct,
    modalMode: commonHook.modalMode,

    // Event handlers - use common hook functions
    handleViewProduct: commonHook.viewProduct,
    handleEditProduct: commonHook.editProduct,
    handleDeleteProduct: commonHook.showDeleteConfirm,
    handleAddProduct: commonHook.addProduct,
    handleSaveProduct: commonHook.saveProduct,
    confirmDeleteProduct: commonHook.deleteProduct,
    handleResetFilters: commonHook.resetFilters,

    // Utility functions
    formatCurrency,
    formatNumber,
  };
};
