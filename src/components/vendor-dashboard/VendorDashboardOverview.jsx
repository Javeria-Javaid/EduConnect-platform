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

const VendorDashboardOverview = () => {
    const { user } = useAuth();
    const [mySchools, setMySchools] = useState([]);
    const [loading, setLoading] = useState(false);
    
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

    const fetchMySchools = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!user?._id) return;
            
            const res = await fetch(`http://localhost:5000/api/schools?vendor=${user._id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setMySchools(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            console.error("Error fetching schools:", error);
        }
    };

    useEffect(() => {
        if (user) {
            fetchMySchools();
        }
    }, [user]);

    const handleAddSchool = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/schools', {
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
                alert('School added successfully!');
            } else {
                const err = await res.json();
                alert('Error: ' + err.message);
            }
        } catch (error) {
            alert('Network error');
        }
    };

    const kpiData = [
        { title: 'Active Services', value: '12', change: 'Currently Active', icon: ShoppingCart, color: '#3b82f6' },
        { title: 'Pending Orders', value: '5', change: 'Awaiting Confirmation', icon: Clock, color: '#f59e0b' },
        { title: 'Monthly Earnings', value: '$12,450', change: '+15% from last month', icon: DollarSign, color: '#10b981' },
        { title: 'Average Rating', value: '4.8', change: 'Based on 45 reviews', icon: Star, color: '#8b5cf6' },
    ];

    const recentOrders = [
        { id: 1, school: 'Greenwood High School', service: 'Stationery Supplies', amount: '$1,200', status: 'pending', date: 'Dec 5, 2025' },
        { id: 2, school: 'Riverside Academy', service: 'Catering Services', amount: '$850', status: 'confirmed', date: 'Dec 4, 2025' },
        { id: 3, school: 'Sunshine Elementary', service: 'Cleaning Supplies', amount: '$450', status: 'completed', date: 'Dec 3, 2025' },
    ];

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
                        <div style={{ display: 'flex', gap: '10px' }}>
                             <button 
                                className="btn-primary" 
                                style={{ padding: '5px 10px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px' }}
                                onClick={() => setShowAddForm(!showAddForm)}
                             >
                                <Plus size={16} /> Add School
                             </button>
                        </div>
                    </div>
                    <div className="card-body">
                        {showAddForm && (
                            <form onSubmit={handleAddSchool} style={{ marginBottom: '20px', padding: '15px', background: '#f0f9ff', borderRadius: '8px' }}>
                                <h3 style={{ marginBottom: '10px' }}>Register New School</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                    <input placeholder="School Name" required value={newSchool.name} onChange={e => setNewSchool({...newSchool, name: e.target.value})} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                                    <input placeholder="City" required value={newSchool.city} onChange={e => setNewSchool({...newSchool, city: e.target.value})} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                                    <input placeholder="Address" required value={newSchool.address} onChange={e => setNewSchool({...newSchool, address: e.target.value})} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                                    <input placeholder="Contact Email" required type="email" value={newSchool.contactEmail} onChange={e => setNewSchool({...newSchool, contactEmail: e.target.value})} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                                    <input placeholder="Contact Phone" required value={newSchool.contactPhone} onChange={e => setNewSchool({...newSchool, contactPhone: e.target.value})} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                                </div>
                                <textarea placeholder="Description" value={newSchool.description} onChange={e => setNewSchool({...newSchool, description: e.target.value})} style={{ width: '100%', marginTop: '10px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                                <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>Submit</button>
                            </form>
                        )}

                        <div className="orders-list">
                            {mySchools.length === 0 ? (
                                <p>You haven't registered any schools yet.</p>
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
                        <div className="chart-placeholder">
                            <p>Revenue chart will be displayed here</p>
                        </div>
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
                                    <p>5 orders awaiting confirmation</p>
                                    <span className="action-time">Action Required</span>
                                </div>
                            </div>
                            <div className="action-item">
                                <div className="action-icon bg-blue-100 text-blue-600">
                                    <Package size={16} />
                                </div>
                                <div className="action-details">
                                    <p>3 deliveries scheduled for tomorrow</p>
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

