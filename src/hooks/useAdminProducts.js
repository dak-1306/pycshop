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

  // Modal states
  const [showProductModal, setShowProductModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"

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
  const handleViewProduct = (productId) => {
    console.log("View product:", productId);
    const product = products.find((p) => p.id === productId);
    if (product) {
      setSelectedProduct(product);
      setShowDetailModal(true);
    }
  };

  const handleEditProduct = (productId) => {
    console.log("Edit product:", productId);
    const product = products.find((p) => p.id === productId);
    if (product) {
      setSelectedProduct(product);
      setModalMode("edit");
      setShowProductModal(true);
    }
  };

  const handleApproveProduct = (productId) => {
    console.log("Approve product:", productId);
    // Implement approve product logic - update product status
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId ? { ...product, status: "active" } : product
      )
    );
  };

  const handleDeleteProduct = (productId) => {
    console.log("Delete product:", productId);
    const product = products.find((p) => p.id === productId);
    if (product) {
      setSelectedProduct(product);
      setShowDeleteModal(true);
    }
  };

  const handleAddProduct = () => {
    console.log("Add new product");
    setSelectedProduct(null);
    setModalMode("add");
    setShowProductModal(true);
  };

  const confirmDeleteProduct = () => {
    if (selectedProduct) {
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== selectedProduct.id)
      );
      setShowDeleteModal(false);
      setSelectedProduct(null);
    }
  };

  const handleSaveProduct = (productData) => {
    console.log("Save product:", productData);
    if (modalMode === "add") {
      // Add new product
      const newProduct = {
        ...productData,
        id: Math.max(...products.map((p) => p.id), 0) + 1,
        createdAt: new Date().toISOString(),
      };
      setProducts((prevProducts) => [...prevProducts, newProduct]);
    } else {
      // Update existing product
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === selectedProduct.id
            ? { ...product, ...productData }
            : product
        )
      );
    }
    setShowProductModal(false);
    setSelectedProduct(null);
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

    // Modal states
    showProductModal,
    setShowProductModal,
    showDetailModal,
    setShowDetailModal,
    showDeleteModal,
    setShowDeleteModal,
    selectedProduct,
    modalMode,

    // Event handlers
    handleViewProduct,
    handleEditProduct,
    handleApproveProduct,
    handleDeleteProduct,
    handleAddProduct,
    handleSaveProduct,
    confirmDeleteProduct,
  };
};
