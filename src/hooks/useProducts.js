import { useState, useEffect } from "react";

// Mock data
const INITIAL_PRODUCTS = [
  {
    id: 1,
    image: null,
    name: "iPhone 15 Pro Max",
    price: "29,990,000",
    quantity: 50,
    category: "Điện thoại",
    status: "Còn hàng",
    description:
      "iPhone 15 Pro Max với chip A17 Pro mạnh mẽ, camera chuyên nghiệp 48MP, màn hình Super Retina XDR 6.7 inch, khung titan cao cấp và pin lâu dài. Thiết kế sang trọng, hiệu năng vượt trội.",
    actions: ["view", "edit", "delete"],
  },
  {
    id: 2,
    image: null,
    name: "Samsung Galaxy S24 Ultra",
    price: "26,990,000",
    quantity: 30,
    category: "Điện thoại",
    status: "Còn hàng",
    description:
      "Samsung Galaxy S24 Ultra với S Pen tích hợp, camera 200MP siêu nét, màn hình Dynamic AMOLED 6.8 inch, chip Snapdragon 8 Gen 3 và tính năng AI thông minh. Trải nghiệm flagship đỉnh cao.",
    actions: ["view", "edit", "delete"],
  },
  {
    id: 3,
    image: null,
    name: "MacBook Air M3",
    price: "32,990,000",
    quantity: 0,
    category: "Laptop",
    status: "Hết hàng",
    description:
      "MacBook Air M3 với thiết kế siêu mỏng, chip M3 8-core mạnh mẽ, màn hình Liquid Retina 13.6 inch, thời lượng pin lên đến 18 giờ. Hoàn hảo cho công việc và sáng tạo.",
    actions: ["view", "edit", "delete"],
  },
  {
    id: 4,
    image: null,
    name: "iPad Pro 12.9",
    price: "24,990,000",
    quantity: 15,
    category: "Máy tính bảng",
    status: "Còn hàng",
    description:
      "iPad Pro 12.9 inch với chip M2, màn hình Liquid Retina XDR, hỗ trợ Apple Pencil Gen 2 và Magic Keyboard. Công cụ sáng tạo chuyên nghiệp trong tầm tay.",
    actions: ["view", "edit", "delete"],
  },
  {
    id: 5,
    image: null,
    name: "AirPods Pro 2",
    price: "6,990,000",
    quantity: 25,
    category: "Phụ kiện",
    status: "Còn hàng",
    description:
      "AirPods Pro 2 với chip H2, chống ồn chủ động nâng cấp, âm thanh không gian cá nhân hóa, thời lượng pin 6 giờ và hộp sạc MagSafe. Trải nghiệm âm thanh đỉnh cao.",
    actions: ["view", "edit", "delete"],
  },
];

const INITIAL_FORM_STATE = {
  name: "",
  price: "",
  quantity: "",
  category: "",
  status: "Còn hàng",
  image: null,
  description: "",
};

export const useProducts = () => {
  // Products state
  const [products, setProducts] = useState([]);

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
  useEffect(() => {
    setProducts(INITIAL_PRODUCTS);
  }, []);

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

  const handleEditProduct = (productId) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      setModalMode("edit");
      setCurrentProduct({
        ...product,
        price: product.price.replace(/,/g, ""), // Remove commas for editing
      });
      setShowProductModal(true);
    }
  };

  const handleSaveProduct = () => {
    if (
      !currentProduct.name ||
      !currentProduct.price ||
      !currentProduct.quantity ||
      !currentProduct.category
    ) {
      alert("😱 Vui lòng điền đầy đủ thông tin!");
      return;
    }

    if (modalMode === "add") {
      const newProduct = {
        id: products.length + 1,
        name: currentProduct.name,
        price: Number(currentProduct.price).toLocaleString(),
        quantity: Number(currentProduct.quantity),
        category: currentProduct.category,
        status: currentProduct.quantity > 0 ? "Còn hàng" : "Hết hàng",
        image: currentProduct.image,
        description: currentProduct.description || "",
        actions: ["view", "edit", "delete"],
      };
      setProducts([...products, newProduct]);
      alert("🎉 Thêm sản phẩm thành công!");
    } else {
      const updatedProducts = products.map((product) =>
        product.id === currentProduct.id
          ? {
              ...currentProduct,
              price: Number(currentProduct.price).toLocaleString(),
              quantity: Number(currentProduct.quantity),
              status:
                Number(currentProduct.quantity) > 0 ? "Còn hàng" : "Hết hàng",
            }
          : product
      );
      setProducts(updatedProducts);
      alert("🎉 Cập nhật sản phẩm thành công!");
    }

    handleCloseProductModal();
  };

  const handleDeleteProduct = (productId) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      setProductToDelete(product);
      setShowDeleteModal(true);
    }
  };

  const confirmDeleteProduct = () => {
    if (productToDelete) {
      const updatedProducts = products.filter(
        (product) => product.id !== productToDelete.id
      );
      setProducts(updatedProducts);
      setShowDeleteModal(false);
      setProductToDelete(null);
      alert("🗑️ Đã xóa sản phẩm thành công!");
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
  };
};
