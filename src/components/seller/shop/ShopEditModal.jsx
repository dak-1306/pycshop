import React, { useState, useEffect } from "react";
import ShopService from "../../../services/shopService";

const ShopEditModal = ({ isOpen, onClose, shopInfo, onSave }) => {
  const [tempShopInfo, setTempShopInfo] = useState({
    name: shopInfo.name || "",
    description: shopInfo.description || "",
    category_id: shopInfo.category_id || "",
    phone: shopInfo.phone || "",
    address: shopInfo.address || "",
  });

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Load categories when modal opens
  useEffect(() => {
    if (isOpen) {
      loadCategories();
      // Reset form with current shop info
      setTempShopInfo({
        name: shopInfo.name || "",
        description: shopInfo.description || "",
        category_id: shopInfo.category_id || "",
        phone: shopInfo.phone || "",
        address: shopInfo.address || "",
      });
    }
  }, [isOpen, shopInfo]);

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await ShopService.getCategories();
      if (response && response.success) {
        setCategories(response.categories || []);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedShopInfo = {
      name: tempShopInfo.name,
      description: tempShopInfo.description,
      category_id: parseInt(tempShopInfo.category_id),
      phone: tempShopInfo.phone,
      address: tempShopInfo.address,
    };
    onSave(updatedShopInfo);
  };

  const handleInputChange = (field, value) => {
    setTempShopInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="relative bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 text-white px-6 py-4 rounded-t-2xl flex-shrink-0">
          <div className="absolute inset-0 bg-white opacity-10 rounded-t-2xl"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white border-opacity-30">
                <span className="text-xl">🏪</span>
              </div>
              <div>
                <h2 className="text-xl font-bold">Chỉnh sửa thông tin shop</h2>
                <p className="text-xs text-orange-100">
                  Cập nhật thông tin chi tiết của shop của bạn
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
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              {/* Shop Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
                  <span className="w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-md flex items-center justify-center">
                    <span className="text-white text-xs">🏷️</span>
                  </span>
                  Tên shop *
                </label>
                <input
                  type="text"
                  required
                  value={tempShopInfo.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all bg-white shadow-sm font-medium text-gray-800"
                  placeholder="VD: My Awesome Shop"
                />
              </div>

              {/* Shop Description */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
                  <span className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-md flex items-center justify-center">
                    <span className="text-white text-xs">📝</span>
                  </span>
                  Mô tả shop *
                </label>
                <textarea
                  rows={4}
                  required
                  value={tempShopInfo.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all bg-white shadow-sm font-medium text-gray-800"
                  placeholder="Mô tả chi tiết về shop của bạn, sản phẩm chính, thế mạnh..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Mô tả này sẽ hiển thị trên trang shop của bạn
                </p>
              </div>

              {/* Category */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
                  <span className="w-6 h-6 bg-gradient-to-r from-purple-500 to-purple-600 rounded-md flex items-center justify-center">
                    <span className="text-white text-xs">�</span>
                  </span>
                  Danh mục chính *
                </label>
                <select
                  required
                  value={tempShopInfo.category_id}
                  onChange={(e) =>
                    handleInputChange("category_id", e.target.value)
                  }
                  disabled={loadingCategories}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all bg-white shadow-sm font-medium text-gray-800 disabled:bg-gray-100"
                >
                  <option value="">
                    {loadingCategories ? "Đang tải..." : "Chọn danh mục"}
                  </option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Danh mục chính của shop giúp khách hàng dễ tìm thấy
                </p>
              </div>

              {/* Phone */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
                  <span className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-md flex items-center justify-center">
                    <span className="text-white text-xs">�</span>
                  </span>
                  Số điện thoại *
                </label>
                <input
                  type="tel"
                  required
                  value={tempShopInfo.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all bg-white shadow-sm font-medium text-gray-800"
                  placeholder="+84 123 456 789"
                />
              </div>

              {/* Address */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
                  <span className="w-6 h-6 bg-gradient-to-r from-green-500 to-teal-600 rounded-md flex items-center justify-center">
                    <span className="text-white text-xs">�</span>
                  </span>
                  Địa chỉ *
                </label>
                <textarea
                  rows={3}
                  required
                  value={tempShopInfo.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all bg-white shadow-sm font-medium text-gray-800"
                  placeholder="Địa chỉ chi tiết của shop"
                />
              </div>
            </div>

            {/* Tips Section */}
            <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <span className="text-blue-600">💡</span>
                Mẹo tối ưu hóa thông tin shop
              </h4>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>
                  • Tên shop nên ngắn gọn, dễ nhớ và thể hiện được lĩnh vực kinh
                  doanh
                </li>
                <li>
                  • Mô tả chi tiết giúp khách hàng hiểu rõ về sản phẩm và dịch
                  vụ
                </li>
                <li>• Thông tin liên hệ chính xác giúp tăng độ tin cậy</li>
                <li>• Chọn danh mục chính xác để tăng khả năng tìm thấy</li>
              </ul>
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="bg-gradient-to-r from-gray-100 to-gray-50 px-6 py-4 rounded-b-2xl flex justify-end gap-3 border-t border-gray-200 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-medium shadow-sm hover:shadow-md transform hover:scale-105 flex items-center gap-2"
          >
            <span>❌</span> Hủy bỏ
          </button>
          <button
            onClick={handleSubmit}
            className="relative px-8 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-0.5 flex items-center gap-2 overflow-hidden"
          >
            <span>💾</span> Lưu thay đổi
            <div className="absolute inset-0 bg-white opacity-0 hover:opacity-20 transition-opacity"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShopEditModal;
