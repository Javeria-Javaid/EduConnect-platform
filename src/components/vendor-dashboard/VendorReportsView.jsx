import React from 'react';
import { BarChart3, TrendingUp, DollarSign } from 'lucide-react';
import './VendorViews.css';

const VendorReportsView = () => {
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
                        <div className="chart-placeholder">
                            <p>Sales chart will be displayed here</p>
                        </div>
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
                                <span className="revenue-value">$12,450</span>
                            </div>
                            <div className="revenue-item">
                                <span>Last Month</span>
                                <span className="revenue-value">$10,800</span>
                            </div>
                            <div className="revenue-item">
                                <span>Growth</span>
                                <span className="revenue-value text-green-600">+15.3%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorReportsView;

