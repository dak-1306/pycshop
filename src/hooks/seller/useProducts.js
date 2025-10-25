import sellerProductService from "../../lib/services/sellerProductService.js";
import useProductsCommon from "../common/useProducts.js";
import { useCategories } from "../api/useCategories.js";

const INITIAL_FORM_STATE = {
  name: "",
  description: "",
  price: 0,
  stock: 0,
  category: "",
  weight: 1, // Default 1kg
  unit: "cái", // Default unit
  images: [],
  imageFiles: [], // For new image files
  imagesToDelete: [], // For tracking images to delete
  newImageUrls: [], // For new image URLs
  hasImageReorder: false, // For tracking image reordering
  featured: false,
};

export const useProducts = () => {
  // Get categories helper
  const { categories } = useCategories(false);

  // Use common hook with seller-specific configuration
  const commonHook = useProductsCommon({
    role: "seller",
    service: sellerProductService,
    canDelete: true, // Sellers can delete their own products
    pageSize: 10,
    hasImageManagement: true, // Enable complex image handling
    hasStockManagement: true, // Enable stock management
  });

  // Seller-specific product operations with additional business logic
  const handleSaveProduct = async (productData = null) => {
    const productToSave = productData || commonHook.selectedProduct;

    // Seller-specific validation
    const isValidForAdd =
      commonHook.modalMode === "add" &&
      productToSave.name &&
      productToSave.price &&
      (productToSave.quantity || productToSave.stock) &&
      productToSave.category;

    const isValidForEdit =
      commonHook.modalMode === "edit" &&
      productToSave.name &&
      productToSave.price &&
      productToSave.category;

    if (!isValidForAdd && !isValidForEdit) {
      console.log("[useProducts] Validation failed:", productToSave);
      alert("😱 Vui lòng điền đầy đủ thông tin!");
      return;
    }

    try {
      if (commonHook.modalMode === "add") {
        // Find category ID from category name
        const categoryId =
          categories.find((cat) => cat.name === productToSave.category)?.id ||
          productToSave.categoryId ||
          1;

        const productPayload = {
          tenSanPham: productToSave.name,
          moTa: productToSave.description || "",
          gia: productToSave.price,
          tonKho: Number(productToSave.quantity || productToSave.stock),
          danhMuc: categoryId,
          trangThai: productToSave.status || "active",
        };

        // Use common hook's create function with seller-specific payload
        await commonHook.createProduct(productPayload);

        alert("🎉 Thêm sản phẩm thành công!");
      } else {
        // Find category ID for update
        const categoryId =
          categories.find((cat) => cat.name === productToSave.category)?.id ||
          productToSave.categoryId ||
          1;

        const updatePayload = {
          tenSanPham: productToSave.name,
          gia: productToSave.price,
          danhMuc: categoryId,
          moTa: productToSave.description || "",
          trangThai: productToSave.status || "active",
        };

        // Use common hook's update function
        await commonHook.updateProduct(productToSave.id, updatePayload);

        // Handle additional stock if needed
        const additionalStock = Number(productToSave.additionalStock) || 0;
        if (additionalStock > 0) {
          console.log(
            `[useProducts] Adding ${additionalStock} stock to product ${productToSave.id}`
          );
          await sellerProductService.addStock(productToSave.id, {
            soLuongThayDoi: additionalStock,
            hanhDong: "import",
          });
          alert(
            `🎉 Cập nhật sản phẩm thành công! Đã nhập thêm ${additionalStock} sản phẩm vào kho.`
          );
        } else {
          alert("🎉 Cập nhật sản phẩm thành công!");
        }
      }

      commonHook.closeModal();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("❌ Lỗi khi lưu sản phẩm: " + (error.message || "Unknown error"));
    }
  };

  // Seller-specific image handling functions that extend the common hook
  const handleImageUpload = (files) => {
    const maxImages = 15;
    const currentImages = commonHook.selectedProduct?.images || [];
    const remainingSlots = maxImages - currentImages.length;

    if (files.length > remainingSlots) {
      alert(`Chỉ có thể thêm tối đa ${remainingSlots} hình ảnh nữa!`);
      return;
    }

    const validFiles = [];
    const invalidFiles = [];

    files.forEach((file) => {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        invalidFiles.push(`${file.name}: File quá lớn (max 10MB)`);
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        invalidFiles.push(`${file.name}: Chỉ chấp nhận file hình ảnh`);
        return;
      }

      validFiles.push(file);
    });

    if (invalidFiles.length > 0) {
      alert("Một số file không hợp lệ:\n" + invalidFiles.join("\n"));
    }

    if (validFiles.length === 0) return;

    // Use common hook's image handling
    commonHook.handleImageUpload(validFiles);
  };

  const handleSetFeaturedImage = (index) => {
    console.log(`[useProducts] Setting image at index ${index} as featured`);

    if (index === 0) {
      console.log("[useProducts] Image is already featured");
      alert("ℹ️ Ảnh này đã là ảnh chính!");
      return; // Already featured
    }

    // Use common hook's featured image handling
    commonHook.setFeaturedImage(index);

    // Show success feedback
    alert("⭐ Đã đặt ảnh làm ảnh chính!");
  };

  // Return API with backward compatibility mapping
  return {
    // State - map from common hook for backward compatibility
    products: commonHook.products,
    currentProduct: commonHook.selectedProduct || INITIAL_FORM_STATE,
    setCurrentProduct: commonHook.setSelectedProduct,
    modalMode: commonHook.modalMode,
    showProductModal: commonHook.showProductModal,
    showDetailModal: commonHook.showDetailModal,
    showDeleteModal: commonHook.showDeleteModal,
    productToDelete: commonHook.selectedProduct,
    searchTerm: commonHook.searchValue,
    setSearchTerm: commonHook.setSearchValue,
    selectedCategory: commonHook.categoryFilter,
    setSelectedCategory: commonHook.setCategoryFilter,
    selectedStatus: commonHook.statusFilter,
    setSelectedStatus: commonHook.setStatusFilter,
    selectedPrice: commonHook.priceFilter,
    setSelectedPrice: commonHook.setPriceFilter,
    currentPage: commonHook.currentPage,
    setCurrentPage: commonHook.setCurrentPage,
    totalItems: commonHook.totalItems,
    totalPages: commonHook.totalPages,
    isLoading: commonHook.isLoading,
    error: commonHook.error,

    // Actions - use common hook functions with seller-specific wrappers where needed
    handleViewProduct: commonHook.handleViewProduct,
    handleAddProduct: commonHook.handleAddProduct,
    handleEditProduct: commonHook.handleEditProduct,
    handleSaveProduct, // Custom seller implementation
    handleDeleteProduct: commonHook.handleDeleteProduct,
    confirmDeleteProduct: commonHook.confirmDeleteProduct,
    handleCloseProductModal: commonHook.handleCloseProductModal,
    handleCloseDetailModal: commonHook.handleCloseDetailModal,
    handleCloseDeleteModal: commonHook.handleCloseDeleteModal,
    handleResetFilters: commonHook.handleResetFilters,
    handleExport: commonHook.handleExport,
    getStatusColor: commonHook.getStatusColor,
    loadProducts: commonHook.refresh, // Use refresh function

    // Image handling - seller-specific implementations
    handleImageUpload, // Custom seller implementation
    handleRemoveImage: commonHook.removeImage,
    handleSetFeaturedImage, // Custom seller implementation

    // Image management API - delegate to service or common hook
    loadProductImages: (productId) =>
      sellerProductService.getProductImages(productId),
    addProductImages: (productId, images) =>
      sellerProductService.addProductImages(productId, images),
    deleteProductImage: (productId, imageId) =>
      sellerProductService.deleteProductImage(productId, imageId),
    deleteProductImages: (productId, imageIds) =>
      sellerProductService.deleteProductImages(productId, imageIds),
  };
};
