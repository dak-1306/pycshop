import React from "react";
import SellerLayout from "../../components/layout/seller/SellerLayout";
import ProductModal from "../../components/common/modals/ProductModal";
import DeleteModal from "../../components/common/modals/DeleteModal";
import {
  ProductManagement,
  ProductDetailModal,
} from "../../components/common/product";
import ErrorDisplay from "../../components/common/feedback/ErrorDisplay";
import EmptyState from "../../components/common/feedback/EmptyState";
import { useProducts } from "../../hooks/seller/useProducts";
import { useCategories } from "../../hooks/api/useCategories";
import { useAuth } from "../../context/AuthContext";

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
  // Check auth status
  const { user, isAuthenticated } = useAuth();
  console.log("[ManageProduct] Auth status:", { user, isAuthenticated });
  console.log(
    "[ManageProduct] Token in localStorage:",
    localStorage.getItem("token")?.substring(0, 20)
  );

  // Get categories from API
  const {
    categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategories(false); // Sử dụng seller API

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
    totalItems,
    totalPages,
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

  // Debug logging - Add useEffect to track products changes
  React.useEffect(() => {
    console.log("[ManageProduct] Products state changed:", {
      productsLength: products?.length || 0,
      isLoading,
      error,
      products: products?.slice(0, 3), // Log first 3 products as sample
    });
  }, [products, isLoading, error]);

  console.log(
    "[ManageProduct] Current render - Products loaded:",
    products?.length || 0,
    "isLoading:",
    isLoading,
    "error:",
    error
  );
  console.log("[ManageProduct] Is loading:", isLoading);
  console.log("[ManageProduct] Error:", error);

  // Prepare categories for ProductModal (expects string array format)
  const categoryNames = categories.map((cat) => cat.name);

  // Add "Tất cả" option for filters
  const filterCategories = ["Tất cả", ...categoryNames];

  // Handle errors with fallback UI
  if (error) {
    return (
      <SellerLayout title="Manage Product">
        <div className="p-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <ErrorDisplay
              error={error}
              onRetry={loadProducts}
              title="Không thể tải danh sách sản phẩm"
            />
          </div>
        </div>
      </SellerLayout>
    );
  }

  // Empty state when no products
  if (products.length === 0 && !isLoading) {
    return (
      <SellerLayout title="Manage Product">
        <div className="p-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <EmptyState
              title="Chưa có sản phẩm"
              description="Bạn chưa có sản phẩm nào. Hãy thêm sản phẩm đầu tiên để bắt đầu bán hàng!"
              actionText="Thêm sản phẩm"
              onAction={handleAddProduct}
            />
          </div>
        </div>
      </SellerLayout>
    );
  }

  return (
    <SellerLayout title="Manage Product">
      <div className="p-6">
        {/* Unified Product Management */}
        <ProductManagement
          // Data
          products={products}
          stats={null} // Can add product stats later
          // Actions
          onAddProduct={handleAddProduct}
          onViewProduct={handleViewProduct}
          onEditProduct={handleEditProduct}
          onDeleteProduct={handleDeleteProduct}
          onExportProducts={handleExport}
          // Filters
          onSearchChange={setSearchTerm}
          onCategoryFilter={setSelectedCategory}
          onStatusFilter={setSelectedStatus}
          onPriceFilter={setSelectedPrice}
          // Pagination
          currentPage={currentPage}
          totalPages={totalPages || Math.ceil(totalItems / 10)}
          onPageChange={setCurrentPage}
          // Config
          variant="seller"
          isLoading={isLoading}
          // Styling
          getStatusColor={getStatusColor}
        />

        {/* Modals */}
        <ProductModal
          isOpen={showProductModal}
          onClose={handleCloseProductModal}
          mode={modalMode}
          product={currentProduct}
          onProductChange={setCurrentProduct}
          onSave={handleSaveProduct}
          categories={categoryNames} // Use categories from API
          variant="seller"
          onImageUpload={handleImageUpload}
          onRemoveImage={handleRemoveImage}
          onSetFeaturedImage={handleSetFeaturedImage}
        />

        <ProductDetailModal
          isOpen={showDetailModal}
          onClose={handleCloseDetailModal}
          product={currentProduct}
          variant="seller"
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
