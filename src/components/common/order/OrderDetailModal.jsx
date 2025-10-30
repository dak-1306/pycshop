import React from "react";
import PropTypes from "prop-types";
import { formatCurrency } from "../../../lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const OrderDetailModal = React.memo(
  ({ isOpen, onClose, order, onEdit, variant = "seller" }) => {
    if (!isOpen || !order) return null;

    const headerGradient =
      variant === "admin"
        ? "from-blue-600 via-blue-700 to-indigo-600"
        : "from-orange-500 via-orange-600 to-red-500";

    const headerIcon = variant === "admin" ? "👑" : "�️";
    const headerTitle =
      variant === "admin" ? "Quản lý đơn hàng" : "Đơn hàng của bạn";

    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden">
          {/* Header */}
          <div
            className={`relative bg-gradient-to-r ${headerGradient} text-white px-8 py-6`}
          >
            <div className="absolute inset-0 bg-black bg-opacity-10"></div>
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <span className="text-3xl">{headerIcon}</span>
                </div>
                <div>
                  <h2 className="text-3xl font-bold tracking-tight">
                    Đơn hàng #{order.id}
                  </h2>
                  <p className="text-white text-opacity-90 text-lg mt-1">
                    {headerTitle}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-12 h-12 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-2xl flex items-center justify-center transition-all hover:scale-110 backdrop-blur-sm"
              >
                <FontAwesomeIcon icon={["fas", "times"]} className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(95vh-200px)]">
            <div className="p-8 space-y-8">
              {/* Status Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border-2 border-dashed border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-500 bg-opacity-20 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">📋</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        Trạng thái đơn hàng
                      </h3>
                      <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {order.status || "Chờ xử lý"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border-2 border-dashed border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-500 bg-opacity-20 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">💳</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        Thanh toán
                      </h3>
                      <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        {order.paymentStatus || "Chờ thanh toán"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Information */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FontAwesomeIcon
                        icon={["fas", "info-circle"]}
                        className="w-4 h-4 text-blue-600"
                      />
                    </div>
                    Thông tin đơn hàng
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Sản phẩm
                      </label>
                      <p className="text-lg font-semibold text-gray-900">
                        {order.productName ||
                          order.items ||
                          "Không có thông tin"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Tổng tiền
                      </label>
                      <p className="text-lg font-bold text-green-600">
                        {formatCurrency(order.total || order.totalAmount || 0)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Số lượng
                      </label>
                      <p className="text-lg font-semibold text-gray-900">
                        {order.quantity || 1}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Danh mục
                      </label>
                      <p className="text-gray-700">
                        {order.category || "Không có thông tin"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Ngày tạo
                      </label>
                      <p className="text-gray-700">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString(
                              "vi-VN"
                            )
                          : new Date().toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Mã đơn hàng
                      </label>
                      <p className="text-gray-700 font-mono bg-gray-100 px-2 py-1 rounded text-sm">
                        {order.id}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <FontAwesomeIcon
                        icon={["fas", "user"]}
                        className="w-4 h-4 text-green-600"
                      />
                    </div>
                    Thông tin khách hàng
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Tên khách hàng
                      </label>
                      <p className="text-lg font-semibold text-gray-900">
                        {order.customer ||
                          order.customerName ||
                          "Không có thông tin"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Email
                      </label>
                      <p className="text-gray-700">
                        {order.email ||
                          order.customerEmail ||
                          "Không có thông tin"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Số điện thoại
                      </label>
                      <p className="text-gray-700">
                        {order.phone ||
                          order.customerPhone ||
                          "Không có thông tin"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Địa chỉ
                      </label>
                      <p className="text-gray-700">
                        {order.address ||
                          order.customerAddress ||
                          "Không có thông tin"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seller Information (if admin view) */}
              {variant === "admin" && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <FontAwesomeIcon
                          icon={["fas", "store"]}
                          className="w-4 h-4 text-purple-600"
                        />
                      </div>
                      Thông tin người bán
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                          Tên người bán
                        </label>
                        <p className="text-lg font-semibold text-gray-900">
                          {order.seller ||
                            order.sellerName ||
                            "Không có thông tin"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                          Shop
                        </label>
                        <p className="text-gray-700">
                          {order.shopName || "Không có thông tin"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-t border-gray-200 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              <FontAwesomeIcon icon={["fas", "lock"]} className="mr-1" />
              Thông tin đơn hàng được bảo mật
            </div>
            <div className="flex gap-4">
              <button
                onClick={onClose}
                className="px-6 py-3 text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all font-medium shadow-sm hover:shadow-md transform hover:scale-105"
              >
                <FontAwesomeIcon
                  icon={["fas", "times"]}
                  className="w-4 h-4 mr-2"
                />
                Đóng
              </button>
              {onEdit && (
                <button
                  onClick={() => {
                    onClose();
                    onEdit(order.id);
                  }}
                  className={`px-6 py-3 bg-gradient-to-r ${headerGradient} text-white rounded-xl transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-0.5`}
                >
                  <FontAwesomeIcon
                    icon={["fas", "edit"]}
                    className="w-4 h-4 mr-2"
                  />
                  Chỉnh sửa đơn hàng
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

OrderDetailModal.displayName = "OrderDetailModal";

OrderDetailModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  order: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    status: PropTypes.string,
    paymentStatus: PropTypes.string,
    productName: PropTypes.string,
    items: PropTypes.string,
    total: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    totalAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    category: PropTypes.string,
    createdAt: PropTypes.string,
    customer: PropTypes.string,
    customerName: PropTypes.string,
    email: PropTypes.string,
    customerEmail: PropTypes.string,
    phone: PropTypes.string,
    customerPhone: PropTypes.string,
    address: PropTypes.string,
    customerAddress: PropTypes.string,
    seller: PropTypes.string,
    sellerName: PropTypes.string,
    shopName: PropTypes.string,
  }),
  onEdit: PropTypes.func,
  variant: PropTypes.oneOf(["admin", "seller"]),
};

export default OrderDetailModal;
