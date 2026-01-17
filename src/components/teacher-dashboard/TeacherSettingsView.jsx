import React, { useState } from 'react';
import { User, Lock, Bell, Palette, Globe, Shield } from 'lucide-react';
import { teacherInfo } from './mockData';
import './TeacherDashboardOverview.css';

const TeacherSettingsView = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [theme, setTheme] = useState('light');

    return (
        <div className="teacher-dashboard-overview">
            <div className="overview-header">
                <div>
                    <h1 className="page-title">Settings</h1>
                    <p className="page-subtitle">Manage your account and preferences</p>
                </div>
            </div>

            <div className="dashboard-grid">
                {/* Settings Menu */}
                <div className="dashboard-card">
                    <div className="card-body" style={{ padding: 0 }}>
                        {[
                            { id: 'profile', label: 'Profile', icon: User },
                            { id: 'password', label: 'Password & Security', icon: Lock },
                            { id: 'notifications', label: 'Notifications', icon: Bell },
                            { id: 'appearance', label: 'Appearance', icon: Palette },
                            { id: 'language', label: 'Language & Region', icon: Globe },
                            { id: 'privacy', label: 'Privacy', icon: Shield }
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    border: 'none',
                                    borderBottom: '1px solid #f3f4f6',
                                    backgroundColor: activeTab === item.id ? '#eff6ff' : 'white',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <item.icon size={18} color={activeTab === item.id ? '#3b82f6' : '#6b7280'} />
                                <span style={{
                                    fontWeight: activeTab === item.id ? '600' : '400',
                                    color: activeTab === item.id ? '#3b82f6' : '#1f2937'
                                }}>
                                    {item.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Settings Content */}
                <div className="dashboard-card" style={{ gridColumn: 'span 2' }}>
                    <div className="card-body">
                        {activeTab === 'profile' && (
                            <div>
                                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px' }}>Profile Information</h3>
                                <form style={{ display: 'grid', gap: '20px' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>Full Name</label>
                                            <input
                                                type="text"
                                                defaultValue={teacherInfo.name}
                                                style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '6px' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>Employee ID</label>
                                            <input
                                                type="text"
                                                defaultValue={teacherInfo.employeeId}
                                                disabled
                                                style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '6px', backgroundColor: '#f9fafb' }}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>Email Address</label>
                                        <input
                                            type="email"
                                            defaultValue={teacherInfo.email}
                                            style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '6px' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>Phone Number</label>
                                        <input
                                            type="tel"
                                            defaultValue={teacherInfo.phone}
                                            style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '6px' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>Qualification</label>
                                        <input
                                            type="text"
                                            defaultValue={teacherInfo.qualification}
                                            style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '6px' }}
                                        />
                                    </div>
                                    <button type="button" className="btn-primary" style={{ width: 'fit-content' }}>
                                        Save Changes
                                    </button>
                                </form>
                            </div>
                        )}

                        {activeTab === 'password' && (
                            <div>
                                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px' }}>Change Password</h3>
                                <form style={{ display: 'grid', gap: '20px', maxWidth: '500px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>Current Password</label>
                                        <input
                                            type="password"
                                            placeholder="Enter current password"
                                            style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '6px' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>New Password</label>
                                        <input
                                            type="password"
                                            placeholder="Enter new password"
                                            style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '6px' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>Confirm New Password</label>
                                        <input
                                            type="password"
                                            placeholder="Confirm new password"
                                            style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '6px' }}
                                        />
                                    </div>
                                    <button type="button" className="btn-primary" style={{ width: 'fit-content' }}>
                                        Update Password
                                    </button>
                                </form>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div>
                                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px' }}>Notification Preferences</h3>
                                <div style={{ display: 'grid', gap: '16px' }}>
                                    {[
                                        { label: 'Email notifications for new messages', desc: 'Receive emails when parents send you messages' },
                                        { label: 'Homework submission reminders', desc: 'Get notified when homework deadlines approach' },
                                        { label: 'Attendance marking alerts', desc: 'Daily reminders to mark attendance' },
                                        { label: 'School announcements', desc: 'Receive all official school announcements' },
                                        { label: 'Parent-teacher meeting reminders', desc: 'Get reminded about upcoming meetings' }
                                    ].map((item, idx) => (
                                        <div key={idx} style={{
                                            padding: '16px',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}>
                                            <div>
                                                <h4 style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>{item.label}</h4>
                                                <p style={{ fontSize: '12px', color: '#6b7280' }}>{item.desc}</p>
                                            </div>
                                            <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '24px' }}>
                                                <input type="checkbox" defaultChecked style={{ opacity: 0, width: 0, height: 0 }} />
                                                <span style={{
                                                    position: 'absolute',
                                                    cursor: 'pointer',
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    bottom: 0,
                                                    backgroundColor: '#3b82f6',
                                                    borderRadius: '24px',
                                                    transition: '0.4s'
                                                }}></span>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'appearance' && (
                            <div>
                                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px' }}>Appearance Settings</h3>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '12px', fontWeight: '500', fontSize: '14px' }}>Theme</label>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', maxWidth: '600px' }}>
                                        {['light', 'dark', 'auto'].map((themeOption) => (
                                            <div
                                                key={themeOption}
                                                onClick={() => setTheme(themeOption)}
                                                style={{
                                                    padding: '20px',
                                                    border: theme === themeOption ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                                                    borderRadius: '8px',
                                                    textAlign: 'center',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                    backgroundColor: theme === themeOption ? '#eff6ff' : 'white'
                                                }}
                                            >
                                                <Palette size={24} color={theme === themeOption ? '#3b82f6' : '#6b7280'} style={{ margin: '0 auto 8px' }} />
                                                <p style={{ fontWeight: '500', textTransform: 'capitalize', color: theme === themeOption ? '#3b82f6' : '#1f2937' }}>
                                                    {themeOption}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'language' && (
                            <div>
                                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px' }}>Language & Region</h3>
                                <div style={{ maxWidth: '400px' }}>
                                    <div style={{ marginBottom: '24px' }}>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>Language</label>
                                        <select style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
                                            <option>English</option>
                                            <option>Urdu</option>
                                            <option>Arabic</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>Time Zone</label>
                                        <select style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
                                            <option>PKT (UTC+5)</option>
                                            <option>GMT (UTC+0)</option>
                                            <option>EST (UTC-5)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'privacy' && (
                            <div>
                                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px' }}>Privacy Settings</h3>
                                <div style={{ display: 'grid', gap: '16px' }}>
                                    {[
                                        { label: 'Show my profile to other teachers', value: true },
                                        { label: 'Allow parents to message me directly', value: true },
                                        { label: 'Share my teaching resources publicly', value: false },
                                        { label: 'Display my email in school directory', value: true }
                                    ].map((item, idx) => (
                                        <div key={idx} style={{
                                            padding: '16px',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}>
                                            <span style={{ fontWeight: '500' }}>{item.label}</span>
                                            <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '24px' }}>
                                                <input type="checkbox" defaultChecked={item.value} style={{ opacity: 0, width: 0, height: 0 }} />
                                                <span style={{
                                                    position: 'absolute',
                                                    cursor: 'pointer',
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    bottom: 0,
                                                    backgroundColor: item.value ? '#3b82f6' : '#9ca3af',
                                                    borderRadius: '24px',
                                                    transition: '0.4s'
                                                }}>
                                                </span>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherSettingsView;
