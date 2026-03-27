import React, { useEffect, useMemo, useState } from 'react';
import DataTable from '../shared/DataTable';
import FilterPanel from '../shared/FilterPanel';
import { Download, CheckCircle, XCircle, Clock } from 'lucide-react';
import './ReportSubSection.css';

const AttendanceReports = () => {
    const [filters, setFilters] = useState({});
    const [attendanceReports, setAttendanceReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/schools/reports/attendance`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error(`Failed to load attendance report (${res.status})`);
                const json = await res.json();
                setAttendanceReports(json?.attendanceReports || []);
            } catch (e) {
                setError(e?.message || 'Failed to load attendance reports');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const summaryStats = useMemo(() => {
        const today = new Date().toISOString().slice(0, 10);
        const todayRows = attendanceReports.filter((r) => r.date === today);
        const present = todayRows.reduce((sum, r) => sum + (r.present || 0), 0);
        const absent = todayRows.reduce((sum, r) => sum + (r.absent || 0), 0);
        const late = todayRows.reduce((sum, r) => sum + (r.late || 0), 0);
        const total = present + absent + late;
        const pct = total > 0 ? Math.round((present / total) * 100) : null;
        return [
            { label: "Today's Attendance", value: pct === null ? 'N/A' : `${pct}%`, change: '—', icon: CheckCircle, bgColor: '#dcfce7' },
            { label: 'Absent Today', value: absent.toLocaleString(), change: '—', icon: XCircle, bgColor: '#fee2e2' },
            { label: 'Late Arrivals', value: late.toLocaleString(), change: '—', icon: Clock, bgColor: '#fed7aa' },
        ];
    }, [attendanceReports]);

    const filterOptions = [
        {
            key: 'class',
            label: 'Class',
            type: 'multiselect',
            options: [
                { label: 'Class 9', value: '9' },
                { label: 'Class 10', value: '10' },
                { label: 'Class 11', value: '11' },
                { label: 'Class 12', value: '12' },
            ]
        },
        {
            key: 'dateRange',
            label: 'Date Range',
            type: 'select',
            options: [
                { label: 'Today', value: 'today' },
                { label: 'This Week', value: 'week' },
                { label: 'This Month', value: 'month' },
            ]
        }
    ];

    const columns = [
        {
            key: 'date', label: 'Date', sortable: true, render: (row) => (
                <span style={{ fontWeight: '600', color: '#475569' }}>{row.date}</span>
            )
        },
        {
            key: 'class', label: 'Class', sortable: true, render: (row) => (
                <span style={{ padding: '4px 10px', borderRadius: '8px', background: '#f1f5f9', color: '#475569', fontSize: '0.75rem', fontWeight: '700' }}>
                    {row.class}
                </span>
            )
        },
        {
            key: 'present', label: 'Present', sortable: true, render: (row) => (
                <span style={{ color: '#10b981', fontWeight: '600' }}>{row.present}</span>
            )
        },
        {
            key: 'absent', label: 'Absent', sortable: true, render: (row) => (
                <span style={{ color: '#ef4444', fontWeight: '600' }}>{row.absent}</span>
            )
        },
        {
            key: 'late', label: 'Late', sortable: true, render: (row) => (
                <span style={{ color: '#f59e0b', fontWeight: '600' }}>{row.late}</span>
            )
        },
        {
            key: 'percentage', label: 'Attendance %', sortable: true, render: (row) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className="progress-bar-container">
                        <div
                            className="progress-bar-fill"
                            style={{ width: row.percentage, background: parseInt(row.percentage) >= 90 ? '#10b981' : '#f59e0b' }}
                        />
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>{row.percentage}</span>
                </div>
            )
        },
    ];

    const downloadCsv = () => {
        const headers = ['date', 'class', 'present', 'absent', 'late', 'percentage'];
        const lines = [
            headers.join(','),
            ...attendanceReports.map((r) => headers.map((h) => `"${String(r?.[h] ?? '').replaceAll('"', '""')}"`).join(',')),
        ];
        const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `attendance-report-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="report-subsection-container">
            <div className="report-section-header">
                <h2 className="report-section-title">Attendance Logs</h2>
                <p className="report-section-subtitle">Daily logs and monthly summaries</p>
            </div>

            <div className="report-summary-grid">
                {summaryStats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="report-summary-card">
                            <div className="report-summary-header">
                                <div className="report-summary-content">
                                    <h3>{stat.label}</h3>
                                    <p className="report-summary-value">{stat.value}</p>
                                </div>
                                <div className="report-summary-icon" style={{ backgroundColor: stat.bgColor, color: '#3b82f6' }}>
                                    <Icon size={24} />
                                </div>
                            </div>
                            <div className="report-summary-footer">
                                <span style={{ color: stat.change.startsWith('+') ? '#10b981' : '#ef4444' }}>
                                    {stat.change}
                                </span>
                                <span style={{ color: '#94a3b8' }}>vs yesterday</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="report-table-section" style={{ gridColumn: '1 / -1' }}>
                <div className="report-table-header">
                    <h3 className="report-table-title">Attendance Records</h3>
                    <button className="report-export-btn" onClick={downloadCsv} disabled={loading || !!error}>
                        <Download size={16} />
                        Export All
                    </button>
                </div>
                <div className="report-filter-section">
                    <FilterPanel
                        filters={filterOptions}
                        onFilterChange={setFilters}
                    />
                </div>
                <DataTable
                    columns={columns}
                    data={attendanceReports}
                    selectable={true}
                    pageSize={8}
                />
                {loading && <div style={{ padding: '12px', color: '#64748b', fontWeight: 600 }}>Loading…</div>}
                {error && <div style={{ padding: '12px', color: '#ef4444', fontWeight: 600 }}>{error}</div>}
            </div>
        </div>
    );
};

export default AttendanceReports;
