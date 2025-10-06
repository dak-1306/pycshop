import React from "react";

const UserAnalytics = ({ data }) => {
  const formatNumber = (num) => {
    return new Intl.NumberFormat("vi-VN").format(num);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
          👥 Thống kê người dùng
        </h3>
        <p className="text-sm text-gray-600">
          Phân tích hoạt động và tăng trưởng người dùng
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm font-medium text-blue-600 mb-1">
            Tổng người dùng
          </p>
          <p className="text-2xl font-bold text-blue-900">
            {formatNumber(data.totalUsers)}
          </p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-sm font-medium text-green-600 mb-1">
            Người dùng mới tháng này
          </p>
          <p className="text-2xl font-bold text-green-900">
            +{formatNumber(data.newUsersThisMonth)}
          </p>
        </div>
      </div>

      {/* User Role Distribution */}
      <div className="mb-6">
        <h4 className="text-md font-semibold text-gray-800 mb-3">
          Phân bố theo vai trò
        </h4>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-600">
                Người mua ({formatNumber(data.usersByRole.buyers)})
              </span>
              <span className="text-sm text-gray-500">
                {((data.usersByRole.buyers / data.totalUsers) * 100).toFixed(1)}
                %
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{
                  width: `${
                    (data.usersByRole.buyers / data.totalUsers) * 100
                  }%`,
                }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-600">
                Người bán ({formatNumber(data.usersByRole.sellers)})
              </span>
              <span className="text-sm text-gray-500">
                {((data.usersByRole.sellers / data.totalUsers) * 100).toFixed(
                  1
                )}
                %
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{
                  width: `${
                    (data.usersByRole.sellers / data.totalUsers) * 100
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Sellers */}
      <div>
        <h4 className="text-md font-semibold text-gray-800 mb-3">
          Top người bán
        </h4>
        <div className="space-y-3">
          {data.topSellers.map((seller, index) => (
            <div
              key={seller.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600">
                    #{index + 1}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{seller.name}</p>
                  <p className="text-sm text-gray-500">
                    {formatNumber(seller.totalOrders)} đơn hàng
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-600">
                  {formatCurrency(seller.totalRevenue)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Users */}
      <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
            <span className="text-emerald-600">🟢</span>
          </div>
          <div>
            <p className="font-semibold text-emerald-900">
              {formatNumber(data.activeUsers)} người dùng đang hoạt động
            </p>
            <p className="text-sm text-emerald-700">
              Đang online trong 24h qua
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAnalytics;
