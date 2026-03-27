import React, { useEffect, useMemo, useState } from 'react';
import DataTable from '../shared/DataTable';
import FilterPanel from '../shared/FilterPanel';
import { FileText, Download, DollarSign, TrendingUp, CreditCard, PieChart as PieIcon, Calendar } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import './ReportSubSection.css';

const FinanceReports = () => {
    const [filters, setFilters] = useState({});
    const [financeReports, setFinanceReports] = useState([]);
    const [revenueData, setRevenueData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/schools/reports/finance`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error(`Failed to load finance report (${res.status})`);
                const json = await res.json();
                setFinanceReports(json?.financeReports || []);
                setRevenueData(json?.revenueData || []);
            } catch (e) {
                setError(e?.message || 'Failed to load finance reports');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const summaryStats = useMemo(() => {
        let revenue = 0;
        let expenses = 0;
        let pending = 0;
        for (const r of financeReports) {
            const amt = Number(r.amount) || 0;
            if (String(r.status).toLowerCase() === 'pending') pending += amt;
            if (amt >= 0) revenue += amt;
            if (amt < 0) expenses += Math.abs(amt);
        }
        return [
            { label: 'Total Revenue', value: revenue ? revenue.toLocaleString() : '0', change: '—', icon: DollarSign, bgColor: '#dcfce7' },
            { label: 'Pending Dues', value: pending ? pending.toLocaleString() : '0', change: '—', icon: CreditCard, bgColor: '#fee2e2' },
            { label: 'Expenses', value: expenses ? expenses.toLocaleString() : '0', change: '—', icon: TrendingUp, bgColor: '#dbeafe' },
        ];
    }, [financeReports]);

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

    const downloadCsv = () => {
        const headers = ['type', 'amount', 'status', 'date'];
        const lines = [
            headers.join(','),
            ...financeReports.map((r) => headers.map((h) => `"${String(r?.[h] ?? '').replaceAll('"', '""')}"`).join(',')),
        ];
        const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `finance-report-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

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
                        <button className="report-export-btn" onClick={downloadCsv} disabled={loading || !!error}>
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
                        pageSize={8}
                    />
                    {loading && <div style={{ padding: '12px', color: '#64748b', fontWeight: 600 }}>Loading…</div>}
                    {error && <div style={{ padding: '12px', color: '#ef4444', fontWeight: 600 }}>{error}</div>}
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
