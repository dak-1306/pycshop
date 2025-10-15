import { useState, useEffect } from 'react';

export const useRecentReports = () => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    priority: 'all',
    dateRange: 'week'
  });

  // Mock data - trong thực tế sẽ gọi API
  const mockReports = [
    {
      id: 'RPT001',
      type: 'User',
      reason: 'Hành vi lừa đảo',
      description: 'Người dùng này đã lừa đảo nhiều khách hàng, không giao hàng sau khi nhận tiền',
      reportedBy: 'Nguyễn Văn A',
      reportedUserId: 'U123',
      status: 'pending',
      priority: 'high',
      createdAt: '2025-10-10T14:30:00Z',
      evidence: ['screenshot1.jpg', 'chat_log.txt'],
      reporterEmail: 'nguyenvana@email.com'
    },
    {
      id: 'RPT002', 
      type: 'Product',
      reason: 'Sản phẩm giả mạo',
      description: 'Sản phẩm được quảng cáo là hàng chính hãng nhưng thực tế là hàng giả',
      reportedBy: 'Trần Thị B',
      reportedProductId: 'P456',
      status: 'in_progress',
      priority: 'medium',
      createdAt: '2025-10-09T16:45:00Z',
      processedBy: 'Admin User',
      adminNote: 'Đang kiểm tra với nhà cung cấp',
      evidence: ['product_comparison.jpg']
    },
    {
      id: 'RPT003',
      type: 'Shop',
      reason: 'Cửa hàng không phản hồi',
      description: 'Đã liên hệ nhiều lần nhưng cửa hàng không phản hồi về đơn hàng bị lỗi',
      reportedBy: 'Lê Văn C',
      reportedShopId: 'S789',
      status: 'resolved',
      priority: 'low',
      createdAt: '2025-10-08T10:20:00Z',
      processedAt: '2025-10-09T09:15:00Z',
      processedBy: 'Admin Manager',
      adminNote: 'Đã liên hệ và giải quyết xong với cửa hàng',
      resolution: 'Cửa hàng đã hoàn tiền và xin lỗi khách hàng'
    },
    {
      id: 'RPT004',
      type: 'Review',
      reason: 'Đánh giá spam',
      description: 'Nhiều đánh giá 5 sao giống nhau được tạo cùng lúc từ các tài khoản khác nhau',
      reportedBy: 'Phạm Thị D',
      reportedReviewIds: ['R101', 'R102', 'R103'],
      status: 'pending',
      priority: 'medium',
      createdAt: '2025-10-07T20:10:00Z',
      evidence: ['review_patterns.png', 'account_analysis.xlsx']
    },
    {
      id: 'RPT005',
      type: 'User',
      reason: 'Ngôn ngữ không phù hợp',
      description: 'Sử dụng từ ngữ thô tục, xúc phạm trong các bình luận và tin nhắn',
      reportedBy: 'Võ Văn E',
      reportedUserId: 'U567',
      status: 'rejected',
      priority: 'low',
      createdAt: '2025-10-06T13:25:00Z',
      processedAt: '2025-10-07T11:30:00Z',
      processedBy: 'Admin User',
      adminNote: 'Nội dung không đủ bằng chứng vi phạm nghiêm trọng',
      rejectionReason: 'Thiếu bằng chứng cụ thể'
    }
  ];

  // Simulate API call
  useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Apply filters
        let filteredReports = mockReports.filter(report => {
          if (filters.status !== 'all' && report.status !== filters.status) {
            return false;
          }
          if (filters.type !== 'all' && report.type !== filters.type) {
            return false;
          }
          if (filters.priority !== 'all' && report.priority !== filters.priority) {
            return false;
          }
          
          // Date range filter
          const reportDate = new Date(report.createdAt);
          const now = new Date();
          const daysDiff = Math.floor((now - reportDate) / (1000 * 60 * 60 * 24));
          
          switch (filters.dateRange) {
            case 'today':
              return daysDiff === 0;
            case 'week':
              return daysDiff <= 7;
            case 'month':
              return daysDiff <= 30;
            default:
              return true;
          }
        });

        // Sort by date (newest first)
        filteredReports.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setReports(filteredReports);
      } catch (err) {
        setError('Có lỗi xảy ra khi tải dữ liệu báo cáo');
        console.error('Error fetching reports:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, [filters]);

  // Actions
  const updateReport = async (updateData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setReports(prevReports => 
        prevReports.map(report => 
          report.id === updateData.id 
            ? { ...report, ...updateData }
            : report
        )
      );
      
      return { success: true, message: 'Cập nhật báo cáo thành công' };
    } catch (error) {
      console.error('Error updating report:', error);
      throw new Error('Không thể cập nhật báo cáo');
    }
  };

  const deleteReport = async (reportId) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setReports(prevReports => 
        prevReports.filter(report => report.id !== reportId)
      );
      
      return { success: true, message: 'Xóa báo cáo thành công' };
    } catch (error) {
      console.error('Error deleting report:', error);
      throw new Error('Không thể xóa báo cáo');
    }
  };

  const viewReportDetails = (report) => {
    // In a real app, this might open a modal or navigate to detail page
    console.log('Viewing report details:', report);
    
    // For now, just show an alert with details
    const details = `
Báo cáo #${report.id}
Loại: ${report.type}
Lý do: ${report.reason}
Mô tả: ${report.description}
Người báo cáo: ${report.reportedBy}
Trạng thái: ${report.status}
Mức độ ưu tiên: ${report.priority}
Ngày tạo: ${new Date(report.createdAt).toLocaleString('vi-VN')}
${report.adminNote ? `Ghi chú admin: ${report.adminNote}` : ''}
    `;
    
    alert(details);
  };

  const refreshReports = () => {
    setFilters({ ...filters }); // Trigger useEffect
  };

  const getReportStats = () => {
    const stats = {
      total: reports.length,
      pending: reports.filter(r => r.status === 'pending').length,
      inProgress: reports.filter(r => r.status === 'in_progress').length,
      resolved: reports.filter(r => r.status === 'resolved').length,
      rejected: reports.filter(r => r.status === 'rejected').length,
      highPriority: reports.filter(r => r.priority === 'high').length,
      byType: {
        User: reports.filter(r => r.type === 'User').length,
        Product: reports.filter(r => r.type === 'Product').length,
        Shop: reports.filter(r => r.type === 'Shop').length,
        Review: reports.filter(r => r.type === 'Review').length,
      }
    };
    
    return stats;
  };

  return {
    // Data
    reports,
    isLoading,
    error,
    filters,
    stats: getReportStats(),
    
    // Actions
    setFilters,
    updateReport,
    deleteReport,
    viewReportDetails,
    refreshReports,
  };
};
