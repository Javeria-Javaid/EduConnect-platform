import React, { useState, useEffect } from 'react';
import PageHeader from '../ui/PageHeader';
import { Save, Shield, Globe, Mail, Loader2, Info, Phone, Server } from 'lucide-react';
import { toast } from 'sonner';
import './Settings.css';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/settings`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (res.ok) {
        setSettings(data);
      } else {
        toast.error('Failed to load system settings');
      }
    } catch (error) {
      toast.error('Network error loading settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateSettingAPI = async (updatedData) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/settings`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedData)
      });
      
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.target);
    const updatedSettings = {};
    
    formData.forEach((value, key) => {
        updatedSettings[key] = value;
    });

    const success = await updateSettingAPI(updatedSettings);
    if (success) {
        toast.success('System settings updated successfully!');
    } else {
        toast.error('Failed to save changes');
    }
    setSaving(false);
  };

  const handleToggle = async (key, value) => {
      const success = await updateSettingAPI({ [key]: value });
      if (success) {
          toast.success(`${key.replace(/([A-Z])/g, ' $1')} updated`);
      } else {
          toast.error('Failed to update status');
      }
  };

  if (loading) {
      return (
          <div className="settings-loading">
              <Loader2 className="animate-spin" size={32} />
              <p>Fetching platform configuration...</p>
          </div>
      );
  }

  return (
    <div className="settings-page">
      <PageHeader
        title="System Settings"
        subtitle="Configure platform preferences, security, and SMTP."
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
            <Shield size={18} /> Security
          </button>
          <button
            className={`settings-nav-item ${activeTab === 'smtp' ? 'active' : ''}`}
            onClick={() => setActiveTab('smtp')}
          >
            <Server size={18} /> SMTP Config
          </button>
        </div>

        <div className="settings-content">
          {activeTab === 'general' && (
            <form onSubmit={handleSave} className="settings-form" key="general-form">
              <h3>General Settings</h3>
              <div className="form-group">
                <label>Site Name</label>
                <input name="siteName" type="text" defaultValue={settings?.siteName} required />
              </div>
              <div className="form-group">
                <label>Support Email</label>
                <input name="supportEmail" type="email" defaultValue={settings?.supportEmail} required />
              </div>
              <div className="form-group">
                <label>Contact Phone</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Phone size={16} />
                    <input name="contactPhone" type="text" defaultValue={settings?.contactPhone} />
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="save-btn" disabled={saving}>
                    {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} 
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'security' && (
            <div className="settings-form">
              <h3>Security & Maintenance</h3>
              <div className="form-group">
                <label>Registration Status</label>
                <div className="toggle-switch">
                  <input 
                    type="checkbox" 
                    id="reg-toggle" 
                    checked={settings?.allowRegistration} 
                    onChange={(e) => handleToggle('allowRegistration', e.target.checked)}
                  />
                  <label htmlFor="reg-toggle">Allow New Student/Parent Signups</label>
                </div>
              </div>
              <div className="form-group">
                <label>Maintenance Mode</label>
                <div className="toggle-switch red">
                  <input 
                    type="checkbox" 
                    id="maint-toggle" 
                    checked={settings?.maintenanceMode} 
                    onChange={(e) => handleToggle('maintenanceMode', e.target.checked)}
                  />
                  <label htmlFor="maint-toggle">Take Platform Offline (Staff only)</label>
                </div>
                <div className="info-alert">
                    <Info size={14} />
                    <p>Enabling this will prevent students and parents from accessing the dashboard.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'smtp' && (
            <form onSubmit={handleSave} className="settings-form" key="smtp-form">
              <h3>SMTP Configuration</h3>
              <div className="form-row">
                  <div className="form-group">
                    <label>SMTP Host</label>
                    <input name="smtpHost" type="text" defaultValue={settings?.smtpHost} placeholder="smtp.gmail.com" />
                  </div>
                  <div className="form-group">
                    <label>SMTP Port</label>
                    <input name="smtpPort" type="number" defaultValue={settings?.smtpPort} placeholder="587" />
                  </div>
              </div>
              <div className="form-group">
                <label>SMTP User</label>
                <input name="smtpUser" type="text" defaultValue={settings?.smtpUser} />
              </div>
              <div className="form-group">
                <label>SMTP Password</label>
                <input name="smtpPass" type="password" placeholder="••••••••" />
                <p className="field-hint">Leave blank to keep existing password</p>
              </div>

              <div className="form-actions">
                <button type="submit" className="save-btn" disabled={saving}>
                    {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} 
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
