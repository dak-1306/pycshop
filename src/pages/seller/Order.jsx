import React, { useState, useEffect } from "react";
import SellerLayout from "../../components/layout/SellerLayout";
import OrderModal from "../../components/modals/OrderModal";
import DeleteModal from "../../components/modals/DeleteModal";

// CSS animations (giữ nguyên)
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

const Order = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("Tất cả");
  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState([]);

  // Modal states - Simplified
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // 'add' or 'edit'
  const [currentOrder, setCurrentOrder] = useState({
    productName: "",
    price: "",
    quantity: "",
    category: "",
    status: "Đang xử lý",
    customerName: "",
    customerPhone: "",
    address: "",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  // Mock data (giữ nguyên)
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
        customerName: "Nguyễn Văn A",
        customerPhone: "0123456789",
        address: "123 Đường ABC, Quận 1, TP.HCM",
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
        customerName: "Trần Thị B",
        customerPhone: "0987654321",
        address: "456 Đường XYZ, Quận 2, TP.HCM",
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
        customerName: "Lê Văn C",
        customerPhone: "0369258147",
        address: "789 Đường DEF, Quận 3, TP.HCM",
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
        customerName: "Phạm Thị D",
        customerPhone: "0741852963",
        address: "321 Đường GHI, Quận 4, TP.HCM",
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
        customerName: "Hoàng Văn E",
        customerPhone: "0852741963",
        address: "654 Đường JKL, Quận 5, TP.HCM",
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
        customerName: "Vũ Thị F",
        customerPhone: "0963852741",
        address: "987 Đường MNO, Quận 6, TP.HCM",
        actions: ["view", "edit"],
      },
    ]);
  }, []);

  const filters = ["Tất cả", "Đang xử lý", "Đang giao", "Hoàn tất", "Đã hủy"];
  const categories = [
    "Tất cả",
    "Điện thoại",
    "Laptop",
    "Máy tính bảng",
    "Phụ kiện",
    "Khác",
  ];

  // Simplified handlers
  const handleAddOrder = () => {
    setModalMode("add");
    setCurrentOrder({
      productName: "",
      price: "",
      quantity: "",
      category: "",
      status: "Đang xử lý",
      customerName: "",
      customerPhone: "",
      address: "",
    });
    setShowOrderModal(true);
  };

  const handleEditOrder = (orderId) => {
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      setModalMode("edit");
      setCurrentOrder({
        ...order,
        price: order.price.replace(/,/g, ""), // Remove commas for editing
      });
      setShowOrderModal(true);
    }
  };

  const handleSaveOrder = () => {
    if (
      !currentOrder.productName ||
      !currentOrder.price ||
      !currentOrder.quantity ||
      !currentOrder.customerName ||
      !currentOrder.customerPhone
    ) {
      alert("😱 Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    if (modalMode === "add") {
      const newOrder = {
        id: orders.length + 1,
        productName: currentOrder.productName,
        price: Number(currentOrder.price).toLocaleString(),
        quantity: Number(currentOrder.quantity),
        category: currentOrder.category || "Khác",
        status: currentOrder.status,
        customerName: currentOrder.customerName,
        customerPhone: currentOrder.customerPhone,
        address: currentOrder.address,
        image: null,
        actions: ["view", "edit"],
      };
      setOrders([...orders, newOrder]);
      alert("🎉 Thêm đơn hàng thành công!");
    } else {
      const updatedOrders = orders.map((order) =>
        order.id === currentOrder.id
          ? {
              ...currentOrder,
              price: Number(currentOrder.price).toLocaleString(),
              quantity: Number(currentOrder.quantity),
            }
          : order
      );
      setOrders(updatedOrders);
      alert("🎉 Cập nhật đơn hàng thành công!");
    }

    setShowOrderModal(false);
    setCurrentOrder({
      productName: "",
      price: "",
      quantity: "",
      category: "",
      status: "Đang xử lý",
      customerName: "",
      customerPhone: "",
      address: "",
    });
  };

  const handleCloseOrderModal = () => {
    setShowOrderModal(false);
    setCurrentOrder({
      productName: "",
      price: "",
      quantity: "",
      category: "",
      status: "Đang xử lý",
      customerName: "",
      customerPhone: "",
      address: "",
    });
  };

  const handleDeleteOrder = (orderId) => {
    const order = orders.find((o) => o.id === orderId);
    setOrderToDelete(order);
    setShowDeleteModal(true);
  };

  const confirmDeleteOrder = () => {
    if (orderToDelete) {
      setOrders(orders.filter((order) => order.id !== orderToDelete.id));
      setShowDeleteModal(false);
      setOrderToDelete(null);
      alert("🗑️ Đã xóa đơn hàng thành công!");
    }
  };

  // Other handlers (giữ nguyên)
  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedFilter("Tất cả");
    setCurrentPage(1);
  };

  const handleExport = () => {
    // Export functionality (giữ nguyên)
    const headers = [
      "ID",
      "Tên sản phẩm",
      "Giá (đ)",
      "Số lượng",
      "Danh mục",
      "Trạng thái",
      "Khách hàng",
      "SĐT",
      "Địa chỉ",
    ];
    const csvContent = [
      headers.join(","),
      ...orders.map((order) =>
        [
          order.id,
          `"${order.productName}"`,
          `"${order.price}"`,
          order.quantity,
          `"${order.category}"`,
          `"${order.status}"`,
          `"${order.customerName || "N/A"}"`,
          `"${order.customerPhone || "N/A"}"`,
          `"${order.address || "N/A"}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `don-hang-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    alert("📊 Đã xuất dữ liệu thành công!");
  };

  const handleViewOrder = (orderId) => {
    console.log("View order:", orderId);
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

  // Filter orders
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
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl ml-2 group"
                title="Reset bộ lọc"
              >
                <svg
                  className="w-6 h-6 transition-transform group-hover:rotate-180 duration-300"
                  fill="currentColor"
                  viewBox="0 0 640 640"
                >
                  <path d="M129.9 292.5C143.2 199.5 223.3 128 320 128C373 128 421 149.5 455.8 184.2C456 184.4 456.2 184.6 456.4 184.8L464 192L416.1 192C398.4 192 384.1 206.3 384.1 224C384.1 241.7 398.4 256 416.1 256L544.1 256C561.8 256 576.1 241.7 576.1 224L576.1 96C576.1 78.3 561.8 64 544.1 64C526.4 64 512.1 78.3 512.1 96L512.1 149.4L500.8 138.7C454.5 92.6 390.5 64 320 64C191 64 84.3 159.4 66.6 283.5C64.1 301 76.2 317.2 93.7 319.7C111.2 322.2 127.4 310 129.9 292.6zM573.4 356.5C575.9 339 563.7 322.8 546.3 320.3C528.9 317.8 512.6 330 510.1 347.4C496.8 440.4 416.7 511.9 320 511.9C267 511.9 219 490.4 184.2 455.7C184 455.5 183.8 455.3 183.6 455.1L176 447.9L223.9 447.9C241.6 447.9 255.9 433.6 255.9 415.9C255.9 398.2 241.6 383.9 223.9 383.9L96 384C87.5 384 79.3 387.4 73.3 393.5C67.3 399.6 63.9 407.7 64 416.3L65 543.3C65.1 561 79.6 575.2 97.3 575C115 574.8 129.2 560.4 129 542.7L128.6 491.2L139.3 501.3C185.6 547.4 249.5 576 320 576C449 576 555.7 480.6 573.4 356.5z" />
                </svg>
                {(selectedFilter !== "Tất cả" || searchTerm) && (
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">!</span>
                  </div>
                )}
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleAddOrder}
                className="group relative bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3.5 rounded-xl flex items-center gap-3 transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 shadow-lg hover:shadow-xl font-semibold text-sm uppercase tracking-wide"
                title="Thêm đơn hàng mới"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-xl transition-opacity duration-300"></div>
                <span className="relative z-10">📋 Thêm đơn hàng</span>
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

        {/* Order Modal - Thêm/Sửa đơn hàng */}
        <OrderModal
          isOpen={showOrderModal}
          onClose={handleCloseOrderModal}
          mode={modalMode}
          order={currentOrder}
          onOrderChange={setCurrentOrder}
          onSave={handleSaveOrder}
          categories={categories}
          orderStatuses={filters.filter((f) => f !== "Tất cả")}
        />

        {/* Delete Modal */}
        <DeleteModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setOrderToDelete(null);
          }}
          onConfirm={confirmDeleteOrder}
          item={orderToDelete}
          itemType="đơn hàng"
          title="Xác nhận xóa đơn hàng"
          subtitle="Hành động này không thể hoàn tác"
        />
      </div>
    </SellerLayout>
  );
};

export default Order;
