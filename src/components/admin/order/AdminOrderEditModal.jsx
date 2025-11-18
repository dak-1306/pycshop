import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AdminOrderEditModal = ({ isOpen, onClose, order, onSave }) => {
  const [formData, setFormData] = useState({
    customer: "",
    email: "",
    phone: "",
    total: "",
    status: "pending",
    paymentStatus: "pending",
    seller: "",
    shippingAddress: "",
    trackingNumber: "",
    estimatedDelivery: "",
    notes: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  // Populate form when order changes
  useEffect(() => {
    if (order && isOpen) {
      setFormData({
        customer:
          order.customerName || order.TenNguoiNhan || order.customer || "",
        email: order.customerEmail || order.email || "",
        phone: order.SoDienThoai || order.phone || "",
        total: order.total || order.TongTien || order.totalAmount || "",
        status: order.status || order.TrangThai || "pending",
        paymentStatus:
          order.paymentStatus || order.TrangThaiThanhToan || "pending",
        seller: order.sellerName || order.seller || "",
        shippingAddress: order.shippingAddress || order.DiaChiGiaoHang || "",
        trackingNumber: order.trackingNumber || order.MaVanDon || "",
        estimatedDelivery:
          order.estimatedDelivery || order.NgayGiaoHangDuKien || "",
        notes: order.notes || order.GhiChu || "",
      });
    }
  }, [order, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.customer || !formData.email || !formData.status) {
      alert("⚠️ Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    setIsLoading(true);

    try {
      if (onSave) {
        await onSave({
          id: order.id || order.ID_DonHang,
          ...formData,
        });
        onClose();
      }
    } catch (error) {
      console.error("Error saving order:", error);
      alert(
        "❌ Lỗi khi cập nhật đơn hàng: " + (error.message || "Unknown error")
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Order status options for admin (full control)
  const statusOptions = [
    {
      value: "pending",
      label: "Chờ xử lý",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      value: "confirmed",
      label: "Đã xác nhận",
      color: "bg-blue-100 text-blue-800",
    },
    {
      value: "processing",
      label: "Đang chuẩn bị",
      color: "bg-purple-100 text-purple-800",
    },
    {
      value: "shipping",
      label: "Đang giao hàng",
      color: "bg-orange-100 text-orange-800",
    },
    {
      value: "delivered",
      label: "Đã giao hàng",
      color: "bg-green-100 text-green-800",
    },
    { value: "cancelled", label: "Đã hủy", color: "bg-red-100 text-red-800" },
  ];

  // Payment status options
  const paymentOptions = [
    {
      value: "pending",
      label: "Chờ thanh toán",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      value: "paid",
      label: "Đã thanh toán",
      color: "bg-green-100 text-green-800",
    },
    { value: "failed", label: "Thất bại", color: "bg-red-100 text-red-800" },
    {
      value: "refunded",
      label: "Đã hoàn tiền",
      color: "bg-gray-100 text-gray-800",
    },
  ];

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full h-[90vh] flex flex-col">
        {/* Header - Compact */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 text-white px-6 py-4 rounded-t-3xl flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <FontAwesomeIcon icon={["fas", "crown"]} className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  Quản lý đơn hàng #{order.id || order.ID_DonHang}
                </h2>
                <p className="text-white/90 text-xs">
                  Toàn quyền chỉnh sửa đơn hàng
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
            >
              <FontAwesomeIcon icon={["fas", "times"]} className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Form Content - Scrollable */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-4">
            {/* Order Basic Info - Compact */}
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FontAwesomeIcon
                  icon={["fas", "info-circle"]}
                  className="text-blue-500 w-4 h-4"
                />
                Thông tin cơ bản
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Mã đơn:</span>
                  <p className="text-gray-900 font-mono">
                    #{order.id || order.ID_DonHang}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Ngày tạo:</span>
                  <p className="text-gray-900">
                    {order.createdAt || order.ThoiGianTao
                      ? new Date(
                          order.createdAt || order.ThoiGianTao
                        ).toLocaleDateString("vi-VN")
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">
                    Trạng thái hiện tại:
                  </span>
                  <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {formData.status}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Thanh toán:</span>
                  <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {formData.paymentStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Editable Fields - Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Customer & Order Info */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Thông tin khách hàng & đơn hàng
                </h4>

                {/* Customer Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FontAwesomeIcon
                      icon={["fas", "user"]}
                      className="mr-2 text-blue-500 w-4 h-4"
                    />
                    Tên khách hàng *
                  </label>
                  <input
                    type="text"
                    name="customer"
                    value={formData.customer}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                    placeholder="Nhập tên khách hàng..."
                    required
                  />
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FontAwesomeIcon
                        icon={["fas", "envelope"]}
                        className="mr-2 text-blue-500 w-4 h-4"
                      />
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                      placeholder="email@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FontAwesomeIcon
                        icon={["fas", "phone"]}
                        className="mr-2 text-blue-500 w-4 h-4"
                      />
                      Điện thoại
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                      placeholder="0123456789"
                    />
                  </div>
                </div>

                {/* Total & Seller */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FontAwesomeIcon
                        icon={["fas", "money-bill"]}
                        className="mr-2 text-blue-500 w-4 h-4"
                      />
                      Tổng tiền (VNĐ)
                    </label>
                    <input
                      type="number"
                      name="total"
                      value={formData.total}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FontAwesomeIcon
                        icon={["fas", "store"]}
                        className="mr-2 text-blue-500 w-4 h-4"
                      />
                      Người bán
                    </label>
                    <input
                      type="text"
                      name="seller"
                      value={formData.seller}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                      placeholder="Tên shop/seller..."
                    />
                  </div>
                </div>

                {/* Status Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FontAwesomeIcon
                      icon={["fas", "flag"]}
                      className="mr-2 text-blue-500 w-4 h-4"
                    />
                    Trạng thái đơn hàng *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {statusOptions.map((option) => (
                      <label
                        key={option.value}
                        className="relative cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="status"
                          value={option.value}
                          checked={formData.status === option.value}
                          onChange={handleInputChange}
                          className="sr-only peer"
                        />
                        <div
                          className={`
                          px-3 py-2 rounded-lg border-2 transition-all text-center
                          peer-checked:border-blue-500 peer-checked:bg-blue-50
                          hover:border-gray-300 border-gray-200
                          ${
                            formData.status === option.value
                              ? "ring-1 ring-blue-200"
                              : ""
                          }
                        `}
                        >
                          <div
                            className={`inline-flex px-2 py-1 rounded text-xs font-medium ${option.color}`}
                          >
                            {option.label}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Payment Status */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FontAwesomeIcon
                      icon={["fas", "credit-card"]}
                      className="mr-2 text-blue-500 w-4 h-4"
                    />
                    Trạng thái thanh toán
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {paymentOptions.map((option) => (
                      <label
                        key={option.value}
                        className="relative cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="paymentStatus"
                          value={option.value}
                          checked={formData.paymentStatus === option.value}
                          onChange={handleInputChange}
                          className="sr-only peer"
                        />
                        <div
                          className={`
                          px-3 py-2 rounded-lg border-2 transition-all text-center
                          peer-checked:border-blue-500 peer-checked:bg-blue-50
                          hover:border-gray-300 border-gray-200
                          ${
                            formData.paymentStatus === option.value
                              ? "ring-1 ring-blue-200"
                              : ""
                          }
                        `}
                        >
                          <div
                            className={`inline-flex px-2 py-1 rounded text-xs font-medium ${option.color}`}
                          >
                            {option.label}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Shipping & Additional Info */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Thông tin giao hàng & bổ sung
                </h4>

                {/* Shipping Address */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FontAwesomeIcon
                      icon={["fas", "map-marker-alt"]}
                      className="mr-2 text-blue-500 w-4 h-4"
                    />
                    Địa chỉ giao hàng
                  </label>
                  <textarea
                    name="shippingAddress"
                    value={formData.shippingAddress}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-sm"
                    placeholder="Địa chỉ giao hàng chi tiết..."
                  />
                </div>

                {/* Tracking & Delivery */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FontAwesomeIcon
                        icon={["fas", "truck"]}
                        className="mr-2 text-blue-500 w-4 h-4"
                      />
                      Mã vận đơn
                    </label>
                    <input
                      type="text"
                      name="trackingNumber"
                      value={formData.trackingNumber}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                      placeholder="VD: VN123456789"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FontAwesomeIcon
                        icon={["fas", "calendar-check"]}
                        className="mr-2 text-blue-500 w-4 h-4"
                      />
                      Ngày giao dự kiến
                    </label>
                    <input
                      type="date"
                      name="estimatedDelivery"
                      value={formData.estimatedDelivery}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                    />
                  </div>
                </div>

                {/* Admin Notes */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FontAwesomeIcon
                      icon={["fas", "sticky-note"]}
                      className="mr-2 text-blue-500 w-4 h-4"
                    />
                    Ghi chú quản trị
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-sm"
                    placeholder="Ghi chú của admin về đơn hàng này..."
                  />
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Action Buttons - Fixed Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-3xl flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 rounded-lg font-medium transition-colors border border-gray-300"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={isLoading}
            onClick={handleSubmit}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg text-white rounded-lg font-medium transition-all transform hover:scale-105 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Đang lưu...</span>
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={["fas", "save"]} className="w-4 h-4" />
                <span>Lưu thay đổi</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderEditModal;
