import React, { useState } from 'react';
import { Save, CreditCard, DollarSign, Calendar } from 'lucide-react';
import './Settings.css';

const PaymentBillingSettings = () => {
    const [formData, setFormData] = useState({
        currency: 'USD',
        paymentMethod: 'stripe',
        billingCycle: 'monthly',
        autoRenewal: true
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
                <h2 className="settings-header-title">Payment & Billing</h2>
                <p className="settings-header-subtitle">Manage payment methods and billing preferences.</p>
            </div>

            {/* Payment Configuration */}
            <div className="settings-card">
                <h3 className="settings-card-title">Payment Configuration</h3>
                <div className="settings-form-grid">
                    <div>
                        <label className="settings-form-label">Currency</label>
                        <select
                            name="currency"
                            value={formData.currency}
                            onChange={handleChange}
                            className="settings-select"
                        >
                            <option value="USD">USD - US Dollar</option>
                            <option value="EUR">EUR - Euro</option>
                            <option value="GBP">GBP - British Pound</option>
                            <option value="INR">INR - Indian Rupee</option>
                        </select>
                    </div>
                    <div>
                        <label className="settings-form-label">Payment Gateway</label>
                        <select
                            name="paymentMethod"
                            value={formData.paymentMethod}
                            onChange={handleChange}
                            className="settings-select"
                        >
                            <option value="stripe">Stripe</option>
                            <option value="paypal">PayPal</option>
                            <option value="razorpay">Razorpay</option>
                        </select>
                    </div>
                    <div>
                        <label className="settings-form-label">Billing Cycle</label>
                        <select
                            name="billingCycle"
                            value={formData.billingCycle}
                            onChange={handleChange}
                            className="settings-select"
                        >
                            <option value="monthly">Monthly</option>
                            <option value="quarterly">Quarterly</option>
                            <option value="annually">Annually</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Billing Options */}
            <div className="settings-card">
                <h3 className="settings-card-title">Billing Options</h3>
                <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1e293b' }}>Auto-Renewal</p>
                        <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Automatically renew subscription at the end of billing cycle</p>
                    </div>
                    <label style={{ cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            name="autoRenewal"
                            checked={formData.autoRenewal}
                            onChange={handleChange}
                            style={{ display: 'none' }}
                        />
                        <div className={`settings-toggle ${formData.autoRenewal ? 'active' : ''}`}>
                            <div className="settings-toggle-slider"></div>
                        </div>
                    </label>
                </div>
            </div>

            {/* Current Plan */}
            <div className="settings-card">
                <h3 className="settings-card-title">Current Plan</h3>
                <div style={{ padding: '20px', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', borderRadius: '12px', color: 'white' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <div>
                            <p style={{ fontSize: '0.75rem', opacity: 0.9 }}>Current Plan</p>
                            <p style={{ fontSize: '1.5rem', fontWeight: '800', marginTop: '4px' }}>Professional</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: '2rem', fontWeight: '900' }}>$99</p>
                            <p style={{ fontSize: '0.75rem', opacity: 0.9 }}>per month</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', opacity: 0.9 }}>
                        <Calendar size={14} />
                        <span>Next billing date: Dec 20, 2024</span>
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
        </div >
    );
};

export default PaymentBillingSettings;
