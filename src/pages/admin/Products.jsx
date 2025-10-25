import React from "react";
import {
  ProductManagement,
  ProductDetailModal,
} from "../../components/common/product";
import ProductModal from "../../components/common/modals/ProductModal";
import DeleteModal from "../../components/common/modals/DeleteModal";
import { useAdminProducts } from "../../hooks/admin/useAdminProducts";
import { ADMIN_CONSTANTS } from "../../lib/constants/adminConstants";

const AdminProducts = () => {
  const {
    products,
    stats,
    isLoading,
    searchValue,
    setSearchValue,
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter,
    currentPage,
    setCurrentPage,
    totalItems,
    totalPages,
    showProductModal,
    setShowProductModal,
    showDetailModal,
    setShowDetailModal,
    showDeleteModal,
    setShowDeleteModal,
    selectedProduct,
    modalMode,
    handleViewProduct,
    handleEditProduct,
    handleDeleteProduct,
    handleAddProduct,
    handleSaveProduct,
    confirmDeleteProduct,
    handleResetFilters,
    handleExport,
  } = useAdminProducts();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {ADMIN_CONSTANTS.PAGES.PRODUCTS.LOADING}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Unified Product Management */}
      <ProductManagement
        // Data
        products={products}
        stats={stats}
        // Actions
        onAddProduct={handleAddProduct}
        onViewProduct={handleViewProduct}
        onEditProduct={handleEditProduct}
        onDeleteProduct={handleDeleteProduct}
        onExportProducts={handleExport}
        // Filters
        onSearchChange={setSearchValue}
        onCategoryFilter={setCategoryFilter}
        onStatusFilter={setStatusFilter}
        onPriceFilter={() => {}} // Add price filter if needed
        // Pagination
        currentPage={currentPage}
        totalPages={totalPages || Math.ceil(totalItems / 10)}
        onPageChange={setCurrentPage}
        // Config
        variant="admin"
        isLoading={isLoading}
        // Styling
        getStatusColor={() => "bg-gray-100 text-gray-800"} // Add status color function
      />

      {/* Product Modal */}
      <ProductModal
        isOpen={showProductModal}
        onClose={() => setShowProductModal(false)}
        mode={modalMode}
        product={selectedProduct}
        onSave={handleSaveProduct}
        variant="admin"
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        product={selectedProduct}
        onEdit={() => {
          setShowDetailModal(false);
          handleEditProduct(selectedProduct?.id);
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteProduct}
        item={selectedProduct}
        itemType={ADMIN_CONSTANTS.ITEM_TYPES.PRODUCT}
        title={ADMIN_CONSTANTS.MODAL_TITLES.DELETE_PRODUCT}
        subtitle={ADMIN_CONSTANTS.MODAL_TITLES.DELETE_SUBTITLE}
      />
    </div>
  );
};

export default AdminProducts;
