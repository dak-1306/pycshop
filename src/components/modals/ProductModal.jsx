import React from "react";

const ProductModal = ({
  isOpen,
  onClose,
  mode, // 'add' or 'edit'
  product,
  onProductChange,
  onSave,
  categories,
}) => {
  if (!isOpen) return null;

  const isEditMode = mode === "edit";
  const modalTitle = isEditMode ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới";
  const modalSubtitle = isEditMode
    ? `Cập nhật thông tin sản phẩm: ${product.name}`
    : "Điền thông tin chi tiết sản phẩm";
  const headerGradient = isEditMode
    ? "from-blue-500 via-blue-600 to-indigo-500"
    : "from-orange-500 via-orange-600 to-red-500";
  const buttonGradient = isEditMode
    ? "from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
    : "from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600";
  const headerIcon = isEditMode ? "✏️" : "📦";
  const buttonIcon = isEditMode ? "💾" : "🚀";
  const buttonText = isEditMode ? "Lưu thay đổi" : "Thêm sản phẩm";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] flex flex-col transform transition-all animate-slideUp">
        {/* Modal Header */}
        <div
          className={`relative bg-gradient-to-r ${headerGradient} text-white px-6 py-4 rounded-t-2xl flex-shrink-0`}
        >
          <div className="absolute inset-0 bg-white opacity-10 rounded-t-2xl"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white border-opacity-30">
                <span className="text-xl">{headerIcon}</span>
              </div>
              <div>
                <h2 className="text-xl font-bold">{modalTitle}</h2>
                <p
                  className={`text-xs ${
                    isEditMode ? "text-blue-100" : "text-orange-100"
                  }`}
                >
                  {modalSubtitle}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg flex items-center justify-center transition-all transform hover:rotate-90 hover:scale-110"
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

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-gray-50 to-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-5">
              {/* Product Name */}
              <div className="group">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
                  <span className="w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-md flex items-center justify-center">
                    <span className="text-white text-xs">🏷️</span>
                  </span>
                  Tên sản phẩm *
                </label>
                <input
                  type="text"
                  value={product.name || ""}
                  onChange={(e) =>
                    onProductChange({ ...product, name: e.target.value })
                  }
                  className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 transition-all bg-white shadow-sm font-medium text-gray-800 ${
                    isEditMode
                      ? "focus:border-blue-500 focus:ring-blue-200"
                      : "focus:border-orange-500 focus:ring-orange-200"
                  }`}
                  placeholder="VD: iPhone 15 Pro Max 256GB"
                />
              </div>

              {/* Price and Quantity Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
                    <span className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-md flex items-center justify-center">
                      <span className="text-white text-xs">💰</span>
                    </span>
                    Giá bán (₫) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={product.price || ""}
                      onChange={(e) =>
                        onProductChange({ ...product, price: e.target.value })
                      }
                      className="w-full px-4 py-3 pr-8 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all bg-white shadow-sm font-medium text-gray-800"
                      placeholder="0"
                      min="0"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm font-medium">
                      ₫
                    </div>
                  </div>
                </div>

                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
                    <span className="w-6 h-6 bg-gradient-to-r from-purple-500 to-purple-600 rounded-md flex items-center justify-center">
                      <span className="text-white text-xs">📊</span>
                    </span>
                    Số lượng *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={product.quantity || ""}
                      onChange={(e) =>
                        onProductChange({
                          ...product,
                          quantity: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 pr-8 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all bg-white shadow-sm font-medium text-gray-800"
                      placeholder="0"
                      min="0"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm font-medium">
                      sp
                    </div>
                  </div>
                </div>
              </div>

              {/* Category */}
              <div className="group">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
                  <span className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-md flex items-center justify-center">
                    <span className="text-white text-xs">📂</span>
                  </span>
                  Danh mục sản phẩm *
                </label>
                <div className="relative">
                  <select
                    value={product.category || ""}
                    onChange={(e) =>
                      onProductChange({ ...product, category: e.target.value })
                    }
                    className="w-full px-4 py-3 pr-10 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all bg-white shadow-sm font-medium text-gray-800 appearance-none"
                  >
                    <option value="" disabled>
                      Chọn danh mục...
                    </option>
                    {categories
                      .filter((cat) => cat !== "Tất cả")
                      .map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Image Upload */}
            <div className="space-y-5">
              <div className="group">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
                  <span className="w-6 h-6 bg-gradient-to-r from-pink-500 to-rose-600 rounded-md flex items-center justify-center">
                    <span className="text-white text-xs">🖼️</span>
                  </span>
                  Hình ảnh sản phẩm
                  <span className="text-gray-500 font-normal text-xs">
                    (tùy chọn)
                  </span>
                </label>
                <div className="relative h-48">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl h-full flex flex-col items-center justify-center text-center hover:border-pink-400 hover:bg-pink-50 transition-all cursor-pointer bg-gradient-to-br from-gray-50 to-white">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt="Product"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <>
                        <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl flex items-center justify-center mb-3">
                          <svg
                            className="w-6 h-6 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                        </div>
                        <p className="text-sm font-semibold text-gray-700">
                          {isEditMode
                            ? "Cập nhật hình ảnh"
                            : "Tải lên hình ảnh"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Kéo thả hoặc{" "}
                          <span className="text-pink-600 font-medium">
                            nhấp để chọn
                          </span>
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          PNG, JPG, GIF • Max 10MB
                        </p>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div
                className={`bg-gradient-to-r ${
                  isEditMode
                    ? "from-blue-50 to-indigo-50 border-blue-200"
                    : "from-blue-50 to-indigo-50 border-blue-200"
                } border rounded-xl p-4`}
              >
                <h4
                  className={`text-sm font-semibold ${
                    isEditMode ? "text-blue-800" : "text-blue-800"
                  } mb-2 flex items-center gap-2`}
                >
                  <span
                    className={`${
                      isEditMode ? "text-blue-600" : "text-blue-600"
                    }`}
                  >
                    {isEditMode ? "📝" : "💡"}
                  </span>
                  {isEditMode ? "Lưu ý cập nhật" : "Mẹo nhỏ"}
                </h4>
                <ul
                  className={`text-xs ${
                    isEditMode ? "text-blue-700" : "text-blue-700"
                  } space-y-1`}
                >
                  {isEditMode ? (
                    <>
                      <li>• Kiểm tra lại thông tin trước khi lưu</li>
                      <li>• Giá và số lượng phải chính xác</li>
                      <li>• Trạng thái tự động cập nhật theo số lượng</li>
                      <li>• Thay đổi sẽ ảnh hưởng đến đơn hàng hiện tại</li>
                    </>
                  ) : (
                    <>
                      <li>• Tên sản phẩm nên rõ ràng, dễ hiểu</li>
                      <li>• Giá bán phải chính xác</li>
                      <li>• Hình ảnh chất lượng cao tăng lượt mua</li>
                      <li>• Phân loại đúng danh mục</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-gradient-to-r from-gray-100 to-gray-50 px-6 py-4 rounded-b-2xl flex justify-end gap-3 border-t border-gray-200 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-medium shadow-sm hover:shadow-md transform hover:scale-105 flex items-center gap-2"
          >
            <span>❌</span> Hủy bỏ
          </button>
          <button
            onClick={onSave}
            className={`relative px-8 py-2.5 bg-gradient-to-r ${buttonGradient} text-white rounded-xl transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-0.5 flex items-center gap-2 overflow-hidden`}
          >
            <span>{buttonIcon}</span> {buttonText}
            <div className="absolute inset-0 bg-white opacity-0 hover:opacity-20 transition-opacity"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
