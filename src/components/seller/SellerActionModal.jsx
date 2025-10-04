import React from "react";

const SellerActionModal = ({
  isOpen,
  seller,
  actionType,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !seller || !actionType) return null;

  const getModalContent = () => {
    switch (actionType) {
      case "block":
        return {
          title: "Xác nhận chặn Seller",
          message: `Bạn có chắc chắn muốn chặn seller "${seller.name}"?`,
          description:
            "Seller sẽ không thể đăng nhập và quản lý shop của mình. Shop sẽ bị ẩn khỏi trang chủ.",
          confirmText: "Chặn Seller",
          confirmClass: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
          icon: (
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"
              />
            </svg>
          ),
        };

      case "unblock":
        return {
          title: "Xác nhận bỏ chặn Seller",
          message: `Bạn có chắc chắn muốn bỏ chặn seller "${seller.name}"?`,
          description:
            "Seller sẽ có thể đăng nhập và quản lý shop trở lại. Shop sẽ hiển thị lại trên trang chủ.",
          confirmText: "Bỏ chặn Seller",
          confirmClass: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
          icon: (
            <svg
              className="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
        };

      case "verify":
        return {
          title: "Xác nhận xác minh Shop",
          message: `Bạn có chắc chắn muốn xác minh shop "${seller.shop.name}"?`,
          description:
            "Shop sẽ được đánh dấu đã xác minh và có thể được ưu tiên hiển thị trong kết quả tìm kiếm.",
          confirmText: "Xác minh Shop",
          confirmClass: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
          icon: (
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
        };

      default:
        return null;
    }
  };

  const modalContent = getModalContent();

  if (!modalContent) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="sm:flex sm:items-start">
            <div
              className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10 ${
                actionType === "block"
                  ? "bg-red-100"
                  : actionType === "unblock"
                  ? "bg-green-100"
                  : "bg-blue-100"
              }`}
            >
              {modalContent.icon}
            </div>

            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {modalContent.title}
              </h3>

              <div className="mt-2">
                <p className="text-sm text-gray-500 mb-2">
                  {modalContent.message}
                </p>
                <p className="text-sm text-gray-400">
                  {modalContent.description}
                </p>
              </div>

              {/* Thông tin seller */}
              <div className="mt-4 p-3 bg-gray-50 rounded-md">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                      <span className="text-xs font-medium text-white">
                        {seller.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .substring(0, 2)}
                      </span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">
                      {seller.name}
                    </div>
                    <div className="text-xs text-gray-500">{seller.email}</div>
                    <div className="text-xs text-gray-500">
                      Shop: {seller.shop.name}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${modalContent.confirmClass}`}
              onClick={onConfirm}
            >
              {modalContent.confirmText}
            </button>

            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerActionModal;
