import React, { useState, useEffect, useCallback } from 'react';
import PageHeader from '../ui/PageHeader';
import { Download, Calendar, Filter, FileText, FileSpreadsheet, Loader2, AlertCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell } from 'recharts';
import { toast } from 'sonner';
import './Reports.css';

const COLORS = ['#66a1be', '#3AC47D', '#F59E0B', '#EF4444'];

const Reports = () => {
    const [enrollmentData, setEnrollmentData] = useState([]);
    const [financialData, setFinancialData] = useState([]);
    const [jobsData, setJobsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Filtering States
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const fetchReports = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem('token');
            const headers = { 'Authorization': `Bearer ${token}` };
            
            const params = new URLSearchParams();
            if (startDate) params.append('startDate', startDate);
            if (endDate) params.append('endDate', endDate);
            
            const queryStr = params.toString() ? `?${params.toString()}` : '';

            const [enrollRes, finRes, jobRes] = await Promise.all([
                fetch(`${import.meta.env.VITE_API_URL}/api/admin/reports/enrollment${queryStr}`, { headers }),
                fetch(`${import.meta.env.VITE_API_URL}/api/admin/reports/financials${queryStr}`, { headers }),
                fetch(`${import.meta.env.VITE_API_URL}/api/admin/reports/jobs${queryStr}`, { headers })
            ]);

            if (!enrollRes.ok || !finRes.ok || !jobRes.ok) throw new Error('Data fetch failed');

            setEnrollmentData(await enrollRes.json());
            setFinancialData(await finRes.json());
            setJobsData(await jobRes.json());
        } catch (err) {
            setError('Failed to aggregate platform reports. Ensure backend is active.');
        } finally {
            setLoading(false);
        }
    }, [startDate, endDate]);

    useEffect(() => {
        fetchReports();
    }, [fetchReports]);

    const handleExport = (format, reportType = 'Summary') => {
        const dataToExport = reportType === 'Enrollment' ? enrollmentData : 
                           reportType === 'Financial' ? financialData :
                           reportType === 'Jobs' ? jobsData : [...enrollmentData, ...financialData, ...jobsData];
        
        if (format === 'PDF') {
            exportHTMLReport(reportType, dataToExport);
        } else {
            exportCSVReport(reportType, dataToExport);
        }
    };

    const exportHTMLReport = (name, data) => {
        const rows = data.map(item => `<tr><td>${item.month || item.name || 'Period'}</td><td>${item.students || item.amount || item.applications || 0}</td></tr>`).join('');
        const html = `<html><body style="font-family:sans-serif;padding:40px;"><h1>${name} Report</h1><table border="1" cellpadding="10" width="100%"><thead><tr><th>Label</th><th>Value</th></tr></thead><tbody>${rows}</tbody></table></body></html>`;
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${name}_Report.html`;
        a.click();
    };

    const exportCSVReport = (name, data) => {
        const headers = "Label,Value\n";
        const rows = data.map(item => `${item.month || item.name || 'Period'},${item.students || item.amount || item.applications || 0}`).join('\n');
        const blob = new Blob([headers + rows], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${name}_Report.csv`;
        a.click();
    };

    if (loading && enrollmentData.length === 0) {
        return <div className="reports-loading"><Loader2 className="animate-spin" /> Gathering Insights...</div>;
    }

    return (
        <div className="reports-page">
            <PageHeader title="Reports & Analytics" subtitle="Database-driven platform intelligence." />

            <div className="reports-toolbar">
                <div className="range-filters">
                    <div className="date-input">
                        <label>From</label>
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    </div>
                    <div className="date-input">
                        <label>To</label>
                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </div>
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
                <div className="chart-card full-width">
                    <h3>Enrollment Trends</h3>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={enrollmentData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Area type="monotone" dataKey="students" stroke="#66a1be" fill="#66a1be33" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-card">
                    <h3>Revenue Stream</h3>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={financialData}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="amount" fill="#3AC47D" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-card">
                    <h3>Recruitment Activity</h3>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={jobsData}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Area type="step" dataKey="applications" stroke="#F59E0B" fill="#F59E0B22" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
            
            {error && <div className="reports-footer-error"><AlertCircle size={14} /> {error}</div>}
        </div>
    );
};

export default Reports;
