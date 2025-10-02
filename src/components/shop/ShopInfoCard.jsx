import React from "react";

const ShopInfoCard = ({ shopInfo, onEditShopInfo }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Thông tin shop</h2>
        <button
          onClick={onEditShopInfo}
          className="px-4 py-2 text-sm text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors"
        >
          Chỉnh sửa
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-orange-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4 3a2 2 0 00-2 2v1.007a1 1 0 00.293.707L3 7.414V15a2 2 0 002 2h10a2 2 0 002-2V7.414l.707-.707A1 1 0 0018 6.007V5a2 2 0 00-2-2H4zm2 4a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm0 3a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{shopInfo.name}</h3>
            <p className="text-gray-600">{shopInfo.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <label className="text-sm font-medium text-gray-500">
              Ngày tham gia
            </label>
            <p className="text-gray-900">15 Tháng 3, 2024</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Địa chỉ</label>
            <p className="text-gray-900">{shopInfo.address}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">
              Email liên hệ
            </label>
            <p className="text-gray-900">{shopInfo.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">
              Số điện thoại
            </label>
            <p className="text-gray-900">{shopInfo.phone}</p>
          </div>
          {shopInfo.website && (
            <div>
              <label className="text-sm font-medium text-gray-500">
                Website
              </label>
              <a
                href={shopInfo.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-600 hover:text-orange-700 hover:underline transition-colors"
              >
                {shopInfo.website}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopInfoCard;
