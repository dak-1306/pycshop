import React from "react";

const DashboardKPICards = ({ chartData = {}, stats = {} }) => {
  // Calculate KPIs from chart data
  const calculateGrowth = (data) => {
    if (!data || data.length < 2) return 0;
    const current = data[data.length - 1]?.value || 0;
    const previous = data[data.length - 2]?.value || 0;
    if (previous === 0) return 0;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  const revenueGrowth = calculateGrowth(chartData.revenue);
  const orderGrowth = calculateGrowth(chartData.orders);

  // Calculate total users from analytics
  const totalUsersFromAnalytics = chartData.userAnalytics?.reduce((sum, item) => {
    return sum + (item.value || 0);
  }, 0) || 0;

  const kpiCards = [
    {
      title: "Tăng trưởng doanh thu",
      value: `${revenueGrowth}%`,
      change: revenueGrowth,
      icon: "📈",
      color: revenueGrowth >= 0 ? "text-green-600" : "text-red-600",
      bgColor: revenueGrowth >= 0 ? "bg-green-50" : "bg-red-50",
      borderColor: revenueGrowth >= 0 ? "border-green-200" : "border-red-200",
    },
    {
      title: "Tăng trưởng đơn hàng",
      value: `${orderGrowth}%`,
      change: orderGrowth,
      icon: "🛒",
      color: orderGrowth >= 0 ? "text-green-600" : "text-red-600",
      bgColor: orderGrowth >= 0 ? "bg-green-50" : "bg-red-50",
      borderColor: orderGrowth >= 0 ? "border-green-200" : "border-red-200",
    },
    {
      title: "Tỷ lệ chuyển đổi",
      value: "8.5%",
      change: 2.3,
      icon: "🎯",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      title: "Đánh giá trung bình",
      value: "4.6/5",
      change: 0.2,
      icon: "⭐",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
    },
  ];

  const formatChange = (change) => {
    const absChange = Math.abs(change);
    const isPositive = change >= 0;
    return (
      <span className={`inline-flex items-center text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? (
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
        {absChange}%
      </span>
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {kpiCards.map((card, index) => (
        <div
          key={index}
          className={`${card.bgColor} ${card.borderColor} border rounded-xl p-6 hover:shadow-lg transition-all duration-300`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                {card.title}
              </p>
              <p className={`text-2xl font-bold ${card.color}`}>
                {card.value}
              </p>
              <div className="mt-2">
                {formatChange(card.change)}
              </div>
            </div>
            <div className="text-3xl opacity-80">
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardKPICards;
