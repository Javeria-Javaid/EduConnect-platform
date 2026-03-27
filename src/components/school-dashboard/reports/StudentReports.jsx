import React, { useEffect, useMemo, useState } from 'react';
import DataTable from '../shared/DataTable';
import FilterPanel from '../shared/FilterPanel';
import { Download, Users, TrendingUp, AlertCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import './ReportSubSection.css';

const StudentReports = () => {
    const [filters, setFilters] = useState({});
    const [studentReports, setStudentReports] = useState([]);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem('token');
                const [classesRes, reportRes] = await Promise.all([
                    fetch(`${import.meta.env.VITE_API_URL}/api/schools/classes`, { headers: { Authorization: `Bearer ${token}` } }),
                    fetch(`${import.meta.env.VITE_API_URL}/api/schools/reports/students`, { headers: { Authorization: `Bearer ${token}` } }),
                ]);
                if (!classesRes.ok) throw new Error(`Failed to load classes (${classesRes.status})`);
                if (!reportRes.ok) throw new Error(`Failed to load student report (${reportRes.status})`);
                const classesJson = await classesRes.json();
                const reportJson = await reportRes.json();
                setClasses(classesJson || []);
                setStudentReports(reportJson?.studentReports || []);
            } catch (e) {
                setError(e?.message || 'Failed to load student reports');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const classOptions = useMemo(() => {
        const names = new Set((classes || []).map((c) => c?.name).filter(Boolean));
        return Array.from(names).sort().map((name) => ({ label: name, value: name }));
    }, [classes]);

    const filteredStudentReports = useMemo(() => {
        let rows = [...studentReports];
        const selectedClasses = Array.isArray(filters?.class) ? filters.class : [];
        const selectedPerf = Array.isArray(filters?.performance) ? filters.performance : [];

        if (selectedClasses.length > 0) {
            rows = rows.filter((r) => selectedClasses.some((c) => String(r.class || '').startsWith(c)));
        }
        if (selectedPerf.length > 0) {
            rows = rows.filter((r) => selectedPerf.includes(r.performance));
        }
        return rows;
    }, [filters, studentReports]);

    const performanceData = useMemo(() => {
        const counts = new Map();
        for (const r of studentReports) {
            const key = r.performance || 'Not Set';
            counts.set(key, (counts.get(key) || 0) + 1);
        }
        const total = Array.from(counts.values()).reduce((a, b) => a + b, 0) || 1;
        const colorBy = {
            Excellent: '#22c55e',
            Good: '#3b82f6',
            Average: '#f59e0b',
            Poor: '#ef4444',
            'Not Set': '#94a3b8',
        };
        return Array.from(counts.entries()).map(([name, count]) => ({
            name,
            value: Math.round((count / total) * 100),
            color: colorBy[name] || '#94a3b8',
        }));
    }, [studentReports]);

    const summaryStats = useMemo(() => {
        const totalStudents = studentReports.length;
        const atRisk = studentReports.filter((r) => r.performance === 'Poor').length;
        const avgLabel = performanceData.sort((a, b) => b.value - a.value)[0]?.name || 'Not Set';
        return [
            { label: 'Total Students', value: totalStudents.toLocaleString(), change: '—', icon: Users, bgColor: '#dbeafe' },
            { label: 'Top Segment', value: avgLabel, change: '—', icon: TrendingUp, bgColor: '#dcfce7' },
            { label: 'At Risk', value: atRisk.toLocaleString(), change: '—', icon: AlertCircle, bgColor: '#fee2e2' },
        ];
    }, [studentReports, performanceData]);

    const filterOptions = [
        {
            key: 'class',
            label: 'Class',
            type: 'multiselect',
            options: classOptions
        },
        {
            key: 'performance',
            label: 'Performance',
            type: 'multiselect',
            options: [
                { label: 'Excellent', value: 'Excellent' },
                { label: 'Good', value: 'Good' },
                { label: 'Average', value: 'Average' },
                { label: 'Poor', value: 'Poor' },
                { label: 'Not Set', value: 'Not Set' },
            ]
        }
    ];

    const columns = [
        {
            key: 'name', label: 'Student Name', sortable: true, render: (row) => (
                <div className="report-inline-row">
                    <div className="student-avatar">
                        {row.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="report-cell-primary">{row.name}</span>
                </div>
            )
        },
        { key: 'class', label: 'Class', sortable: true },
        {
            key: 'performance',
            label: 'Performance',
            sortable: true,
            render: (row) => (
                <span className={`status-badge ${row.performance === 'Excellent' ? 'status-excellent' :
                        row.performance === 'Good' ? 'status-good' :
                            row.performance === 'Average' ? 'status-average' :
                                'status-poor'
                    }`}>
                    {row.performance}
                </span>
            )
        },
        {
            key: 'attendance', label: 'Attendance', sortable: true, render: (row) => (
                <div className="report-inline-row tight">
                    <div className="progress-bar-container">
                        <div
                            className="progress-bar-fill"
                            style={{ width: row.attendance, background: '#3b82f6' }}
                        />
                    </div>
                    <span className="report-cell-muted">{row.attendance}</span>
                </div>
            )
        },
        { key: 'behavior', label: 'Behavior', sortable: true },
        { key: 'lastReport', label: 'Last Report', sortable: true },
    ];

    const downloadCsv = () => {
        const headers = ['name', 'class', 'performance', 'attendance', 'behavior', 'lastReport'];
        const lines = [
            headers.join(','),
            ...studentReports.map((r) => headers.map((h) => `"${String(r?.[h] ?? '').replaceAll('"', '""')}"`).join(',')),
        ];
        const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `student-reports-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="report-subsection-container">
            {/* Header */}
            <div className="report-section-header">
                <h2 className="report-section-title">Student Reports</h2>
                <p className="report-section-subtitle">Comprehensive academic and behavioral records</p>
            </div>

            {/* Summary Cards */}
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
                                <div className="report-summary-icon report-summary-icon-dynamic" style={{ '--summary-icon-bg': stat.bgColor }}>
                                    <Icon size={24} />
                                </div>
                            </div>
                            <div className="report-summary-change-row">
                                <span className={stat.change.startsWith('+') ? 'report-trend-positive' : 'report-trend-negative'}>
                                    {stat.change}
                                </span>
                                <span className="report-trend-muted">vs last term</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="report-content-grid report-single-column">
                {/* Filters & Table */}
                <div className="report-table-section">
                    <div className="report-table-header">
                        <h3 className="report-table-title">Student Records</h3>
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
                        data={filteredStudentReports}
                        selectable={true}
                        pageSize={8}
                    />
                    {loading && <div className="report-state-message report-state-loading">Loading...</div>}
                    {error && <div className="report-state-message report-state-error">{error}</div>}
                </div>

                {/* Charts Side Panel */}
                <div className="report-chart-card">
                    <h3 className="report-chart-title">Performance Distribution</h3>
                    <div className="report-pie-wrap">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={performanceData}
                                    cx="50%"
                                    cy="45%"
                                    innerRadius={70}
                                    outerRadius={105}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {performanceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Legend
                                    verticalAlign="bottom"
                                    height={50}
                                    iconType="circle"
                                    formatter={(value) => <span className="report-legend-label">{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="report-breakdown">
                        <h4 className="report-breakdown-title">Breakdown</h4>
                        {performanceData.map((item) => (
                            <div key={item.name} className="report-breakdown-item">
                                <div className="report-breakdown-left">
                                    <div className="report-breakdown-dot" style={{ '--dot-color': item.color, '--dot-shadow-color': `${item.color}40` }} />
                                    <span className="report-breakdown-name">{item.name}</span>
                                </div>
                                <span className="report-breakdown-value">{item.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentReports;
