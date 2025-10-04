import React from "react";

const ViolationReports = ({ data }) => {
  const formatNumber = (num) => {
    return new Intl.NumberFormat("vi-VN").format(num);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getReportTypeColor = (type) => {
    switch (type) {
      case "User":
        return "bg-red-100 text-red-800";
      case "Product":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "in_progress":
        return "Đang xử lý";
      case "resolved":
        return "Đã giải quyết";
      default:
        return status;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
          ⚠️ Báo cáo vi phạm
        </h3>
        <p className="text-sm text-gray-600">
          Theo dõi và quản lý các báo cáo vi phạm từ người dùng
        </p>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-red-50 rounded-lg p-4 text-center">
          <p className="text-sm font-medium text-red-600 mb-1">Tổng báo cáo</p>
          <p className="text-2xl font-bold text-red-900">
            {formatNumber(data.totalReports)}
          </p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4 text-center">
          <p className="text-sm font-medium text-yellow-600 mb-1">Đang xử lý</p>
          <p className="text-2xl font-bold text-yellow-900">
            {formatNumber(data.pendingReports)}
          </p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <p className="text-sm font-medium text-green-600 mb-1">
            Đã giải quyết
          </p>
          <p className="text-2xl font-bold text-green-900">
            {formatNumber(data.resolvedReports)}
          </p>
        </div>
      </div>

      {/* Reports by Type */}
      <div className="mb-6">
        <h4 className="text-md font-semibold text-gray-800 mb-3">
          Phân loại báo cáo
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">
              Báo cáo người dùng
            </span>
            <span className="font-bold text-red-600">
              {formatNumber(data.reportsByType.User)}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">
              Báo cáo sản phẩm
            </span>
            <span className="font-bold text-orange-600">
              {formatNumber(data.reportsByType.Product)}
            </span>
          </div>
        </div>
      </div>

      {/* Recent Reports */}
      <div>
        <h4 className="text-md font-semibold text-gray-800 mb-3">
          Báo cáo gần đây
        </h4>
        {data.recentReports.length > 0 ? (
          <div className="space-y-3">
            {data.recentReports.map((report) => (
              <div
                key={report.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getReportTypeColor(
                        report.type
                      )}`}
                    >
                      {report.type === "User" ? "Người dùng" : "Sản phẩm"}
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                        report.status
                      )}`}
                    >
                      {getStatusLabel(report.status)}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">#{report.id}</span>
                </div>

                <div className="mb-2">
                  <p className="font-medium text-gray-900 mb-1">
                    {report.reason}
                  </p>
                  <p className="text-sm text-gray-600">
                    Được báo cáo bởi:{" "}
                    <span className="font-medium">{report.reportedBy}</span>
                  </p>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    {formatDate(report.createdAt)}
                  </span>
                  {report.status === "in_progress" && (
                    <button className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded transition-colors">
                      Xử lý ngay
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl text-gray-400">📋</span>
            </div>
            <p className="text-gray-500">Không có báo cáo vi phạm nào</p>
          </div>
        )}
      </div>

      {/* Action Required Alert */}
      {data.pendingReports > 0 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600">🚨</span>
            </div>
            <div>
              <p className="font-semibold text-red-900">
                {formatNumber(data.pendingReports)} báo cáo cần xử lý
              </p>
              <p className="text-sm text-red-700">
                Vui lòng kiểm tra và xử lý các báo cáo đang chờ
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViolationReports;
