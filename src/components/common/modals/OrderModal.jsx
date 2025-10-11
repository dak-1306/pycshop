import React, { useState, useEffect } from "react";

const OrderModal = ({
  isOpen,
  onClose,
  order,
  variant = "admin", // "admin" | "seller"
  modalMode = "view", // "view" | "edit" | "add"
  onUpdateStatus,
  onViewDetails,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    customer: "",
    email: "",
    total: "",
    items: "",
    status: "pending",
    paymentStatus: "pending",
    seller: "",
  });

  // Populate form when order changes or modal opens in edit mode
  useEffect(() => {
    if (order && (modalMode === "edit" || modalMode === "add")) {
      setFormData({
        customer: order.customer || order.customerName || "",
        email: order.email || order.customerEmail || "",
        total: order.total || order.totalAmount || "",
        items: order.items || order.productName || "",
        status: order.status || "pending",
        paymentStatus: order.paymentStatus || "pending",
        seller: order.seller || order.sellerName || "",
      });
    }
  }, [order, modalMode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) {
      onSave(formData);
    }
    onClose();
  };

  // Colors and gradients based on variant
  const colors =
    variant === "admin"
      ? {
          headerGradient: "from-blue-600 via-blue-700 to-indigo-600",
          accentColor: "blue",
          headerIcon: "👑",
          statusColor: "blue",
        }
      : {
          headerGradient: "from-orange-500 via-orange-600 to-red-500",
          accentColor: "orange",
          headerIcon: "🛍️",
          statusColor: "orange",
        };

  // Status color mapping
  const getStatusColor = (status) => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      processing: "bg-blue-100 text-blue-800 border-blue-200",
      shipping: "bg-purple-100 text-purple-800 border-purple-200",
      delivered: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
      returned: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return statusColors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  // Status options based on variant
  const getStatusOptions = () => {
    if (variant === "admin") {
      return [
        { value: "pending", label: "Chờ xử lý", icon: "⏳" },
        { value: "processing", label: "Đang xử lý", icon: "🔄" },
        { value: "shipping", label: "Đang giao", icon: "🚛" },
        { value: "delivered", label: "Đã giao", icon: "✅" },
        { value: "cancelled", label: "Đã hủy", icon: "❌" },
        { value: "returned", label: "Trả hàng", icon: "↩️" },
      ];
    } else {
      // Seller has limited status options
      return [
        { value: "pending", label: "Chờ xử lý", icon: "⏳" },
        { value: "processing", label: "Đang chuẩn bị", icon: "📦" },
        { value: "shipping", label: "Đã giao shipper", icon: "🚛" },
        { value: "delivered", label: "Hoàn thành", icon: "✅" },
        { value: "cancelled", label: "Hủy đơn", icon: "❌" },
      ];
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  // Check if modal should be shown
  if (!isOpen) return null;

  // If in edit mode, show edit form
  if (modalMode === "edit" || modalMode === "add") {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all animate-slideUp">
          {/* Header */}
          <div
            className={`relative bg-gradient-to-r ${colors.headerGradient} text-white px-8 py-6 rounded-t-2xl flex-shrink-0`}
          >
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">
                    {modalMode === "edit" ? "✏️" : "➕"}
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold">
                    {modalMode === "edit"
                      ? `Chỉnh sửa đơn hàng #${order?.id}`
                      : "Thêm đơn hàng mới"}
                  </h2>
                  <p className="text-white text-opacity-90 text-sm mt-1">
                    {modalMode === "edit"
                      ? "Cập nhật thông tin đơn hàng"
                      : "Tạo đơn hàng mới"}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl flex items-center justify-center transition-all hover:scale-110"
              >
                <span className="text-xl">✕</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Customer Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tên khách hàng *
                </label>
                <input
                  type="text"
                  name="customer"
                  value={formData.customer}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Nhập tên khách hàng"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Nhập email khách hàng"
                  required
                />
              </div>
            </div>

            {/* Order Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tổng tiền (VNĐ) *
                </label>
                <input
                  type="number"
                  name="total"
                  value={formData.total}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Nhập tổng tiền"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Sản phẩm
                </label>
                <input
                  type="text"
                  name="items"
                  value={formData.items}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Mô tả sản phẩm"
                />
              </div>
            </div>

            {/* Seller */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Người bán
              </label>
              <input
                type="text"
                name="seller"
                value={formData.seller}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Nhập tên người bán"
              />
            </div>

            {/* Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Trạng thái đơn hàng
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  {getStatusOptions().map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.icon} {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Trạng thái thanh toán
                </label>
                <select
                  name="paymentStatus"
                  value={formData.paymentStatus}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="pending">⏳ Chờ thanh toán</option>
                  <option value="paid">💰 Đã thanh toán</option>
                  <option value="failed">❌ Thất bại</option>
                </select>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all font-medium shadow-sm hover:shadow-md"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                💾 {modalMode === "edit" ? "Lưu thay đổi" : "Tạo đơn hàng"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // View mode - existing code
  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col transform transition-all animate-slideUp">
        {/* Header */}
        <div
          className={`relative bg-gradient-to-r ${colors.headerGradient} text-white px-8 py-6 rounded-t-2xl flex-shrink-0`}
        >
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">{colors.headerIcon}</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  Chi tiết đơn hàng #{order.id}
                </h2>
                <p className="text-white text-opacity-90 text-sm mt-1">
                  {variant === "admin"
                    ? `Quản lý đơn hàng - ${formatDate(order.createdAt)}`
                    : `Đơn hàng của bạn - ${formatDate(order.createdAt)}`}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg flex items-center justify-center transition-all transform hover:rotate-90"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-8 bg-gradient-to-br from-gray-50 to-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Order Info */}
            <div className="space-y-6">
              {/* Order Status */}
              <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-blue-500">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-500 text-white rounded-md flex items-center justify-center text-xs">
                    📊
                  </span>
                  Trạng thái đơn hàng
                </h3>

                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {
                      getStatusOptions().find((s) => s.value === order.status)
                        ?.icon
                    }{" "}
                    {
                      getStatusOptions().find((s) => s.value === order.status)
                        ?.label
                    }
                  </span>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Tổng tiền</div>
                    <div className="text-xl font-bold text-green-600">
                      {formatCurrency(order.total)}
                    </div>
                  </div>
                </div>

                {/* Status Update */}
                <div className="border-t pt-4">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Cập nhật trạng thái
                  </label>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      onUpdateStatus && onUpdateStatus(order.id, e.target.value)
                    }
                    className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-${colors.accentColor}-500 focus:ring-2 focus:ring-${colors.accentColor}-200 transition-all`}
                  >
                    {getStatusOptions().map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.icon} {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Customer/Seller Info */}
              <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-green-500">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-green-500 text-white rounded-md flex items-center justify-center text-xs">
                    👤
                  </span>
                  {variant === "admin"
                    ? "Thông tin khách hàng & Shop"
                    : "Thông tin khách hàng"}
                </h3>

                <div className="space-y-4">
                  {/* Customer Info */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <span className="text-blue-600">👤</span> Khách hàng
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Tên:</span>{" "}
                        {order.customerName}
                      </div>
                      <div>
                        <span className="font-medium">Email:</span>{" "}
                        {order.customerEmail}
                      </div>
                      <div>
                        <span className="font-medium">SĐT:</span>{" "}
                        {order.customerPhone}
                      </div>
                    </div>
                  </div>

                  {/* Seller Info (Admin only) */}
                  {variant === "admin" && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <span className="text-orange-600">🏪</span> Shop bán
                        hàng
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium">Shop:</span>{" "}
                          {order.sellerName}
                        </div>
                        <div>
                          <span className="font-medium">Email:</span>{" "}
                          {order.sellerEmail}
                        </div>
                        <div>
                          <span className="font-medium">SĐT:</span>{" "}
                          {order.sellerPhone}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-purple-500">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-purple-500 text-white rounded-md flex items-center justify-center text-xs">
                    📍
                  </span>
                  Địa chỉ giao hàng
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm space-y-1">
                    <div className="font-medium">
                      {order.shippingAddress?.name}
                    </div>
                    <div>{order.shippingAddress?.phone}</div>
                    <div className="text-gray-600">
                      {order.shippingAddress?.address},{" "}
                      {order.shippingAddress?.district},{" "}
                      {order.shippingAddress?.city}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Products */}
            <div className="space-y-6">
              {/* Order Items */}
              <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-orange-500">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-orange-500 text-white rounded-md flex items-center justify-center text-xs">
                    📦
                  </span>
                  Sản phẩm ({order.items?.length || 0} mặt hàng)
                </h3>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {order.items?.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <img
                        src={item.image || "/placeholder-product.jpg"}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg border-2 border-gray-200"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 line-clamp-2">
                          {item.name}
                        </h4>
                        <div className="flex items-center justify-between mt-2">
                          <div className="text-sm text-gray-600">
                            Số lượng:{" "}
                            <span className="font-medium">{item.quantity}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-500 line-through">
                              {formatCurrency(item.originalPrice)}
                            </div>
                            <div className="font-bold text-green-600">
                              {formatCurrency(item.price)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-indigo-500">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-indigo-500 text-white rounded-md flex items-center justify-center text-xs">
                    💰
                  </span>
                  Tổng kết đơn hàng
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Tạm tính:</span>
                    <span>{formatCurrency(order.subtotal || order.total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phí vận chuyển:</span>
                    <span>{formatCurrency(order.shippingFee || 0)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>Giảm giá:</span>
                      <span>-{formatCurrency(order.discount)}</span>
                    </div>
                  )}
                  <hr className="my-2" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Tổng cộng:</span>
                    <span className="text-green-600">
                      {formatCurrency(order.total)}
                    </span>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      Phương thức thanh toán:
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.paymentMethod === "cash"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {order.paymentMethod === "cash"
                        ? "💵 Tiền mặt"
                        : "💳 Chuyển khoản"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm font-medium">
                      Trạng thái thanh toán:
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.paymentStatus === "paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {order.paymentStatus === "paid"
                        ? "✅ Đã thanh toán"
                        : "❌ Chưa thanh toán"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Timeline */}
              <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-teal-500">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-teal-500 text-white rounded-md flex items-center justify-center text-xs">
                    ⏰
                  </span>
                  Lịch sử đơn hàng
                </h3>

                <div className="space-y-3">
                  {order.timeline?.map((event, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-teal-600 text-xs">
                          {event.icon}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-800">
                          {event.action}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDate(event.timestamp)}
                        </div>
                        {event.note && (
                          <div className="text-xs text-gray-600 mt-1">
                            {event.note}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-gray-100 to-gray-50 px-8 py-6 rounded-b-2xl flex justify-between items-center border-t border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-4">
            {variant === "admin" && (
              <button
                onClick={() => onViewDetails && onViewDetails(order)}
                className="px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-xl transition-all font-medium shadow-sm hover:shadow-md transform hover:scale-105 flex items-center gap-2"
              >
                <span>🔍</span> Xem chi tiết
              </button>
            )}
          </div>

          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="px-8 py-3 text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all font-medium shadow-sm hover:shadow-md transform hover:scale-105 flex items-center gap-2"
            >
              <span>❌</span> Đóng
            </button>

            {variant === "seller" && (
              <button
                onClick={() =>
                  onUpdateStatus && onUpdateStatus(order.id, "processing")
                }
                className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-0.5 flex items-center gap-2"
              >
                <span>📦</span> Xác nhận đơn
              </button>
            )}

            {variant === "admin" && (
              <button
                onClick={() =>
                  onUpdateStatus && onUpdateStatus(order.id, "approved")
                }
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-0.5 flex items-center gap-2"
              >
                <span>✅</span> Duyệt đơn
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
