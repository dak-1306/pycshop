import React from "react";

const DashboardInsights = ({ data = {} }) => {
  const {
    topPerformingCategory = "Điện tử",
    peakTrafficTime = "18:00",
    conversionTrend = "up",
    revenueGrowth = 12.5,
    newUsersToday = 67,
  } = data;

  const insights = [
    {
      id: "peak-traffic",
      title: "Giờ cao điểm",
      value: peakTrafficTime,
      description: "Lưu lượng truy cập cao nhất trong ngày",
      color: "blue",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: "top-category",
      title: "Danh mục hàng đầu",
      value: topPerformingCategory,
      description: "Danh mục có doanh thu cao nhất",
      color: "green",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
    {
      id: "revenue-growth",
      title: "Tăng trưởng doanh thu",
      value: `+${revenueGrowth}%`,
      description: "So với tháng trước",
      color: revenueGrowth > 0 ? "green" : "red",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
    },
    {
      id: "new-users",
      title: "Người dùng mới hôm nay",
      value: newUsersToday,
      description: "Đăng ký trong 24h qua",
      color: "purple",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      ),
    },
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      blue: "text-blue-600 bg-blue-50 border-blue-200",
      green: "text-green-600 bg-green-50 border-green-200",
      red: "text-red-600 bg-red-50 border-red-200",
      purple: "text-purple-600 bg-purple-50 border-purple-200",
      orange: "text-orange-600 bg-orange-50 border-orange-200",
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Thông tin chi tiết</h3>
        <span className="text-sm text-gray-500">Cập nhật thời gian thực</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className={`p-4 rounded-lg border ${getColorClasses(insight.color)} transition-all duration-200 hover:shadow-md`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  {insight.icon}
                  <h4 className="font-medium text-sm">{insight.title}</h4>
                </div>
                <p className="text-2xl font-bold mb-1">{insight.value}</p>
                <p className="text-xs opacity-80">{insight.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Hành động nhanh</h4>
        <div className="flex flex-wrap gap-2">
          <button className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-full hover:bg-blue-100 transition-colors">
            Xem báo cáo chi tiết
          </button>
          <button className="px-3 py-1 text-xs font-medium text-green-600 bg-green-50 border border-green-200 rounded-full hover:bg-green-100 transition-colors">
            Xuất dữ liệu
          </button>
          <button className="px-3 py-1 text-xs font-medium text-purple-600 bg-purple-50 border border-purple-200 rounded-full hover:bg-purple-100 transition-colors">
            Cài đặt thông báo
          </button>
          <button className="px-3 py-1 text-xs font-medium text-orange-600 bg-orange-50 border border-orange-200 rounded-full hover:bg-orange-100 transition-colors">
            Tối ưu hóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardInsights;
