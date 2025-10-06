import React from "react";

const ProductModal = ({
  isOpen,
  onClose,
  mode, // 'add' or 'edit'
  product,
  onProductChange,
  onSave,
  categories,
  variant = "seller", // "admin" | "seller"
  // Image handling functions from hook
  onImageUpload,
  onRemoveImage,
  onSetFeaturedImage,
}) => {
  if (!isOpen) return null;

  const isEditMode = mode === "edit";
  const modalTitle = isEditMode ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới";
  const modalSubtitle = isEditMode
    ? `Cập nhật thông tin sản phẩm: ${product?.name || ""}`
    : variant === "admin"
    ? "Thêm sản phẩm vào hệ thống (Admin)"
    : "Điền thông tin chi tiết sản phẩm";

  // Colors and gradients based on variant
  const colors =
    variant === "admin"
      ? {
          headerGradient: "from-blue-500 via-blue-600 to-indigo-500",
          buttonGradient:
            "from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600",
          headerIcon: "🔧",
          buttonIcon: isEditMode ? "💾" : "➕",
        }
      : {
          headerGradient: isEditMode
            ? "from-blue-500 via-blue-600 to-indigo-500"
            : "from-orange-500 via-orange-600 to-red-500",
          buttonGradient: isEditMode
            ? "from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
            : "from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600",
          headerIcon: isEditMode ? "✏️" : "📦",
          buttonIcon: isEditMode ? "💾" : "🚀",
        };

  const buttonText = isEditMode
    ? "Lưu thay đổi"
    : variant === "admin"
    ? "Thêm vào hệ thống"
    : "Thêm sản phẩm";

  // Use image upload function from hook
  const handleImageUpload = (files) => {
    if (onImageUpload) {
      onImageUpload(files);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] flex flex-col transform transition-all animate-slideUp">
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
                <h2 className="text-2xl font-bold">{modalTitle}</h2>
                <p className="text-white text-opacity-90 text-sm mt-1">
                  {modalSubtitle}
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

        {/* Body - 3 Column Layout for better organization */}
        <div className="flex-1 overflow-y-auto p-8 bg-gradient-to-br from-gray-50 to-white">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Column - Basic Info */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-blue-500">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-500 text-white rounded-md flex items-center justify-center text-xs">
                    ℹ️
                  </span>
                  Thông tin cơ bản
                </h3>

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
                      value={product?.name || ""}
                      onChange={(e) =>
                        onProductChange({ ...product, name: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      placeholder="VD: iPhone 15 Pro Max 256GB"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
                      <span className="w-5 h-5 bg-purple-500 text-white rounded text-xs flex items-center justify-center">
                        📝
                      </span>
                      Mô tả sản phẩm
                    </label>
                    <textarea
                      value={product?.description || ""}
                      onChange={(e) =>
                        onProductChange({
                          ...product,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all resize-none"
                      placeholder="Mô tả chi tiết về sản phẩm..."
                      rows={4}
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
                      <span className="w-5 h-5 bg-indigo-500 text-white rounded text-xs flex items-center justify-center">
                        📂
                      </span>
                      Danh mục *
                    </label>
                    <select
                      value={product?.category || ""}
                      onChange={(e) =>
                        onProductChange({
                          ...product,
                          category: e.target.value,
                        })
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

                  {/* Admin-specific fields */}
                  {variant === "admin" && (
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
                        <span className="w-5 h-5 bg-teal-500 text-white rounded text-xs flex items-center justify-center">
                          👤
                        </span>
                        Người bán *
                      </label>
                      <input
                        type="text"
                        value={product?.seller || ""}
                        onChange={(e) =>
                          onProductChange({
                            ...product,
                            seller: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all"
                        placeholder="Tên người bán hoặc shop"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Middle Column - Price & Inventory */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-green-500">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-green-500 text-white rounded-md flex items-center justify-center text-xs">
                    💰
                  </span>
                  Giá & Kho hàng
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
                      <span className="w-5 h-5 bg-green-500 text-white rounded text-xs flex items-center justify-center">
                        💰
                      </span>
                      Giá bán (₫) *
                    </label>
                    <input
                      type="number"
                      value={product?.price || ""}
                      onChange={(e) =>
                        onProductChange({ ...product, price: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
                      <span className="w-5 h-5 bg-yellow-500 text-white rounded text-xs flex items-center justify-center">
                        📦
                      </span>
                      Số lượng tồn kho *
                    </label>
                    <input
                      type="number"
                      value={product?.stock || ""}
                      onChange={(e) =>
                        onProductChange({ ...product, stock: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
                      <span className="w-5 h-5 bg-pink-500 text-white rounded text-xs flex items-center justify-center">
                        🏷️
                      </span>
                      Trạng thái
                    </label>
                    <select
                      value={product?.status || "active"}
                      onChange={(e) =>
                        onProductChange({ ...product, status: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all"
                    >
                      <option value="active">Hoạt động</option>
                      <option value="inactive">Không hoạt động</option>
                      <option value="out_of_stock">Hết hàng</option>
                      {variant === "admin" && (
                        <option value="pending">Chờ duyệt</option>
                      )}
                    </select>
                  </div>

                  {variant === "admin" && (
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
                        <span className="w-5 h-5 bg-blue-500 text-white rounded text-xs flex items-center justify-center">
                          ✅
                        </span>
                        Trạng thái duyệt
                      </label>
                      <select
                        value={product?.approvalStatus || "pending"}
                        onChange={(e) =>
                          onProductChange({
                            ...product,
                            approvalStatus: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      >
                        <option value="pending">Chờ duyệt</option>
                        <option value="approved">Đã duyệt</option>
                        <option value="rejected">Từ chối</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Tips based on variant */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
                  <span className="text-blue-600">💡</span>
                  {variant === "admin" ? "Ghi chú Admin" : "Mẹo bán hàng"}
                </h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  {variant === "admin" ? (
                    <>
                      <li>• Kiểm tra thông tin seller trước khi duyệt</li>
                      <li>• Xác minh tính hợp lệ của sản phẩm</li>
                      <li>• Đảm bảo tuân thủ chính sách hệ thống</li>
                      <li>• Thông báo seller khi có thay đổi</li>
                    </>
                  ) : (
                    <>
                      <li>• Tên sản phẩm rõ ràng, dễ tìm kiếm</li>
                      <li>• Mô tả chi tiết để thu hút khách hàng</li>
                      <li>• Giá cạnh tranh và cập nhật kho đúng</li>
                      <li>• Hình ảnh chất lượng cao, góc độ đẹp</li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            {/* Right Column - Images */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-purple-500">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-purple-500 text-white rounded-md flex items-center justify-center text-xs">
                    📷
                  </span>
                  Hình ảnh sản phẩm
                </h3>

                {/* Image Upload Area */}
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-400 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) =>
                        handleImageUpload(Array.from(e.target.files))
                      }
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-8 h-8 text-purple-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-600 text-sm">
                        <span className="font-semibold text-purple-600">
                          Nhấp để tải ảnh
                        </span>
                        <br />
                        hoặc kéo thả file vào đây
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        PNG, JPG, GIF tối đa 10MB
                      </p>
                    </label>
                  </div>

                  {/* Image Preview */}
                  {product?.images && product.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-3">
                      {product.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image.url || image}
                            alt={`Product ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border-2 border-gray-200 group-hover:border-purple-400 transition-colors"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-lg transition-all flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 flex space-x-2">
                              <button
                                onClick={() =>
                                  onSetFeaturedImage &&
                                  onSetFeaturedImage(index)
                                }
                                className="p-1 bg-white rounded text-purple-600 hover:bg-purple-50"
                                title="Đặt làm ảnh chính"
                              >
                                ⭐
                              </button>
                              <button
                                onClick={() =>
                                  onRemoveImage && onRemoveImage(index)
                                }
                                className="p-1 bg-white rounded text-red-600 hover:bg-red-50"
                                title="Xóa ảnh"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-gray-100 to-gray-50 px-8 py-6 rounded-b-2xl flex justify-end gap-4 border-t border-gray-200 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-8 py-3 text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all font-medium shadow-sm hover:shadow-md transform hover:scale-105 flex items-center gap-2"
          >
            <span>❌</span> Hủy bỏ
          </button>
          <button
            onClick={onSave}
            className={`relative px-10 py-3 bg-gradient-to-r ${colors.buttonGradient} text-white rounded-xl transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-0.5 flex items-center gap-2 overflow-hidden`}
          >
            <span>{colors.buttonIcon}</span>
            {buttonText}
            <div className="absolute inset-0 bg-white opacity-0 hover:opacity-20 transition-opacity"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
