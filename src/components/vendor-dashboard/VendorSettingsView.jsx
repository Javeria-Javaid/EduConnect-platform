import React from 'react';
import { Settings, User, Lock, Bell, CreditCard } from 'lucide-react';
import './VendorViews.css';

const VendorSettingsView = () => {
    return (
        <div className="vendor-view-container">
            <div className="view-header">
                <h1 className="view-title">Settings</h1>
                <p className="view-subtitle">Manage your account settings</p>
            </div>

            <div className="view-content">
                <div className="content-card">
                    <div className="card-header">
                        <h2 className="card-title">Profile Settings</h2>
                        <User size={20} className="text-gray-400" />
                    </div>
                    <div className="card-body">
                        <div className="settings-form">
                            <div className="form-group">
                                <label>Business Name</label>
                                <input type="text" defaultValue="Stationery Supplies Co." />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" defaultValue="vendor@educonnect.com" />
                            </div>
                            <button className="btn-primary">Save Changes</button>
                        </div>
                    </div>
                </div>

                <div className="content-card">
                    <div className="card-header">
                        <h2 className="card-title">Password</h2>
                        <Lock size={20} className="text-gray-400" />
                    </div>
                    <div className="card-body">
                        <div className="settings-form">
                            <div className="form-group">
                                <label>Current Password</label>
                                <input type="password" />
                            </div>
                            <div className="form-group">
                                <label>New Password</label>
                                <input type="password" />
                            </div>
                            <button className="btn-primary">Update Password</button>
                        </div>
                    </div>
                </div>

                <div className="content-card">
                    <div className="card-header">
                        <h2 className="card-title">Bank Account</h2>
                        <CreditCard size={20} className="text-gray-400" />
                    </div>
                    <div className="card-body">
                        <div className="settings-form">
                            <div className="form-group">
                                <label>Account Number</label>
                                <input type="text" placeholder="Enter account number" />
                            </div>
                            <div className="form-group">
                                <label>Bank Name</label>
                                <input type="text" placeholder="Enter bank name" />
                            </div>
                            <button className="btn-primary">Save Bank Details</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorSettingsView;

