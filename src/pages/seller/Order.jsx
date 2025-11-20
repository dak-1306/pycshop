import React from "react";
import SellerLayout from "../../components/layout/seller/SellerLayout";
import { OrderManagement } from "../../components/common/order";
import OrderModal from "../../components/common/modals/OrderModal";
import DeleteModal from "../../components/common/modals/DeleteModal";
import OrderDetailModal from "../../components/common/order/OrderDetailModal";
import SellerOrderEditModal from "../../components/seller/order/SellerOrderEditModal";
import { useSellerOrders } from "../../hooks/seller/useSellerOrders";

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
    currentPage,
    totalPages,
    statusFilter,
    searchTerm,
    setSearchTerm,
    selectedOrder,
    showEditModal,
    showDetailModal,

    // Actions
    updateOrderStatus,
    handleStatusFilter,
    handlePageChange,
    handleViewOrder,
    handleEditOrder,
    handleSaveOrder,
    handleCloseEditModal,
    handleCloseDetailModal,
    getStatusInfo,
  } = useSellerOrders();

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
          onUpdateStatus={updateOrderStatus}
          // Filters
          onSearchChange={setSearchTerm}
          onStatusFilter={handleStatusFilter}
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          // Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          // Config
          variant="seller"
          isLoading={loading}
          error={error}
          // Styling
          getStatusColor={getStatusInfo}
        />

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
