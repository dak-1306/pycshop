class ReportExportService {
  constructor() {
    this.supportedFormats = ['json', 'csv', 'excel', 'pdf'];
  }

  /**
   * Export report data in the specified format
   * @param {Object} reportData - The report data to export
   * @param {string} format - Export format (json, csv, excel, pdf)
   * @param {string} filename - Custom filename (optional)
   */
  async exportReport(reportData, format = 'json', filename = null) {
    try {
      const timestamp = new Date().toISOString().split('T')[0];
      const defaultFilename = filename || `pycshop-report-${timestamp}`;

      switch (format.toLowerCase()) {
        case 'json':
          return this.exportJSON(reportData, defaultFilename);
        case 'csv':
          return this.exportCSV(reportData, defaultFilename);
        case 'excel':
          return this.exportExcel(reportData, defaultFilename);
        case 'pdf':
          return this.exportPDF(reportData, defaultFilename);
        default:
          throw new Error(`Unsupported format: ${format}`);
      }
    } catch (error) {
      console.error('Export failed:', error);
      throw error;
    }
  }

  /**
   * Export as JSON format
   */
  exportJSON(reportData, filename) {
    const formattedData = {
      exportInfo: {
        generatedAt: new Date().toISOString(),
        exportedBy: 'PycShop Admin',
        format: 'JSON',
        version: '1.0'
      },
      dateRange: {
        startDate: reportData.dateRange?.startDate || null,
        endDate: reportData.dateRange?.endDate || null
      },
      summary: {
        totalUsers: reportData.overviewStats?.totalUsers || 0,
        totalOrders: reportData.overviewStats?.totalOrders || 0,
        totalProducts: reportData.overviewStats?.totalProducts || 0,
        totalRevenue: reportData.overviewStats?.totalRevenue || 0
      },
      detailed: reportData
    };

    const dataStr = JSON.stringify(formattedData, null, 2);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    
    this.downloadFile(dataUri, `${filename}.json`);
    return { success: true, message: 'JSON report exported successfully' };
  }

  /**
   * Export as CSV format
   */
  exportCSV(reportData, filename) {
    const csvData = [];
    
    // Header
    csvData.push(['PycShop Admin Report']);
    csvData.push(['Generated:', new Date().toLocaleString('vi-VN')]);
    csvData.push([]);

    // Overview Statistics
    csvData.push(['Overview Statistics']);
    csvData.push(['Metric', 'Value']);
    
    const overview = reportData.overviewStats || {};
    csvData.push(['Total Users', overview.totalUsers || 0]);
    csvData.push(['Total Orders', overview.totalOrders || 0]);
    csvData.push(['Total Products', overview.totalProducts || 0]);
    csvData.push(['Total Revenue (VND)', (overview.totalRevenue || 0).toLocaleString('vi-VN')]);
    csvData.push(['Active Users', overview.activeUsers || 0]);
    csvData.push(['Pending Orders', overview.pendingOrders || 0]);
    csvData.push(['Out of Stock Products', overview.outOfStockProducts || 0]);
    csvData.push([]);

    // User Analytics
    const userAnalytics = reportData.userAnalytics || {};
    csvData.push(['User Analytics']);
    csvData.push(['New Users This Month', userAnalytics.newUsersThisMonth || 0]);
    csvData.push(['Buyers', userAnalytics.usersByRole?.buyers || 0]);
    csvData.push(['Sellers', userAnalytics.usersByRole?.sellers || 0]);
    csvData.push([]);

    // Financial Data
    const financialData = reportData.financialData || {};
    csvData.push(['Financial Data']);
    csvData.push(['Revenue This Month (VND)', (financialData.revenueThisMonth || 0).toLocaleString('vi-VN')]);
    csvData.push(['Revenue Last Month (VND)', (financialData.revenueLastMonth || 0).toLocaleString('vi-VN')]);
    csvData.push(['Revenue Growth (%)', financialData.revenueGrowth || 0]);

    const csvContent = csvData.map(row => 
      row.map(cell => `"${cell}"`).join(',')
    ).join('\n');

    const dataUri = "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent);
    this.downloadFile(dataUri, `${filename}.csv`);
    
    return { success: true, message: 'CSV report exported successfully' };
  }

  /**
   * Export as Excel format (HTML table for Excel compatibility)
   */
  exportExcel(reportData, filename) {
    const overview = reportData.overviewStats || {};
    const userAnalytics = reportData.userAnalytics || {};
    const orderAnalytics = reportData.orderAnalytics || {};
    const financialData = reportData.financialData || {};

    const excelContent = `
      <html>
        <head>
          <meta charset="utf-8">
          <title>PycShop Admin Report</title>
          <style>
            body { font-family: Arial, sans-serif; }
            .header { background-color: #4F46E5; color: white; padding: 10px; }
            .section { margin: 20px 0; }
            .section-title { background-color: #E5E7EB; padding: 8px; font-weight: bold; }
            table { border-collapse: collapse; width: 100%; margin: 10px 0; }
            th, td { border: 1px solid #D1D5DB; padding: 8px; text-align: left; }
            th { background-color: #F3F4F6; }
            .number { text-align: right; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>📊 PycShop Admin Report</h1>
            <p>Generated: ${new Date().toLocaleString('vi-VN')}</p>
          </div>

          <div class="section">
            <div class="section-title">📈 Overview Statistics</div>
            <table>
              <tr><th>Metric</th><th>Value</th></tr>
              <tr><td>Total Users</td><td class="number">${(overview.totalUsers || 0).toLocaleString()}</td></tr>
              <tr><td>Total Orders</td><td class="number">${(overview.totalOrders || 0).toLocaleString()}</td></tr>
              <tr><td>Total Products</td><td class="number">${(overview.totalProducts || 0).toLocaleString()}</td></tr>
              <tr><td>Total Revenue (VND)</td><td class="number">${(overview.totalRevenue || 0).toLocaleString('vi-VN')}</td></tr>
              <tr><td>Active Users</td><td class="number">${(overview.activeUsers || 0).toLocaleString()}</td></tr>
              <tr><td>Pending Orders</td><td class="number">${(overview.pendingOrders || 0).toLocaleString()}</td></tr>
            </table>
          </div>

          <div class="section">
            <div class="section-title">👥 User Analytics</div>
            <table>
              <tr><th>Metric</th><th>Value</th></tr>
              <tr><td>New Users This Month</td><td class="number">${(userAnalytics.newUsersThisMonth || 0).toLocaleString()}</td></tr>
              <tr><td>Buyers</td><td class="number">${(userAnalytics.usersByRole?.buyers || 0).toLocaleString()}</td></tr>
              <tr><td>Sellers</td><td class="number">${(userAnalytics.usersByRole?.sellers || 0).toLocaleString()}</td></tr>
            </table>
          </div>

          <div class="section">
            <div class="section-title">📦 Order Analytics</div>
            <table>
              <tr><th>Metric</th><th>Value</th></tr>
              <tr><td>Orders This Month</td><td class="number">${(orderAnalytics.ordersThisMonth || 0).toLocaleString()}</td></tr>
              <tr><td>Average Order Value (VND)</td><td class="number">${(orderAnalytics.averageOrderValue || 0).toLocaleString('vi-VN')}</td></tr>
              <tr><td>Pending Orders</td><td class="number">${(orderAnalytics.ordersByStatus?.pending || 0).toLocaleString()}</td></tr>
              <tr><td>Completed Orders</td><td class="number">${(orderAnalytics.ordersByStatus?.shipped || 0).toLocaleString()}</td></tr>
            </table>
          </div>

          <div class="section">
            <div class="section-title">💰 Financial Summary</div>
            <table>
              <tr><th>Metric</th><th>Value</th></tr>
              <tr><td>Revenue This Month (VND)</td><td class="number">${(financialData.revenueThisMonth || 0).toLocaleString('vi-VN')}</td></tr>
              <tr><td>Revenue Last Month (VND)</td><td class="number">${(financialData.revenueLastMonth || 0).toLocaleString('vi-VN')}</td></tr>
              <tr><td>Revenue Growth</td><td class="number">${financialData.revenueGrowth || 0}%</td></tr>
            </table>
          </div>
        </body>
      </html>
    `;

    const dataUri = "data:application/vnd.ms-excel;charset=utf-8," + encodeURIComponent(excelContent);
    this.downloadFile(dataUri, `${filename}.xls`);
    
    return { success: true, message: 'Excel report exported successfully' };
  }

  /**
   * Export as PDF format (HTML for PDF conversion)
   */
  exportPDF(reportData, filename) {
    // This would typically use a library like jsPDF or Puppeteer
    // For now, we'll create an HTML version that can be printed to PDF
    const overview = reportData.overviewStats || {};
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>PycShop Admin Report</title>
          <style>
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              margin: 0; 
              padding: 20px; 
              background: #f8f9fa;
            }
            .container { 
              max-width: 800px; 
              margin: 0 auto; 
              background: white; 
              padding: 30px; 
              box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }
            .header { 
              text-align: center; 
              border-bottom: 3px solid #4F46E5; 
              padding-bottom: 20px; 
              margin-bottom: 30px; 
            }
            .stats-grid { 
              display: grid; 
              grid-template-columns: repeat(2, 1fr); 
              gap: 20px; 
              margin: 20px 0; 
            }
            .stat-card { 
              border: 1px solid #e5e7eb; 
              padding: 15px; 
              border-radius: 8px; 
              background: #f9fafb;
            }
            .stat-value { 
              font-size: 24px; 
              font-weight: bold; 
              color: #1f2937; 
            }
            .stat-label { 
              color: #6b7280; 
              font-size: 14px; 
            }
            @media print {
              body { background: white; }
              .container { box-shadow: none; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📊 PycShop Admin Report</h1>
              <p>Generated: ${new Date().toLocaleString('vi-VN')}</p>
            </div>
            
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-value">${(overview.totalUsers || 0).toLocaleString()}</div>
                <div class="stat-label">Total Users</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${(overview.totalOrders || 0).toLocaleString()}</div>
                <div class="stat-label">Total Orders</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${(overview.totalProducts || 0).toLocaleString()}</div>
                <div class="stat-label">Total Products</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">₫${(overview.totalRevenue || 0).toLocaleString('vi-VN')}</div>
                <div class="stat-label">Total Revenue</div>
              </div>
            </div>
          </div>
          
          <script>
            // Auto-print when opened
            window.onload = function() {
              setTimeout(() => {
                window.print();
              }, 1000);
            }
          </script>
        </body>
      </html>
    `;

    // Open in new window for printing
    const newWindow = window.open('', '_blank');
    newWindow.document.write(htmlContent);
    newWindow.document.close();
    
    return { success: true, message: 'PDF report opened for printing' };
  }

  /**
   * Download file helper
   */
  downloadFile(dataUri, filename) {
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', filename);
    linkElement.style.display = 'none';
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
  }

  /**
   * Get available export formats
   */
  getAvailableFormats() {
    return this.supportedFormats.map(format => ({
      value: format,
      label: format.toUpperCase(),
      description: this.getFormatDescription(format)
    }));
  }

  /**
   * Get format description
   */
  getFormatDescription(format) {
    const descriptions = {
      json: 'Dữ liệu JSON đầy đủ cho developers',
      csv: 'Bảng CSV tương thích với Excel',
      excel: 'File Excel với định dạng đẹp',
      pdf: 'Báo cáo PDF để in ấn'
    };
    return descriptions[format] || 'Định dạng xuất dữ liệu';
  }
}

export default new ReportExportService();
