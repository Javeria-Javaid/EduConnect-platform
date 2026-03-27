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
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="student-avatar">
                        {row.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span style={{ fontWeight: '600', color: '#1e293b' }}>{row.name}</span>
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className="progress-bar-container">
                        <div
                            className="progress-bar-fill"
                            style={{ width: row.attendance, background: '#3b82f6' }}
                        />
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{row.attendance}</span>
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
                                <div className="report-summary-icon" style={{ backgroundColor: stat.bgColor, color: '#3b82f6' }}>
                                    <Icon size={24} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px', fontSize: '0.85rem', fontWeight: '600' }}>
                                <span style={{ color: stat.change.startsWith('+') ? '#10b981' : '#ef4444' }}>
                                    {stat.change}
                                </span>
                                <span style={{ color: '#94a3b8' }}>vs last term</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
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
                    {loading && <div style={{ padding: '12px', color: '#64748b', fontWeight: 600 }}>Loading…</div>}
                    {error && <div style={{ padding: '12px', color: '#ef4444', fontWeight: 600 }}>{error}</div>}
                </div>

                {/* Charts Side Panel */}
                <div className="report-chart-card">
                    <h3 className="report-chart-title">Performance Distribution</h3>
                    <div style={{ height: '400px', marginBottom: '20px', padding: '10px 0' }}>
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
                                    formatter={(value, entry) => (
                                        <span style={{ color: '#475569', fontSize: '0.875rem', fontWeight: '500' }}>
                                            {value}
                                        </span>
                                    )}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div style={{
                        marginTop: '20px',
                        paddingTop: '20px',
                        borderTop: '1px solid #f1f5f9',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                    }}>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>
                            Breakdown
                        </h4>
                        {performanceData.map((item) => (
                            <div key={item.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#f8fafc', borderRadius: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: item.color, boxShadow: `0 2px 8px ${item.color}40` }} />
                                    <span style={{ color: '#475569', fontSize: '0.875rem', fontWeight: '500' }}>{item.name}</span>
                                </div>
                                <span style={{ fontWeight: '700', color: '#1e293b', fontSize: '0.95rem' }}>{item.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentReports;
