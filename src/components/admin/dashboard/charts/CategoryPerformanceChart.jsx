import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CategoryPerformanceChart = ({ data = [], title = "Hiệu suất danh mục" }) => {
  // Default data if none provided
  const defaultData = [
    { category: "Điện tử", sales: 1250, revenue: 2800000000 },
    { category: "Thời trang", sales: 980, revenue: 1900000000 },
    { category: "Gia dụng", sales: 750, revenue: 1200000000 },
    { category: "Sách", sales: 420, revenue: 350000000 },
    { category: "Thể thao", sales: 680, revenue: 950000000 },
    { category: "Làm đẹp", sales: 890, revenue: 1450000000 },
  ];

  const chartData = data.length > 0 ? data : defaultData;

  // Format currency for display
  const formatCurrency = (value) => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)}B`;
    } else if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-purple-600">
            {`Doanh số: ${payload[0].value.toLocaleString('vi-VN')} sản phẩm`}
          </p>
          {payload[1] && (
            <p className="text-orange-600">
              {`Doanh thu: ${payload[1].value.toLocaleString('vi-VN')} VNĐ`}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Doanh số</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Doanh thu</span>
          </div>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="category" 
              tick={{ fontSize: 12 }}
              stroke="#666"
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              yAxisId="left"
              tick={{ fontSize: 12 }}
              stroke="#666"
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              tickFormatter={formatCurrency}
              tick={{ fontSize: 12 }}
              stroke="#666"
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              yAxisId="left"
              dataKey="sales" 
              fill="#8b5cf6"
              radius={[2, 2, 0, 0]}
              className="hover:opacity-80 transition-opacity"
            />
            <Bar 
              yAxisId="right"
              dataKey="revenue" 
              fill="#f97316"
              radius={[2, 2, 0, 0]}
              className="hover:opacity-80 transition-opacity"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <span>Dual Bar Chart</span>
        <span>Dữ liệu thời gian thực</span>
      </div>
    </div>
  );
};

export default CategoryPerformanceChart;
