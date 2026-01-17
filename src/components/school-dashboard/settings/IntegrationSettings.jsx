import React, { useState } from 'react';
import { Save, Link2, CheckCircle, XCircle } from 'lucide-react';
import './Settings.css';

const IntegrationSettings = () => {
    const [integrations] = useState([
        { name: 'Google Classroom', status: 'connected', icon: '🎓' },
        { name: 'Zoom', status: 'connected', icon: '📹' },
        { name: 'Microsoft Teams', status: 'disconnected', icon: '💬' },
        { name: 'Stripe Payment', status: 'connected', icon: '💳' },
        { name: 'SendGrid Email', status: 'disconnected', icon: '📧' },
        { name: 'Twilio SMS', status: 'disconnected', icon: '📱' },
    ]);

    return (
        <div className="settings-section">
            {/* Header */}
            <div className="settings-header-card">
                <h2 className="settings-header-title">Integrations</h2>
                <p className="settings-header-subtitle">Connect third-party services to enhance functionality.</p>
            </div>

            {/* Integrations Grid */}
            <div className="settings-card">
                <h3 className="settings-card-title">Available Integrations</h3>
                <div className="settings-integration-grid">
                    {integrations.map((integration, index) => (
                        <div key={index} className="settings-integration-card">
                            <div className="settings-integration-header">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{ fontSize: '1.5rem' }}>{integration.icon}</span>
                                    <span className="settings-integration-name">{integration.name}</span>
                                </div>
                                <span className={`settings-integration-status ${integration.status}`}>
                                    {integration.status === 'connected' ? 'Connected' : 'Disconnected'}
                                </span>
                            </div>
                            <button
                                className={integration.status === 'connected' ? 'settings-btn settings-btn-danger' : 'settings-btn settings-btn-primary'}
                                style={{ width: '100%', marginTop: '12px' }}
                            >
                                {integration.status === 'connected' ? (
                                    <>
                                        <XCircle size={16} />
                                        Disconnect
                                    </>
                                ) : (
                                    <>
                                        <Link2 size={16} />
                                        Connect
                                    </>
                                )}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default IntegrationSettings;
