import React from "react";
import SellerLayout from "../../components/layout/SellerLayout";
import OrderModal from "../../components/modals/OrderModal";
import DeleteModal from "../../components/modals/DeleteModal";
import OrderDetailModal from "../../components/modals/OrderDetailModal";
import OrderSearchBar from "../../components/order/OrderSearchBar";
import OrderFilters from "../../components/order/OrderFilters";
import OrderTable from "../../components/order/OrderTable";
import OrderPagination from "../../components/order/OrderPagination";
import { useOrders } from "../../hooks/useOrders";

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
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Search Bar */}
        <OrderSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        {/* Filters and Action Buttons */}
        <OrderFilters
          filters={orderStatuses}
          selectedFilter={selectedFilter}
          searchTerm={searchTerm}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          onAddOrder={handleAddOrder}
          onExport={handleExport}
        />

        {/* Orders Table */}
        <OrderTable
          orders={orders}
          onViewOrder={handleViewOrder}
          onEditOrder={handleEditOrder}
          onCancelOrder={handleCancelOrder}
          getStatusColor={getStatusColor}
        />

        {/* Pagination */}
        <OrderPagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalItems={orders.length}
          itemsPerPage={10}
        />

        {/* Modals */}
        <OrderModal
          isOpen={showOrderModal}
          onClose={handleCloseOrderModal}
          mode={modalMode}
          order={currentOrder}
          onOrderChange={setCurrentOrder}
          onSave={handleSaveOrder}
          categories={orderCategories}
          orderStatuses={orderStatuses.filter((f) => f !== "Tất cả")}
        />

        <OrderDetailModal
          isOpen={showDetailModal}
          onClose={handleCloseDetailModal}
          order={currentOrder}
          onEdit={handleEditOrder}
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
