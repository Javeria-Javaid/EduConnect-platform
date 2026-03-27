import React, { useEffect, useMemo, useState } from 'react';
import DataTable from '../shared/DataTable';
import FilterPanel from '../shared/FilterPanel';
import { Download, Bus, MapPin, AlertCircle } from 'lucide-react';
import './ReportSubSection.css';

const TransportReports = () => {
    const [filters, setFilters] = useState({});
    const [routes, setRoutes] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/transport`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error(`Failed to load transport data (${res.status})`);
                const json = await res.json();
                setRoutes(json?.routes || []);
                setStats(json?.stats || null);
            } catch (e) {
                setError(e?.message || 'Failed to load transport report');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const transportReports = useMemo(() => {
        return (routes || []).map((r) => ({
            id: r._id,
            route: r.name,
            driver: r.vehicle?.driver || '—',
            vehicle: r.vehicle?.number || '—',
            stops: Array.isArray(r.stops) ? r.stops.length : 0,
            status: r.status || 'On Time',
            lastUpdate: r.updatedAt ? new Date(r.updatedAt).toISOString().slice(0, 10) : '—',
        }));
    }, [routes]);

    const summaryStats = useMemo(() => {
        const activeRoutes = stats?.activeRoutes ?? transportReports.length;
        const vehicles = stats?.totalVehicles ?? 0;
        const maintenance = 0;
        return [
            { label: 'Active Routes', value: String(activeRoutes), change: 'Live from DB', icon: MapPin, bgColor: '#dbeafe' },
            { label: 'Vehicles', value: String(vehicles), change: 'Live from DB', icon: Bus, bgColor: '#dcfce7' },
            { label: 'Maintenance Alerts', value: String(maintenance), change: '—', icon: AlertCircle, bgColor: '#fee2e2' },
        ];
    }, [stats, transportReports.length]);

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
        { key: 'vehicle', label: 'Vehicle', sortable: true, render: (row) => <span style={{ color: '#475569', fontWeight: 600 }}>{row.vehicle}</span> },
        { key: 'driver', label: 'Driver', sortable: true, render: (row) => <span style={{ color: '#475569' }}>{row.driver}</span> },
        { key: 'stops', label: 'Stops', sortable: true },
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

    const downloadCsv = () => {
        const headers = ['route', 'vehicle', 'driver', 'stops', 'status', 'lastUpdate'];
        const lines = [
            headers.join(','),
            ...transportReports.map((r) => headers.map((h) => `"${String(r?.[h] ?? '').replaceAll('"', '""')}"`).join(',')),
        ];
        const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transport-report-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

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
                    data={transportReports}
                    selectable={true}
                    pageSize={8}
                />
                {loading && <div style={{ padding: '12px', color: '#64748b', fontWeight: 600 }}>Loading…</div>}
                {error && <div style={{ padding: '12px', color: '#ef4444', fontWeight: 600 }}>{error}</div>}
            </div>
        </div>
    );
};

export default TransportReports;
