import React from "react";

const AdminChartsSection = ({ chartData }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      {/* Revenue Chart */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Doanh thu theo tháng
          </h3>
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option value="2024">2024</option>
            <option value="2023">2023</option>
          </select>
        </div>
        <div className="h-64 flex items-end justify-between space-x-2">
          {chartData?.revenue?.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-blue-500 rounded-t-sm hover:bg-blue-600 transition-colors cursor-pointer relative group"
                style={{
                  height: `${
                    (item.value /
                      Math.max(...chartData.revenue.map((d) => d.value))) *
                    200
                  }px`,
                }}
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {formatCurrency(item.value)}
                </div>
              </div>
              <span className="text-xs text-gray-600 mt-2">{item.month}</span>
            </div>
          )) || (
            <div className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <p className="text-gray-500 text-sm">
                  Biểu đồ doanh thu theo tháng
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Orders Chart */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Đơn hàng theo tháng
          </h3>
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option value="2024">2024</option>
            <option value="2023">2023</option>
          </select>
        </div>
        <div className="h-64 flex items-end justify-between space-x-2">
          {chartData?.orders?.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-green-500 rounded-t-sm hover:bg-green-600 transition-colors cursor-pointer relative group"
                style={{
                  height: `${
                    (item.value /
                      Math.max(...chartData.orders.map((d) => d.value))) *
                    200
                  }px`,
                }}
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.value.toLocaleString()}
                </div>
              </div>
              <span className="text-xs text-gray-600 mt-2">{item.month}</span>
            </div>
          )) || (
            <div className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <p className="text-gray-500 text-sm">
                  Biểu đồ đơn hàng theo tháng
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminChartsSection;
