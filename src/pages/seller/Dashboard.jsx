import React, { useState, useEffect } from "react";
import SellerLayout from "../../components/layout/SellerLayout";

const Dashboard = () => {
  const [stats] = useState({
    orders: { value: 1254, change: 12.5, isPositive: true },
    revenue: { value: 12450000, change: 8.3, isPositive: true },
    products: { value: 320, change: -2.1, isPositive: false },
    newCustomers: { value: 45, change: 15.7, isPositive: true },
  });

  const [orderData, setOrderData] = useState([]);

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API call for order data
    setOrderData([
      {
        id: "#DH001",
        customer: "Nguyễn Văn A",
        product: "iPhone 15 Pro",
        status: "Đang giao",
        date: "28/09/2024",
      },
      {
        id: "#DH002",
        customer: "Trần Thị B",
        product: "Samsung Galaxy S24",
        status: "Đã giao",
        date: "27/09/2024",
      },
      {
        id: "#DH003",
        customer: "Lê Văn C",
        product: "MacBook Air M2",
        status: "Chờ xác nhận",
        date: "26/09/2024",
      },
      {
        id: "#DH004",
        customer: "Phạm Thị D",
        product: "iPad Pro 11",
        status: "Đã hủy",
        date: "25/09/2024",
      },
      {
        id: "#DH005",
        customer: "Hoàng Văn E",
        product: "AirPods Pro",
        status: "Đã giao",
        date: "24/09/2024",
      },
    ]);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Đã giao":
        return "bg-green-100 text-green-800";
      case "Đang giao":
        return "bg-blue-100 text-blue-800";
      case "Chờ xác nhận":
        return "bg-yellow-100 text-yellow-800";
      case "Đã hủy":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <SellerLayout title="Dashboard">
      <div className="p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Orders Card */}
          <div className="bg-orange-50 rounded-xl p-6 border border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium mb-1">
                  Đơn hàng
                </p>
                <p className="text-3xl font-bold text-orange-700">
                  {stats.orders.value.toLocaleString()}
                  <span className="text-orange-500 text-xs">đơn</span>
                </p>
                <p
                  className={`text-sm font-medium ${
                    stats.orders.isPositive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stats.orders.isPositive ? "↑" : "↓"}{" "}
                  {Math.abs(stats.orders.change)}% so với tháng trước
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-orange-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7 4V2a1 1 0 011-1h4a1 1 0 011 1v2h4a1 1 0 110 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V6a1 1 0 110-2h4zm2-1v1h2V3H9zm5 5a1 1 0 10-2 0v2a1 1 0 102 0V8zm-4 0a1 1 0 10-2 0v2a1 1 0 102 0V8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Revenue Card */}
          <div className="bg-green-50 rounded-xl p-6 border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium mb-1">
                  Doanh thu hôm nay
                </p>
                <p className="text-3xl font-bold text-green-700">
                  {formatCurrency(stats.revenue.value).split("₫")[0]}
                  <span className="text-green-500 text-xs">₫</span>
                </p>
                <p
                  className={`text-sm font-medium ${
                    stats.revenue.isPositive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stats.revenue.isPositive ? "↑" : "↓"}{" "}
                  {Math.abs(stats.revenue.change)}% so với tháng trước
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Products Card */}
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium mb-1">
                  Sản phẩm đang bán
                </p>
                <p className="text-3xl font-bold text-blue-700">
                  {stats.products.value}
                  <span className="text-blue-500 text-xs">sản phẩm</span>
                </p>
                <p
                  className={`text-sm font-medium ${
                    stats.products.isPositive
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {stats.products.isPositive ? "↑" : "↓"}{" "}
                  {Math.abs(stats.products.change)}% so với tháng trước
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM6 12a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* New Customers Card */}
          <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium mb-1">
                  Khách hàng mới
                </p>
                <p className="text-3xl font-bold text-purple-700">
                  {stats.newCustomers.value}
                  <span className="text-purple-500 text-xs">khách</span>
                </p>
                <p
                  className={`text-sm font-medium ${
                    stats.newCustomers.isPositive
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {stats.newCustomers.isPositive ? "↑" : "↓"}{" "}
                  {Math.abs(stats.newCustomers.change)}% so với tháng trước
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Chart 1 - Rectangle placeholder */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Biểu đồ cột doanh thu theo tháng
            </h3>
            <div className="h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Biểu đồ cột doanh thu theo tháng</p>
            </div>
          </div>

          {/* Chart 2 - Circle placeholder */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Phân tích sản phẩm
            </h3>
            <div className="h-64 flex items-center justify-center">
              <div className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center">
                <p className="text-gray-500 text-center">
                  Biểu đồ tròn
                  <br />
                  phân loại sản phẩm
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-yellow-600">
              Danh sách đơn hàng gần đây
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã đơn hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Khách hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sản phẩm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày đặt
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orderData.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.product}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </SellerLayout>
  );
};

export default Dashboard;
