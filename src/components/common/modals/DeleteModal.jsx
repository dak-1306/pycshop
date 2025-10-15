import React from "react";

const DeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  item,
  itemType = "sản phẩm", // "sản phẩm", "đơn hàng", etc.
  title = "Xác nhận xóa",
  subtitle = "Hành động này không thể hoàn tác",
}) => {
  if (!isOpen || !item) return null;

  // Dynamic content based on item type
  const getItemIcon = () => {
    switch (itemType) {
      case "đơn hàng":
        return "📋";
      case "sản phẩm":
      default:
        return "📦";
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
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all animate-slideUp">
        {/* Modal Header */}
        <div className="relative bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white px-6 py-4 rounded-t-2xl">
          <div className="absolute inset-0 bg-white opacity-10 rounded-t-2xl"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white border-opacity-30">
                <span className="text-xl">🗑️</span>
              </div>
              <div>
                <h2 className="text-xl font-bold">{title}</h2>
                <p className="text-red-100 text-xs">{subtitle}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Bạn có chắc chắn muốn xóa {itemType} này?
            </h3>
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <p className="text-sm font-medium text-gray-800 mb-1">
                <span className="text-red-600">{getItemIcon()}</span>{" "}
                {itemDetails.name}
              </p>
              <p className="text-xs text-gray-600">{itemDetails.details}</p>
            </div>
            <p className="text-sm text-gray-600">
              {itemType.charAt(0).toUpperCase() + itemType.slice(1)} sẽ bị xóa
              vĩnh viễn khỏi hệ thống. Hành động này không thể hoàn tác.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-2xl flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-medium shadow-sm hover:shadow-md transform hover:scale-105 flex items-center gap-2"
          >
            <span>↩️</span> Hủy bỏ
          </button>
          <button
            onClick={onConfirm}
            className="relative px-8 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-0.5 flex items-center gap-2 overflow-hidden"
          >
            <span>🗑️</span> Xóa {itemType}
            <div className="absolute inset-0 bg-white opacity-0 hover:opacity-20 transition-opacity"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
