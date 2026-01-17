import React, { useState } from 'react';
import DataTable from '../shared/DataTable';
import FilterPanel from '../shared/FilterPanel';
import { reportsOverviewData } from './mockData';
import { FileText, Download, Bus, MapPin, Clock, AlertCircle } from 'lucide-react';
import './ReportSubSection.css';

const TransportReports = () => {
    const [filters, setFilters] = useState({});
    const { transportReports = [] } = reportsOverviewData || {};

    const summaryStats = [
        { label: 'Active Routes', value: '12', change: 'All Operational', icon: MapPin, bgColor: '#dbeafe' },
        { label: 'Students Transported', value: '850', change: '+15', icon: Bus, bgColor: '#dcfce7' },
        { label: 'Maintenance Alerts', value: '1', change: 'Urgent', icon: AlertCircle, bgColor: '#fee2e2' },
    ];

    const filterOptions = [
        {
            key: 'status',
            label: 'Status',
            type: 'select',
            options: [
                { label: 'On Time', value: 'On Time' },
                { label: 'Delayed', value: 'Delayed' },
                { label: 'Maintenance', value: 'Maintenance' },
            ]
        }
    ];

    const columns = [
        {
            key: 'route', label: 'Route Name', sortable: true, render: (row) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="transaction-icon" style={{ background: '#dbeafe', color: '#2563eb' }}>
                        <Bus size={16} />
                    </div>
                    <span style={{ fontWeight: '600', color: '#1e293b' }}>{row.route}</span>
                </div>
            )
        },
        { key: 'driver', label: 'Driver', sortable: true, render: (row) => <span style={{ color: '#475569' }}>{row.driver}</span> },
        {
            key: 'students', label: 'Occupancy', sortable: true, render: (row) => (
                <div style={{ width: '100px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                        <span style={{ color: '#64748b' }}>{row.students}/{row.capacity}</span>
                        <span style={{ color: '#94a3b8' }}>{(row.students / row.capacity * 100).toFixed(0)}%</span>
                    </div>
                    <div className="progress-bar-container">
                        <div
                            className="progress-bar-fill"
                            style={{
                                width: `${(row.students / row.capacity * 100)}%`,
                                background: row.students / row.capacity > 0.9 ? '#ef4444' : '#3b82f6'
                            }}
                        />
                    </div>
                </div>
            )
        },
        {
            key: 'status', label: 'Status', sortable: true, render: (row) => (
                <span className={`status-badge ${row.status === 'On Time' ? 'status-excellent' :
                        row.status === 'Delayed' ? 'status-pending' :
                            'status-overdue'
                    }`}>
                    {row.status}
                </span>
            )
        },
        { key: 'lastUpdate', label: 'Last Update', sortable: true },
    ];

    const handleQuickAction = (row) => [
        { label: 'Track Route', icon: <MapPin size={14} />, onClick: () => console.log('Track', row) },
        { label: 'Download Log', icon: <Download size={14} />, onClick: () => console.log('Download', row) },
    ];

    return (
        <div className="report-subsection-container">
            <div className="report-section-header">
                <h2 className="report-section-title">Transport Data</h2>
                <p className="report-section-subtitle">Route status and vehicle logs</p>
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
                                <span style={{ color: '#64748b', fontWeight: '600' }}>
                                    {stat.change}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="report-table-section" style={{ gridColumn: '1 / -1' }}>
                <div className="report-table-header">
                    <h3 className="report-table-title">Route Management</h3>
                    <button className="report-export-btn">
                        <Download size={16} />
                        Export Report
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
                    data={transportReports}
                    selectable={true}
                    onQuickAction={handleQuickAction}
                    pageSize={8}
                />
            </div>
        </div>
    );
};

export default TransportReports;
