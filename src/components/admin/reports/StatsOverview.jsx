import React from "react";

const StatsOverview = ({ stats }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat("vi-VN").format(num);
  };

  const statsCards = [
    {
      title: "Tổng người dùng",
      value: formatNumber(stats.totalUsers),
      icon: "👥",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Tổng đơn hàng",
      value: formatNumber(stats.totalOrders),
      icon: "📦",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      title: "Tổng sản phẩm",
      value: formatNumber(stats.totalProducts),
      icon: "🛍️",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      title: "Tổng doanh thu",
      value: formatCurrency(stats.totalRevenue),
      icon: "💰",
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600",
    },
    {
      title: "Người dùng đang hoạt động",
      value: formatNumber(stats.activeUsers),
      icon: "🟢",
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600",
    },
    {
      title: "Đơn hàng chờ xử lý",
      value: formatNumber(stats.pendingOrders),
      icon: "⏳",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
    },
    {
      title: "Sản phẩm hết hàng",
      value: formatNumber(stats.outOfStockProducts),
      icon: "📉",
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      textColor: "text-red-600",
    },
    {
      title: "Báo cáo vi phạm",
      value: formatNumber(stats.violationReports),
      icon: "⚠️",
      color: "from-pink-500 to-pink-600",
      bgColor: "bg-pink-50",
      textColor: "text-pink-600",
    },
  ];

  return (
    <div className="mb-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          📊 Tổng quan hệ thống
        </h2>
        <p className="text-gray-600">
          Các chỉ số quan trọng nhất của hệ thống PycShop
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
              <div
                className={`w-12 h-12 ${card.bgColor} rounded-xl flex items-center justify-center`}
              >
                <span className="text-xl">{card.icon}</span>
              </div>
            </div>

            <div className="mt-4">
              <div
                className={`w-full h-1 bg-gradient-to-r ${card.color} rounded-full opacity-20`}
              ></div>
              <div
                className={`w-3/4 h-1 bg-gradient-to-r ${card.color} rounded-full -mt-1`}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsOverview;
