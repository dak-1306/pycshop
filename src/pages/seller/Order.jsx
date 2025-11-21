import React, { useEffect } from "react";
import SellerLayout from "../../components/layout/seller/SellerLayout";
import { OrderManagement } from "../../components/common/order";
import OrderModal from "../../components/common/modals/OrderModal";
import DeleteModal from "../../components/common/modals/DeleteModal";
import OrderDetailModal from "../../components/common/order/OrderDetailModal";
import SellerOrderEditModal from "../../components/seller/order/SellerOrderEditModal";
import { useSellerOrders } from "../../hooks/seller/useSellerOrders";
import { useOrderWebSocket } from "../../hooks/common/useWebSocket";

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
  const {
    // State
    orders,
    loading,
    error,

    // Pagination
    currentPage,
    totalPages,
    totalOrders,

    // Filters
    statusFilter,
    searchTerm,
    setSearchTerm,

    // Modals
    selectedOrder,
    showEditModal,
    showDetailModal,

    // Actions
    loadOrders,
    updateOrderStatus,
    handleStatusFilter,
    handlePageChange,
    handleViewOrder,
    handleEditOrder,
    handleSaveOrder,
    handleCloseEditModal,
    handleCloseDetailModal,

    // Utils
    getStatusInfo,
  } = useSellerOrders();

  // Setup WebSocket for real-time updates
  const { joinOrderRoom, leaveOrderRoom } = useOrderWebSocket({
    onNewOrder: (data) => {
      console.log("[SELLER_ORDERS] New order received:", data);
      // Reload orders to show the new order
      loadOrders();
    },
    onOrderUpdated: (data) => {
      console.log("[SELLER_ORDERS] Order updated:", data);
      // Reload orders to show updated status
      loadOrders();
    },
    onOrderCancelled: (data) => {
      console.log("[SELLER_ORDERS] Order cancelled:", data);
      // Reload orders to reflect cancellation
      loadOrders();
    },
    onRefreshOrdersList: (data) => {
      console.log("[SELLER_ORDERS] Refresh orders list:", data);
      // Reload orders when requested
      loadOrders();
    },
  });

  // Join order rooms when viewing order details
  useEffect(() => {
    if (selectedOrder) {
      joinOrderRoom(selectedOrder.orderId || selectedOrder.ID_DonHang);
    }

    return () => {
      if (selectedOrder) {
        leaveOrderRoom(selectedOrder.orderId || selectedOrder.ID_DonHang);
      }
    };
  }, [selectedOrder, joinOrderRoom, leaveOrderRoom]);

  return (
    <SellerLayout title="Quản lý đơn hàng">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Quản lý đơn hàng
          </h1>
          <p className="text-gray-600">
            Xem và cập nhật trạng thái các đơn hàng có sản phẩm của shop
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-4 items-center">
          {/* Search */}
          <div className="flex-1 min-w-64">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên khách hàng, email, mã đơn hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            {[
              { value: "all", label: "Tất cả" },
              { value: "pending", label: "Chờ xác nhận" },
              { value: "confirmed", label: "Đã xác nhận" },
              { value: "shipped", label: "Đang giao" },
              { value: "delivered", label: "Đã giao" },
              { value: "cancelled", label: "Đã hủy" },
            ].map((status) => (
              <button
                key={status.value}
                onClick={() => handleStatusFilter(status.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  statusFilter === status.value
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            <p className="mt-2 text-gray-600">Đang tải đơn hàng...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <i className="fas fa-shopping-bag text-4xl text-gray-400 mb-4"></i>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không có đơn hàng
            </h3>
            <p className="text-gray-600">
              {statusFilter === "all"
                ? "Chưa có đơn hàng nào cho shop của bạn"
                : `Không có đơn hàng nào có trạng thái "${
                    getStatusInfo(statusFilter).label
                  }"`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.orderId}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                {/* Order Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Đơn hàng #{order.orderId}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Khách hàng: {order.buyerName} • {order.buyerEmail}
                    </p>
                    <p className="text-sm text-gray-600">
                      Ngày đặt:{" "}
                      {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      getStatusInfo(order.status).color
                    }`}
                  >
                    <i
                      className={`fas ${getStatusInfo(order.status).icon} mr-1`}
                    ></i>
                    {getStatusInfo(order.status).label}
                  </span>
                </div>

                {/* Order Items */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Sản phẩm của shop:
                  </h4>
                  <div className="space-y-2">
                    {order.items?.map((item) => (
                      <div
                        key={item.productId}
                        className="flex items-center gap-3 p-2 bg-gray-50 rounded"
                      >
                        {item.productImage && (
                          <img
                            src={
                              "../../../microservice/product_service" +
                              item.productImage
                            }
                            alt={item.productName}
                            className="w-12 h-12 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {item.productName}
                          </p>
                          <p className="text-sm text-gray-600">
                            Giá: {parseInt(item.price).toLocaleString("vi-VN")}₫
                            × {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div>
                    <p className="text-sm text-gray-700">
                      Doanh thu từ đơn hàng:{" "}
                      <span className="font-semibold text-orange-600">
                        {parseInt(order.sellerRevenue || 0).toLocaleString(
                          "vi-VN"
                        )}
                        ₫
                      </span>
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditOrder(order)}
                      className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      <i className="fas fa-edit mr-2"></i>
                      Cập nhật
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Trước
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 border rounded-lg ${
                      currentPage === page
                        ? "bg-orange-500 text-white border-orange-500"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Sau
              </button>
            </div>
          </div>
        )}

        {/* Modals */}
        <SellerOrderEditModal
          isOpen={showEditModal}
          onClose={handleCloseEditModal}
          order={selectedOrder}
          onSave={handleSaveOrder}
        />

        <OrderDetailModal
          isOpen={showDetailModal}
          onClose={handleCloseDetailModal}
          order={selectedOrder}
          onEdit={handleEditOrder}
          variant="seller"
        />
      </div>
    </SellerLayout>
  );
};

export default Order;
