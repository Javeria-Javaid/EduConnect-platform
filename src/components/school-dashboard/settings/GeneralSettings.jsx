import React, { useState } from 'react';
import { Save, Upload, Camera } from 'lucide-react';
import './Settings.css';

const GeneralSettings = () => {
    const [formData, setFormData] = useState({
        schoolName: 'Springfield High School',
        address: '742 Evergreen Terrace, Springfield',
        contactEmail: 'admin@springfieldhigh.edu',
        contactPhone: '(555) 012-3456',
        academicYear: '2025-2026',
        onlineAdmissions: true,
        parentNotifications: true,
        teacherJobPostings: false
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
                <h2 className="settings-header-title">General Settings</h2>
                <p className="settings-header-subtitle">Manage your school's basic profile and global configurations.</p>
            </div>

            {/* School Profile Form */}
            <div className="settings-card">
                <h3 className="settings-card-title">School Profile</h3>

                <div style={{ display: 'flex', gap: '32px', marginBottom: '32px', flexWrap: 'wrap' }}>
                    {/* Logo Upload */}
                    <div style={{ flexShrink: 0 }}>
                        <label className="settings-form-label">School Logo</label>
                        <div className="settings-logo-upload">
                            <div className="settings-logo-content">
                                <Camera size={24} style={{ margin: '0 auto 8px' }} />
                                <span style={{ fontSize: '0.75rem' }}>Upload</span>
                            </div>
                            <input type="file" style={{ display: 'none' }} accept="image/*" />
                        </div>
                    </div>

                    {/* Fields */}
                    <div style={{ flex: 1, minWidth: '300px' }}>
                        <div className="settings-form-grid">
                            <div>
                                <label className="settings-form-label">School Name</label>
                                <input
                                    type="text"
                                    name="schoolName"
                                    value={formData.schoolName}
                                    onChange={handleChange}
                                    className="settings-input"
                                />
                            </div>
                            <div>
                                <label className="settings-form-label">Address</label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    rows={2}
                                    className="settings-textarea"
                                />
                            </div>
                            <div className="settings-form-grid-2">
                                <div>
                                    <label className="settings-form-label">Contact Email</label>
                                    <input
                                        type="email"
                                        name="contactEmail"
                                        value={formData.contactEmail}
                                        onChange={handleChange}
                                        className="settings-input"
                                    />
                                </div>
                                <div>
                                    <label className="settings-form-label">Contact Phone</label>
                                    <input
                                        type="text"
                                        name="contactPhone"
                                        value={formData.contactPhone}
                                        onChange={handleChange}
                                        className="settings-input"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="settings-form-label">Academic Year</label>
                                <select
                                    name="academicYear"
                                    value={formData.academicYear}
                                    onChange={handleChange}
                                    className="settings-select"
                                >
                                    <option>2024-2025</option>
                                    <option>2025-2026</option>
                                    <option>2026-2027</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feature Toggles */}
            <div className="settings-card">
                <h3 className="settings-card-title">Feature Configuration</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {[
                        { key: 'onlineAdmissions', label: 'Online Admissions', desc: 'Allow parents to submit admission forms online.' },
                        { key: 'parentNotifications', label: 'Parent Notifications', desc: 'Send automated alerts to parents via Email/SMS.' },
                        { key: 'teacherJobPostings', label: 'Teacher Job Postings', desc: 'Display career opportunities on the public site.' },
                    ].map((item) => (
                        <div key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #f1f5f9' }}>
                            <div>
                                <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1e293b', marginBottom: '4px' }}>{item.label}</p>
                                <p style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.desc}</p>
                            </div>
                            <label style={{ cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    name={item.key}
                                    checked={formData[item.key]}
                                    onChange={handleChange}
                                    style={{ display: 'none' }}
                                />
                                <div className={`settings-toggle ${formData[item.key] ? 'active' : ''}`}>
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
                    <button className="settings-btn settings-btn-secondary">
                        Cancel
                    </button>
                    <button className="settings-btn settings-btn-primary">
                        <Save size={18} />
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GeneralSettings;
