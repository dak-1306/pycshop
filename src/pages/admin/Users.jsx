import React, { useState } from "react";

const AdminUsers = () => {
  const [users] = useState([
    {
      id: 1,
      name: "Nguyễn Văn A",
      email: "nguyenvana@email.com",
      role: "customer",
      status: "active",
      joinDate: "2024-01-15",
      lastLogin: "2024-10-01",
    },
    {
      id: 2,
      name: "Trần Thị B",
      email: "tranthib@email.com",
      role: "seller",
      status: "active",
      joinDate: "2024-02-20",
      lastLogin: "2024-09-30",
    },
    {
      id: 3,
      name: "Lê Văn C",
      email: "levanc@email.com",
      role: "customer",
      status: "inactive",
      joinDate: "2024-03-10",
      lastLogin: "2024-08-15",
    },
  ]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h1>
        <p className="text-gray-600">
          Quản lý tất cả người dùng trong hệ thống
        </p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <input
                type="text"
                placeholder="Tìm kiếm người dùng..."
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Tất cả vai trò</option>
                <option value="customer">Khách hàng</option>
                <option value="seller">Người bán</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium">
              Thêm người dùng
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Người dùng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vai trò
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tham gia
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lần cuối đăng nhập
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                        <span className="text-gray-600 font-medium">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-800"
                          : user.role === "seller"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.role === "admin"
                        ? "Admin"
                        : user.role === "seller"
                        ? "Người bán"
                        : "Khách hàng"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.status === "active"
                        ? "Hoạt động"
                        : "Không hoạt động"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(user.joinDate).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(user.lastLogin).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      Sửa
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
