import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import ChartDetailModal from "./ChartDetailModal";

const UserAnalyticsChart = ({ data = [], title = "Phân tích người dùng" }) => {
  const [showDetailModal, setShowDetailModal] = useState(false);
  // Default data if none provided
  const defaultData = [
    { name: "Người mua", value: 65, color: "#3b82f6" },
    { name: "Người bán", value: 25, color: "#10b981" },
    { name: "Admin", value: 10, color: "#f59e0b" },
  ];

  const chartData = data.length > 0 ? data : defaultData;
  const COLORS = chartData.map(item => item.color || "#8884d8");

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{data.name}</p>
          <p style={{ color: data.payload.color }}>
            {`Tỉ lệ: ${data.value}%`}
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom label function
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow duration-300">      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">Phân loại theo vai trò</div>
          <button
            onClick={() => setShowDetailModal(true)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
          >
            Chi tiết
          </button>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value, entry) => (
                <span style={{ color: entry.color }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <span>Pie Chart</span>
        <span>Dữ liệu thời gian thực</span>
      </div>

      {/* Detail Modal */}
      <ChartDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title={title}
        data={chartData}
      >
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </ChartDetailModal>
    </div>
  );
};

export default UserAnalyticsChart;
