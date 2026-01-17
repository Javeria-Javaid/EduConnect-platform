import React from 'react';
import PageHeader from '../ui/PageHeader';
import { Download, Calendar, Filter, FileText, FileSpreadsheet } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell } from 'recharts';
import './Reports.css';

// Mock Data for Charts
const ENROLLMENT_DATA = [
  { month: 'Jan', students: 4000 },
  { month: 'Feb', students: 4200 },
  { month: 'Mar', students: 4100 },
  { month: 'Apr', students: 4400 },
  { month: 'May', students: 4600 },
  { month: 'Jun', students: 4800 },
];

const PERFORMANCE_DATA = [
  { subject: 'Math', avg: 85 },
  { subject: 'Science', avg: 78 },
  { subject: 'English', avg: 82 },
  { subject: 'History', avg: 75 },
  { subject: 'Art', avg: 90 },
];

const DEMOGRAPHICS_DATA = [
  { name: 'Boys', value: 2400 },
  { name: 'Girls', value: 2200 },
];

const COLORS = ['#66a1be', '#3AC47D', '#F59E0B', '#EF4444'];

const Reports = () => {

  // Enhanced Export Functions with actual chart data
  const exportToPDF = (reportName) => {
    try {
      let tableRows = '';

      // Use different data based on report type
      if (reportName.includes('Financial')) {
        tableRows = `
          <tr><td>Total Revenue</td><td>$450,000</td></tr>
          <tr><td>Total Expenses</td><td>$380,000</td></tr>
          <tr><td>Net Profit</td><td>$70,000</td></tr>
          <tr><td>Tuition Fees Collected</td><td>$320,000</td></tr>
          <tr><td>Staff Salaries</td><td>$220,000</td></tr>
          <tr><td>Operating Costs</td><td>$160,000</td></tr>
        `;
      } else if (reportName.includes('Ranking')) {
        const perfAvg = Math.round(PERFORMANCE_DATA.reduce((acc, curr) => acc + curr.avg, 0) / PERFORMANCE_DATA.length);
        tableRows = `
          <tr><td>Overall Ranking</td><td>#12 of 150</td></tr>
          <tr><td>Academic Performance</td><td>${perfAvg}%</td></tr>
          <tr><td>Student Enrollment</td><td>${ENROLLMENT_DATA[ENROLLMENT_DATA.length - 1].students}</td></tr>
          <tr><td>Student-Teacher Ratio</td><td>18:1</td></tr>
          <tr><td>Facilities Rating</td><td>4.5/5</td></tr>
        `;
      } else {
        // Enrollment data
        tableRows = ENROLLMENT_DATA.map(item =>
          `<tr><td>${item.month} 2024</td><td>${item.students.toLocaleString()} Students</td></tr>`
        ).join('');
      }

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${reportName}</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #1e293b; }
            .header { border-bottom: 3px solid #66a1be; padding-bottom: 20px; margin-bottom: 30px; }
            h1 { color: #66a1be; margin: 0 0 10px 0; font-size: 28px; }
            .meta { color: #64748b; font-size: 14px; }
            table { width: 100%; border-collapse: collapse; margin-top: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
            th, td { border: 1px solid #e2e8f0; padding: 14px 16px; text-align: left; }
            th { background-color: #66a1be; color: white; font-weight: 600; text-transform: uppercase; font-size: 13px; }
            tr:nth-child(even) { background-color: #f8fafc; }
            tr:hover { background-color: #e6f3f7; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #94a3b8; font-size: 12px; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${reportName.replace(/_/g, ' ')}</h1>
            <p class="meta">Generated on: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <table>
            <thead><tr><th>Metric</th><th>Value</th></tr></thead>
            <tbody>${tableRows}</tbody>
          </table>
          <div class="footer"><p>EduConnect School Management System - Confidential Report</p></div>
        </body>
        </html>
      `;

      // Create blob and trigger download
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportName}_${new Date().toISOString().split('T')[0]}.html`;
      a.style.display = 'none';

      document.body.appendChild(a);
      a.click();

      // Cleanup
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);

      console.log(`PDF export successful: ${reportName}`);
    } catch (error) {
      console.error('PDF export error:', error);
      console.error('Report name:', reportName);
      alert('PDF export failed. Please try again or contact support.');
    }
  };

  const exportToExcel = (reportName) => {
    try {
      let csvData;

      if (reportName.includes('Attendance')) {
        csvData = [
          ['Teacher Attendance Log Report'],
          ['Generated on', new Date().toLocaleDateString()],
          [''],
          ['Month', 'Total Teachers', 'Present', 'Absent', 'Attendance %'],
          ['January 2024', '85', '83', '2', '97.6%'],
          ['February 2024', '85', '84', '1', '98.8%'],
          ['March 2024', '85', '82', '3', '96.5%'],
          [''],
          ['Summary Statistics'],
          ['Average Attendance Rate', '97.6%'],
          ['Total Teaching Days', '65']
        ];
      } else if (reportName.includes('Summary')) {
        csvData = [
          ['EduConnect - Complete Reports Summary'],
          ['Generated on', new Date().toLocaleDateString()],
          [''],
          ['=== ENROLLMENT TRENDS ==='],
          ['Month', 'Total Students'],
          ...ENROLLMENT_DATA.map(item => [item.month, item.students]),
          [''],
          ['=== SUBJECT PERFORMANCE ==='],
          ['Subject', 'Average Score'],
          ...PERFORMANCE_DATA.map(item => [item.subject, item.avg + '%']),
          [''],
          ['=== DEMOGRAPHICS ==='],
          ['Category', 'Count'],
          ...DEMOGRAPHICS_DATA.map(item => [item.name, item.value])
        ];
      } else {
        csvData = [
          ['Enrollment Report'],
          ['Generated on', new Date().toLocaleDateString()],
          [''],
          ['Month', 'Total Students', 'Growth'],
          ...ENROLLMENT_DATA.map((item, index) => {
            const growth = index > 0 ? item.students - ENROLLMENT_DATA[index - 1].students : 0;
            return [item.month + ' 2024', item.students, growth > 0 ? '+' + growth : growth];
          })
        ];
      }

      const csvContent = csvData.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');

      a.href = url;
      a.download = `${reportName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
      a.style.display = 'none';

      document.body.appendChild(a);
      a.click();

      // Cleanup
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);

      console.log(`Excel export successful: ${reportName}`);
    } catch (error) {
      console.error('Excel export error:', error);
      console.error('Report name:', reportName);
      alert('Export failed. Please try again or contact support.');
    }
  };

  const handleReportDownload = (reportName, format) => {
    if (format === 'PDF') {
      exportToPDF(reportName);
    } else if (format === 'Excel' || format === 'CSV') {
      exportToExcel(reportName);
    }
  };

  const handleExport = (format) => {
    if (format === 'PDF') {
      exportToPDF('All_Reports_Summary');
    } else {
      exportToExcel('All_Reports_Summary');
    }
  };

  return (
    <div className="reports-page">
      <PageHeader
        title="Reports & Analytics"
        subtitle="Deep dive into school performance, enrollment trends, and financials."
      />

      <div className="reports-toolbar">
        <div className="date-filter">
          <Calendar size={16} />
          <span>Last 6 Months</span>
        </div>
        <div className="export-actions">
          <button className="export-btn" onClick={() => handleExport('PDF')}>
            <Download size={16} /> Export PDF
          </button>
          <button className="export-btn outline" onClick={() => handleExport('Excel')}>
            <Download size={16} /> Export Excel
          </button>
        </div>
      </div>

      <div className="charts-grid">
        {/* Enrollment Trends */}
        <div className="chart-card full-width">
          <div className="chart-header">
            <h3>Total Enrollment Trends</h3>
            <button className="filter-btn"><Filter size={14} /></button>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={ENROLLMENT_DATA}>
                <defs>
                  <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#66a1be" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#66a1be" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="students" stroke="#66a1be" strokeWidth={3} fillOpacity={1} fill="url(#colorStudents)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Performance */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Avg. Subject Performance</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={PERFORMANCE_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="avg" fill="#3AC47D" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Demographics */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Student Demographics</h3>
          </div>
          <div className="chart-container flex-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={DEMOGRAPHICS_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {DEMOGRAPHICS_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="reports-grid">
        <div className="report-item">
          <div className="report-icon">
            <FileText size={24} />
          </div>
          <div className="report-content">
            <h4>Monthly Financial Report</h4>
            <p>Generated on March 1, 2024</p>
          </div>
          <button
            className="download-btn"
            onClick={() => handleReportDownload('Monthly_Financial_Report', 'PDF')}
          >
            <Download size={16} />
            Download PDF
          </button>
        </div>

        <div className="report-item">
          <div className="report-icon report-icon-excel">
            <FileSpreadsheet size={24} />
          </div>
          <div className="report-content">
            <h4>Teacher Attendance Log</h4>
            <p>Generated on March 5, 2024</p>
          </div>
          <button
            className="download-btn download-btn-excel"
            onClick={() => handleReportDownload('Teacher_Attendance_Log', 'Excel')}
          >
            <Download size={16} />
            Download Excel
          </button>
        </div>

        <div className="report-item">
          <div className="report-icon">
            <FileText size={24} />
          </div>
          <div className="report-content">
            <h4>Quarterly School Ranking</h4>
            <p>Generated on Feb 28, 2024</p>
          </div>
          <button
            className="download-btn"
            onClick={() => handleReportDownload('Quarterly_School_Ranking', 'PDF')}
          >
            <Download size={16} />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reports;
