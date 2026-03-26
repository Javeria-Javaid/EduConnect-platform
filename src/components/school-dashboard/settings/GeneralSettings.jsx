import React, { useState, useEffect } from 'react';
import { Save, Camera } from 'lucide-react';
import { toast } from 'sonner';
import './Settings.css';

const GeneralSettings = () => {
    const [formData, setFormData] = useState({
        schoolName: '',
        address: '',
        contactEmail: '',
        contactPhone: '',
        website: '',
        academicYear: '2025-2026',
        admissionOpen: true,
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchSchoolProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const user = await res.json();
                    if (user.school) {
                        const schoolRes = await fetch(`${import.meta.env.VITE_API_URL}/api/schools/${user.school._id || user.school}`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        if (schoolRes.ok) {
                            const school = await schoolRes.json();
                            setFormData({
                                schoolName: school.name || '',
                                address: school.address || '',
                                contactEmail: school.contactEmail || '',
                                contactPhone: school.contactPhone || '',
                                website: school.website || '',
                                academicYear: '2025-2026',
                                admissionOpen: school.admissionOpen ?? true,
                            });
                        }
                    }
                }
            } catch {
                toast.error('Failed to load school profile');
            } finally {
                setLoading(false);
            }
        };
        fetchSchoolProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            const meRes = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const user = await meRes.json();
            const schoolId = user.school?._id || user.school;
            if (!schoolId) { toast.error('No school assigned'); return; }
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/schools/${schoolId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    name: formData.schoolName,
                    address: formData.address,
                    contactEmail: formData.contactEmail,
                    contactPhone: formData.contactPhone,
                    website: formData.website,
                    admissionOpen: formData.admissionOpen,
                }),
            });
            if (res.ok) toast.success('School profile saved!');
            else { const err = await res.json(); toast.error(err.message || 'Save failed'); }
        } catch { toast.error('Network error saving settings'); }
        finally { setSaving(false); }
    };

    if (loading) return <div style={{ padding: '40px', color: '#64748b' }}>Loading school profile...</div>;

    return (
        <div className="settings-section">
            <div className="settings-header-card">
                <h2 className="settings-header-title">General Settings</h2>
                <p className="settings-header-subtitle">Manage your school's basic profile and global configurations.</p>
            </div>

            <div className="settings-card">
                <h3 className="settings-card-title">School Profile</h3>
                <div style={{ display: 'flex', gap: '32px', marginBottom: '32px', flexWrap: 'wrap' }}>
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

                    <div style={{ flex: 1, minWidth: '300px' }}>
                        <div className="settings-form-grid">
                            <div>
                                <label className="settings-form-label">School Name</label>
                                <input type="text" name="schoolName" value={formData.schoolName} onChange={handleChange} className="settings-input" />
                            </div>
                            <div>
                                <label className="settings-form-label">Address</label>
                                <textarea name="address" value={formData.address} onChange={handleChange} rows={2} className="settings-textarea" />
                            </div>
                            <div className="settings-form-grid-2">
                                <div>
                                    <label className="settings-form-label">Contact Email</label>
                                    <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} className="settings-input" />
                                </div>
                                <div>
                                    <label className="settings-form-label">Contact Phone</label>
                                    <input type="text" name="contactPhone" value={formData.contactPhone} onChange={handleChange} className="settings-input" />
                                </div>
                            </div>
                            <div>
                                <label className="settings-form-label">Website</label>
                                <input type="url" name="website" value={formData.website} onChange={handleChange} className="settings-input" placeholder="https://yourschool.edu" />
                            </div>
                            <div>
                                <label className="settings-form-label">Academic Year</label>
                                <select name="academicYear" value={formData.academicYear} onChange={handleChange} className="settings-select">
                                    <option>2024-2025</option>
                                    <option>2025-2026</option>
                                    <option>2026-2027</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="settings-card">
                <h3 className="settings-card-title">Feature Configuration</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {[
                        { key: 'admissionOpen', label: 'Online Admissions', desc: 'Allow parents to submit admission forms online.' },
                    ].map((item) => (
                        <div key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #f1f5f9' }}>
                            <div>
                                <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1e293b', marginBottom: '4px' }}>{item.label}</p>
                                <p style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.desc}</p>
                            </div>
                            <label style={{ cursor: 'pointer' }}>
                                <input type="checkbox" name={item.key} checked={formData[item.key]} onChange={handleChange} style={{ display: 'none' }} />
                                <div className={`settings-toggle ${formData[item.key] ? 'active' : ''}`}>
                                    <div className="settings-toggle-slider"></div>
                                </div>
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="settings-footer">
                <div className="settings-footer-content">
                    <button className="settings-btn settings-btn-secondary" onClick={() => window.location.reload()}>Cancel</button>
                    <button className="settings-btn settings-btn-primary" onClick={handleSave} disabled={saving}>
                        <Save size={18} />{saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GeneralSettings;
