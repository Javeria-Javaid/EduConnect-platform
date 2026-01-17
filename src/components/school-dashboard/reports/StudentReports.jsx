import React, { useState } from 'react';
import DataTable from '../shared/DataTable';
import FilterPanel from '../shared/FilterPanel';
import { reportsOverviewData } from './mockData';
import { FileText, Download, Eye, Users, TrendingUp, AlertCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import './ReportSubSection.css';

const StudentReports = () => {
    const [filters, setFilters] = useState({});
    const { studentReports } = reportsOverviewData;

    // Mock Summary Data
    const summaryStats = [
        { label: 'Total Students', value: '2,543', change: '+12%', icon: Users, bgColor: '#dbeafe' },
        { label: 'Avg. Performance', value: 'Good', change: 'Stable', icon: TrendingUp, bgColor: '#dcfce7' },
        { label: 'At Risk', value: '45', change: '-2%', icon: AlertCircle, bgColor: '#fee2e2' },
    ];

    const performanceData = [
        { name: 'Excellent', value: 35, color: '#22c55e' },
        { name: 'Good', value: 45, color: '#3b82f6' },
        { name: 'Average', value: 15, color: '#f59e0b' },
        { name: 'Poor', value: 5, color: '#ef4444' },
    ];

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
            key: 'performance',
            label: 'Performance',
            type: 'multiselect',
            options: [
                { label: 'Excellent', value: 'Excellent' },
                { label: 'Good', value: 'Good' },
                { label: 'Average', value: 'Average' },
                { label: 'Poor', value: 'Poor' },
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

    const handleQuickAction = (row) => [
        { label: 'View Profile', icon: <Eye size={14} />, onClick: () => console.log('View', row) },
        { label: 'Download Report', icon: <Download size={14} />, onClick: () => console.log('Download', row) },
    ];

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
                        data={studentReports}
                        selectable={true}
                        onQuickAction={handleQuickAction}
                        pageSize={8}
                    />
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
