import React, { useState, useEffect } from "react";
import SellerLayout from "../../components/layout/SellerLayout";

const ManageProduct = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);

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
    console.log("Add new product");
  };

  const handleExport = () => {
    console.log("Export data");
  };

  const handleEditProduct = (productId) => {
    console.log("Edit product:", productId);
  };

  const handleDeleteProduct = (productId) => {
    console.log("Delete product:", productId);
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
            <div className="flex flex-wrap items-center gap-4">
              {/* Category Filter */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none bg-gray-50 border-2 border-gray-200 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all hover:border-gray-300 min-w-[140px]"
                >
                  <option value="">Danh mục ▼</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="appearance-none bg-gray-50 border-2 border-gray-200 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all hover:border-gray-300 min-w-[140px]"
                >
                  <option value="">Trạng thái ▼</option>
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Filter */}
              <div className="relative">
                <select
                  value={selectedPrice}
                  onChange={(e) => setSelectedPrice(e.target.value)}
                  className="appearance-none bg-gray-50 border-2 border-gray-200 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all hover:border-gray-300 min-w-[140px]"
                >
                  <option value="">Giá ▼</option>
                  {priceRanges.map((range) => (
                    <option key={range} value={range}>
                      {range}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reset Button */}
              <button
                onClick={handleResetFilters}
                className="bg-green-500 hover:bg-green-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-all transform hover:scale-105 shadow-md"
                title="Reset bộ lọc"
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
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0V9a8 8 0 1115.356 2M15 15v5h-.582M8.582 21A8.001 8.001 0 0019.418 15m0 0V15a8 8 0 00-15.356-2"
                  />
                </svg>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleAddProduct}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all transform hover:scale-105 shadow-md font-medium"
                title="Thêm sản phẩm mới"
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Thêm
              </button>
              <button
                onClick={handleExport}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all transform hover:scale-105 shadow-md font-medium"
                title="Xuất dữ liệu"
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
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Xuất
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
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
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
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditProduct(product.id)}
                        className="text-blue-600 hover:text-blue-900"
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
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-900"
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white rounded-xl shadow-sm border p-4 mt-6">
          <div className="flex items-center justify-center space-x-3">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              className="p-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg disabled:text-gray-300 disabled:cursor-not-allowed transition-all"
              disabled={currentPage === 1}
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <div className="flex space-x-2">
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-lg font-medium transition-all ${
                    currentPage === page
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md transform scale-105"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              className="p-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all"
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </SellerLayout>
  );
};

export default ManageProduct;
