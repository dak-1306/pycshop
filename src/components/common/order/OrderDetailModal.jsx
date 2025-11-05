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

    const headerTitle =
      variant === "admin" ? "Quản lý đơn hàng" : "Đơn hàng của bạn";

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full h-[95vh] flex flex-col">
          {/* Header - Compact */}
          <div className="flex items-center justify-between py-4 px-6 border-b border-gray-100">
            <div className="flex items-center space-x-4">
              <div
                className={`w-12 h-12 bg-gradient-to-br ${headerGradient} rounded-2xl flex items-center justify-center text-white`}
              >
                <FontAwesomeIcon
                  icon={
                    variant === "admin"
                      ? ["fas", "crown"]
                      : ["fas", "shopping-bag"]
                  }
                  className="w-6 h-6"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Đơn hàng #{order.id}
                </h2>
                <p className="text-gray-500 text-sm">{headerTitle}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors group"
            >
              <FontAwesomeIcon
                icon={["fas", "times"]}
                className="w-5 h-5 text-gray-600 group-hover:text-gray-800 transition-colors"
              />
            </button>
          </div>

          {/* Content - Fixed height với optimized layout */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Status Cards - Compact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 bg-opacity-20 rounded-xl flex items-center justify-center">
                      <FontAwesomeIcon
                        icon={["fas", "clipboard-list"]}
                        className="w-4 h-4 text-blue-600"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-sm">
                        Trạng thái đơn hàng
                      </h3>
                      <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {order.status || "Chờ xử lý"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 bg-opacity-20 rounded-xl flex items-center justify-center">
                      <FontAwesomeIcon
                        icon={["fas", "credit-card"]}
                        className="w-4 h-4 text-green-600"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-sm">
                        Thanh toán
                      </h3>
                      <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {order.paymentStatus || "Chờ thanh toán"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Information - Compact */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <FontAwesomeIcon
                      icon={["fas", "info-circle"]}
                      className="w-4 h-4 text-blue-600"
                    />
                    Thông tin đơn hàng
                  </h3>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Sản phẩm
                      </label>
                      <p className="text-sm font-semibold text-gray-900">
                        {order.productName ||
                          order.items ||
                          "Không có thông tin"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Tổng tiền
                      </label>
                      <p className="text-sm font-bold text-green-600">
                        {formatCurrency(order.total || order.totalAmount || 0)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Số lượng
                      </label>
                      <p className="text-sm font-semibold text-gray-900">
                        {order.quantity || 1}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Danh mục
                      </label>
                      <p className="text-sm text-gray-700">
                        {order.category || "Không có thông tin"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Ngày tạo
                      </label>
                      <p className="text-sm text-gray-700">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString(
                              "vi-VN"
                            )
                          : new Date().toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Mã đơn hàng
                      </label>
                      <p className="text-xs text-gray-700 font-mono bg-gray-100 px-2 py-1 rounded">
                        {order.id}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Information - Compact */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <FontAwesomeIcon
                      icon={["fas", "user"]}
                      className="w-4 h-4 text-green-600"
                    />
                    Thông tin khách hàng
                  </h3>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Tên khách hàng
                      </label>
                      <p className="text-sm font-semibold text-gray-900">
                        {order.customer ||
                          order.customerName ||
                          "Không có thông tin"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Email
                      </label>
                      <p className="text-sm text-gray-700">
                        {order.email ||
                          order.customerEmail ||
                          "Không có thông tin"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Số điện thoại
                      </label>
                      <p className="text-sm text-gray-700">
                        {order.phone ||
                          order.customerPhone ||
                          "Không có thông tin"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Địa chỉ
                      </label>
                      <p className="text-sm text-gray-700">
                        {order.address ||
                          order.customerAddress ||
                          "Không có thông tin"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seller Information (if admin view) - Compact */}
              {variant === "admin" && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <FontAwesomeIcon
                        icon={["fas", "store"]}
                        className="w-4 h-4 text-purple-600"
                      />
                      Thông tin người bán
                    </h3>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Tên người bán
                        </label>
                        <p className="text-sm font-semibold text-gray-900">
                          {order.seller ||
                            order.sellerName ||
                            "Không có thông tin"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Shop
                        </label>
                        <p className="text-sm text-gray-700">
                          {order.shopName || "Không có thông tin"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer - Compact */}
          <div className="border-t border-gray-100 py-4 px-6">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                <FontAwesomeIcon icon={["fas", "lock"]} className="mr-1" />
                Thông tin được bảo mật
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
                >
                  Đóng
                </button>
                {onEdit && (
                  <button
                    onClick={() => {
                      onClose();
                      onEdit(order.id);
                    }}
                    className={`px-8 py-3 bg-gradient-to-r ${headerGradient} hover:shadow-lg text-white rounded-xl font-medium transition-all transform hover:scale-105 flex items-center space-x-2`}
                  >
                    <FontAwesomeIcon icon={["fas", "edit"]} />
                    <span>Chỉnh sửa</span>
                  </button>
                )}
              </div>
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
