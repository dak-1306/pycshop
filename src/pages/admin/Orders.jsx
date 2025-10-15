import React from "react";
import OrderStats from "../../components/common/order/OrderStats";
import OrderFilters from "../../components/common/order/OrderFilters";
import OrderTable from "../../components/common/order/OrderTable";
import OrderModal from "../../components/common/modals/OrderModal";
import OrderDetailModal from "../../components/common/order/OrderDetailModal";
import DeleteModal from "../../components/common/modals/DeleteModal";
import Pagination from "../../components/common/product/Pagination";
import { useAdminOrders } from "../../hooks/useAdminOrders";
import { useLanguage } from "../../context/LanguageContext";

const AdminOrders = () => {
  const { t } = useLanguage();
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
          <p className="mt-4 text-gray-600">Đang tải dữ liệu đơn hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          📋 {t("orderManagement")}
        </h1>
        <p className="text-gray-600">{t("manageAllOrders")}</p>
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
          onUpdateStatus={() => {
            handleAddOrder();
          }}
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

      {/* Pagination */}
      {totalItems > 0 && (
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalItems={totalItems}
          itemsPerPage={10}
          variant="admin"
        />
      )}

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
        itemType="đơn hàng"
        title="Xác nhận xóa đơn hàng"
        subtitle="Hành động này không thể hoàn tác"
      />
    </div>
  );
};

export default AdminOrders;
