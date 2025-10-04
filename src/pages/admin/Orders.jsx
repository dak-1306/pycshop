import React from "react";
import OrderStats from "../../components/order/OrderStats";
import AdminOrderFilters from "../../components/order/AdminOrderFilters";
import AdminOrderTable from "../../components/order/AdminOrderTable";
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
    handleViewOrder,
    handleUpdateOrder,
    handleCancelOrder,
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
        <AdminOrderFilters
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          paymentFilter={paymentFilter}
          onPaymentChange={setPaymentFilter}
          onExport={handleExport}
        />
        <AdminOrderTable
          orders={orders}
          onViewOrder={handleViewOrder}
          onUpdateOrder={handleUpdateOrder}
          onCancelOrder={handleCancelOrder}
        />
      </div>
    </div>
  );
};

export default AdminOrders;
