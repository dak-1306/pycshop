import React from "react";

const ViewUserModal = ({ isOpen, onClose, user }) => {
  if (!isOpen || !user) return null;

  const formatDate = (date) => {
    if (!date) return "Chưa có thông tin";
    return new Date(date).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
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
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "customer":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
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
      <span className={`text-gray-900 ${className}`}>{value || "Chưa có thông tin"}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Chi tiết người dùng
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Thông tin chi tiết về tài khoản người dùng
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* User Avatar & Basic Info */}
          <div className="text-center mb-6 pb-6 border-b border-gray-200">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">
                {user.name?.charAt(0)?.toUpperCase() || "?"}
              </span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {user.name}
            </h3>
            <div className="flex items-center justify-center space-x-3">
              <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${getRoleColor(user.role)}`}>
                {getRoleText(user.role)}
              </span>
              <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(user.status)}`}>
                {getStatusText(user.status)}
              </span>
            </div>
          </div>

          {/* Detailed Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Thông tin cá nhân
              </h4>
              <div className="space-y-1">
                <InfoRow label="ID" value={user.id} />
                <InfoRow label="Họ tên" value={user.name} />
                <InfoRow label="Email" value={user.email} />
                <InfoRow label="Số điện thoại" value={user.phone} />
              </div>
            </div>

            {/* Account Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Thông tin tài khoản
              </h4>
              <div className="space-y-1">
                <InfoRow label="Vai trò" value={getRoleText(user.role)} />
                <InfoRow label="Trạng thái" value={getStatusText(user.status)} />
                <InfoRow label="Ngày tham gia" value={formatDate(user.joinDate)} />
                <InfoRow label="Lần đăng nhập cuối" value={formatDate(user.lastLogin)} />
              </div>
            </div>
          </div>

          {/* Address Information */}
          {user.address && (
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Địa chỉ
              </h4>
              <p className="text-gray-700 bg-white p-3 rounded border">
                {user.address}
              </p>
            </div>
          )}

          {/* Activity Stats (if available) */}
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Thống kê hoạt động
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center bg-white p-3 rounded border">
                <div className="text-2xl font-bold text-blue-600">{user.totalOrders || 0}</div>
                <div className="text-sm text-gray-600">Đơn hàng</div>
              </div>
              <div className="text-center bg-white p-3 rounded border">
                <div className="text-2xl font-bold text-green-600">{user.totalSpent || "0đ"}</div>
                <div className="text-sm text-gray-600">Tổng chi tiêu</div>
              </div>
              <div className="text-center bg-white p-3 rounded border">
                <div className="text-2xl font-bold text-purple-600">{user.totalReviews || 0}</div>
                <div className="text-sm text-gray-600">Đánh giá</div>
              </div>
              <div className="text-center bg-white p-3 rounded border">
                <div className="text-2xl font-bold text-orange-600">{user.loyaltyPoints || 0}</div>
                <div className="text-sm text-gray-600">Điểm tích lũy</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-b-lg">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewUserModal;
