import React, { useState } from 'react';
import { Save, Database, Download, Calendar } from 'lucide-react';
import './Settings.css';

const BackupRestoreSettings = () => {
    const backupHistory = [
        { date: 'Nov 20, 2024', size: '450 MB', type: 'Auto' },
        { date: 'Nov 13, 2024', size: '448 MB', type: 'Auto' },
        { date: 'Nov 01, 2024', size: '445 MB', type: 'Manual' },
    ];

    return (
        <div className="settings-section">
            {/* Header */}
            <div className="settings-header-card">
                <h2 className="settings-header-title">Backup & Restore</h2>
                <p className="settings-header-subtitle">Manage system data backups and recovery points.</p>
            </div>

            {/* Create Backup */}
            <div className="settings-card">
                <h3 className="settings-card-title">Create Backup</h3>
                <p className="settings-card-subtitle">
                    Manually trigger a full system backup. This includes all student records, financial data, and configuration settings.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: '#f8fafc', borderRadius: '12px', marginBottom: '16px' }}>
                    <div>
                        <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1e293b' }}>Last Backup</p>
                        <p style={{ fontSize: '0.875rem', color: '#3b82f6', marginTop: '4px' }}>Today, 09:41 AM</p>
                    </div>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M11.6667 3.5L5.25 9.91667L2.33333 7" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
                <button className="settings-btn settings-btn-primary" style={{ width: '100%' }}>
                    <Database size={18} />
                    Backup Now
                </button>
            </div>

            {/* Restore Points */}
            <div className="settings-card">
                <h3 className="settings-card-title">Restore Points</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {backupHistory.map((backup, index) => (
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
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0' }}>
                                    <Database size={20} style={{ color: '#3b82f6' }} />
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1e293b' }}>{backup.date}</p>
                                    <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                                        {backup.size} • {backup.type}
                                    </p>
                                </div>
                            </div>
                            <button
                                style={{
                                    padding: '8px 12px',
                                    background: 'white',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    fontSize: '0.75rem',
                                    fontWeight: '600',
                                    color: '#475569'
                                }}
                            >
                                <Download size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BackupRestoreSettings;
