import React from "react";
import { useAdminSellers } from "../../hooks/useAdminSellers";
import SellersStats from "../../components/admin/sellers/SellersStats";
import SellersFilters from "../../components/admin/sellers/SellersFilters";
import SellersTable from "../../components/admin/sellers/SellersTable";
import SellerDetailModal from "../../components/admin/sellers/SellerDetailModal";
import SellerActionModal from "../../components/admin/sellers/SellerActionModal";
import DeleteModal from "../../components/common/modals/DeleteModal";
import { useLanguage } from "../../context/LanguageContext";

const Sellers = () => {
  const { t } = useLanguage();
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
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t("loadingSellers")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              🏪 {t("sellerManagement")}
            </h1>
            <p className="text-gray-600">{t("manageAllSellers")}</p>
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
              {t("refresh")}
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
      />

      {/* Sellers Table */}
      <div className="bg-white rounded-lg shadow">
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
      </div>

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
