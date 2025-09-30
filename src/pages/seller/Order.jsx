import React, { useState, useEffect } from "react";
import SellerLayout from "../../components/layout/SellerLayout";

const Order = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("Tất cả");
  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState([]);

  // Mock data for demonstration
  useEffect(() => {
    setOrders([
      {
        id: 1,
        image: null,
        productName: "iPhone 15 Pro Max 256GB",
        price: "29,990,000",
        quantity: 1,
        category: "Điện thoại",
        status: "Đang giao",
        actions: ["view", "edit"],
      },
      {
        id: 2,
        image: null,
        productName: "Samsung Galaxy S24 Ultra",
        price: "26,990,000",
        quantity: 2,
        category: "Điện thoại",
        status: "Hoàn tất",
        actions: ["view", "edit"],
      },
      {
        id: 3,
        image: null,
        productName: "MacBook Air M3 15 inch",
        price: "34,990,000",
        quantity: 1,
        category: "Laptop",
        status: "Đang xử lý",
        actions: ["view", "edit"],
      },
      {
        id: 4,
        image: null,
        productName: "iPad Pro 12.9 inch M2",
        price: "24,990,000",
        quantity: 1,
        category: "Máy tính bảng",
        status: "Đã hủy",
        actions: ["view", "edit"],
      },
      {
        id: 5,
        image: null,
        productName: "AirPods Pro 2nd Gen",
        price: "6,990,000",
        quantity: 3,
        category: "Phụ kiện",
        status: "Hoàn tất",
        actions: ["view", "edit"],
      },
      {
        id: 6,
        image: null,
        productName: "Apple Watch Series 9",
        price: "9,990,000",
        quantity: 1,
        category: "Phụ kiện",
        status: "Đang giao",
        actions: ["view", "edit"],
      },
    ]);
  }, []);

  const filters = ["Tất cả", "Đang xử lý", "Đang giao", "Hoàn tất", "Đã hủy"];

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedFilter("Tất cả");
    setCurrentPage(1);
  };

  const handleAddOrder = () => {
    console.log("Add new order");
  };

  const handleExport = () => {
    console.log("Export orders");
  };

  const handleViewOrder = (orderId) => {
    console.log("View order:", orderId);
  };

  const handleEditOrder = (orderId) => {
    console.log("Edit order:", orderId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Hoàn tất":
        return "text-green-600 bg-green-100";
      case "Đang giao":
        return "text-blue-600 bg-blue-100";
      case "Đang xử lý":
        return "text-yellow-600 bg-yellow-100";
      case "Đã hủy":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  // Filter orders based on selected filter
  const filteredOrders =
    selectedFilter === "Tất cả"
      ? orders
      : orders.filter((order) => order.status === selectedFilter);

  return (
    <SellerLayout title="Order">
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-lg mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg transform rotate-1 opacity-20"></div>
            <div className="relative bg-white rounded-lg shadow-md">
              <input
                type="text"
                placeholder="Tìm kiếm đơn hàng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-6 pr-14 py-4 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400 text-lg"
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
            {/* Filter Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => handleFilterChange(filter)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedFilter === filter
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md transform scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900"
                  }`}
                >
                  {filter} ▼
                </button>
              ))}

              {/* Reset Button */}
              <button
                onClick={handleResetFilters}
                className="bg-green-500 hover:bg-green-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-all transform hover:scale-105 shadow-md ml-2"
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
                onClick={handleAddOrder}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all transform hover:scale-105 shadow-md font-medium"
                title="Thêm đơn hàng mới"
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

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b">
            <h3 className="text-lg font-semibold text-gray-800">
              Danh sách đơn hàng
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Hiển thị {filteredOrders.length} đơn hàng
            </p>
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
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      {order.image ? (
                        <img
                          src={order.image}
                          alt={order.productName}
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
                      {order.productName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      {order.price}₫
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {order.quantity}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {order.category}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewOrder(order.id)}
                        className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Xem chi tiết"
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
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleEditOrder(order.id)}
                        className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded-lg transition-colors"
                        title="Chỉnh sửa"
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
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md transform scale-105"
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

export default Order;
