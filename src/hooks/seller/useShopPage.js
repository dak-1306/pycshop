import { useState, useEffect, useCallback } from "react";
import {
  DEFAULT_SHOP_INFO,
  INITIAL_PRODUCT_STATE,
  PAGINATION_CONFIG,
  MODAL_MODES,
  SHOP_STATUS_COLORS,
  RECENT_ACTIVITIES,
  MOCK_PRODUCTS,
} from "../constants/shopPageConstants";
import ShopService from "../../services/shopService";

export const useShopPage = () => {
  // Shop Info State
  const [shopInfo, setShopInfo] = useState(DEFAULT_SHOP_INFO);

  // Product States
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Categories State
  const [categories, setCategories] = useState([]);

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
      console.log("First product structure:", response.data?.[0]);

      if (response && response.success) {
        // Map API response to frontend format
        const mappedProducts = (response.data || []).map((product) => {
          console.log("Processing product:", product);
          return {
            id: product.ID_SanPham,
            name: product.TenSanPham,
            description: product.MoTa,
            price: parseFloat(product.Gia),
            stock: product.TonKho,
            stock_quantity: product.TonKho, // Alternative field name
            quantity: product.TonKho, // Alternative field name
            category: product.Category || product.TenDanhMuc,
            status: product.TrangThai || "Còn hàng",
            images: product.images || product.HinhAnh || [],
            created_at: product.NgayTao,
            updated_at: product.NgayCapNhat,
            // Add any other fields that might be needed
          };
        });

        console.log("Mapped products:", mappedProducts);

        // Load images for each product
        const productsWithImages = await Promise.all(
          mappedProducts.map(async (product) => {
            try {
              const token =
                localStorage.getItem("token") ||
                sessionStorage.getItem("token");
              const imageResponse = await fetch(
                `http://localhost:5002/seller/products/${product.id}/images`,
                {
                  headers: {
                    "Content-Type": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` }),
                  },
                }
              );

              if (imageResponse.ok) {
                const imageData = await imageResponse.json();
                console.log(`Images for product ${product.id}:`, imageData);
                return {
                  ...product,
                  images: imageData.data || imageData.images || [],
                };
              }
            } catch (error) {
              console.log(
                `Failed to load images for product ${product.id}:`,
                error
              );
            }
            return product;
          })
        );

        setProducts(productsWithImages);
        setTotalPages(
          Math.ceil(
            (response.pagination?.total || 0) / PAGINATION_CONFIG.itemsPerPage
          )
        );
        console.log(
          "Products with images loaded successfully:",
          productsWithImages.length,
          "products"
        );
      } else {
        console.log("No products found or unsuccessful response");
        setProducts([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error loading products:", error);
      console.log("Using mock products as fallback");

      // Use mock products as fallback for testing UI
      setProducts(MOCK_PRODUCTS);
      setTotalPages(1);
      setError(null);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCategory, selectedStatus, sortBy, currentPage]);

  // Load categories
  const loadCategories = useCallback(async () => {
    try {
      const response = await ShopService.getCategories();
      if (response && response.success) {
        setCategories(response.categories || []);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  }, []);

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

  // Initial load for shop info and categories
  useEffect(() => {
    loadShopInfo();
    loadCategories();
  }, [loadShopInfo, loadCategories]);

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
    console.log("useShopPage - handleAddProduct called");
    console.log("MODAL_MODES.ADD:", MODAL_MODES.ADD);
    console.log("INITIAL_PRODUCT_STATE:", INITIAL_PRODUCT_STATE);

    setCurrentProduct(INITIAL_PRODUCT_STATE);
    setModalMode(MODAL_MODES.ADD);
    setShowProductModal(true);

    console.log("Modal state should be set to true");
  };

  const handleViewProduct = (product) => {
    setCurrentProduct({ ...product });
    setModalMode("view"); // Set mode to view for ProductDetailModal
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
          // Force reload products to show new product
          await loadProducts();
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
          // Force reload products to show updated product
          await loadProducts();
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
        // Force reload products to update list
        await loadProducts();
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
    handleViewProduct,
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

    // Categories
    categories,

    // Constants
    recentActivities: [], // TODO: Load from API
  };
};
