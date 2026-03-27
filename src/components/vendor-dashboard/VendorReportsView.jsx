import React, { useEffect, useMemo, useState } from 'react';
import { BarChart3, TrendingUp, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import './VendorViews.css';

const VendorReportsView = () => {
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState({ monthlyEarnings: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const token = localStorage.getItem('token');
                const [ordersRes, statsRes] = await Promise.all([
                    fetch(`${import.meta.env.VITE_API_URL}/api/vendor/orders`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    fetch(`${import.meta.env.VITE_API_URL}/api/vendor/stats`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);

                if (ordersRes.ok) setOrders(await ordersRes.json());
                if (statsRes.ok) setStats(await statsRes.json());
            } catch {
                toast.error('Failed to load reports');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const revenueByMonth = useMemo(() => {
        const grouped = {};
        (orders || []).forEach((o) => {
            const d = new Date(o.createdAt || Date.now());
            const key = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            grouped[key] = (grouped[key] || 0) + Number(o.totalAmount || o.amount || 0);
        });
        return grouped;
    }, [orders]);

    const monthlyGrowth = useMemo(() => {
        const entries = Object.values(revenueByMonth);
        if (entries.length < 2) return 0;
        const last = entries[entries.length - 1];
        const prev = entries[entries.length - 2];
        if (!prev) return 0;
        return (((last - prev) / prev) * 100);
    }, [revenueByMonth]);

    return (
        <div className="vendor-view-container">
            <div className="view-header">
                <h1 className="view-title">Reports & Analytics</h1>
                <p className="view-subtitle">View sales analytics and performance reports</p>
            </div>

            <div className="view-content">
                <div className="content-card">
                    <div className="card-header">
                        <h2 className="card-title">Sales Analytics</h2>
                        <BarChart3 size={20} className="text-gray-400" />
                    </div>
                    <div className="card-body">
                        {loading ? (
                            <p>Loading analytics...</p>
                        ) : Object.keys(revenueByMonth).length === 0 ? (
                            <p>No sales records yet.</p>
                        ) : (
                            <div className="revenue-stats">
                                {Object.entries(revenueByMonth).map(([month, amount]) => (
                                    <div key={month} className="revenue-item">
                                        <span>{month}</span>
                                        <span className="revenue-value">${Number(amount).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="content-card">
                    <div className="card-header">
                        <h2 className="card-title">Monthly Revenue</h2>
                        <DollarSign size={20} className="text-gray-400" />
                    </div>
                    <div className="card-body">
                        <div className="revenue-stats">
                            <div className="revenue-item">
                                <span>This Month</span>
                                <span className="revenue-value">${Number(stats.monthlyEarnings || 0).toLocaleString()}</span>
                            </div>
                            <div className="revenue-item">
                                <span>Total Orders</span>
                                <span className="revenue-value">{orders.length}</span>
                            </div>
                            <div className="revenue-item">
                                <span>Growth</span>
                                <span className={`revenue-value ${monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {monthlyGrowth >= 0 ? '+' : ''}{monthlyGrowth.toFixed(1)}%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorReportsView;

