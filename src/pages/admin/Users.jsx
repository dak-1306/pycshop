import React from "react";
import UserStats from "../../components/admin/user/UserStats";
import AdminUserFilters from "../../components/admin/user/AdminUserFilters";
import AdminUserTable from "../../components/admin/user/AdminUserTable";
import { useAdminUsers } from "../../hooks/useAdminUsers";

const AdminUsers = () => {
  const {
    users,
    stats,
    isLoading,
    searchValue,
    setSearchValue,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    handleViewUser,
    handleEditUser,
    handleDeleteUser,
    handleAddUser,
  } = useAdminUsers();

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
        <h1 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h1>
        <p className="text-gray-600">
          Quản lý tất cả người dùng trong hệ thống
        </p>
      </div>

      {/* Stats Cards */}
      <UserStats stats={stats} />

      {/* Users Table with Filters */}
      <div className="bg-white rounded-lg shadow">
        <AdminUserFilters
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          roleFilter={roleFilter}
          onRoleChange={setRoleFilter}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          onAddUser={handleAddUser}
        />

        <AdminUserTable
          users={users}
          onViewUser={handleViewUser}
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
        />
      </div>
    </div>
  );
};

export default AdminUsers;
