import React from "react";

const AdminUserFilters = ({
  searchValue,
  onSearchChange,
  roleFilter,
  onRoleChange,
  statusFilter,
  onStatusChange,
  onAddUser,
}) => {
  return (
    <div className="p-6 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Tìm kiếm người dùng..."
            value={searchValue || ""}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <select
            value={roleFilter || ""}
            onChange={(e) => onRoleChange && onRoleChange(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tất cả vai trò</option>
            <option value="customer">Khách hàng</option>
            <option value="seller">Người bán</option>
            <option value="admin">Admin</option>
          </select>

          <select
            value={statusFilter || ""}
            onChange={(e) => onStatusChange && onStatusChange(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
            <option value="banned">Bị cấm</option>
            <option value="pending">Chờ xác thực</option>
          </select>
        </div>

        <button
          onClick={onAddUser}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Thêm người dùng
        </button>
      </div>
    </div>
  );
};

export default AdminUserFilters;
