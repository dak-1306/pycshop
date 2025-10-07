import { useState, useEffect } from "react";
import sellerProductService from "../services/sellerProductService.js";
import { useCategories } from "./useCategories.js";

const INITIAL_FORM_STATE = {
  name: "",
  description: "",
  price: 0,
  stock: 0,
  category: "",
  weight: 1, // Default 1kg
  unit: "cái", // Default unit
  images: [],
  featured: false,
};

export const useProducts = () => {
  // Get categories helper
  const { getCategoryName, categories } = useCategories();

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
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Initialize products
  const loadProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("[useProducts] Loading products from API...");
      const response = await sellerProductService.getSellerProducts({
        page: currentPage,
        limit: 10,
        search: searchTerm || undefined,
        status: selectedStatus || undefined,
        sortBy: "created_date",
        sortOrder: "DESC",
      });

      console.log("[useProducts] API Response:", response);

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
            status: product.TrangThai === "active" ? "Còn hàng" : "Hết hàng",
            description: product.MoTa || "",
            images: imageArray,
            image:
              imageArray.length > 0
                ? `http://localhost:5002${imageArray[0]}`
                : null, // Add first image URL for ProductTable (bypass API Gateway)
            imageFiles: [],
            shopName: product.TenCuaHang || "",
            created_date: product.created_date,
            actions: ["view", "edit", "delete"],
          };
        });

        console.log("[useProducts] Mapped products:", mappedProducts);
        setProducts(mappedProducts);
      } else {
        console.warn("[useProducts] No data in response");
        setError("Không có dữ liệu sản phẩm từ server");
        setProducts([]);
      }
    } catch (error) {
      console.error("[useProducts] Error loading products:", error);
      setError("Lỗi khi tải danh sách sản phẩm: " + error.message);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [currentPage, searchTerm, selectedCategory, selectedStatus]);

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
    const maxImages = 5;
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
    const newImages = currentProduct.images.filter((_, i) => i !== index);
    const newImageFiles = currentProduct.imageFiles
      ? currentProduct.imageFiles.filter((_, i) => i !== index)
      : [];

    setCurrentProduct({
      ...currentProduct,
      images: newImages,
      imageFiles: newImageFiles,
    });
  };

  const handleSetFeaturedImage = (index) => {
    if (index === 0) return; // Already featured

    const newImages = [
      currentProduct.images[index],
      ...currentProduct.images.filter((_, i) => i !== index),
    ];
    const newImageFiles = currentProduct.imageFiles
      ? [
          currentProduct.imageFiles[index],
          ...currentProduct.imageFiles.filter((_, i) => i !== index),
        ]
      : [];

    setCurrentProduct({
      ...currentProduct,
      images: newImages,
      imageFiles: newImageFiles,
    });
  };

  const handleEditProduct = (productId) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      setModalMode("edit");
      setCurrentProduct({
        ...product,
        price: product.price.replace(/,/g, ""), // Remove commas for editing
        stock: product.quantity, // Ensure stock field exists for edit
      });
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

        // Update basic product info (NO tonKho field)
        await sellerProductService.updateProduct(productToSave.id, {
          tenSanPham: productToSave.name,
          gia: productToSave.price,
          danhMuc: categoryId,
          moTa: productToSave.description || "",
          trangThai: productToSave.status || "active",
        });

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
