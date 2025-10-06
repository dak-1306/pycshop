import React from "react";
import SellerLayout from "../../components/layout/SellerLayout";
import ProductModal from "../../components/seller/product/ProductModal";
import DeleteModal from "../../components/common/DeleteModal";
import ProductDetailModal from "../../components/common/product/ProductDetailModal";
import SearchBar from "../../components/seller/product/SearchBar";
import ProductFilters from "../../components/common/product/ProductFilters";
import ProductTable from "../../components/common/product/ProductTable";
import Pagination from "../../components/common/product/Pagination";
import ErrorDisplay from "../../components/common/ErrorDisplay";
import EmptyState from "../../components/common/EmptyState";
import { useProducts } from "../../hooks/useProducts";
import { useCategories } from "../../hooks/useCategories";
import { PRODUCT_CATEGORIES } from "../../constants/productConstants";

// CSS animations
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

const ManageProduct = () => {
  // Get categories from API
  const {
    categories,
    isLoading: categoriesLoading,
    error: categoriesError,
    getCategoryOptions,
  } = useCategories();

  const {
    // State
    products,
    currentProduct,
    setCurrentProduct,
    modalMode,
    showProductModal,
    showDetailModal,
    showDeleteModal,
    productToDelete,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedStatus,
    setSelectedStatus,
    selectedPrice,
    setSelectedPrice,
    currentPage,
    setCurrentPage,
    isLoading,
    error,

    // Actions
    handleViewProduct,
    handleAddProduct,
    handleEditProduct,
    handleSaveProduct,
    handleDeleteProduct,
    confirmDeleteProduct,
    handleCloseProductModal,
    handleCloseDetailModal,
    handleCloseDeleteModal,
    handleResetFilters,
    handleExport,
    getStatusColor,
    loadProducts, // Add retry function

    // Image handling
    handleImageUpload,
    handleRemoveImage,
    handleSetFeaturedImage,
  } = useProducts();

  // Prepare categories for ProductModal (expects string array format)
  const categoryNames = categories.map((cat) => cat.name);

  // Add "Tất cả" option for filters
  const filterCategories = ["Tất cả", ...categoryNames];

  return (
    <SellerLayout title="Manage Product">
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Search Bar */}
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        {/* Filters and Action Buttons */}
        <ProductFilters
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          selectedPrice={selectedPrice}
          setSelectedPrice={setSelectedPrice}
          onResetFilters={handleResetFilters}
          onAddProduct={handleAddProduct}
          onExport={handleExport}
          categories={filterCategories} // Use categories from API with "Tất cả" option
        />

        {/* Products Table */}
        {error ? (
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <ErrorDisplay
              error={error}
              onRetry={loadProducts}
              title="Không thể tải danh sách sản phẩm"
            />
          </div>
        ) : products.length === 0 && !isLoading ? (
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <EmptyState
              title="Chưa có sản phẩm"
              description="Bạn chưa có sản phẩm nào. Hãy thêm sản phẩm đầu tiên để bắt đầu bán hàng!"
              actionText="Thêm sản phẩm"
              onAction={handleAddProduct}
            />
          </div>
        ) : (
          <ProductTable
            variant="seller"
            products={products}
            onViewProduct={handleViewProduct}
            onEditProduct={handleEditProduct}
            onDeleteProduct={handleDeleteProduct}
            getStatusColor={getStatusColor}
            isLoading={isLoading}
          />
        )}

        {/* Pagination - only show if there are products and no error */}
        {!error && products.length > 0 && (
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalItems={products.length}
            itemsPerPage={10}
          />
        )}

        {/* Modals */}
        <ProductModal
          isOpen={showProductModal}
          onClose={handleCloseProductModal}
          mode={modalMode}
          product={currentProduct}
          onProductChange={setCurrentProduct}
          onSave={handleSaveProduct}
          categories={categoryNames} // Use categories from API
          onImageUpload={handleImageUpload}
          onRemoveImage={handleRemoveImage}
          onSetFeaturedImage={handleSetFeaturedImage}
        />

        <ProductDetailModal
          isOpen={showDetailModal}
          onClose={handleCloseDetailModal}
          product={currentProduct}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
        />

        <DeleteModal
          isOpen={showDeleteModal}
          onClose={handleCloseDeleteModal}
          onConfirm={confirmDeleteProduct}
          item={productToDelete}
          itemType="sản phẩm"
          title="Xác nhận xóa sản phẩm"
          subtitle="Hành động này không thể hoàn tác"
        />
      </div>
    </SellerLayout>
  );
};

export default ManageProduct;
