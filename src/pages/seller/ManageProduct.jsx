import React, { useState, useEffect } from "react";
import SellerLayout from "../../components/layout/SellerLayout";
import ProductModal from "../../components/modals/ProductModal";
import DeleteModal from "../../components/modals/DeleteModal";

// CSS animations
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideUp {
    from { 
      opacity: 0; 
      transform: translateY(50px) scale(0.95); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0) scale(1); 
    }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out;
  }
  
  .animate-slideUp {
    animation: slideUp 0.4s ease-out;
  }
`;

// Inject styles
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

const ManageProduct = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);

  // Modal states - Simplified
  const [showProductModal, setShowProductModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // 'add' or 'edit'
  const [currentProduct, setCurrentProduct] = useState({
    name: "",
    price: "",
    quantity: "",
    category: "",
    status: "Còn hàng",
    image: null,
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Mock data for demonstration
  useEffect(() => {
    setProducts([
      {
        id: 1,
        image: null,
        name: "iPhone 15 Pro Max",
        price: "29,990,000",
        quantity: 50,
        category: "Điện thoại",
        status: "Còn hàng",
        actions: ["edit", "delete"],
      },
      {
        id: 2,
        image: null,
        name: "Samsung Galaxy S24 Ultra",
        price: "26,990,000",
        quantity: 30,
        category: "Điện thoại",
        status: "Còn hàng",
        actions: ["edit", "delete"],
      },
      {
        id: 3,
        image: null,
        name: "MacBook Air M3",
        price: "32,990,000",
        quantity: 0,
        category: "Laptop",
        status: "Hết hàng",
        actions: ["edit", "delete"],
      },
      {
        id: 4,
        image: null,
        name: "iPad Pro 12.9",
        price: "24,990,000",
        quantity: 15,
        category: "Máy tính bảng",
        status: "Còn hàng",
        actions: ["edit", "delete"],
      },
      {
        id: 5,
        image: null,
        name: "AirPods Pro 2",
        price: "6,990,000",
        quantity: 25,
        category: "Phụ kiện",
        status: "Còn hàng",
        actions: ["edit", "delete"],
      },
    ]);
  }, []);

  const categories = [
    "Tất cả",
    "Điện thoại",
    "Laptop",
    "Máy tính bảng",
    "Phụ kiện",
  ];
  const statuses = ["Tất cả", "Còn hàng", "Hết hàng", "Ngừng bán"];
  const priceRanges = [
    "Tất cả",
    "Dưới 10 triệu",
    "10-20 triệu",
    "20-30 triệu",
    "Trên 30 triệu",
  ];

  const handleAddProduct = () => {
    setModalMode("add");
    setCurrentProduct({
      name: "",
      price: "",
      quantity: "",
      category: "",
      status: "Còn hàng",
      image: null,
    });
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
        actions: ["edit", "delete"],
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

    setShowProductModal(false);
    setCurrentProduct({
      name: "",
      price: "",
      quantity: "",
      category: "",
      status: "Còn hàng",
      image: null,
    });
  };

  const handleCloseProductModal = () => {
    setShowProductModal(false);
    setCurrentProduct({
      name: "",
      price: "",
      quantity: "",
      category: "",
      status: "Còn hàng",
      image: null,
    });
  };

  const handleExport = () => {
    // Tạo dữ liệu CSV
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

    // Tạo và download file
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

    // Success notification
    alert("📊 Đã xuất dữ liệu thành công!");
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

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedStatus("");
    setSelectedPrice("");
    setCurrentPage(1);
  };

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

  return (
    <SellerLayout title="Manage Product">
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-lg mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 rounded-lg transform rotate-1 opacity-20"></div>
            <div className="relative bg-white rounded-lg shadow-md">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-6 pr-14 py-4 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-700 placeholder-gray-400 text-lg"
              />
              <button className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-full transition-colors">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Filters and Action Buttons */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-6">
            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Category Filter */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={`relative appearance-none bg-white border-2 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all hover:shadow-md min-w-[160px] font-medium ${
                    selectedCategory
                      ? "border-orange-500 bg-orange-50 text-orange-700 shadow-md"
                      : "border-gray-300 text-gray-700 hover:border-orange-300"
                  }`}
                >
                  <option value="">📂 Danh mục</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg
                    className={`w-5 h-5 transition-colors ${
                      selectedCategory ? "text-orange-600" : "text-gray-400"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              {/* Status Filter */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className={`relative appearance-none bg-white border-2 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all hover:shadow-md min-w-[160px] font-medium ${
                    selectedStatus
                      ? "border-green-500 bg-green-50 text-green-700 shadow-md"
                      : "border-gray-300 text-gray-700 hover:border-green-300"
                  }`}
                >
                  <option value="">🏷️ Trạng thái</option>
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg
                    className={`w-5 h-5 transition-colors ${
                      selectedStatus ? "text-green-600" : "text-gray-400"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              {/* Price Filter */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
                <select
                  value={selectedPrice}
                  onChange={(e) => setSelectedPrice(e.target.value)}
                  className={`relative appearance-none bg-white border-2 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:shadow-md min-w-[160px] font-medium ${
                    selectedPrice
                      ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md"
                      : "border-gray-300 text-gray-700 hover:border-blue-300"
                  }`}
                >
                  <option value="">💰 Khoảng giá</option>
                  {priceRanges.map((range) => (
                    <option key={range} value={range}>
                      {range}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg
                    className={`w-5 h-5 transition-colors ${
                      selectedPrice ? "text-blue-600" : "text-gray-400"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              {/* Reset Button */}
              <div className="ml-3 pl-3 border-l-2 border-gray-200">
                <button
                  onClick={handleResetFilters}
                  className={`group relative bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl ${
                    selectedCategory || selectedStatus || selectedPrice
                      ? "animate-pulse"
                      : ""
                  }`}
                  title="Reset tất cả bộ lọc"
                >
                  <svg
                    className="w-6 h-6 transition-transform group-hover:rotate-180 duration-300"
                    fill="currentColor"
                    viewBox="0 0 640 640"
                  >
                    <path d="M129.9 292.5C143.2 199.5 223.3 128 320 128C373 128 421 149.5 455.8 184.2C456 184.4 456.2 184.6 456.4 184.8L464 192L416.1 192C398.4 192 384.1 206.3 384.1 224C384.1 241.7 398.4 256 416.1 256L544.1 256C561.8 256 576.1 241.7 576.1 224L576.1 96C576.1 78.3 561.8 64 544.1 64C526.4 64 512.1 78.3 512.1 96L512.1 149.4L500.8 138.7C454.5 92.6 390.5 64 320 64C191 64 84.3 159.4 66.6 283.5C64.1 301 76.2 317.2 93.7 319.7C111.2 322.2 127.4 310 129.9 292.6zM573.4 356.5C575.9 339 563.7 322.8 546.3 320.3C528.9 317.8 512.6 330 510.1 347.4C496.8 440.4 416.7 511.9 320 511.9C267 511.9 219 490.4 184.2 455.7C184 455.5 183.8 455.3 183.6 455.1L176 447.9L223.9 447.9C241.6 447.9 255.9 433.6 255.9 415.9C255.9 398.2 241.6 383.9 223.9 383.9L96 384C87.5 384 79.3 387.4 73.3 393.5C67.3 399.6 63.9 407.7 64 416.3L65 543.3C65.1 561 79.6 575.2 97.3 575C115 574.8 129.2 560.4 129 542.7L128.6 491.2L139.3 501.3C185.6 547.4 249.5 576 320 576C449 576 555.7 480.6 573.4 356.5z" />
                  </svg>
                  {(selectedCategory || selectedStatus || selectedPrice) && (
                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-white">!</span>
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleAddProduct}
                className="group relative bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3.5 rounded-xl flex items-center gap-3 transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 shadow-lg hover:shadow-xl font-semibold text-sm uppercase tracking-wide"
                title="Thêm sản phẩm mới"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-xl transition-opacity duration-300"></div>
                <span className="relative z-10">📦 Thêm sản phẩm</span>
              </button>

              <button
                onClick={handleExport}
                className="group relative bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-3.5 rounded-xl flex items-center gap-3 transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 shadow-lg hover:shadow-xl font-semibold text-sm uppercase tracking-wide"
                title="Xuất dữ liệu Excel"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-xl transition-opacity duration-300"></div>
                <span className="relative z-10">📊 Xuất Excel</span>
              </button>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b">
            <h3 className="text-lg font-semibold text-gray-800">
              Danh sách sản phẩm
            </h3>
          </div>
          <table className="min-w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Ảnh
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Tên sản phẩm
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Giá
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Số lượng
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Danh mục
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product, index) => (
                <tr
                  key={product.id}
                  className={`transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:shadow-md transform hover:-translate-y-0.5 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <svg
                          className="w-8 h-8 text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 3a2 2 0 00-2 2v1.007a1 1 0 00.293.707L3 7.414V15a2 2 0 002 2h10a2 2 0 002-2V7.414l.707-.707A1 1 0 0018 6.007V5a2 2 0 00-2-2H4zm2 4a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm0 3a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {product.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {product.price}₫
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {product.quantity}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {product.category}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        product.status
                      )}`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditProduct(product.id)}
                        className="group relative p-2 text-blue-600 hover:text-white bg-blue-50 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 rounded-lg transition-all duration-300 transform hover:scale-110 hover:-translate-y-0.5 shadow-sm hover:shadow-lg"
                        title="Chỉnh sửa sản phẩm"
                      >
                        <svg
                          className="w-5 h-5 transition-transform group-hover:rotate-12 duration-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                          ✏️ Chỉnh sửa
                        </div>
                      </button>

                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="group relative p-2 text-red-600 hover:text-white bg-red-50 hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 rounded-lg transition-all duration-300 transform hover:scale-110 hover:-translate-y-0.5 shadow-sm hover:shadow-lg"
                        title="Xóa sản phẩm"
                      >
                        <svg
                          className="w-5 h-5 transition-transform group-hover:rotate-12 duration-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                          🗑️ Xóa
                        </div>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white rounded-xl shadow-lg border p-6 mt-8">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 font-medium">
              Hiển thị{" "}
              <span className="font-bold text-orange-600">
                1-{products.length}
              </span>{" "}
              của <span className="font-bold">{products.length}</span> sản phẩm
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                className="group p-3 text-gray-600 hover:text-white bg-gray-100 hover:bg-gradient-to-r hover:from-orange-500 hover:to-orange-600 rounded-xl disabled:text-gray-300 disabled:cursor-not-allowed disabled:bg-gray-50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 shadow-sm hover:shadow-md"
                disabled={currentPage === 1}
                title="Trang trước"
              >
                <svg
                  className="w-5 h-5 transition-transform group-hover:-translate-x-0.5 duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-11 h-11 rounded-xl font-bold text-sm transition-all duration-300 transform hover:scale-110 ${
                      currentPage === page
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg scale-105 ring-2 ring-orange-200"
                        : "text-gray-600 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 hover:text-gray-800 shadow-sm hover:shadow-md"
                    }`}
                    title={`Trang ${page}`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                className="group p-3 text-gray-600 hover:text-white bg-gray-100 hover:bg-gradient-to-r hover:from-orange-500 hover:to-orange-600 rounded-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 shadow-sm hover:shadow-md"
                title="Trang sau"
              >
                <svg
                  className="w-5 h-5 transition-transform group-hover:translate-x-0.5 duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Product Modal - Add/Edit */}
        <ProductModal
          isOpen={showProductModal}
          onClose={handleCloseProductModal}
          mode={modalMode}
          product={currentProduct}
          onProductChange={setCurrentProduct}
          onSave={handleSaveProduct}
          categories={categories}
        />

        {/* Delete Modal - Simplified */}
        <DeleteModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setProductToDelete(null);
          }}
          onConfirm={confirmDeleteProduct}
          item={productToDelete}
          itemType="sản phẩm"
          title="Xác nhận xóa sản phẩm"
          subtitle="Hành động này không thể hoàn tác"
        />
      </div>
    </SellerLayout>
  );
};

export default ManageProduct;
