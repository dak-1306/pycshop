import React, { useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const DeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  item,
  itemType = "sản phẩm", // "sản phẩm", "đơn hàng", etc.
  title = "Xác nhận xóa",
  subtitle = "Hành động này không thể hoàn tác",
}) => {
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

  if (!isOpen || !item) return null;

  // Dynamic content based on item type
  const getItemIcon = () => {
    switch (itemType) {
      case "đơn hàng":
        return <FontAwesomeIcon icon={["fas", "boxes"]} className="w-5 h-5" />;
      case "sản phẩm":
      default:
        return (
          <FontAwesomeIcon icon={["fas", "box-open"]} className="w-5 h-5" />
        );
    }
  };

  const getItemDetails = () => {
    if (itemType === "đơn hàng") {
      return {
        name: item.productName || item.name,
        details: `Khách hàng: ${item.customerName || "N/A"} • Giá: ${
          item.price
        }₫`,
      };
    } else {
      return {
        name: item.name,
        details: `Danh mục: ${item.category} • Giá: ${item.price}₫`,
      };
    }
  };

  const itemDetails = getItemDetails();

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all scale-100 hover:scale-105">
        {/* Compact Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon
                  icon={["fas", "exclamation-triangle"]}
                  className="text-lg"
                />
              </div>
              <div>
                <h2 className="text-lg font-bold">{title}</h2>
                <p className="text-red-100 text-sm opacity-90">{subtitle}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Body */}
        <div className="p-6">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <FontAwesomeIcon
                icon={["fas", "trash"]}
                className="w-6 h-6 text-red-600"
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Xóa {itemType}?
              </h3>
              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                <p className="text-sm font-medium text-gray-800 flex items-center justify-center gap-2">
                  {getItemIcon()}
                  <span>{itemDetails.name}</span>
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {itemDetails.details}
                </p>
              </div>
              <p className="text-sm text-gray-500">
                Hành động này không thể hoàn tác
              </p>
            </div>
          </div>
        </div>

        {/* Compact Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-2xl flex justify-center gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-medium"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
          >
            <FontAwesomeIcon icon={["fas", "trash"]} />
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
