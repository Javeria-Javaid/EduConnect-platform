import React, { useState } from 'react';
import DataTable from '../shared/DataTable';
import FilterPanel from '../shared/FilterPanel';
import { reportsOverviewData } from './mockData';
import { FileText, Download, Eye, Briefcase, Clock, Star, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import './ReportSubSection.css';

const TeacherReports = () => {
    const [filters, setFilters] = useState({});
    const { teacherReports = [] } = reportsOverviewData || {};

    // Mock Summary Data
    const summaryStats = [
        { label: 'Total Teachers', value: '145', change: '+2%', icon: Briefcase, bgColor: '#dbeafe' },
        { label: 'Avg. Workload', value: '22h', change: '-1h', icon: Clock, bgColor: '#fed7aa' },
        { label: 'Top Performers', value: '12', change: '+3', icon: Star, bgColor: '#fef3c7' },
    ];

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
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="student-avatar" style={{ background: '#dbeafe', color: '#2563eb' }}>
                        {row.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                        <span style={{ fontWeight: '600', color: '#1e293b', display: 'block' }}>{row.name}</span>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{row.subject}</span>
                    </div>
                </div>
            )
        },
        {
            key: 'workload', label: 'Workload', sortable: true, render: (row) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={14} style={{ color: '#94a3b8' }} />
                    <span style={{ fontSize: '0.85rem', color: '#475569' }}>{row.workload}</span>
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {row.performance === 'Excellent' && <Award size={16} style={{ color: '#f59e0b' }} />}
                    <span style={{ fontSize: '0.85rem', color: '#475569' }}>{row.performance}</span>
                </div>
            )
        },
        { key: 'lastEvaluation', label: 'Last Eval', sortable: true },
    ];

    const handleQuickAction = (row) => [
        { label: 'View Profile', icon: <Eye size={14} />, onClick: () => console.log('View', row) },
        { label: 'Download Report', icon: <Download size={14} />, onClick: () => console.log('Download', row) },
    ];

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
                                <div className="report-summary-icon" style={{ backgroundColor: stat.bgColor, color: '#3b82f6' }}>
                                    <Icon size={24} />
                                </div>
                            </div>
                            <div className="report-summary-footer">
                                <span style={{ color: stat.change.startsWith('+') ? '#10b981' : '#ef4444' }}>
                                    {stat.change}
                                </span>
                                <span style={{ color: '#94a3b8' }}>vs last term</span>
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
                        <button className="report-export-btn">
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
                        onQuickAction={handleQuickAction}
                        pageSize={8}
                    />
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
                    <div style={{ marginTop: '16px', fontSize: '0.85rem', color: '#64748b', textAlign: 'center' }}>
                        Teachers with &gt;22 hrs are highlighted in red
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherReports;
