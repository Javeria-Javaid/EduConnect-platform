import React, { useState } from 'react';
import { User, Lock, Shield, Smartphone, Save } from 'lucide-react';

const AccountSettings = () => {
    const [profile, setProfile] = useState({
        name: 'Admin User',
        email: 'admin@school.edu',
        phone: '+1 234 567 890',
        role: 'Super Admin'
    });

    const [security, setSecurity] = useState({
        mfa: true,
        loginAlerts: false
    });

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold text-[var(--text-primary)]">Account Settings</h2>
                <p className="text-sm text-[var(--text-secondary)] mt-1">Manage your personal profile and security preferences.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-[var(--border-radius-base)] shadow-sm border border-gray-200">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 bg-[var(--primary-color)] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                {profile.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-[var(--text-primary)]">{profile.name}</h3>
                                <span className="px-2 py-0.5 bg-blue-50 text-[var(--primary-color)] text-xs font-medium rounded-full border border-blue-100">
                                    {profile.role}
                                </span>
                            </div>
                        </div>

                        <form className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={profile.name}
                                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-[var(--border-radius-base)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        value={profile.email}
                                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-[var(--border-radius-base)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Phone Number</label>
                                    <input
                                        type="text"
                                        value={profile.phone}
                                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-[var(--border-radius-base)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                                    />
                                </div>
                            </div>
                            <div className="pt-4">
                                <button type="button" className="flex items-center gap-2 px-4 py-2 bg-[var(--primary-color)] text-white rounded-[var(--border-radius-base)] text-sm font-semibold hover:opacity-90 transition-all shadow-sm">
                                    <Save size={16} />
                                    Update Profile
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Login History */}
                    <div className="bg-white p-6 rounded-[var(--border-radius-base)] shadow-sm border border-gray-200">
                        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">Recent Login Activity</h3>
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-[var(--surface-muted)] rounded-[var(--border-radius-base)] border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <Smartphone size={18} className="text-[var(--text-secondary)]" />
                                        <div>
                                            <p className="text-sm font-medium text-[var(--text-primary)]">Windows PC - Chrome</p>
                                            <p className="text-xs text-[var(--text-secondary)]">New York, USA • Just now</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-md">Active</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Security Settings */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-[var(--border-radius-base)] shadow-sm border border-gray-200">
                        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                            <Lock size={18} className="text-[var(--primary-color)]" />
                            Security
                        </h3>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                                <div>
                                    <p className="text-sm font-medium text-[var(--text-primary)]">Two-Factor Auth</p>
                                    <p className="text-xs text-[var(--text-secondary)]">Add an extra layer of security</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={security.mfa}
                                        onChange={() => setSecurity({ ...security, mfa: !security.mfa })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary-color)]"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                                <div>
                                    <p className="text-sm font-medium text-[var(--text-primary)]">Login Alerts</p>
                                    <p className="text-xs text-[var(--text-secondary)]">Notify me of new logins</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={security.loginAlerts}
                                        onChange={() => setSecurity({ ...security, loginAlerts: !security.loginAlerts })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary-color)]"></div>
                                </label>
                            </div>

                            <div className="pt-2">
                                <button className="w-full px-4 py-2 border border-gray-300 text-[var(--text-primary)] rounded-[var(--border-radius-base)] text-sm font-medium hover:bg-gray-50 transition-colors">
                                    Change Password
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountSettings;
