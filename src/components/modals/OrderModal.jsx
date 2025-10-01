import React from "react";

const OrderModal = ({
  isOpen,
  onClose,
  mode, // 'add' or 'edit'
  order,
  onOrderChange,
  onSave,
  categories,
  orderStatuses = ["Đang xử lý", "Đang giao", "Hoàn tất", "Đã hủy"],
}) => {
  if (!isOpen) return null;

  const isEditMode = mode === "edit";
  const modalTitle = isEditMode ? "Chỉnh sửa đơn hàng" : "Thêm đơn hàng mới";
  const headerGradient = "from-blue-500 via-blue-600 to-indigo-500";
  const buttonGradient =
    "from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[85vh] flex flex-col transform transition-all animate-slideUp">
        {/* Header */}
        <div
          className={`relative bg-gradient-to-r ${headerGradient} text-white px-6 py-4 rounded-t-2xl flex-shrink-0`}
        >
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <span className="text-xl">📋</span>
              </div>
              <div>
                <h2 className="text-xl font-bold">{modalTitle}</h2>
                <p className="text-blue-100 text-xs">
                  {isEditMode
                    ? `Cập nhật đơn hàng #${order?.id}`
                    : "Điền thông tin đơn hàng và khách hàng"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg flex items-center justify-center transition-all transform hover:rotate-90"
            >
              <svg
                className="w-4 h-4"
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

        {/* Body - 2 Column Layout */}
        <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-gray-50 to-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Product Info */}
            <div className="space-y-5">
              <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-blue-500">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-500 text-white rounded-md flex items-center justify-center text-xs">
                    📦
                  </span>
                  Thông tin sản phẩm
                </h3>

                {/* Product fields */}
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
                      <span className="w-5 h-5 bg-orange-500 text-white rounded text-xs flex items-center justify-center">
                        🏷️
                      </span>
                      Tên sản phẩm *
                    </label>
                    <input
                      type="text"
                      value={order?.productName || ""}
                      onChange={(e) =>
                        onOrderChange({ ...order, productName: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      placeholder="VD: iPhone 15 Pro Max 256GB"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
                        <span className="w-5 h-5 bg-green-500 text-white rounded text-xs flex items-center justify-center">
                          💰
                        </span>
                        Giá (₫) *
                      </label>
                      <input
                        type="number"
                        value={order?.price || ""}
                        onChange={(e) =>
                          onOrderChange({ ...order, price: e.target.value })
                        }
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
                        <span className="w-5 h-5 bg-purple-500 text-white rounded text-xs flex items-center justify-center">
                          📊
                        </span>
                        Số lượng *
                      </label>
                      <input
                        type="number"
                        value={order?.quantity || ""}
                        onChange={(e) =>
                          onOrderChange({ ...order, quantity: e.target.value })
                        }
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                        placeholder="1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
                        <span className="w-5 h-5 bg-indigo-500 text-white rounded text-xs flex items-center justify-center">
                          📂
                        </span>
                        Danh mục
                      </label>
                      <select
                        value={order?.category || ""}
                        onChange={(e) =>
                          onOrderChange({ ...order, category: e.target.value })
                        }
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                      >
                        <option value="">Chọn danh mục...</option>
                        {categories
                          ?.filter((cat) => cat !== "Tất cả")
                          .map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
                        <span className="w-5 h-5 bg-pink-500 text-white rounded text-xs flex items-center justify-center">
                          🏷️
                        </span>
                        Trạng thái
                      </label>
                      <select
                        value={order?.status || ""}
                        onChange={(e) =>
                          onOrderChange({ ...order, status: e.target.value })
                        }
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all"
                      >
                        {orderStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Customer Info */}
            <div className="space-y-5">
              <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-emerald-500">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-emerald-500 text-white rounded-md flex items-center justify-center text-xs">
                    👤
                  </span>
                  Thông tin khách hàng
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
                      <span className="w-5 h-5 bg-cyan-500 text-white rounded text-xs flex items-center justify-center">
                        👤
                      </span>
                      Họ và tên *
                    </label>
                    <input
                      type="text"
                      value={order?.customerName || ""}
                      onChange={(e) =>
                        onOrderChange({
                          ...order,
                          customerName: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all"
                      placeholder="VD: Nguyễn Văn A"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
                      <span className="w-5 h-5 bg-teal-500 text-white rounded text-xs flex items-center justify-center">
                        📞
                      </span>
                      Số điện thoại *
                    </label>
                    <input
                      type="tel"
                      value={order?.customerPhone || ""}
                      onChange={(e) =>
                        onOrderChange({
                          ...order,
                          customerPhone: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all"
                      placeholder="VD: 0123456789"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
                      <span className="w-5 h-5 bg-amber-500 text-white rounded text-xs flex items-center justify-center">
                        📍
                      </span>
                      Địa chỉ giao hàng
                    </label>
                    <textarea
                      value={order?.address || ""}
                      onChange={(e) =>
                        onOrderChange({ ...order, address: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all resize-none"
                      placeholder="VD: 123 Đường ABC, Phường XYZ, Quận 1, TP.HCM"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Order Tips */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
                  <span className="text-blue-600">💡</span>
                  {isEditMode ? "Lưu ý cập nhật" : "Mẹo tạo đơn hàng"}
                </h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  {isEditMode ? (
                    <>
                      <li>• Kiểm tra lại thông tin trước khi lưu</li>
                      <li>• Thay đổi trạng thái phù hợp với tiến độ</li>
                      <li>• Cập nhật thông tin giao hàng chính xác</li>
                      <li>• Thông báo khách hàng khi có thay đổi</li>
                    </>
                  ) : (
                    <>
                      <li>• Xác minh thông tin khách hàng trước khi lưu</li>
                      <li>• Kiểm tra tồn kho trước khi tạo đơn</li>
                      <li>• Ghi chú địa chỉ giao hàng chi tiết</li>
                      <li>• Liên hệ khách hàng xác nhận đơn hàng</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-gray-100 to-gray-50 px-6 py-4 rounded-b-2xl flex justify-end gap-3 border-t border-gray-200 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all font-medium shadow-sm hover:shadow-md transform hover:scale-105 flex items-center gap-2"
          >
            <span>❌</span> Hủy bỏ
          </button>
          <button
            onClick={onSave}
            className={`relative px-8 py-2.5 bg-gradient-to-r ${buttonGradient} text-white rounded-xl transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-0.5 flex items-center gap-2 overflow-hidden`}
          >
            <span>{isEditMode ? "💾" : "🚀"}</span>
            {isEditMode ? "Lưu thay đổi" : "Thêm đơn hàng"}
            <div className="absolute inset-0 bg-white opacity-0 hover:opacity-20 transition-opacity"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
