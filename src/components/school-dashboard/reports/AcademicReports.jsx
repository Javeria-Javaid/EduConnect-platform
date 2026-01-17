import React, { useState } from 'react';
import DataTable from '../shared/DataTable';
import FilterPanel from '../shared/FilterPanel';
import { reportsOverviewData } from './mockData';
import { FileText, Download, BookOpen, Trophy, TrendingUp, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import './ReportSubSection.css';

const AcademicReports = () => {
    const [filters, setFilters] = useState({});
    const { academicReports = [], gradeDistribution = [] } = reportsOverviewData || {};

    // Mock Summary Data
    const summaryStats = [
        { label: 'Avg. Pass Rate', value: '92%', change: '+4%', icon: Trophy, bgColor: '#dcfce7' },
        { label: 'Top Subject', value: 'English', change: '98% Pass', icon: BookOpen, bgColor: '#dbeafe' },
        { label: 'Needs Focus', value: 'Physics', change: '82% Pass', icon: AlertTriangle, bgColor: '#fee2e2' },
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
            key: 'subject',
            label: 'Subject',
            type: 'select',
            options: [
                { label: 'Mathematics', value: 'Mathematics' },
                { label: 'Science', value: 'Science' },
                { label: 'English', value: 'English' },
            ]
        }
    ];

    const columns = [
        {
            key: 'exam', label: 'Exam Name', sortable: true, render: (row) => (
                <span style={{ fontWeight: '600', color: '#1e293b' }}>{row.exam}</span>
            )
        },
        { key: 'class', label: 'Class', sortable: true },
        { key: 'subject', label: 'Subject', sortable: true },
        {
            key: 'average', label: 'Avg. Score', sortable: true, render: (row) => (
                <span style={{ fontWeight: '800', color: '#1e293b' }}>{row.average}</span>
            )
        },
        {
            key: 'passRate', label: 'Pass Rate', sortable: true, render: (row) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className="progress-bar-container">
                        <div
                            className="progress-bar-fill"
                            style={{
                                width: row.passRate,
                                background: parseInt(row.passRate) >= 90 ? '#10b981' : '#f59e0b'
                            }}
                        />
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>{row.passRate}</span>
                </div>
            )
        },
    ];

    const handleQuickAction = (row) => [
        { label: 'View Details', icon: <FileText size={14} />, onClick: () => console.log('View', row) },
        { label: 'Download Results', icon: <Download size={14} />, onClick: () => console.log('Download', row) },
    ];

    return (
        <div className="report-subsection-container">
            {/* Header */}
            <div className="report-section-header">
                <h2 className="report-section-title">Academic Performance</h2>
                <p className="report-section-subtitle">Exam results and grade analysis</p>
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
                                <span style={{ color: '#64748b', fontWeight: '600' }}>
                                    {stat.change}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Grade Distribution Chart */}
            <div className="report-chart-card" style={{ gridColumn: '1 / -1' }}>
                <h3 className="report-chart-title">Overall Grade Distribution</h3>
                <div style={{ height: '320px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={gradeDistribution} barSize={50}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                            <Tooltip
                                cursor={{ fill: '#f9fafb' }}
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                            />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                {gradeDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Filters & Table */}
            <div className="report-table-section" style={{ gridColumn: '1 / -1' }}>
                <div className="report-table-header">
                    <h3 className="report-table-title">Exam Results</h3>
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
                    data={academicReports}
                    selectable={true}
                    onQuickAction={handleQuickAction}
                    pageSize={8}
                />
            </div>
        </div>
    );
};

export default AcademicReports;
