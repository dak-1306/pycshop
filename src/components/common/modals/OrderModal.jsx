import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
          headerIcon: (
            <FontAwesomeIcon icon={["fas", "crown"]} className="w-6 h-6" />
          ),
          statusColor: "blue",
        }
      : {
          headerGradient: "from-orange-500 via-orange-600 to-red-500",
          accentColor: "orange",
          headerIcon: (
            <FontAwesomeIcon icon={["fas", "store"]} className="w-6 h-6" />
          ),
          statusColor: "orange",
        };

  // Status color mapping
  const getStatusColor = (status) => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      processing: "bg-info bg-opacity-10 text-info border-info",
      shipping: "bg-purple-100 text-purple-800 border-purple-200",
      delivered: "bg-success text-white border-success",
      cancelled: "bg-red-100 text-red-800 border-red-200",
      returned: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return statusColors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  // Status options based on variant
  const getStatusOptions = () => {
    if (variant === "admin") {
      return [
        {
          value: "pending",
          label: "Chờ xử lý",
          icon: <FontAwesomeIcon icon={["fas", "hourglass"]} />,
        },
        {
          value: "processing",
          label: "Đang xử lý",
          icon: <FontAwesomeIcon icon={["fas", "sync"]} />,
        },
        {
          value: "shipping",
          label: "Đang giao",
          icon: <FontAwesomeIcon icon={["fas", "truck"]} />,
        },
        {
          value: "delivered",
          label: "Đã giao",
          icon: <FontAwesomeIcon icon={["fas", "check"]} />,
        },
        {
          value: "cancelled",
          label: "Đã hủy",
          icon: <FontAwesomeIcon icon={["fas", "times"]} />,
        },
        {
          value: "returned",
          label: "Trả hàng",
          icon: <FontAwesomeIcon icon={["fas", "undo"]} />,
        },
      ];
    } else {
      // Seller has limited status options
      return [
        {
          value: "pending",
          label: "Chờ xử lý",
          icon: <FontAwesomeIcon icon={["fas", "hourglass"]} />,
        },
        {
          value: "processing",
          label: "Đang chuẩn bị",
          icon: <FontAwesomeIcon icon={["fas", "box-open"]} />,
        },
        {
          value: "shipping",
          label: "Đã giao shipper",
          icon: <FontAwesomeIcon icon={["fas", "truck"]} />,
        },
        {
          value: "delivered",
          label: "Hoàn thành",
          icon: <FontAwesomeIcon icon={["fas", "check"]} />,
        },
        {
          value: "cancelled",
          label: "Hủy đơn",
          icon: <FontAwesomeIcon icon={["fas", "times"]} />,
        },
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
                    {modalMode === "edit" ? (
                      <FontAwesomeIcon icon={["fas", "pencil-alt"]} />
                    ) : (
                      <FontAwesomeIcon icon={["fas", "plus"]} />
                    )}
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
                  <option value="pending">
                    <FontAwesomeIcon icon={["fas", "hourglass"]} /> Chờ thanh
                    toán
                  </option>
                  <option value="paid">
                    <FontAwesomeIcon icon={["fas", "money-bill-wave"]} /> Đã
                    thanh toán
                  </option>
                  <option value="failed">
                    <FontAwesomeIcon icon={["fas", "times-circle"]} /> Thất bại
                  </option>
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
                <FontAwesomeIcon icon={["fas", "save"]} />{" "}
                {modalMode === "edit" ? "Lưu thay đổi" : "Tạo đơn hàng"}
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
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full h-[85vh] flex flex-col overflow-hidden">
        {/* Compact Header */}
        <div
          className={`bg-gradient-to-r ${colors.headerGradient} text-white px-6 py-4 rounded-t-2xl flex-shrink-0`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                {colors.headerIcon}
              </div>
              <div>
                <h2 className="text-xl font-bold">Đơn hàng #{order.id}</h2>
                <p className="text-white text-opacity-80 text-sm">
                  {variant === "admin"
                    ? "Quản lý đơn hàng"
                    : "Chi tiết đơn hàng"}{" "}
                  • {formatDate(order.createdAt)}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg flex items-center justify-center transition-all"
            >
              <FontAwesomeIcon icon={["fas", "times"]} />
            </button>
          </div>
        </div>

        {/* Optimized Content Layout */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            {/* Left Column - Order Info */}
            <div className="space-y-6">
              {/* Order Status */}
              <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-blue-500">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={["fas", "info-circle"]}
                    className="w-6 h-6 text-blue-500"
                  />
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
                    <div className="text-xl font-bold text-success">
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
                  <FontAwesomeIcon
                    icon={["fas", "users"]}
                    className="w-6 h-6 text-green-500"
                  />
                  {variant === "admin"
                    ? "Thông tin khách hàng & Shop"
                    : "Thông tin khách hàng"}
                </h3>

                <div className="space-y-4">
                  {/* Customer Info */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <FontAwesomeIcon
                        icon={["fas", "user"]}
                        className="w-6 h-6 text-info"
                      />
                      Khách hàng
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
                        <FontAwesomeIcon
                          icon={["fas", "store"]}
                          className="w-6 h-6 text-orange-600"
                        />
                        Shop bán hàng
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
                  <FontAwesomeIcon
                    icon={["fas", "map-marker-alt"]}
                    className="w-6 h-6 text-purple-500"
                  />
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
                  <FontAwesomeIcon
                    icon={["fas", "box"]}
                    className="w-6 h-6 bg-orange-500 text-white rounded-md flex items-center justify-center text-xs"
                  />
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
                            <div className="font-bold text-success">
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
                  <FontAwesomeIcon
                    icon={["fas", "money-bill-wave"]}
                    className="w-6 h-6 bg-indigo-500 text-white rounded-md flex items-center justify-center text-xs"
                  />
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
                    <span className="text-success">
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
                          : "bg-info bg-opacity-10 text-info"
                      }`}
                    >
                      {order.paymentMethod === "cash" ? (
                        <FontAwesomeIcon icon={["fas", "money-bill-wave"]} />
                      ) : (
                        <FontAwesomeIcon icon={["fas", "credit-card"]} />
                      )}
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
                      {order.paymentStatus === "paid" ? (
                        <FontAwesomeIcon icon={["fas", "check-circle"]} />
                      ) : (
                        <FontAwesomeIcon icon={["fas", "times-circle"]} />
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Timeline */}
              <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-teal-500">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={["fas", "stream"]}
                    className="w-6 h-6 bg-teal-500 text-white rounded-md flex items-center justify-center text-xs"
                  />
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

        {/* Compact Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-2xl flex justify-between items-center border-t border-gray-200 flex-shrink-0">
          <div className="text-sm text-gray-600 flex items-center gap-4">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                order.status
              )}`}
            >
              {getStatusOptions().find((s) => s.value === order.status)?.icon}{" "}
              {getStatusOptions().find((s) => s.value === order.status)?.label}
            </span>
            <span className="font-medium text-green-600">
              {formatCurrency(order.total)}
            </span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-medium"
            >
              Đóng
            </button>

            {variant === "seller" && (
              <button
                onClick={() =>
                  onUpdateStatus && onUpdateStatus(order.id, "processing")
                }
                className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
              >
                <FontAwesomeIcon icon={["fas", "box"]} /> Xác nhận
              </button>
            )}

            {variant === "admin" && (
              <button
                onClick={() =>
                  onUpdateStatus && onUpdateStatus(order.id, "approved")
                }
                className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-lg transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
              >
                <FontAwesomeIcon icon={["fas", "check-circle"]} /> Duyệt đơn
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
