import React from "react";

const RecentOrdersTable = ({
  orderData,
  getStatusColor,
  variant = "seller",
}) => {
  // Admin table headers
  const adminHeaders = [
    { key: "id", label: "Mã đơn hàng" },
    { key: "customer", label: "Khách hàng" },
    { key: "seller", label: "Người bán" },
    { key: "product", label: "Sản phẩm" },
    { key: "amount", label: "Số tiền" },
    { key: "status", label: "Trạng thái" },
    { key: "date", label: "Ngày đặt" },
    { key: "actions", label: "Hành động" },
  ];

  // Seller table headers
  const sellerHeaders = [
    { key: "id", label: "Mã đơn hàng" },
    { key: "customer", label: "Khách hàng" },
    { key: "product", label: "Sản phẩm" },
    { key: "status", label: "Trạng thái" },
    { key: "date", label: "Ngày đặt" },
  ];

  const headers = variant === "admin" ? adminHeaders : sellerHeaders;
  const title =
    variant === "admin"
      ? "Đơn hàng gần đây (Toàn hệ thống)"
      : "Danh sách đơn hàng gần đây";

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  if (!orderData || orderData.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-yellow-600">{title}</h3>
        </div>
        <div className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <p className="text-gray-500">Chưa có đơn hàng nào</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-yellow-600">{title}</h3>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              {orderData.length} đơn hàng
            </div>
            {variant === "admin" && (
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Xem tất cả
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {headers.map((header) => (
                <th
                  key={header.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orderData.map((order, index) => (
              <tr
                key={order.id || index}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{order.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {order.customer || order.customerName}
                  </div>
                  {variant === "admin" && order.customerEmail && (
                    <div className="text-sm text-gray-500">
                      {order.customerEmail}
                    </div>
                  )}
                </td>
                {variant === "admin" && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {order.seller || order.sellerName}
                    </div>
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {order.product || order.productName}
                  </div>
                  {order.quantity && (
                    <div className="text-sm text-gray-500">
                      Số lượng: {order.quantity}
                    </div>
                  )}
                </td>
                {variant === "admin" && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      {formatCurrency(order.amount || order.total)}
                    </div>
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      getStatusColor
                        ? getStatusColor(order.status)
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.date ||
                    new Date(order.createdAt).toLocaleDateString("vi-VN")}
                </td>
                {variant === "admin" && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        Xem
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        Duyệt
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer with pagination for admin */}
      {variant === "admin" && orderData.length > 5 && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Hiển thị 5 trong số {orderData.length} đơn hàng
            </div>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Tải thêm
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentOrdersTable;
