import useProductsCommon from "../common/useProducts.js";
import { adminProductService } from "../../lib/services/productService.js";
import { ADMIN_CONSTANTS } from "../../lib/constants/index.js";

export const useAdminProducts = () => {
  // Use common hook with admin-specific configuration
  const commonHook = useProductsCommon({
    role: "admin",
    service: adminProductService,
    mockData: null, // Use real database data for admin
    canDelete: true, // Admins can delete products
    pageSize: 10,
    hasImageManagement: false, // Simpler admin interface
    hasStockManagement: false, // Admin doesn't manage stock directly
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
    setSelectedProduct: commonHook.setSelectedProduct,
    modalMode: commonHook.modalMode,

    // Event handlers - use common hook functions
    handleViewProduct: commonHook.handleViewProduct,
    handleEditProduct: commonHook.handleEditProduct,
    handleDeleteProduct: commonHook.handleDeleteProduct,
    handleAddProduct: commonHook.handleAddProduct,
    handleSaveProduct: commonHook.handleSaveProduct,
    confirmDeleteProduct: commonHook.confirmDeleteProduct,
    handleResetFilters: commonHook.handleResetFilters,
    handleExport: commonHook.handleExport,
    handleCloseProductModal: commonHook.handleCloseProductModal,
    handleCloseDetailModal: commonHook.handleCloseDetailModal,
    handleCloseDeleteModal: commonHook.handleCloseDeleteModal,

    // Utility functions
    formatCurrency,
    formatNumber,
  };
};
