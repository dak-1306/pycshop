import React from "react";
import SellerLayout from "../../components/layout/seller/SellerLayout";
import { OrderManagement } from "../../components/common/order";
import OrderModal from "../../components/common/modals/OrderModal";
import DeleteModal from "../../components/common/modals/DeleteModal";
import OrderDetailModal from "../../components/common/order/OrderDetailModal";
import { useOrders } from "../../hooks/seller/useOrders";

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
    currentOrder,
    setCurrentOrder,
    modalMode,
    showOrderModal,
    showDetailModal,
    showDeleteModal,
    orderToDelete,
    searchTerm,
    setSearchTerm,
    selectedFilter,
    setSelectedFilter,
    currentPage,
    setCurrentPage,

    // Actions
    handleViewOrder,
    handleAddOrder,
    handleEditOrder,
    handleSaveOrder,
    handleCancelOrder,
    confirmCancelOrder,
    handleCloseOrderModal,
    handleCloseDetailModal,
    handleCloseDeleteModal,
    handleFilterChange,
    handleResetFilters,
    handleExport,
    getStatusColor,

    // Constants
    orderStatuses,
    orderCategories,
  } = useOrders();

  return (
    <SellerLayout title="Order">
      <div className="p-6">
        {/* Unified Order Management Component */}
        <OrderManagement
          // Data
          orders={orders}
          // Actions
          onViewOrder={handleViewOrder}
          onEditOrder={handleEditOrder}
          onCancelOrder={handleCancelOrder}
          onExportOrders={handleExport}
          // Filters
          onSearchChange={setSearchTerm}
          onStatusFilter={handleFilterChange}
          // Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(orders.length / 10)}
          onPageChange={setCurrentPage}
          // Config
          variant="seller"
          isLoading={false}
          // Styling
          getStatusColor={getStatusColor}
        />

        {/* Modals */}
        <OrderModal
          isOpen={showOrderModal}
          onClose={handleCloseOrderModal}
          order={currentOrder}
          variant="seller"
          modalMode={modalMode}
          onSave={handleSaveOrder}
          onUpdateStatus={(orderId, status) =>
            console.log("Update status:", orderId, status)
          }
          onViewDetails={handleViewOrder}
        />

        <OrderDetailModal
          isOpen={showDetailModal}
          onClose={handleCloseDetailModal}
          order={currentOrder}
          onEdit={handleEditOrder}
          variant="seller"
        />

        <DeleteModal
          isOpen={showDeleteModal}
          onClose={handleCloseDeleteModal}
          onConfirm={confirmCancelOrder}
          item={orderToDelete}
          itemType="đơn hàng"
          title="Xác nhận hủy đơn hàng"
          subtitle="Đơn hàng sẽ chuyển sang trạng thái 'Đã hủy'"
        />
      </div>
    </SellerLayout>
  );
};

export default Order;
