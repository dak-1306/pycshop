import React from "react";

const OrderTable = ({
  orders,
  onViewOrder,
  onEditOrder,
  onDeleteOrder,
  onCancelOrder,
  onUpdateStatus,
  getStatusColor,
  variant = "seller", // "admin" | "seller"
}) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getStatusColorInternal = (status) => {
    if (getStatusColor) return getStatusColor(status);

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

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusText = (status) => {
    switch (status) {
      case "paid":
        return "Đã thanh toán";
      case "pending":
        return "Chờ thanh toán";
      case "failed":
        return "Thất bại";
      default:
        return "Không xác định";
    }
  };

  if (variant === "admin") {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Khách hàng
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Người bán
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sản phẩm
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tổng tiền
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thanh toán
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày tạo
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{order.id}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {order.customerName || order.customer}
                  </div>
                  <div className="text-sm text-gray-500">
                    {order.customerEmail || ""}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {order.sellerName || order.seller}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {order.productName || order.items?.length + " sản phẩm"}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">
                    {formatPrice(order.total || order.totalAmount)}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColorInternal(
                      order.status
                    )}`}
                  >
                    {getStatusText(order.status)}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(
                      order.paymentStatus
                    )}`}
                  >
                    {getPaymentStatusText(order.paymentStatus)}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(
                    order.createdAt || order.orderDate
                  ).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onViewOrder && onViewOrder(order.id)}
                      className="group flex items-center gap-1 px-3 py-1.5 text-blue-600 hover:text-white hover:bg-blue-600 rounded-lg transition-all duration-200 border border-blue-200 hover:border-blue-600"
                      title="Xem chi tiết đơn hàng"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      <span className="text-xs">Xem</span>
                    </button>
                    <button
                      onClick={() => onEditOrder && onEditOrder(order.id)}
                      className="group flex items-center gap-1 px-3 py-1.5 text-indigo-600 hover:text-white hover:bg-indigo-600 rounded-lg transition-all duration-200 border border-indigo-200 hover:border-indigo-600"
                      title="Chỉnh sửa đơn hàng"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      <span className="text-xs">Sửa</span>
                    </button>

                    <button
                      onClick={() => onDeleteOrder && onDeleteOrder(order.id)}
                      className="group flex items-center gap-1 px-3 py-1.5 text-red-600 hover:text-white hover:bg-red-600 rounded-lg transition-all duration-200 border border-red-200 hover:border-red-600"
                      title="Xóa đơn hàng"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      <span className="text-xs">Xóa</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Seller variant (default)
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border overflow-x-auto">
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b">
        <h3 className="text-lg font-semibold text-gray-800">
          Danh sách đơn hàng
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Hiển thị {orders.length} đơn hàng
        </p>
      </div>
      <table className="min-w-full">
        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
          <tr>
            <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
              Ảnh
            </th>
            <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
              Tên sản phẩm
            </th>
            <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
              Giá
            </th>
            <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
              Số lượng
            </th>
            <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
              Danh mục
            </th>
            <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
              Trạng thái
            </th>
            <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                  {order.image ? (
                    <img
                      src={order.image}
                      alt={order.productName}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 3a2 2 0 00-2 2v1.007a1 1 0 00.293.707L3 7.414V15a2 2 0 002 2h10a2 2 0 002-2V7.414l.707-.707A1 1 0 0018 6.007V5a2 2 0 00-2-2H4zm2 4a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm0 3a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {order.productName}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-semibold text-gray-900">
                  {order.price}₫
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{order.quantity}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{order.category}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColorInternal(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onViewOrder && onViewOrder(order.id)}
                    className="text-blue-600 hover:text-blue-900 font-medium"
                  >
                    Xem
                  </button>
                  <button
                    onClick={() => onEditOrder && onEditOrder(order.id)}
                    className="text-green-600 hover:text-green-900 font-medium"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => onCancelOrder && onCancelOrder(order.id)}
                    className="text-red-600 hover:text-red-900 font-medium"
                  >
                    Hủy
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
