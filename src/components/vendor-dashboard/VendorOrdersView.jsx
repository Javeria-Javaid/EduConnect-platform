import React from 'react';
import { ShoppingCart, Clock, CheckCircle, X } from 'lucide-react';
import './VendorViews.css';

const VendorOrdersView = () => {
    const orders = [
        { id: 1, school: 'Greenwood High', service: 'Stationery', amount: '$1,200', status: 'pending', date: 'Dec 5, 2025' },
        { id: 2, school: 'Riverside Academy', service: 'Catering', amount: '$850', status: 'confirmed', date: 'Dec 4, 2025' },
        { id: 3, school: 'Sunshine Elementary', service: 'Cleaning', amount: '$450', status: 'completed', date: 'Dec 3, 2025' },
    ];

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
                        <div className="orders-table">
                            {orders.map((order) => (
                                <div key={order.id} className="order-row">
                                    <div className="order-info">
                                        <h4>{order.school}</h4>
                                        <p>{order.service}</p>
                                        <span className="order-date">{order.date}</span>
                                    </div>
                                    <div className="order-amount">{order.amount}</div>
                                    <div className="order-status">
                                        {order.status === 'pending' && (
                                            <span className="badge badge-warning">Pending</span>
                                        )}
                                        {order.status === 'confirmed' && (
                                            <span className="badge badge-info">Confirmed</span>
                                        )}
                                        {order.status === 'completed' && (
                                            <span className="badge badge-success">Completed</span>
                                        )}
                                    </div>
                                    <div className="order-actions">
                                        {order.status === 'pending' && (
                                            <>
                                                <button className="btn-sm btn-success">Confirm</button>
                                                <button className="btn-sm btn-danger">Reject</button>
                                            </>
                                        )}
                                        {order.status === 'confirmed' && (
                                            <button className="btn-sm btn-primary">Mark Complete</button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorOrdersView;

