import { useState, useEffect } from "react";
import {
  MOCK_PRODUCTS,
  DEFAULT_PRODUCT_STATS,
} from "../constants/productConstants";

export const useAdminProducts = () => {
  // State management
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [stats, setStats] = useState(DEFAULT_PRODUCT_STATS);
  const [isLoading, setIsLoading] = useState(true);

  // Filter states
  const [searchValue, setSearchValue] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Initialize data
  useEffect(() => {
    const initializeProducts = async () => {
      setIsLoading(true);

      // Simulate API calls
      try {
        // In real app, these would be API calls
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate loading

        setProducts(MOCK_PRODUCTS);
        setStats(DEFAULT_PRODUCT_STATS);
        setTotalItems(MOCK_PRODUCTS.length);
        setTotalPages(Math.ceil(MOCK_PRODUCTS.length / 10));
      } catch (error) {
        console.error("Error loading products data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeProducts();
  }, []);

  // Utility functions
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatNumber = (number) => {
    return number.toLocaleString();
  };

  // Event handlers
  const handleViewProduct = (product) => {
    console.log("View product:", product);
    // Implement view product logic
  };

  const handleApproveProduct = (product) => {
    console.log("Approve product:", product);
    // Implement approve product logic
  };

  const handleDeleteProduct = (product) => {
    console.log("Delete product:", product);
    // Implement delete product logic
  };

  const handleAddProduct = () => {
    console.log("Add new product");
    // Implement add product logic
  };

  // Processed stats
  const processedStats = {
    totalProducts: {
      value: stats.totalProducts,
      formattedValue: formatNumber(stats.totalProducts),
      label: "Tổng sản phẩm",
      icon: "📦",
    },
    activeProducts: {
      value: stats.activeProducts,
      formattedValue: formatNumber(stats.activeProducts),
      label: "Sản phẩm hoạt động",
      icon: "✅",
    },
    outOfStockProducts: {
      value: stats.outOfStockProducts,
      formattedValue: formatNumber(stats.outOfStockProducts),
      label: "Hết hàng",
      icon: "⚠️",
    },
    pendingProducts: {
      value: stats.pendingProducts,
      formattedValue: formatNumber(stats.pendingProducts),
      label: "Chờ duyệt",
      icon: "⏳",
    },
  };

  return {
    // State
    products,
    stats: processedStats,
    isLoading,

    // Filter states
    searchValue,
    setSearchValue,
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter,

    // Pagination states
    currentPage,
    setCurrentPage,
    totalItems,
    totalPages,

    // Utility functions
    formatCurrency,
    formatNumber,

    // Event handlers
    handleViewProduct,
    handleApproveProduct,
    handleDeleteProduct,
    handleAddProduct,
  };
};
