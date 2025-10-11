import React, { useState, useEffect } from "react";

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
  const isEditMode = mode === "edit";
  const [additionalStock, setAdditionalStock] = useState(0);

  // Reset additional stock when modal opens/closes or mode changes
  useEffect(() => {
    if (isOpen && isEditMode) {
      setAdditionalStock(0);
    }
  }, [isOpen, isEditMode]);

  // Handle save with stock logic
  const handleSave = () => {
    if (isEditMode) {
      // For edit mode, pass additionalStock separately
      const updatedProduct = {
        ...product,
        additionalStock: additionalStock, // Pass additional stock amount for useProducts to handle
      };
      onSave(updatedProduct);
    } else {
      // For add mode, pass current product
      onSave(product);
    }
    setAdditionalStock(0); // Reset after save
  };

  if (!isOpen) return null;
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
                      {isEditMode ? "Nhập hàng thêm" : "Số lượng tồn kho *"}
                    </label>
                    {isEditMode ? (
                      // Edit mode: Show current stock + additional input
                      <div className="space-y-3">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-sm text-gray-600 mb-1">
                            Số lượng hiện tại:
                          </div>
                          <div className="text-lg font-semibold text-gray-800">
                            {product?.stock || product?.quantity || 0} sản phẩm
                          </div>
                        </div>
                        <input
                          type="number"
                          min="0"
                          value={additionalStock}
                          onChange={(e) => {
                            const value = Math.max(
                              0,
                              parseInt(e.target.value) || 0
                            );
                            setAdditionalStock(value);
                          }}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all"
                          placeholder="Nhập số lượng muốn thêm"
                        />
                        {additionalStock > 0 && (
                          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                            <div className="text-sm text-green-700">
                              📈 Sau khi nhập thêm:{" "}
                              <span className="font-semibold">
                                {(product?.stock || product?.quantity || 0) +
                                  additionalStock}{" "}
                                sản phẩm
                              </span>
                            </div>
                          </div>
                        )}
                        <div className="text-sm text-blue-600">
                          💡 Chỉ có thể thêm hàng, không thể giảm số lượng
                        </div>
                      </div>
                    ) : (
                      // Add mode: Normal stock input
                      <input
                        type="number"
                        min="0"
                        value={product?.quantity || product?.stock || ""}
                        onChange={(e) =>
                          onProductChange({
                            ...product,
                            quantity: e.target.value,
                            stock: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all"
                        placeholder="0"
                      />
                    )}
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
                    <div className="space-y-3">
                      <div className="text-sm text-gray-600 flex items-center gap-2">
                        <span className="w-4 h-4 bg-yellow-500 text-white rounded text-xs flex items-center justify-center">
                          ⭐
                        </span>
                        Ảnh đầu tiên sẽ là ảnh chính
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {product.images.map((image, index) => (
                          <div key={index} className="relative group">
                            {/* Main image indicator */}
                            {index === 0 && (
                              <div className="absolute -top-2 -left-2 z-10 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full shadow-md font-medium">
                                <span className="flex items-center gap-1">
                                  ⭐ Ảnh chính
                                </span>
                              </div>
                            )}

                            <img
                              src={
                                typeof image === "object"
                                  ? image.url || image.Url || image.ImageURL
                                  : image
                              }
                              alt={`Product ${index + 1}`}
                              className={`w-full h-24 object-cover rounded-lg border-2 transition-all ${
                                index === 0
                                  ? "border-yellow-400 shadow-md ring-2 ring-yellow-200"
                                  : "border-gray-200 group-hover:border-purple-400"
                              }`}
                              onError={(e) => {
                                console.log(
                                  "Image failed to load:",
                                  typeof image === "object" ? image.url : image
                                );
                                e.target.style.display = "none";
                                e.target.nextElementSibling.style.display =
                                  "flex";
                              }}
                              onLoad={() => {
                                console.log(
                                  "Image loaded successfully at index:",
                                  index
                                );
                              }}
                            />

                            {/* Error fallback */}
                            <div className="hidden w-full h-24 bg-gray-100 rounded-lg border-2 border-gray-200 items-center justify-center">
                              <span className="text-gray-400 text-xs">
                                Lỗi tải ảnh
                              </span>
                            </div>

                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-lg transition-all flex items-center justify-center">
                              <div className="opacity-0 group-hover:opacity-100 flex space-x-2">
                                {index !== 0 && (
                                  <button
                                    onClick={() => {
                                      console.log(
                                        `Setting image ${index} as featured`
                                      );
                                      onSetFeaturedImage &&
                                        onSetFeaturedImage(index);
                                    }}
                                    className="p-2 bg-yellow-500 hover:bg-yellow-600 rounded-lg text-white shadow-md transform hover:scale-105 transition-all"
                                    title="Đặt làm ảnh chính"
                                  >
                                    <svg
                                      className="w-4 h-4"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  </button>
                                )}
                                <button
                                  onClick={() => {
                                    console.log(`Removing image ${index}`);
                                    onRemoveImage && onRemoveImage(index);
                                  }}
                                  className="p-2 bg-red-500 hover:bg-red-600 rounded-lg text-white shadow-md transform hover:scale-105 transition-all"
                                  title="Xóa ảnh"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>

                            {/* Index number */}
                            <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                              {index + 1}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Instructions */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="text-sm text-blue-800">
                          <div className="font-medium mb-1">📋 Hướng dẫn:</div>
                          <ul className="text-xs space-y-1 text-blue-700">
                            <li>• Ảnh đầu tiên sẽ hiển thị làm ảnh đại diện</li>
                            <li>• Click ⭐ để đặt ảnh khác làm ảnh chính</li>
                            <li>• Click 🗑️ để xóa ảnh không cần thiết</li>
                            <li>• Kéo thả để sắp xếp thứ tự ảnh</li>
                          </ul>
                        </div>
                      </div>
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
            onClick={handleSave}
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
