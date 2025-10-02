import React, { useState } from "react";
import { SHOP_TABS } from "../../constants/shopPageConstants";

const ShopEditModal = ({ isOpen, onClose, shopInfo, onSave }) => {
  const [tempShopInfo, setTempShopInfo] = useState({
    name: shopInfo.name || "",
    description: shopInfo.description || "",
    email: shopInfo.email || "",
    phone: shopInfo.phone || "",
    address: shopInfo.address || "",
    website: shopInfo.website || "",
    socialMedia: {
      facebook: shopInfo.socialMedia?.facebook || "",
      instagram: shopInfo.socialMedia?.instagram || "",
      zalo: shopInfo.socialMedia?.zalo || "",
    },
    policies: {
      returnPolicy: shopInfo.policies?.returnPolicy || "",
      shippingPolicy: shopInfo.policies?.shippingPolicy || "",
      warrantyPolicy: shopInfo.policies?.warrantyPolicy || "",
    },
  });

  const [activeTab, setActiveTab] = useState("basic");

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedShopInfo = {
      name: tempShopInfo.name,
      description: tempShopInfo.description,
      email: tempShopInfo.email,
      phone: tempShopInfo.phone,
      address: tempShopInfo.address,
      website: tempShopInfo.website,
      socialMedia: tempShopInfo.socialMedia,
      policies: tempShopInfo.policies,
    };
    onSave(updatedShopInfo);
  };

  const handleInputChange = (field, value) => {
    setTempShopInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedInputChange = (parent, field, value) => {
    setTempShopInfo((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value,
      },
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

        {/* Tab Navigation */}
        <div className="px-6 pt-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex space-x-1">
            {SHOP_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-medium text-sm transition-all ${
                  activeTab === tab.id
                    ? "bg-orange-50 text-orange-600 border-b-2 border-orange-500"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit}>
            {/* Basic Information Tab */}
            {activeTab === "basic" && (
              <div className="space-y-5">
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

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
                    <span className="w-6 h-6 bg-gradient-to-r from-purple-500 to-purple-600 rounded-md flex items-center justify-center">
                      <span className="text-white text-xs">🌐</span>
                    </span>
                    Website (tùy chọn)
                  </label>
                  <input
                    type="url"
                    value={tempShopInfo.website}
                    onChange={(e) =>
                      handleInputChange("website", e.target.value)
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all bg-white shadow-sm font-medium text-gray-800"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>
            )}

            {/* Contact Information Tab */}
            {activeTab === "contact" && (
              <div className="space-y-5">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
                    <span className="w-6 h-6 bg-gradient-to-r from-red-500 to-pink-600 rounded-md flex items-center justify-center">
                      <span className="text-white text-xs">📧</span>
                    </span>
                    Email liên hệ *
                  </label>
                  <input
                    type="email"
                    required
                    value={tempShopInfo.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all bg-white shadow-sm font-medium text-gray-800"
                    placeholder="contact@yourshop.com"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
                    <span className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-md flex items-center justify-center">
                      <span className="text-white text-xs">📱</span>
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

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
                    <span className="w-6 h-6 bg-gradient-to-r from-green-500 to-teal-600 rounded-md flex items-center justify-center">
                      <span className="text-white text-xs">📍</span>
                    </span>
                    Địa chỉ *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={tempShopInfo.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all bg-white shadow-sm font-medium text-gray-800"
                    placeholder="Địa chỉ chi tiết của shop"
                  />
                </div>
              </div>
            )}

            {/* Social Media Tab */}
            {activeTab === "social" && (
              <div className="space-y-5">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
                    <span className="w-6 h-6 bg-gradient-to-r from-blue-600 to-blue-700 rounded-md flex items-center justify-center">
                      <span className="text-white text-xs">📘</span>
                    </span>
                    Facebook
                  </label>
                  <input
                    type="url"
                    value={tempShopInfo.socialMedia.facebook}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "socialMedia",
                        "facebook",
                        e.target.value
                      )
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all bg-white shadow-sm font-medium text-gray-800"
                    placeholder="https://facebook.com/yourshop"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
                    <span className="w-6 h-6 bg-gradient-to-r from-pink-500 to-rose-600 rounded-md flex items-center justify-center">
                      <span className="text-white text-xs">📸</span>
                    </span>
                    Instagram
                  </label>
                  <input
                    type="text"
                    value={tempShopInfo.socialMedia.instagram}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "socialMedia",
                        "instagram",
                        e.target.value
                      )
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all bg-white shadow-sm font-medium text-gray-800"
                    placeholder="@yourshop"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
                    <span className="w-6 h-6 bg-gradient-to-r from-blue-400 to-blue-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-xs">💬</span>
                    </span>
                    Zalo
                  </label>
                  <input
                    type="text"
                    value={tempShopInfo.socialMedia.zalo}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "socialMedia",
                        "zalo",
                        e.target.value
                      )
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all bg-white shadow-sm font-medium text-gray-800"
                    placeholder="Số Zalo để khách hàng liên hệ"
                  />
                </div>
              </div>
            )}

            {/* Policies Tab */}
            {activeTab === "policies" && (
              <div className="space-y-5">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
                    <span className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-md flex items-center justify-center">
                      <span className="text-white text-xs">🔄</span>
                    </span>
                    Chính sách đổi trả
                  </label>
                  <textarea
                    rows={3}
                    value={tempShopInfo.policies.returnPolicy}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "policies",
                        "returnPolicy",
                        e.target.value
                      )
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all bg-white shadow-sm font-medium text-gray-800"
                    placeholder="Mô tả chính sách đổi trả của shop"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
                    <span className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-md flex items-center justify-center">
                      <span className="text-white text-xs">🚚</span>
                    </span>
                    Chính sách giao hàng
                  </label>
                  <textarea
                    rows={3}
                    value={tempShopInfo.policies.shippingPolicy}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "policies",
                        "shippingPolicy",
                        e.target.value
                      )
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all bg-white shadow-sm font-medium text-gray-800"
                    placeholder="Mô tả chính sách giao hàng của shop"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
                    <span className="w-6 h-6 bg-gradient-to-r from-purple-500 to-purple-600 rounded-md flex items-center justify-center">
                      <span className="text-white text-xs">🛡️</span>
                    </span>
                    Chính sách bảo hành
                  </label>
                  <textarea
                    rows={3}
                    value={tempShopInfo.policies.warrantyPolicy}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "policies",
                        "warrantyPolicy",
                        e.target.value
                      )
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all bg-white shadow-sm font-medium text-gray-800"
                    placeholder="Mô tả chính sách bảo hành của shop"
                  />
                </div>
              </div>
            )}

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
                <li>
                  • Chính sách rõ ràng giúp tránh hiểu nhầm với khách hàng
                </li>
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
