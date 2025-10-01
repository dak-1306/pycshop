import React, { useState, useEffect } from "react";

const Dashboard = () => {
  // Mock data - trong thực tế sẽ lấy từ API
  const [stats, setStats] = useState({
    totalUsers: 1248,
    totalOrders: 856,
    totalProducts: 342,
    totalRevenue: 2845600000,
    todayOrders: 23,
    todayUsers: 67,
    monthlyGrowth: 12.5,
    orderGrowth: 8.3,
  });

  const [recentOrders, setRecentOrders] = useState([
    {
      id: "ORD-001",
      customer: "Nguyễn Văn A",
      amount: 1250000,
      status: "completed",
      date: "2024-10-01",
    },
    {
      id: "ORD-002",
      customer: "Trần Thị B",
      amount: 890000,
      status: "pending",
      date: "2024-10-01",
    },
    {
      id: "ORD-003",
      customer: "Lê Văn C",
      amount: 2100000,
      status: "processing",
      date: "2024-09-30",
    },
    {
      id: "ORD-004",
      customer: "Phạm Thị D",
      amount: 675000,
      status: "completed",
      date: "2024-09-30",
    },
    {
      id: "ORD-005",
      customer: "Hoàng Văn E",
      amount: 1890000,
      status: "cancelled",
      date: "2024-09-29",
    },
  ]);

  const [recentUsers, setRecentUsers] = useState([
    {
      id: 1,
      name: "Nguyễn Minh F",
      email: "minhhf@email.com",
      joinDate: "2024-10-01",
      orders: 2,
    },
    {
      id: 2,
      name: "Trần Thị G",
      email: "thig@email.com",
      joinDate: "2024-09-30",
      orders: 0,
    },
    {
      id: 3,
      name: "Lê Văn H",
      email: "vanh@email.com",
      joinDate: "2024-09-30",
      orders: 1,
    },
    {
      id: 4,
      name: "Phạm Thị I",
      email: "thii@email.com",
      joinDate: "2024-09-29",
      orders: 3,
    },
  ]);

  // Mock chart data
  const [chartData] = useState({
    revenue: [
      { month: "T1", value: 2100000000 },
      { month: "T2", value: 2350000000 },
      { month: "T3", value: 2200000000 },
      { month: "T4", value: 2680000000 },
      { month: "T5", value: 2900000000 },
      { month: "T6", value: 3200000000 },
      { month: "T7", value: 2950000000 },
      { month: "T8", value: 3100000000 },
      { month: "T9", value: 2850000000 },
      { month: "T10", value: 2845600000 },
    ],
    orders: [
      { month: "T1", value: 645 },
      { month: "T2", value: 720 },
      { month: "T3", value: 680 },
      { month: "T4", value: 790 },
      { month: "T5", value: 850 },
      { month: "T6", value: 920 },
      { month: "T7", value: 880 },
      { month: "T8", value: 940 },
      { month: "T9", value: 820 },
      { month: "T10", value: 856 },
    ],
  });

  // Utility functions
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("vi-VN");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "completed":
        return "Hoàn thành";
      case "pending":
        return "Chờ xử lý";
      case "processing":
        return "Đang xử lý";
      case "cancelled":
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Dashboard Admin
                </h1>
                <p className="text-gray-600 mt-2">
                  Chào mừng bạn quay trở lại! Đây là tổng quan hệ thống ngày hôm
                  nay.
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  <span>Thêm mới</span>
                </button>
                <button className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg border border-gray-300 transition-colors flex items-center space-x-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  <span>Export</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Tổng người dùng
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.totalUsers.toLocaleString()}
                </p>
                <p className="text-sm text-green-600 mt-2 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  +{stats.todayUsers} hôm nay
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Total Orders */}
          <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Tổng đơn hàng
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.totalOrders.toLocaleString()}
                </p>
                <p className="text-sm text-green-600 mt-2 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  +{stats.todayOrders} hôm nay
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Total Products */}
          <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Tổng sản phẩm
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.totalProducts.toLocaleString()}
                </p>
                <p className="text-sm text-blue-600 mt-2 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Đang hoạt động
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Tổng doanh thu
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {formatCurrency(stats.totalRevenue)}
                </p>
                <p className="text-sm text-green-600 mt-2 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  +{stats.monthlyGrowth}% tháng này
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Doanh thu theo tháng
              </h3>
              <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option value="2024">2024</option>
                <option value="2023">2023</option>
              </select>
            </div>
            <div className="h-64 flex items-end justify-between space-x-2">
              {chartData.revenue.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-blue-500 rounded-t-sm hover:bg-blue-600 transition-colors cursor-pointer relative group"
                    style={{
                      height: `${
                        (item.value /
                          Math.max(...chartData.revenue.map((d) => d.value))) *
                        200
                      }px`,
                    }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {formatCurrency(item.value)}
                    </div>
                  </div>
                  <span className="text-xs text-gray-600 mt-2">
                    {item.month}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Orders Chart */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Đơn hàng theo tháng
              </h3>
              <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option value="2024">2024</option>
                <option value="2023">2023</option>
              </select>
            </div>
            <div className="h-64 flex items-end justify-between space-x-2">
              {chartData.orders.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-green-500 rounded-t-sm hover:bg-green-600 transition-colors cursor-pointer relative group"
                    style={{
                      height: `${
                        (item.value /
                          Math.max(...chartData.orders.map((d) => d.value))) *
                        200
                      }px`,
                    }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.value.toLocaleString()}
                    </div>
                  </div>
                  <span className="text-xs text-gray-600 mt-2">
                    {item.month}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Data Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Đơn hàng gần đây
                </h3>
                <a
                  href="/admin/orders"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Xem tất cả →
                </a>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Đơn hàng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Khách hàng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Số tiền
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {order.id}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatDate(order.date)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {order.customer}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(order.amount)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusText(order.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Users */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Người dùng mới
                </h3>
                <a
                  href="/admin/users"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Xem tất cả →
                </a>
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
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày tham gia
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Đơn hàng
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                            <span className="text-sm font-medium text-gray-600">
                              {user.name.charAt(0)}
                            </span>
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(user.joinDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {user.orders}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Thao tác nhanh
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="flex items-center justify-center space-x-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <span className="font-medium text-gray-900">Thêm sản phẩm</span>
            </button>
            <button className="flex items-center justify-center space-x-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                />
              </svg>
              <span className="font-medium text-gray-900">Quản lý user</span>
            </button>
            <button className="flex items-center justify-center space-x-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H9a2 2 0 01-2-2z"
                />
              </svg>
              <span className="font-medium text-gray-900">Báo cáo</span>
            </button>
            <button className="flex items-center justify-center space-x-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <svg
                className="w-6 h-6 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="font-medium text-gray-900">Cài đặt</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
