import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, IconButton, ActionButton } from "../ui";

const ProductModal = ({
  isOpen,
  onClose,
  mode = "add", // 'add' or 'edit'
  product = {},
  onProductChange,
  onSave,
  categories = [],
  variant = "seller", // "admin" | "seller"
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

  // Handle ESC key
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      const handleEsc = (e) => {
        if (e.key === "Escape") {
          handleClose();
        }
      };

      document.addEventListener("keydown", handleEsc);
      return () => document.removeEventListener("keydown", handleEsc);
    }
  }, [isOpen, handleClose]);

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Handle save with stock logic
  const handleSave = () => {
    if (isEditMode) {
      const updatedProduct = {
        ...product,
        additionalStock: additionalStock,
      };
      onSave(updatedProduct);
    } else {
      onSave(product);
    }
    setAdditionalStock(0);
  };

  // Handle image upload
  const handleImageUpload = (files) => {
    if (onImageUpload) {
      onImageUpload(files);
    }
  };

  if (!isOpen) return null;

  const modalTitle = isEditMode ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới";
  const modalSubtitle = isEditMode
    ? `Cập nhật thông tin: ${product?.name || ""}`
    : variant === "admin"
    ? "Thêm sản phẩm vào hệ thống"
    : "Tạo sản phẩm mới cho cửa hàng";

  // Colors and gradients based on variant and mode
  const colors =
    variant === "admin"
      ? {
          headerGradient: "from-blue-500 to-blue-600",
          buttonGradient: "from-blue-500 to-blue-600",
          accentColor: "blue",
        }
      : {
          headerGradient: isEditMode
            ? "from-blue-500 to-blue-600"
            : "from-orange-500 to-red-500",
          buttonGradient: isEditMode
            ? "from-blue-500 to-blue-600"
            : "from-orange-500 to-red-500",
          accentColor: isEditMode ? "blue" : "orange",
        };

  const buttonText = isEditMode
    ? "Lưu thay đổi"
    : variant === "admin"
    ? "Thêm vào hệ thống"
    : "Tạo sản phẩm";

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full h-[95vh] flex flex-col">
        {/* Header - Compact & Fixed */}
        <div className="flex items-center justify-between py-4 px-6 border-b border-gray-100">
          <div className="flex items-center space-x-4">
            <div
              className={`w-12 h-12 bg-gradient-to-br ${colors.headerGradient} rounded-2xl flex items-center justify-center text-white`}
            >
              <FontAwesomeIcon
                icon={isEditMode ? ["fas", "edit"] : ["fas", "plus"]}
                className="w-6 h-6"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{modalTitle}</h2>
              <p className="text-gray-500 text-sm">{modalSubtitle}</p>
            </div>
          </div>

          <IconButton
            onClick={handleClose}
            icon={["fas", "times"]}
            variant="ghost"
            size="md"
            role={variant}
            tooltip="Đóng modal"
          />
        </div>

        {/* Content - Optimized 2-column layout với fixed height */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full p-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
              {/* Left Column - Product Form (7/12) */}
              <div className="lg:col-span-7 space-y-6 overflow-y-auto pr-2">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <FontAwesomeIcon
                      icon={["fas", "info-circle"]}
                      className="text-blue-500"
                    />
                    Thông tin cơ bản
                  </h3>

                  {/* Product Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên sản phẩm *
                    </label>
                    <input
                      type="text"
                      value={product?.name || ""}
                      onChange={(e) =>
                        onProductChange({ ...product, name: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="VD: iPhone 15 Pro Max 256GB"
                    />
                  </div>

                  {/* Category & Status Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Trạng thái
                      </label>
                      <select
                        value={product?.status || "active"}
                        onChange={(e) =>
                          onProductChange({
                            ...product,
                            status: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                      >
                        <option value="active">Hoạt động</option>
                        <option value="inactive">Tạm dừng</option>
                        <option value="out_of_stock">Hết hàng</option>
                        {variant === "admin" && (
                          <option value="pending">Chờ duyệt</option>
                        )}
                      </select>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                      placeholder="Mô tả chi tiết về sản phẩm, tính năng, ưu điểm..."
                      rows={3}
                    />
                  </div>
                </div>

                {/* Price & Stock Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <FontAwesomeIcon
                      icon={["fas", "dollar-sign"]}
                      className="text-green-500"
                    />
                    Giá & Kho hàng
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Price */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Giá bán *
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          value={product?.price || ""}
                          onChange={(e) =>
                            onProductChange({
                              ...product,
                              price: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                          placeholder="0"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                          VNĐ
                        </span>
                      </div>
                    </div>

                    {/* Stock */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {isEditMode ? "Thêm vào kho" : "Số lượng *"}
                      </label>
                      {isEditMode ? (
                        <div className="space-y-2">
                          <div className="text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded-lg">
                            Hiện tại: {product?.stock || product?.quantity || 0}{" "}
                            sản phẩm
                          </div>
                          <input
                            type="number"
                            min="0"
                            value={additionalStock}
                            onChange={(e) =>
                              setAdditionalStock(
                                Math.max(0, parseInt(e.target.value) || 0)
                              )
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                            placeholder="Số lượng thêm"
                          />
                        </div>
                      ) : (
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
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                          placeholder="0"
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Admin-specific fields */}
                {variant === "admin" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <FontAwesomeIcon
                        icon={["fas", "crown"]}
                        className="text-yellow-500"
                      />
                      Quản trị viên
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Người bán
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
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                          placeholder="Tên người bán"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
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
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        >
                          <option value="pending">Chờ duyệt</option>
                          <option value="approved">Đã duyệt</option>
                          <option value="rejected">Từ chối</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tips */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FontAwesomeIcon
                        icon={["fas", "lightbulb"]}
                        className="w-3 h-3 text-white"
                      />
                    </div>
                    <div className="text-sm text-blue-800">
                      <div className="font-semibold mb-1">
                        {variant === "admin" ? "Lưu ý Admin:" : "Mẹo hay:"}
                      </div>
                      <p>
                        {variant === "admin"
                          ? "Kiểm tra kỹ thông tin seller trước khi duyệt"
                          : "Tên rõ ràng và hình ảnh chất lượng sẽ thu hút khách hàng"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Image Management (5/12) */}
              <div className="lg:col-span-5 space-y-4 overflow-y-auto">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <FontAwesomeIcon
                      icon={["fas", "images"]}
                      className="text-purple-500"
                    />
                    Hình ảnh sản phẩm
                  </h3>

                  {/* Upload Area - Compact */}
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-400 hover:bg-purple-50/50 transition-all duration-200">
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
                      <div className="w-12 h-12 mx-auto mb-3 bg-purple-100 rounded-2xl flex items-center justify-center">
                        <FontAwesomeIcon
                          icon={["fas", "cloud-upload-alt"]}
                          className="w-6 h-6 text-purple-500"
                        />
                      </div>
                      <p className="text-base font-medium text-gray-700 mb-1">
                        <span className="text-purple-600">Tải ảnh lên</span>
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG - Max 10MB
                      </p>
                    </label>
                  </div>

                  {/* Image Preview Grid - Optimized */}
                  <div className="space-y-3">
                    {product?.images && product.images.length > 0 ? (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">
                            Hình ảnh ({product.images.length})
                          </span>
                          <span className="text-xs text-gray-500 bg-yellow-50 px-2 py-1 rounded-full border border-yellow-200">
                            <FontAwesomeIcon
                              icon={["fas", "star"]}
                              className="w-3 h-3 text-yellow-500 mr-1"
                            />
                            Ảnh đầu là chính
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                          {product.images.map((image, index) => (
                            <div key={index} className="relative group">
                              {/* Featured Badge */}
                              {index === 0 && (
                                <div className="absolute -top-2 -left-2 z-10 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full shadow-md">
                                  <FontAwesomeIcon
                                    icon={["fas", "star"]}
                                    className="w-3 h-3"
                                  />
                                </div>
                              )}

                              <img
                                src={
                                  typeof image === "object"
                                    ? image.url || image.Url || image.ImageURL
                                    : image
                                }
                                alt={`Product ${index + 1}`}
                                className={`w-full h-20 object-cover rounded-lg transition-all duration-200 ${
                                  index === 0
                                    ? "ring-2 ring-yellow-400 shadow-md"
                                    : "border border-gray-200 group-hover:border-purple-400 group-hover:shadow-md"
                                }`}
                                onError={(e) => {
                                  e.target.style.display = "none";
                                  e.target.nextElementSibling.style.display =
                                    "flex";
                                }}
                              />

                              {/* Error Placeholder */}
                              <div className="hidden w-full h-20 bg-gray-100 rounded-lg border border-gray-200 items-center justify-center">
                                <div className="text-center">
                                  <FontAwesomeIcon
                                    icon={["fas", "image"]}
                                    className="w-5 h-5 text-gray-400 mb-1"
                                  />
                                  <span className="text-xs text-gray-400">
                                    Lỗi ảnh
                                  </span>
                                </div>
                              </div>

                              {/* Action Overlay */}
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-lg transition-all duration-200 flex items-center justify-center">
                                <div className="opacity-0 group-hover:opacity-100 flex space-x-1 transition-opacity duration-200">
                                  {index !== 0 && (
                                    <button
                                      onClick={() =>
                                        onSetFeaturedImage &&
                                        onSetFeaturedImage(index)
                                      }
                                      className="p-1.5 bg-yellow-500 hover:bg-yellow-600 rounded-lg text-white shadow-lg transform hover:scale-110 transition-all duration-150"
                                      title="Đặt làm ảnh chính"
                                    >
                                      <FontAwesomeIcon
                                        icon={["fas", "star"]}
                                        className="w-3 h-3"
                                      />
                                    </button>
                                  )}
                                  <button
                                    onClick={() =>
                                      onRemoveImage && onRemoveImage(index)
                                    }
                                    className="p-1.5 bg-red-500 hover:bg-red-600 rounded-lg text-white shadow-lg transform hover:scale-110 transition-all duration-150"
                                    title="Xóa ảnh"
                                  >
                                    <FontAwesomeIcon
                                      icon={["fas", "trash"]}
                                      className="w-3 h-3"
                                    />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8 text-gray-400">
                        <FontAwesomeIcon
                          icon={["fas", "images"]}
                          className="w-10 h-10 mx-auto mb-3 opacity-50"
                        />
                        <p className="text-sm">Chưa có hình ảnh nào</p>
                        <p className="text-xs mt-1">
                          Thêm ít nhất 1 ảnh để hiển thị sản phẩm
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions - Fixed */}
        <div className="border-t border-gray-100 py-4 px-6">
          <div className="flex justify-between items-center">
            {/* Left side - Stock info for edit mode */}
            <div className="text-sm text-gray-600">
              {isEditMode && additionalStock > 0 && (
                <div className="flex items-center space-x-2 text-green-600 font-medium">
                  <FontAwesomeIcon icon={["fas", "plus-circle"]} />
                  <span>Sẽ thêm {additionalStock} sản phẩm vào kho</span>
                </div>
              )}
            </div>

            {/* Right side - Action buttons */}
            <div className="flex space-x-4">
              <ActionButton
                action="cancel"
                onClick={handleClose}
                role={variant}
                size="lg"
              >
                Hủy bỏ
              </ActionButton>
              <Button
                onClick={handleSave}
                variant="primary"
                role={variant}
                size="lg"
                icon={isEditMode ? ["fas", "save"] : ["fas", "plus"]}
              >
                {buttonText}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ProductModal.displayName = "ProductModal";

ProductModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  mode: PropTypes.oneOf(["add", "edit"]),
  product: PropTypes.object,
  onProductChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  categories: PropTypes.array,
  variant: PropTypes.oneOf(["admin", "seller"]),
  onImageUpload: PropTypes.func,
  onRemoveImage: PropTypes.func,
  onSetFeaturedImage: PropTypes.func,
};

export default ProductModal;
