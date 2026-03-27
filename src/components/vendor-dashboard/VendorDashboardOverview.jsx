import React, { useState, useEffect } from 'react';
import {
    ShoppingCart,
    DollarSign,
    Package,
    Star,
    TrendingUp,
    AlertCircle,
    CheckCircle,
    Clock,
    School,
    Plus
} from 'lucide-react';
import './VendorDashboardOverview.css';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

const VendorDashboardOverview = () => {
    const { user } = useAuth();
    const [mySchools, setMySchools] = useState([]);
    const [stats, setStats] = useState({
        activeServices: 0,
        pendingOrders: 0,
        monthlyEarnings: 0,
        avgRating: 0
    });
    
    // Form state for adding a school
    const [showAddForm, setShowAddForm] = useState(false);
    const [newSchool, setNewSchool] = useState({
        name: '',
        address: '',
        city: '',
        description: '',
        contactEmail: '',
        contactPhone: ''
    });

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/vendor/stats`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setStats(data);
            }
        } catch (err) {
            toast.error('Failed to load vendor stats');
        }
    };

    const fetchMySchools = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!user?._id) return;
            
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/schools?vendor=${user._id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setMySchools(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            toast.error('Failed to load schools');
        }
    };

    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/vendor/orders`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setOrders(data);
            }
        } catch (err) {
            toast.error('Failed to load orders');
        }
    };

    useEffect(() => {
        if (user) {
            fetchMySchools();
            fetchStats();
            fetchOrders();
        }
    }, [user]);

    const handleAddSchool = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/schools`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newSchool)
            });
            
            if (res.ok) {
                setShowAddForm(false);
                setNewSchool({ name: '', address: '', city: '', description: '', contactEmail: '', contactPhone: '' });
                fetchMySchools();
                toast.success('School added successfully!');
            } else {
                const err = await res.json();
                toast.error('Error: ' + err.message);
            }
        } catch (error) {
            toast.error('Network error');
        }
    };

    const kpiData = [
        { title: 'Active Services', value: stats.activeServices, change: 'Currently Active', icon: ShoppingCart, color: '#3b82f6' },
        { title: 'Pending Orders', value: stats.pendingOrders, change: 'Awaiting Confirmation', icon: Clock, color: '#f59e0b' },
        { title: 'Monthly Earnings', value: `$${stats.monthlyEarnings.toLocaleString()}`, change: '+15% from last month', icon: DollarSign, color: '#10b981' },
        { title: 'Average Rating', value: stats.avgRating, change: 'Based on 45 reviews', icon: Star, color: '#8b5cf6' },
    ];

    const recentOrders = (orders || []).slice(0, 5);
    const revenueByMonth = recentOrders.reduce((acc, order) => {
        const d = new Date(order.createdAt || Date.now());
        const key = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        const amount = Number(order.totalAmount || order.amount || 0);
        acc[key] = (acc[key] || 0) + amount;
        return acc;
    }, {});

    return (
        <div className="vendor-dashboard-overview">
            <div className="overview-header">
                <div>
                    <h1 className="page-title">Vendor Dashboard</h1>
                    <p className="page-subtitle">Welcome back! Here's your business overview.</p>
                </div>
                <div className="date-display">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            {/* KPI Cards */}
            <div className="kpi-grid">
                {kpiData.map((kpi, index) => (
                    <div key={index} className="kpi-card">
                        <div className="kpi-icon-wrapper" style={{ backgroundColor: `${kpi.color}20`, color: kpi.color }}>
                            <kpi.icon size={24} />
                        </div>
                        <div className="kpi-content">
                            <h3 className="kpi-title">{kpi.title}</h3>
                            <div className="kpi-value">{kpi.value}</div>
                            <div className="kpi-change">{kpi.change}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="dashboard-grid">
                {/* My Schools Section (Replaces Recent Orders for Backend Integration) */}
                <div className="dashboard-card">
                    <div className="card-header">
                        <h2 className="card-title">My Registered Schools</h2>
                        <div className="vendor-header-actions">
                             <button 
                                className="btn-primary vendor-add-school-btn"
                                onClick={() => setShowAddForm(!showAddForm)}
                             >
                                <Plus size={16} /> Add School
                             </button>
                        </div>
                    </div>
                    <div className="card-body">
                        {showAddForm && (
                            <form onSubmit={handleAddSchool} className="vendor-school-form">
                                <h3 className="vendor-school-form-title">Register New School</h3>
                                <div className="vendor-school-form-grid">
                                    <input className="vendor-school-input" placeholder="School Name" required value={newSchool.name} onChange={e => setNewSchool({...newSchool, name: e.target.value})} />
                                    <input className="vendor-school-input" placeholder="City" required value={newSchool.city} onChange={e => setNewSchool({...newSchool, city: e.target.value})} />
                                    <input className="vendor-school-input" placeholder="Address" required value={newSchool.address} onChange={e => setNewSchool({...newSchool, address: e.target.value})} />
                                    <input className="vendor-school-input" placeholder="Contact Email" required type="email" value={newSchool.contactEmail} onChange={e => setNewSchool({...newSchool, contactEmail: e.target.value})} />
                                    <input className="vendor-school-input" placeholder="Contact Phone" required value={newSchool.contactPhone} onChange={e => setNewSchool({...newSchool, contactPhone: e.target.value})} />
                                </div>
                                <textarea className="vendor-school-input vendor-school-textarea" placeholder="Description" value={newSchool.description} onChange={e => setNewSchool({...newSchool, description: e.target.value})} />
                                <button type="submit" className="btn-primary vendor-school-submit-btn">Submit</button>
                            </form>
                        )}

                        <div className="orders-list">
                            {mySchools.length === 0 ? (
                                <p className="empty-state-message">You haven't registered any schools yet.</p>
                            ) : (
                                mySchools.map((school) => (
                                    <div key={school._id} className="order-item">
                                        <div className="order-info">
                                            <h4>{school.name}</h4>
                                            <p>{school.city}</p>
                                            <span className="order-date">{school.contactEmail}</span>
                                        </div>
                                        <div className="order-details">
                                            <span className="badge badge-success">Active</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Revenue Chart */}
                <div className="dashboard-card">
                    <div className="card-header">
                        <h2 className="card-title">Revenue Analytics</h2>
                        <TrendingUp size={20} className="text-gray-400" />
                    </div>
                    <div className="card-body">
                        {Object.keys(revenueByMonth).length === 0 ? (
                            <p className="empty-state-message">No recent revenue data.</p>
                        ) : (
                            <div className="performance-list">
                                {Object.entries(revenueByMonth).map(([month, amount]) => (
                                    <div key={month} className="performance-item">
                                        <span>{month}</span>
                                        <span className="performance-rating">${Number(amount).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Service Performance */}
                <div className="dashboard-card">
                    <div className="card-header">
                        <h2 className="card-title">Service Performance</h2>
                        <Star size={20} className="text-gray-400" />
                    </div>
                    <div className="card-body">
                        <div className="performance-list">
                            <div className="performance-item">
                                <span>Stationery Supplies</span>
                                <span className="performance-rating">4.9 ⭐</span>
                            </div>
                            <div className="performance-item">
                                <span>Catering Services</span>
                                <span className="performance-rating">4.7 ⭐</span>
                            </div>
                            <div className="performance-item">
                                <span>Cleaning Supplies</span>
                                <span className="performance-rating">4.8 ⭐</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pending Actions */}
                <div className="dashboard-card">
                    <div className="card-header">
                        <h2 className="card-title">Pending Actions</h2>
                        <AlertCircle size={20} className="text-orange-500" />
                    </div>
                    <div className="card-body">
                        <div className="actions-list">
                            <div className="action-item">
                                <div className="action-icon bg-yellow-100 text-yellow-600">
                                    <Clock size={16} />
                                </div>
                                <div className="action-details">
                                    <p>{stats.pendingOrders || 0} orders awaiting confirmation</p>
                                    <span className="action-time">Action Required</span>
                                </div>
                            </div>
                            <div className="action-item">
                                <div className="action-icon bg-blue-100 text-blue-600">
                                    <Package size={16} />
                                </div>
                                <div className="action-details">
                                    <p>{recentOrders.filter(o => o.status === 'confirmed').length} deliveries in progress</p>
                                    <span className="action-time">Upcoming</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorDashboardOverview;

