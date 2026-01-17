import React from 'react';
import { Shield, Key, Database, Activity } from 'lucide-react';

const SecurityPrivacy = () => {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold text-[var(--text-primary)]">Security & Privacy</h2>
                <p className="text-sm text-[var(--text-secondary)] mt-1">Configure security protocols and data retention policies.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Password Policy */}
                <div className="bg-white p-6 rounded-[var(--border-radius-base)] shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                        <Key size={18} className="text-[var(--primary-color)]" />
                        Password Policy
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-[var(--text-primary)]">Minimum Length</span>
                            <select className="px-2 py-1 border border-gray-300 rounded-[var(--border-radius-base)] text-sm bg-white">
                                <option>8 Characters</option>
                                <option>10 Characters</option>
                                <option>12 Characters</option>
                            </select>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-[var(--text-primary)]">Require Special Character</span>
                            <input type="checkbox" defaultChecked className="w-4 h-4 text-[var(--primary-color)] rounded" />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-[var(--text-primary)]">Require Number</span>
                            <input type="checkbox" defaultChecked className="w-4 h-4 text-[var(--primary-color)] rounded" />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-[var(--text-primary)]">Password Expiry</span>
                            <select className="px-2 py-1 border border-gray-300 rounded-[var(--border-radius-base)] text-sm bg-white">
                                <option>Never</option>
                                <option>Every 30 Days</option>
                                <option>Every 90 Days</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Data Backup */}
                <div className="bg-white p-6 rounded-[var(--border-radius-base)] shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                        <Database size={18} className="text-[var(--primary-color)]" />
                        Data Backup
                    </h3>
                    <div className="space-y-4">
                        <div className="p-4 bg-green-50 border border-green-100 rounded-[var(--border-radius-base)]">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-bold text-green-800">Last Backup</span>
                                <span className="text-xs text-green-600">2 hours ago</span>
                            </div>
                            <div className="w-full bg-green-200 rounded-full h-1.5">
                                <div className="bg-green-600 h-1.5 rounded-full" style={{ width: '100%' }}></div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-[var(--text-primary)]">Auto-Backup Frequency</span>
                            <select className="px-2 py-1 border border-gray-300 rounded-[var(--border-radius-base)] text-sm bg-white">
                                <option>Daily</option>
                                <option>Weekly</option>
                                <option>Monthly</option>
                            </select>
                        </div>
                        <button className="w-full py-2 border border-[var(--primary-color)] text-[var(--primary-color)] rounded-[var(--border-radius-base)] text-sm font-medium hover:bg-blue-50 transition-colors">
                            Trigger Manual Backup
                        </button>
                    </div>
                </div>

                {/* Session Management */}
                <div className="lg:col-span-2 bg-white p-6 rounded-[var(--border-radius-base)] shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                        <Activity size={18} className="text-[var(--primary-color)]" />
                        Active Sessions
                    </h3>
                    <div className="space-y-3">
                        {[
                            { device: 'MacBook Pro', location: 'New York, USA', ip: '192.168.1.1', status: 'Current' },
                            { device: 'iPhone 13', location: 'New York, USA', ip: '192.168.1.5', status: 'Active' },
                        ].map((session, i) => (
                            <div key={i} className="flex items-center justify-between p-3 border border-gray-100 rounded-[var(--border-radius-base)]">
                                <div>
                                    <p className="text-sm font-medium text-[var(--text-primary)]">{session.device}</p>
                                    <p className="text-xs text-[var(--text-secondary)]">{session.location} • {session.ip}</p>
                                </div>
                                {session.status === 'Current' ? (
                                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">Current Session</span>
                                ) : (
                                    <button className="text-xs text-red-600 hover:underline">Revoke</button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SecurityPrivacy;
