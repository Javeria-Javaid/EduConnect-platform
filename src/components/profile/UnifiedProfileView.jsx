import React, { useState, useEffect, useCallback } from 'react';
import { 
  User, 
  Lock, 
  Bell, 
  Settings as SettingsIcon, 
  Shield, 
  Camera, 
  Loader2, 
  Save, 
  Trash2,
  Globe,
  Briefcase,
  Users as UsersIcon,
  ShoppingBag
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';
import './UnifiedProfile.css';

const UnifiedProfileView = () => {
  const { updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  // ... rest of the component ...
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState(null);
  const [extendedProfile, setExtendedProfile] = useState(null);
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/me`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (res.ok) {
        setUserData(data.user);
        setExtendedProfile(data.extendedProfile || {});
      } else {
        toast.error('Failed to load profile data');
      }
    } catch (error) {
      toast.error('Network error loading profile');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUserUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(userData)
      });
      if (res.ok) {
        updateUser(userData);
        toast.success('Profile updated successfully');
      } else {
        const error = await res.json();
        toast.error(error.message || 'Update failed');
      }
    } catch (error) {
      toast.error('Network error during update');
    } finally {
      setSaving(false);
    }
  };

  const handleExtendedUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/me/extended`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(extendedProfile)
      });
      if (res.ok) {
        toast.success('Role-specific details updated');
      } else {
        toast.error('Failed to update details');
      }
    } catch (error) {
      toast.error('Network error during update');
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('photo', file);

    setSaving(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/me/photo`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        setUserData({ ...userData, profilePhoto: data.profilePhoto });
        updateUser({ profilePhoto: data.profilePhoto });
        toast.success('Photo uploaded successfully');
      } else {
        toast.error(data.message || 'Photo upload failed');
      }
    } catch (error) {
      toast.error('Network error during upload');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    setSaving(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/me/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });
      if (res.ok) {
        toast.success('Password updated successfully');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        const error = await res.json();
        toast.error(error.message || 'Password update failed');
      }
    } catch (error) {
      toast.error('Network error');
    } finally {
      setSaving(false);
    }
  };

  const handlePrefUpdate = async (key, value) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/me/preferences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ [key]: value })
      });
      if (res.ok) {
        setUserData({ ...userData, [key]: value });
        toast.success(`${key} updated`);
      }
    } catch (error) {
      toast.error('Failed to update preference');
    }
  };

  const handleNotifyUpdate = async (key, value) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/me/notifications`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ [key]: value })
      });
      if (res.ok) {
        setUserData({ ...userData, [key]: value });
        toast.success('Notification setting updated');
      }
    } catch (error) {
      toast.error('Failed to update notifications');
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-20">
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  const roleLabels = {
    admin: 'Super Admin',
    school_admin: 'School Admin',
    teacher: 'Teacher',
    parent: 'Parent',
    vendor: 'Vendor'
  };

  const getRoleIcon = (role) => {
    switch(role) {
        case 'teacher': return <Briefcase size={18} />;
        case 'parent': return <UsersIcon size={18} />;
        case 'vendor': return <ShoppingBag size={18} />;
        case 'school_admin': return <Shield size={18} />;
        default: return <User size={18} />;
    }
  };

  return (
    <div className="profile-container">
      {/* Sidebar */}
      <div className="profile-sidebar">
        <button 
          className={`profile-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <User size={18} /> My Profile
        </button>
        {userData?.role !== 'admin' && (
          <button 
            className={`profile-nav-item ${activeTab === 'role' ? 'active' : ''}`}
            onClick={() => setActiveTab('role')}
          >
            {getRoleIcon(userData?.role)} {roleLabels[userData?.role]} Details
          </button>
        )}
        <button 
          className={`profile-nav-item ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          <Shield size={18} /> Account & Security
        </button>
        <button 
          className={`profile-nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          <Bell size={18} /> Notifications
        </button>
        <button 
          className={`profile-nav-item ${activeTab === 'preferences' ? 'active' : ''}`}
          onClick={() => setActiveTab('preferences')}
        >
          <SettingsIcon size={18} /> Preferences
        </button>
      </div>

      {/* Main Content */}
      <div className="profile-content">
        {activeTab === 'profile' && (
          <div className="fade-in">
            <h2 className="profile-section-title">My Profile</h2>
            <p className="profile-section-subtitle">Manage your personal information and profile picture.</p>

            <div className="profile-avatar-wrapper">
              <div className="relative">
                {userData?.profilePhoto ? (
                  <img src={userData.profilePhoto} alt="Profile" className="profile-avatar-img" />
                ) : (
                  <div className="profile-avatar-placeholder">
                    <User size={40} />
                  </div>
                )}
                <label className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full text-white cursor-pointer shadow-lg hover:bg-blue-700 transition">
                  <Camera size={16} />
                  <input type="file" className="hidden" onChange={handlePhotoUpload} accept="image/*" />
                </label>
              </div>
              <div className="profile-avatar-actions">
                <span className="font-semibold text-lg">{userData?.firstName} {userData?.lastName}</span>
                <span className="text-gray-500 text-sm capitalize">{roleLabels[userData?.role]}</span>
                {userData?.profilePhoto && (
                  <button className="profile-btn-danger flex items-center gap-1 mt-1">
                    <Trash2 size={12} /> Remove photo
                  </button>
                )}
              </div>
            </div>

            <form onSubmit={handleUserUpdate}>
              <div className="profile-form-grid">
                <div className="profile-form-group">
                  <label className="profile-label">First Name</label>
                  <input 
                    className="profile-input" 
                    value={userData?.firstName || ''} 
                    onChange={e => setUserData({...userData, firstName: e.target.value})}
                  />
                </div>
                <div className="profile-form-group">
                  <label className="profile-label">Last Name</label>
                  <input 
                    className="profile-input" 
                    value={userData?.lastName || ''} 
                    onChange={e => setUserData({...userData, lastName: e.target.value})}
                  />
                </div>
                <div className="profile-form-group">
                  <label className="profile-label">Email Address</label>
                  <input className="profile-input" value={userData?.email || ''} disabled />
                </div>
                <div className="profile-form-group">
                  <label className="profile-label">Phone Number</label>
                  <input 
                    className="profile-input" 
                    value={userData?.phone || ''} 
                    onChange={e => setUserData({...userData, phone: e.target.value})}
                  />
                </div>
                <div className="profile-form-group">
                  <label className="profile-label">Date of Birth</label>
                  <input 
                    type="date" 
                    className="profile-input" 
                    value={userData?.dateOfBirth ? userData.dateOfBirth.split('T')[0] : ''} 
                    onChange={e => setUserData({...userData, dateOfBirth: e.target.value})}
                  />
                </div>
                <div className="profile-form-group">
                  <label className="profile-label">Gender</label>
                  <select 
                    className="profile-select" 
                    value={userData?.gender || ''} 
                    onChange={e => setUserData({...userData, gender: e.target.value})}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
                <div className="profile-form-group full-width">
                  <label className="profile-label">Address</label>
                  <input 
                    className="profile-input" 
                    value={userData?.address || ''} 
                    onChange={e => setUserData({...userData, address: e.target.value})}
                  />
                </div>
              </div>
              <button type="submit" className="profile-btn-primary" disabled={saving}>
                {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                Save Personal Changes
              </button>
            </form>
          </div>
        )}

        {activeTab === 'role' && (
          <div className="fade-in">
            <h2 className="profile-section-title">{roleLabels[userData?.role]} Details</h2>
            <p className="profile-section-subtitle">Specific information related to your {userData?.role} account.</p>

            <form onSubmit={handleExtendedUpdate}>
              <div className="profile-form-grid">
                {userData?.role === 'teacher' && (
                  <>
                    <div className="profile-form-group">
                      <label className="profile-label">Employee ID</label>
                      <input 
                        className="profile-input" 
                        value={extendedProfile?.employeeId || ''} 
                        onChange={e => setExtendedProfile({...extendedProfile, employeeId: e.target.value})}
                      />
                    </div>
                    <div className="profile-form-group">
                      <label className="profile-label">Designation</label>
                      <input 
                        className="profile-input" 
                        value={extendedProfile?.designation || ''} 
                        onChange={e => setExtendedProfile({...extendedProfile, designation: e.target.value})}
                      />
                    </div>
                    <div className="profile-form-group">
                      <label className="profile-label">Qualification</label>
                      <input 
                        className="profile-input" 
                        value={extendedProfile?.qualification || ''} 
                        onChange={e => setExtendedProfile({...extendedProfile, qualification: e.target.value})}
                      />
                    </div>
                    <div className="profile-form-group">
                      <label className="profile-label">Experience (Years)</label>
                      <input 
                        type="number"
                        className="profile-input" 
                        value={extendedProfile?.experience || 0} 
                        onChange={e => setExtendedProfile({...extendedProfile, experience: parseInt(e.target.value)})}
                      />
                    </div>
                    <div className="profile-form-group full-width">
                      <label className="profile-label">Bio / Professional Summary</label>
                      <textarea 
                        className="profile-input" 
                        rows={4}
                        value={extendedProfile?.bio || ''} 
                        onChange={e => setExtendedProfile({...extendedProfile, bio: e.target.value})}
                      />
                    </div>
                  </>
                )}

                {userData?.role === 'parent' && (
                  <>
                    <div className="profile-form-group">
                      <label className="profile-label">Occupation</label>
                      <input 
                        className="profile-input" 
                        value={extendedProfile?.occupation || ''} 
                        onChange={e => setExtendedProfile({...extendedProfile, occupation: e.target.value})}
                      />
                    </div>
                    <div className="profile-form-group">
                      <label className="profile-label">Relationship to Student</label>
                      <select 
                        className="profile-select" 
                        value={extendedProfile?.relationshipToStudent || ''} 
                        onChange={e => setExtendedProfile({...extendedProfile, relationshipToStudent: e.target.value})}
                      >
                        <option value="">Select Relationship</option>
                        <option value="Father">Father</option>
                        <option value="Mother">Mother</option>
                        <option value="Guardian">Guardian</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="profile-form-group full-width">
                      <label className="profile-label">Emergency Contact info</label>
                      <input 
                        className="profile-input" 
                        value={extendedProfile?.emergencyContact || ''} 
                        onChange={e => setExtendedProfile({...extendedProfile, emergencyContact: e.target.value})}
                      />
                    </div>
                  </>
                )}

                {userData?.role === 'vendor' && (
                  <>
                    <div className="profile-form-group">
                      <label className="profile-label">Business Name</label>
                      <input 
                        className="profile-input" 
                        value={extendedProfile?.businessName || ''} 
                        onChange={e => setExtendedProfile({...extendedProfile, businessName: e.target.value})}
                      />
                    </div>
                    <div className="profile-form-group">
                      <label className="profile-label">Category</label>
                      <input 
                        className="profile-input" 
                        value={extendedProfile?.category || ''} 
                        onChange={e => setExtendedProfile({...extendedProfile, category: e.target.value})}
                      />
                    </div>
                    <div className="profile-form-group">
                      <label className="profile-label">Tax ID / NTN</label>
                      <input 
                        className="profile-input" 
                        value={extendedProfile?.taxId || ''} 
                        onChange={e => setExtendedProfile({...extendedProfile, taxId: e.target.value})}
                      />
                    </div>
                    <div className="profile-form-group">
                      <label className="profile-label">Website</label>
                      <input 
                        className="profile-input" 
                        value={extendedProfile?.website || ''} 
                        onChange={e => setExtendedProfile({...extendedProfile, website: e.target.value})}
                      />
                    </div>
                    <div className="profile-form-group">
                      <label className="profile-label">Bank Name</label>
                      <input 
                        className="profile-input" 
                        value={extendedProfile?.bankName || ''} 
                        onChange={e => setExtendedProfile({...extendedProfile, bankName: e.target.value})}
                      />
                    </div>
                    <div className="profile-form-group">
                      <label className="profile-label">Account Number</label>
                      <input 
                        className="profile-input" 
                        value={extendedProfile?.bankAccount || ''} 
                        onChange={e => setExtendedProfile({...extendedProfile, bankAccount: e.target.value})}
                      />
                    </div>
                  </>
                )}
              </div>
              <button type="submit" className="profile-btn-primary" disabled={saving}>
                {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                Save Details
              </button>
            </form>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="fade-in">
            <h2 className="profile-section-title">Account & Security</h2>
            <p className="profile-section-subtitle">Manage your login credentials and security settings.</p>

            <div className="mb-8 p-6 bg-red-50 rounded-xl border border-red-100">
               <h3 className="text-red-800 font-semibold mb-2 flex items-center gap-2">
                 <Shield size={18} /> Security Alert
               </h3>
               <p className="text-red-600 text-sm">Changing your email or password will require you to log in again on all devices.</p>
            </div>

            <form onSubmit={handlePasswordUpdate}>
               <div className="profile-form-grid">
                  <div className="profile-form-group full-width">
                    <label className="profile-label">Current Password</label>
                    <input 
                      type="password" 
                      className="profile-input" 
                      value={passwordData.currentPassword}
                      onChange={e => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="profile-form-group">
                    <label className="profile-label">New Password</label>
                    <input 
                      type="password" 
                      className="profile-input" 
                      value={passwordData.newPassword}
                      onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})}
                      placeholder="Min 8 characters"
                    />
                  </div>
                  <div className="profile-form-group">
                    <label className="profile-label">Confirm New Password</label>
                    <input 
                      type="password" 
                      className="profile-input"
                      value={passwordData.confirmPassword}
                      onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      placeholder="Repeat new password"
                    />
                  </div>
               </div>
               <button type="submit" className="profile-btn-primary" disabled={saving}>
                 Update Security Credentials
               </button>
            </form>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="fade-in">
            <h2 className="profile-section-title">Notification Settings</h2>
            <p className="profile-section-subtitle">Control how and when you receive updates from the platform.</p>

            <div className="space-y-4">
               {[
                 { key: 'notifyEmail', label: 'Email Notifications', desc: 'Receive updates via your registered email address.' },
                 { key: 'notifySMS', label: 'SMS Notifications', desc: 'Get critical alerts via mobile message.' },
                 { key: 'notifyPush', label: 'Push Notifications', desc: 'Browser notifications for real-time updates.' },
                 { key: 'notifyMarketing', label: 'Marketing Communications', desc: 'Newsletter and platform feature updates.' },
                 { key: 'notifySecurity', label: 'Security Alerts', desc: 'Mandatory alerts about login activity and account changes.' }
               ].map((item) => (
                 <div key={item.key} className="notification-item">
                    <div className="notification-info">
                      <h4>{item.label}</h4>
                      <p>{item.desc}</p>
                    </div>
                    <div className="relative inline-block w-12 h-6">
                      <input 
                        type="checkbox" 
                        id={`toggle-${item.key}`}
                        className="sr-only"
                        checked={userData?.[item.key] || false}
                        onChange={e => handleNotifyUpdate(item.key, e.target.checked)}
                      />
                      <label 
                        htmlFor={`toggle-${item.key}`}
                        className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors ${userData?.[item.key] ? 'bg-blue-600' : 'bg-gray-300'}`}
                      >
                         <span className={`block w-4 h-4 mt-1 ml-1 bg-white rounded-full transition-transform ${userData?.[item.key] ? 'translate-x-6' : ''}`}></span>
                      </label>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}

        {activeTab === 'preferences' && (
          <div className="fade-in">
            <h2 className="profile-section-title">Personal Preferences</h2>
            <p className="profile-section-subtitle">Customize your platform experience.</p>

            <div className="profile-form-grid">
               <div className="profile-form-group">
                 <label className="profile-label">Display Language</label>
                 <select 
                   className="profile-select" 
                   value={userData?.language || 'English'}
                   onChange={e => handlePrefUpdate('language', e.target.value)}
                 >
                   <option>English</option>
                   <option>Urdu</option>
                   <option>Arabic</option>
                 </select>
               </div>
               <div className="profile-form-group">
                 <label className="profile-label">Timezone</label>
                 <select 
                   className="profile-select"
                   value={userData?.timezone || 'PKT (UTC+5)'}
                   onChange={e => handlePrefUpdate('timezone', e.target.value)}
                 >
                   <option>PKT (UTC+5)</option>
                   <option>GMT (UTC+0)</option>
                   <option>EST (UTC-5)</option>
                   <option>PST (UTC-8)</option>
                 </select>
               </div>
               <div className="profile-form-group">
                 <label className="profile-label">Appearance Theme</label>
                 <div className="flex gap-4 mt-2">
                    {['light', 'dark', 'system'].map((t) => (
                      <button 
                        key={t}
                        onClick={() => handlePrefUpdate('theme', t)}
                        className={`px-4 py-2 rounded-lg border capitalize transition ${userData?.theme === t ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200'}`}
                      >
                        {t}
                      </button>
                    ))}
                 </div>
               </div>
            </div>
            
            <div className="profile-summary-card">
               <div className="flex items-center gap-3 text-blue-800">
                  <Globe size={20} />
                  <span className="font-semibold text-sm">Active Session Info</span>
               </div>
               <div className="grid grid-cols-2 gap-4 mt-4 text-sm text-gray-600">
                  <div>Last login: {userData?.lastLogin ? new Date(userData.lastLogin).toLocaleString() : 'Just now'}</div>
                  <div>Account status: <span className="text-green-600 font-bold">Active</span></div>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnifiedProfileView;
