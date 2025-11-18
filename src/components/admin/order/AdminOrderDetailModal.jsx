import React from "react";
import PropTypes from "prop-types";
import { formatCurrency } from "../../../lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AdminOrderDetailModal = React.memo(
  ({ isOpen, onClose, order, onEdit }) => {
    if (!isOpen || !order) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full h-[95vh] flex flex-col">
          {/* Header - Compact */}
          <div className="flex items-center justify-between py-4 px-6 border-b border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-600 rounded-2xl flex items-center justify-center text-white">
                <FontAwesomeIcon icon={["fas", "crown"]} className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Đơn hàng #{order.id || order.ID_DonHang}
                </h2>
                <p className="text-gray-500 text-sm">
                  Quản lý đơn hàng - Toàn quyền kiểm soát
                </p>
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
              {/* Status Cards - Compact Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        {order.status || order.TrangThai || "Chờ xử lý"}
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
                        {order.paymentStatus ||
                          order.TrangThaiThanhToan ||
                          "Chờ thanh toán"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-500 bg-opacity-20 rounded-xl flex items-center justify-center">
                      <FontAwesomeIcon
                        icon={["fas", "money-bill-wave"]}
                        className="w-4 h-4 text-purple-600"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-sm">
                        Tổng tiền
                      </h3>
                      <p className="text-lg font-bold text-purple-800">
                        {formatCurrency(order.total || order.TongTien || 0)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Customer & Order Info */}
                <div className="space-y-4">
                  {/* Customer Information */}
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <FontAwesomeIcon
                          icon={["fas", "user"]}
                          className="text-blue-500 w-4 h-4"
                        />
                        Thông tin khách hàng
                      </h3>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="font-medium text-gray-600">
                            Tên:
                          </span>
                          <p className="text-gray-900">
                            {order.customerName || order.TenNguoiNhan || "N/A"}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">
                            Email:
                          </span>
                          <p className="text-gray-900">
                            {order.customerEmail || order.email || "N/A"}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">
                            Điện thoại:
                          </span>
                          <p className="text-gray-900">
                            {order.SoDienThoai || order.phone || "N/A"}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">
                            ID khách hàng:
                          </span>
                          <p className="text-gray-900 font-mono">
                            #{order.customerId || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <FontAwesomeIcon
                          icon={["fas", "shopping-cart"]}
                          className="text-blue-500 w-4 h-4"
                        />
                        Chi tiết đơn hàng
                      </h3>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="font-medium text-gray-600">
                            Mã đơn:
                          </span>
                          <p className="text-gray-900 font-mono">
                            #{order.id || order.ID_DonHang}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">
                            Ngày tạo:
                          </span>
                          <p className="text-gray-900">
                            {order.createdAt || order.ThoiGianTao
                              ? new Date(
                                  order.createdAt || order.ThoiGianTao
                                ).toLocaleString("vi-VN")
                              : "N/A"}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">
                            Người bán:
                          </span>
                          <p className="text-gray-900">
                            {order.sellerName || order.seller || "N/A"}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">
                            Sản phẩm:
                          </span>
                          <p className="text-gray-900">
                            {order.productName ||
                              (order.ChiTietDonHang &&
                                order.ChiTietDonHang[0]?.TenSanPham) ||
                              (order.items?.length
                                ? `${order.items.length} sản phẩm`
                                : "Sản phẩm")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Shipping & Additional Info */}
                <div className="space-y-4">
                  {/* Shipping Information */}
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <FontAwesomeIcon
                          icon={["fas", "truck"]}
                          className="text-blue-500 w-4 h-4"
                        />
                        Thông tin giao hàng
                      </h3>
                    </div>
                    <div className="p-4 space-y-3">
                      <div>
                        <span className="font-medium text-gray-600">
                          Địa chỉ giao hàng:
                        </span>
                        <p className="text-gray-900 mt-1">
                          {order.shippingAddress ||
                            order.DiaChiGiaoHang ||
                            "Chưa có thông tin"}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="font-medium text-gray-600">
                            Mã vận đơn:
                          </span>
                          <p className="text-gray-900 font-mono">
                            {order.trackingNumber ||
                              order.MaVanDon ||
                              "Chưa có"}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">
                            Ngày giao dự kiến:
                          </span>
                          <p className="text-gray-900">
                            {order.estimatedDelivery || order.NgayGiaoHangDuKien
                              ? new Date(
                                  order.estimatedDelivery ||
                                    order.NgayGiaoHangDuKien
                                ).toLocaleDateString("vi-VN")
                              : "Chưa xác định"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Admin Notes & Additional Info */}
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <FontAwesomeIcon
                          icon={["fas", "sticky-note"]}
                          className="text-blue-500 w-4 h-4"
                        />
                        Ghi chú & Thông tin bổ sung
                      </h3>
                    </div>
                    <div className="p-4 space-y-3">
                      <div>
                        <span className="font-medium text-gray-600">
                          Ghi chú admin:
                        </span>
                        <p className="text-gray-900 mt-1 bg-gray-50 p-2 rounded text-sm">
                          {order.notes || order.GhiChu || "Chưa có ghi chú"}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="font-medium text-gray-600">
                            Cập nhật lần cuối:
                          </span>
                          <p className="text-gray-900">
                            {order.updatedAt || order.CapNhat
                              ? new Date(
                                  order.updatedAt || order.CapNhat
                                ).toLocaleString("vi-VN")
                              : "N/A"}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">
                            Trạng thái hệ thống:
                          </span>
                          <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Hoạt động
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
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
                      onEdit(order.id || order.ID_DonHang);
                    }}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 hover:shadow-lg text-white rounded-xl font-medium transition-all transform hover:scale-105 flex items-center space-x-2"
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

AdminOrderDetailModal.displayName = "AdminOrderDetailModal";

AdminOrderDetailModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  order: PropTypes.object,
  onEdit: PropTypes.func,
  variant: PropTypes.oneOf(["admin", "seller"]),
};

export default AdminOrderDetailModal;
