import React from "react";
import PropTypes from "prop-types";
import { formatCurrency } from "../dashboard/charts/chartUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const OrderTable = React.memo(
  ({
    orders = [],
    onViewOrder,
    onEditOrder,
    onDeleteOrder,
    onCancelOrder,
    getStatusColor,
    variant = "seller", // "admin" | "seller"
  }) => {
    // Defensive check for orders array
    const safeOrders = Array.isArray(orders) ? orders : [];

    // Show empty state if no orders
    if (safeOrders.length === 0) {
      return (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <FontAwesomeIcon
            icon={["fas", "box-open"]}
            className="w-16 h-16 mx-auto text-gray-300 mb-4"
          />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Chưa có đơn hàng
          </h3>
          <p className="text-gray-500">Danh sách đơn hàng sẽ hiển thị ở đây</p>
        </div>
      );
    }

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
              {safeOrders.map((order, index) => (
                <tr
                  key={order.id || order.ID_DonHang || `admin-order-${index}`}
                  className="hover:bg-gray-50"
                >
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order.id || order.ID_DonHang}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {order.customerName ||
                        order.customer ||
                        order.TenNguoiNhan}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.customerEmail || order.SoDienThoai || ""}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {order.sellerName || order.seller || "Shop"}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {order.productName ||
                        (order.ChiTietDonHang &&
                          order.ChiTietDonHang[0]?.TenSanPham) ||
                        (order.items?.length
                          ? order.items?.length + " sản phẩm"
                          : "Sản phẩm")}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      {formatCurrency(
                        order.total || order.totalAmount || order.TongTien
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColorInternal(
                        order.status || order.TrangThai
                      )}`}
                    >
                      {getStatusText(order.status || order.TrangThai)}
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
                        <FontAwesomeIcon
                          icon={["fas", "eye"]}
                          className="w-4 h-4"
                        />
                        <span className="text-xs">Xem</span>
                      </button>
                      <button
                        onClick={() =>
                          onEditOrder &&
                          onEditOrder(order.id || order.ID_DonHang)
                        }
                        className="group flex items-center gap-1 px-3 py-1.5 text-indigo-600 hover:text-white hover:bg-indigo-600 rounded-lg transition-all duration-200 border border-indigo-200 hover:border-indigo-600"
                        title="Chỉnh sửa đơn hàng"
                      >
                        <FontAwesomeIcon
                          icon={["fas", "edit"]}
                          className="w-4 h-4"
                        />
                        <span className="text-xs">Sửa</span>
                      </button>

                      <button
                        onClick={() =>
                          onDeleteOrder &&
                          onDeleteOrder(order.id || order.ID_DonHang)
                        }
                        className="group flex items-center gap-1 px-3 py-1.5 text-red-600 hover:text-white hover:bg-red-600 rounded-lg transition-all duration-200 border border-red-200 hover:border-red-600"
                        title="Xóa đơn hàng"
                      >
                        <FontAwesomeIcon
                          icon={["fas", "trash"]}
                          className="w-4 h-4"
                        />
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
            Hiển thị {safeOrders.length} đơn hàng
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
            {safeOrders.map((order, index) => (
              <tr
                key={order.id || order.ID_DonHang || `seller-order-${index}`}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    {order.image ? (
                      <img
                        src={order.image}
                        alt={
                          order.productName ||
                          (order.ChiTietDonHang &&
                            order.ChiTietDonHang[0]?.TenSanPham) ||
                          "Sản phẩm"
                        }
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon={["fas", "image"]}
                        className="w-8 h-8 text-gray-400"
                      />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {order.productName ||
                      (order.ChiTietDonHang &&
                        order.ChiTietDonHang[0]?.TenSanPham) ||
                      "Sản phẩm"}
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
                      order.status || order.TrangThai
                    )}`}
                  >
                    {getStatusText(order.status || order.TrangThai)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() =>
                        onViewOrder && onViewOrder(order.id || order.ID_DonHang)
                      }
                      className="text-blue-600 hover:text-blue-900 font-medium"
                    >
                      <FontAwesomeIcon
                        icon={["fas", "eye"]}
                        className="w-4 h-4 inline-block mr-1"
                      />
                      Xem
                    </button>
                    <button
                      onClick={() =>
                        onEditOrder && onEditOrder(order.id || order.ID_DonHang)
                      }
                      className="text-green-600 hover:text-green-900 font-medium"
                    >
                      <FontAwesomeIcon
                        icon={["fas", "edit"]}
                        className="w-4 h-4 inline-block mr-1"
                      />
                      Sửa
                    </button>
                    <button
                      onClick={() =>
                        onCancelOrder &&
                        onCancelOrder(order.id || order.ID_DonHang)
                      }
                      className="text-red-600 hover:text-red-900 font-medium"
                    >
                      <FontAwesomeIcon
                        icon={["fas", "times-circle"]}
                        className="w-4 h-4 inline-block mr-1"
                      />
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
  }
);

OrderTable.displayName = "OrderTable";

OrderTable.propTypes = {
  orders: PropTypes.array,
  onViewOrder: PropTypes.func,
  onEditOrder: PropTypes.func,
  onDeleteOrder: PropTypes.func,
  onCancelOrder: PropTypes.func,
  getStatusColor: PropTypes.func,
  variant: PropTypes.oneOf(["admin", "seller"]),
};

export default OrderTable;
