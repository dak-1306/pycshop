import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const UserActivityChart = ({ data = [], title = "Hoạt động người dùng" }) => {
  // Default data if none provided
  const defaultData = [
    { time: "00:00", users: 120, sessions: 89 },
    { time: "03:00", users: 95, sessions: 62 },
    { time: "06:00", users: 180, sessions: 134 },
    { time: "09:00", users: 380, sessions: 289 },
    { time: "12:00", users: 520, sessions: 412 },
    { time: "15:00", users: 480, sessions: 378 },
    { time: "18:00", users: 640, sessions: 498 },
    { time: "21:00", users: 580, sessions: 445 },
  ];

  const chartData = data.length > 0 ? data : defaultData;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{`Thời gian: ${label}`}</p>
          <p className="text-blue-600">
            {`Người dùng online: ${payload[0]?.value?.toLocaleString('vi-VN') || 0}`}
          </p>
          <p className="text-green-600">
            {`Phiên hoạt động: ${payload[1]?.value?.toLocaleString('vi-VN') || 0}`}
          </p>
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
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Người dùng online</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Phiên hoạt động</span>
          </div>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
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
              dataKey="time" 
              tick={{ fontSize: 12 }}
              stroke="#666"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              stroke="#666"
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="sessions"
              stackId="1"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="users"
              stackId="2"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.6}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <span>Area Chart</span>
        <span>Cập nhật mỗi 5 phút</span>
      </div>
    </div>
  );
};

export default UserActivityChart;
