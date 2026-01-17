import React from 'react';
import { Store, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import './VendorViews.css';

const VendorProfileView = () => {
    return (
        <div className="vendor-view-container">
            <div className="view-header">
                <h1 className="view-title">Vendor Profile</h1>
                <p className="view-subtitle">Manage your business profile and verification</p>
            </div>

            <div className="view-content">
                <div className="content-card">
                    <div className="card-header">
                        <h2 className="card-title">Business Information</h2>
                        <Store size={20} className="text-gray-400" />
                    </div>
                    <div className="card-body">
                        <div className="profile-form">
                            <div className="form-group">
                                <label>Business Name</label>
                                <input type="text" defaultValue="Stationery Supplies Co." />
                            </div>
                            <div className="form-group">
                                <label>Service Category</label>
                                <select>
                                    <option>Stationery & Supplies</option>
                                    <option>Catering Services</option>
                                    <option>Cleaning Services</option>
                                    <option>Transportation</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Contact Email</label>
                                <input type="email" defaultValue="vendor@educonnect.com" />
                            </div>
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input type="tel" defaultValue="+1 234-567-8900" />
                            </div>
                            <button className="btn-primary">Save Changes</button>
                        </div>
                    </div>
                </div>

                <div className="content-card">
                    <div className="card-header">
                        <h2 className="card-title">Verification Status</h2>
                        <FileText size={20} className="text-gray-400" />
                    </div>
                    <div className="card-body">
                        <div className="verification-status">
                            <div className="status-item">
                                <CheckCircle size={20} className="text-green-600" />
                                <span>Business License Verified</span>
                            </div>
                            <div className="status-item">
                                <CheckCircle size={20} className="text-green-600" />
                                <span>Tax Documents Verified</span>
                            </div>
                            <div className="status-item">
                                <AlertCircle size={20} className="text-yellow-600" />
                                <span>Insurance Certificate Pending</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorProfileView;

