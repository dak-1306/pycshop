import React, { useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';

const DetailedAnalytics = ({ data }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Tổng quan', icon: '📊' },
    { id: 'trends', label: 'Xu hướng', icon: '📈' },
    { id: 'performance', label: 'Hiệu suất', icon: '⚡' },
    { id: 'insights', label: 'Thông tin chi tiết', icon: '🔍' }
  ];

  const renderOverviewTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Key Metrics Cards */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-xl">👥</span>
          </div>
          <span className="text-xs px-2 py-1 bg-blue-200 text-blue-700 rounded-full">+15%</span>
        </div>
        <h3 className="text-2xl font-bold text-blue-900 mb-1">1,547</h3>
        <p className="text-sm text-blue-700">Tổng người dùng</p>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-xl">💰</span>
          </div>
          <span className="text-xs px-2 py-1 bg-green-200 text-green-700 rounded-full">+23%</span>
        </div>
        <h3 className="text-2xl font-bold text-green-900 mb-1">₫487M</h3>
        <p className="text-sm text-green-700">Doanh thu</p>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-xl">📦</span>
          </div>
          <span className="text-xs px-2 py-1 bg-purple-200 text-purple-700 rounded-full">+8%</span>
        </div>
        <h3 className="text-2xl font-bold text-purple-900 mb-1">892</h3>
        <p className="text-sm text-purple-700">Đơn hàng</p>
      </div>

      <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-xl">📱</span>
          </div>
          <span className="text-xs px-2 py-1 bg-orange-200 text-orange-700 rounded-full">+12%</span>
        </div>
        <h3 className="text-2xl font-bold text-orange-900 mb-1">2,341</h3>
        <p className="text-sm text-orange-700">Sản phẩm</p>
      </div>
    </div>
  );

  const renderTrendsTab = () => (
    <div className="space-y-6">
      {/* Growth Chart Placeholder */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">📈 Xu hướng tăng trưởng (30 ngày qua)</h3>
        <div className="h-64 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <p className="text-gray-600">Biểu đồ xu hướng sẽ được hiển thị tại đây</p>
            <p className="text-sm text-gray-500 mt-1">Tích hợp với Chart.js hoặc Recharts</p>
          </div>
        </div>
      </div>

      {/* Trend Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <h4 className="font-semibold mb-3">🔥 Trending Up</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Đăng ký mới</span>
              <span className="text-green-600 font-medium">+34%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Doanh thu mobile</span>
              <span className="text-green-600 font-medium">+28%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Tương tác người dùng</span>
              <span className="text-green-600 font-medium">+19%</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <h4 className="font-semibold mb-3">📉 Needs Attention</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Tỷ lệ hoàn trả</span>
              <span className="text-red-600 font-medium">+12%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Thời gian phản hồi</span>
              <span className="text-yellow-600 font-medium">+5%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Số lượng khiếu nại</span>
              <span className="text-red-600 font-medium">+8%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPerformanceTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Performance Metrics */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">⚡ Hiệu suất hệ thống</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Thời gian phản hồi API</span>
              <span>120ms</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Uptime hệ thống</span>
              <span>99.9%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '99%' }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Tải Database</span>
              <span>45%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '45%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Monitoring */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">🚨 Giám sát lỗi</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
            <div>
              <span className="text-sm font-medium text-red-800">API Timeout</span>
              <p className="text-xs text-red-600">5 phút trước</p>
            </div>
            <span className="px-2 py-1 bg-red-200 text-red-800 text-xs rounded">High</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
            <div>
              <span className="text-sm font-medium text-yellow-800">Memory Usage</span>
              <p className="text-xs text-yellow-600">12 phút trước</p>
            </div>
            <span className="px-2 py-1 bg-yellow-200 text-yellow-800 text-xs rounded">Medium</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div>
              <span className="text-sm font-medium text-blue-800">Slow Query</span>
              <p className="text-xs text-blue-600">1 giờ trước</p>
            </div>
            <span className="px-2 py-1 bg-blue-200 text-blue-800 text-xs rounded">Low</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInsightsTab = () => (
    <div className="space-y-6">
      {/* AI Insights */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">🤖 AI Insights & Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-medium mb-2">💡 Khuyến nghị</h4>
            <p className="text-sm text-gray-600 mb-2">
              Tăng marketing cho danh mục "Điện tử" vào cuối tuần để tối ưu doanh thu.
            </p>
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">AI Suggested</span>
          </div>
          
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-medium mb-2">🎯 Cơ hội</h4>
            <p className="text-sm text-gray-600 mb-2">
              Người dùng từ 25-35 tuổi có xu hướng mua hàng cao nhất vào thứ 5-6.
            </p>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Data Insight</span>
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">🏆 Top Performers</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold">1</span>
                <div>
                  <p className="font-medium">Trần Tuấn Anh</p>
                  <p className="text-sm text-gray-600">Seller</p>
                </div>
              </div>
              <span className="font-bold text-green-600">₫45M</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white font-bold">2</span>
                <div>
                  <p className="font-medium">iPhone 14 Pro</p>
                  <p className="text-sm text-gray-600">Product</p>
                </div>
              </div>
              <span className="font-bold text-green-600">234 orders</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">📅 Upcoming Events</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-sm">Flash Sale Campaign</p>
                <p className="text-xs text-gray-600">Ngày mai, 9:00 AM</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-sm">Monthly Report Due</p>
                <p className="text-xs text-gray-600">15/10/2025, 5:00 PM</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-sm">System Maintenance</p>
                <p className="text-xs text-gray-600">20/10/2025, 2:00 AM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'trends': return renderTrendsTab();
      case 'performance': return renderPerformanceTab();
      case 'insights': return renderInsightsTab();
      default: return renderOverviewTab();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      {/* Tabs Header */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6 py-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-2 px-4 text-sm font-medium rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default DetailedAnalytics;
