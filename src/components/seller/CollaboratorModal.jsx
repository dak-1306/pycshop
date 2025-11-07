import React from "react";

const CollaboratorModal = ({
  isOpen,
  onClose,
  collaboratorForm,
  onCollaboratorFormChange,
  onSave,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all animate-slideUp">
        {/* Modal Header */}
        <div className="relative bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-500 text-white px-6 py-4 rounded-t-2xl">
          <div className="absolute inset-0 bg-white opacity-10 rounded-t-2xl"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white border-opacity-30">
                <svg
                  className="w-5 h-5 text-white"
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
              <div>
                <h2 className="text-xl font-bold">Thêm người cộng tác</h2>
                <p className="text-purple-100 text-xs">
                  Mời người mới tham gia quản lý shop
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
        <div className="p-6">
          <div className="space-y-6">
            {/* Info Section */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-purple-800">
                    Thông tin quan trọng
                  </h4>
                  <p className="text-xs text-purple-600 mt-1">
                    Người cộng tác sẽ có quyền truy cập vào hệ thống quản lý
                    shop
                  </p>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Name Field */}
              <div className="group">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
                  <svg
                    className="w-4 h-4 text-seller-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Họ và tên *
                </label>
                <input
                  type="text"
                  value={collaboratorForm.name}
                  onChange={(e) =>
                    onCollaboratorFormChange({
                      ...collaboratorForm,
                      name: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500 transition-all bg-white shadow-sm font-medium text-gray-800"
                  placeholder="VD: Nguyễn Văn A"
                />
              </div>

              {/* Email Field */}
              <div className="group">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
                  <svg
                    className="w-4 h-4 text-seller-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Email *
                </label>
                <input
                  type="email"
                  value={collaboratorForm.email}
                  onChange={(e) =>
                    onCollaboratorFormChange({
                      ...collaboratorForm,
                      email: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-seller-200 focus:border-seller-500 transition-all bg-white shadow-sm font-medium text-gray-800"
                  placeholder="collaborator@email.com"
                />
              </div>
            </div>

            {/* Permissions Preview */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                Quyền truy cập
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-seller-500 rounded-full"></div>
                  <span>Quản lý sản phẩm</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-seller-500 rounded-full"></div>
                  <span>Xem đơn hàng</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-seller-500 rounded-full"></div>
                  <span>Thống kê</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>Cần phê duyệt</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-gradient-to-r from-gray-100 to-gray-50 px-6 py-4 rounded-b-2xl flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-medium shadow-sm hover:shadow-md transform hover:scale-105 flex items-center gap-2"
          >
            <span>❌</span> Hủy bỏ
          </button>
          <button
            onClick={onSave}
            className={`relative px-8 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-xl transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-0.5 flex items-center gap-2 overflow-hidden`}
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
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span>Thêm cộng tác viên</span>
            <div className="absolute inset-0 bg-white opacity-0 hover:opacity-20 transition-opacity"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollaboratorModal;
