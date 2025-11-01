import React from "react";
import { OrderManagement } from "../../components/common/order";
import OrderModal from "../../components/common/modals/OrderModal";
import OrderDetailModal from "../../components/common/order/OrderDetailModal";
import DeleteModal from "../../components/common/modals/DeleteModal";
import { useAdminOrders } from "../../hooks/admin/useAdminOrders";
import { ADMIN_CONSTANTS } from "../../lib/constants/adminConstants";

const AdminOrders = () => {
  const {
    orders,
    stats,
    isLoading,
    searchValue,
    setSearchValue,
    statusFilter,
    setStatusFilter,
    paymentFilter,
    setPaymentFilter,
    currentPage,
    setCurrentPage,
    totalItems,
    totalPages,
    showOrderModal,
    setShowOrderModal,
    showDetailModal,
    setShowDetailModal,
    showDeleteModal,
    setShowDeleteModal,
    selectedOrder,
    modalMode,
    orderForm,
    setOrderForm,
    handleAddOrder,
    handleEditOrder,
    handleViewOrder,
    handleDeleteOrder,
    handleSaveOrder,
    handleUpdateOrderStatus,
    confirmDeleteOrder,
    handleExport,
  } = useAdminOrders();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {ADMIN_CONSTANTS.PAGES.ORDERS.LOADING}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Unified Order Management Component */}
      <OrderManagement
        // Data
        orders={orders}
        stats={stats}
        // Actions
        onCreateOrder={handleAddOrder}
        onViewOrder={handleViewOrder}
        onEditOrder={handleEditOrder}
        onDeleteOrder={handleDeleteOrder}
        onExportOrders={handleExport}
        // Filters
        onSearchChange={setSearchValue}
        onStatusFilter={setStatusFilter}
        onPaymentFilter={setPaymentFilter}
        // Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        // Config
        variant="admin"
        isLoading={isLoading}
      />

      {/* Order Modal */}
      <OrderModal
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        order={selectedOrder}
        variant="admin"
        modalMode={modalMode}
        onSave={handleSaveOrder}
        onUpdateStatus={handleUpdateOrderStatus}
        onViewDetails={handleViewOrder}
      />

      {/* Order Detail Modal */}
      <OrderDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        order={selectedOrder}
        onEdit={() => {
          setShowDetailModal(false);
          handleEditOrder(selectedOrder?.id);
        }}
        variant="admin"
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteOrder}
        item={selectedOrder}
        itemType={ADMIN_CONSTANTS.ITEM_TYPES.ORDER}
        title={ADMIN_CONSTANTS.MODAL_TITLES.DELETE_ORDER}
        subtitle={ADMIN_CONSTANTS.MODAL_TITLES.DELETE_SUBTITLE}
      />
    </div>
  );
};

export default AdminOrders;
