import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../../context/LanguageContext';

const RealTimeStats = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState({
    activeUsers: 0,
    onlineVisitors: 0,
    todayOrders: 0,
    todayRevenue: 0,
    pendingActions: 0,
    systemLoad: 0
  });
  
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prevStats => ({
        activeUsers: Math.floor(Math.random() * 50) + 400,
        onlineVisitors: Math.floor(Math.random() * 20) + 80,
        todayOrders: prevStats.todayOrders + Math.floor(Math.random() * 3),
        todayRevenue: prevStats.todayRevenue + Math.floor(Math.random() * 500000),
        pendingActions: Math.floor(Math.random() * 10) + 5,
        systemLoad: Math.floor(Math.random() * 30) + 45
      }));
      setLastUpdate(new Date());
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const statCards = [
    {
      title: 'Người dùng hoạt động',
      value: stats.activeUsers,
      icon: '👥',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      trend: '+12%'
    },
    {
      title: 'Khách trực tuyến',
      value: stats.onlineVisitors,
      icon: '🌐',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      trend: '+5%'
    },
    {
      title: 'Đơn hàng hôm nay',
      value: stats.todayOrders,
      icon: '📦',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      trend: '+23%'
    },
    {
      title: 'Doanh thu hôm nay',
      value: `${stats.todayRevenue.toLocaleString('vi-VN')} ₫`,
      icon: '💰',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      trend: '+18%'
    },
    {
      title: 'Hành động chờ xử lý',
      value: stats.pendingActions,
      icon: '⏳',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      trend: '-2%'
    },
    {
      title: 'Tải hệ thống',
      value: `${stats.systemLoad}%`,
      icon: '⚡',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      trend: '+3%'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            📊 Thống kê thời gian thực
            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              LIVE
            </span>
          </h3>
          <p className="text-sm text-gray-500">
            Cập nhật lần cuối: {lastUpdate.toLocaleTimeString('vi-VN')}
          </p>
        </div>
        
        <button
          onClick={() => {
            setStats(prev => ({
              ...prev,
              activeUsers: Math.floor(Math.random() * 50) + 400,
              onlineVisitors: Math.floor(Math.random() * 20) + 80
            }));
            setLastUpdate(new Date());
          }}
          className="px-3 py-1.5 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition-colors flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Làm mới
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className={`${stat.bgColor} rounded-lg p-4 border-l-4 border-l-current transition-all hover:shadow-md`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{stat.icon}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                stat.trend.startsWith('+') 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {stat.trend}
              </span>
            </div>
            
            <div className={`text-2xl font-bold ${stat.color} mb-1`}>
              {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
            </div>
            
            <div className="text-sm text-gray-600 font-medium">
              {stat.title}
            </div>
          </div>
        ))}
      </div>

      {/* System Health Indicators */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Tình trạng hệ thống</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">Database</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-700">Hoạt động</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">API Gateway</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-700">Hoạt động</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">Microservices</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm font-medium text-yellow-700">Cảnh báo</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeStats;
