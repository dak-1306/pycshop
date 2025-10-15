import { useState, useEffect, useCallback } from "react";

/**
 * Shared products hook for both admin and seller
 * @param {Object} options Configuration object
 * @param {string} options.role - 'admin' or 'seller'
 * @param {Object} options.service - Service object with API methods
 * @param {Array} options.mockData - Optional mock data for development
 * @param {boolean} options.canDelete - Whether user can delete products
 * @param {number} options.pageSize - Items per page
 * @param {Object} options.initialStats - Initial stats for admin
 * @param {boolean} options.hasImageManagement - Whether to enable complex image handling
 * @param {boolean} options.hasStockManagement - Whether to enable stock management
 */
export const useProductsCommon = (options = {}) => {
  const {
    role = "seller",
    service = null,
    mockData = null,
    canDelete = false,
    pageSize = 10,
    initialStats = null,
    hasImageManagement = false,
    hasStockManagement = false,
  } = options;

  // Core state
  const [products, setProducts] = useState(mockData || []);
  const [allProducts, setAllProducts] = useState(mockData || []);
  const [filteredProducts, setFilteredProducts] = useState(mockData || []);
  const [isLoading, setIsLoading] = useState(!mockData);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(initialStats);

  // Filter and pagination state
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue, setDebouncedSearchValue] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Modal states
  const [showProductModal, setShowProductModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalMode, setModalMode] = useState("add");

  // Debounce search value
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchValue(searchValue);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchValue]);

  // Load products from API or use mock data
  const loadProducts = useCallback(async () => {
    if (mockData) {
      setAllProducts(mockData);
      setFilteredProducts(mockData);
      setProducts(mockData);
      setIsLoading(false);
      return;
    }

    if (
      !service?.getProducts &&
      !service?.getSellerProducts &&
      !service?.getAdminProducts
    ) {
      console.warn("No service provided for loading products");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const fetchMethod =
        role === "admin"
          ? service.getAdminProducts || service.getProducts
          : service.getSellerProducts || service.getProducts;

      const response = await fetchMethod({
        page: currentPage,
        limit: pageSize,
        search: debouncedSearchValue || undefined,
        status: statusFilter || undefined,
        category: categoryFilter || undefined,
        sortBy: "created_date",
        sortOrder: "DESC",
      });

      if (response?.success && response?.data) {
        let mappedProducts = [];

        if (role === "seller") {
          // Seller-specific data mapping
          mappedProducts = response.data.map((product) => {
            const imageArray = product.image_urls
              ? product.image_urls.split(",").filter((url) => url.trim())
              : [];

            return {
              id: product.ID_SanPham,
              name: product.TenSanPham,
              price: product.Gia?.toLocaleString("vi-VN"),
              quantity: product.TonKho,
              category: product.TenDanhMuc || "Chưa phân loại",
              categoryId: product.ID_DanhMuc,
              status: product.TrangThai,
              description: product.MoTa || "",
              images: imageArray,
              image:
                imageArray.length > 0
                  ? `http://localhost:5002${imageArray[0]}`
                  : null,
              imageFiles: [],
              shopName: product.TenCuaHang || "",
              created_date: product.created_date,
              actions: ["view", "edit", "delete"],
            };
          });
        } else {
          // Admin or generic mapping
          mappedProducts = response.data || [];
        }

        setProducts(mappedProducts);
        setAllProducts(mappedProducts);
        setFilteredProducts(mappedProducts);

        // Update pagination info
        if (response.pagination) {
          setTotalItems(response.pagination.total || 0);
          setTotalPages(response.pagination.totalPages || 1);
        }
      } else {
        setError(`Không có dữ liệu sản phẩm từ server`);
        setProducts([]);
        setAllProducts([]);
        setFilteredProducts([]);
        setTotalItems(0);
        setTotalPages(1);
      }
    } catch (err) {
      console.error(`Error loading ${role} products:`, err);
      setError(`Lỗi khi tải danh sách sản phẩm: ${err.message}`);
      setProducts([]);
      setAllProducts([]);
      setFilteredProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [
    service,
    mockData,
    role,
    currentPage,
    pageSize,
    debouncedSearchValue,
    statusFilter,
    categoryFilter,
  ]);

  // Load products on mount and when filters change
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Apply filters for admin (mock data filtering)
  useEffect(() => {
    if (!mockData) return;

    let filtered = [...allProducts];

    // Apply search filter
    if (searchValue.trim()) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          (product.seller &&
            product.seller.toLowerCase().includes(searchValue.toLowerCase()))
      );
    }

    // Apply category filter
    if (categoryFilter) {
      filtered = filtered.filter(
        (product) => product.category === categoryFilter
      );
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter((product) => product.status === statusFilter);
    }

    setFilteredProducts(filtered);

    // Update pagination based on filtered results
    setTotalItems(filtered.length);
    setTotalPages(Math.ceil(filtered.length / pageSize));

    // Reset to first page when filters change
    setCurrentPage(1);

    // Get products for current page
    const startIndex = 0;
    const endIndex = Math.min(pageSize, filtered.length);
    setProducts(filtered.slice(startIndex, endIndex));
  }, [
    searchValue,
    categoryFilter,
    statusFilter,
    allProducts,
    mockData,
    pageSize,
  ]);

  // Handle pagination for mock data
  useEffect(() => {
    if (!mockData) return;

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, filteredProducts.length);
    setProducts(filteredProducts.slice(startIndex, endIndex));
  }, [currentPage, filteredProducts, mockData, pageSize]);

  // Utility functions
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);
  };

  const formatNumber = (number) => {
    return (number || 0).toLocaleString();
  };

  const getStatusColor = (status) => {
    const statusMap = {
      active: "text-green-600 bg-green-100",
      "Còn hàng": "text-green-600 bg-green-100",
      pending: "text-yellow-600 bg-yellow-100",
      "Chờ duyệt": "text-yellow-600 bg-yellow-100",
      inactive: "text-gray-600 bg-gray-100",
      "Ngừng bán": "text-gray-600 bg-gray-100",
      out_of_stock: "text-red-600 bg-red-100",
      "Hết hàng": "text-red-600 bg-red-100",
    };
    return statusMap[status] || "text-gray-600 bg-gray-100";
  };

  // CRUD Operations
  const handleViewProduct = (productId) => {
    const product = (allProducts.length > 0 ? allProducts : products).find(
      (p) => p.id === productId
    );
    if (product) {
      setSelectedProduct(product);
      setShowDetailModal(true);
    }
  };

  const handleEditProduct = async (productId) => {
    const product = (allProducts.length > 0 ? allProducts : products).find(
      (p) => p.id === productId
    );
    if (product) {
      setModalMode("edit");

      if (hasImageManagement && service?.getProductImages) {
        // Load detailed image information for editing (seller)
        try {
          console.log(`Loading detailed images for product ${productId}`);
          const imageResponse = await service.getProductImages(productId);

          let detailedImages = [];
          if (imageResponse.success && imageResponse.data) {
            detailedImages = imageResponse.data.map((img) => ({
              id: img.ID_Anh,
              url: `../../../../microservice/product_service${img.Url}`,
              Upload_at: img.Upload_at,
            }));
          }

          setSelectedProduct({
            ...product,
            price:
              typeof product.price === "string"
                ? product.price.replace(/,/g, "")
                : product.price,
            stock: product.quantity,
            images: detailedImages,
            imagesToDelete: [],
            newImageUrls: [],
            imageFiles: [],
            hasImageReorder: false,
          });
        } catch (error) {
          console.error("Error loading images for edit:", error);
          setSelectedProduct({
            ...product,
            price:
              typeof product.price === "string"
                ? product.price.replace(/,/g, "")
                : product.price,
            stock: product.quantity,
            imagesToDelete: [],
            newImageUrls: [],
            imageFiles: [],
            hasImageReorder: false,
          });
        }
      } else {
        // Simple edit for admin
        setSelectedProduct(product);
      }

      setShowProductModal(true);
    }
  };

  const handleAddProduct = () => {
    setModalMode("add");
    setSelectedProduct(null);
    setShowProductModal(true);
  };

  const handleDeleteProduct = (productId) => {
    if (!canDelete) {
      alert(
        `${role === "seller" ? "Seller" : "User"} không thể xóa sản phẩm này!`
      );
      return;
    }

    const product = (allProducts.length > 0 ? allProducts : products).find(
      (p) => p.id === productId
    );
    if (product) {
      setSelectedProduct(product);
      setShowDeleteModal(true);
    }
  };

  const handleSaveProduct = async (productData) => {
    if (!productData) return;

    // Basic validation
    const isValidForAdd =
      modalMode === "add" &&
      productData.name &&
      productData.price &&
      (productData.quantity || productData.stock) &&
      productData.category;

    const isValidForEdit =
      modalMode === "edit" &&
      productData.name &&
      productData.price &&
      productData.category;

    if (!isValidForAdd && !isValidForEdit) {
      alert("😱 Vui lòng điền đầy đủ thông tin!");
      return;
    }

    try {
      if (modalMode === "add") {
        if (service?.addProduct) {
          // API call for seller
          const categoryId = productData.categoryId || 1;

          const newProduct = await service.addProduct({
            tenSanPham: productData.name,
            moTa: productData.description || "",
            gia: productData.price,
            tonKho: Number(productData.quantity || productData.stock),
            danhMuc: categoryId,
            trangThai: productData.status || "active",
          });

          // Upload images if any
          if (hasImageManagement && productData.imageFiles?.length > 0) {
            try {
              await service.uploadProductImages(
                newProduct.data.productId,
                productData.imageFiles
              );
              alert("🎉 Thêm sản phẩm và ảnh thành công!");
            } catch (imageError) {
              alert(
                "⚠️ Thêm sản phẩm thành công nhưng có lỗi khi upload ảnh: " +
                  imageError.message
              );
            }
          } else {
            alert("🎉 Thêm sản phẩm thành công!");
          }

          await loadProducts();
        } else {
          // Mock data for admin
          const newProduct = {
            ...productData,
            id: Math.max(...allProducts.map((p) => p.id), 0) + 1,
            createdDate: new Date().toISOString().split("T")[0],
            status: "pending",
          };
          setAllProducts((prev) => [...prev, newProduct]);
          alert("🎉 Thêm sản phẩm thành công!");
        }
      } else {
        // Update existing product
        if (service?.updateProduct) {
          const categoryId = productData.categoryId || 1;

          const updateData = {
            tenSanPham: productData.name,
            gia: productData.price,
            danhMuc: categoryId,
            moTa: productData.description || "",
            trangThai: productData.status || "active",
          };

          // Handle image changes for seller
          const imageOptions = hasImageManagement
            ? {
                newImageFiles: productData.imageFiles || [],
                imagesToDelete: productData.imagesToDelete || [],
                newImageUrls: productData.newImageUrls || [],
                imageOrder: productData.hasImageReorder
                  ? productData.images
                      .map((img) => img.id || img.ID_Anh)
                      .filter(Boolean)
                  : undefined,
              }
            : {};

          const hasImageChanges =
            hasImageManagement &&
            (imageOptions.newImageFiles.length > 0 ||
              imageOptions.imagesToDelete.length > 0 ||
              imageOptions.newImageUrls.length > 0 ||
              productData.hasImageReorder);

          await service.updateProduct(
            productData.id,
            updateData,
            hasImageChanges ? imageOptions : {}
          );

          // Handle stock addition for seller
          if (hasStockManagement && productData.additionalStock) {
            const additionalStock = Number(productData.additionalStock);
            if (additionalStock > 0) {
              await service.addStock(productData.id, {
                soLuongThayDoi: additionalStock,
                hanhDong: "import",
              });
              alert(
                `🎉 Cập nhật sản phẩm thành công! Đã nhập thêm ${additionalStock} sản phẩm vào kho.`
              );
            }
          } else {
            alert("🎉 Cập nhật sản phẩm thành công!");
          }

          await loadProducts();
        } else {
          // Mock update for admin
          setAllProducts((prev) =>
            prev.map((product) =>
              product.id === selectedProduct.id
                ? { ...product, ...productData }
                : product
            )
          );
          alert("🎉 Cập nhật sản phẩm thành công!");
        }
      }

      handleCloseProductModal();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("❌ Lỗi khi lưu sản phẩm: " + (error.message || "Unknown error"));
    }
  };

  const confirmDeleteProduct = async () => {
    if (!selectedProduct || !canDelete) return;

    try {
      if (service?.deleteProduct) {
        await service.deleteProduct(selectedProduct.id);
        await loadProducts();
      } else {
        // Mock delete for admin
        setAllProducts((prev) =>
          prev.filter((product) => product.id !== selectedProduct.id)
        );
      }

      setShowDeleteModal(false);
      setSelectedProduct(null);
      alert("🗑️ Đã xóa sản phẩm thành công!");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("❌ Lỗi khi xóa sản phẩm: " + (error.message || "Unknown error"));
    }
  };

  // Modal handlers
  const handleCloseProductModal = () => {
    setShowProductModal(false);
    setSelectedProduct(null);
    setModalMode("add");
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedProduct(null);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedProduct(null);
  };

  // Filter handlers
  const handleResetFilters = () => {
    setSearchValue("");
    setCategoryFilter("");
    setStatusFilter("");
    setPriceFilter("");
    setCurrentPage(1);
  };

  // Export functionality
  const handleExport = () => {
    try {
      const headers = [
        "ID",
        "Tên sản phẩm",
        "Giá",
        "Số lượng",
        "Danh mục",
        "Trạng thái",
      ];

      const csvContent = [
        headers,
        ...(filteredProducts.length > 0 ? filteredProducts : products).map(
          (product) => [
            product.id || "",
            product.name || "",
            product.price || "",
            product.quantity || product.stock || "",
            product.category || "",
            product.status || "",
          ]
        ),
      ]
        .map((row) => row.map((cell) => `"${cell}"`).join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `san-pham-${role}-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      link.click();
      window.URL.revokeObjectURL(url);

      alert("📊 Đã xuất dữ liệu thành công!");
    } catch (error) {
      console.error("Export error:", error);
      alert("❌ Lỗi khi xuất dữ liệu!");
    }
  };

  return {
    // Core data
    products,
    allProducts,
    filteredProducts,
    isLoading,
    error,
    stats,

    // Filter & pagination
    searchValue,
    setSearchValue,
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter,
    priceFilter,
    setPriceFilter,
    currentPage,
    setCurrentPage,
    totalItems,
    totalPages,
    pageSize,

    // Modal states
    showProductModal,
    showDetailModal,
    showDeleteModal,
    selectedProduct,
    modalMode,

    // CRUD operations
    handleViewProduct,
    handleEditProduct,
    handleAddProduct,
    handleDeleteProduct,
    handleSaveProduct,
    confirmDeleteProduct,

    // Modal handlers
    handleCloseProductModal,
    handleCloseDetailModal,
    handleCloseDeleteModal,

    // Filter handlers
    handleResetFilters,

    // Utilities
    formatCurrency,
    formatNumber,
    getStatusColor,
    handleExport,

    // Refresh function
    refresh: loadProducts,
  };
};

export default useProductsCommon;
