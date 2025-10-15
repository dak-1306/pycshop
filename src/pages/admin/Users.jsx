import React, { useState } from "react";
import UserStats from "../../components/admin/user/UserStats";
import AdminUserFilters from "../../components/admin/user/AdminUserFilters";
import AdminUserTable from "../../components/admin/user/AdminUserTable";
import AddUserModal from "../../components/admin/user/AddUserModal_v2";
import ViewUserModal from "../../components/admin/user/ViewUserModal";
import EditUserModal from "../../components/admin/user/EditUserModal";
import ConfirmDeleteModal from "../../components/admin/user/ConfirmDeleteModal";
import SuccessNotification from "../../components/common/notifications/SuccessNotification";
import ErrorNotification from "../../components/common/notifications/ErrorNotification";
import { useAdminUsers } from "../../hooks/admin/useAdminUsers";
import { useLanguage } from "../../context/LanguageContext";

const AdminUsers = () => {
  const { t } = useLanguage();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    users,
    stats,
    isLoading,
    error,
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
    refetch,
  } = useAdminUsers();

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleCreateUser = async (userData) => {
    try {
      await handleAddUser(userData);
      setIsAddModalOpen(false);
      setSuccessMessage(
        `Người dùng "${userData.name}" đã được tạo thành công!`
      );
      setShowSuccessNotification(true);
    } catch (error) {
      let errorMsg = "Có lỗi xảy ra khi tạo người dùng";

      if (error.message.includes("Email already exists")) {
        errorMsg = "Email này đã được sử dụng bởi người dùng khác";
      } else if (error.message.includes("Failed to create user")) {
        errorMsg = "Không thể tạo người dùng. Vui lòng thử lại";
      }

      setErrorMessage(errorMsg);
      setShowErrorNotification(true);
      console.error("Error creating user:", error);
    }
  };

  const handleCloseSuccessNotification = () => {
    setShowSuccessNotification(false);
  };
  const handleCloseErrorNotification = () => {
    setShowErrorNotification(false);
  };

  const handleDeleteUserRequest = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);
    try {
      await handleDeleteUser(userToDelete);
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
      setSuccessMessage(
        `Người dùng "${userToDelete.name}" đã được xóa thành công!`
      );
      setShowSuccessNotification(true);
    } catch (error) {
      let errorMsg = "Có lỗi xảy ra khi xóa người dùng";

      if (error.message.includes("constraint")) {
        errorMsg = "Không thể xóa người dùng này vì có dữ liệu liên quan";
      }

      setErrorMessage(errorMsg);
      setShowErrorNotification(true);
    } finally {
      setIsDeleting(false);
    }
  };
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };

  // View user handlers
  const handleViewUserRequest = (user) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedUser(null);
  };

  // Edit user handlers
  const handleEditUserRequest = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
  };

  const handleUpdateUser = async (userData) => {
    try {
      await handleEditUser(userData);
      setIsEditModalOpen(false);
      setSelectedUser(null);
      setSuccessMessage(
        `Người dùng "${userData.name}" đã được cập nhật thành công!`
      );
      setShowSuccessNotification(true);
    } catch (error) {
      let errorMsg = "Có lỗi xảy ra khi cập nhật người dùng";

      if (error.message.includes("Email already exists")) {
        errorMsg = "Email này đã được sử dụng bởi người dùng khác";
      } else if (error.message.includes("Failed to update user")) {
        errorMsg = "Không thể cập nhật người dùng. Vui lòng thử lại";
      }

      setErrorMessage(errorMsg);
      setShowErrorNotification(true);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu người dùng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              👥 Quản lý người dùng
            </h1>
            <p className="text-gray-600">
              Quản lý tất cả người dùng trong hệ thống
            </p>
          </div>

          {/* Retry button when there's an error */}
          {error && (
            <button
              onClick={refetch}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Thử lại
            </button>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Lỗi khi tải dữ liệu người dùng
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                  <p className="mt-1 text-xs">
                    Hệ thống đang sử dụng dữ liệu mẫu để hiển thị.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
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
          onAddUser={handleOpenAddModal}
        />
        <AdminUserTable
          users={users}
          onViewUser={handleViewUserRequest}
          onEditUser={handleEditUserRequest}
          onDeleteUser={handleDeleteUserRequest}
        />
      </div>
      {/* Add User Modal */}
      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSubmit={handleCreateUser}
      />
      {/* View User Modal */}
      <ViewUserModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        user={selectedUser}
      />
      {/* Edit User Modal */}
      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSubmit={handleUpdateUser}
        user={selectedUser}
      />
      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        userName={userToDelete?.name || ""}
        isDeleting={isDeleting}
      />
      {/* Success Notification */}
      <SuccessNotification
        message={successMessage}
        isVisible={showSuccessNotification}
        onClose={handleCloseSuccessNotification}
      />
      {/* Error Notification */}
      <ErrorNotification
        message={errorMessage}
        isVisible={showErrorNotification}
        onClose={handleCloseErrorNotification}
      />
    </div>
  );
};

export default AdminUsers;
