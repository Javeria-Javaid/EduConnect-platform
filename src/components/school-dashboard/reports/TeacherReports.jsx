import React, { useEffect, useMemo, useState } from 'react';
import DataTable from '../shared/DataTable';
import FilterPanel from '../shared/FilterPanel';
import { Download, Briefcase, Clock, Star, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import './ReportSubSection.css';

const TeacherReports = () => {
    const [filters, setFilters] = useState({});
    const [teacherReports, setTeacherReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/schools/reports/teachers`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error(`Failed to load teacher report (${res.status})`);
                const json = await res.json();
                setTeacherReports(json?.teacherReports || []);
            } catch (e) {
                setError(e?.message || 'Failed to load teacher reports');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const summaryStats = useMemo(() => {
        const total = teacherReports.length;
        const avgLoad =
            total > 0
                ? Math.round(teacherReports.reduce((sum, t) => sum + (parseInt(t.workload, 10) || 0), 0) / total)
                : 0;
        const top = teacherReports.filter((t) => t.performance === 'Excellent').length;
        return [
            { label: 'Total Teachers', value: total.toLocaleString(), change: '—', icon: Briefcase, bgColor: '#dbeafe' },
            { label: 'Avg. Workload', value: `${avgLoad}h`, change: '—', icon: Clock, bgColor: '#fed7aa' },
            { label: 'Top Performers', value: top.toLocaleString(), change: '—', icon: Star, bgColor: '#fef3c7' },
        ];
    }, [teacherReports]);

    // Transform data for workload chart
    const workloadData = teacherReports.map(t => ({
        name: t.name,
        hours: parseInt(t.workload)
    }));

    const filterOptions = [
        {
            key: 'subject',
            label: 'Subject',
            type: 'multiselect',
            options: [
                { label: 'Mathematics', value: 'Mathematics' },
                { label: 'Science', value: 'Science' },
                { label: 'English', value: 'English' },
                { label: 'History', value: 'History' },
            ]
        },
        {
            key: 'performance',
            label: 'Performance',
            type: 'select',
            options: [
                { label: 'Excellent', value: 'Excellent' },
                { label: 'Good', value: 'Good' },
                { label: 'Average', value: 'Average' },
            ]
        }
    ];

    const columns = [
        {
            key: 'name', label: 'Teacher Name', sortable: true, render: (row) => (
                <div className="report-inline-row">
                    <div className="student-avatar report-transport-icon">
                        {row.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                        <span className="report-cell-primary report-display-block">{row.name}</span>
                        <span className="report-cell-muted">{row.subject}</span>
                    </div>
                </div>
            )
        },
        {
            key: 'workload', label: 'Workload', sortable: true, render: (row) => (
                <div className="report-inline-row tight">
                    <Clock size={14} className="report-icon-muted" />
                    <span className="report-cell-muted report-cell-md">{row.workload}</span>
                </div>
            )
        },
        {
            key: 'attendance', label: 'Attendance', sortable: true, render: (row) => (
                <span className={`status-badge ${parseInt(row.attendance) >= 95 ? 'status-excellent' : 'status-average'}`}>
                    {row.attendance}
                </span>
            )
        },
        {
            key: 'performance', label: 'Performance', sortable: true, render: (row) => (
                <div className="report-inline-row tight">
                    {row.performance === 'Excellent' && <Award size={16} className="report-icon-award" />}
                    <span className="report-cell-muted report-cell-md">{row.performance}</span>
                </div>
            )
        },
        { key: 'lastEvaluation', label: 'Last Eval', sortable: true },
    ];

    const handleQuickAction = (row) => [
        // Removed non-functional quick actions for MVP
    ];

    const downloadCsv = () => {
        const headers = ['name', 'subject', 'workload', 'attendance', 'performance', 'lastEvaluation'];
        const lines = [
            headers.join(','),
            ...teacherReports.map((r) => headers.map((h) => `"${String(r?.[h] ?? '').replaceAll('"', '""')}"`).join(',')),
        ];
        const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `teacher-reports-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="report-subsection-container">
            {/* Header */}
            <div className="report-section-header">
                <h2 className="report-section-title">Teacher Reports</h2>
                <p className="report-section-subtitle">Performance evaluations and workload analysis</p>
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
                            <div className="report-summary-footer">
                                <span className={stat.change.startsWith('+') ? 'report-trend-positive' : 'report-trend-negative'}>
                                    {stat.change}
                                </span>
                                <span className="report-trend-muted">vs last term</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="report-content-grid">
                {/* Filters & Table */}
                <div className="report-table-section">
                    <div className="report-table-header">
                        <h3 className="report-table-title">Teacher Records</h3>
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
                        data={teacherReports}
                        selectable={true}
                        pageSize={8}
                    />
                    {loading && <div className="report-state-message report-state-loading">Loading...</div>}
                    {error && <div className="report-state-message report-state-error">{error}</div>}
                </div>

                {/* Workload Chart */}
                <div className="report-chart-card">
                    <h3 className="report-chart-title">Workload Distribution</h3>
                    <div className="report-chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={workloadData} layout="vertical" barSize={20}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f3f4f6" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="hours" radius={[0, 4, 4, 0]}>
                                    {workloadData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.hours > 22 ? '#ef4444' : '#3b82f6'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="report-chart-note">
                        Teachers with &gt;22 hrs are highlighted in red
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherReports;
