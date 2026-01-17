import React, { useState } from 'react';
import DataTable from '../shared/DataTable';
import FilterPanel from '../shared/FilterPanel';
import { reportsOverviewData } from './mockData';
import { FileText, Download, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import './ReportSubSection.css';

const AttendanceReports = () => {
    const [filters, setFilters] = useState({});
    const { attendanceReports = [] } = reportsOverviewData || {};

    const summaryStats = [
        { label: "Today's Attendance", value: '94.2%', change: '+0.5%', icon: CheckCircle, bgColor: '#dcfce7' },
        { label: 'Absent Today', value: '145', change: '-12', icon: XCircle, bgColor: '#fee2e2' },
        { label: 'Late Arrivals', value: '32', change: '+5', icon: Clock, bgColor: '#fed7aa' },
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

    const handleQuickAction = (row) => [
        { label: 'View Details', icon: <FileText size={14} />, onClick: () => console.log('View', row) },
        { label: 'Download Report', icon: <Download size={14} />, onClick: () => console.log('Download', row) },
    ];

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
                    data={attendanceReports}
                    selectable={true}
                    onQuickAction={handleQuickAction}
                    pageSize={8}
                />
            </div>
        </div>
    );
};

export default AttendanceReports;
