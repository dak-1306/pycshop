import React from "react";

const AdminProductFilters = ({
  searchValue,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  statusFilter,
  onStatusChange,
  onAddProduct,
}) => {
  return (
    <div className="p-6 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchValue || ""}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <select
            value={categoryFilter || ""}
            onChange={(e) =>
              onCategoryChange && onCategoryChange(e.target.value)
            }
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tất cả danh mục</option>
            <option value="electronics">Điện tử</option>
            <option value="fashion">Thời trang</option>
            <option value="home">Gia dụng</option>
            <option value="books">Sách</option>
            <option value="sports">Thể thao</option>
            <option value="beauty">Làm đẹp</option>
          </select>

          <select
            value={statusFilter || ""}
            onChange={(e) => onStatusChange && onStatusChange(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
            <option value="out_of_stock">Hết hàng</option>
            <option value="pending">Chờ duyệt</option>
          </select>
        </div>

        <button
          onClick={onAddProduct}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Thêm sản phẩm
        </button>
      </div>
    </div>
  );
};

export default AdminProductFilters;
