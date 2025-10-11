import React from "react";
import ProductStats from "../../components/common/product/ProductStats";
import ProductFilters from "../../components/common/product/ProductFilters";
import ProductTable from "../../components/common/product/ProductTable";
import Pagination from "../../components/common/product/Pagination";
import ProductModal from "../../components/common/modals/ProductModal";
import ProductDetailModal from "../../components/common/product/ProductDetailModal";
import DeleteModal from "../../components/common/DeleteModal";
import { useAdminProducts } from "../../hooks/useAdminProducts";

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
    setShowDeleteModal,    selectedProduct,
    modalMode,
    handleViewProduct,
    handleEditProduct,
    handleDeleteProduct,
    handleAddProduct,    handleSaveProduct,
    confirmDeleteProduct,
    handleResetFilters,
  } = useAdminProducts();

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý sản phẩm</h1>
            <p className="text-gray-600">
              Quản lý tất cả sản phẩm trong hệ thống
              {(searchValue || categoryFilter || statusFilter) && (
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                  Hiển thị {totalItems} sản phẩm
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <ProductStats stats={stats} />

      {/* Products Table with Filters */}
      <div className="bg-white rounded-lg shadow">        <ProductFilters
          searchTerm={searchValue}
          selectedCategory={categoryFilter}
          selectedStatus={statusFilter}
          onSearchChange={setSearchValue}
          onCategoryChange={setCategoryFilter}
          onStatusChange={setStatusFilter}
          onResetFilters={handleResetFilters}
          showResetButton={searchValue || categoryFilter || statusFilter}
        />        <ProductTable
          variant="admin"
          products={products}
          onViewProduct={handleViewProduct}
          onEditProduct={handleEditProduct}
          onDeleteProduct={handleDeleteProduct}
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
        itemType="sản phẩm"
        title="Xác nhận xóa sản phẩm"
        subtitle="Hành động này không thể hoàn tác"
      />
    </div>
  );
};

export default AdminProducts;
