import React, { useState, useEffect } from 'react';
import { Truck, MapPin, Users, AlertTriangle, Clock, Settings, Navigation, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import AddVehicleModal from './transport/AddVehicleModal';
import AddRouteModal from './transport/AddRouteModal';
import './parents/ParentsOverview.css';

const SchoolTransportView = () => {
    const [data, setData] = useState({ stats: { totalVehicles: 0, activeRoutes: 0, studentsUsingTransport: 0, pendingRequests: 0, driversAvailable: 0 }, vehicles: [], routes: [] });
    const [loading, setLoading] = useState(true);
    const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
    const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/transport`, { headers: { 'Authorization': `Bearer ${token}` } });
            if (res.ok) setData(await res.json());
        } catch (error) { toast.error('Error fetching transport data'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleDeleteVehicle = async (id) => {
        if (!window.confirm('Delete this vehicle?')) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/transport/vehicles/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
            if (res.ok) { toast.success('Deleted'); fetchData(); }
        } catch (error) { toast.error('Error deleting'); }
    };

    const handleDeleteRoute = async (id) => {
        if (!window.confirm('Delete this route?')) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/transport/routes/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
            if (res.ok) { toast.success('Deleted'); fetchData(); }
        } catch (error) { toast.error('Error deleting'); }
    };

    const kpiCards = [
        { title: "Total Vehicles", value: data.stats.totalVehicles, icon: <Truck size={28} />, color: "#3b82f6", trend: `${data.stats.driversAvailable} active` },
        { title: "Active Routes", value: data.stats.activeRoutes, icon: <Navigation size={28} />, color: "#10b981", trend: "running now" },
        { title: "Students", value: data.stats.studentsUsingTransport, icon: <Users size={28} />, color: "#f59e0b", trend: "using transport" },
        { title: "Requests", value: data.stats.pendingRequests, icon: <Clock size={28} />, color: "#8b5cf6", trend: "pending approval" }
    ];

    return (
        <div className="parents-overview">
            <div className="overview-header">
                <div>
                    <h1 className="overview-title">Transport Management</h1>
                    <p className="overview-subtitle">Manage fleet, routes, and transport requests</p>
                </div>
                <div className="header-actions" style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn-secondary" onClick={() => setIsVehicleModalOpen(true)}>
                        <Plus size={18} /> Add Vehicle
                    </button>
                    <button className="btn-primary" onClick={() => setIsRouteModalOpen(true)}>
                        <Plus size={18} /> Add Route
                    </button>
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
                    <div className="activity-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {data.routes.length === 0 ? <p style={{ padding: '20px' }}>No routes configured.</p> : data.routes.map((route) => (
                            <div key={route._id} className="activity-item">
                                <div className="activity-avatar" style={{ background: route.status === 'On Time' ? '#10b981' : '#ef4444' }}>
                                    <MapPin size={20} color="white" />
                                </div>
                                <div className="activity-details">
                                    <div className="activity-parent" style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                                        {route.name}
                                        <button onClick={() => handleDeleteRoute(route._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={13} /></button>
                                    </div>
                                    <div className="activity-action">
                                        Vehicle: {route.vehicle?.number} • Stops: {route.stops.length}
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
                        <div className="alert-item alert-info">
                            <div className="alert-icon"><AlertTriangle size={18} /></div>
                            <div className="alert-content">
                                <div className="alert-label">SYSTEM</div>
                                <div className="alert-count">Live tracking is working optimally.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="activity-card">
                <div className="card-header">
                    <h2 className="card-title"><Truck size={20} />Vehicle Fleet</h2>
                </div>
                <div className="activity-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {data.vehicles.length === 0 ? <p style={{ padding: '20px' }}>No vehicles registered.</p> : data.vehicles.map((vehicle) => (
                        <div key={vehicle._id} className="activity-item">
                            <div className="activity-avatar" style={{ background: '#3b82f6' }}>
                                {vehicle.type[0]}
                            </div>
                            <div className="activity-details">
                                <div className="activity-parent" style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                                    {vehicle.number} ({vehicle.type})
                                    <button onClick={() => handleDeleteVehicle(vehicle._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={13} /></button>
                                </div>
                                <div className="activity-action">Capacity: {vehicle.capacity} • Driver: {vehicle.driver}</div>
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

            <AddVehicleModal isOpen={isVehicleModalOpen} onClose={() => setIsVehicleModalOpen(false)} onSave={() => { setIsVehicleModalOpen(false); fetchData(); toast.success('Vehicle added'); }} />
            <AddRouteModal isOpen={isRouteModalOpen} onClose={() => setIsRouteModalOpen(false)} onSave={() => { setIsRouteModalOpen(false); fetchData(); toast.success('Route added'); }} vehicles={data.vehicles} />
        </div>
    );
};

export default SchoolTransportView;
