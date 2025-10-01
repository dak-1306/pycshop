import React from "react";

const AdminTestPage = () => {
  const setAdminUser = () => {
    // Set mock admin user in localStorage for testing
    const adminUser = {
      id: 1,
      name: "Admin User",
      email: "admin@pycshop.com",
      role: "admin",
    };

    localStorage.setItem("user", JSON.stringify(adminUser));
    localStorage.setItem("token", "mock-admin-token");

    alert("Đã đăng nhập với quyền admin! Bạn có thể truy cập /admin");
    window.location.href = "/admin";
  };

  const setRegularUser = () => {
    // Set mock regular user in localStorage for testing
    const regularUser = {
      id: 2,
      name: "Regular User",
      email: "user@pycshop.com",
      role: "customer",
    };

    localStorage.setItem("user", JSON.stringify(regularUser));
    localStorage.setItem("token", "mock-user-token");

    alert("Đã đăng nhập với quyền customer! Truy cập /admin sẽ bị từ chối");
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    alert("Đã đăng xuất!");
  };

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-lg w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Test Admin Routes
        </h1>

        {currentUser.email && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900">Đang đăng nhập:</h3>
            <p className="text-blue-700">Email: {currentUser.email}</p>
            <p className="text-blue-700">Vai trò: {currentUser.role}</p>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={setAdminUser}
            className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition-colors"
          >
            Đăng nhập với quyền Admin
          </button>

          <button
            onClick={setRegularUser}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors"
          >
            Đăng nhập với quyền Customer
          </button>

          <button
            onClick={logout}
            className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-medium transition-colors"
          >
            Đăng xuất
          </button>

          <div className="pt-4 border-t">
            <a
              href="/admin"
              className="block w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg font-medium text-center transition-colors"
            >
              Truy cập Admin Panel
            </a>
          </div>

          <div className="text-sm text-gray-600 text-center">
            <p>Sử dụng các button trên để test quyền truy cập admin.</p>
            <p className="mt-2">
              <strong>Admin:</strong> Có thể truy cập tất cả trang admin
              <br />
              <strong>Customer:</strong> Sẽ bị từ chối truy cập admin
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTestPage;
