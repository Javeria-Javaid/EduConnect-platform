import React from 'react';
import { Bus, MapPin, Clock, User } from 'lucide-react';
import './ParentViews.css';

const ParentTransportView = () => {
    const transportInfo = {
        route: 'Route 5',
        driver: 'John Smith',
        driverPhone: '+1 234-567-8900',
        vehicleNumber: 'SCH-2025',
        pickupTime: '7:30 AM',
        dropoffTime: '3:45 PM',
        pickupLocation: 'Main Street Bus Stop',
        status: 'active'
    };

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
                        <div className="transport-details">
                            <div className="detail-item">
                                <span className="detail-label">Route</span>
                                <span className="detail-value">{transportInfo.route}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Vehicle Number</span>
                                <span className="detail-value">{transportInfo.vehicleNumber}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Driver Name</span>
                                <span className="detail-value">{transportInfo.driver}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Driver Contact</span>
                                <span className="detail-value">{transportInfo.driverPhone}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Pickup Time</span>
                                <span className="detail-value">{transportInfo.pickupTime}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Drop-off Time</span>
                                <span className="detail-value">{transportInfo.dropoffTime}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Pickup Location</span>
                                <span className="detail-value">{transportInfo.pickupLocation}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Status</span>
                                <span className="badge badge-success">{transportInfo.status}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParentTransportView;

