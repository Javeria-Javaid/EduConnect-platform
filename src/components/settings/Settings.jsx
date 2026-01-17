import React, { useState } from 'react';
import PageHeader from '../ui/PageHeader';
import { Save, Shield, Bell, Globe, Lock, Mail } from 'lucide-react';
import './Settings.css';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');

  const handleSave = (e) => {
    e.preventDefault();
    alert('Settings saved successfully!');
  };

  return (
    <div className="settings-page">
      <PageHeader
        title="System Settings"
        subtitle="Configure platform preferences, security, and notifications."
      />

      <div className="settings-container">
        <div className="settings-sidebar">
          <button
            className={`settings-nav-item ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => setActiveTab('general')}
          >
            <Globe size={18} /> General
          </button>
          <button
            className={`settings-nav-item ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <Shield size={18} /> Security & Roles
          </button>
          <button
            className={`settings-nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell size={18} /> Notifications
          </button>
        </div>

        <div className="settings-content">
          {activeTab === 'general' && (
            <form onSubmit={handleSave} className="settings-form">
              <h3>General Settings</h3>
              <div className="form-group">
                <label>Platform Name</label>
                <input type="text" defaultValue="EduConnect" />
              </div>
              <div className="form-group">
                <label>Support Email</label>
                <input type="email" defaultValue="support@educonnect.com" />
              </div>
              <div className="form-group">
                <label>Timezone</label>
                <select defaultValue="UTC-5">
                  <option value="UTC">UTC</option>
                  <option value="UTC-5">Eastern Time (US & Canada)</option>
                  <option value="UTC+1">Central European Time</option>
                </select>
              </div>
              <div className="form-group">
                <label>Language</label>
                <select defaultValue="en">
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="submit" className="save-btn"><Save size={16} /> Save Changes</button>
              </div>
            </form>
          )}

          {activeTab === 'security' && (
            <form onSubmit={handleSave} className="settings-form">
              <h3>Security & Roles</h3>
              <div className="form-group">
                <label>Password Policy</label>
                <select defaultValue="strong">
                  <option value="medium">Medium (Min 8 chars)</option>
                  <option value="strong">Strong (Min 12 chars, special char)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Two-Factor Authentication (2FA)</label>
                <div className="toggle-switch">
                  <input type="checkbox" id="2fa" defaultChecked />
                  <label>Enable 2FA for Admin Accounts</label>
                </div>
              </div>
              <div className="form-group">
                <label>Session Timeout (Minutes)</label>
                <input type="number" defaultValue="30" />
              </div>
              <div className="form-actions">
                <button type="submit" className="save-btn"><Save size={16} /> Save Changes</button>
              </div>
            </form>
          )}

          {activeTab === 'notifications' && (
            <form onSubmit={handleSave} className="settings-form">
              <h3>Notification Preferences</h3>
              <div className="notification-group">
                <h4>Email Notifications</h4>
                <div className="toggle-item">
                  <input type="checkbox" id="email-new-user" defaultChecked />
                  <label htmlFor="email-new-user">New User Registration</label>
                </div>
                <div className="toggle-item">
                  <input type="checkbox" id="email-ticket" defaultChecked />
                  <label htmlFor="email-ticket">New Support Ticket</label>
                </div>
                <div className="toggle-item">
                  <input type="checkbox" id="email-report" />
                  <label htmlFor="email-report">Weekly Report Summary</label>
                </div>
              </div>

              <div className="notification-group">
                <h4>System Alerts</h4>
                <div className="toggle-item">
                  <input type="checkbox" id="alert-maintenance" defaultChecked />
                  <label htmlFor="alert-maintenance">System Maintenance</label>
                </div>
                <div className="toggle-item">
                  <input type="checkbox" id="alert-security" defaultChecked />
                  <label htmlFor="alert-security">Security Alerts</label>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="save-btn"><Save size={16} /> Save Changes</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
