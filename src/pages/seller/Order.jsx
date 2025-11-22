import React, { useEffect } from "react";
import SellerLayout from "../../components/layout/seller/SellerLayout";
import { OrderManagement } from "../../components/common/order";
import { OrderDetailModal } from "../../components/common/modals";
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

    // Filters
    setSearchTerm,

    // Modals
    selectedOrder,
    showEditModal,
    showDetailModal,

    // Actions
    loadOrders,
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

  // Load orders on mount
  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

        {/* Sử dụng OrderManagement component */}
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">Đang tải đơn hàng...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <i className="fas fa-exclamation-triangle text-4xl text-red-400 mb-4"></i>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không thể tải đơn hàng
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Thử lại
            </button>
          </div>
        ) : (
          <OrderManagement
            // Data
            orders={orders}
            // Actions
            onViewOrder={handleViewOrder}
            onEditOrder={handleEditOrder}
            // Filters
            onSearchChange={setSearchTerm}
            onStatusFilter={handleStatusFilter}
            // Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            // Config
            variant="seller"
            isLoading={loading}
            // Styling
            getStatusColor={(status) => getStatusInfo(status).color}
          />
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
