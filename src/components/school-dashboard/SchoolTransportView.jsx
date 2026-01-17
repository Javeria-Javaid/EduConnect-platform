import React from 'react';
import { Truck, MapPin, Users, AlertTriangle, Clock, Settings, Navigation } from 'lucide-react';
import { transportStats, vehicles, routes, transportAlerts } from './reports/mockData';
import './parents/ParentsOverview.css';

const SchoolTransportView = () => {
    const { totalVehicles, activeRoutes, studentsUsingTransport, pendingRequests, driversAvailable } = transportStats;

    const kpiCards = [
        { title: "Total Vehicles", value: totalVehicles, icon: <Truck size={28} />, color: "#3b82f6", trend: `${driversAvailable} drivers` },
        { title: "Active Routes", value: activeRoutes, icon: <Navigation size={28} />, color: "#10b981", trend: "running now" },
        { title: "Students", value: studentsUsingTransport, icon: <Users size={28} />, color: "#f59e0b", trend: "using transport" },
        { title: "Requests", value: pendingRequests, icon: <Clock size={28} />, color: "#8b5cf6", trend: "pending approval" }
    ];

    return (
        <div className="parents-overview">
            <div className="overview-header">
                <div>
                    <h1 className="overview-title">Transport Management</h1>
                    <p className="overview-subtitle">Manage fleet, routes, and transport requests</p>
                </div>
            </div>

            <div className="kpi-grid">
                {kpiCards.map((card, index) => (
                    <div key={index} className="kpi-card">
                        <div className="kpi-icon" style={{ background: `${card.color}15`, color: card.color }}>
                            {card.icon}
                        </div>
                        <div className="kpi-content">
                            <h3 className="kpi-title">{card.title}</h3>
                            <div className="kpi-value">{card.value}</div>
                            <div className="kpi-trend">{card.trend}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="stats-alerts-row">
                <div className="communication-card">
                    <div className="card-header">
                        <h2 className="card-title"><Navigation size={20} />Live Route Status</h2>
                    </div>
                    <div className="activity-list">
                        {routes.map((route, index) => (
                            <div key={index} className="activity-item">
                                <div className="activity-avatar" style={{ background: route.status === 'On Time' ? '#10b981' : '#ef4444' }}>
                                    {route.id.split('-')[1]}
                                </div>
                                <div className="activity-details">
                                    <div className="activity-parent">{route.name}</div>
                                    <div className="activity-action">
                                        Driver: {route.driver} • Vehicle: {route.vehicle} • Next: {route.nextStop}
                                    </div>
                                </div>
                                <div className="activity-time" style={{ color: route.status === 'On Time' ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                                    {route.status}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="alerts-card">
                    <div className="card-header">
                        <h2 className="card-title"><AlertTriangle size={20} />Fleet Alerts</h2>
                    </div>
                    <div className="alerts-list">
                        {transportAlerts.map((alert, index) => (
                            <div key={index} className={`alert-item alert-${alert.severity === 'warning' ? 'warning' : alert.severity === 'alert' ? 'danger' : 'info'}`}>
                                <div className="alert-icon"><AlertTriangle size={18} /></div>
                                <div className="alert-content">
                                    <div className="alert-label">{alert.type.toUpperCase()}</div>
                                    <div className="alert-count">{alert.message}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="activity-card">
                <div className="card-header">
                    <h2 className="card-title"><Truck size={20} />Vehicle Fleet</h2>
                </div>
                <div className="activity-list">
                    {vehicles.map((vehicle, index) => (
                        <div key={index} className="activity-item">
                            <div className="activity-avatar" style={{ background: '#3b82f6' }}>
                                {vehicle.type[0]}
                            </div>
                            <div className="activity-details">
                                <div className="activity-parent">{vehicle.number} ({vehicle.type})</div>
                                <div className="activity-action">Capacity: {vehicle.capacity} • Driver: {vehicle.driver} • Route: {vehicle.route}</div>
                            </div>
                            <div className="activity-time">
                                <span style={{
                                    padding: '4px 8px',
                                    borderRadius: '12px',
                                    fontSize: '0.75rem',
                                    background: vehicle.status === 'Active' ? '#dcfce7' : '#fee2e2',
                                    color: vehicle.status === 'Active' ? '#166534' : '#991b1b'
                                }}>
                                    {vehicle.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SchoolTransportView;
