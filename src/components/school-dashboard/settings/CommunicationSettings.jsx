import React, { useState } from 'react';
import { Mail, MessageSquare, Bell, Save } from 'lucide-react';

const CommunicationSettings = () => {
    const [notifications, setNotifications] = useState({
        email: true,
        sms: true,
        whatsapp: false,
        feeReminders: true,
        attendanceAlerts: true,
        examResults: true
    });

    const toggle = (key) => setNotifications(prev => ({ ...prev, [key]: !prev[key] }));

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold text-[var(--text-primary)]">Communication Settings</h2>
                <p className="text-sm text-[var(--text-secondary)] mt-1">Manage templates, notifications, and alerts.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Notification Channels */}
                <div className="bg-white p-6 rounded-[var(--border-radius-base)] shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                        <Bell size={18} className="text-[var(--primary-color)]" />
                        Notification Channels
                    </h3>
                    <div className="space-y-4">
                        {[
                            { key: 'email', label: 'Email Notifications', icon: Mail },
                            { key: 'sms', label: 'SMS Alerts', icon: MessageSquare },
                            { key: 'whatsapp', label: 'WhatsApp Integration', icon: MessageSquare },
                        ].map((item) => (
                            <div key={item.key} className="flex items-center justify-between pb-3 border-b border-gray-100 last:border-0">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gray-50 text-gray-600 rounded-lg">
                                        <item.icon size={18} />
                                    </div>
                                    <span className="text-sm font-medium text-[var(--text-primary)]">{item.label}</span>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={notifications[item.key]}
                                        onChange={() => toggle(item.key)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary-color)]"></div>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Automated Alerts */}
                <div className="bg-white p-6 rounded-[var(--border-radius-base)] shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">Automated Alerts</h3>
                    <div className="space-y-4">
                        {[
                            { key: 'feeReminders', label: 'Fee Payment Reminders', desc: 'Send alerts 3 days before due date' },
                            { key: 'attendanceAlerts', label: 'Absentee Alerts', desc: 'Notify parents if student is absent' },
                            { key: 'examResults', label: 'Result Declarations', desc: 'Auto-send report cards on release' },
                        ].map((item) => (
                            <div key={item.key} className="flex items-center justify-between pb-3 border-b border-gray-100 last:border-0">
                                <div>
                                    <p className="text-sm font-medium text-[var(--text-primary)]">{item.label}</p>
                                    <p className="text-xs text-[var(--text-secondary)]">{item.desc}</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={notifications[item.key]}
                                        onChange={() => toggle(item.key)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary-color)]"></div>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Templates Section */}
                <div className="lg:col-span-2 bg-white p-6 rounded-[var(--border-radius-base)] shadow-sm border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-[var(--text-primary)]">Message Templates</h3>
                        <button className="text-sm text-[var(--primary-color)] font-medium hover:underline">View All Templates</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {['Welcome Email', 'Fee Invoice', 'Event Invitation'].map((template) => (
                            <div key={template} className="p-4 border border-gray-200 rounded-[var(--border-radius-base)] hover:border-[var(--primary-color)] cursor-pointer transition-colors group">
                                <div className="flex items-center justify-between mb-2">
                                    <Mail size={18} className="text-gray-400 group-hover:text-[var(--primary-color)]" />
                                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">HTML</span>
                                </div>
                                <p className="font-medium text-[var(--text-primary)]">{template}</p>
                                <p className="text-xs text-[var(--text-secondary)] mt-1">Last edited: 2 days ago</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommunicationSettings;
