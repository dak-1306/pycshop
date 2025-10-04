import React from "react";
import SellerLayout from "../../components/layout/SellerLayout";
import ProductModal from "../../components/modals/ProductModal";
import DeleteModal from "../../components/modals/DeleteModal";
import ProductDetailModal from "../../components/modals/ProductDetailModal";
import SearchBar from "../../components/product/SearchBar";
import ProductFilters from "../../components/product/ProductFilters";
import ProductTable from "../../components/product/ProductTable";
import Pagination from "../../components/product/Pagination";
import { useProducts } from "../../hooks/useProducts";
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

    // Image handling
    handleImageUpload,
    handleRemoveImage,
    handleSetFeaturedImage,
  } = useProducts();

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
        />

        {/* Products Table */}
        <ProductTable
          products={products}
          onViewProduct={handleViewProduct}
          onEditProduct={handleEditProduct}
          onDeleteProduct={handleDeleteProduct}
          getStatusColor={getStatusColor}
        />

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalItems={products.length}
          itemsPerPage={10}
        />

        {/* Modals */}
        <ProductModal
          isOpen={showProductModal}
          onClose={handleCloseProductModal}
          mode={modalMode}
          product={currentProduct}
          onProductChange={setCurrentProduct}
          onSave={handleSaveProduct}
          categories={PRODUCT_CATEGORIES}
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
