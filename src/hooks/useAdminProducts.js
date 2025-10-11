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
  // Store all products and filtered products separately
  const [allProducts, setAllProducts] = useState(MOCK_PRODUCTS);
  const [filteredProducts, setFilteredProducts] = useState(MOCK_PRODUCTS);

  // Initialize data
  useEffect(() => {
    const initializeProducts = async () => {
      setIsLoading(true);

      // Simulate API calls
      try {
        // In real app, these would be API calls
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate loading

        setAllProducts(MOCK_PRODUCTS);
        setFilteredProducts(MOCK_PRODUCTS);
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

  // Filter products based on search and filters
  useEffect(() => {
    let filtered = [...allProducts];

    // Apply search filter
    if (searchValue.trim()) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        product.seller.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    // Apply category filter
    if (categoryFilter) {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(product => product.status === statusFilter);
    }

    setFilteredProducts(filtered);
    
    // Update pagination based on filtered results
    const itemsPerPage = 10;
    setTotalItems(filtered.length);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    
    // Reset to first page when filters change
    setCurrentPage(1);
    
    // Get products for current page
    const startIndex = 0; // Always show first page when filters change
    const endIndex = Math.min(itemsPerPage, filtered.length);
    setProducts(filtered.slice(startIndex, endIndex));
  }, [searchValue, categoryFilter, statusFilter, allProducts]);

  // Handle pagination changes
  useEffect(() => {
    const itemsPerPage = 10;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredProducts.length);
    setProducts(filteredProducts.slice(startIndex, endIndex));
  }, [currentPage, filteredProducts]);

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
    const product = allProducts.find((p) => p.id === productId);
    if (product) {
      setSelectedProduct(product);
      setShowDetailModal(true);
    }
  };

  const handleEditProduct = (productId) => {
    console.log("Edit product:", productId);
    const product = allProducts.find((p) => p.id === productId);
    if (product) {
      setSelectedProduct(product);
      setModalMode("edit");
      setShowProductModal(true);
    }  };
  const handleDeleteProduct = (productId) => {
    console.log("Delete product:", productId);
    const product = allProducts.find((p) => p.id === productId);
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
      setAllProducts((prevProducts) =>
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
        id: Math.max(...allProducts.map((p) => p.id), 0) + 1,
        createdDate: new Date().toISOString().split('T')[0],
        status: "pending", // New products start as pending
      };
      setAllProducts((prevProducts) => [...prevProducts, newProduct]);
    } else {
      // Update existing product
      setAllProducts((prevProducts) =>
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

  // Reset all filters
  const handleResetFilters = () => {
    setSearchValue("");
    setCategoryFilter("");
    setStatusFilter("");
  };

  // Calculate stats from current filtered products
  const calculateFilteredStats = () => {
    const activeCount = filteredProducts.filter(p => p.status === 'active').length;
    const pendingCount = filteredProducts.filter(p => p.status === 'pending').length;
    const outOfStockCount = filteredProducts.filter(p => p.status === 'out_of_stock').length;
    const inactiveCount = filteredProducts.filter(p => p.status === 'inactive').length;

    return {
      totalProducts: filteredProducts.length,
      activeProducts: activeCount,
      pendingProducts: pendingCount,
      outOfStockProducts: outOfStockCount,
      inactiveProducts: inactiveCount,
    };
  };
  // Processed stats - use filtered stats if filters are active
  const isFiltered = searchValue || categoryFilter || statusFilter;
  const currentStats = isFiltered ? calculateFilteredStats() : stats;
  
  const processedStats = {
    totalProducts: {
      value: currentStats.totalProducts,
      formattedValue: formatNumber(currentStats.totalProducts),
      label: isFiltered ? "Sản phẩm hiển thị" : "Tổng sản phẩm",
      icon: "📦",
    },
    activeProducts: {
      value: currentStats.activeProducts,
      formattedValue: formatNumber(currentStats.activeProducts),
      label: "Sản phẩm hoạt động",
      icon: "✅",
    },
    outOfStockProducts: {
      value: currentStats.outOfStockProducts,
      formattedValue: formatNumber(currentStats.outOfStockProducts),
      label: "Hết hàng",
      icon: "⚠️",
    },
    pendingProducts: {
      value: currentStats.pendingProducts,
      formattedValue: formatNumber(currentStats.pendingProducts),
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
    modalMode,    // Event handlers
    handleViewProduct,
    handleEditProduct,
    handleDeleteProduct,
    handleAddProduct,
    handleSaveProduct,
    confirmDeleteProduct,
    handleResetFilters,
  };
};
