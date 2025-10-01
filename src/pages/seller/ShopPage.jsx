import React, { useState, useEffect } from "react";
import SellerLayout from "../../components/layout/SellerLayout";
import { productService } from "../../services/productService";

const ShopPage = () => {
  // Shop Info State
  const [shopInfo, setShopInfo] = useState({
    name: "My Awesome Shop",
    description: "Chuyên cung cấp các sản phẩm chất lượng cao",
    avatar: null,
    isEditing: false,
  });

  // Product States
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [sortBy, setSortBy] = useState("name");

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 12;

  // Modal States
  const [showProductModal, setShowProductModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showShopEditModal, setShowShopEditModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // 'add' or 'edit'
  const [currentProduct, setCurrentProduct] = useState({
    name: "",
    price: "",
    quantity: "",
    category: "",
    description: "",
    status: "Còn hàng",
    image: null,
  });
  const [productToDelete, setProductToDelete] = useState(null);

  // Categories
  const categories = [
    "Thời trang",
    "Điện tử",
    "Gia dụng",
    "Sách",
    "Thể thao",
    "Làm đẹp",
  ];

  // Load products from API
  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters = {
        search: searchTerm,
        category: selectedCategory,
        status: selectedStatus,
        sort: sortBy,
        page: currentPage,
        limit: itemsPerPage,
      };

      const response = await productService.getAllProducts(filters);

      if (response && response.data) {
        setProducts(response.data.products || response.data || []);
        setTotalPages(
          Math.ceil(
            (response.data.total || response.data.length || 0) / itemsPerPage
          )
        );
      } else {
        // Fallback with mock data if API fails
        const mockProducts = [
          {
            id: 1,
            name: "iPhone 15 Pro Max",
            price: 32000000,
            quantity: 15,
            category: "Điện tử",
            description: "Điện thoại thông minh cao cấp với chip A17 Pro",
            status: "Còn hàng",
            image: null,
          },
          {
            id: 2,
            name: "Áo thun nam cotton",
            price: 199000,
            quantity: 0,
            category: "Thời trang",
            description: "Áo thun nam 100% cotton, thoáng mát",
            status: "Hết hàng",
            image: null,
          },
          {
            id: 3,
            name: "Máy pha cà phê",
            price: 2500000,
            quantity: 8,
            category: "Gia dụng",
            description: "Máy pha cà phê tự động cao cấp",
            status: "Còn hàng",
            image: null,
          },
          {
            id: 4,
            name: "Giày sneaker Nike",
            price: 2800000,
            quantity: 12,
            category: "Thời trang",
            description: "Giày sneaker Nike Air Force 1",
            status: "Còn hàng",
            image: null,
          },
          {
            id: 5,
            name: "Laptop Dell XPS 13",
            price: 25000000,
            quantity: 5,
            category: "Điện tử",
            description: "Laptop Dell XPS 13 với màn hình 4K",
            status: "Còn hàng",
            image: null,
          },
          {
            id: 6,
            name: "Kem dưỡng da",
            price: 450000,
            quantity: 0,
            category: "Làm đẹp",
            description: "Kem dưỡng da chống lão hóa",
            status: "Hết hàng",
            image: null,
          },
        ];
        setProducts(mockProducts);
        setTotalPages(Math.ceil(mockProducts.length / itemsPerPage));
      }
    } catch (error) {
      console.error("Error loading products:", error);
      setError("Không thể tải danh sách sản phẩm");
      // Set mock data as fallback
      const mockProducts = [
        {
          id: 1,
          name: "iPhone 15 Pro Max",
          price: 32000000,
          quantity: 15,
          category: "Điện tử",
          description: "Điện thoại thông minh cao cấp với chip A17 Pro",
          status: "Còn hàng",
          image: null,
        },
        {
          id: 2,
          name: "Áo thun nam cotton",
          price: 199000,
          quantity: 0,
          category: "Thời trang",
          description: "Áo thun nam 100% cotton, thoáng mát",
          status: "Hết hàng",
          image: null,
        },
      ];
      setProducts(mockProducts);
    } finally {
      setLoading(false);
    }
  };

  // Load products when filters change
  useEffect(() => {
    loadProducts();
  }, [searchTerm, selectedCategory, selectedStatus, sortBy, currentPage]);

  // Filter and sort products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory || product.category === selectedCategory;
    const matchesStatus = !selectedStatus || product.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

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

  const formatPrice = (price) => {
    return typeof price === "number"
      ? price.toLocaleString("vi-VN") + " VNĐ"
      : price;
  };

  // Product CRUD operations
  const handleAddProduct = () => {
    setCurrentProduct({
      name: "",
      price: "",
      quantity: "",
      category: "",
      description: "",
      status: "Còn hàng",
      image: null,
    });
    setModalMode("add");
    setShowProductModal(true);
  };

  const handleEditProduct = (product) => {
    setCurrentProduct({ ...product });
    setModalMode("edit");
    setShowProductModal(true);
  };

  const handleDeleteProduct = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleSaveProduct = async () => {
    try {
      setLoading(true);

      if (modalMode === "add") {
        await productService.createProduct(currentProduct);
      } else {
        await productService.updateProduct(currentProduct.id, currentProduct);
      }

      setShowProductModal(false);
      await loadProducts();
      alert(
        `${modalMode === "add" ? "Thêm" : "Cập nhật"} sản phẩm thành công!`
      );
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Có lỗi xảy ra khi lưu sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteProduct = async () => {
    try {
      setLoading(true);
      await productService.deleteProduct(productToDelete.id);
      setShowDeleteModal(false);
      setProductToDelete(null);
      await loadProducts();
      alert("Xóa sản phẩm thành công!");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Có lỗi xảy ra khi xóa sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  // Shop info management
  const handleEditShopInfo = () => {
    setShowShopEditModal(true);
  };

  const handleSaveShopInfo = () => {
    setShowShopEditModal(false);
    alert("Cập nhật thông tin shop thành công!");
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedStatus("");
    setSortBy("name");
    setCurrentPage(1);
  };

  return (
    <SellerLayout title="Shop Page">
      <div className="min-h-screen bg-gray-100">
        {/* Shop Header Section */}
        <div className="relative bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 px-6 py-12 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full blur-xl"></div>
            <div className="absolute top-20 right-20 w-32 h-32 bg-white rounded-full blur-2xl"></div>
            <div className="absolute bottom-10 left-1/3 w-24 h-24 bg-white rounded-full blur-xl"></div>
          </div>

          {/* Content Container */}
          <div className="relative z-10 max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-12">
              {/* Shop Info */}
              <div className="text-center flex-1 relative">
                <button
                  onClick={handleEditShopInfo}
                  className="absolute top-0 right-0 p-2 text-gray-600 hover:text-orange-600 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                  title="Chỉnh sửa thông tin shop"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>

                <div className="mb-6">
                  <h1 className="text-4xl font-bold text-gray-800 mb-3 leading-tight">
                    {shopInfo.name}
                  </h1>
                  <div className="w-24 h-1 bg-orange-500 mx-auto rounded-full mb-4"></div>
                  <p className="text-gray-700 text-lg font-medium">
                    {shopInfo.description}
                  </p>
                </div>

                {/* Shop Stats */}
                <div className="flex justify-center space-x-8 mt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">
                      {products.length}
                    </div>
                    <div className="text-sm text-gray-600">Sản phẩm</div>
                  </div>
                  <div className="w-px h-12 bg-gray-400"></div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">4.8</div>
                    <div className="text-sm text-gray-600">Đánh giá</div>
                  </div>
                  <div className="w-px h-12 bg-gray-400"></div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">
                      {products.filter((p) => p.status === "Còn hàng").length}
                    </div>
                    <div className="text-sm text-gray-600">Còn hàng</div>
                  </div>
                </div>
              </div>

              {/* Shop Avatar */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl border-4 border-white hover:scale-105 transition-transform duration-300">
                    {shopInfo.avatar ? (
                      <img
                        src={shopInfo.avatar}
                        alt="Shop Avatar"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <svg
                          className="w-16 h-16 text-orange-500 mx-auto mb-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 3a2 2 0 00-2 2v1.007a1 1 0 00.293.707L3 7.414V15a2 2 0 002 2h10a2 2 0 002-2V7.414l.707-.707A1 1 0 0018 6.007V5a2 2 0 00-2-2H4zm2 4a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm0 3a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <div className="text-xs text-gray-500 font-medium">
                          SHOP
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Status Badge */}
                  <div className="absolute -bottom-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-lg">
                    Online
                  </div>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex justify-center mt-8 space-x-4">
              <button className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-2 rounded-full font-medium shadow-md transition-colors flex items-center space-x-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <span>Nhắn tin</span>
              </button>
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full font-medium shadow-md transition-colors flex items-center space-x-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <span>Theo dõi</span>
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4 flex justify-end space-x-3">
          <button
            onClick={handleAddProduct}
            className="w-12 h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center justify-center shadow-md transition-colors"
            title="Thêm sản phẩm mới"
          >
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
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
          <button
            className="w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center justify-center shadow-md transition-colors"
            title="Xuất dữ liệu"
          >
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
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </button>
        </div>

        {/* Shop Profile Content */}
        <div className="px-6 py-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Shop Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shop Details Card */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Thông tin shop</h2>
                  <button
                    onClick={handleEditShopInfo}
                    className="px-4 py-2 text-sm text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors"
                  >
                    Chỉnh sửa
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v1.007a1 1 0 00.293.707L3 7.414V15a2 2 0 002 2h10a2 2 0 002-2V7.414l.707-.707A1 1 0 0018 6.007V5a2 2 0 00-2-2H4zm2 4a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm0 3a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{shopInfo.name}</h3>
                      <p className="text-gray-600">{shopInfo.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Ngày tham gia</label>
                      <p className="text-gray-900">15 Tháng 3, 2024</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Địa chỉ</label>
                      <p className="text-gray-900">TP. Hồ Chí Minh, Việt Nam</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email liên hệ</label>
                      <p className="text-gray-900">contact@myawesomeshop.com</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Số điện thoại</label>
                      <p className="text-gray-900">+84 123 456 789</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Featured Products */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Sản phẩm nổi bật</h2>
                  <a
                    href="/seller/manage-product"
                    className="text-sm text-orange-600 hover:text-orange-700"
                  >
                    Xem tất cả →
                  </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {products.slice(0, 4).map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v1.007a1 1 0 00.293.707L3 7.414V15a2 2 0 002 2h10a2 2 0 002-2V7.414l.707-.707A1 1 0 0018 6.007V5a2 2 0 00-2-2H4zm2 4a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm0 3a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 line-clamp-1">{product.name}</h4>
                        <p className="text-sm text-red-600 font-medium">{formatPrice(product.price)}</p>
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(product.status)}`}>
                          {product.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {products.length === 0 && (
                  <div className="text-center py-8">
                    <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p className="text-gray-500">Chưa có sản phẩm nào</p>
                    <button
                      onClick={handleAddProduct}
                      className="mt-3 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
                    >
                      Thêm sản phẩm đầu tiên
                    </button>
                  </div>
                )}
              </div>

              {/* Shop Policies */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Chính sách shop</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Đổi trả miễn phí</h4>
                      <p className="text-sm text-gray-600">Đổi trả miễn phí trong vòng 7 ngày nếu sản phẩm lỗi</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Giao hàng nhanh</h4>
                      <p className="text-sm text-gray-600">Giao hàng trong vòng 2-3 ngày tại TP.HCM và Hà Nội</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Hỗ trợ 24/7</h4>
                      <p className="text-sm text-gray-600">Đội ngũ chăm sóc khách hàng sẵn sàng hỗ trợ mọi lúc</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Statistics & Quick Actions */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Thống kê nhanh</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v1.007a1 1 0 00.293.707L3 7.414V15a2 2 0 002 2h10a2 2 0 002-2V7.414l.707-.707A1 1 0 0018 6.007V5a2 2 0 00-2-2H4zm2 4a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm0 3a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-gray-700">Tổng sản phẩm</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">{products.length}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-gray-700">Còn hàng</span>
                    </div>
                    <span className="text-lg font-bold text-green-600">
                      {products.filter(p => p.status === "Còn hàng").length}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-gray-700">Hết hàng</span>
                    </div>
                    <span className="text-lg font-bold text-red-600">
                      {products.filter(p => p.status === "Hết hàng").length}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-gray-700">Đánh giá TB</span>
                    </div>
                    <span className="text-lg font-bold text-blue-600">4.8/5</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Hành động nhanh</h3>
                <div className="space-y-3">
                  <button
                    onClick={handleAddProduct}
                    className="w-full flex items-center justify-center space-x-3 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Thêm sản phẩm mới</span>
                  </button>

                  <button
                    onClick={handleEditShopInfo}
                    className="w-full flex items-center justify-center space-x-3 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>Chỉnh sửa shop</span>
                  </button>

                  <a
                    href="/seller/manage-product"
                    className="w-full flex items-center justify-center space-x-3 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <span>Quản lý sản phẩm</span>
                  </a>

                  <a
                    href="/seller/order"
                    className="w-full flex items-center justify-center space-x-3 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span>Quản lý đơn hàng</span>
                  </a>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Hoạt động gần đây</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-900">Có đơn hàng mới từ Nguyễn Văn A</p>
                      <p className="text-xs text-gray-500">5 phút trước</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-900">Cập nhật sản phẩm "iPhone 15 Pro Max"</p>
                      <p className="text-xs text-gray-500">2 giờ trước</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-900">Thêm sản phẩm mới "Áo thun nam cotton"</p>
                      <p className="text-xs text-gray-500">1 ngày trước</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Modal */}
      {showProductModal && (
        <ProductModal
          isOpen={showProductModal}
          onClose={() => setShowProductModal(false)}
          mode={modalMode}
          product={currentProduct}
          onProductChange={setCurrentProduct}
          onSave={handleSaveProduct}
          categories={categories}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setProductToDelete(null);
          }}
          onConfirm={confirmDeleteProduct}
          item={productToDelete}
          itemType="sản phẩm"
        />
      )}

      {/* Shop Edit Modal */}
      {showShopEditModal && (
        <ShopEditModal
          isOpen={showShopEditModal}
          onClose={() => setShowShopEditModal(false)}
          shopInfo={shopInfo}
          onShopInfoChange={setShopInfo}
          onSave={handleSaveShopInfo}
        />
      )}
    </SellerLayout>
  );
};

// Product Modal Component
const ProductModal = ({
  isOpen,
  onClose,
  mode,
  product,
  onProductChange,
  onSave,
  categories,
}) => {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === "add" ? "Thêm sản phẩm mới" : "Chỉnh sửa sản phẩm"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên sản phẩm *
              </label>
              <input
                type="text"
                required
                value={product.name}
                onChange={(e) =>
                  onProductChange({ ...product, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Nhập tên sản phẩm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Danh mục *
              </label>
              <select
                required
                value={product.category}
                onChange={(e) =>
                  onProductChange({ ...product, category: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Chọn danh mục</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giá (VNĐ) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={product.price}
                onChange={(e) =>
                  onProductChange({
                    ...product,
                    price: parseFloat(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số lượng *
              </label>
              <input
                type="number"
                required
                min="0"
                value={product.quantity}
                onChange={(e) =>
                  onProductChange({
                    ...product,
                    quantity: parseInt(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái
              </label>
              <select
                value={product.status}
                onChange={(e) =>
                  onProductChange({ ...product, status: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="Còn hàng">Còn hàng</option>
                <option value="Hết hàng">Hết hàng</option>
                <option value="Ngừng bán">Ngừng bán</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả sản phẩm
            </label>
            <textarea
              rows={4}
              value={product.description}
              onChange={(e) =>
                onProductChange({ ...product, description: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Nhập mô tả sản phẩm..."
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              {mode === "add" ? "Thêm sản phẩm" : "Cập nhật"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Delete Modal Component
const DeleteModal = ({ isOpen, onClose, onConfirm, item, itemType }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Xác nhận xóa {itemType}
          </h3>

          <p className="text-gray-600 mb-6">
            Bạn có chắc chắn muốn xóa {itemType} "{item?.name}"? Hành động này
            không thể hoàn tác.
          </p>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Xóa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Shop Edit Modal Component
const ShopEditModal = ({
  isOpen,
  onClose,
  shopInfo,
  onShopInfoChange,
  onSave,
}) => {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Chỉnh sửa thông tin shop
          </h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên shop *
              </label>
              <input
                type="text"
                required
                value={shopInfo.name}
                onChange={(e) =>
                  onShopInfoChange({ ...shopInfo, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Nhập tên shop"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả ngắn
              </label>
              <textarea
                rows={3}
                value={shopInfo.description}
                onChange={(e) =>
                  onShopInfoChange({ ...shopInfo, description: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Nhập mô tả về shop của bạn"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Cập nhật
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShopPage;