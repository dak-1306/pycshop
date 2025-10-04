import React from "react";
import { useAdminSellers } from "../../hooks/useAdminSellers";
import SellersStats from "../../components/seller/SellersStats";
import SellersFilters from "../../components/seller/SellersFilters";
import SellersTable from "../../components/seller/SellersTable";
import SellerDetailModal from "../../components/seller/SellerDetailModal";
import SellerActionModal from "../../components/seller/SellerActionModal";
import DeleteModal from "../../components/modals/DeleteModal";

const Sellers = () => {
  const {
    // State
    sellers,
    sellersStats,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    shopTypeFilter,
    setShopTypeFilter,

    isLoading,

    // Modals
    showDetailModal,
    showActionModal,
    showDeleteModal,
    selectedSeller,
    actionType, // 'block' | 'unblock' | 'verify'

    // Actions
    handleViewSeller,
    handleBlockSeller,
    handleUnblockSeller,
    handleVerifySeller,
    handleDeleteSeller,
    handleCloseModals,
    handleConfirmAction,
    handleConfirmDelete,
    handleResetFilters,
    handleExport,
    refreshData,

    // Utilities
    formatCurrency,
    formatDate,
  } = useAdminSellers();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu người bán...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              🏪 Quản lý Sellers
            </h1>
            <p className="text-gray-600">
              Quản lý và giám sát hoạt động của các người bán trên PycShop
            </p>
          </div>

          <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
            <button
              onClick={refreshData}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Làm mới
            </button>

            <button
              onClick={handleExport}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Xuất danh sách
            </button>
          </div>
        </div>
      </div>

      {/* Sellers Statistics */}
      <SellersStats stats={sellersStats} isLoading={isLoading} />

      {/* Filters */}
      <SellersFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        shopTypeFilter={shopTypeFilter}
        setShopTypeFilter={setShopTypeFilter}
        onReset={handleResetFilters}
        onExport={handleExport}
        onRefresh={refreshData}
        isLoading={isLoading}
      />

      {/* Sellers Table */}
      <SellersTable
        sellers={sellers}
        isLoading={isLoading}
        formatDate={formatDate}
        onViewSeller={handleViewSeller}
        onBlockSeller={handleBlockSeller}
        onUnblockSeller={handleUnblockSeller}
        onVerifySeller={handleVerifySeller}
        onDeleteSeller={handleDeleteSeller}
      />

      {/* Modals */}
      <SellerDetailModal
        isOpen={showDetailModal}
        seller={selectedSeller}
        onClose={handleCloseModals}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
      />

      <SellerActionModal
        isOpen={showActionModal}
        onClose={handleCloseModals}
        onConfirm={handleConfirmAction}
        seller={selectedSeller}
        actionType={actionType}
      />

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={handleCloseModals}
        onConfirm={handleConfirmDelete}
        item={selectedSeller}
        itemType="người bán"
        title="Xác nhận xóa người bán"
        subtitle="Hành động này sẽ xóa vĩnh viễn tài khoản seller và toàn bộ dữ liệu liên quan"
      />
    </div>
  );
};

export default Sellers;
