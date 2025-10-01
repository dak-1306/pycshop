import React from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  // Kiểm tra xem user có phải admin không
  // Trong thực tế, bạn sẽ lấy thông tin này từ context hoặc localStorage
  const isAdmin = () => {
    // Mock logic - thay thế bằng logic thực tế
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user.role === "admin";
  };

  const isAuthenticated = () => {
    // Mock logic - thay thế bằng logic thực tế
    const token = localStorage.getItem("token");
    return !!token;
  };

  if (!isAuthenticated()) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin()) {
    // Redirect to home if not admin
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Truy cập bị từ chối
          </h2>
          <p className="text-gray-600 mb-4">
            Bạn không có quyền truy cập vào khu vực admin. Chỉ có admin mới có
            thể truy cập trang này.
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default AdminRoute;
