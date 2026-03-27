import React, { useState, useEffect } from 'react';
import { Bus, MapPin, Clock, User } from 'lucide-react';
import { toast } from 'sonner';
import './ParentViews.css';

const ParentTransportView = () => {
    const [data, setData] = useState({ activeChildData: null });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransportData = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/parent/dashboard-data`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) setData(await res.json());
            } catch (error) { toast.error('Error fetching transport data'); }
            finally { setLoading(false); }
        };
        fetchTransportData();
    }, []);

    const transport = data.activeChildData?.transport;
    const vehicles = transport?.vehicles || [];
    const routes = transport?.routes || [];
    const stats = transport?.stats || {};
    return (
        <div className="parent-view-container">
            <div className="view-header">
                <h1 className="view-title">Transport Tracking</h1>
                <p className="view-subtitle">View transport route and driver information</p>
            </div>

            <div className="view-content">
                <div className="content-card">
                    <div className="card-header">
                        <h2 className="card-title">Transport Information</h2>
                        <Bus size={20} className="text-gray-400" />
                    </div>
                    <div className="card-body">
                        {loading ? (
                            <p>Loading...</p>
                        ) : routes.length === 0 ? (
                            <p>No transport routes configured for this school yet.</p>
                        ) : (
                            <div className="transport-details" style={{ display: 'grid', gap: '12px' }}>
                                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                    <span className="badge badge-success">{stats.activeRoutes || routes.length} Routes</span>
                                    <span className="badge badge-neutral">{stats.totalVehicles || vehicles.length} Vehicles</span>
                                    <span className="badge badge-warning">{stats.driversAvailable || 0} Drivers Available</span>
                                </div>

                                {routes.map((r) => (
                                    <div
                                        key={r._id}
                                        style={{
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            padding: '14px',
                                            background: '#f9fafb'
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                                            <div>
                                                <h3 style={{ fontWeight: 700, marginBottom: 4 }}>{r.name}</h3>
                                                <p style={{ color: '#64748b', marginBottom: 8 }}>
                                                    Vehicle: {r.vehicle?.number || '—'} • Driver: {r.vehicle?.driver || '—'}
                                                </p>
                                            </div>
                                            <span className={r.status === 'Delayed' ? 'badge badge-warning' : 'badge badge-success'}>
                                                {r.status || 'On Time'}
                                            </span>
                                        </div>

                                        {Array.isArray(r.stops) && r.stops.length > 0 && (
                                            <div style={{ marginTop: 8, color: '#475569', fontSize: '0.95rem' }}>
                                                <span style={{ fontWeight: 600 }}>Stops:</span> {r.stops.join(' → ')}
                                            </div>
                                        )}
                                    </div>
                                ))}

                                <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                                    Student-specific transport assignment is not modeled yet; this shows school transport setup.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParentTransportView;

