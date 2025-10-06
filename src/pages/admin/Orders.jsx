import React from "react";
import OrderStats from "../../components/common/order/OrderStats";
import OrderFilters from "../../components/common/order/OrderFilters";
import OrderTable from "../../components/common/order/OrderTable";
import OrderModal from "../../components/admin/orders/OrderModal";
import OrderDetailModal from "../../components/common/order/OrderDetailModal";
import DeleteModal from "../../components/common/DeleteModal";
import { useAdminOrders } from "../../hooks/useAdminOrders";

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h1>
        <p className="text-gray-600">Quản lý tất cả đơn hàng trong hệ thống</p>
      </div>

      {/* Stats Cards */}
      <OrderStats stats={stats} />

      {/* Orders Table with Filters */}
      <div className="bg-white rounded-lg shadow">
        <OrderFilters
          variant="admin"
          searchTerm={searchValue}
          onSearchChange={setSearchValue}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          paymentFilter={paymentFilter}
          onPaymentChange={setPaymentFilter}
          onExport={handleExport}
        />
        <OrderTable
          variant="admin"
          orders={orders}
          onViewOrder={handleViewOrder}
          onEditOrder={handleEditOrder}
          onDeleteOrder={handleDeleteOrder}
          onUpdateStatus={handleUpdateOrderStatus}
        />
      </div>

      {/* Order Modal */}
      <OrderModal
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        mode={modalMode}
        order={selectedOrder}
        orderForm={orderForm}
        onOrderFormChange={setOrderForm}
        onSave={handleSaveOrder}
      />

      {/* Order Detail Modal */}
      <OrderDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        order={selectedOrder}
        onEdit={() => {
          setShowDetailModal(false);
          handleEditOrder(selectedOrder);
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteOrder}
        title="Xóa đơn hàng"
        message={`Bạn có chắc chắn muốn xóa đơn hàng ${selectedOrder?.id} của khách hàng ${selectedOrder?.customer}? Hành động này không thể hoàn tác.`}
      />
    </div>
  );
};

export default AdminOrders;
