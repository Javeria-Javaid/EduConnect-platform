import React, { useState, useEffect } from 'react';
import { ShoppingCart, Clock, CheckCircle, X } from 'lucide-react';
import { toast } from 'sonner';
import './VendorViews.css';

const VendorOrdersView = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/vendor/orders`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) setOrders(await res.json());
        } catch (error) { toast.error('Failed to fetch orders'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchOrders(); }, []);

    const handleUpdateStatus = async (id, status) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/vendor/orders/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                toast.success('Order status updated');
                fetchOrders();
            } else {
                toast.error('Failed to update status');
            }
        } catch (error) { toast.error('Network error'); }
    };

    return (
        <div className="vendor-view-container">
            <div className="view-header">
                <h1 className="view-title">Orders & Service Requests</h1>
                <p className="view-subtitle">Manage service requests from schools</p>
            </div>

            <div className="view-content">
                <div className="content-card">
                    <div className="card-header">
                        <h2 className="card-title">All Orders</h2>
                        <ShoppingCart size={20} className="text-gray-400" />
                    </div>
                    <div className="card-body">
                        {loading ? <p>Loading orders...</p> : orders.length === 0 ? <p>No orders found.</p> : (
                            <div className="orders-table">
                                {orders.map((order) => (
                                    <div key={order._id} className="order-row">
                                        <div className="order-info">
                                            <h4>{order.school?.schoolName || 'Unknown School'}</h4>
                                            <p>{order.items?.length || 0} items</p>
                                            <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="order-amount">${order.totalAmount}</div>
                                        <div className="order-status">
                                            {order.status === 'pending' && (
                                                <span className="badge badge-warning">Pending</span>
                                            )}
                                            {order.status === 'confirmed' && (
                                                <span className="badge badge-info">Confirmed</span>
                                            )}
                                            {order.status === 'completed' || order.status === 'delivered' ? (
                                                <span className="badge badge-success">Completed</span>
                                            ) : null}
                                            {order.status === 'rejected' && (
                                                <span className="badge badge-danger">Rejected</span>
                                            )}
                                        </div>
                                        <div className="order-actions">
                                            {order.status === 'pending' && (
                                                <>
                                                    <button className="btn-sm btn-success" onClick={() => handleUpdateStatus(order._id, 'confirmed')}>Confirm</button>
                                                    <button className="btn-sm btn-danger" onClick={() => handleUpdateStatus(order._id, 'rejected')}>Reject</button>
                                                </>
                                            )}
                                            {order.status === 'confirmed' && (
                                                <button className="btn-sm btn-primary" onClick={() => handleUpdateStatus(order._id, 'delivered')}>Mark Complete</button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorOrdersView;

