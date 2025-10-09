import { useState } from 'react';
import { Search, FileText, Eye, Download, Calendar } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const RenderDocuments = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    month: new Date().getMonth() + 1, // Current month
    year: new Date().getFullYear()    // Current year
  });

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];

  // Generate years from current year to 5 years back
  const years = Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i);

  const getDaysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
  };

  const formatDateForAPI = (day, month, year) => {
    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
  };

  const fetchReportData = async (month, year) => {
    setLoading(true);
    setError('');
    setReportData(null);
    
    try {
      const startDate = formatDateForAPI(1, month, year);
      const endDate = formatDateForAPI(getDaysInMonth(month, year), month, year);
      
      console.log('Fetching report for:', { startDate, endDate });
      
      const response = await fetch('http://137.97.126.110:5500/api/v1/Dashboard/getReports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          startDate,
          endDate
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      if (data.success && data.data && data.data.length > 0) {
        setReportData(data.data[0]);
        setError('');
      } else {
        setError('No report data found for the selected period');
        setReportData(null);
      }
    } catch (err) {
      console.error('Error fetching report:', err);
      setError(`Failed to fetch report data: ${err.message}`);
      setReportData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleViewReport = () => {
    setIsModalOpen(true);
    // Fetch data when modal opens with current filters
    fetchReportData(filters.month, filters.year);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = {
      ...filters,
      [key]: parseInt(value)
    };
    setFilters(newFilters);
  };

  const handleApplyFilter = () => {
    fetchReportData(filters.month, filters.year);
  };

  const downloadPDF = () => {
    if (!reportData) return;

    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(16);
    doc.text('Employee Monthly Report', 105, 15, { align: 'center' });
    
    // Report period
    doc.setFontSize(10);
    const monthName = months.find(m => m.value === filters.month)?.label;
    doc.text(`Period: ${monthName} ${filters.year}`, 105, 22, { align: 'center' });
    
    // Employee Information
    doc.setFontSize(12);
    doc.text('Employee Information', 14, 35);
    doc.autoTable({
      startY: 40,
      head: [['Field', 'Value']],
      body: [
        ['Name', reportData.Name || 'N/A'],
        ['Employee ID', reportData.EmpId || 'N/A'],
        ['Email', reportData.email || 'N/A'],
        ['Report Date', reportData.DateString || `${monthName} ${filters.year}`]
      ],
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [66, 139, 202] }
    });

    // Attendance Summary
    doc.text('Attendance Summary', 14, doc.lastAutoTable.finalY + 15);
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 20,
      head: [['Metric', 'Value']],
      body: [
        ['Present Days', reportData.PresentDays?.toString() || '0'],
        ['Leave Days', reportData.LeaveDays?.toString() || '0'],
        ['Late Arrivals', reportData.LateArrival?.toString() || '0'],
        ['Extra Work Days', reportData.ExtraWork?.toString() || '0'],
        ['Credit Leave', reportData.CreditLeave?.toString() || '0'],
        ['Extra Leave', reportData.ExtraLeave?.toString() || '0']
      ],
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [66, 139, 202] }
    });

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 285, { align: 'center' });
    }

    doc.save(`Employee_Report_${monthName}_${filters.year}.pdf`);
  };

  // Sample documents data - only one Employee Monthly Report
  const documents = [
    { 
      name: 'Employee Monthly Report', 
      type: 'PDF', 
      size: 'Dynamic', 
      date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      category: 'Report',
      isReport: true 
    },
  ];

  return (
    <div className="space-y-6">
      {/* Documents Grid */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search documents..." 
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    doc.category === 'Report' ? 'bg-blue-100' : 'bg-red-100'
                  }`}>
                    <FileText className={`w-5 h-5 ${
                      doc.category === 'Report' ? 'text-blue-600' : 'text-red-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">{doc.name}</h4>
                    <p className="text-xs text-gray-500">{doc.size}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  doc.category === 'Contract' ? 'bg-blue-100 text-blue-800' :
                  doc.category === 'Policy' ? 'bg-green-100 text-green-800' :
                  doc.category === 'Tax' ? 'bg-yellow-100 text-yellow-800' :
                  doc.category === 'Benefits' ? 'bg-purple-100 text-purple-800' :
                  doc.category === 'Review' ? 'bg-indigo-100 text-indigo-800' :
                  doc.category === 'Report' ? 'bg-orange-100 text-orange-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {doc.category}
                </span>
                <div className="flex items-center space-x-2">
                  <button 
                    className="text-blue-600 hover:text-blue-800"
                    onClick={doc.isReport ? handleViewReport : undefined}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="text-green-600 hover:text-green-800">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2">Updated: {doc.date}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Report Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Employee Monthly Report</h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Filters */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-4 flex-wrap gap-2">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Filter by:</span>
                  </div>
                  <select 
                    value={filters.month}
                    onChange={(e) => handleFilterChange('month', e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {months.map(month => (
                      <option key={month.value} value={month.value}>
                        {month.label}
                      </option>
                    ))}
                  </select>
                  <select 
                    value={filters.year}
                    onChange={(e) => handleFilterChange('year', e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {years.map(year => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleApplyFilter}
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Loading...</span>
                      </>
                    ) : (
                      <span>Apply</span>
                    )}
                  </button>
                </div>
              </div>

              {error && !loading && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-800 text-sm">{error}</p>
                  <p className="text-red-600 text-xs mt-1">
                    Try selecting a different month or year where report data is available.
                  </p>
                </div>
              )}

              {loading && (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              )}

              {reportData && !loading && (
                <div className="space-y-6">
                  {/* Employee Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-4">Employee Information</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Name:</span>
                          <span className="text-sm font-medium">{reportData.Name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Employee ID:</span>
                          <span className="text-sm font-medium">{reportData.EmpId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Email:</span>
                          <span className="text-sm font-medium">{reportData.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Report Period:</span>
                          <span className="text-sm font-medium">{reportData.DateString || `${months.find(m => m.value === filters.month)?.label} ${filters.year}`}</span>
                        </div>
                      </div>
                    </div>

                    {/* Attendance Summary */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-4">Attendance Summary</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Present Days:</span>
                          <span className="text-sm font-medium text-green-600">{reportData.PresentDays}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Leave Days:</span>
                          <span className="text-sm font-medium text-orange-600">{reportData.LeaveDays}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Late Arrivals:</span>
                          <span className="text-sm font-medium text-red-600">{reportData.LateArrival}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Extra Work:</span>
                          <span className="text-sm font-medium text-blue-600">{reportData.ExtraWork}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Leave Balance */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-4">Leave Balance</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Credit Leave:</span>
                        <span className="text-sm font-medium text-purple-600">{reportData.CreditLeave}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Extra Leave:</span>
                        <span className="text-sm font-medium text-purple-600">{reportData.ExtraLeave}</span>
                      </div>
                    </div>
                  </div>

                  {/* Download Section */}
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Close
                    </button>
                    <button
                      onClick={downloadPDF}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 flex items-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download PDF</span>
                    </button>
                  </div>
                </div>
              )}

              {!reportData && !loading && !error && (
                <div className="text-center py-8 text-gray-500">
                  <p>Select a month and year to view the report</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RenderDocuments;