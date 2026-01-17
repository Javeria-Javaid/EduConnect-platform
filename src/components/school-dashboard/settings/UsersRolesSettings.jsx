import React, { useState } from 'react';
import { Save, Users, Shield, Plus, Trash2, Edit } from 'lucide-react';
import './Settings.css';

const UsersRolesSettings = () => {
    const [users] = useState([
        { name: 'John Smith', email: 'john@school.edu', role: 'Admin', status: 'Active' },
        { name: 'Sarah Johnson', email: 'sarah@school.edu', role: 'Teacher', status: 'Active' },
        { name: 'Mike Brown', email: 'mike@school.edu', role: 'Staff', status: 'Inactive' },
    ]);

    return (
        <div className="settings-section">
            {/* Header */}
            <div className="settings-header-card">
                <h2 className="settings-header-title">Users & Roles</h2>
                <p className="settings-header-subtitle">Manage user accounts and permissions.</p>
            </div>

            {/* Users List */}
            <div className="settings-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <h3 className="settings-card-title" style={{ margin: 0 }}>User Accounts</h3>
                    <button className="settings-btn settings-btn-primary">
                        <Plus size={16} />
                        Add User
                    </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {users.map((user, index) => (
                        <div
                            key={index}
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
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: '700',
                                    fontSize: '0.875rem'
                                }}>
                                    {user.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1e293b' }}>{user.name}</p>
                                    <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>{user.email}</p>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div>
                                        <span style={{
                                            padding: '4px 10px',
                                            borderRadius: '12px',
                                            fontSize: '0.75rem',
                                            fontWeight: '600',
                                            background: '#dbeafe',
                                            color: '#2563eb'
                                        }}>
                                            {user.role}
                                        </span>
                                    </div>
                                    <div>
                                        <span style={{
                                            padding: '4px 10px',
                                            borderRadius: '12px',
                                            fontSize: '0.75rem',
                                            fontWeight: '600',
                                            background: user.status === 'Active' ? '#dcfce7' : '#fee2e2',
                                            color: user.status === 'Active' ? '#16a34a' : '#dc2626'
                                        }}>
                                            {user.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
                                <button
                                    style={{
                                        padding: '8px',
                                        background: 'white',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        color: '#475569'
                                    }}
                                >
                                    <Edit size={16} />
                                </button>
                                <button
                                    style={{
                                        padding: '8px',
                                        background: '#fee2e2',
                                        border: '1px solid #fecaca',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        color: '#dc2626'
                                    }}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Roles & Permissions */}
            <div className="settings-card">
                <h3 className="settings-card-title">Roles & Permissions</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                    {[
                        { role: 'Admin', permissions: 'Full access to all features', color: '#3b82f6' },
                        { role: 'Teacher', permissions: 'Manage classes and students', color: '#10b981' },
                        { role: 'Staff', permissions: 'Limited administrative access', color: '#f59e0b' },
                    ].map((item, index) => (
                        <div
                            key={index}
                            style={{
                                padding: '20px',
                                background: '#f8fafc',
                                borderRadius: '12px',
                                border: '1px solid #e2e8f0'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                                <Shield size={20} style={{ color: item.color }} />
                                <p style={{ fontSize: '0.95rem', fontWeight: '700', color: '#1e293b' }}>{item.role}</p>
                            </div>
                            <p style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.permissions}</p>
                            <button
                                className="settings-btn settings-btn-secondary"
                                style={{ width: '100%', marginTop: '12px', fontSize: '0.75rem', padding: '8px 12px' }}
                            >
                                Edit Permissions
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UsersRolesSettings;
