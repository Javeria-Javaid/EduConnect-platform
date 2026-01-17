import React, { useState } from 'react';
import { Save, Shield, Lock, Key, Eye, EyeOff } from 'lucide-react';
import './Settings.css';

const SecuritySettings = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        twoFactorAuth: false,
        sessionTimeout: '30',
        passwordExpiry: '90'
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    return (
        <div className="settings-section">
            {/* Header */}
            <div className="settings-header-card">
                <h2 className="settings-header-title">Security Settings</h2>
                <p className="settings-header-subtitle">Manage passwords, authentication, and security policies.</p>
            </div>

            {/* Change Password */}
            <div className="settings-card">
                <h3 className="settings-card-title">Change Password</h3>
                <div className="settings-form-grid">
                    <div>
                        <label className="settings-form-label">Current Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="currentPassword"
                                value={formData.currentPassword}
                                onChange={handleChange}
                                className="settings-input"
                                style={{ paddingRight: '40px' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#64748b'
                                }}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    <div className="settings-form-grid-2">
                        <div>
                            <label className="settings-form-label">New Password</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                className="settings-input"
                            />
                        </div>
                        <div>
                            <label className="settings-form-label">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="settings-input"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Security Options */}
            <div className="settings-card">
                <h3 className="settings-card-title">Security Options</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: '#f8fafc', borderRadius: '12px' }}>
                        <div>
                            <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1e293b' }}>Two-Factor Authentication</p>
                            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Add an extra layer of security to your account</p>
                        </div>
                        <label style={{ cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                name="twoFactorAuth"
                                checked={formData.twoFactorAuth}
                                onChange={handleChange}
                                style={{ display: 'none' }}
                            />
                            <div className={`settings-toggle ${formData.twoFactorAuth ? 'active' : ''}`}>
                                <div className="settings-toggle-slider"></div>
                            </div>
                        </label>
                    </div>

                    <div className="settings-form-grid-2">
                        <div>
                            <label className="settings-form-label">Session Timeout (minutes)</label>
                            <select
                                name="sessionTimeout"
                                value={formData.sessionTimeout}
                                onChange={handleChange}
                                className="settings-select"
                            >
                                <option value="15">15 minutes</option>
                                <option value="30">30 minutes</option>
                                <option value="60">1 hour</option>
                                <option value="120">2 hours</option>
                            </select>
                        </div>
                        <div>
                            <label className="settings-form-label">Password Expiry (days)</label>
                            <select
                                name="passwordExpiry"
                                value={formData.passwordExpiry}
                                onChange={handleChange}
                                className="settings-select"
                            >
                                <option value="30">30 days</option>
                                <option value="60">60 days</option>
                                <option value="90">90 days</option>
                                <option value="never">Never</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Save Button Footer */}
            <div className="settings-footer">
                <div className="settings-footer-content">
                    <button className="settings-btn settings-btn-secondary">Cancel</button>
                    <button className="settings-btn settings-btn-primary">
                        <Save size={18} />
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SecuritySettings;
