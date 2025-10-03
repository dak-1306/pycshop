import React from "react";
import ProductStats from "../../components/product/ProductStats";
import AdminProductFilters from "../../components/product/AdminProductFilters";
import AdminProductTable from "../../components/product/AdminProductTable";
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
    handleViewProduct,
    handleApproveProduct,
    handleDeleteProduct,
    handleAddProduct,
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
        <h1 className="text-2xl font-bold text-gray-900">Quản lý sản phẩm</h1>
        <p className="text-gray-600">Quản lý tất cả sản phẩm trong hệ thống</p>
      </div>

      {/* Stats Cards */}
      <ProductStats stats={stats} />

      {/* Products Table with Filters */}
      <div className="bg-white rounded-lg shadow">
        <AdminProductFilters
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          onAddProduct={handleAddProduct}
        />
        <AdminProductTable
          products={products}
          onViewProduct={handleViewProduct}
          onApproveProduct={handleApproveProduct}
          onDeleteProduct={handleDeleteProduct}
        />
      </div>
    </div>
  );
};

export default AdminProducts;
