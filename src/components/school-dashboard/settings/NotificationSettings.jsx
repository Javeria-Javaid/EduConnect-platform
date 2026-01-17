import React, { useState } from 'react';
import { Save, Bell, Mail, MessageSquare, Phone } from 'lucide-react';
import './Settings.css';

const NotificationSettings = () => {
    const [settings, setSettings] = useState({
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        weeklyReports: true,
        attendanceAlerts: true,
        feeReminders: true,
        examResults: true,
        eventUpdates: false
    });

    const handleToggle = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const notificationTypes = [
        { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email', icon: Mail },
        { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Receive notifications via SMS', icon: MessageSquare },
        { key: 'pushNotifications', label: 'Push Notifications', desc: 'Receive push notifications in browser', icon: Bell },
    ];

    const alertTypes = [
        { key: 'weeklyReports', label: 'Weekly Reports', desc: 'Summary of school activities every week' },
        { key: 'attendanceAlerts', label: 'Attendance Alerts', desc: 'Notify when student attendance is low' },
        { key: 'feeReminders', label: 'Fee Reminders', desc: 'Remind parents about pending fees' },
        { key: 'examResults', label: 'Exam Results', desc: 'Notify when exam results are published' },
        { key: 'eventUpdates', label: 'Event Updates', desc: 'Updates about upcoming school events' },
    ];

    return (
        <div className="settings-section">
            {/* Header */}
            <div className="settings-header-card">
                <h2 className="settings-header-title">Notification Settings</h2>
                <p className="settings-header-subtitle">Configure how you receive alerts and updates.</p>
            </div>

            {/* Notification Channels */}
            <div className="settings-card">
                <h3 className="settings-card-title">Notification Channels</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {notificationTypes.map((item) => {
                        const Icon = item.icon;
                        return (
                            <div
                                key={item.key}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '16px',
                                    background: '#f8fafc',
                                    borderRadius: '12px',
                                    border: '1px solid #e2e8f0'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0' }}>
                                        <Icon size={20} style={{ color: '#3b82f6' }} />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1e293b' }}>{item.label}</p>
                                        <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>{item.desc}</p>
                                    </div>
                                </div>
                                <label style={{ cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={settings[item.key]}
                                        onChange={() => handleToggle(item.key)}
                                        style={{ display: 'none' }}
                                    />
                                    <div className={`settings-toggle ${settings[item.key] ? 'active' : ''}`}>
                                        <div className="settings-toggle-slider"></div>
                                    </div>
                                </label>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Alert Types */}
            <div className="settings-card">
                <h3 className="settings-card-title">Alert Types</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {alertTypes.map((item) => (
                        <div
                            key={item.key}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '12px 0',
                                borderBottom: '1px solid #f1f5f9'
                            }}
                        >
                            <div>
                                <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1e293b' }}>{item.label}</p>
                                <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>{item.desc}</p>
                            </div>
                            <label style={{ cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={settings[item.key]}
                                    onChange={() => handleToggle(item.key)}
                                    style={{ display: 'none' }}
                                />
                                <div className={`settings-toggle ${settings[item.key] ? 'active' : ''}`}>
                                    <div className="settings-toggle-slider"></div>
                                </div>
                            </label>
                        </div>
                    ))}
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

export default NotificationSettings;
