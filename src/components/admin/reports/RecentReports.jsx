import React, { useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';

const RecentReports = ({ data, onUpdateReport, onDeleteReport, onViewDetails }) => {
  const { t } = useLanguage();
  const [selectedReport, setSelectedReport] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [actionNote, setActionNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

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
        return "bg-red-100 text-red-800 border-red-200";
      case "Product":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Shop":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Review":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };
  const getStatusLabel = (status) => {
    const statusLabels = {
      pending: t('pending'),
      in_progress: t('inProgress'), 
      resolved: t('resolved'),
      rejected: t('rejected'),
    };
    return statusLabels[status] || status;
  };
  const getReportTypeLabel = (type) => {
    const typeLabels = {
      User: t('userReport'),
      Product: t('productReport'), 
      Shop: t('shopReport'),
      Review: t('reviewReport'),
    };
    return typeLabels[type] || type;
  };

  const getPriorityLabel = (priority) => {
    const priorityLabels = {
      high: t('high'),
      medium: t('medium'),
      low: t('low'),
    };
    return priorityLabels[priority] || priority;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50";
      case "medium":
        return "text-yellow-600 bg-yellow-50";
      case "low":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const handleProcessReport = (report, action) => {
    setSelectedReport(report);
    setActionType(action);
    setShowActionModal(true);
    setActionNote('');
  };

  const handleConfirmAction = async () => {
    if (!selectedReport || !actionType) return;

    setIsProcessing(true);
    try {
      const updateData = {
        id: selectedReport.id,
        status: actionType === 'approve' ? 'resolved' : 
                actionType === 'reject' ? 'rejected' : 'in_progress',
        adminNote: actionNote,
        processedAt: new Date().toISOString(),
        processedBy: 'Current Admin' // Should be from auth context
      };

      await onUpdateReport(updateData);
      
      setShowActionModal(false);
      setSelectedReport(null);
      setActionNote('');
        // Show success message
      alert(`✅ ${t('reportProcessed')}`);
    } catch (error) {
      console.error('Error processing report:', error);        alert('❌ ' + (t('processingError') || 'Có lỗi xảy ra khi xử lý báo cáo'));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleViewDetails = (report) => {
    onViewDetails && onViewDetails(report);
  };

  const handleDeleteReport = async (reportId) => {    if (window.confirm(t('confirmDelete'))) {
      try {
        await onDeleteReport(reportId);
        alert(`✅ ${t('reportDeleted')}`);
      } catch (error) {
        console.error('Error deleting report:', error);
        alert('❌ ' + (t('deleteError') || 'Có lỗi xảy ra khi xóa báo cáo'));
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              📋 {t('recentReports')}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {t('recentReportsDescription')}
            </p>
          </div>
          <div className="flex items-center gap-2">            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
              {data?.length || 0} {t('totalReports').toLowerCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="p-6">
        {data && data.length > 0 ? (
          <div className="space-y-4">
            {data.map((report) => (
              <div
                key={report.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:border-blue-300"
              >
                {/* Report Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getReportTypeColor(report.type)}`}>
                      {getReportTypeLabel(report.type)}
                    </span>
                    <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(report.status)}`}>
                      {getStatusLabel(report.status)}
                    </span>
                    {report.priority && (
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${getPriorityColor(report.priority)}`}>
                        🔥 {getPriorityLabel(report.priority)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-500">#{report.id}</span>
                    <div className="flex items-center gap-1 ml-2">
                      <button
                        onClick={() => handleViewDetails(report)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        title={t('viewReport')}
                      >
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteReport(report.id)}
                        className="p-1 hover:bg-red-100 rounded transition-colors"
                        title={t('deleteReport')}
                      >
                        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Report Content */}
                <div className="mb-3">
                  <p className="font-medium text-gray-900 mb-2">{report.reason}</p>
                  {report.description && (
                    <p className="text-sm text-gray-600 mb-2">{report.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{t('reportedBy')}: <span className="font-medium text-gray-700">{report.reportedBy}</span></span>
                    <span>•</span>
                    <span>{formatDate(report.createdAt)}</span>
                  </div>
                </div>

                {/* Report Actions */}
                {report.status !== 'resolved' && report.status !== 'rejected' && (
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleProcessReport(report, 'approve')}
                      className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-medium rounded-md transition-colors flex items-center gap-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>                      {t('approveReport')}
                    </button>
                    <button
                      onClick={() => handleProcessReport(report, 'reject')}
                      className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-medium rounded-md transition-colors flex items-center gap-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      {t('rejectReport')}
                    </button>
                    <button
                      onClick={() => handleProcessReport(report, 'investigate')}
                      className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded-md transition-colors flex items-center gap-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>                      {t('investigateReport')}
                    </button>
                  </div>
                )}

                {/* Processed Info */}
                {(report.status === 'resolved' || report.status === 'rejected') && report.processedBy && (
                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{t('processedBy')}: <span className="font-medium">{report.processedBy}</span></span>
                      {report.processedAt && (
                        <>
                          <span>•</span>
                          <span>{formatDate(report.processedAt)}</span>
                        </>
                      )}
                    </div>
                    {report.adminNote && (
                      <p className="text-xs text-gray-600 mt-1 italic">{t('adminNote')}: {report.adminNote}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl text-gray-400">📋</span>
            </div>            <p className="text-gray-500 mb-2">{t('noData')}</p>
            <p className="text-sm text-gray-400">{t('noReportsMessage') || 'Tất cả báo cáo đã được xử lý hoặc chưa có báo cáo mới'}</p>
          </div>
        )}
      </div>

      {/* Action Modal */}
      {showActionModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">              <h3 className="text-lg font-semibold">
                {actionType === 'approve' ? `✅ ${t('approveReport')}` :
                 actionType === 'reject' ? `❌ ${t('rejectReport')}` : `🔍 ${t('investigateReport')}`}
              </h3>
              <button
                onClick={() => setShowActionModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-4">              <p className="text-sm text-gray-600 mb-2">{t('reportReason')}: <span className="font-medium">{selectedReport.reason}</span></p>
              <p className="text-sm text-gray-600">{t('reportId')}: #{selectedReport.id}</p>
            </div>

            <div className="mb-4">              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('adminNote')}
              </label>
              <textarea
                value={actionNote}
                onChange={(e) => setActionNote(e.target.value)}
                placeholder={`${t('addNote')}...`}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleConfirmAction}
                disabled={isProcessing}
                className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
                  actionType === 'approve' ? 'bg-green-500 hover:bg-green-600' :
                  actionType === 'reject' ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
                } text-white disabled:opacity-50`}
              >                {isProcessing ? t('processingReport') : t('confirm')}
              </button>
              <button
                onClick={() => setShowActionModal(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md font-medium transition-colors"
              >
                {t('cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentReports;
