import { useState, useEffect, useCallback } from "react";
import sellerProductService from "../../services/sellerProductService.js";
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
  const { categories } = useCategories(false); // Sử dụng seller API

  // Products state
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form and modal states
  const [currentProduct, setCurrentProduct] = useState(INITIAL_FORM_STATE);
  const [modalMode, setModalMode] = useState("add");
  const [showProductModal, setShowProductModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination states
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Initialize products
  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await sellerProductService.getSellerProducts({
        page: currentPage,
        limit: 10,
        search: debouncedSearchTerm || undefined,
        status: selectedStatus || undefined,
        sortBy: "created_date",
        sortOrder: "DESC",
      });

      if (response.success && response.data) {
        // Map backend data to frontend format
        const mappedProducts = response.data.map((product) => {
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

        setProducts(mappedProducts);

        // Update pagination info
        if (response.pagination) {
          setTotalItems(response.pagination.total || 0);
          setTotalPages(response.pagination.totalPages || 1);
        }
      } else {
        setError("Không có dữ liệu sản phẩm từ server");
        setProducts([]);
        setTotalItems(0);
        setTotalPages(1);
      }
    } catch (error) {
      setError("Lỗi khi tải danh sách sản phẩm: " + error.message);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, debouncedSearchTerm, selectedStatus]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Product operations
  const handleViewProduct = (productId) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      setCurrentProduct(product);
      setShowDetailModal(true);
    }
  };

  const handleAddProduct = () => {
    setModalMode("add");
    setCurrentProduct(INITIAL_FORM_STATE);
    setShowProductModal(true);
  };

  // Image handling functions
  const handleImageUpload = (files) => {
    const maxImages = 15;
    const currentImages = currentProduct.images || [];
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

    // Convert valid files to base64 for preview
    const newImages = [];
    const newImageFiles = currentProduct.imageFiles
      ? [...currentProduct.imageFiles]
      : [];

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        newImages.push(event.target.result);
        newImageFiles.push(file);

        // Update product when all files are processed
        if (newImages.length === validFiles.length) {
          setCurrentProduct({
            ...currentProduct,
            images: [...currentImages, ...newImages],
            imageFiles: newImageFiles,
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index) => {
    const imageToRemove = currentProduct.images[index];
    const newImages = currentProduct.images.filter((_, i) => i !== index);
    const newImageFiles = currentProduct.imageFiles
      ? currentProduct.imageFiles.filter((_, i) => i !== index)
      : [];

    // Track images that need to be deleted from database
    const imagesToDelete = currentProduct.imagesToDelete || [];

    // If the image has an ID (existing image from DB), add it to delete list
    if (imageToRemove && imageToRemove.id) {
      imagesToDelete.push(imageToRemove.id);
      console.log(
        `[useProducts] Added image ID ${imageToRemove.id} to delete list`,
        imagesToDelete
      );
    } else if (
      typeof imageToRemove === "string" &&
      imageToRemove.includes("/uploads/")
    ) {
      // Handle legacy string URLs by trying to extract ID from backend
      console.warn(
        `[useProducts] Cannot delete image without ID: ${imageToRemove}`
      );
    }

    setCurrentProduct({
      ...currentProduct,
      images: newImages,
      imageFiles: newImageFiles,
      imagesToDelete: imagesToDelete,
    });
  };

  const handleSetFeaturedImage = (index) => {
    console.log(`[useProducts] Setting image at index ${index} as featured`);

    if (index === 0) {
      console.log("[useProducts] Image is already featured");
      alert("ℹ️ Ảnh này đã là ảnh chính!");
      return; // Already featured
    }

    // Move selected image to first position
    const selectedImage = currentProduct.images[index];
    const newImages = [
      selectedImage,
      ...currentProduct.images.filter((_, i) => i !== index),
    ];

    // Also reorder imageFiles if they exist
    const newImageFiles = currentProduct.imageFiles
      ? [
          currentProduct.imageFiles[index] || null,
          ...currentProduct.imageFiles.filter((_, i) => i !== index),
        ].filter(Boolean)
      : [];

    console.log("[useProducts] New image order:", {
      oldOrder: currentProduct.images.map(
        (img, i) => `${i}: ${img.url || img}`
      ),
      newOrder: newImages.map((img, i) => `${i}: ${img.url || img}`),
    });

    setCurrentProduct({
      ...currentProduct,
      images: newImages,
      imageFiles: newImageFiles,
      hasImageReorder: true, // Flag to indicate images were reordered
    });

    // Show success feedback
    alert("⭐ Đã đặt ảnh làm ảnh chính!");
  };

  const handleEditProduct = async (productId) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      setModalMode("edit");

      // Load detailed image information for editing
      try {
        console.log(
          `[useProducts] Loading detailed images for product ${productId}`
        );
        const imageResponse = await sellerProductService.getProductImages(
          productId
        );

        let detailedImages = [];
        if (imageResponse.success && imageResponse.data) {
          detailedImages = imageResponse.data.map((img) => ({
            id: img.ID_Anh, // Image ID for deletion
            url: `../../../../microservice/product_service${img.Url}`, // Image URL
            Upload_at: img.Upload_at, // Upload timestamp
          }));
          console.log(
            `[useProducts] Loaded ${detailedImages.length} detailed images:`,
            detailedImages
          );
        }

        setCurrentProduct({
          ...product,
          price: product.price.replace(/,/g, ""), // Remove commas for editing
          stock: product.quantity, // Ensure stock field exists for edit
          images: detailedImages, // Use detailed images with IDs
          imagesToDelete: [], // Initialize empty array to track deleted images
          newImageUrls: [], // Initialize empty array for new URL images
          imageFiles: [], // Initialize empty array for new files
          hasImageReorder: false, // Initialize reorder flag
        });
      } catch (error) {
        console.error("[useProducts] Error loading images for edit:", error);
        // Fallback to original images without IDs
        setCurrentProduct({
          ...product,
          price: product.price.replace(/,/g, ""),
          stock: product.quantity,
          imagesToDelete: [],
          newImageUrls: [],
          imageFiles: [],
          hasImageReorder: false,
        });
      }

      setShowProductModal(true);
    }
  };

  const handleSaveProduct = async (productData = null) => {
    // Use product data from modal (if provided) or current product
    const productToSave = productData || currentProduct;

    // Different validation for add vs edit mode
    const isValidForAdd =
      modalMode === "add" &&
      productToSave.name &&
      productToSave.price &&
      (productToSave.quantity || productToSave.stock) &&
      productToSave.category;

    const isValidForEdit =
      modalMode === "edit" &&
      productToSave.name &&
      productToSave.price &&
      productToSave.category;

    if (!isValidForAdd && !isValidForEdit) {
      console.log("[useProducts] Validation failed:", productToSave);
      alert("😱 Vui lòng điền đầy đủ thông tin!");
      return;
    }

    try {
      if (modalMode === "add") {
        console.log("[useProducts] Adding new product:", productToSave);

        // Find category ID from category name
        const categoryId =
          categories.find((cat) => cat.name === productToSave.category)?.id ||
          productToSave.categoryId ||
          1;

        const newProduct = await sellerProductService.addProduct({
          tenSanPham: productToSave.name,
          moTa: productToSave.description || "",
          gia: productToSave.price,
          tonKho: Number(productToSave.quantity || productToSave.stock),
          danhMuc: categoryId, // Use category ID for backend
          trangThai: productToSave.status || "active",
        });

        console.log("[useProducts] Product created successfully:", newProduct);

        // Upload images if any files were selected
        if (productToSave.imageFiles && productToSave.imageFiles.length > 0) {
          console.log(
            "[useProducts] Uploading images for new product:",
            newProduct.data.productId
          );
          try {
            const imageUploadResult =
              await sellerProductService.uploadProductImages(
                newProduct.data.productId,
                productToSave.imageFiles
              );
            console.log(
              "[useProducts] Images uploaded successfully:",
              imageUploadResult
            );
            alert("🎉 Thêm sản phẩm và ảnh thành công!");
          } catch (imageError) {
            console.error("[useProducts] Error uploading images:", imageError);
            alert(
              "⚠️ Thêm sản phẩm thành công nhưng có lỗi khi upload ảnh: " +
                imageError.message
            );
          }
        } else {
          alert("🎉 Thêm sản phẩm thành công!");
        }
      } else {
        console.log("[useProducts] Updating product:", productToSave);

        // Find category ID from category name
        const categoryId =
          categories.find((cat) => cat.name === productToSave.category)?.id ||
          productToSave.categoryId ||
          1;

        // Prepare update data
        const updateData = {
          tenSanPham: productToSave.name,
          gia: productToSave.price,
          danhMuc: categoryId,
          moTa: productToSave.description || "",
          trangThai: productToSave.status || "active",
        };

        // Prepare image options
        const imageOptions = {
          newImageFiles: productToSave.imageFiles || [],
          imagesToDelete: productToSave.imagesToDelete || [],
          newImageUrls: productToSave.newImageUrls || [],
          // Send image order if images were reordered
          imageOrder: productToSave.hasImageReorder
            ? productToSave.images
                .map((img) => img.id || img.ID_Anh)
                .filter(Boolean)
            : undefined,
        };

        // Check if we need to handle images
        const hasImageChanges =
          imageOptions.newImageFiles.length > 0 ||
          imageOptions.imagesToDelete.length > 0 ||
          imageOptions.newImageUrls.length > 0 ||
          productToSave.hasImageReorder; // Include image reordering

        // Always use unified updateProduct function
        console.log("[useProducts] Updating product with unified function:", {
          hasImageChanges,
          hasImageReorder: productToSave.hasImageReorder,
          imageOptions: hasImageChanges ? imageOptions : "none",
          productToSave: {
            id: productToSave.id,
            name: productToSave.name,
            imagesToDelete: productToSave.imagesToDelete,
            imageFiles: productToSave.imageFiles?.length || 0,
            imagesCount: productToSave.images?.length || 0,
          },
        });

        await sellerProductService.updateProduct(
          productToSave.id,
          updateData,
          hasImageChanges ? imageOptions : {}
        );

        // Check if we need to add stock (additionalStock from ProductModal)
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
          alert(`🎉 Cập nhật sản phẩm thành công!`);
        }
      }

      // Reload products
      console.log("[useProducts] Reloading products after save...");
      await loadProducts();

      handleCloseProductModal();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("❌ Lỗi khi lưu sản phẩm: " + (error.message || "Unknown error"));
    }
  };

  const handleDeleteProduct = (productId) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      setProductToDelete(product);
      setShowDeleteModal(true);
    }
  };

  const confirmDeleteProduct = async () => {
    if (productToDelete) {
      try {
        console.log("[useProducts] Deleting product:", productToDelete.id);

        await sellerProductService.deleteProduct(productToDelete.id);

        // Reload products
        console.log("[useProducts] Reloading products after delete...");
        await loadProducts();

        setShowDeleteModal(false);
        setProductToDelete(null);
        alert("🗑️ Đã xóa sản phẩm thành công!");
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("❌ Lỗi khi xóa sản phẩm: " + (error.message || "Unknown error"));
      }
    }
  };

  // Modal operations
  const handleCloseProductModal = () => {
    setShowProductModal(false);
    setCurrentProduct(INITIAL_FORM_STATE);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  // Filter operations
  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedStatus("");
    setSelectedPrice("");
    setCurrentPage(1);
  };

  // Export functionality
  const handleExport = () => {
    const headers = [
      "ID",
      "Tên sản phẩm",
      "Giá (đ)",
      "Số lượng",
      "Danh mục",
      "Trạng thái",
    ];
    const csvContent = [
      headers.join(","),
      ...products.map((product) =>
        [
          product.id,
          `"${product.name}"`,
          `"${product.price}"`,
          product.quantity,
          `"${product.category}"`,
          `"${product.status}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `san-pham-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    alert("📊 Đã xuất dữ liệu thành công!");
  };

  // Utility functions
  const getStatusColor = (status) => {
    switch (status) {
      case "Còn hàng":
        return "text-green-600 bg-green-100";
      case "Hết hàng":
        return "text-red-600 bg-red-100";
      case "Ngừng bán":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  // Image Management Functions
  const loadProductImages = async (productId) => {
    try {
      console.log(`[useProducts] Loading images for product ${productId}`);
      const response = await sellerProductService.getProductImages(productId);

      if (response.success && response.data) {
        return response.data;
      } else {
        console.warn(`[useProducts] No images found for product ${productId}`);
        return [];
      }
    } catch (error) {
      console.error(
        `[useProducts] Error loading images for product ${productId}:`,
        error
      );
      throw error;
    }
  };

  const addProductImages = async (productId, images) => {
    try {
      console.log(
        `[useProducts] Adding images to product ${productId}:`,
        images
      );

      if (!Array.isArray(images) || images.length === 0) {
        throw new Error("Images must be a non-empty array");
      }

      const response = await sellerProductService.addProductImages(
        productId,
        images
      );

      if (response.success) {
        // Reload products to reflect changes
        await loadProducts();
        return response.data;
      } else {
        throw new Error(response.message || "Failed to add images");
      }
    } catch (error) {
      console.error(
        `[useProducts] Error adding images to product ${productId}:`,
        error
      );
      throw error;
    }
  };

  const deleteProductImage = async (productId, imageId) => {
    try {
      console.log(
        `[useProducts] Deleting image ${imageId} from product ${productId}`
      );

      const response = await sellerProductService.deleteProductImage(
        productId,
        imageId
      );

      if (response.success) {
        // Reload products to reflect changes
        await loadProducts();
        return response.data;
      } else {
        throw new Error(response.message || "Failed to delete image");
      }
    } catch (error) {
      console.error(
        `[useProducts] Error deleting image ${imageId} from product ${productId}:`,
        error
      );
      throw error;
    }
  };

  const deleteProductImages = async (productId, imageIds) => {
    try {
      console.log(
        `[useProducts] Deleting images from product ${productId}:`,
        imageIds
      );

      if (!Array.isArray(imageIds) || imageIds.length === 0) {
        throw new Error("Image IDs must be a non-empty array");
      }

      const response = await sellerProductService.deleteProductImages(
        productId,
        imageIds
      );

      if (response.success) {
        // Reload products to reflect changes
        await loadProducts();
        return response.data;
      } else {
        throw new Error(response.message || "Failed to delete images");
      }
    } catch (error) {
      console.error(
        `[useProducts] Error deleting images from product ${productId}:`,
        error
      );
      throw error;
    }
  };

  return {
    // State
    products,
    currentProduct,
    setCurrentProduct,
    modalMode,
    showProductModal,
    showDetailModal,
    showDeleteModal,
    productToDelete,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedStatus,
    setSelectedStatus,
    selectedPrice,
    setSelectedPrice,
    currentPage,
    setCurrentPage,
    totalItems,
    totalPages,
    isLoading,
    error,

    // Actions
    handleViewProduct,
    handleAddProduct,
    handleEditProduct,
    handleSaveProduct,
    handleDeleteProduct,
    confirmDeleteProduct,
    handleCloseProductModal,
    handleCloseDetailModal,
    handleCloseDeleteModal,
    handleResetFilters,
    handleExport,
    getStatusColor,
    loadProducts, // Add retry function

    // Image handling
    handleImageUpload,
    handleRemoveImage,
    handleSetFeaturedImage,

    // Image management API
    loadProductImages,
    addProductImages,
    deleteProductImage,
    deleteProductImages,
  };
};
