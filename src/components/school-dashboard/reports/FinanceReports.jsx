import React, { useState } from 'react';
import DataTable from '../shared/DataTable';
import FilterPanel from '../shared/FilterPanel';
import { reportsOverviewData } from './mockData';
import { FileText, Download, DollarSign, TrendingUp, CreditCard, PieChart as PieIcon, Calendar } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import './ReportSubSection.css';

const FinanceReports = () => {
    const [filters, setFilters] = useState({});
    const { financeReports } = reportsOverviewData;

    // Mock Summary Data
    const summaryStats = [
        { label: 'Total Revenue', value: '$1.2M', change: '+8%', icon: DollarSign, bgColor: '#dcfce7' },
        { label: 'Pending Dues', value: '$45k', change: '-2%', icon: CreditCard, bgColor: '#fee2e2' },
        { label: 'Expenses', value: '$850k', change: '+5%', icon: TrendingUp, bgColor: '#dbeafe' },
    ];

    const revenueData = [
        { name: 'Tuition Fees', value: 65, color: '#3AC47D' },
        { name: 'Transport', value: 15, color: '#2A6EF2' },
        { name: 'Donations', value: 10, color: '#F59E0B' },
        { name: 'Others', value: 10, color: '#6366F1' },
    ];

    const filterOptions = [
        {
            key: 'status',
            label: 'Status',
            type: 'select',
            options: [
                { label: 'Collected', value: 'Collected' },
                { label: 'Pending', value: 'Pending' },
                { label: 'Overdue', value: 'Overdue' },
            ]
        },
        {
            key: 'type',
            label: 'Fee Type',
            type: 'multiselect',
            options: [
                { label: 'Tuition', value: 'Tuition' },
                { label: 'Transport', value: 'Transport' },
                { label: 'Library', value: 'Library' },
            ]
        }
    ];

    const columns = [
        {
            key: 'type', label: 'Transaction Type', sortable: true, render: (row) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="transaction-icon">
                        <DollarSign size={16} />
                    </div>
                    <span style={{ fontWeight: '600', color: '#1e293b' }}>{row.type}</span>
                </div>
            )
        },
        {
            key: 'amount', label: 'Amount', sortable: true, render: (row) => (
                <span style={{ fontWeight: '800', color: '#1e293b' }}>{row.amount}</span>
            )
        },
        {
            key: 'status', label: 'Status', sortable: true, render: (row) => (
                <span className={`status-badge ${row.status === 'Collected' ? 'status-collected' :
                        row.status === 'Pending' ? 'status-pending' :
                            'status-overdue'
                    }`}>
                    {row.status}
                </span>
            )
        },
        { key: 'date', label: 'Date', sortable: true },
    ];

    const handleQuickAction = (row) => [
        { label: 'View Invoice', icon: <FileText size={14} />, onClick: () => console.log('View', row) },
        { label: 'Download Receipt', icon: <Download size={14} />, onClick: () => console.log('Download', row) },
    ];

    return (
        <div className="report-subsection-container">
            {/* Header */}
            <div className="report-section-header">
                <h2 className="report-section-title">Financial Reports</h2>
                <p className="report-section-subtitle">Revenue tracking and fee collection status</p>
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
                                <span style={{ color: '#94a3b8' }}>vs last month</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="report-content-grid">
                {/* Filters & Table */}
                <div className="report-table-section">
                    <div className="report-table-header">
                        <h3 className="report-table-title">Transaction History</h3>
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
                        data={financeReports}
                        selectable={true}
                        onQuickAction={handleQuickAction}
                        pageSize={8}
                    />
                </div>

                {/* Revenue Chart */}
                <div className="report-chart-card">
                    <h3 className="report-chart-title">Revenue Sources</h3>
                    <div className="report-chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={revenueData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {revenueData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinanceReports;
