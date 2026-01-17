import React from 'react';
import { Settings, User, Bell, Lock, Users } from 'lucide-react';
import './ParentViews.css';

const ParentSettingsView = () => {
    return (
        <div className="parent-view-container">
            <div className="view-header">
                <h1 className="view-title">Settings</h1>
                <p className="view-subtitle">Manage your account settings and preferences</p>
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
                                <label>Full Name</label>
                                <input type="text" defaultValue="John Doe" />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" defaultValue="parent@educonnect.com" />
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
                            <div className="form-group">
                                <label>Confirm New Password</label>
                                <input type="password" />
                            </div>
                            <button className="btn-primary">Update Password</button>
                        </div>
                    </div>
                </div>

                <div className="content-card">
                    <div className="card-header">
                        <h2 className="card-title">Notifications</h2>
                        <Bell size={20} className="text-gray-400" />
                    </div>
                    <div className="card-body">
                        <div className="notification-settings">
                            <div className="notification-item">
                                <div>
                                    <h4>Email Notifications</h4>
                                    <p>Receive email updates about your child's progress</p>
                                </div>
                                <input type="checkbox" defaultChecked />
                            </div>
                            <div className="notification-item">
                                <div>
                                    <h4>SMS Notifications</h4>
                                    <p>Receive SMS alerts for important updates</p>
                                </div>
                                <input type="checkbox" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParentSettingsView;

