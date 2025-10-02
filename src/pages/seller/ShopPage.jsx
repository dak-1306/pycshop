import React from "react";
import SellerLayout from "../../components/layout/SellerLayout";
import ProductModal from "../../components/modals/ProductModal";
import ShopEditModal from "../../components/modals/ShopEditModal";
import ShopHeader from "../../components/shop/ShopHeader";
import ShopInfoCard from "../../components/shop/ShopInfoCard";
import QuickStatsCard from "../../components/shop/QuickStatsCard";
import FeaturedProducts from "../../components/shop/FeaturedProducts";
import DeleteModal from "../../components/modals/DeleteModal";
import { useShopPage } from "../../hooks/useShopPage";

const ShopPage = () => {
  const {
    // Shop Info
    shopInfo,
    handleEditShopInfo,
    handleSaveShopInfo,

    // Products
    products,
    loading,
    error,

    // Search and Filter
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedStatus,
    setSelectedStatus,
    sortBy,
    setSortBy,
    handleResetFilters,

    // Pagination
    currentPage,
    setCurrentPage,
    totalPages,

    // Modals
    showProductModal,
    setShowProductModal,
    showDeleteModal,
    setShowDeleteModal,
    showShopEditModal,
    setShowShopEditModal,
    modalMode,
    currentProduct,
    setCurrentProduct,
    productToDelete,

    // Product Operations
    handleAddProduct,
    handleEditProduct,
    handleDeleteProduct,
    handleSaveProduct,
    confirmDeleteProduct,

    // Utility
    categories,
    getStatusColor,
    formatPrice,
    filteredProducts,
    shopStats,
    recentActivities,
  } = useShopPage();

  return (
    <SellerLayout title="Shop Page">
      <div className="min-h-screen bg-gray-100">
        {/* Shop Header */}
        <ShopHeader
          shopInfo={shopInfo}
          products={products}
          onEditShopInfo={handleEditShopInfo}
        />

        {/* Shop Info & Stats Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-6 mt-6 relative z-10">
          {/* Shop Info Card */}
          <ShopInfoCard
            shopInfo={shopInfo}
            totalProducts={products.length}
            activeProducts={
              products.filter((p) => p.status === "Còn hàng").length
            }
            onEditShopInfo={handleEditShopInfo}
          />

          {/* Quick Stats */}
          <QuickStatsCard
            shopStats={shopStats}
            recentActivities={recentActivities}
          />
        </div>

        {/* Featured Products */}
        <FeaturedProducts
          products={filteredProducts}
          categories={categories}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          sortBy={sortBy}
          setSortBy={setSortBy}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          loading={loading}
          error={error}
          formatPrice={formatPrice}
          getStatusColor={getStatusColor}
          onAddProduct={handleAddProduct}
          onEditProduct={handleEditProduct}
          onDeleteProduct={handleDeleteProduct}
          onResetFilters={handleResetFilters}
        />

        {/* Product Modal */}
        <ProductModal
          isOpen={showProductModal}
          onClose={() => setShowProductModal(false)}
          mode={modalMode}
          product={currentProduct}
          onProductChange={setCurrentProduct}
          onSave={handleSaveProduct}
          categories={categories}
        />

        {/* Delete Modal */}
        <DeleteModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDeleteProduct}
          item={productToDelete}
          itemType="sản phẩm"
        />

        {/* Shop Edit Modal */}
        <ShopEditModal
          isOpen={showShopEditModal}
          onClose={() => setShowShopEditModal(false)}
          shopInfo={shopInfo}
          onSave={handleSaveShopInfo}
        />
      </div>
    </SellerLayout>
  );
};

export default ShopPage;
