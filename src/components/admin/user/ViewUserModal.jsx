import React, { useEffect } from "react";
import PropTypes from "prop-types";

const ViewUserModal = ({ isOpen, onClose, user }) => {
  // Handle ESC key
  useEffect(() => {
    if (isOpen) {
      const handleEsc = (e) => {
        if (e.key === "Escape") {
          onClose();
        }
      };

      document.addEventListener("keydown", handleEsc);
      return () => document.removeEventListener("keydown", handleEsc);
    }
  }, [isOpen, onClose]);

  if (!isOpen || !user) return null;

  const formatDate = (date) => {
    if (!date) return "Chưa có thông tin";
    try {
      return new Date(date).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Invalid Date";
    }
  };

  const getRoleText = (role) => {
    switch (role) {
      case "admin":
        return "Admin";
      case "seller":
        return "Người bán";
      case "customer":
        return "Khách hàng";
      default:
        return "Không xác định";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Hoạt động";
      case "inactive":
        return "Không hoạt động";
      case "banned":
        return "Bị cấm";
      case "pending":
        return "Chờ xác thực";
      default:
        return "Không xác định";
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "seller":
        return "bg-admin-100 text-admin-800 border-admin-200";
      case "customer":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-success text-white border-success";
      case "inactive":
        return "bg-red-100 text-red-800 border-red-200";
      case "banned":
        return "bg-red-200 text-red-900 border-red-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const InfoRow = ({ label, value, className = "" }) => (
    <div className="flex justify-between py-3 border-b border-gray-100 last:border-b-0">
      <span className="font-medium text-gray-600">{label}:</span>
      <span className={`text-gray-900 ${className}`}>
        {value || "Chưa có thông tin"}
      </span>
    </div>
  );

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-3 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Chi tiết người dùng
              </h2>
              <p className="text-xs text-gray-600 mt-1">
                Thông tin chi tiết về tài khoản người dùng
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 h-full">
            {/* Cột 1: Thông tin cá nhân */}
            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                <svg
                  className="w-4 h-4 mr-1 text-admin-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Thông tin cá nhân
              </h4>

              <div className="text-center mb-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-sm font-bold text-white">
                    {user.name?.charAt(0)?.toUpperCase() || "?"}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-gray-900">
                  {user.name}
                </h3>
                <div className="flex flex-col space-y-1 mt-2">
                  <span
                    className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full border ${getRoleColor(
                      user.role
                    )}`}
                  >
                    {getRoleText(user.role)}
                  </span>
                  <span
                    className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full border ${getStatusColor(
                      user.status
                    )}`}
                  >
                    {getStatusText(user.status)}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-xs font-medium text-gray-600">ID:</span>
                  <span className="text-xs text-gray-900">
                    {user.id || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs font-medium text-gray-600">
                    Email:
                  </span>
                  <span className="text-xs text-gray-900 truncate ml-2">
                    {user.email || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs font-medium text-gray-600">
                    SĐT:
                  </span>
                  <span className="text-xs text-gray-900">
                    {user.phone || "N/A"}
                  </span>
                </div>
                {user.address && (
                  <div className="mt-2">
                    <span className="text-xs font-medium text-gray-600">
                      Địa chỉ:
                    </span>
                    <p className="text-xs text-gray-700 bg-white p-2 rounded border mt-1 line-clamp-2">
                      {user.address}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Cột 2: Thông tin tài khoản */}
            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                <svg
                  className="w-4 h-4 mr-1 text-success"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                Thông tin tài khoản
              </h4>

              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-xs font-medium text-gray-600">
                    Vai trò:
                  </span>
                  <span className="text-xs text-gray-900">
                    {getRoleText(user.role)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs font-medium text-gray-600">
                    Trạng thái:
                  </span>
                  <span className="text-xs text-gray-900">
                    {getStatusText(user.status)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs font-medium text-gray-600">
                    Tham gia:
                  </span>
                  <span className="text-xs text-gray-900">
                    {formatDate(user.joinDate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs font-medium text-gray-600">
                    Đăng nhập cuối:
                  </span>
                  <span className="text-xs text-gray-900">
                    {formatDate(user.lastLogin)}
                  </span>
                </div>
              </div>
            </div>

            {/* Cột 3: Thống kê hoạt động */}
            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                <svg
                  className="w-4 h-4 mr-1 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                Thống kê hoạt động
              </h4>

              <div className="grid grid-cols-2 gap-1.5">
                <div className="text-center bg-blue-50 p-2 rounded">
                  <div className="text-sm font-bold text-admin-600">
                    {user.totalOrders || 0}
                  </div>
                  <div className="text-xs text-gray-600">Đơn hàng</div>
                </div>
                <div className="text-center bg-green-50 p-2 rounded">
                  <div className="text-sm font-bold text-success">
                    {user.totalSpent || "0đ"}
                  </div>
                  <div className="text-xs text-gray-600">Chi tiêu</div>
                </div>
                <div className="text-center bg-purple-50 p-2 rounded">
                  <div className="text-sm font-bold text-purple-600">
                    {user.totalReviews || 0}
                  </div>
                  <div className="text-xs text-gray-600">Đánh giá</div>
                </div>
                <div className="text-center bg-orange-50 p-2 rounded">
                  <div className="text-sm font-bold text-orange-600">
                    {user.loyaltyPoints || 0}
                  </div>
                  <div className="text-xs text-gray-600">Tích lũy</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ViewUserModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  user: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    address: PropTypes.string,
    role: PropTypes.string,
    status: PropTypes.string,
    joinDate: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
    ]),
    lastLogin: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
    ]),
    orderCount: PropTypes.number,
    totalSpent: PropTypes.number,
    avatar: PropTypes.string,
  }),
};

export default React.memo(ViewUserModal);
